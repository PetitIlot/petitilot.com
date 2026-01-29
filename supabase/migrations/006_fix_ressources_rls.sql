-- Fix: La RLS doit vérifier que creator_id appartient à l'utilisateur via creators.user_id
-- car creator_id est une FK vers creators(id), pas vers auth.users(id)

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "ressources_select_own" ON ressources;
DROP POLICY IF EXISTS "ressources_insert_own" ON ressources;
DROP POLICY IF EXISTS "ressources_update_own" ON ressources;
DROP POLICY IF EXISTS "ressources_delete_own" ON ressources;

-- Les créateurs peuvent voir leurs propres ressources (tous statuts)
CREATE POLICY "ressources_select_own" ON ressources
  FOR SELECT USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Les créateurs peuvent créer des ressources avec leur creator_id
CREATE POLICY "ressources_insert_own" ON ressources
  FOR INSERT WITH CHECK (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Les créateurs peuvent modifier leurs ressources
CREATE POLICY "ressources_update_own" ON ressources
  FOR UPDATE USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
  );

-- Les créateurs peuvent supprimer leurs ressources (brouillons seulement)
CREATE POLICY "ressources_delete_own" ON ressources
  FOR DELETE USING (
    creator_id IN (SELECT id FROM creators WHERE user_id = auth.uid())
    AND status = 'draft'
  );
