-- ============================================
-- TRIGGER BONUS INSCRIPTION
-- S'exécute après création d'un nouveau profil
-- ============================================

-- Fonction trigger pour accorder le bonus d'inscription automatiquement
CREATE OR REPLACE FUNCTION trigger_grant_registration_bonus()
RETURNS TRIGGER AS $$
DECLARE
  v_config JSONB;
  v_enabled BOOLEAN;
  v_credits INTEGER;
BEGIN
  -- Récupérer la config
  SELECT value INTO v_config FROM app_config WHERE key = 'registration_bonus';

  IF v_config IS NULL THEN
    RETURN NEW;
  END IF;

  v_enabled := (v_config->>'enabled')::BOOLEAN;
  v_credits := (v_config->>'free_credits')::INTEGER;

  IF NOT v_enabled OR v_credits <= 0 THEN
    RETURN NEW;
  END IF;

  -- Ajouter les crédits gratuits directement
  NEW.free_credits_balance := COALESCE(NEW.free_credits_balance, 0) + v_credits;

  -- Créer l'unité de crédit (via INSERT séparé car on ne peut pas le faire dans le trigger BEFORE)
  -- Note: On utilise le trigger AFTER pour créer le credit_unit

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger BEFORE INSERT pour initialiser le bonus
DROP TRIGGER IF EXISTS trigger_registration_bonus_init ON profiles;
CREATE TRIGGER trigger_registration_bonus_init
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_grant_registration_bonus();

-- Fonction trigger AFTER pour créer les records associés
CREATE OR REPLACE FUNCTION trigger_create_registration_records()
RETURNS TRIGGER AS $$
DECLARE
  v_config JSONB;
  v_enabled BOOLEAN;
  v_credits INTEGER;
BEGIN
  -- Récupérer la config
  SELECT value INTO v_config FROM app_config WHERE key = 'registration_bonus';

  IF v_config IS NULL THEN
    RETURN NEW;
  END IF;

  v_enabled := (v_config->>'enabled')::BOOLEAN;
  v_credits := (v_config->>'free_credits')::INTEGER;

  IF NOT v_enabled OR v_credits <= 0 THEN
    RETURN NEW;
  END IF;

  -- Créer l'unité de crédit
  INSERT INTO credit_units (user_id, credit_type, quantity, unit_value_cents, source)
  VALUES (NEW.id, 'free', v_credits, 0, 'registration');

  -- Logger la transaction
  INSERT INTO credits_transactions (user_id, type, credits_amount, credit_type, description)
  VALUES (NEW.id, 'registration_bonus', v_credits, 'free', 'Bonus de bienvenue');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Ne pas bloquer la création du profil si le bonus échoue
  RAISE NOTICE 'Registration bonus error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger AFTER INSERT pour créer les records
DROP TRIGGER IF EXISTS trigger_registration_bonus_records ON profiles;
CREATE TRIGGER trigger_registration_bonus_records
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_registration_records();

-- ============================================
-- FIN MIGRATION 012 - Trigger bonus inscription
-- ============================================
