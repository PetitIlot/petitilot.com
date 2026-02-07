-- ============================================
-- MIGRATION 009: Fix Function Search Path Security
-- ============================================
-- All SECURITY DEFINER functions need a fixed search_path to prevent
-- search path hijacking attacks. Setting search_path = '' forces
-- fully qualified names (schema.table) which is most secure.
-- ============================================

-- ============================================
-- 1. handle_new_user (trigger function)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, lang)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'lang', 'fr')
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- 2. increment_credits
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE new_balance INTEGER;
BEGIN
  UPDATE public.profiles
  SET credits_balance = credits_balance + amount, updated_at = NOW()
  WHERE id = user_id
  RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

-- ============================================
-- 3. decrement_credits
-- ============================================
CREATE OR REPLACE FUNCTION public.decrement_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  SELECT credits_balance INTO current_balance
  FROM public.profiles
  WHERE id = user_id;

  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  UPDATE public.profiles
  SET credits_balance = credits_balance - amount, updated_at = NOW()
  WHERE id = user_id
  RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

-- ============================================
-- 4. get_user_role
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM public.profiles WHERE id = user_id),
    'buyer'
  );
END;
$$;

-- ============================================
-- 5. update_updated_at (trigger function)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- 6. on_creator_approved (trigger function)
-- ============================================
CREATE OR REPLACE FUNCTION public.on_creator_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.is_approved = true AND (OLD.is_approved IS NULL OR OLD.is_approved = false) THEN
    UPDATE public.profiles SET role = 'creator' WHERE id = NEW.id;
    NEW.approval_date = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- 7. has_purchased_ressource
-- ============================================
CREATE OR REPLACE FUNCTION public.has_purchased_ressource(
  p_user_id UUID,
  p_ressource_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.purchases
    WHERE buyer_id = p_user_id AND ressource_id = p_ressource_id
  );
END;
$$;

-- ============================================
-- 8. get_user_purchases
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_purchases(p_user_id UUID)
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
SET search_path = ''
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
  FROM public.purchases p
  JOIN public.ressources r ON p.ressource_id = r.id
  WHERE p.buyer_id = p_user_id
  ORDER BY p.purchased_at DESC;
END;
$$;

-- ============================================
-- 9. purchase_ressource
-- ============================================
CREATE OR REPLACE FUNCTION public.purchase_ressource(
  p_buyer_id UUID,
  p_ressource_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  FROM public.ressources
  WHERE id = p_ressource_id AND status = 'published';

  IF v_price IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Ressource non disponible');
  END IF;

  -- Vérifier que l'acheteur n'est pas le créateur
  IF v_creator_id = p_buyer_id THEN
    RETURN json_build_object('success', false, 'error', 'Vous ne pouvez pas acheter votre propre ressource');
  END IF;

  -- Vérifier que l'acheteur n'a pas déjà acheté
  IF EXISTS (SELECT 1 FROM public.purchases WHERE buyer_id = p_buyer_id AND ressource_id = p_ressource_id) THEN
    RETURN json_build_object('success', false, 'error', 'Ressource déjà achetée');
  END IF;

  -- Vérifier le solde de crédits
  SELECT credits_balance INTO v_buyer_credits
  FROM public.profiles
  WHERE id = p_buyer_id;

  IF v_buyer_credits < v_price THEN
    RETURN json_build_object('success', false, 'error', 'Crédits insuffisants', 'needed', v_price, 'balance', v_buyer_credits);
  END IF;

  -- Créer l'achat
  INSERT INTO public.purchases (buyer_id, ressource_id, credits_spent)
  VALUES (p_buyer_id, p_ressource_id, v_price)
  RETURNING id INTO v_purchase_id;

  -- Débiter l'acheteur
  UPDATE public.profiles
  SET credits_balance = credits_balance - v_price, updated_at = NOW()
  WHERE id = p_buyer_id;

  -- Enregistrer la transaction de débit
  INSERT INTO public.credits_transactions (user_id, type, credits_amount, related_purchase_id, related_ressource_id, description)
  VALUES (p_buyer_id, 'spent', -v_price, v_purchase_id, p_ressource_id, 'Achat ressource');

  -- Créditer le créateur (90% par défaut)
  IF v_creator_id IS NOT NULL THEN
    v_creator_earning := FLOOR(v_price * 0.9);

    UPDATE public.profiles
    SET credits_balance = credits_balance + v_creator_earning, updated_at = NOW()
    WHERE id = v_creator_id;

    -- Enregistrer la transaction de gain
    INSERT INTO public.credits_transactions (user_id, type, credits_amount, related_purchase_id, related_ressource_id, description)
    VALUES (v_creator_id, 'sale_earning', v_creator_earning, v_purchase_id, p_ressource_id, 'Vente ressource');

    -- Mettre à jour les stats du créateur
    UPDATE public.creators
    SET total_sales_credits = total_sales_credits + v_price,
        total_earnings_cents = total_earnings_cents + (v_creator_earning * 100)
    WHERE id = v_creator_id;
  END IF;

  -- Mettre à jour le compteur d'achats de la ressource
  UPDATE public.ressources
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

-- ============================================
-- 10. increment_views
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_views(resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.ressources
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = resource_id;
END;
$$;

-- ============================================
-- 11. check_alerts_on_publish (if exists)
-- ============================================
-- Note: This function was created directly in Supabase
-- If it exists, recreate with fixed search_path
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'check_alerts_on_publish'
  ) THEN
    -- Drop and recreate would need the original definition
    -- For now, alter the function's search_path
    ALTER FUNCTION public.check_alerts_on_publish SET search_path = '';
  END IF;
EXCEPTION WHEN others THEN
  -- Function doesn't exist or can't be altered, skip
  NULL;
END $$;

-- ============================================
-- 12. submit_custom_tag
-- ============================================
CREATE OR REPLACE FUNCTION public.submit_custom_tag(
  p_type TEXT,
  p_value TEXT,
  p_resource_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_tag_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();

  -- Chercher si déjà soumis par ce créateur
  SELECT id INTO v_tag_id
  FROM public.custom_tags
  WHERE type = p_type
    AND LOWER(value) = LOWER(p_value)
    AND created_by = v_user_id;

  -- Si existe, retourner l'id existant
  IF v_tag_id IS NOT NULL THEN
    RETURN v_tag_id;
  END IF;

  -- Sinon, insérer nouveau
  INSERT INTO public.custom_tags (type, value, created_by, resource_id)
  VALUES (p_type, p_value, v_user_id, p_resource_id)
  RETURNING id INTO v_tag_id;

  RETURN v_tag_id;
END;
$$;

-- ============================================
-- Also fix schema.sql utility functions
-- ============================================

-- has_unlocked_ressource (from schema.sql)
CREATE OR REPLACE FUNCTION public.has_unlocked_ressource(
  p_user_id UUID,
  p_ressource_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.unlocks
    WHERE user_id = p_user_id
      AND ressource_id = p_ressource_id
  );
END;
$$;

-- get_user_stats (from schema.sql)
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'bookmarks_count', (SELECT COUNT(*) FROM public.bookmarks WHERE user_id = p_user_id),
    'unlocks_count', (SELECT COUNT(*) FROM public.unlocks WHERE user_id = p_user_id),
    'bookmarks_by_type', (
      SELECT json_object_agg(r.type, count)
      FROM (
        SELECT r.type, COUNT(*) as count
        FROM public.bookmarks b
        JOIN public.ressources r ON b.ressource_id = r.id
        WHERE b.user_id = p_user_id
        GROUP BY r.type
      ) r
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- ============================================
-- END MIGRATION 009
-- ============================================
