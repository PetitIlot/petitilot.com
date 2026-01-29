-- ============================================================================
-- PETIT ÎLOT - SCHÉMA SUPABASE
-- ============================================================================
-- Tables pour authentification et données utilisateur

-- ============================================================================
-- 1. TABLE PROFILES (Extension du user auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Préférences
  lang TEXT DEFAULT 'fr' CHECK (lang IN ('fr', 'en', 'es')),
  newsletter_subscribed BOOLEAN DEFAULT FALSE,

  -- Métadonnées
  last_login TIMESTAMP WITH TIME ZONE,

  CONSTRAINT profiles_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, lang)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'lang', 'fr')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. TABLE BOOKMARKS (Favoris)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ressource_id UUID REFERENCES public.ressources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contrainte d'unicité : un utilisateur ne peut pas marquer 2x la même ressource
  CONSTRAINT bookmarks_unique UNIQUE (user_id, ressource_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_ressource_id_idx ON public.bookmarks(ressource_id);

-- ============================================================================
-- 3. TABLE UNLOCKS (Déblocages de ressources premium)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ressource_id UUID REFERENCES public.ressources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Métadonnées d'achat
  unlock_method TEXT CHECK (unlock_method IN ('free', 'purchase', 'gift', 'subscription')),
  transaction_id TEXT,

  -- Contrainte d'unicité
  CONSTRAINT unlocks_unique UNIQUE (user_id, ressource_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS unlocks_user_id_idx ON public.unlocks(user_id);
CREATE INDEX IF NOT EXISTS unlocks_ressource_id_idx ON public.unlocks(ressource_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocks ENABLE ROW LEVEL SECURITY;

-- Policies pour PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour BOOKMARKS
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can create their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour UNLOCKS
DROP POLICY IF EXISTS "Users can view their own unlocks" ON public.unlocks;
CREATE POLICY "Users can view their own unlocks"
  ON public.unlocks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert unlocks" ON public.unlocks;
CREATE POLICY "Users can insert unlocks"
  ON public.unlocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 5. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour vérifier si un utilisateur a débloqué une ressource
CREATE OR REPLACE FUNCTION public.has_unlocked_ressource(
  p_user_id UUID,
  p_ressource_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.unlocks
    WHERE user_id = p_user_id
      AND ressource_id = p_ressource_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
