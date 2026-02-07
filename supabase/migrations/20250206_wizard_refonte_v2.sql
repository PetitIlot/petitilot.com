-- ============================================
-- Migration: Refonte Wizard & Canvas v2
-- Date: 2025-02-06
-- ============================================

-- 1. Ajouter le champ accept_free_credits
ALTER TABLE ressources
ADD COLUMN IF NOT EXISTS accept_free_credits BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN ressources.accept_free_credits IS 'Si true, accepte les crédits gratuits pour cette ressource';

-- 2. Créer la table resource_collaborators pour la collaboration
CREATE TABLE IF NOT EXISTS resource_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  resource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES creators(id),

  -- Permissions
  can_edit BOOLEAN DEFAULT FALSE,

  -- Revenus (pourcentage)
  revenue_share DECIMAL(5,2) DEFAULT 0
    CHECK (revenue_share >= 0 AND revenue_share <= 100),

  -- Statut de l'invitation
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),

  -- Timestamps
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  -- Contrainte d'unicité
  UNIQUE(resource_id, creator_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_collab_resource ON resource_collaborators(resource_id);
CREATE INDEX IF NOT EXISTS idx_collab_creator ON resource_collaborators(creator_id);
CREATE INDEX IF NOT EXISTS idx_collab_status ON resource_collaborators(status);
CREATE INDEX IF NOT EXISTS idx_collab_invited_by ON resource_collaborators(invited_by);

-- Commentaires
COMMENT ON TABLE resource_collaborators IS 'Gestion des collaborations entre créateurs sur les ressources';
COMMENT ON COLUMN resource_collaborators.can_edit IS 'Si true, le collaborateur peut modifier la ressource';
COMMENT ON COLUMN resource_collaborators.revenue_share IS 'Pourcentage des revenus (0-100)';
COMMENT ON COLUMN resource_collaborators.status IS 'Statut: pending (en attente), accepted (accepté), rejected (refusé)';

-- 3. Activer RLS sur resource_collaborators
ALTER TABLE resource_collaborators ENABLE ROW LEVEL SECURITY;

-- Policy: Voir ses propres collaborations (en tant que créateur principal ou collaborateur)
CREATE POLICY "View own collaborations"
  ON resource_collaborators
  FOR SELECT
  USING (
    creator_id = auth.uid()
    OR invited_by = auth.uid()
    OR resource_id IN (
      SELECT id FROM ressources WHERE creator_id = auth.uid()
    )
  );

-- Policy: Créer des invitations (créateur principal uniquement)
CREATE POLICY "Create collaboration invites"
  ON resource_collaborators
  FOR INSERT
  WITH CHECK (
    invited_by = auth.uid()
    AND resource_id IN (
      SELECT id FROM ressources WHERE creator_id = auth.uid()
    )
  );

-- Policy: Mettre à jour (répondre à une invitation ou modifier)
CREATE POLICY "Update collaboration"
  ON resource_collaborators
  FOR UPDATE
  USING (
    creator_id = auth.uid()  -- Le collaborateur peut répondre
    OR invited_by = auth.uid()  -- L'inviteur peut modifier
  )
  WITH CHECK (
    creator_id = auth.uid()
    OR invited_by = auth.uid()
  );

-- Policy: Supprimer (créateur principal ou collaborateur qui se retire)
CREATE POLICY "Delete collaboration"
  ON resource_collaborators
  FOR DELETE
  USING (
    creator_id = auth.uid()  -- Le collaborateur peut se retirer
    OR invited_by = auth.uid()  -- L'inviteur peut retirer
  );

-- 4. Créer le bucket Storage pour les fichiers ressources (si pas déjà fait)
-- Note: À exécuter via Supabase Dashboard ou CLI car INSERT dans storage.buckets
-- nécessite des permissions spéciales

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'ressources',
--   'ressources',
--   false,  -- Privé, accès via signed URLs
--   52428800,  -- 50 MB max
--   ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- 5. Fonction helper pour vérifier si tous les collaborateurs ont validé
CREATE OR REPLACE FUNCTION check_all_collaborators_accepted(p_resource_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM resource_collaborators
    WHERE resource_id = p_resource_id
    AND status = 'pending'
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_all_collaborators_accepted IS 'Vérifie si tous les collaborateurs ont accepté (pas de pending)';

-- 6. Fonction pour calculer le total des parts de revenus
CREATE OR REPLACE FUNCTION get_total_revenue_share(p_resource_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(revenue_share), 0) INTO total
  FROM resource_collaborators
  WHERE resource_id = p_resource_id
  AND status = 'accepted';

  RETURN total;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_total_revenue_share IS 'Calcule le total des parts de revenus des collaborateurs acceptés';

-- ============================================
-- Note: Les colonnes suivantes seront dépréciées
-- mais conservées pour rétrocompatibilité:
-- - subtitle
-- - description
-- - astuces
-- - video_url
-- - images_urls
-- - gallery_urls
-- - pdf_url
-- - meta_seo
--
-- Les données seront migrées vers content_blocks
-- puis ces colonnes pourront être supprimées
-- ============================================
