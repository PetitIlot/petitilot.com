-- ============================================
-- SPRINT 1 : Fondations Multi-Créateurs
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter colonne 'role' à profiles
-- ============================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'buyer'
CHECK (role IN ('buyer', 'creator', 'admin'));

-- Ajouter colonne credits_balance si elle n'existe pas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;

-- Index pour requêtes par rôle
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Créer table 'creators'
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,

  -- Infos publiques
  display_name TEXT NOT NULL,
  bio TEXT,
  philosophy TEXT,
  avatar_url TEXT,

  -- Réseaux sociaux
  instagram_handle TEXT,
  website_url TEXT,

  -- Business
  commission_rate NUMERIC(5,2) DEFAULT 90.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  payout_email TEXT,
  stripe_account_id TEXT,

  -- Statut
  is_approved BOOLEAN DEFAULT FALSE,
  approval_date TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Stats (dénormalisées pour performance)
  total_resources INTEGER DEFAULT 0,
  total_sales_credits INTEGER DEFAULT 0,
  total_earnings_cents INTEGER DEFAULT 0,

  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_creators_approved ON creators(is_approved) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_creators_featured ON creators(is_featured) WHERE is_featured = TRUE;

-- 3. Créer table 'resources' (nouvelle structure marketplace)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,

  -- Contenu multi-langue
  title_fr TEXT NOT NULL,
  title_en TEXT,
  description_fr TEXT NOT NULL,
  description_en TEXT,

  -- Pricing
  price_credits INTEGER NOT NULL CHECK (price_credits > 0 AND price_credits <= 50),

  -- Métadonnées pédagogiques
  age_min_months INTEGER CHECK (age_min_months >= 0 AND age_min_months <= 72),
  age_max_months INTEGER CHECK (age_max_months >= 0 AND age_max_months <= 72),
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- Catégorisation (arrays PostgreSQL)
  categories TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',

  -- Médias
  preview_image_url TEXT,
  additional_images_urls TEXT[] DEFAULT '{}',
  resource_file_url TEXT NOT NULL,

  -- SEO
  meta_description TEXT,

  -- Santé technique (monitoring URLs)
  url_last_checked TIMESTAMPTZ,
  url_status TEXT DEFAULT 'pending' CHECK (url_status IN ('ok', 'dead', 'pending')),

  -- Statut publication
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'offline')),
  rejection_reason TEXT,
  published_at TIMESTAMPTZ,

  -- Stats
  views_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2),
  reviews_count INTEGER DEFAULT 0,

  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_resources_creator ON resources(creator_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_resources_categories ON resources USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_resources_url_status ON resources(url_status) WHERE url_status = 'dead';

-- 4. RLS Policies
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
-- Lecture : tout le monde peut lire les profils (infos publiques)
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Mise à jour : uniquement son propre profil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- CREATORS policies
-- Lecture : créateurs approuvés visibles par tous
CREATE POLICY "Approved creators viewable by everyone"
ON creators FOR SELECT
USING (is_approved = true);

-- Lecture : créateurs peuvent voir leur propre profil même non approuvé
CREATE POLICY "Creators can view own profile"
ON creators FOR SELECT
USING (auth.uid() = id);

-- Insertion : utilisateurs authentifiés peuvent créer un profil créateur
CREATE POLICY "Authenticated users can create creator profile"
ON creators FOR INSERT
WITH CHECK (auth.uid() = id);

-- Mise à jour : créateurs peuvent modifier leur propre profil
CREATE POLICY "Creators can update own profile"
ON creators FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins : lecture et modification de tous les créateurs
CREATE POLICY "Admins can view all creators"
ON creators FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update any creator"
ON creators FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- RESOURCES policies
-- Lecture : ressources publiées visibles par tous
CREATE POLICY "Published resources viewable by everyone"
ON resources FOR SELECT
USING (status = 'published');

-- Lecture : créateurs peuvent voir leurs propres ressources
CREATE POLICY "Creators can view own resources"
ON resources FOR SELECT
USING (creator_id = auth.uid());

-- Insertion : créateurs peuvent créer des ressources
CREATE POLICY "Creators can insert own resources"
ON resources FOR INSERT
WITH CHECK (
  creator_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM creators
    WHERE creators.id = auth.uid()
  )
);

-- Mise à jour : créateurs peuvent modifier leurs ressources
CREATE POLICY "Creators can update own resources"
ON resources FOR UPDATE
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- Suppression : créateurs peuvent supprimer leurs ressources (soft delete via status)
CREATE POLICY "Creators can delete own resources"
ON resources FOR DELETE
USING (creator_id = auth.uid());

-- Admins : accès complet aux ressources
CREATE POLICY "Admins can view all resources"
ON resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update any resource"
ON resources FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. RPC Functions pour crédits
-- ============================================

-- Incrémenter crédits (après achat Stripe)
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

-- Décrémenter crédits (après achat ressource)
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Vérifier solde suffisant
  SELECT credits_balance INTO current_balance
  FROM profiles WHERE id = user_id;

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

-- Obtenir le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM profiles WHERE id = user_id;

  RETURN COALESCE(user_role, 'buyer');
END;
$$;

-- Vérifier si utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Vérifier si utilisateur est créateur approuvé
CREATE OR REPLACE FUNCTION is_approved_creator(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM creators
    WHERE id = user_id AND is_approved = true
  );
END;
$$;

-- 6. Triggers pour mise à jour automatique
-- ============================================

-- Trigger updated_at pour creators
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour mettre à jour le rôle quand un créateur est approuvé
CREATE OR REPLACE FUNCTION on_creator_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = true AND OLD.is_approved = false THEN
    UPDATE profiles SET role = 'creator' WHERE id = NEW.id;
    NEW.approval_date = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creator_approval_trigger
  BEFORE UPDATE ON creators
  FOR EACH ROW
  WHEN (NEW.is_approved IS DISTINCT FROM OLD.is_approved)
  EXECUTE FUNCTION on_creator_approved();

-- ============================================
-- FIN MIGRATION SPRINT 1
-- ============================================

-- NOTE: Pour créer un admin, exécuter manuellement :
-- UPDATE profiles SET role = 'admin' WHERE email = 'ton.email@exemple.com';
