-- ============================================
-- SPRINT 1 : Fondations Multi-Créateurs (V2 - Fix)
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter colonnes à profiles (si pas déjà fait)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'creator', 'admin'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'credits_balance') THEN
    ALTER TABLE profiles ADD COLUMN credits_balance INTEGER DEFAULT 0;
  END IF;
END $$;

-- Index pour requêtes par rôle
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Créer table 'creators' (si pas déjà fait)
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  philosophy TEXT,
  avatar_url TEXT,
  instagram_handle TEXT,
  website_url TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 90.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  payout_email TEXT,
  stripe_account_id TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approval_date TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  total_resources INTEGER DEFAULT 0,
  total_sales_credits INTEGER DEFAULT 0,
  total_earnings_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_approved ON creators(is_approved) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_creators_featured ON creators(is_featured) WHERE is_featured = TRUE;

-- 3. Créer table 'resources' (si pas déjà fait)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  price_credits INTEGER NOT NULL CHECK (price_credits > 0 AND price_credits <= 50),
  age_min_months INTEGER CHECK (age_min_months >= 0 AND age_min_months <= 72),
  age_max_months INTEGER CHECK (age_max_months >= 0 AND age_max_months <= 72),
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  categories TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  preview_image_url TEXT,
  additional_images_urls TEXT[] DEFAULT '{}',
  resource_file_url TEXT NOT NULL,
  meta_description TEXT,
  url_last_checked TIMESTAMPTZ,
  url_status TEXT DEFAULT 'pending' CHECK (url_status IN ('ok', 'dead', 'pending')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'offline')),
  rejection_reason TEXT,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_creator ON resources(creator_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_resources_categories ON resources USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_resources_url_status ON resources(url_status) WHERE url_status = 'dead';

-- 4. SUPPRIMER toutes les policies existantes
-- ============================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  -- Supprimer policies sur profiles
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
  END LOOP;

  -- Supprimer policies sur creators
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'creators' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON creators', pol.policyname);
  END LOOP;

  -- Supprimer policies sur resources
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'resources' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON resources', pol.policyname);
  END LOOP;
END $$;

-- 5. Activer RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 6. PROFILES policies
-- ============================================
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. CREATORS policies
-- ============================================
CREATE POLICY "creators_select_approved" ON creators
  FOR SELECT USING (is_approved = true);

CREATE POLICY "creators_select_own" ON creators
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "creators_insert_own" ON creators
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "creators_update_own" ON creators
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "creators_admin_select" ON creators
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "creators_admin_update" ON creators
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8. RESOURCES policies
-- ============================================
CREATE POLICY "resources_select_published" ON resources
  FOR SELECT USING (status = 'published');

CREATE POLICY "resources_select_own" ON resources
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "resources_insert_own" ON resources
  FOR INSERT WITH CHECK (
    creator_id = auth.uid()
    AND EXISTS (SELECT 1 FROM creators WHERE creators.id = auth.uid())
  );

CREATE POLICY "resources_update_own" ON resources
  FOR UPDATE USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "resources_delete_own" ON resources
  FOR DELETE USING (creator_id = auth.uid());

CREATE POLICY "resources_admin_select" ON resources
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "resources_admin_update" ON resources
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 9. RPC Functions
-- ============================================
CREATE OR REPLACE FUNCTION increment_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE profiles
  SET credits_balance = credits_balance + amount,
      updated_at = NOW()
  WHERE id = user_id
  RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  SELECT credits_balance INTO current_balance FROM profiles WHERE id = user_id;
  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient credits: have %, need %', current_balance, amount;
  END IF;
  UPDATE profiles
  SET credits_balance = credits_balance - amount,
      updated_at = NOW()
  WHERE id = user_id
  RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'buyer');
END;
$$;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin');
END;
$$;

CREATE OR REPLACE FUNCTION is_approved_creator(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM creators WHERE id = user_id AND is_approved = true);
END;
$$;

-- 10. Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS creators_updated_at ON creators;
CREATE TRIGGER creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON resources;
CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION on_creator_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = true AND (OLD.is_approved = false OR OLD.is_approved IS NULL) THEN
    UPDATE profiles SET role = 'creator' WHERE id = NEW.id;
    NEW.approval_date = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS creator_approval_trigger ON creators;
CREATE TRIGGER creator_approval_trigger
  BEFORE UPDATE ON creators
  FOR EACH ROW
  WHEN (NEW.is_approved IS DISTINCT FROM OLD.is_approved)
  EXECUTE FUNCTION on_creator_approved();

-- ============================================
-- FIN MIGRATION SPRINT 1 V2
-- ============================================

-- Pour créer un admin :
-- UPDATE profiles SET role = 'admin' WHERE email = 'ton.email@exemple.com';
