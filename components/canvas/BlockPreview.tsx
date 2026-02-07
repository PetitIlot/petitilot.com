'use client'

import {
  Type, Image as ImageIcon, Video, List, ShoppingCart,
  Lightbulb, Minus, User, Images, Star, Heart, Info, AlertTriangle, Users, Film
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type {
  ContentBlock, TitleBlockData, TextBlockData, ImageBlockData,
  CarouselBlockData, CarouselVideoBlockData, VideoBlockData, ListBlockData, ListLinksBlockData,
  PurchaseBlockData, TipBlockData, SeparatorBlockData, CreatorBlockData
} from '@/lib/blocks/types'

// Form data type for real data preview
interface FormDataPreview {
  title?: string
  vignette_url?: string
  price_credits?: number
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  difficulte?: string | null
  themes?: string[]
}

interface BlockPreviewProps {
  block: ContentBlock
  lang: Language
  formData?: FormDataPreview  // Optional: real form data for preview mode
}

/**
 * Affiche un aperçu du bloc selon son type
 * Ces previews sont simplifiés pour l'éditeur
 * Les vrais rendus seront dans les composants de blocks v2
 */
export function BlockPreview({ block, lang, formData }: BlockPreviewProps) {
  switch (block.type) {
    case 'title':
      return <TitlePreview data={block.data as TitleBlockData} formData={formData} />
    case 'text':
      return <TextPreview data={block.data as TextBlockData} />
    case 'image':
      return <ImagePreview data={block.data as ImageBlockData} />
    case 'carousel':
      return <CarouselPreview data={block.data as CarouselBlockData} />
    case 'carousel-video':
      return <CarouselVideoPreview data={block.data as CarouselVideoBlockData} />
    case 'video':
      return <VideoPreview data={block.data as VideoBlockData} />
    case 'list':
      return <ListPreview data={block.data as ListBlockData} />
    case 'list-links':
      return <ListLinksPreview data={block.data as ListLinksBlockData} />
    case 'purchase':
      return <PurchasePreview data={block.data as PurchaseBlockData} formData={formData} />
    case 'tip':
      return <TipPreview data={block.data as TipBlockData} />
    case 'separator':
      return <SeparatorPreview data={block.data as SeparatorBlockData} />
    case 'creator':
      return <CreatorPreview data={block.data as CreatorBlockData} />
    default:
      return <div className="text-gray-400 text-sm">Type inconnu</div>
  }
}

// Title Preview - v2.1 avec taille en pixels et couleurs + vraies données
function TitlePreview({ data, formData }: { data: TitleBlockData; formData?: FormDataPreview }) {
  const titleSize = typeof data.titleSize === 'number' ? data.titleSize : 32
  const alignment = data.alignment || 'left'
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  // Use real data if available, otherwise show placeholders
  const title = formData?.title || 'Titre de la ressource'
  const ageMin = formData?.age_min
  const ageMax = formData?.age_max
  const duration = formData?.duration
  const difficulte = formData?.difficulte
  const themes = formData?.themes || []

  // Map difficulte value to label
  const difficulteLabel = difficulte === 'beginner' ? 'Facile' : difficulte === 'advanced' ? 'Moyen' : difficulte === 'expert' ? 'Expert' : null

  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    backgroundColor: data.backgroundColor || 'transparent',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    padding: data.backgroundColor || data.borderColor ? '16px' : '0'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: `${titleSize}px`,
    color: data.titleColor || '#5D5A4E'
  }

  // Check if we have any real data for badges
  const hasBadges = ageMin || ageMax || duration || difficulteLabel
  const hasThemes = themes.length > 0

  return (
    <div style={containerStyle}>
      <div className="font-bold" style={titleStyle}>
        {title}
      </div>
      {/* Badges - show real data or placeholders */}
      <div className={`flex flex-wrap gap-2 mt-2 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : ''}`}>
        {hasBadges ? (
          <>
            {ageMin && ageMax && (
              <span className="px-2 py-0.5 bg-[#A8B5A0]/20 text-[#5D5A4E] text-xs rounded-full">
                {ageMin}-{ageMax} ans
              </span>
            )}
            {duration && (
              <span className="px-2 py-0.5 bg-[#C8D8E4]/50 text-[#5D5A4E] text-xs rounded-full">
                {duration} min
              </span>
            )}
            {difficulteLabel && (
              <span className="px-2 py-0.5 bg-[#D4A59A]/20 text-[#5D5A4E] text-xs rounded-full">
                {difficulteLabel}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="px-2 py-0.5 bg-[#A8B5A0]/20 text-[#5D5A4E] text-xs rounded-full">3-6 ans</span>
            <span className="px-2 py-0.5 bg-[#C8D8E4]/50 text-[#5D5A4E] text-xs rounded-full">30 min</span>
            <span className="px-2 py-0.5 bg-[#D4A59A]/20 text-[#5D5A4E] text-xs rounded-full">Facile</span>
          </>
        )}
      </div>
      {/* Thèmes - show real data or placeholders */}
      <div className={`flex flex-wrap gap-1 mt-2 ${alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : ''}`}>
        {hasThemes ? (
          themes.map((theme, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {theme}
            </span>
          ))
        ) : (
          <>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Thème 1</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Thème 2</span>
          </>
        )}
      </div>
    </div>
  )
}

// Text Preview - v2.1 avec styles complets
function TextPreview({ data }: { data: TextBlockData }) {
  const content = data.content || 'Votre texte ici...'
  const fontSize = data.fontSize || 16
  const alignment = data.alignment || 'left'
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  const fontFamilyMap: Record<string, string> = {
    default: 'inherit',
    serif: 'Georgia, serif',
    mono: 'monospace',
    quicksand: 'Quicksand, sans-serif'
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor || 'transparent',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    padding: data.backgroundColor || data.borderColor ? '16px' : '0'
  }

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamilyMap[data.fontFamily || 'default'],
    color: data.textColor || '#5D5A4E',
    textAlign: alignment,
    whiteSpace: 'pre-wrap' // Preserve line breaks
  }

  return (
    <div style={containerStyle}>
      <div style={textStyle}>{content}</div>
    </div>
  )
}

// Image Preview - v2.1 avec coins configurables
function ImagePreview({ data }: { data: ImageBlockData }) {
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  if (!data.url) {
    return (
      <div
        className="w-full h-full min-h-[100px] bg-gray-100 flex items-center justify-center"
        style={{ borderRadius }}
      >
        <div className="text-center text-gray-400">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <span className="text-xs">Cliquez pour ajouter une image</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[100px] overflow-hidden" style={{ borderRadius }}>
      <img
        src={data.url}
        alt={data.alt || ''}
        className={`w-full h-full ${
          data.objectFit === 'contain' ? 'object-contain' :
          data.objectFit === 'fill' ? 'object-fill' :
          'object-cover'
        }`}
      />
    </div>
  )
}

// Carousel Preview - v2.1 avec type de carousel
function CarouselPreview({ data }: { data: CarouselBlockData }) {
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'
  const carouselType = data.carouselType || 'slide'

  const typeLabels: Record<string, string> = {
    slide: 'Défilement',
    fade: 'Fondu',
    coverflow: 'Coverflow',
    cards: 'Cartes'
  }

  if (!data.images || data.images.length === 0) {
    return (
      <div
        className="w-full h-full min-h-[150px] bg-gray-100 flex items-center justify-center"
        style={{ borderRadius }}
      >
        <div className="text-center text-gray-400">
          <Images className="w-8 h-8 mx-auto mb-2" />
          <span className="text-xs">Galerie vide - Ajoutez des images</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-[150px] overflow-hidden bg-gray-100" style={{ borderRadius }}>
      {/* First image preview */}
      <img
        src={data.images[0].url}
        alt={data.images[0].alt || ''}
        className="w-full h-full object-cover"
      />
      {/* Type badge */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
        {typeLabels[carouselType]}
      </div>
      {/* Image count badge */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
        {data.images.length} images
      </div>
      {/* Navigation dots */}
      {data.showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {data.images.slice(0, 5).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

// Carousel Video Preview - NEW v2.1
function CarouselVideoPreview({ data }: { data: CarouselVideoBlockData }) {
  const carouselType = data.carouselType || 'slide'

  const typeLabels: Record<string, string> = {
    slide: 'Défilement',
    fade: 'Fondu',
    coverflow: 'Coverflow',
    cards: 'Cartes'
  }

  if (!data.videos || data.videos.length === 0) {
    return (
      <div className="w-full h-full min-h-[150px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Film className="w-8 h-8 mx-auto mb-2" />
          <span className="text-xs">Galerie vidéo vide</span>
        </div>
      </div>
    )
  }

  const platformIcons: Record<string, string> = {
    youtube: '📺',
    instagram: '📸',
    tiktok: '🎵',
    auto: '🎬'
  }

  return (
    <div className="relative w-full h-full min-h-[150px] overflow-hidden bg-gray-900 rounded-lg">
      {/* Video placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <Film className="w-10 h-10 mx-auto mb-2" />
          <span className="text-lg">{platformIcons[data.videos[0]?.platform || 'auto']}</span>
        </div>
      </div>
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
        </div>
      </div>
      {/* Type badge */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
        {typeLabels[carouselType]}
      </div>
      {/* Video count badge */}
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
        {data.videos.length} vidéos
      </div>
    </div>
  )
}

// Video Preview
function VideoPreview({ data }: { data: VideoBlockData }) {
  const aspectClasses = {
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
    '4:3': 'aspect-[4/3]'
  }

  if (!data.url) {
    return (
      <div className={`w-full ${aspectClasses[data.aspectRatio] || 'aspect-video'} bg-gray-900 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <Video className="w-8 h-8 mx-auto mb-2" />
          <span className="text-xs">Ajoutez une URL vidéo</span>
        </div>
      </div>
    )
  }

  // Détecter le type de vidéo
  const isYouTube = data.url.includes('youtube') || data.url.includes('youtu.be')
  const isInstagram = data.url.includes('instagram')
  const isTikTok = data.url.includes('tiktok')

  return (
    <div className={`w-full ${aspectClasses[data.aspectRatio] || 'aspect-video'} bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden`}>
      <div className="text-center text-white">
        <Video className="w-10 h-10 mx-auto mb-2" />
        <span className="text-xs opacity-75">
          {isYouTube ? 'YouTube' : isInstagram ? 'Instagram' : isTikTok ? 'TikTok' : 'Vidéo'}
        </span>
      </div>
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
        </div>
      </div>
    </div>
  )
}

// List Preview - v2.1 avec styles complets
function ListPreview({ data }: { data: ListBlockData }) {
  const items = data.items.length > 0 ? data.items : ['Élément 1', 'Élément 2', 'Élément 3']
  const fontSize = data.fontSize || 14
  const alignment = data.alignment || 'left'
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  const fontFamilyMap: Record<string, string> = {
    default: 'inherit',
    serif: 'Georgia, serif',
    mono: 'monospace',
    quicksand: 'Quicksand, sans-serif'
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor || 'transparent',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    padding: data.backgroundColor || data.borderColor ? '16px' : '0'
  }

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamilyMap[data.fontFamily || 'default'],
    color: data.textColor || '#5D5A4E',
    textAlign: alignment
  }

  const bulletStyles = {
    dot: '•',
    check: '✓',
    number: '',
    dash: '—',
    none: ''
  }

  return (
    <div style={containerStyle}>
      {data.title && <h4 className="font-medium mb-2" style={{ color: data.textColor || '#5D5A4E' }}>{data.title}</h4>}
      <ul className={`space-y-1 ${data.columns > 1 ? `grid grid-cols-${data.columns} gap-2` : ''}`} style={textStyle}>
        {items.slice(0, 6).map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            {data.isChecklist ? (
              <input type="checkbox" className="mt-0.5" disabled />
            ) : (
              <span className="text-[#A8B5A0]">
                {data.bulletStyle === 'number' ? `${i + 1}.` : bulletStyles[data.bulletStyle]}
              </span>
            )}
            <span>{item}</span>
          </li>
        ))}
        {items.length > 6 && (
          <li className="text-xs text-gray-400">+{items.length - 6} autres...</li>
        )}
      </ul>
    </div>
  )
}

// List Links Preview - v2.1 avec styles complets
function ListLinksPreview({ data }: { data: ListLinksBlockData }) {
  const items = data.items.length > 0 ? data.items : [
    { label: 'Lien exemple', url: '#', icon: '🔗' }
  ]
  const fontSize = data.fontSize || 14
  const alignment = data.alignment || 'left'
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  const fontFamilyMap: Record<string, string> = {
    default: 'inherit',
    serif: 'Georgia, serif',
    mono: 'monospace',
    quicksand: 'Quicksand, sans-serif'
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor || 'transparent',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    padding: data.backgroundColor || data.borderColor ? '16px' : '0'
  }

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamilyMap[data.fontFamily || 'default'],
    textAlign: alignment
  }

  return (
    <div style={containerStyle}>
      {data.title && <h4 className="font-medium mb-2" style={{ color: data.textColor || '#5D5A4E' }}>{data.title}</h4>}
      <ul className="space-y-2" style={textStyle}>
        {items.slice(0, 5).map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            <a href={item.url} className="hover:underline" style={{ color: data.textColor || '#A8B5A0' }}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {data.showAffiliateNote && (
        <p className="text-xs text-gray-400 mt-2 italic">
          * Liens affiliés
        </p>
      )}
    </div>
  )
}

// Purchase Preview - v2.1 FLEXIBLE/MORPHING avec couleurs
function PurchasePreview({ data, formData }: { data: PurchaseBlockData; formData?: FormDataPreview }) {
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  // Use real price if available
  const price = formData?.price_credits ?? 5

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor || 'rgba(168, 181, 160, 0.1)',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    // Flexible layout that adapts to container size
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '60px',
    padding: '8px',
    gap: '4px'
  }

  return (
    <div style={containerStyle}>
      {/* Icon - scales down when small */}
      <ShoppingCart className="w-6 h-6 text-[#A8B5A0] flex-shrink-0" style={{ minWidth: '20px', minHeight: '20px' }} />

      {/* Price - show real price or placeholder */}
      {data.showPrice !== false && (
        <p className="text-sm font-bold text-[#5D5A4E] truncate">
          {price > 0 ? `${price} crédits` : 'Gratuit'}
        </p>
      )}

      {/* Button - always visible, flexible */}
      <button
        className="px-3 py-1 rounded-lg text-white text-xs font-medium whitespace-nowrap flex-shrink-0"
        style={{
          backgroundColor: data.buttonColor || '#A8B5A0',
          minWidth: '60px'
        }}
      >
        {data.buttonText || 'Obtenir'}
      </button>

      {/* File indicator - hidden when small */}
      {data.file && (
        <p className="text-[10px] text-gray-500 truncate max-w-full">
          📎 {data.file.name}
        </p>
      )}
    </div>
  )
}

// Tip Preview (deprecated)
function TipPreview({ data }: { data: TipBlockData }) {
  const icons = {
    lightbulb: <Lightbulb className="w-5 h-5" />,
    star: <Star className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    chef: <span className="text-lg">👨‍🍳</span>
  }

  const colors = {
    sage: 'text-[#A8B5A0] bg-[#A8B5A0]/10',
    terracotta: 'text-[#D4A59A] bg-[#D4A59A]/10',
    sky: 'text-[#7BA3C4] bg-[#C8D8E4]/30',
    mauve: 'text-[#9B8AA8] bg-[#B8A9C9]/20'
  }

  return (
    <div className={`flex gap-3 p-4 rounded-xl ${colors[data.accentColor]}`}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[data.icon] || icons.lightbulb}
      </div>
      <div
        className="prose prose-sm max-w-none text-[#5D5A4E]"
        dangerouslySetInnerHTML={{ __html: data.content || '<p>Votre astuce ici...</p>' }}
      />
    </div>
  )
}

// Separator Preview
function SeparatorPreview({ data }: { data: SeparatorBlockData }) {
  if (data.direction === 'vertical') {
    return (
      <div className="h-full flex items-center justify-center">
        <div
          className="h-full"
          style={{
            width: data.thickness,
            backgroundColor: data.color || '#E5E7EB'
          }}
        />
      </div>
    )
  }

  if (data.style === 'space') {
    return <div style={{ height: data.thickness * 10 }} />
  }

  if (data.style === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: data.thickness * 3,
              height: data.thickness * 3,
              backgroundColor: data.color || '#E5E7EB'
            }}
          />
        ))}
      </div>
    )
  }

  if (data.style === 'wave') {
    return (
      <div className="py-2">
        <svg viewBox="0 0 100 10" className="w-full" style={{ height: data.thickness * 5 }}>
          <path
            d="M0,5 Q25,0 50,5 T100,5"
            fill="none"
            stroke={data.color || '#E5E7EB'}
            strokeWidth={data.thickness}
          />
        </svg>
      </div>
    )
  }

  // Default: line
  return (
    <div className="flex items-center py-2">
      <div
        className="w-full"
        style={{
          height: data.thickness,
          backgroundColor: data.color || '#E5E7EB'
        }}
      />
    </div>
  )
}

// Creator Preview - v2.1 FLEXIBLE/MORPHING avec couleurs et variante collaborateurs
function CreatorPreview({ data }: { data: CreatorBlockData }) {
  const borderRadius = data.borderRadius === 'square' ? '0px' : '12px'

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor || 'transparent',
    borderColor: data.borderColor || 'transparent',
    borderWidth: data.borderColor ? '2px' : '0',
    borderStyle: 'solid',
    borderRadius,
    color: data.textColor || '#5D5A4E',
    // Flexible layout
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '40px',
    padding: '8px',
    gap: '4px'
  }

  // Collaborators variant
  if (data.variant === 'collaborators') {
    const collabs = data.collaborators || []
    return (
      <div style={{ ...containerStyle, flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Main creator */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate" style={{ color: data.textColor || '#5D5A4E' }}>
              Créateur principal
            </p>
            <p className="text-xs text-gray-500">Auteur</p>
          </div>
        </div>

        {/* Collaborators */}
        {collabs.length > 0 ? (
          <div className="space-y-1 pt-2">
            {collabs.slice(0, 3).map((collab, i) => (
              <div key={collab.id || i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#A8B5A0]/20 flex-shrink-0 flex items-center justify-center text-xs font-medium">
                  {collab.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: data.textColor || '#5D5A4E' }}>
                    {collab.name}
                  </p>
                  {collab.role && (
                    <p className="text-[10px] text-gray-400 truncate">{collab.role}</p>
                  )}
                </div>
                {data.showRevenueShare && collab.revenueShare && (
                  <span className="text-[10px] text-[#A8B5A0] font-medium">{collab.revenueShare}%</span>
                )}
              </div>
            ))}
            {collabs.length > 3 && (
              <p className="text-[10px] text-gray-400">+{collabs.length - 3} autres</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-xs">Aucun collaborateur</span>
          </div>
        )}
      </div>
    )
  }

  // Minimal variant
  if (data.variant === 'minimal') {
    return (
      <div style={{ ...containerStyle, flexDirection: 'row', justifyContent: 'flex-start' }}>
        <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
        <span className="text-xs truncate" style={{ color: data.textColor || '#5D5A4E' }}>Nom du créateur</span>
      </div>
    )
  }

  // Compact variant
  if (data.variant === 'compact') {
    return (
      <div style={{ ...containerStyle, flexDirection: 'row', justifyContent: 'flex-start' }}>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate" style={{ color: data.textColor || '#5D5A4E' }}>Nom du créateur</p>
          {data.showStats && <p className="text-xs text-gray-500 truncate">12 ressources</p>}
        </div>
      </div>
    )
  }

  // Full variant (default)
  return (
    <div style={containerStyle}>
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
      <p className="font-medium text-sm truncate" style={{ color: data.textColor || '#5D5A4E' }}>Nom du créateur</p>
      {data.showStats && (
        <p className="text-xs text-gray-500">12 ressources • 45 abonnés</p>
      )}
      {data.showFollowButton && (
        <button className="px-3 py-1 text-xs bg-[#A8B5A0] text-white rounded-full flex-shrink-0">
          Suivre
        </button>
      )}
    </div>
  )
}

export default BlockPreview
