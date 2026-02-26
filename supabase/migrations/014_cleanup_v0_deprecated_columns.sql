-- ============================================
-- Migration: Nettoyage V0 — Suppression colonnes dépréciées
-- Date: 2025-02-23
-- ============================================
-- Contexte: Le contenu (description, astuces, etc.) passe
-- désormais intégralement dans content_blocks (JSONB).
-- Les types livre/jeu sont supprimés du produit.
-- ============================================


-- 1. Supprimer les données de test (type livre/jeu)
--    Ces rows n'ont jamais été publiées (status pending_review)
-- ============================================
DELETE FROM ressources
WHERE type IN ('livre', 'jeu');


-- 2. Ajouter contrainte CHECK sur le type
--    Seuls les 3 types V1 sont autorisés désormais
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ressources_type_check'
  ) THEN
    ALTER TABLE ressources ADD CONSTRAINT ressources_type_check
      CHECK (type IN ('activite', 'motricite', 'alimentation'));
  END IF;
END $$;


-- 3. Supprimer les colonnes V0 spécifiques aux livres/jeux
-- ============================================
ALTER TABLE ressources
  DROP COLUMN IF EXISTS auteur,
  DROP COLUMN IF EXISTS illustrateur,
  DROP COLUMN IF EXISTS isbn,
  DROP COLUMN IF EXISTS collection,
  DROP COLUMN IF EXISTS editeur,
  DROP COLUMN IF EXISTS annee,
  DROP COLUMN IF EXISTS nb_joueurs_min,
  DROP COLUMN IF EXISTS nb_joueurs_max;


-- 4. Supprimer les colonnes de contenu texte V0
--    (remplacées par content_blocks JSONB — canvas)
-- ============================================
ALTER TABLE ressources
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS astuces,
  DROP COLUMN IF EXISTS materiel,
  DROP COLUMN IF EXISTS subtitle,
  DROP COLUMN IF EXISTS images_urls,
  DROP COLUMN IF EXISTS gallery_urls,
  DROP COLUMN IF EXISTS video_url,
  DROP COLUMN IF EXISTS pdf_url,
  DROP COLUMN IF EXISTS meta_seo;


-- ============================================
-- Colonnes conservées après migration (V1):
--   id, group_id, lang, type (✓ contrainte CHECK)
--   slug, title, vignette_url
--   age_min, age_max, duration, duration_max, duration_prep
--   intensity, difficulte, autonomie
--   themes, competences, categories, keywords
--   materials, materiel_json
--   is_premium, accept_free_credits, price_credits
--   content_blocks, status, creator_id
--   views_count, purchases_count, rating_avg, reviews_count
--   url_last_checked, url_status
--   published_at, rejection_reason
--   created_at, updated_at
-- ============================================
