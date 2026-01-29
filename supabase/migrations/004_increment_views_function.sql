-- Fonction pour incrémenter le compteur de vues d'une ressource
CREATE OR REPLACE FUNCTION increment_views(resource_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ressources
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = resource_id;
END;
$$;
