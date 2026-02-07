-- ============================================
-- CRÉDITS V2 : Fonctions RPC
-- ============================================

-- 1. FONCTION ACHAT RESSOURCE V2 (FIFO: free first, then paid)
-- ============================================
CREATE OR REPLACE FUNCTION purchase_ressource_v2(
  p_buyer_id UUID,
  p_ressource_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price INTEGER;
  v_creator_id UUID;
  v_buyer_free INTEGER;
  v_buyer_paid INTEGER;
  v_purchase_id UUID;
  v_free_to_spend INTEGER;
  v_paid_to_spend INTEGER;
  v_paid_value_cents INTEGER := 0;
  v_creator_earning INTEGER;
  v_unit RECORD;
  v_remaining_paid INTEGER;
  v_consumed INTEGER;
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

  -- Récupérer les balances
  SELECT free_credits_balance, paid_credits_balance INTO v_buyer_free, v_buyer_paid
  FROM profiles
  WHERE id = p_buyer_id
  FOR UPDATE; -- Lock row

  IF (COALESCE(v_buyer_free, 0) + COALESCE(v_buyer_paid, 0)) < v_price THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Crédits insuffisants',
      'needed', v_price,
      'balance', COALESCE(v_buyer_free, 0) + COALESCE(v_buyer_paid, 0)
    );
  END IF;

  -- Calculer répartition FIFO (free first)
  v_free_to_spend := LEAST(COALESCE(v_buyer_free, 0), v_price);
  v_paid_to_spend := v_price - v_free_to_spend;

  -- Calculer valeur EUR des crédits payants (FIFO par date acquisition)
  IF v_paid_to_spend > 0 THEN
    v_remaining_paid := v_paid_to_spend;

    FOR v_unit IN
      SELECT id, quantity, unit_value_cents
      FROM credit_units
      WHERE user_id = p_buyer_id AND credit_type = 'paid' AND quantity > 0
      ORDER BY acquired_at ASC
    LOOP
      EXIT WHEN v_remaining_paid <= 0;

      v_consumed := LEAST(v_unit.quantity, v_remaining_paid);
      v_paid_value_cents := v_paid_value_cents + (v_consumed * v_unit.unit_value_cents);
      v_remaining_paid := v_remaining_paid - v_consumed;

      -- Décrémenter ou supprimer l'unité
      IF v_consumed >= v_unit.quantity THEN
        DELETE FROM credit_units WHERE id = v_unit.id;
      ELSE
        UPDATE credit_units SET quantity = quantity - v_consumed WHERE id = v_unit.id;
      END IF;
    END LOOP;
  END IF;

  -- Déduire des crédits gratuits (FIFO également)
  IF v_free_to_spend > 0 THEN
    v_remaining_paid := v_free_to_spend;

    FOR v_unit IN
      SELECT id, quantity
      FROM credit_units
      WHERE user_id = p_buyer_id AND credit_type = 'free' AND quantity > 0
      ORDER BY acquired_at ASC
    LOOP
      EXIT WHEN v_remaining_paid <= 0;

      v_consumed := LEAST(v_unit.quantity, v_remaining_paid);
      v_remaining_paid := v_remaining_paid - v_consumed;

      IF v_consumed >= v_unit.quantity THEN
        DELETE FROM credit_units WHERE id = v_unit.id;
      ELSE
        UPDATE credit_units SET quantity = quantity - v_consumed WHERE id = v_unit.id;
      END IF;
    END LOOP;
  END IF;

  -- Calculer rémunération créateur (90% de la valeur EUR des payants)
  v_creator_earning := FLOOR(v_paid_value_cents * 0.9);

  -- Créer l'achat
  INSERT INTO purchases (
    buyer_id, ressource_id, credits_spent,
    free_credits_spent, paid_credits_spent,
    paid_value_eur_cents, creator_earning_eur_cents
  )
  VALUES (
    p_buyer_id, p_ressource_id, v_price,
    v_free_to_spend, v_paid_to_spend,
    v_paid_value_cents, v_creator_earning
  )
  RETURNING id INTO v_purchase_id;

  -- Débiter l'acheteur
  UPDATE profiles
  SET free_credits_balance = free_credits_balance - v_free_to_spend,
      paid_credits_balance = paid_credits_balance - v_paid_to_spend,
      updated_at = NOW()
  WHERE id = p_buyer_id;

  -- Enregistrer la transaction de débit
  INSERT INTO credits_transactions (
    user_id, type, credits_amount, credit_type,
    free_amount, paid_amount, unit_value_cents,
    related_purchase_id, related_ressource_id, description
  )
  VALUES (
    p_buyer_id, 'spent', -v_price,
    CASE
      WHEN v_free_to_spend > 0 AND v_paid_to_spend > 0 THEN 'mixed'
      WHEN v_free_to_spend > 0 THEN 'free'
      ELSE 'paid'
    END,
    -v_free_to_spend, -v_paid_to_spend, v_paid_value_cents,
    v_purchase_id, p_ressource_id, 'Achat ressource'
  );

  -- Créditer le créateur (uniquement sur les crédits payants)
  IF v_creator_id IS NOT NULL AND v_creator_earning > 0 THEN
    -- Note: Les gains créateurs sont en centimes EUR, pas en crédits
    -- Mettre à jour les stats du créateur
    UPDATE creators
    SET total_sales_credits = total_sales_credits + v_price,
        total_earnings_cents = total_earnings_cents + v_creator_earning
    WHERE user_id = v_creator_id;

    -- Enregistrer la transaction de gain (en centimes)
    INSERT INTO credits_transactions (
      user_id, type, credits_amount, credit_type, unit_value_cents,
      related_purchase_id, related_ressource_id, description
    )
    VALUES (
      v_creator_id, 'sale_earning', 0, 'paid', v_creator_earning,
      v_purchase_id, p_ressource_id,
      'Vente ressource (' || v_paid_to_spend || ' crédits payants = ' || (v_paid_value_cents / 100.0) || '€)'
    );
  END IF;

  -- Mettre à jour le compteur d'achats de la ressource
  UPDATE ressources
  SET purchases_count = COALESCE(purchases_count, 0) + 1
  WHERE id = p_ressource_id;

  RETURN json_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'credits_spent', v_price,
    'free_spent', v_free_to_spend,
    'paid_spent', v_paid_to_spend,
    'paid_value_cents', v_paid_value_cents,
    'creator_earning_cents', v_creator_earning,
    'new_free_balance', COALESCE(v_buyer_free, 0) - v_free_to_spend,
    'new_paid_balance', COALESCE(v_buyer_paid, 0) - v_paid_to_spend
  );
END;
$$;

-- 2. FONCTION APPLIQUER CODE PROMO
-- ============================================
CREATE OR REPLACE FUNCTION apply_promo_code(
  p_user_id UUID,
  p_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo RECORD;
  v_usage_count INTEGER;
BEGIN
  -- Récupérer le code promo
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE UPPER(code) = UPPER(p_code)
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses);

  IF v_promo IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Code invalide ou expiré');
  END IF;

  -- Vérifier si l'utilisateur a déjà utilisé ce code
  SELECT COUNT(*) INTO v_usage_count
  FROM promo_code_redemptions
  WHERE promo_code_id = v_promo.id AND user_id = p_user_id;

  IF v_usage_count > 0 AND NOT v_promo.allow_multiple_per_user THEN
    RETURN json_build_object('success', false, 'error', 'Vous avez déjà utilisé ce code');
  END IF;

  -- Ajouter les crédits gratuits
  UPDATE profiles
  SET free_credits_balance = COALESCE(free_credits_balance, 0) + v_promo.free_credits,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Créer l'unité de crédit
  INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source, source_ref)
  VALUES (p_user_id, 'free', v_promo.free_credits, 0, 'promo_code', v_promo.id::TEXT);

  -- Enregistrer l'utilisation
  INSERT INTO promo_code_redemptions (promo_code_id, user_id, credits_granted)
  VALUES (v_promo.id, p_user_id, v_promo.free_credits);

  -- Incrémenter le compteur d'utilisations
  UPDATE promo_codes
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = v_promo.id;

  -- Logger la transaction
  INSERT INTO credits_transactions (
    user_id, type, credits_amount, credit_type, promo_code_id, description
  )
  VALUES (
    p_user_id, 'promo_code', v_promo.free_credits, 'free', v_promo.id,
    'Code promo: ' || UPPER(p_code)
  );

  RETURN json_build_object(
    'success', true,
    'credits_added', v_promo.free_credits,
    'code', UPPER(p_code)
  );
END;
$$;

-- 3. FONCTION ATTRIBUTION ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION admin_grant_credits(
  p_admin_id UUID,
  p_user_id UUID,
  p_free_credits INTEGER DEFAULT 0,
  p_paid_credits INTEGER DEFAULT 0,
  p_unit_value_cents INTEGER DEFAULT 0,
  p_reason TEXT DEFAULT 'admin_grant'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  -- Vérifier que l'appelant est admin
  SELECT role INTO v_admin_role FROM profiles WHERE id = p_admin_id;

  IF v_admin_role != 'admin' THEN
    RETURN json_build_object('success', false, 'error', 'Non autorisé');
  END IF;

  -- Vérifier que l'utilisateur cible existe
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Utilisateur non trouvé');
  END IF;

  -- Ajouter les crédits gratuits
  IF p_free_credits > 0 THEN
    UPDATE profiles
    SET free_credits_balance = COALESCE(free_credits_balance, 0) + p_free_credits,
        updated_at = NOW()
    WHERE id = p_user_id;

    INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source, source_ref)
    VALUES (p_user_id, 'free', p_free_credits, 0, 'admin_grant', p_admin_id::TEXT);

    INSERT INTO credits_transactions (user_id, type, credits_amount, credit_type, description)
    VALUES (p_user_id, 'admin_grant', p_free_credits, 'free', p_reason);
  END IF;

  -- Ajouter les crédits payants
  IF p_paid_credits > 0 THEN
    UPDATE profiles
    SET paid_credits_balance = COALESCE(paid_credits_balance, 0) + p_paid_credits,
        updated_at = NOW()
    WHERE id = p_user_id;

    INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source, source_ref)
    VALUES (p_user_id, 'paid', p_paid_credits, p_unit_value_cents, 'admin_grant', p_admin_id::TEXT);

    INSERT INTO credits_transactions (
      user_id, type, credits_amount, credit_type, unit_value_cents, description
    )
    VALUES (p_user_id, 'admin_grant', p_paid_credits, 'paid', p_unit_value_cents, p_reason);
  END IF;

  RETURN json_build_object(
    'success', true,
    'free_credits_added', p_free_credits,
    'paid_credits_added', p_paid_credits,
    'user_id', p_user_id
  );
END;
$$;

-- 4. FONCTION BONUS INSCRIPTION
-- ============================================
CREATE OR REPLACE FUNCTION grant_registration_bonus(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config JSONB;
  v_enabled BOOLEAN;
  v_credits INTEGER;
BEGIN
  -- Récupérer la config
  SELECT value INTO v_config FROM app_config WHERE key = 'registration_bonus';

  IF v_config IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Config non trouvée');
  END IF;

  v_enabled := (v_config->>'enabled')::BOOLEAN;
  v_credits := (v_config->>'free_credits')::INTEGER;

  IF NOT v_enabled OR v_credits <= 0 THEN
    RETURN json_build_object('success', true, 'credits_added', 0, 'reason', 'disabled');
  END IF;

  -- Vérifier si l'utilisateur a déjà reçu le bonus (éviter doublons)
  IF EXISTS (
    SELECT 1 FROM credits_transactions
    WHERE user_id = p_user_id AND type = 'registration_bonus'
  ) THEN
    RETURN json_build_object('success', true, 'credits_added', 0, 'reason', 'already_granted');
  END IF;

  -- Ajouter les crédits gratuits
  UPDATE profiles
  SET free_credits_balance = COALESCE(free_credits_balance, 0) + v_credits,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Créer l'unité de crédit
  INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source)
  VALUES (p_user_id, 'free', v_credits, 0, 'registration');

  -- Logger la transaction
  INSERT INTO credits_transactions (user_id, type, credits_amount, credit_type, description)
  VALUES (p_user_id, 'registration_bonus', v_credits, 'free', 'Bonus de bienvenue');

  RETURN json_build_object(
    'success', true,
    'credits_added', v_credits
  );
END;
$$;

-- 5. FONCTION AJOUTER CRÉDITS STRIPE (avec bonus)
-- ============================================
CREATE OR REPLACE FUNCTION add_stripe_credits(
  p_user_id UUID,
  p_pack_id TEXT,
  p_credits INTEGER,
  p_price_cents INTEGER,
  p_stripe_payment_intent_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit_value_cents INTEGER;
  v_bonus RECORD;
BEGIN
  -- Calculer la valeur unitaire
  v_unit_value_cents := FLOOR(p_price_cents::NUMERIC / p_credits);

  -- Ajouter les crédits payants
  UPDATE profiles
  SET paid_credits_balance = COALESCE(paid_credits_balance, 0) + p_credits,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Créer l'unité de crédit
  INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source, source_ref)
  VALUES (p_user_id, 'paid', p_credits, v_unit_value_cents, 'stripe_pack', p_pack_id);

  -- Logger la transaction
  INSERT INTO credits_transactions (
    user_id, type, credits_amount, credit_type, unit_value_cents,
    stripe_payment_intent_id, price_eur_cents, description
  )
  VALUES (
    p_user_id, 'purchase', p_credits, 'paid', v_unit_value_cents,
    p_stripe_payment_intent_id, p_price_cents, 'Achat ' || p_pack_id
  );

  -- Vérifier s'il y a un bonus
  SELECT * INTO v_bonus
  FROM purchase_bonuses
  WHERE pack_id = p_pack_id AND is_active = TRUE AND bonus_free_credits > 0;

  IF v_bonus IS NOT NULL THEN
    -- Ajouter le bonus gratuit
    UPDATE profiles
    SET free_credits_balance = COALESCE(free_credits_balance, 0) + v_bonus.bonus_free_credits,
        updated_at = NOW()
    WHERE id = p_user_id;

    INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source, source_ref)
    VALUES (p_user_id, 'free', v_bonus.bonus_free_credits, 0, 'purchase_bonus', p_pack_id);

    INSERT INTO credits_transactions (user_id, type, credits_amount, credit_type, description)
    VALUES (p_user_id, 'purchase_bonus', v_bonus.bonus_free_credits, 'free', 'Bonus achat ' || p_pack_id);

    RETURN json_build_object(
      'success', true,
      'paid_credits_added', p_credits,
      'bonus_credits_added', v_bonus.bonus_free_credits,
      'unit_value_cents', v_unit_value_cents
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'paid_credits_added', p_credits,
    'bonus_credits_added', 0,
    'unit_value_cents', v_unit_value_cents
  );
END;
$$;

-- 6. FONCTION GET CREDIT BREAKDOWN
-- ============================================
CREATE OR REPLACE FUNCTION get_credit_breakdown(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_free INTEGER;
  v_paid INTEGER;
  v_total_value INTEGER;
  v_avg_value NUMERIC;
BEGIN
  SELECT
    COALESCE(free_credits_balance, 0),
    COALESCE(paid_credits_balance, 0)
  INTO v_free, v_paid
  FROM profiles
  WHERE id = p_user_id;

  -- Calculer valeur totale et moyenne des crédits payants
  SELECT
    COALESCE(SUM(quantity * unit_value_cents), 0),
    CASE
      WHEN SUM(quantity) > 0 THEN SUM(quantity * unit_value_cents)::NUMERIC / SUM(quantity)
      ELSE 0
    END
  INTO v_total_value, v_avg_value
  FROM credit_units
  WHERE user_id = p_user_id AND credit_type = 'paid' AND quantity > 0;

  RETURN json_build_object(
    'free_balance', v_free,
    'paid_balance', v_paid,
    'total_balance', v_free + v_paid,
    'paid_total_value_cents', v_total_value,
    'paid_avg_unit_value_cents', ROUND(v_avg_value, 2)
  );
END;
$$;

-- 7. REMPLACER L'ANCIENNE FONCTION PURCHASE
-- ============================================
-- On garde l'ancienne pour rétrocompatibilité mais elle appelle la v2
CREATE OR REPLACE FUNCTION purchase_ressource(
  p_buyer_id UUID,
  p_ressource_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN purchase_ressource_v2(p_buyer_id, p_ressource_id);
END;
$$;

-- ============================================
-- FIN MIGRATION 011 - Fonctions Crédits V2
-- ============================================
