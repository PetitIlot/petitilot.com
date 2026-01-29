# 🛡️ PROTOCOLE "ZERO ERROR" INSERTION SQL

Ce protocole doit être appliqué pour chaque génération de ressource afin d'éviter les erreurs de contraintes (NOT NULL) et de syntaxe SQL.

## 1. OBLIGATIONS DE STRUCTURE (Base de données)
- **SLUG OBLIGATOIRE** : Toujours générer un `slug` unique basé sur le titre (ex: `mon-jeu-de-bois`) pour éviter l'erreur `23502`.
- **ESCAPING DES APOSTROPHES** : Doubler systématiquement les apostrophes dans les textes (ex: `l''enfant`, `d''adresse`) pour éviter l'erreur `42601`.
- **GROUP_ID PERSISTANT** : Pour les traductions, conserver strictement le même `group_id` que la ressource originale.

## 2. FORMATAGE DES DONNÉES STRICT
- **THEMES & COMPETENCES** : Utiliser exclusivement le format `ARRAY['Tag1', 'Tag2']` pour les colonnes `text[]` de PostgreSQL.
- **MATERIEL_JSON** : Utiliser le format `CAST('...' AS jsonb)` ou `'...'::jsonb` pour l'insertion.
- **BOOLEANS** : Utiliser `true` ou `false` sans guillemets.

## 3. VÉRIFICATION DES CONTRAINTES MÉTIER
- **SÉCURITÉ < 3 ANS** : Si `age_min < 3`, la mention "Attention aux petites pièces ! Risque d'étouffement." doit être insérée dans le champ `astuces`.
- **LIMITES DE TAGS** : 
    - Maximum 2 compétences.
    - Maximum 3 thèmes.
- **RÉFÉRENTIEL** : Utiliser uniquement les termes exacts du "Référentiel des Compétences & Thèmes" (ex: "Motricité fine" et non "Agilité des mains").

## 4. TEMPLATE DE SORTIE ATTENDU
L'agent doit fournir la requête sous cette forme :
```sql
INSERT INTO ressources (id, group_id, lang, type, slug, title, subtitle, description, age_min, age_max, difficulte, autonomie, themes, competences, materiel_json, editeur, annee, collection, nb_joueurs_min, nb_joueurs_max, astuces) 
VALUES (uuid_generate_v4(), '...', 'fr', 'jeu', '...', '...', '...', '...', 3, 6, 'beginner', true, ARRAY['...'], ARRAY['...'], '[{"item": "...", "url": "...", "recup": false}]'::jsonb, '...', 2024, '...', 1, 4, '...');