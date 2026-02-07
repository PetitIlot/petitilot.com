-- Migration: Ajouter la colonne content_blocks pour le système block-based
-- Date: 2025-02-05
-- Description: Permet aux créateurs de personnaliser la mise en page de leurs fiches ressources

-- Ajouter la colonne JSONB pour stocker les blocs de contenu
ALTER TABLE ressources
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT NULL;

-- Commentaire pour documenter la structure
COMMENT ON COLUMN ressources.content_blocks IS 'Block-based content layout (JSONB). Structure: { version, canvas, layout: { desktop, tablet?, mobile? }, metadata }';

-- Index GIN pour les requêtes sur le JSONB (optionnel, utile pour les filtres)
CREATE INDEX IF NOT EXISTS idx_ressources_content_blocks
ON ressources USING GIN (content_blocks)
WHERE content_blocks IS NOT NULL;

-- Exemple de structure attendue:
/*
{
  "version": 1,
  "canvas": {
    "width": 1200,
    "height": "auto",
    "gridSize": 8,
    "snapToGrid": true
  },
  "layout": {
    "desktop": [
      {
        "id": "uuid",
        "type": "title|image|carousel|creator|text|list|list-links|purchase|video|tip|separator",
        "position": {
          "x": 0,
          "y": 0,
          "width": 100,
          "height": "auto",
          "zIndex": 1
        },
        "style": {
          "backgroundPreset": "transparent",
          "borderRadius": 12,
          "padding": 16,
          "shadow": "none",
          "border": false,
          "opacity": 100
        },
        "data": { ... type-specific data ... },
        "locked": false,
        "visible": true
      }
    ],
    "mobile": [ ... optional mobile layout ... ]
  },
  "metadata": {
    "lastEditedAt": "ISO date",
    "lastEditedBy": "user_id",
    "templateName": "auto-generated|custom"
  }
}
*/
