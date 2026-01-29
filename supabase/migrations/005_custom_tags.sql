-- Migration: Table custom_tags pour les suggestions de tags par les créateurs
-- Les créateurs peuvent suggérer des matériaux, thèmes ou compétences custom
-- Ces suggestions sont reviewées par l'admin avant d'être ajoutées aux listes prédéfinies

-- Table des suggestions de tags custom
CREATE TABLE IF NOT EXISTS custom_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('material', 'theme', 'competence')),
  value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES ressources(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Éviter doublons: même créateur ne peut pas suggérer 2x le même tag
  UNIQUE(type, value, created_by)
);

-- Index pour recherches admin
CREATE INDEX idx_custom_tags_status ON custom_tags(status);
CREATE INDEX idx_custom_tags_type ON custom_tags(type);
CREATE INDEX idx_custom_tags_created_by ON custom_tags(created_by);

-- RLS
ALTER TABLE custom_tags ENABLE ROW LEVEL SECURITY;

-- Les créateurs peuvent voir leurs propres suggestions
CREATE POLICY "Creators can view own custom tags"
  ON custom_tags FOR SELECT
  USING (auth.uid() = created_by);

-- Les créateurs peuvent insérer des suggestions
CREATE POLICY "Creators can insert custom tags"
  ON custom_tags FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all custom tags"
  ON custom_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les admins peuvent modifier (approve/reject)
CREATE POLICY "Admins can update custom tags"
  ON custom_tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fonction pour soumettre un tag custom (évite doublons, retourne l'existant si déjà soumis)
CREATE OR REPLACE FUNCTION submit_custom_tag(
  p_type TEXT,
  p_value TEXT,
  p_resource_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tag_id UUID;
BEGIN
  -- Chercher si déjà soumis par ce créateur
  SELECT id INTO v_tag_id
  FROM custom_tags
  WHERE type = p_type
    AND LOWER(value) = LOWER(p_value)
    AND created_by = auth.uid();

  -- Si existe, retourner l'id existant
  IF v_tag_id IS NOT NULL THEN
    RETURN v_tag_id;
  END IF;

  -- Sinon, insérer nouveau
  INSERT INTO custom_tags (type, value, created_by, resource_id)
  VALUES (p_type, p_value, auth.uid(), p_resource_id)
  RETURNING id INTO v_tag_id;

  RETURN v_tag_id;
END;
$$;
