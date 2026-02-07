-- ============================================
-- CRÉDITS V2 : Schéma double balance (gratuits/payants)
-- ============================================

-- 1. MODIFIER TABLE PROFILES (double balance)
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_credits_balance INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS paid_credits_balance INTEGER DEFAULT 0;

-- Trigger pour maintenir credits_balance = free + paid (rétrocompatibilité)
CREATE OR REPLACE FUNCTION update_total_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.credits_balance := COALESCE(NEW.free_credits_balance, 0) + COALESCE(NEW.paid_credits_balance, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_total_credits ON profiles;
CREATE TRIGGER trigger_update_total_credits
  BEFORE INSERT OR UPDATE OF free_credits_balance, paid_credits_balance ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_total_credits_balance();

-- Migration données existantes : crédits actuels → paid_credits
UPDATE profiles
SET paid_credits_balance = COALESCE(credits_balance, 0),
    free_credits_balance = 0
WHERE paid_credits_balance IS NULL OR paid_credits_balance = 0;

-- 2. TABLE CREDIT_UNITS (tracking valeur unitaire FIFO)
-- ============================================
CREATE TABLE IF NOT EXISTS credit_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credit_type TEXT NOT NULL CHECK (credit_type IN ('free', 'paid')),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  unit_value_cents INTEGER NOT NULL DEFAULT 0, -- 0 pour free, valeur réelle pour paid
  source TEXT NOT NULL CHECK (source IN ('stripe_pack', 'promo_code', 'registration', 'admin_grant', 'purchase_bonus')),
  source_ref TEXT, -- pack_id, promo_code_id, etc.
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_units_user ON credit_units(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_units_type ON credit_units(credit_type);
CREATE INDEX IF NOT EXISTS idx_credit_units_acquired ON credit_units(user_id, credit_type, acquired_at ASC);

-- RLS pour credit_units
ALTER TABLE credit_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_units_select_own" ON credit_units;
CREATE POLICY "credit_units_select_own" ON credit_units
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "credit_units_admin_all" ON credit_units;
CREATE POLICY "credit_units_admin_all" ON credit_units
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 3. TABLE PROMO_CODES
-- ============================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  free_credits INTEGER NOT NULL CHECK (free_credits > 0),
  max_uses INTEGER, -- NULL = illimité (total global)
  current_uses INTEGER DEFAULT 0,
  allow_multiple_per_user BOOLEAN DEFAULT FALSE, -- Si true, un user peut réutiliser le code
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(UPPER(code));
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active) WHERE is_active = TRUE;

-- RLS pour promo_codes (lecture publique, écriture admin)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "promo_codes_select_all" ON promo_codes;
CREATE POLICY "promo_codes_select_all" ON promo_codes
  FOR SELECT USING (TRUE); -- Tout le monde peut lire pour valider un code

DROP POLICY IF EXISTS "promo_codes_admin_write" ON promo_codes;
CREATE POLICY "promo_codes_admin_write" ON promo_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 4. TABLE PROMO_CODE_REDEMPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS promo_code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credits_granted INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redemptions_code ON promo_code_redemptions(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON promo_code_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_code_user ON promo_code_redemptions(promo_code_id, user_id);

-- RLS pour promo_code_redemptions
ALTER TABLE promo_code_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "redemptions_select_own" ON promo_code_redemptions;
CREATE POLICY "redemptions_select_own" ON promo_code_redemptions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "redemptions_admin_all" ON promo_code_redemptions;
CREATE POLICY "redemptions_admin_all" ON promo_code_redemptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 5. TABLE PURCHASE_BONUSES (config bonus par pack Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id TEXT UNIQUE NOT NULL,
  pack_name TEXT,
  pack_credits INTEGER NOT NULL,
  pack_price_cents INTEGER NOT NULL,
  bonus_free_credits INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data avec les packs actuels
INSERT INTO purchase_bonuses (pack_id, pack_name, pack_credits, pack_price_cents, bonus_free_credits) VALUES
  ('pack_5', '5 crédits', 5, 499, 0),
  ('pack_15', '15 crédits', 15, 1199, 0),
  ('pack_30', '30 crédits', 30, 1999, 5),
  ('pack_60', '60 crédits', 60, 3499, 15)
ON CONFLICT (pack_id) DO NOTHING;

-- RLS pour purchase_bonuses (lecture publique, écriture admin)
ALTER TABLE purchase_bonuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchase_bonuses_select_all" ON purchase_bonuses;
CREATE POLICY "purchase_bonuses_select_all" ON purchase_bonuses
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "purchase_bonuses_admin_write" ON purchase_bonuses;
CREATE POLICY "purchase_bonuses_admin_write" ON purchase_bonuses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 6. TABLE APP_CONFIG (configuration générale)
-- ============================================
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Seed data pour bonus inscription
INSERT INTO app_config (key, value, description) VALUES
  ('registration_bonus', '{"enabled": true, "free_credits": 5}', 'Crédits gratuits offerts à l''inscription')
ON CONFLICT (key) DO NOTHING;

-- RLS pour app_config (lecture publique, écriture admin)
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_config_select_all" ON app_config;
CREATE POLICY "app_config_select_all" ON app_config
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "app_config_admin_write" ON app_config;
CREATE POLICY "app_config_admin_write" ON app_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 7. ÉTENDRE TABLE CREDITS_TRANSACTIONS
-- ============================================
ALTER TABLE credits_transactions
  ADD COLUMN IF NOT EXISTS credit_type TEXT CHECK (credit_type IN ('free', 'paid', 'mixed')),
  ADD COLUMN IF NOT EXISTS unit_value_cents INTEGER,
  ADD COLUMN IF NOT EXISTS promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS free_amount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_amount INTEGER DEFAULT 0;

-- Mettre à jour le CHECK constraint pour les types
ALTER TABLE credits_transactions DROP CONSTRAINT IF EXISTS credits_transactions_type_check;
ALTER TABLE credits_transactions ADD CONSTRAINT credits_transactions_type_check
  CHECK (type IN ('purchase', 'spent', 'refund', 'bonus', 'sale_earning', 'promo_code', 'registration_bonus', 'purchase_bonus', 'admin_grant'));

-- Index pour les nouveaux champs
CREATE INDEX IF NOT EXISTS idx_credits_credit_type ON credits_transactions(credit_type);

-- 8. ÉTENDRE TABLE PURCHASES (tracking valeur EUR réelle)
-- ============================================
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS free_credits_spent INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_credits_spent INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_value_eur_cents INTEGER DEFAULT 0, -- Valeur EUR réelle des crédits payants
  ADD COLUMN IF NOT EXISTS creator_earning_eur_cents INTEGER DEFAULT 0; -- 90% de paid_value

-- Migration données existantes purchases → tout en paid
UPDATE purchases
SET paid_credits_spent = credits_spent,
    free_credits_spent = 0
WHERE paid_credits_spent IS NULL OR paid_credits_spent = 0;

-- ============================================
-- FIN MIGRATION 010 - Schéma Crédits V2
-- ============================================
