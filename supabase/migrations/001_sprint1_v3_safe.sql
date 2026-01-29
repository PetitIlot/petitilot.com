-- ============================================
-- SPRINT 1 V3 : Migration SAFE (adapte l'existant)
-- ============================================

-- 1. PROFILES : Ajouter colonnes manquantes
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'buyer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;

-- Ajouter contrainte si pas présente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('buyer', 'creator', 'admin'));
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. CREATORS : Vérifier et créer/modifier
-- ============================================
DO $$
BEGIN
  -- Si la table n'existe pas, la créer
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'creators') THEN
    CREATE TABLE creators (
      id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      bio TEXT,
      philosophy TEXT,
      avatar_url TEXT,
      instagram_handle TEXT,
      website_url TEXT,
      commission_rate NUMERIC(5,2) DEFAULT 90.00,
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
  ELSE
    -- La table existe, ajouter les colonnes manquantes
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS display_name TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS bio TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS philosophy TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS website_url TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) DEFAULT 90.00;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS payout_email TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS total_resources INTEGER DEFAULT 0;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS total_sales_credits INTEGER DEFAULT 0;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS total_earnings_cents INTEGER DEFAULT 0;
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    ALTER TABLE creators ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_approved ON creators(is_approved) WHERE is_approved = TRUE;

-- 3. RESOURCES : Créer la table marketplace
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,
  price_credits INTEGER NOT NULL DEFAULT 1,
  age_min_months INTEGER,
  age_max_months INTEGER,
  duration_minutes INTEGER,
  difficulty TEXT,
  categories TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  preview_image_url TEXT,
  additional_images_urls TEXT[] DEFAULT '{}',
  resource_file_url TEXT NOT NULL,
  meta_description TEXT,
  url_last_checked TIMESTAMPTZ,
  url_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'draft',
  rejection_reason TEXT,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ajouter FK si pas présente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'resources_creator_id_fkey'
  ) THEN
    ALTER TABLE resources ADD CONSTRAINT resources_creator_id_fkey
      FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_resources_creator ON resources(creator_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);

-- 4. SUPPRIMER policies existantes (SAFE)
-- ============================================
DROP POLICY IF EXISTS "read_active" ON creators;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "creators_select_approved" ON creators;
DROP POLICY IF EXISTS "creators_select_own" ON creators;
DROP POLICY IF EXISTS "creators_insert_own" ON creators;
DROP POLICY IF EXISTS "creators_update_own" ON creators;
DROP POLICY IF EXISTS "creators_admin_select" ON creators;
DROP POLICY IF EXISTS "creators_admin_update" ON creators;
DROP POLICY IF EXISTS "resources_select_published" ON resources;
DROP POLICY IF EXISTS "resources_select_own" ON resources;
DROP POLICY IF EXISTS "resources_insert_own" ON resources;
DROP POLICY IF EXISTS "resources_update_own" ON resources;
DROP POLICY IF EXISTS "resources_delete_own" ON resources;
DROP POLICY IF EXISTS "resources_admin_select" ON resources;
DROP POLICY IF EXISTS "resources_admin_update" ON resources;
-- Supprimer aussi d'autres policies potentielles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Approved creators viewable by everyone" ON creators;
DROP POLICY IF EXISTS "Creators can view own profile" ON creators;
DROP POLICY IF EXISTS "Authenticated users can create creator profile" ON creators;
DROP POLICY IF EXISTS "Creators can update own profile" ON creators;
DROP POLICY IF EXISTS "Admins can view all creators" ON creators;
DROP POLICY IF EXISTS "Admins can update any creator" ON creators;

-- 5. Activer RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 6. Créer les nouvelles policies
-- ============================================

-- PROFILES
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- CREATORS
CREATE POLICY "creators_select_approved" ON creators FOR SELECT USING (is_approved = true);
CREATE POLICY "creators_select_own" ON creators FOR SELECT USING (auth.uid() = id);
CREATE POLICY "creators_insert_own" ON creators FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "creators_update_own" ON creators FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "creators_admin_all" ON creators FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- RESOURCES
CREATE POLICY "resources_select_published" ON resources FOR SELECT USING (status = 'published');
CREATE POLICY "resources_select_own" ON resources FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "resources_insert_own" ON resources FOR INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY "resources_update_own" ON resources FOR UPDATE USING (creator_id = auth.uid());
CREATE POLICY "resources_delete_own" ON resources FOR DELETE USING (creator_id = auth.uid());
CREATE POLICY "resources_admin_all" ON resources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 7. RPC Functions
-- ============================================
CREATE OR REPLACE FUNCTION increment_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE new_balance INTEGER;
BEGIN
  UPDATE profiles SET credits_balance = credits_balance + amount, updated_at = NOW()
  WHERE id = user_id RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE current_balance INTEGER; new_balance INTEGER;
BEGIN
  SELECT credits_balance INTO current_balance FROM profiles WHERE id = user_id;
  IF current_balance < amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  UPDATE profiles SET credits_balance = credits_balance - amount, updated_at = NOW()
  WHERE id = user_id RETURNING credits_balance INTO new_balance;
  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN COALESCE((SELECT role FROM profiles WHERE id = user_id), 'buyer');
END;
$$;

-- 8. Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS creators_updated_at ON creators;
CREATE TRIGGER creators_updated_at BEFORE UPDATE ON creators FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS resources_updated_at ON resources;
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION on_creator_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = true AND (OLD.is_approved IS NULL OR OLD.is_approved = false) THEN
    UPDATE profiles SET role = 'creator' WHERE id = NEW.id;
    NEW.approval_date = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS creator_approval_trigger ON creators;
CREATE TRIGGER creator_approval_trigger BEFORE UPDATE ON creators FOR EACH ROW
  WHEN (NEW.is_approved IS DISTINCT FROM OLD.is_approved) EXECUTE FUNCTION on_creator_approved();

-- ============================================
-- FIN - Pour créer un admin :
-- UPDATE profiles SET role = 'admin' WHERE email = 'ton@email.com';
-- ============================================
