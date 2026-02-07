-- Migration: saved_templates
-- Description: Table pour stocker les templates personnalisés des créateurs

-- Créer la table saved_templates
CREATE TABLE IF NOT EXISTS saved_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_saved_templates_creator ON saved_templates(creator_id);
CREATE INDEX idx_saved_templates_public ON saved_templates(is_public) WHERE is_public = TRUE;

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_saved_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saved_templates_updated_at
  BEFORE UPDATE ON saved_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_templates_updated_at();

-- RLS Policies
ALTER TABLE saved_templates ENABLE ROW LEVEL SECURITY;

-- Politique: Les créateurs peuvent voir leurs propres templates
CREATE POLICY "Creators can view own templates"
  ON saved_templates
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Politique: Tout le monde peut voir les templates publics
CREATE POLICY "Anyone can view public templates"
  ON saved_templates
  FOR SELECT
  USING (is_public = TRUE);

-- Politique: Les créateurs peuvent créer leurs templates
CREATE POLICY "Creators can create templates"
  ON saved_templates
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Politique: Les créateurs peuvent modifier leurs templates
CREATE POLICY "Creators can update own templates"
  ON saved_templates
  FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Politique: Les créateurs peuvent supprimer leurs templates
CREATE POLICY "Creators can delete own templates"
  ON saved_templates
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Commentaires
COMMENT ON TABLE saved_templates IS 'Templates de mise en page sauvegardés par les créateurs';
COMMENT ON COLUMN saved_templates.layout IS 'Structure ContentBlocksData en JSONB';
COMMENT ON COLUMN saved_templates.is_public IS 'Si TRUE, visible par tous les créateurs';
