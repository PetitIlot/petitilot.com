# Plan de Refonte : Wizard & Canvas Block-Based

## Vue d'ensemble

Refonte majeure du système de création de ressources pour passer d'un wizard rigide à un système modulaire avec canvas libre (style "tableau blanc avec post-its").

---

## PARTIE 1 : RESTRUCTURATION DU WIZARD

### État actuel → État cible

| Étape | Actuel | Cible |
|-------|--------|-------|
| 1 | title, subtitle, description, astuces, price_credits | title, vignette_url, price_credits + "accept_free_credits" |
| 1.5 | - | **NOUVEAU** : Collaboration (optionnel) |
| 2 | Pédagogie (âge, durée, intensité, difficulté, autonomie) | **INCHANGÉ** |
| 3 | Catégories, thèmes, compétences, mots-clés | **INCHANGÉ** |
| 4 | Matériel + liens affiliés | Matériel **SANS** liens affiliés |
| 5 | Media (URLs images/vidéos) | **SUPPRIMÉ** - fusionné dans canvas |
| 6 | Layout (canvas blocks) | Devient **ÉTAPE 5** - Canvas complet |
| 7 | Review | Devient **ÉTAPE 6** |

### Modifications détaillées

#### ÉTAPE 1 : StepBasicInfo.tsx

**À SUPPRIMER :**
- `subtitle` - Devient un bloc texte dans canvas
- `description` - Devient un bloc texte dans canvas
- `astuces` - Devient un bloc texte (type "tip") dans canvas

**À CONSERVER :**
- `title` - Titre de la ressource (requis)
- `price_credits` - Prix en crédits

**À AJOUTER :**
- `vignette_url` - Input URL pour image vignette (1:1)
- `accept_free_credits` - Checkbox "Accepte les crédits gratuits"
- Bouton "Ajouter collaborateurs" → ouvre étape 1.5

**Nouveau formulaire simplifié :**
```
┌─────────────────────────────────────┐
│ Titre *                             │
│ [________________________]          │
│                                     │
│ Image vignette (URL)                │
│ [________________________] [Preview]│
│                                     │
│ Prix en crédits                     │
│ [Slider 0-20] ○ Gratuit             │
│ ☐ Accepte les crédits gratuits      │
│                                     │
│ [👥 Ajouter collaborateurs]         │
└─────────────────────────────────────┘
```

#### ÉTAPE 4 : StepMaterials.tsx

**À SUPPRIMER :**
- Champ `url` dans `materiel_json` items
- UI d'ajout de liens affiliés
- Colonne "Lien" dans la liste du matériel

**À CONSERVER :**
- Sélection type budget (sans-materiel, maison, nature, etc.)
- Liste matériel avec autocomplete
- Toggle "Récup" par item

**Nouvelle structure MaterielItem :**
```typescript
interface MaterielItem {
  item: string      // Nom du matériel
  recup: boolean    // Récupérable/recyclable
  isCustom?: boolean // Suggestion personnalisée
  // URL SUPPRIMÉ - géré via bloc "list-links" dans canvas
}
```

#### ÉTAPE 5 : StepMedia.tsx → **SUPPRIMÉE**

Tous les médias sont maintenant gérés dans le canvas :
- `images_urls` → Bloc "image" avec saisie URL
- `gallery_urls` → Bloc "carousel" avec saisie URLs multiples
- `video_url` → Bloc "video" avec saisie URL
- `meta_seo` → supprimé

#### ÉTAPE 5 (nouveau) : Canvas Editor

Fusion de l'ancien StepMedia + StepLayout en un seul éditeur canvas libre.

---

## PARTIE 2 : REFONTE COMPLÈTE DU CANVAS

### Problèmes actuels

1. **Disposition rigide** : `verticalListSortingStrategy` = blocs empilés verticalement uniquement
2. **Pas de redimensionnement** : Pas de handles, taille via panel latéral
3. **Largeur fixe** : Tous les blocs font 100% de largeur
4. **Pas de positionnement libre** : Impossible de placer côte à côte
5. **Édition indirecte** : Propriétés via panel, pas sur le canvas
6. **Pas de z-index** : Pas de superposition possible

### Solution : Canvas libre avec react-rnd

**Bibliothèque recommandée :** `react-rnd` (React Resizable and Draggable)
- Drag libre sur canvas
- Resize avec handles (8 directions)
- Contraintes de bounds
- Snap to grid optionnel
- Z-index management

### Architecture du nouveau Canvas

```
┌─────────────────────────────────────────────────────────┐
│ TOOLBAR                                                 │
│ [+ Titre] [+ Texte] [+ Image] [+ Vidéo] [+ Liste] ...  │
│ [↩ Undo] [↪ Redo]                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   CANVAS (position: relative, overflow: auto)           │
│   ┌─────────────────────────────────────────────────┐   │
│   │                                                 │   │
│   │  ┌──────────┐  ┌────────────────────────────┐  │   │
│   │  │  IMAGE   │  │     TITRE (fixe)           │  │   │
│   │  │  block   │  │     drag-resize-color      │  │   │
│   │  └──────────┘  └────────────────────────────┘  │   │
│   │                                                 │   │
│   │  ┌────────────────────────────────────────────┐│   │
│   │  │  TEXTE (éditable)                          ││   │
│   │  │  drag-resize-color + rich text editor      ││   │
│   │  └────────────────────────────────────────────┘│   │
│   │                                                 │   │
│   │  ┌───────────────┐  ┌───────────────┐         │   │
│   │  │    LISTE      │  │    VIDEO      │         │   │
│   │  │   (éditable)  │  │  (éditable)   │         │   │
│   │  └───────────────┘  └───────────────┘         │   │
│   │                                                 │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ STATUS BAR : "5 blocs • Grille: 8px • Zoom: 100%"      │
└─────────────────────────────────────────────────────────┘
```

### Types de blocs

#### Blocs à données fixes (drag-drop-resize-color uniquement)

| Bloc | Source des données | Actions possibles |
|------|-------------------|-------------------|
| `title` | formData.title + categories/themes/competences | Position, taille, couleur fond, style titre |
| `creator` | Données créateur (avatar, nom, stats) | Position, taille, variant (full/compact) |
| `purchase` | price_credits + **fichier uploadé** | Position, taille, couleur bouton, **upload PDF** |

> ⚠️ **NOUVEAU : Système d'upload PDF**
> Le bloc `purchase` inclut maintenant une interface d'upload direct vers Supabase Storage.
> Voir **PARTIE 2B** pour les détails.

#### Blocs à contenu éditable (drag-drop-resize-color + édition inline)

| Bloc | Contenu | Éditeur inline |
|------|---------|----------------|
| `text` | Texte libre (remplace description/astuces) | Rich text (police, gras, italique, taille, couleur) |
| `list` | Liste d'items | Ajout/suppression items, bullets/numéros |
| `list-links` | Items + URLs (remplace liens affiliés) | Ajout items avec URL, badges |
| `image` | URL image | Input URL, object-fit, alt text |
| `carousel` | URLs images multiples | Gestion URLs, navigation settings |
| `video` | URL embed (YouTube/Instagram/TikTok) | Input URL, détection plateforme |
| `tip` | Texte astuce | Édition texte, icône, couleur accent |
| `separator` | - | Style (ligne/dots/wave), épaisseur, couleur, horizontal/vertical |

---

## PARTIE 2B : NOUVEAU SYSTÈME D'UPLOAD PDF

### Problème actuel

Le champ `pdf_url` stocke un lien externe (Google Drive, Canva, Dropbox) :
- ❌ Pas de contrôle sur l'accès au fichier
- ❌ Liens peuvent expirer ou changer
- ❌ Impossible de tracker les téléchargements précisément
- ❌ Dépendance à des services tiers

### Solution : Upload vers Supabase Storage

Remplacer `pdf_url` par un système d'upload direct :
- ✅ Fichiers hébergés sur notre infrastructure
- ✅ Contrôle total des accès (signed URLs, expiration)
- ✅ Tracking précis des téléchargements
- ✅ Pas de dépendance externe

### Architecture

```
Supabase Storage
└── ressources/
    └── {resource_id}/
        ├── file.pdf           # Fichier principal
        ├── file_v2.pdf        # Version mise à jour (optionnel)
        └── thumbnail.jpg      # Aperçu généré (futur)
```

### Interface utilisateur

Lors de l'ajout/édition d'un bloc `purchase` :

```
┌─────────────────────────────────────────────────┐
│ 📦 Bloc Achat / Téléchargement                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Fichier à télécharger                          │
│  ┌─────────────────────────────────────────┐   │
│  │  📄 mon-activite.pdf                    │   │
│  │  2.4 MB • Uploadé le 06/02/2025         │   │
│  │  [Remplacer] [Supprimer]                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ─── OU ───                                     │
│                                                 │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │                                         │   │
│  │   📁 Glissez votre fichier ici          │   │
│  │      ou cliquez pour parcourir          │   │
│  │                                         │   │
│  │   PDF, ZIP • Max 50 MB                  │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                                 │
│  Prix : 5 crédits  [Modifier dans Étape 1]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Nouveau type PurchaseBlockData

```typescript
interface PurchaseBlockData {
  variant: 'full' | 'compact' | 'minimal'
  showPrice: boolean
  buttonText?: string
  buttonColor?: string

  // NOUVEAU : Fichier uploadé (remplace pdf_url)
  file?: {
    path: string           // Chemin dans Storage: "ressources/{id}/file.pdf"
    name: string           // Nom original: "mon-activite.pdf"
    size: number           // Taille en bytes
    mimeType: string       // "application/pdf" | "application/zip"
    uploadedAt: string     // ISO date
  }
}
```

### Composants à créer

```
/components/blocks/
├── PurchaseBlock.tsx         # Modifié : affiche fichier uploadé
└── editor/
    └── FileUploader.tsx      # NOUVEAU : dropzone + upload logic

/lib/
└── storage.ts                # NOUVEAU : helpers Supabase Storage
    ├── uploadResourceFile()
    ├── deleteResourceFile()
    ├── getSignedDownloadUrl()
    └── getFileMetadata()
```

---

## PARTIE 3 : MIGRATION BASE DE DONNÉES

### Champs à déprécier puis supprimer

```sql
-- Ces colonnes deviennent obsolètes, migrer les données vers content_blocks puis supprimer
-- subtitle      → Bloc texte
-- description   → Bloc texte
-- astuces       → Bloc tip
-- video_url     → Bloc video dans content_blocks
-- images_urls   → Bloc image dans content_blocks
-- gallery_urls  → Bloc carousel dans content_blocks
-- pdf_url       → Fichier uploadé dans Storage (bloc purchase)
```

### Nouveaux champs à ajouter

```sql
ALTER TABLE ressources
ADD COLUMN IF NOT EXISTS accept_free_credits BOOLEAN DEFAULT FALSE;
```

---

## PARTIE 4 : ORDRE D'IMPLÉMENTATION

### Phase 1 : Préparation (1-2 jours)
1. Installer `react-rnd` : `npm install react-rnd`
2. Créer les nouveaux types dans `/lib/blocks/types.ts`
3. Mettre à jour `ResourceFormData` (supprimer champs obsolètes, ajouter nouveaux)
4. Créer migration SQL pour `accept_free_credits`

### Phase 2 : Wizard simplifié (1 jour)
1. Modifier `StepBasicInfo.tsx` - nouveau formulaire simplifié
2. Modifier `StepMaterials.tsx` - retirer liens affiliés
3. Supprimer `StepMedia.tsx`
4. Renommer étapes dans `ResourceWizard.tsx`
5. Mettre à jour `StepReview.tsx`

### Phase 3 : Canvas libre - Base (2-3 jours)
1. Créer `FreeformCanvas.tsx` avec react-rnd
2. Créer `BlockWrapper.tsx` pour encapsuler chaque bloc
3. Implémenter drag & drop libre
4. Implémenter resize handles
5. Implémenter snap-to-grid optionnel
6. Implémenter Undo/Redo (historique des états)

### Phase 4 : Blocs éditables (2-3 jours)
1. Créer `InlineEditor.tsx` avec rich text basique
2. Modifier `TextBlock.tsx` pour édition inline
3. Modifier `ImageBlock.tsx` pour input URL intégré
4. Modifier `VideoBlock.tsx` pour input URL intégré
5. Modifier `CarouselBlock.tsx` pour gestion URLs
6. Modifier `ListLinksBlock.tsx` pour édition items
7. Créer `FileUploader.tsx` pour upload PDF
8. Créer `/lib/storage.ts` helpers Supabase Storage
9. Modifier `PurchaseBlock.tsx` avec interface upload
10. Configurer bucket Storage "ressources" dans Supabase

### Phase 5 : Toolbar & UX (1 jour)
1. Créer `CanvasToolbar.tsx` - barre d'ajout de blocs + Undo/Redo
2. Créer `BlockContextMenu.tsx` - menu clic-droit
3. Ajouter raccourcis clavier (Suppr, Ctrl+Z, Ctrl+Y, Ctrl+D)
4. Ajouter indicateurs visuels (sélection, hover)

### Phase 6 : Collaboration (2-3 jours)
1. Créer table `resource_collaborators`
2. Créer `StepCollaboration.tsx`
3. Implémenter recherche/invitation créateurs
4. Implémenter partage revenus
5. Système de validation collaborateurs
6. Notifications (email + in-app)

### Phase 7 : Templates & Sauvegarde (1 jour)
1. Adapter templates prédéfinis au nouveau format
2. Mettre à jour sauvegarde/chargement templates custom
3. Tester migration données existantes

### Phase 8 : Tests & Polish (1-2 jours)
1. Tests manuels complets
2. Responsive (preview mobile/tablet)
3. Performance (beaucoup de blocs)
4. Corrections bugs

---

## PARTIE 5 : RISQUES & MITIGATIONS

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Performance avec nombreux blocs | Moyen | Virtualisation, lazy rendering |
| Compatibilité anciennes ressources | Haut | Migration script + fallback |
| Complexité UX canvas libre | Moyen | Tutoriel, templates par défaut |
| Mobile editing difficile | Moyen | Création PC only, preview mobile |
| react-rnd bugs | Faible | Fallback vers implémentation custom |

---

## PARTIE 6 : DÉCISIONS PRISES

| Question | Décision |
|----------|----------|
| **Mobile** | Création uniquement sur PC, preview seul sur mobile |
| **Responsive** | À réfléchir - empilage vertical pas idéal |
| **Collaboration** | ✅ OUI - voir PARTIE 7 |
| **Undo/Redo** | ✅ OUI - implémenter dans le canvas |
| **Export** | ❌ NON |

---

## PARTIE 7 : SYSTÈME DE COLLABORATION

### Concept

Permettre à plusieurs créateurs de co-créer une ressource avec partage des revenus.

### Flux utilisateur

```
ÉTAPE 1 : Infos de base
    │
    └── [+ Ajouter collaborateur] ← Bouton optionnel
            │
            ▼
ÉTAPE 1.5 : Collaboration (si activé)
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  👥 Collaborateurs                              │
    │                                                 │
    │  ┌─────────────────────────────────────────┐   │
    │  │ 🔍 Rechercher un créateur...            │   │
    │  └─────────────────────────────────────────┘   │
    │                                                 │
    │  Collaborateurs ajoutés :                       │
    │                                                 │
    │  ┌─────────────────────────────────────────┐   │
    │  │ 👤 Marie Dupont (@marie_crea)           │   │
    │  │    ☐ Peut éditer    💰 40%              │   │
    │  │    ⏳ En attente de validation          │   │
    │  └─────────────────────────────────────────┘   │
    │                                                 │
    │  ┌─────────────────────────────────────────┐   │
    │  │ 👤 Jean Martin (@jean_m)                │   │
    │  │    ☑ Peut éditer    💰 20%              │   │
    │  │    ✅ Validé                            │   │
    │  └─────────────────────────────────────────┘   │
    │                                                 │
    │  Vous : 40%                                     │
    │  ───────────────────────────                    │
    │  Total : 100% ✓                                 │
    │                                                 │
    └─────────────────────────────────────────────────┘
            │
            ▼
    [Continuer] → Bloqué tant que collaborateurs n'ont pas validé
```

### Modèle de données

```typescript
// Nouvelle table : resource_collaborators
interface ResourceCollaborator {
  id: string
  resource_id: string        // FK vers ressources
  creator_id: string         // FK vers creators
  invited_by: string         // FK vers creators (celui qui a invité)

  // Permissions
  can_edit: boolean          // Peut modifier la ressource

  // Revenus
  revenue_share: number      // Pourcentage (0-100)

  // Statut
  status: 'pending' | 'accepted' | 'rejected'
  invited_at: string
  responded_at: string | null
}
```

### Migration SQL

```sql
CREATE TABLE resource_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES creators(id),

  can_edit BOOLEAN DEFAULT FALSE,
  revenue_share DECIMAL(5,2) DEFAULT 0 CHECK (revenue_share >= 0 AND revenue_share <= 100),

  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  UNIQUE(resource_id, creator_id)
);

-- Index pour requêtes fréquentes
CREATE INDEX idx_collab_resource ON resource_collaborators(resource_id);
CREATE INDEX idx_collab_creator ON resource_collaborators(creator_id);
CREATE INDEX idx_collab_status ON resource_collaborators(status);
```

### Règles métier

1. **Invitation** : Le créateur principal peut inviter d'autres créateurs
2. **Validation** : Chaque collaborateur doit accepter avant soumission admin
3. **Revenus** : Total doit = 100%, minimum 1% par collaborateur
4. **Édition** : Si `can_edit=true`, le collaborateur peut modifier le canvas
5. **Publication** : Bloquée tant qu'un collaborateur n'a pas répondu
6. **Retrait** : Un collaborateur peut se retirer (revenus redistribués)

### Impact sur le wizard

| Étape | Modification |
|-------|-------------|
| 1 | Ajouter bouton "Collaborateurs" |
| 1.5 | NOUVELLE étape (conditionnelle) |
| Review | Afficher liste collaborateurs + statuts |
| Submit | Bloquer si collaborateurs pending |

---

## Résumé

Cette refonte transforme le wizard de 7 étapes → 6 étapes (+1.5 optionnelle pour collaboration) et remplace le canvas rigide par un vrai éditeur libre style Figma/Miro. Les données média et texte sont maintenant intégrées directement dans les blocs, simplifiant le modèle de données tout en offrant une flexibilité maximale aux créateurs.

**Estimation totale : 12-17 jours de développement**

- Base wizard + canvas : 10-14 jours
- Système upload PDF : +2 jours
- Système collaboration : +2-3 jours
