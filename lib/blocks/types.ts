/**
 * Block-based Content System v3
 * Structure de données pour le système de blocs modulaires (canvas libre)
 *
 * CHANGEMENTS v3:
 * - BlockStyle enrichi : gradient, glass, borderWidth/Style, padding granulaire
 * - TextBlockData : support Tiptap (contentJson + HTML)
 * - Nouveaux blocs : image-grid, faq
 * - Thèmes one-click (blockThemes.ts)
 */

// Types de blocs disponibles (v3)
export type BlockType =
  | 'title'          // Bloc titre complet avec badges, tags, âge, durée, difficulté
  | 'image'          // Image unique (URL saisie directement)
  | 'carousel'       // Galerie/carrousel d'images (URLs saisies)
  | 'carousel-video' // Galerie/carrousel de vidéos
  | 'creator'        // Widget créateur
  | 'text'           // Zone de texte riche (Tiptap)
  | 'list'           // Liste simple (items custom)
  | 'list-links'     // Liste avec liens (items + URLs)
  | 'purchase'       // Bouton achat/téléchargement + upload fichier
  | 'video'          // Lecteur vidéo embed (URL saisie)
  | 'separator'      // Séparateur visuel
  | 'image-grid'     // Grille d'images (2-6 images)
  | 'faq'            // FAQ / Accordéon
  | 'material'       // Liste matériel (depuis materiel_json du wizard)
  | 'download'       // Téléchargement gratuit (fichier + bouton download)
  | 'paid-video'     // Vidéo payante (lecteur caché derrière achat)
  | 'paywall'        // Rideau payant (voile flou pleine largeur)

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

// Style personnalisable d'un bloc (v3 — enrichi)
export interface BlockStyle {
  backgroundColor?: string    // Couleur de fond (hex, rgba, ou preset)
  backgroundPreset?: 'sage' | 'terracotta' | 'sky' | 'mauve' | 'transparent' | 'surface'
  backgroundGradient?: {
    type: 'linear' | 'radial'
    angle?: number             // 0-360 pour linear
    colors: Array<{ color: string; position: number }>  // position 0-100%
  }
  borderRadius?: number       // Arrondi des coins en px
  padding?: number            // Padding interne en px (uniforme)
  paddingTop?: number         // Padding granulaire
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'apple'  // Ombre
  border?: boolean            // Bordure visible
  borderColor?: string        // Couleur bordure
  borderWidth?: number        // Épaisseur bordure (1-8px)
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  opacity?: number            // Opacité (0-100)
  glass?: boolean             // Activer le style glassmorphism
  glassIntensity?: 'light' | 'medium' | 'strong'
  glassColor?: string         // Couleur de teinte hex pour liquid glass (ex: "#9DC3A9")
  glassSpecular?: boolean     // Reflet spéculaire top edge (défaut: true)
  glassGlow?: boolean         // Lueur intérieure colorée (défaut: true)
  // 2e couche de fond (contenu)
  innerBgColor?: string
  innerBorder?: boolean
  innerBorderColor?: string
  innerBorderWidth?: number
  innerBorderRadius?: number
  innerShadow?: 'none' | 'sm' | 'md' | 'lg' | 'apple'
}

// ============================================
// Données spécifiques par type de bloc
// ============================================

// Types pour le bloc titre v4
export type TitleBorderAnimation = 'none' | 'pulse' | 'glow' | 'shimmer'
export type TitleSocialVariant = 'classic' | 'compact'
export type TitleSocialStyle = 'gem' | 'gem-outline' | 'classic'
export type TitleSocialShape = 'square' | 'round'
export type TitleTagsVariant = 'classic' | 'compact'
export type TitleTagsStyle = 'gem' | 'gem-outline' | 'classic'
export type TitleTagsShape = 'pill' | 'square'
export type TitleTagsAlignment = 'left' | 'center' | 'right'
export type BorderAnimationType = 'none' | 'traveling-light' | 'pulsating-shine' | 'gradient-spin'

// Import GemColor type (sage, mauve, rose, sky, etc.)
export type GemColor = 'sage' | 'mauve' | 'terracotta' | 'rose' | 'sky' | 'amber' | 'neutral' | 'destructive' | 'gold'

// Style per-element (when widget is split)
export interface TitleElementStyle {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: number
}

// Bloc Titre v4 - Widget composé de 3 éléments détachables
export interface TitleBlockData {
  // Style du titre
  titleSize: number           // Taille en pixels (ex: 24, 32, 40)
  fontFamily?: string         // ID de police Google Fonts ou système
  alignment: 'left' | 'center' | 'right'
  // Couleurs
  titleColor?: string         // Couleur du titre (hex)
  backgroundColor?: string    // Couleur de fond (hex)
  borderColor?: string        // Couleur de bordure (hex)
  // Bordure
  borderRadius?: 'rounded' | 'square'  // Type de coins

  // === v4: Visibilité des 3 éléments ===
  elements?: { showTitle: boolean; showSocial: boolean; showTags: boolean }

  // === v4: Config bordure titre ===
  titleBorder?: { enabled: boolean; color?: string; width?: number; animation?: TitleBorderAnimation }

  // === v4: Config social (j'aime + notation) ===
  social?: {
    variant: TitleSocialVariant
    style: TitleSocialStyle
    shape?: TitleSocialShape    // square (défaut) ou round (rond/pillule)
    classicColor?: string       // Couleur CSS si style=classic
  }

  // === v4: Config tags ===
  tags?: {
    variant: TitleTagsVariant     // compact = sans icônes
    alignment: TitleTagsAlignment
    style: TitleTagsStyle
    shape: TitleTagsShape
    themeColor: GemColor          // default 'sky' (bleu)
    competenceColor: GemColor     // default 'rose'
  }

  // === v4: Animation bordure widget ===
  borderAnimation?: {
    type: BorderAnimationType
    speed?: number                // 1-10
    color?: string
  }

  // === v4: Style par élément (quand widget divisé) ===
  titleElementStyle?: TitleElementStyle
  socialElementStyle?: TitleElementStyle
  tagsElementStyle?: TitleElementStyle

  // DEPRECATED v2.1 fields (kept for backwards compat, ignored)
  showBadges?: boolean
  showThemes?: boolean
  showCompetences?: boolean
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

// Bloc Créateur - Données fixes (MODIFIÉ v3.0)
export type SocialPlatform = 'instagram' | 'pinterest' | 'youtube' | 'facebook' | 'tiktok' | 'website'

export interface SocialLink {
  platform: SocialPlatform
  url: string
  enabled: boolean
  followerCount?: number  // Affiché dans la variante "complet"
}

export interface CreatorBlockData {
  variant: 'full' | 'compact' | 'minimal' | 'collaborators'  // Style d'affichage
  showFollowButton: boolean
  showStats: boolean         // Badges ressources + abonnés
  bio?: string               // Biographie courte (variantes compact + complet)
  socialLinks?: SocialLink[] // Liens réseaux sociaux avec toggle individuel
  // Couleurs
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  buttonColor?: string       // Couleur du bouton Suivre
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

// Bloc Texte - Rich text Tiptap (v3)
export interface TextBlockData {
  content: string            // HTML rendu (pour affichage public)
  contentJson?: unknown      // JSON Tiptap (pour édition lossless, optionnel)
  // Style du texte
  fontSize?: number          // Taille en pixels
  fontFamily?: string        // ID de police Google Fonts ou système
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
  fontFamily?: string        // ID de police Google Fonts ou système
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
  }>
  bulletStyle?: 'dot' | 'check' | 'number' | 'dash' | 'none'  // Style des puces (comme ListBlock)
  showAffiliateNote: boolean // Note sur les liens affiliés
  // Style
  fontSize?: number
  fontFamily?: string        // ID de police Google Fonts ou système
  alignment?: 'left' | 'center' | 'right'
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
}

// Bloc Achat/Téléchargement - Avec upload fichier (MODIFIÉ v4)
export interface PurchaseBlockData {
  variant: 'full' | 'compact' | 'minimal'
  showPrice: boolean
  buttonText?: string        // Texte personnalisé du bouton
  buttonStyle?: MonetizationButtonStyle   // gem / gem-outline / classic
  buttonShape?: MonetizationButtonShape   // rounded / square
  buttonColor?: string       // Couleur du bouton (hex, mode classic)
  buttonGem?: GemColor       // Couleur gem (défaut: 'gold')
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

// Bloc Séparateur (MODIFIÉ v2.2 - Options étendues)
export interface SeparatorBlockData {
  // Style de base
  style: 'line' | 'dashed' | 'dotted' | 'double' |
         'wave' | 'zigzag' | 'scallop' |
         'dots' | 'stars' | 'hearts' | 'diamonds' | 'arrows' |
         'gradient' | 'fade' |
         'space'
  direction: 'horizontal' | 'vertical'

  // Dimensions
  thickness: number           // Épaisseur en pixels (1-20)
  length?: number            // Longueur en % (10-100), défaut 100

  // Couleurs
  color?: string             // Couleur principale
  colorEnd?: string          // Couleur de fin (pour gradient/fade)

  // Style de ligne
  lineCap?: 'butt' | 'round' | 'square'  // Extrémités
  dashLength?: number        // Longueur des tirets (pour dashed)
  dashGap?: number           // Espace entre tirets

  // Effets
  shadow?: boolean           // Ombre portée
  shadowColor?: string       // Couleur de l'ombre
  shadowBlur?: number        // Flou de l'ombre (0-20)
  glow?: boolean             // Effet lumineux
  glowColor?: string         // Couleur du glow
  glowIntensity?: number     // Intensité du glow (1-10)
  blur?: number              // Flou sur le séparateur (0-10)
  opacity?: number           // Opacité (0-100)

  // Distorsion/Animation
  amplitude?: number         // Amplitude des vagues/zigzag (1-50)
  frequency?: number         // Fréquence des vagues/zigzag (1-20)
  animated?: boolean         // Animation (pour wave/gradient)
  animationSpeed?: number    // Vitesse animation (1-10)

  // Symboles (pour dots, stars, hearts, etc.)
  symbolSize?: number        // Taille des symboles (8-40)
  symbolSpacing?: number     // Espacement entre symboles (10-100)
  symbolCount?: number       // Nombre de symboles (3-20)

  // Alignement
  align?: 'start' | 'center' | 'end'  // Alignement si length < 100
}

// ============================================
// Bloc Grille d'Images (NOUVEAU v3)
// ============================================

export interface ImageGridBlockData {
  images: Array<{
    url: string
    alt?: string
    caption?: string           // Légende sous l'image
  }>
  layout: 'grid-2' | 'grid-3' | 'grid-4' | 'grid-2x2' | 'grid-2x3' | 'masonry'
  gap: number                  // Espacement en px (4-24)
  borderRadius?: 'rounded' | 'square'
  showCaptions?: boolean
  captionFontSize?: number
  captionColor?: string
}

// ============================================
// Bloc FAQ / Accordéon (NOUVEAU v3)
// ============================================

export interface FAQBlockData {
  items: Array<{
    question: string
    answer: string             // Texte ou HTML simple
  }>
  style: 'minimal' | 'card' | 'bordered'
  expandMode: 'single' | 'multiple'
  defaultOpen?: number[]       // Indices ouverts par défaut
  questionFontSize?: number
  questionFontFamily?: string
  questionColor?: string
  answerColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
  iconStyle: 'chevron' | 'plus' | 'arrow'
}

// ============================================
// Bloc Matériel (NOUVEAU v3) — affiche materiel_json du wizard
// ============================================

export interface MaterialBlockData {
  showLinks: boolean           // Afficher colonne "Où acheter"
  showRecupBadge: boolean      // Afficher badge ♻️ récup
  showAffiliateNote: boolean   // Note liens affiliés
  layout: 'list' | 'grid' | 'two-columns'  // list = liste simple, two-columns = matériel + liens côte à côte
  // Style
  titleText?: string           // Titre custom (défaut: "Matériel")
  fontSize?: number
  fontFamily?: string
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
}

// ============================================
// Style bouton partagé (blocs monétisation)
// ============================================

export type MonetizationButtonStyle = 'gem' | 'gem-outline' | 'classic'
export type MonetizationButtonShape = 'rounded' | 'square'

// ============================================
// Bloc Téléchargement gratuit (NOUVEAU v4)
// ============================================

export interface DownloadBlockData {
  // Style bouton
  buttonText?: string           // "Télécharger" par défaut
  buttonStyle?: MonetizationButtonStyle
  buttonShape?: MonetizationButtonShape
  buttonColor?: string          // Couleur hex (mode classic)
  buttonGem?: GemColor          // Couleur gem (défaut: 'gold')
  // Style bloc
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
  // Fichier uploadé vers Supabase Storage
  file?: {
    path: string
    name: string
    size: number
    mimeType: string
    uploadedAt: string
  }
}

// ============================================
// Bloc Vidéo payante (NOUVEAU v4)
// ============================================

export interface PaidVideoBlockData {
  videoUrl?: string             // URL Cloudinary après upload
  videoPublicId?: string        // Public ID Cloudinary
  thumbnailUrl?: string         // Thumbnail auto ou custom
  // Style bouton
  buttonText?: string           // "Débloquer la vidéo"
  buttonStyle?: MonetizationButtonStyle
  buttonShape?: MonetizationButtonShape
  buttonColor?: string
  buttonGem?: GemColor
  // Style bloc
  backgroundColor?: string
  borderColor?: string
  borderRadius?: 'rounded' | 'square'
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5'
}

// ============================================
// Bloc Paywall / Rideau payant (NOUVEAU v4)
// ============================================

export interface PaywallBlockData {
  // Style bouton
  buttonText?: string           // "Débloquer le contenu"
  buttonStyle?: MonetizationButtonStyle
  buttonShape?: MonetizationButtonShape
  buttonColor?: string
  buttonGem?: GemColor
  // Rideau
  blurIntensity?: number        // 8-20px, défaut 12
  overlayColor?: string         // Couleur overlay semi-transparent
  overlayOpacity?: number       // 0-100, défaut 60
  message?: string              // Message affiché ("Contenu premium")
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
  | { type: 'separator'; data: SeparatorBlockData }
  | { type: 'image-grid'; data: ImageGridBlockData }
  | { type: 'faq'; data: FAQBlockData }
  | { type: 'material'; data: MaterialBlockData }
  | { type: 'download'; data: DownloadBlockData }
  | { type: 'paid-video'; data: PaidVideoBlockData }
  | { type: 'paywall'; data: PaywallBlockData }

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

// Configuration du rideau payant (canvas-level overlay)
export interface PaywallConfig {
  enabled: boolean
  cutY: number                // Position Y du haut du rideau
  blurIntensity?: number      // 4-24px, défaut 12
  overlayColor?: string       // Couleur overlay semi-transparent
  overlayOpacity?: number     // 0-100, défaut 60
  message?: string            // Message affiché ("Contenu premium")
  buttonText?: string
  buttonStyle?: MonetizationButtonStyle
  buttonShape?: MonetizationButtonShape
  buttonColor?: string        // Couleur hex (mode classic)
  buttonGem?: GemColor        // Couleur gem (défaut: 'gold')
}

export interface CanvasConfig {
  width: number              // Largeur de référence en px (ex: 800)
  height: number | 'auto'    // Hauteur totale ou auto
  backgroundColor?: string
  backgroundImage?: string
  gridSize: number           // Taille de la grille d'alignement (ex: 8)
  snapToGrid: boolean        // Snap magnétique à la grille
  paddingHorizontal?: number // Marge gauche+droite en px (défaut: 0)
  paddingTop?: number        // Marge haute en px (défaut: 0)
  paywall?: PaywallConfig | null // Rideau payant canvas-level
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
      borderRadius: 'rounded',
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic', style: 'gem' },
      tags: {
        variant: 'classic',
        alignment: 'left',
        style: 'gem',
        shape: 'pill',
        themeColor: 'sky',
        competenceColor: 'rose',
      },
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
      bulletStyle: 'dot',
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
  separator: {
    position: { x: 20, y: 20, width: 760, height: 32, zIndex: 1 },
    data: {
      style: 'line',
      direction: 'horizontal',
      thickness: 2,
      length: 100,
      color: '#E5E7EB',
      lineCap: 'round',
      opacity: 100,
      align: 'center'
    } as SeparatorBlockData
  },
  'image-grid': {
    position: { x: 20, y: 20, width: 600, height: 'auto', zIndex: 1 },
    data: {
      images: [],
      layout: 'grid-2',
      gap: 8,
      borderRadius: 'rounded',
      showCaptions: false,
      captionFontSize: 12
    } as ImageGridBlockData
  },
  faq: {
    position: { x: 20, y: 20, width: 500, height: 'auto', zIndex: 1 },
    style: { backgroundPreset: 'surface', borderRadius: 16, padding: 24, border: true },
    data: {
      items: [],
      style: 'bordered',
      expandMode: 'single',
      questionFontSize: 16,
      iconStyle: 'chevron',
      borderRadius: 'rounded'
    } as FAQBlockData
  },
  material: {
    position: { x: 20, y: 20, width: 500, height: 'auto', zIndex: 1 },
    style: { backgroundPreset: 'surface', borderRadius: 16, padding: 24, border: true },
    data: {
      showLinks: true,
      showRecupBadge: true,
      showAffiliateNote: true,
      layout: 'two-columns',
      titleText: 'Matériel',
      fontSize: 14,
      borderRadius: 'rounded'
    } as MaterialBlockData
  },
  download: {
    position: { x: 20, y: 20, width: 300, height: 'auto', zIndex: 20 },
    data: {
      buttonText: 'Télécharger',
      buttonStyle: 'gem',
      buttonShape: 'rounded',
      buttonGem: 'gold',
      borderRadius: 'rounded'
    } as DownloadBlockData
  },
  'paid-video': {
    position: { x: 20, y: 20, width: 560, height: 315, zIndex: 1 },
    data: {
      buttonText: 'Débloquer la vidéo',
      buttonStyle: 'gem',
      buttonShape: 'rounded',
      buttonGem: 'gold',
      borderRadius: 'rounded',
      aspectRatio: '16:9'
    } as PaidVideoBlockData
  },
  // paywall: supprimé — maintenant géré comme overlay canvas-level via CanvasConfig.paywall
  paywall: {
    position: { x: 0, y: 400, width: 800, height: 80, zIndex: 99 },
    data: {
      buttonText: 'Débloquer le contenu',
      buttonStyle: 'gem',
      buttonShape: 'rounded',
      buttonGem: 'gold',
      blurIntensity: 12,
      overlayOpacity: 60,
      message: 'Contenu premium'
    } as PaywallBlockData
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
