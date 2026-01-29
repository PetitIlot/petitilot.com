# 📸 Configuration Cloudinary pour Petit Îlot

## 1. Récupérer les identifiants Cloudinary

1. Connexion sur [Cloudinary Dashboard](https://cloudinary.com/console)
2. Dans le dashboard, tu trouveras :
   - **Cloud Name** : `dxxxxx` (le nom de ton cloud)
   - **API Key** : (pas nécessaire pour les images publiques)
   - **API Secret** : (à garder secret)

## 2. Configurer les variables d'environnement

Ajoute dans ton `.env.local` :

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton-cloud-name
```

## 3. Structure des dossiers Cloudinary

Organise tes images comme ceci sur Cloudinary :

```
petit-ilot/
├── hero-home              # Image hero page d'accueil (1920x1080)
├── activities/
│   ├── yoga-enfants
│   ├── peinture-sensorielle
│   └── parcours-moteur
├── books/
│   ├── le-grand-livre-nature
│   └── emotions-enfants
└── games/
    ├── jeu-cooperative
    └── memory-animaux
```

## 4. Upload d'images

### Via l'interface Cloudinary

1. Va sur Cloudinary Dashboard > Media Library
2. Clique sur "Upload"
3. **Important** : Upload dans le bon dossier (ex: `petit-ilot/activities/`)
4. Nomme tes fichiers en **kebab-case** (ex: `yoga-enfants`, `peinture-sensorielle`)

### Convention de nommage

- ✅ `yoga-enfants` (kebab-case)
- ✅ `parcours-moteur` (sans accents)
- ❌ `Yoga Enfants` (pas d'espaces)
- ❌ `yoga_enfants` (éviter underscore)

## 5. Optimisations automatiques

Le helper Cloudinary gère automatiquement :
- ✅ Conversion en WebP (format moderne)
- ✅ Compression intelligente (quality: 80%)
- ✅ Responsive (width/height selon besoin)
- ✅ Lazy loading (Next.js Image)

## 6. Utilisation dans le code

### Image Hero
```typescript
import { getHeroImageUrl } from '@/lib/cloudinary'

// Utilise automatiquement "petit-ilot/hero-home"
const heroUrl = getHeroImageUrl()
```

### Image d'activité
```typescript
import { getActivityImageUrl } from '@/lib/cloudinary'

// Pour une activité avec publicId dans Supabase
const imageUrl = getActivityImageUrl('petit-ilot/activities/yoga-enfants')
```

### Image personnalisée
```typescript
import { getCloudinaryUrl } from '@/lib/cloudinary'

const imageUrl = getCloudinaryUrl('petit-ilot/custom/image', {
  width: 800,
  height: 600,
  quality: 90,
  format: 'webp'
})
```

## 7. Dans Supabase

Quand tu crées une ressource, stocke uniquement le **publicId** Cloudinary :

```sql
INSERT INTO ressources (
  title,
  images_urls,
  ...
) VALUES (
  'Yoga pour enfants',
  ARRAY['petit-ilot/activities/yoga-enfants'], -- Juste le publicId
  ...
);
```

Le code ajoutera automatiquement le domaine Cloudinary et les transformations.

## 8. Développement local vs Production

- **Local** : Si `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` n'est pas défini, utilise `/public/images/`
- **Production** : Utilise automatiquement Cloudinary avec optimisations

## 9. Checklist avant mise en production

- [ ] Toutes les images sont uploadées sur Cloudinary
- [ ] Noms des fichiers en kebab-case
- [ ] Organisées dans les bons dossiers (`petit-ilot/activities/`, etc.)
- [ ] Variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` configurée sur Vercel
- [ ] Tester en production que les images se chargent

## 10. Bonnes pratiques

- Upload en **JPG haute qualité** (Cloudinary convertira en WebP)
- **Dimensions recommandées** :
  - Hero : 1920x1080px
  - Activités : 800x600px (4:3)
  - Livres : 400x600px (2:3)
  - Jeux : 800x800px (carré)
- **Poids max** avant upload : 2-3MB (Cloudinary optimisera)
