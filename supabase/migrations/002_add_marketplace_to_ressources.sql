-- ============================================
-- MIGRATION : Ajouter colonnes marketplace à la table ressources existante
-- ============================================
-- Colonnes existantes: id, group_id, lang, type, slug, title, subtitle, description,
-- age_min, age_max, duration, duration_max, intensity, themes, competences,
-- images_urls, gallery_urls, video_url, pdf_url, materiel_json, is_premium, meta_seo,
-- difficulte, autonomie, astuces, auteur, editeur, annee, illustrateur, isbn,
-- collection, nb_joueurs_min, nb_joueurs_max, vignette_url, created_at

-- 1. Ajouter les colonnes marketplace manquantes
-- ============================================

-- Créateur et propriétaire (pour les ressources de créateurs externes)
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES creators(id) ON DELETE SET NULL;

-- Prix et système de crédits
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS price_credits INTEGER DEFAULT 0;

-- Catégorisation supplémentaire (en plus de themes/competences existants)
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS materials TEXT[] DEFAULT '{}';
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';

-- Vérification URL externe
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS url_last_checked TIMESTAMPTZ;
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS url_status TEXT DEFAULT 'ok';

-- Workflow de publication (marketplace)
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Statistiques
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS purchases_count INTEGER DEFAULT 0;
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3,2);
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- updated_at si manquant
ALTER TABLE ressources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Créer les index
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ressources_creator ON ressources(creator_id);
CREATE INDEX IF NOT EXISTS idx_ressources_status ON ressources(status);
CREATE INDEX IF NOT EXISTS idx_ressources_categories ON ressources USING GIN(categories);

-- 3. Contrainte sur status
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ressources_status_check'
  ) THEN
    ALTER TABLE ressources ADD CONSTRAINT ressources_status_check
      CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'offline'));
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- 4. Mettre à jour les ressources existantes
-- ============================================
-- Les ressources existantes restent publiées (contenu legacy)
UPDATE ressources SET status = 'published' WHERE status IS NULL;
UPDATE ressources SET published_at = created_at WHERE published_at IS NULL AND status = 'published';
UPDATE ressources SET url_status = 'ok' WHERE url_status IS NULL;

-- 5. RLS Policies pour ressources
-- ============================================
DROP POLICY IF EXISTS "ressources_select_published" ON ressources;
DROP POLICY IF EXISTS "ressources_select_own" ON ressources;
DROP POLICY IF EXISTS "ressources_insert_own" ON ressources;
DROP POLICY IF EXISTS "ressources_update_own" ON ressources;
DROP POLICY IF EXISTS "ressources_delete_own" ON ressources;
DROP POLICY IF EXISTS "ressources_admin_all" ON ressources;
DROP POLICY IF EXISTS "Public can view published ressources" ON ressources;

ALTER TABLE ressources ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les ressources publiées
CREATE POLICY "ressources_select_published" ON ressources
  FOR SELECT USING (status = 'published');

-- Les créateurs peuvent voir leurs propres ressources (tous statuts)
CREATE POLICY "ressources_select_own" ON ressources
  FOR SELECT USING (creator_id = auth.uid());

-- Les créateurs peuvent créer des ressources
CREATE POLICY "ressources_insert_own" ON ressources
  FOR INSERT WITH CHECK (creator_id = auth.uid());

-- Les créateurs peuvent modifier leurs ressources
CREATE POLICY "ressources_update_own" ON ressources
  FOR UPDATE USING (creator_id = auth.uid());

-- Les créateurs peuvent supprimer leurs ressources (brouillons seulement)
CREATE POLICY "ressources_delete_own" ON ressources
  FOR DELETE USING (creator_id = auth.uid() AND status = 'draft');

-- Les admins ont accès total
CREATE POLICY "ressources_admin_all" ON ressources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 6. Trigger updated_at
-- ============================================
DROP TRIGGER IF EXISTS ressources_updated_at ON ressources;
CREATE TRIGGER ressources_updated_at
  BEFORE UPDATE ON ressources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Vue pour les ressources avec créateur (optionnel)
-- ============================================
CREATE OR REPLACE VIEW ressources_with_creator AS
SELECT
  r.*,
  c.display_name as creator_name,
  c.slug as creator_slug,
  c.avatar_url as creator_avatar
FROM ressources r
LEFT JOIN creators c ON r.creator_id = c.id
WHERE r.status = 'published';

-- ============================================
-- FIN - Table ressources enrichie pour marketplace
-- ============================================
