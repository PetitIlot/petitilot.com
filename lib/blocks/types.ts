/**
 * Block-based Content System v2
 * Structure de données pour le système de blocs modulaires (canvas libre)
 *
 * CHANGEMENTS v2:
 * - Position en pixels (pas en %) pour positionnement libre
 * - ImageBlockData: stocke URL directement
 * - CarouselBlockData: stocke array d'URLs
 * - VideoBlockData: stocke URL directement
 * - PurchaseBlockData: fichier uploadé vers Storage
 * - TextBlockData: rich text avec HTML
 * - ListLinksBlockData: items custom uniquement
 * - SeparatorBlockData: direction ajoutée
 */

// Types de blocs disponibles (v2.1 - tip supprimé car doublon avec text)
export type BlockType =
  | 'title'          // Bloc titre complet avec badges, tags, âge, durée, difficulté
  | 'image'          // Image unique (URL saisie directement)
  | 'carousel'       // Galerie/carrousel d'images (URLs saisies)
  | 'carousel-video' // Galerie/carrousel de vidéos (NOUVEAU v2.1)
  | 'creator'        // Widget créateur
  | 'text'           // Zone de texte libre (avec styles)
  | 'list'           // Liste simple (items custom)
  | 'list-links'     // Liste avec liens (items + URLs)
  | 'purchase'       // Bouton achat/téléchargement + upload fichier
  | 'video'          // Lecteur vidéo embed (URL saisie)
  | 'tip'            // @deprecated - utiliser text à la place
  | 'separator'      // Séparateur visuel

// ============================================
// Position libre sur canvas (en pixels)
// ============================================

export interface BlockPosition {
  x: number           // Position X en pixels depuis la gauche
  y: number           // Position Y en pixels depuis le haut
  width: number       // Largeur en pixels
  height: number | 'auto'  // Hauteur en pixels ou 'auto'
  zIndex: number      // Ordre d'empilement (z-index)
}

// Style personnalisable d'un bloc
export interface BlockStyle {
  backgroundColor?: string    // Couleur de fond (hex, rgba, ou preset)
  backgroundPreset?: 'sage' | 'terracotta' | 'sky' | 'mauve' | 'transparent' | 'surface'
  borderRadius?: number       // Arrondi des coins en px
  padding?: number            // Padding interne en px
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'apple'  // Ombre
  border?: boolean            // Bordure visible
  borderColor?: string        // Couleur bordure
  opacity?: number            // Opacité (0-100)
}

// ============================================
// Données spécifiques par type de bloc
// ============================================

// Bloc Titre - Données fixes depuis la ressource (v2.1 - options de style étendues)
export interface TitleBlockData {
  // Options d'affichage (toujours true en v2.1, badges toujours visibles)
  showBadges?: boolean        // DEPRECATED: toujours afficher
  showThemes?: boolean        // DEPRECATED: toujours afficher
  showCompetences?: boolean   // DEPRECATED: toujours afficher
  // Style du titre
  titleSize: number           // Taille en pixels (ex: 24, 32, 40)
  alignment: 'left' | 'center' | 'right'
  // Couleurs
  titleColor?: string         // Couleur du titre (hex)
  backgroundColor?: string    // Couleur de fond (hex)
  borderColor?: string        // Couleur de bordure (hex)
  // Bordure
  borderRadius?: 'rounded' | 'square'  // Type de coins
}

// Bloc Image - URL saisie directement (MODIFIÉ v2.1)
export interface ImageBlockData {
  url: string                // URL de l'image (saisie par l'utilisateur)
  alt?: string               // Texte alternatif
  objectFit: 'cover' | 'contain' | 'fill'
  showOverlay?: boolean      // Overlay sombre pour texte par-dessus
  linkUrl?: string           // Lien optionnel au clic
  borderRadius?: 'rounded' | 'square'  // Type de coins
}

// Bloc Carrousel - URLs saisies directement (MODIFIÉ v2.1)
export interface CarouselBlockData {
  images: Array<{            // Liste d'images avec leurs URLs
    url: string
    alt?: string
  }>
  carouselType?: 'slide' | 'fade' | 'coverflow' | 'cards'  // Type de carousel
  showDots: boolean          // Indicateurs de pagination
  showArrows: boolean        // Flèches navigation
  autoPlay: boolean          // Défilement automatique
  interval: number           // Intervalle en ms
  borderRadius?: 'rounded' | 'square'
}

// Bloc Carrousel Vidéo (NOUVEAU v2.1)
export interface CarouselVideoBlockData {
  videos: Array<{
    url: string              // URL YouTube/Instagram/TikTok
    platform: 'youtube' | 'instagram' | 'tiktok' | 'auto'
  }>
  carouselType?: 'slide' | 'fade' | 'coverflow' | 'cards'
  showDots: boolean
  showArrows: boolean
  autoPlay: boolean
  interval: number
}

// Bloc Créateur - Données fixes (MODIFIÉ v2.1)
export interface CreatorBlockData {
  variant: 'full' | 'compact' | 'minimal' | 'collaborators'  // Style d'affichage
  showFollowButton: boolean
  showStats: boolean         // Nombre de ressources, followers
  // Couleurs
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
  // Données pour variante 'collaborators' - affiche créateur principal + collaborateurs
  collaborators?: Array<{
    id: string               // ID du collaborateur
    name: string             // Nom affiché
    avatar?: string          // URL avatar
    role?: string            // Rôle (ex: "Co-créateur", "Illustrateur")
    revenueShare?: number    // % de revenus (optionnel, pour info)
  }>
  showRevenueShare?: boolean  // Afficher les % (optionnel, mode admin)
}

// Bloc Texte - Rich text avec formatage (MODIFIÉ v2.1)
export interface TextBlockData {
  content: string            // Contenu texte (supporte retours à la ligne)
  // Style du texte
  fontSize?: number          // Taille en pixels
  fontFamily?: 'default' | 'serif' | 'mono' | 'quicksand'
  alignment?: 'left' | 'center' | 'right'
  // Couleurs
  textColor?: string         // Couleur du texte (hex)
  backgroundColor?: string   // Couleur de fond (hex)
  borderColor?: string       // Couleur de bordure (hex)
  // Bordure
  borderRadius?: 'rounded' | 'square'
}

// Bloc Liste simple - Items custom (MODIFIÉ v2.1)
export interface ListBlockData {
  title?: string             // Titre optionnel de la liste
  items: string[]            // Liste d'items (saisie directe)
  bulletStyle: 'dot' | 'check' | 'number' | 'dash' | 'none'
  columns: 1 | 2 | 3         // Nombre de colonnes
  isChecklist?: boolean      // Afficher comme liste à cocher interactive
  // Style
  fontSize?: number
  fontFamily?: 'default' | 'serif' | 'mono' | 'quicksand'
  alignment?: 'left' | 'center' | 'right'
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
}

// Bloc Liste avec liens - Items custom (MODIFIÉ v2.1)
export interface ListLinksBlockData {
  title?: string
  items: Array<{
    label: string
    url: string
    icon?: string            // Emoji ou icône
  }>
  showAffiliateNote: boolean // Note sur les liens affiliés
  // Style
  fontSize?: number
  fontFamily?: 'default' | 'serif' | 'mono' | 'quicksand'
  alignment?: 'left' | 'center' | 'right'
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
}

// Bloc Achat/Téléchargement - Avec upload fichier (MODIFIÉ v2.1)
export interface PurchaseBlockData {
  variant: 'full' | 'compact' | 'minimal'
  showPrice: boolean
  buttonText?: string        // Texte personnalisé du bouton
  buttonColor?: string       // Couleur du bouton (hex)
  // Couleurs du bloc
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'

  // Fichier uploadé vers Supabase Storage (remplace pdf_url)
  file?: {
    path: string             // Chemin dans Storage: "ressources/{id}/file.pdf"
    name: string             // Nom original du fichier
    size: number             // Taille en bytes
    mimeType: string         // "application/pdf" | "application/zip" | etc.
    uploadedAt: string       // ISO date d'upload
  }
}

// Bloc Vidéo - URL saisie directement (MODIFIÉ v2)
export interface VideoBlockData {
  url: string                // URL embed (YouTube/Instagram/TikTok)
  platform: 'instagram' | 'youtube' | 'tiktok' | 'auto'
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '4:3'
}

// Bloc Astuce
export interface TipBlockData {
  content: string            // Texte de l'astuce (HTML pour formatage)
  icon: 'lightbulb' | 'star' | 'heart' | 'info' | 'warning' | 'chef'
  accentColor: 'sage' | 'terracotta' | 'sky' | 'mauve'
}

// Bloc Séparateur (MODIFIÉ v2)
export interface SeparatorBlockData {
  style: 'line' | 'dots' | 'wave' | 'space'
  direction: 'horizontal' | 'vertical'  // NOUVEAU
  thickness: number
  color?: string
}

// ============================================
// Union type pour toutes les données de blocs
// ============================================

export type BlockData =
  | { type: 'title'; data: TitleBlockData }
  | { type: 'image'; data: ImageBlockData }
  | { type: 'carousel'; data: CarouselBlockData }
  | { type: 'carousel-video'; data: CarouselVideoBlockData }
  | { type: 'creator'; data: CreatorBlockData }
  | { type: 'text'; data: TextBlockData }
  | { type: 'list'; data: ListBlockData }
  | { type: 'list-links'; data: ListLinksBlockData }
  | { type: 'purchase'; data: PurchaseBlockData }
  | { type: 'video'; data: VideoBlockData }
  | { type: 'tip'; data: TipBlockData }  // @deprecated
  | { type: 'separator'; data: SeparatorBlockData }

// ============================================
// Structure complète d'un bloc
// ============================================

export interface ContentBlock {
  id: string                 // UUID unique du bloc
  type: BlockType
  position: BlockPosition
  style: BlockStyle
  data: BlockData['data']    // Données spécifiques au type
  locked?: boolean           // Bloc verrouillé (non déplaçable)
  visible?: boolean          // Visibilité (pour masquer temporairement)
}

// ============================================
// Layout responsive
// ============================================

export interface ResponsiveLayout {
  desktop: ContentBlock[]    // Layout desktop (>= 1024px)
  tablet?: ContentBlock[]    // Layout tablette (768-1023px) - optionnel
  mobile?: ContentBlock[]    // Layout mobile (< 768px) - optionnel, auto-généré si absent
}

// ============================================
// Configuration du canvas
// ============================================

export interface CanvasConfig {
  width: number              // Largeur de référence en px (ex: 800)
  height: number | 'auto'    // Hauteur totale ou auto
  backgroundColor?: string
  backgroundImage?: string
  gridSize: number           // Taille de la grille d'alignement (ex: 8)
  snapToGrid: boolean        // Snap magnétique à la grille
}

// ============================================
// Historique pour Undo/Redo
// ============================================

export interface CanvasHistoryEntry {
  blocks: ContentBlock[]
  timestamp: number
  action: string             // Description de l'action (ex: "Bloc ajouté", "Position modifiée")
}

export interface CanvasHistory {
  entries: CanvasHistoryEntry[]
  currentIndex: number       // Index actuel dans l'historique
  maxEntries: number         // Nombre max d'entrées (ex: 50)
}

// ============================================
// Structure complète stockée en JSONB
// ============================================

export interface ContentBlocksData {
  version: number            // Version du schema (2 pour cette version)
  canvas: CanvasConfig
  layout: ResponsiveLayout
  metadata?: {
    lastEditedAt?: string
    lastEditedBy?: string
    templateName?: string    // Si créé depuis un template
  }
}

// ============================================
// Valeurs par défaut
// ============================================

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  backgroundPreset: 'transparent',
  borderRadius: 12,
  padding: 16,
  shadow: 'none',
  border: false,
  opacity: 100
}

export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 800,               // Largeur de référence réduite pour canvas libre
  height: 'auto',
  gridSize: 8,
  snapToGrid: true
}

export const DEFAULT_POSITION: BlockPosition = {
  x: 0,
  y: 0,
  width: 400,              // Largeur par défaut en pixels
  height: 'auto',
  zIndex: 1
}

// ============================================
// Helpers pour créer des blocs
// ============================================

export function createBlock(
  type: BlockType,
  data: BlockData['data'],
  position?: Partial<BlockPosition>,
  style?: Partial<BlockStyle>
): ContentBlock {
  return {
    id: crypto.randomUUID(),
    type,
    position: { ...DEFAULT_POSITION, ...position },
    style: { ...DEFAULT_BLOCK_STYLE, ...style },
    data,
    locked: false,
    visible: true
  }
}

// ============================================
// Presets de blocs pour démarrage rapide (v2)
// ============================================

export const BLOCK_PRESETS: Record<BlockType, Partial<ContentBlock>> = {
  title: {
    position: { x: 20, y: 20, width: 760, height: 'auto', zIndex: 10 },
    data: {
      titleSize: 32,
      alignment: 'left',
      borderRadius: 'rounded'
    } as TitleBlockData
  },
  image: {
    position: { x: 20, y: 20, width: 400, height: 300, zIndex: 1 },
    data: {
      url: '',
      objectFit: 'cover',
      borderRadius: 'rounded'
    } as ImageBlockData
  },
  carousel: {
    position: { x: 20, y: 20, width: 600, height: 400, zIndex: 1 },
    data: {
      images: [],
      carouselType: 'slide',
      showDots: true,
      showArrows: true,
      autoPlay: false,
      interval: 3000,
      borderRadius: 'rounded'
    } as CarouselBlockData
  },
  'carousel-video': {
    position: { x: 20, y: 20, width: 600, height: 400, zIndex: 1 },
    data: {
      videos: [],
      carouselType: 'slide',
      showDots: true,
      showArrows: true,
      autoPlay: false,
      interval: 5000
    } as CarouselVideoBlockData
  },
  creator: {
    position: { x: 20, y: 20, width: 350, height: 'auto', zIndex: 5 },
    data: {
      variant: 'full',
      showFollowButton: true,
      showStats: true,
      borderRadius: 'rounded'
    } as CreatorBlockData
  },
  text: {
    position: { x: 20, y: 20, width: 500, height: 'auto', zIndex: 1 },
    data: {
      content: 'Votre texte ici...',
      fontSize: 16,
      fontFamily: 'default',
      alignment: 'left',
      borderRadius: 'rounded'
    } as TextBlockData
  },
  list: {
    position: { x: 20, y: 20, width: 350, height: 'auto', zIndex: 1 },
    style: { backgroundPreset: 'surface', borderRadius: 16, padding: 24, border: true },
    data: {
      title: 'Liste',
      items: [],
      bulletStyle: 'dot',
      columns: 1,
      isChecklist: false,
      fontSize: 14,
      fontFamily: 'default',
      alignment: 'left',
      borderRadius: 'rounded'
    } as ListBlockData
  },
  'list-links': {
    position: { x: 20, y: 20, width: 350, height: 'auto', zIndex: 1 },
    style: { backgroundPreset: 'surface', borderRadius: 16, padding: 24, border: true },
    data: {
      title: 'Liens utiles',
      items: [],
      showAffiliateNote: true,
      fontSize: 14,
      fontFamily: 'default',
      alignment: 'left',
      borderRadius: 'rounded'
    } as ListLinksBlockData
  },
  purchase: {
    position: { x: 20, y: 20, width: 300, height: 'auto', zIndex: 20 },
    data: {
      variant: 'full',
      showPrice: true,
      borderRadius: 'rounded'
    } as PurchaseBlockData
  },
  video: {
    position: { x: 20, y: 20, width: 560, height: 315, zIndex: 1 },
    data: {
      url: '',
      platform: 'auto',
      aspectRatio: '16:9'
    } as VideoBlockData
  },
  tip: {
    position: { x: 20, y: 20, width: 400, height: 'auto', zIndex: 1 },
    style: { backgroundPreset: 'sage', borderRadius: 12, padding: 20 },
    data: {
      content: '<p>Votre astuce ici...</p>',
      icon: 'lightbulb',
      accentColor: 'sage'
    } as TipBlockData
  },
  separator: {
    position: { x: 20, y: 20, width: 760, height: 32, zIndex: 1 },
    data: {
      style: 'line',
      direction: 'horizontal',
      thickness: 1
    } as SeparatorBlockData
  }
}

// ============================================
// Helpers pour l'historique (Undo/Redo)
// ============================================

export function createHistoryEntry(
  blocks: ContentBlock[],
  action: string
): CanvasHistoryEntry {
  return {
    blocks: JSON.parse(JSON.stringify(blocks)), // Deep clone
    timestamp: Date.now(),
    action
  }
}

export function createEmptyHistory(maxEntries: number = 50): CanvasHistory {
  return {
    entries: [],
    currentIndex: -1,
    maxEntries
  }
}
