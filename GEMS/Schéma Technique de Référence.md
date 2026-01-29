# Schéma Technique de Référence : Petit Îlot

Ce document définit la structure exacte de la base de données Supabase et les contraintes de formatage pour tous les agents.

---

## 1. Table `ressources` (Le Cœur)

| Colonne | Type | Contraintes / Format | Description |
|---------|------|---------------------|-------------|
| `id` | UUID | Primary Key (Auto) | Identifiant unique de la ligne. |
| `group_id` | UUID | Not Null | Clé de liaison : La même pour une activité en FR, EN et ES. |
| `lang` | String | `'fr'` \| `'en'` \| `'es'` | Langue de la ressource. |
| `type` | String | Enum (voir section 2) | Catégorie principale de la ressource. |
| `title` | String | Max 60 char. | Titre accrocheur et court. |
| `subtitle` | String | Max 120 char. | Bénéfice direct pour l'enfant/parent. |
| `description` | Text | Markdown | Déroulé de l'activité / description. |
| `astuces` | Text | Markdown | Le "Conseil Pro" (Enseignante/Papa). |
| `age_min` | Integer | 0 à 6 | Âge minimum recommandé. |
| `age_max` | Integer | 0 à 6 | Âge maximum recommandé. |
| `difficulte` | String | `'beginner'` \| `'advanced'` \| `'expert'` | Niveau de difficulté. |
| `autonomie` | Boolean | True / False | L'enfant peut-il faire seul ? |
| `duration` | Integer | Minutes | Durée estimée (min). |
| `duration_max` | Integer | Minutes (optionnel) | Durée max pour fourchette (ex: 15-20 min). |
| `themes` | Array | text[] | Tags thématiques (ex: `['Hiver', 'Nature']`). |
| `competences` | Array | text[] | Tags éducatifs (ex: `['Logique', 'Motricité fine']`). |
| `images_urls` | Array | text[] (URLs Cloudinary) | Image principale / vignette. |
| `gallery_urls` | Array | text[] (URLs Cloudinary) | Galerie photos (carousel sur la fiche). |
| `video_url` | String | URL | Lien vers vidéo (Instagram Reel, etc.). |
| `pdf_url` | String | URL | Lien vers PDF téléchargeable. |
| `materiel_json` | JSONB | Array of Objects | Liste du matériel nécessaire. |
| `is_premium` | Boolean | Default: False | Nécessite un crédit pour être vu ? |

### Colonnes spécifiques Livres/Jeux

| Colonne | Type | Utilisé pour | Description |
|---------|------|--------------|-------------|
| `auteur` | String | Livres, Jeux | Auteur ou créateur. |
| `editeur` | String | Livres, Jeux | Éditeur ou marque. |
| `annee` | Integer | Livres, Jeux | Année de publication. |
| `illustrateur` | String | Livres | Illustrateur du livre. |
| `isbn` | String | Livres | Code ISBN (optionnel). |
| `collection` | String | Livres | Collection du livre. |
| `nb_joueurs_min` | Integer | Jeux | Nombre minimum de joueurs. |
| `nb_joueurs_max` | Integer | Jeux | Nombre maximum de joueurs. |

---

## 2. Énumérations et Listes Autorisées (Strict)

Les agents doivent piocher exclusivement dans ces listes pour garantir le bon fonctionnement des filtres du site :

### Types de Ressources
- `activite` - Activités manuelles et créatives
- `motricite` - Activités de motricité
- `alimentation` - Recettes (affiché comme "Recette" dans l'UI)
- `livre` - Livres recommandés
- `jeu` - Jeux de société

### Difficultés
- `beginner` : Installation < 2 min, matériel basique.
- `advanced` : Demande un peu de préparation ou de surveillance.
- `expert` : Demande une présence active du parent et matériel spécifique.

### Langues
- `fr` - Français
- `en` - English
- `es` - Español

---

## 3. Formats de Sortie attendus

### Format `materiel_json`

```json
[
  {
    "item": "Nom de l'objet",
    "url": "Lien d'affiliation optionnel (ou null)",
    "recup": true
  },
  {
    "item": "Ciseaux",
    "url": null,
    "recup": false
  }
]
```

### Format `images_urls` et `gallery_urls`

URLs Cloudinary complètes avec transformations optionnelles :

```json
[
  "https://res.cloudinary.com/CLOUD_NAME/image/upload/c_fill,w_600,h_800/v1/nom-image"
]
```

Transformations utiles :
- `c_fill` - Crop pour remplir
- `w_600,h_800` - Dimensions
- `q_auto` - Qualité automatique
- `f_auto` - Format automatique (webp)

### Format `themes` et `competences`

Arrays PostgreSQL :

```
{"Hiver", "Nature", "Noël"}
```

Ou format JSON pour insertion :

```json
["Hiver", "Nature", "Noël"]
```

---

## 4. Règles de Cohérence

1. **Lien Multilingue** : L'Agent Traducteur doit impérativement réutiliser le `group_id` généré par l'Agent Concepteur.

2. **Sécurité** : Si `age_min < 3`, ajouter obligatoirement une mention sur les petites pièces (étouffement) dans `astuces`.

3. **Images** : Toujours prévoir un fallback si `images_urls` est vide (image Unsplash par défaut).

4. **Durée** : Utiliser `duration` seul pour durée fixe, ou `duration` + `duration_max` pour une fourchette (ex: 15-20 min).

5. **Lien d'achat** : Pour livres/jeux, utiliser `materiel_json[0].url` pour le lien Amazon affilié.

---

## 5. Pages et Routes

| Route | Type affiché | Description |
|-------|--------------|-------------|
| `/[lang]/activites` | activite, motricite, alimentation | Page Ressources (anciennement Activités) |
| `/[lang]/activites/[id]` | * | Fiche détail activité |
| `/[lang]/livres` | livre | Liste des livres |
| `/[lang]/livres/[id]` | livre | Fiche détail livre |
| `/[lang]/jeux` | jeu | Liste des jeux |
| `/[lang]/jeux/[id]` | jeu | Fiche détail jeu |
