-- Migration: Add creator_templates table for saved custom templates
-- Date: 2025-02-06
-- Description: Allows creators to save their custom layouts as reusable templates

-- Create the creator_templates table
CREATE TABLE IF NOT EXISTS creator_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,

  -- Template info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '📐',
  color VARCHAR(7) DEFAULT '#A8B5A0',

  -- Template data (content_blocks structure)
  template_data JSONB NOT NULL,

  -- Metadata
  is_public BOOLEAN DEFAULT FALSE,  -- Future: allow sharing templates
  use_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by creator
CREATE INDEX IF NOT EXISTS idx_creator_templates_creator_id ON creator_templates(creator_id);

-- Index for public templates (future feature)
CREATE INDEX IF NOT EXISTS idx_creator_templates_public ON creator_templates(is_public) WHERE is_public = TRUE;

-- Enable RLS
ALTER TABLE creator_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Creators can view their own templates
CREATE POLICY "Creators can view own templates"
  ON creator_templates
  FOR SELECT
  USING (creator_id = auth.uid() OR is_public = TRUE);

-- Policy: Creators can insert their own templates
CREATE POLICY "Creators can insert own templates"
  ON creator_templates
  FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- Policy: Creators can update their own templates
CREATE POLICY "Creators can update own templates"
  ON creator_templates
  FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Policy: Creators can delete their own templates
CREATE POLICY "Creators can delete own templates"
  ON creator_templates
  FOR DELETE
  USING (creator_id = auth.uid());

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_creator_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_creator_templates_updated_at
  BEFORE UPDATE ON creator_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_templates_updated_at();

-- Comment for documentation
COMMENT ON TABLE creator_templates IS 'Stores custom templates created by creators for reuse';
COMMENT ON COLUMN creator_templates.template_data IS 'JSONB containing the full ContentBlocksData structure';
