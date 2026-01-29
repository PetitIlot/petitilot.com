-- ============================================
-- SPRINT 3 : Système d'achat et crédits
-- ============================================

-- 1. TABLE PURCHASES (Achats de ressources)
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  credits_spent INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte : un utilisateur ne peut acheter qu'une fois la même ressource
  CONSTRAINT purchases_unique UNIQUE (buyer_id, ressource_id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_ressource ON purchases(ressource_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchased_at DESC);

-- 2. TABLE CREDITS_TRANSACTIONS (Historique des crédits)
-- ============================================
CREATE TABLE IF NOT EXISTS credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'spent', 'refund', 'bonus', 'sale_earning')),
  credits_amount INTEGER NOT NULL, -- positif = crédit, négatif = débit

  -- Références optionnelles
  related_purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  related_ressource_id UUID REFERENCES ressources(id) ON DELETE SET NULL,

  -- Paiement Stripe (pour achats de crédits)
  stripe_payment_intent_id TEXT,
  price_eur_cents INTEGER, -- prix en centimes

  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_user ON credits_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_type ON credits_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credits_date ON credits_transactions(created_at DESC);

-- 3. RLS POLICIES
-- ============================================
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_transactions ENABLE ROW LEVEL SECURITY;

-- PURCHASES
DROP POLICY IF EXISTS "purchases_select_own" ON purchases;
DROP POLICY IF EXISTS "purchases_insert_own" ON purchases;
DROP POLICY IF EXISTS "purchases_admin_all" ON purchases;

CREATE POLICY "purchases_select_own" ON purchases
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "purchases_insert_own" ON purchases
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "purchases_admin_all" ON purchases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- CREDITS_TRANSACTIONS
DROP POLICY IF EXISTS "credits_select_own" ON credits_transactions;
DROP POLICY IF EXISTS "credits_admin_all" ON credits_transactions;

CREATE POLICY "credits_select_own" ON credits_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "credits_admin_all" ON credits_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 4. FONCTION D'ACHAT DE RESSOURCE
-- ============================================
CREATE OR REPLACE FUNCTION purchase_ressource(
  p_buyer_id UUID,
  p_ressource_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_price INTEGER;
  v_creator_id UUID;
  v_buyer_credits INTEGER;
  v_purchase_id UUID;
  v_creator_earning INTEGER;
BEGIN
  -- Vérifier que la ressource existe et est publiée
  SELECT price_credits, creator_id INTO v_price, v_creator_id
  FROM ressources
  WHERE id = p_ressource_id AND status = 'published';

  IF v_price IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Ressource non disponible');
  END IF;

  -- Vérifier que l'acheteur n'est pas le créateur
  IF v_creator_id = p_buyer_id THEN
    RETURN json_build_object('success', false, 'error', 'Vous ne pouvez pas acheter votre propre ressource');
  END IF;

  -- Vérifier que l'acheteur n'a pas déjà acheté
  IF EXISTS (SELECT 1 FROM purchases WHERE buyer_id = p_buyer_id AND ressource_id = p_ressource_id) THEN
    RETURN json_build_object('success', false, 'error', 'Ressource déjà achetée');
  END IF;

  -- Vérifier le solde de crédits
  SELECT credits_balance INTO v_buyer_credits
  FROM profiles
  WHERE id = p_buyer_id;

  IF v_buyer_credits < v_price THEN
    RETURN json_build_object('success', false, 'error', 'Crédits insuffisants', 'needed', v_price, 'balance', v_buyer_credits);
  END IF;

  -- Créer l'achat
  INSERT INTO purchases (buyer_id, ressource_id, credits_spent)
  VALUES (p_buyer_id, p_ressource_id, v_price)
  RETURNING id INTO v_purchase_id;

  -- Débiter l'acheteur
  UPDATE profiles
  SET credits_balance = credits_balance - v_price, updated_at = NOW()
  WHERE id = p_buyer_id;

  -- Enregistrer la transaction de débit
  INSERT INTO credits_transactions (user_id, type, credits_amount, related_purchase_id, related_ressource_id, description)
  VALUES (p_buyer_id, 'spent', -v_price, v_purchase_id, p_ressource_id, 'Achat ressource');

  -- Créditer le créateur (90% par défaut)
  IF v_creator_id IS NOT NULL THEN
    v_creator_earning := FLOOR(v_price * 0.9);

    UPDATE profiles
    SET credits_balance = credits_balance + v_creator_earning, updated_at = NOW()
    WHERE id = v_creator_id;

    -- Enregistrer la transaction de gain
    INSERT INTO credits_transactions (user_id, type, credits_amount, related_purchase_id, related_ressource_id, description)
    VALUES (v_creator_id, 'sale_earning', v_creator_earning, v_purchase_id, p_ressource_id, 'Vente ressource');

    -- Mettre à jour les stats du créateur
    UPDATE creators
    SET total_sales_credits = total_sales_credits + v_price,
        total_earnings_cents = total_earnings_cents + (v_creator_earning * 100)
    WHERE id = v_creator_id;
  END IF;

  -- Mettre à jour le compteur d'achats de la ressource
  UPDATE ressources
  SET purchases_count = COALESCE(purchases_count, 0) + 1
  WHERE id = p_ressource_id;

  RETURN json_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'credits_spent', v_price,
    'new_balance', v_buyer_credits - v_price
  );
END;
$$;

-- 5. FONCTION POUR VÉRIFIER SI UNE RESSOURCE EST ACHETÉE
-- ============================================
CREATE OR REPLACE FUNCTION has_purchased_ressource(
  p_user_id UUID,
  p_ressource_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases
    WHERE buyer_id = p_user_id AND ressource_id = p_ressource_id
  );
END;
$$;

-- 6. FONCTION POUR OBTENIR LES ACHATS D'UN UTILISATEUR
-- ============================================
CREATE OR REPLACE FUNCTION get_user_purchases(p_user_id UUID)
RETURNS TABLE (
  purchase_id UUID,
  ressource_id UUID,
  ressource_title TEXT,
  ressource_type TEXT,
  ressource_vignette TEXT,
  ressource_pdf TEXT,
  credits_spent INTEGER,
  purchased_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.ressource_id,
    r.title,
    r.type,
    r.vignette_url,
    r.pdf_url,
    p.credits_spent,
    p.purchased_at
  FROM purchases p
  JOIN ressources r ON p.ressource_id = r.id
  WHERE p.buyer_id = p_user_id
  ORDER BY p.purchased_at DESC;
END;
$$;

-- ============================================
-- FIN SPRINT 3 - Tables et fonctions d'achat
-- ============================================
