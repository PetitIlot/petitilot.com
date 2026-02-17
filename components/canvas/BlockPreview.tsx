'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import {
  Type, Image as ImageIcon, Video, List, ShoppingCart,
  Minus, User, Images, Users, Film,
  Grid, HelpCircle, Package, ChevronDown, ChevronRight, Plus, Recycle, ExternalLink,
  Download, PlayCircle, Lock
} from 'lucide-react'
import type { Language } from '@/lib/types'
import { getFontFamily, loadGoogleFont } from '@/lib/googleFonts'
import type {
  ContentBlock, TitleBlockData, TextBlockData, ImageBlockData,
  CarouselBlockData, CarouselVideoBlockData, VideoBlockData, ListBlockData, ListLinksBlockData,
  PurchaseBlockData, SeparatorBlockData, CreatorBlockData,
  ImageGridBlockData, FAQBlockData, MaterialBlockData,
  DownloadBlockData, PaidVideoBlockData, PaywallBlockData,
  SocialPlatform
} from '@/lib/blocks/types'
import { Button, GEMS } from '@/components/ui/button'
import type { GemColor } from '@/lib/blocks/types'
import { TitlePreview as TitlePreviewV4 } from './title'

// Form data type for real data preview
interface FormDataPreview {
  title?: string
  vignette_url?: string | null
  price_credits?: number | null
  type?: string | null              // Type de ressource (activite, motricite, alimentation)
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  duration_max?: number | null      // Pour afficher un range de durée
  duration_prep?: number | null     // Temps de préparation en minutes
  intensity?: string | null         // 'leger' | 'moyen' | 'intense'
  difficulte?: string | null
  autonomie?: boolean | null        // Autonome ou avec adulte
  themes?: string[] | null
  competences?: string[] | null     // Compétences développées
  categories?: string[] | null      // Catégories (pour sous-type)
  ressourceId?: string              // ID for functional social components (published mode)
  // Infos créateur pour le bloc Creator
  creator?: {
    slug?: string
    display_name?: string
    avatar_url?: string | null
  } | null
  // Matériel pour le bloc Material
  materiel_json?: Array<{
    item: string
    url?: string | null
    recup?: boolean
  }> | null
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
      return <TitlePreviewV4 data={block.data as TitleBlockData} formData={formData} />
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
    case 'separator':
      return <SeparatorPreview data={block.data as SeparatorBlockData} />
    case 'creator':
      return <CreatorPreview data={block.data as CreatorBlockData} formData={formData} lang={lang} />
    case 'image-grid':
      return <ImageGridPreview data={block.data as ImageGridBlockData} />
    case 'faq':
      return <FAQPreview data={block.data as FAQBlockData} />
    case 'material':
      return <MaterialPreview data={block.data as MaterialBlockData} formData={formData} />
    case 'download':
      return <DownloadPreview data={block.data as DownloadBlockData} />
    case 'paid-video':
      return <PaidVideoPreview data={block.data as PaidVideoBlockData} />
    case 'paywall':
      // Legacy: paywall blocks are now handled as canvas-level overlay
      return (
        <div className="flex items-center justify-center h-full min-h-[40px] text-xs text-[var(--foreground-secondary)] italic">
          Rideau obsolète — supprimez ce bloc
        </div>
      )
    default:
      return <div className="text-gray-400 text-sm">Type inconnu</div>
  }
}

// Text Preview - v3 with Tiptap HTML rendering
function TextPreview({ data }: { data: TextBlockData }) {
  const content = data.content || 'Votre texte ici...'
  const fontSize = data.fontSize || 16
  const fontId = data.fontFamily || 'default'
  const isHtml = content.startsWith('<')

  // Load Google Font if needed
  useEffect(() => {
    if (fontId) loadGoogleFont(fontId)
  }, [fontId])

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: getFontFamily(fontId),
    color: data.textColor || 'var(--foreground)',
  }

  return (
    <div>
      {isHtml ? (
        <div
          className="tiptap-content prose prose-sm max-w-none"
          style={textStyle}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div style={{ ...textStyle, whiteSpace: 'pre-wrap' }}>{content}</div>
      )}
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
        className={`w-full h-full ${data.objectFit === 'contain' ? 'object-contain' :
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
  const fontId = data.fontFamily || 'default'

  // Load Google Font if needed
  useEffect(() => {
    if (fontId) loadGoogleFont(fontId)
  }, [fontId])

  // Style pour les éléments uniquement (pas le titre)
  const itemsStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: getFontFamily(fontId),
    color: data.textColor || 'var(--foreground)',
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
    <div>
      {data.title && <h4 className="font-medium mb-2" style={{ color: data.textColor || 'var(--foreground)', fontFamily: getFontFamily(fontId) }}>{data.title}</h4>}
      <ul className={`space-y-1 ${data.columns > 1 ? `grid grid-cols-${data.columns} gap-2` : ''}`} style={itemsStyle}>
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

// List Links Preview - v2.1 avec styles complets + système de puces
function ListLinksPreview({ data }: { data: ListLinksBlockData }) {
  const items = data.items.length > 0 ? data.items : [
    { label: 'Lien exemple', url: '#' }
  ]
  const fontSize = data.fontSize || 14
  const alignment = data.alignment || 'left'
  const fontId = data.fontFamily || 'default'
  const bulletStyle = data.bulletStyle || 'dot'

  // Load Google Font if needed
  useEffect(() => {
    if (fontId) loadGoogleFont(fontId)
  }, [fontId])

  // Style pour les éléments uniquement (pas le titre)
  const itemsStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: getFontFamily(fontId),
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
    <div>
      {data.title && <h4 className="font-medium mb-2" style={{ color: data.textColor || 'var(--foreground)', fontFamily: getFontFamily(fontId) }}>{data.title}</h4>}
      <ul className="space-y-2" style={itemsStyle}>
        {items.slice(0, 5).map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-[#A8B5A0]">
              {bulletStyle === 'number' ? `${i + 1}.` : bulletStyles[bulletStyle]}
            </span>
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

// ============================================
// GEM BUTTON PREVIEW HELPER — inline gem style with mouse-tracking glow
// ============================================
export function GemButtonPreview({ text, style, shape, color, gem, icon }: {
  text: string
  style?: string
  shape?: string
  color?: string
  gem?: string
  icon?: React.ReactNode
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [mouse, setMouse] = useState({ x: 50, y: 50, px: 0, py: 0, inside: false })

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      px: e.clientX - r.left,
      py: e.clientY - r.top,
      inside: true,
    })
  }, [])

  const handleLeave = useCallback(() => {
    setMouse(m => ({ ...m, inside: false }))
  }, [])

  const gemKey = (gem || 'gold') as GemColor
  const g = GEMS[gemKey] || GEMS.gold
  const isClassic = style === 'classic'
  const isOutline = style === 'gem-outline'
  const isRound = shape === 'rounded' || !shape
  const borderRadius = isRound ? 14 : 6
  const hoverOn = mouse.inside
  const glowR = 90

  if (isClassic) {
    const bg = color || '#A8B5A0'
    // Extract rough RGB for glow from hex
    const r = parseInt(bg.slice(1, 3) || 'a8', 16)
    const gv = parseInt(bg.slice(3, 5) || 'b5', 16)
    const b = parseInt(bg.slice(5, 7) || 'a0', 16)
    const classicGlow = `${r},${gv},${b}`

    return (
      <button
        ref={btnRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="px-4 py-1.5 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 relative overflow-hidden"
        style={{
          backgroundColor: bg,
          borderRadius,
          minWidth: '60px',
          transition: 'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: hoverOn
            ? `0 0 16px rgba(${classicGlow},0.50), 0 0 36px rgba(${classicGlow},0.22), 0 2px 8px rgba(0,0,0,0.08)`
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Mouse-tracking shine */}
        <span
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: hoverOn ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: `radial-gradient(circle ${glowR * 0.6}px at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 50%, transparent 100%)`,
          }}
        />
        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{text}</span>
      </button>
    )
  }

  if (isOutline) {
    return (
      <button
        ref={btnRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="px-4 py-1.5 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 backdrop-blur-sm relative overflow-hidden"
        style={{
          color: g.deep,
          border: `1.5px solid ${g.light}`,
          borderRadius,
          background: `rgba(${g.glow},0.08)`,
          minWidth: '60px',
          transition: 'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: hoverOn
            ? `0 0 16px rgba(${g.glow},0.40), 0 0 36px rgba(${g.glow},0.18), inset 0 0 ${glowR * 0.15}px rgba(${g.glow},0.20)`
            : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Mouse-tracking shine */}
        <span
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: hoverOn ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: `radial-gradient(circle ${glowR * 0.5}px at ${mouse.x}% ${mouse.y}%, rgba(${g.glow},0.25) 0%, rgba(${g.glow},0.08) 50%, transparent 100%)`,
          }}
        />
        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{text}</span>
      </button>
    )
  }

  // Default: gem solid with mouse-tracking luminous hover
  return (
    <button
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="px-4 py-1.5 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 backdrop-blur-sm relative overflow-hidden"
      style={{
        color: g.text,
        background: `linear-gradient(170deg, ${g.light}44, ${g.light}66)`,
        border: `1.5px solid ${hoverOn ? `${g.light}cc` : `${g.light}88`}`,
        borderRadius,
        minWidth: '60px',
        transition: 'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease',
        boxShadow: hoverOn
          ? `0 0 18px rgba(${g.glow},0.50), 0 0 40px rgba(${g.glow},0.22), inset 0 0 ${glowR * 0.15}px rgba(${g.glow},0.25), inset 0 0.5px 0 rgba(255,255,255,0.40)`
          : `0 0 12px rgba(${g.glow},0.20), inset 0 0.5px 0 rgba(255,255,255,0.35)`,
      }}
    >
      {/* Mouse-tracking concentrated glow */}
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: hoverOn ? 1 : 0,
          transition: 'opacity 0.35s ease',
          background: `radial-gradient(circle ${glowR * 0.45}px at ${mouse.x}% ${mouse.y}%, rgba(${g.glow},0.65) 0%, rgba(${g.glow},0.25) 50%, transparent 100%)`,
        }}
      />
      {/* Top glass reflet */}
      <span
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: '6%', right: '6%', height: '45%',
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          borderRadius: `${borderRadius}px ${borderRadius}px 50% 50%`,
        }}
      />
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{text}</span>
    </button>
  )
}

// Purchase Preview - v4 Gem Or
function PurchasePreview({ data, formData }: { data: PurchaseBlockData; formData?: FormDataPreview }) {
  const price = formData?.price_credits ?? 5

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60px] gap-1">
      <ShoppingCart className="w-6 h-6 flex-shrink-0" style={{ color: (GEMS[(data.buttonGem || 'gold') as GemColor] || GEMS.gold).light }} />

      {data.showPrice !== false && (
        <p className="text-sm font-bold text-[var(--foreground)] truncate">
          {price > 0 ? `${price} crédits` : 'Gratuit'}
        </p>
      )}

      <GemButtonPreview
        text={data.buttonText || 'Obtenir'}
        style={data.buttonStyle}
        shape={data.buttonShape}
        color={data.buttonColor}
        gem={data.buttonGem}
        icon={<ShoppingCart className="w-3 h-3" />}
      />

      {data.file && (
        <p className="text-[10px] text-gray-500 truncate max-w-full">📎 {data.file.name}</p>
      )}
    </div>
  )
}

// Separator Preview - v2.2 Full customization
function SeparatorPreview({ data }: { data: SeparatorBlockData }) {
  const color = data.color || '#E5E7EB'
  const colorEnd = data.colorEnd || 'transparent'
  const thickness = data.thickness || 2
  const length = data.length || 100
  const opacity = (data.opacity || 100) / 100
  const amplitude = data.amplitude || 10
  const frequency = data.frequency || 5
  const symbolSize = data.symbolSize || 16
  const symbolCount = data.symbolCount || 5
  const lineCap = data.lineCap || 'round'
  const dashLength = data.dashLength || 10
  const dashGap = data.dashGap || 5
  const align = data.align || 'center'

  // Build filter for effects
  const filters: string[] = []
  if (data.blur) filters.push(`blur(${data.blur}px)`)
  if (data.shadow) {
    const shadowColor = data.shadowColor || 'rgba(0,0,0,0.3)'
    const shadowBlur = data.shadowBlur || 4
    filters.push(`drop-shadow(0 2px ${shadowBlur}px ${shadowColor})`)
  }
  if (data.glow) {
    const glowColor = data.glowColor || color
    const glowIntensity = (data.glowIntensity || 5) * 2
    filters.push(`drop-shadow(0 0 ${glowIntensity}px ${glowColor})`)
  }
  const filterStyle = filters.length > 0 ? filters.join(' ') : undefined

  // Animation keyframes
  const animationStyle = data.animated ? {
    animation: `separator-animate ${11 - (data.animationSpeed || 5)}s linear infinite`
  } : {}

  // Container alignment
  const alignClass = align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center'

  // Vertical separator
  if (data.direction === 'vertical') {
    return (
      <div className={`h-full flex items-center ${alignClass}`} style={{ opacity }}>
        <div
          style={{
            width: thickness,
            height: `${length}%`,
            background: data.style === 'gradient' ? `linear-gradient(to bottom, ${color}, ${colorEnd})` :
              data.style === 'fade' ? `linear-gradient(to bottom, transparent, ${color}, transparent)` : color,
            filter: filterStyle,
            borderRadius: lineCap === 'round' ? thickness / 2 : 0,
            ...animationStyle
          }}
        />
      </div>
    )
  }

  // Space separator
  if (data.style === 'space') {
    return <div style={{ height: thickness * 10, opacity }} />
  }

  // Symbol-based separators (dots, stars, hearts, diamonds, arrows)
  if (['dots', 'stars', 'hearts', 'diamonds', 'arrows'].includes(data.style)) {
    const symbols: Record<string, string> = {
      dots: '●',
      stars: '★',
      hearts: '♥',
      diamonds: '◆',
      arrows: '→'
    }
    const symbol = symbols[data.style] || '●'

    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity, filter: filterStyle }}>
        <div className="flex items-center" style={{ width: `${length}%`, justifyContent: 'space-around' }}>
          {[...Array(symbolCount)].map((_, i) => (
            <span
              key={i}
              style={{
                fontSize: symbolSize,
                color: color,
                ...animationStyle
              }}
            >
              {symbol}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Wave separator
  if (data.style === 'wave') {
    const pathD = `M0,${amplitude} ` +
      Array.from({ length: frequency * 2 }, (_, i) => {
        const x = (100 / (frequency * 2)) * (i + 1)
        const y = i % 2 === 0 ? 0 : amplitude * 2
        return `Q${x - (100 / (frequency * 4))},${y} ${x},${amplitude}`
      }).join(' ')

    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <svg
          viewBox={`0 0 100 ${amplitude * 2}`}
          className="overflow-visible"
          style={{ width: `${length}%`, height: amplitude * 2 + thickness, filter: filterStyle, ...animationStyle }}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap={lineCap}
          />
        </svg>
      </div>
    )
  }

  // Zigzag separator
  if (data.style === 'zigzag') {
    const points = Array.from({ length: frequency * 2 + 1 }, (_, i) => {
      const x = (100 / (frequency * 2)) * i
      const y = i % 2 === 0 ? 0 : amplitude
      return `${x},${y}`
    }).join(' ')

    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <svg
          viewBox={`0 0 100 ${amplitude}`}
          className="overflow-visible"
          style={{ width: `${length}%`, height: amplitude + thickness, filter: filterStyle, ...animationStyle }}
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap={lineCap}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  // Scallop separator
  if (data.style === 'scallop') {
    const pathD = `M0,${amplitude} ` +
      Array.from({ length: frequency }, (_, i) => {
        const startX = (100 / frequency) * i
        const endX = (100 / frequency) * (i + 1)
        return `A${(endX - startX) / 2},${amplitude} 0 0 1 ${endX},${amplitude}`
      }).join(' ')

    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <svg
          viewBox={`0 0 100 ${amplitude * 2}`}
          className="overflow-visible"
          style={{ width: `${length}%`, height: amplitude * 2, filter: filterStyle, ...animationStyle }}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap={lineCap}
          />
        </svg>
      </div>
    )
  }

  // Gradient separator
  if (data.style === 'gradient') {
    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <div
          style={{
            width: `${length}%`,
            height: thickness,
            background: `linear-gradient(to right, ${color}, ${colorEnd})`,
            borderRadius: lineCap === 'round' ? thickness / 2 : 0,
            filter: filterStyle,
            ...animationStyle
          }}
        />
      </div>
    )
  }

  // Fade separator (fade from transparent to color to transparent)
  if (data.style === 'fade') {
    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <div
          style={{
            width: `${length}%`,
            height: thickness,
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            borderRadius: lineCap === 'round' ? thickness / 2 : 0,
            filter: filterStyle,
            ...animationStyle
          }}
        />
      </div>
    )
  }

  // Double line
  if (data.style === 'double') {
    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <div className="flex flex-col gap-1" style={{ width: `${length}%`, filter: filterStyle }}>
          <div style={{ height: thickness, backgroundColor: color, borderRadius: lineCap === 'round' ? thickness / 2 : 0 }} />
          <div style={{ height: thickness, backgroundColor: color, borderRadius: lineCap === 'round' ? thickness / 2 : 0 }} />
        </div>
      </div>
    )
  }

  // Dashed line
  if (data.style === 'dashed') {
    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <svg
          viewBox={`0 0 100 ${thickness}`}
          style={{ width: `${length}%`, height: thickness, filter: filterStyle, ...animationStyle }}
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1={thickness / 2}
            x2="100"
            y2={thickness / 2}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap={lineCap}
            strokeDasharray={`${dashLength} ${dashGap}`}
          />
        </svg>
      </div>
    )
  }

  // Dotted line
  if (data.style === 'dotted') {
    return (
      <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
        <svg
          viewBox={`0 0 100 ${thickness}`}
          style={{ width: `${length}%`, height: thickness, filter: filterStyle, ...animationStyle }}
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1={thickness / 2}
            x2="100"
            y2={thickness / 2}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`0.1 ${dashGap}`}
          />
        </svg>
      </div>
    )
  }

  // Default: solid line
  return (
    <div className={`flex items-center ${alignClass} py-2`} style={{ opacity }}>
      <div
        style={{
          width: `${length}%`,
          height: thickness,
          backgroundColor: color,
          borderRadius: lineCap === 'round' ? thickness / 2 : 0,
          filter: filterStyle,
          ...animationStyle
        }}
      />
    </div>
  )
}

// Creator Preview - v2.1 FLEXIBLE/MORPHING avec couleurs, liens et bouton suivre
// ============================================
// ICÔNES RÉSEAUX SOCIAUX — SVG inline minimaliste
// ============================================
const SOCIAL_SVG: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l.01-8.93a8.16 8.16 0 0 0 4.77 1.52V4.47a4.85 4.85 0 0 1-1.01-.78z"/>
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

// Formatte les compteurs : 1200 → "1,2k"
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.0', '')}k`
  return String(n)
}

function CreatorPreview({ data, formData, lang }: {
  data: CreatorBlockData
  formData?: { creator?: { slug?: string; display_name?: string; avatar_url?: string | null } | null }
  lang: Language
}) {
  // Données créateur réelles ou placeholder
  const creator = formData?.creator
  const creatorName = creator?.display_name || 'Nom du créateur'
  const creatorSlug = creator?.slug
  const avatarUrl = creator?.avatar_url
  const creatorLink = creatorSlug ? `/${lang}/createurs/${creatorSlug}` : null

  // Réseaux activés seulement
  const enabledSocials = (data.socialLinks || []).filter(s => s.enabled && s.url)

  const baseStyle: React.CSSProperties = {
    color: data.textColor || 'var(--foreground)',
    backgroundColor: data.backgroundColor || 'transparent',
    width: '100%',
    height: '100%',
  }

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const Avatar = ({ size }: { size: 'md' | 'lg' | 'xl' }) => {
    const dims: Record<string, string> = {
      md:  'w-10 h-10',
      lg:  'w-14 h-14',
      xl:  'w-20 h-20',
    }
    const textSize: Record<string, string> = { md: 'text-base', lg: 'text-xl', xl: 'text-3xl' }
    const cls = `${dims[size]} rounded-full object-cover flex-shrink-0`
    const inner = avatarUrl ? (
      <img src={avatarUrl} alt={creatorName} className={cls} />
    ) : (
      <div className={`${cls} bg-gradient-to-br from-[#A8B5A0] to-[#7A8B6F] flex items-center justify-center text-white font-semibold ${textSize[size]}`}>
        {creatorName.charAt(0).toUpperCase()}
      </div>
    )
    return creatorLink
      ? <Link href={creatorLink} className="hover:opacity-80 transition-opacity flex-shrink-0">{inner}</Link>
      : <div className="flex-shrink-0">{inner}</div>
  }

  // ── Nom ─────────────────────────────────────────────────────────────────────
  const CreatorName = ({ className = '' }: { className?: string }) => {
    const el = (
      <span className={`truncate ${className}`} style={{ color: data.textColor || 'var(--foreground)' }}>
        {creatorName}
      </span>
    )
    return creatorLink ? <Link href={creatorLink} className="hover:underline">{el}</Link> : el
  }

  // ── Bouton Suivre ────────────────────────────────────────────────────────────
  const FollowButton = ({ className = '' }: { className?: string }) => (
    <Button gem="sky" variant="default" size="sm" className={`flex-shrink-0 ${className}`}>
      Suivre
    </Button>
  )

  // ── Badge stat (icône + chiffre) ─────────────────────────────────────────────
  const StatBadge = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[11px] font-medium" style={{ color: data.textColor || 'var(--foreground-secondary)' }}>
      {icon}
      <span>{value}</span>
      <span className="font-normal opacity-70">{label}</span>
    </div>
  )

  // ── Icône réseau social ──────────────────────────────────────────────────────
  const SocialIcon = ({ platform, followerCount, showCount }: { platform: SocialPlatform; followerCount?: number; showCount?: boolean }) => {
    const icon = (
      <div className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity" style={{ color: data.textColor || 'var(--foreground)' }}>
        {SOCIAL_SVG[platform]}
      </div>
    )
    if (showCount && followerCount) {
      return (
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-[10px] font-medium opacity-60">{formatCount(followerCount)}</span>
        </div>
      )
    }
    return icon
  }

  // ============================================================
  // VARIANTE COLLABORATEURS (inchangée)
  // ============================================================
  if (data.variant === 'collaborators') {
    const collabs = data.collaborators || []
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
          <Avatar size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate"><CreatorName /></p>
            <p className="text-xs text-[var(--foreground-secondary)]">Auteur</p>
          </div>
          {data.showFollowButton && <FollowButton />}
        </div>
        {collabs.length > 0 ? (
          <div className="space-y-1.5">
            {collabs.slice(0, 3).map((collab, i) => (
              <div key={collab.id || i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#A8B5A0]/20 flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                  {collab.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{collab.name}</p>
                  {collab.role && <p className="text-[10px] text-[var(--foreground-secondary)] truncate">{collab.role}</p>}
                </div>
                {data.showRevenueShare && collab.revenueShare && (
                  <span className="text-[10px] text-[#7A8B6F] font-semibold">{collab.revenueShare}%</span>
                )}
              </div>
            ))}
            {collabs.length > 3 && <p className="text-[10px] text-[var(--foreground-secondary)]">+{collabs.length - 3} autres</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--foreground-secondary)]">
            <Users className="w-4 h-4" />
            <span className="text-xs">Aucun collaborateur</span>
          </div>
        )}
      </div>
    )
  }

  // ============================================================
  // VARIANTE MINI — colonne centrée, avatar md, nom, stats, follow
  // (= ancienne variante "full")
  // ============================================================
  if (data.variant === 'minimal') {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', minHeight: '100px' }}>
        <Avatar size="lg" />
        <p className="font-semibold text-sm text-center"><CreatorName /></p>
        {data.showStats && (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <StatBadge icon={<Package className="w-3 h-3" />} value="12" label="ressources" />
            <StatBadge icon={<Users className="w-3 h-3" />} value="45" label="abonnés" />
          </div>
        )}
        {data.showFollowButton && <FollowButton />}
      </div>
    )
  }

  // ============================================================
  // VARIANTE COMPACT — row, gros avatar, badges stats, réseaux, follow à droite
  // ============================================================
  if (data.variant === 'compact') {
    return (
      <div style={{ ...baseStyle, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', padding: '12px 14px', minHeight: '80px' }}>
        <Avatar size="lg" />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {/* Nom + bouton Suivre */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate"><CreatorName /></p>
            {data.showFollowButton && <FollowButton />}
          </div>
          {/* Badges stats */}
          {data.showStats && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <StatBadge icon={<Package className="w-3 h-3" />} value="12" label="ressources" />
              <StatBadge icon={<Users className="w-3 h-3" />} value="45" label="abonnés" />
            </div>
          )}
          {/* Icônes réseaux sociaux */}
          {enabledSocials.length > 0 && (
            <div className="flex items-center gap-2.5 mt-0.5">
              {enabledSocials.map(s => (
                <SocialIcon key={s.platform} platform={s.platform} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ============================================================
  // VARIANTE COMPLET — colonne centrée, avatar xl, bio, stats, réseaux + compteurs, follow
  // ============================================================
  return (
    <div style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '20px 16px', minHeight: '160px' }}>
      <Avatar size="xl" />
      <p className="font-semibold text-base text-center"><CreatorName /></p>
      {data.bio && (
        <p className="text-xs text-center text-[var(--foreground-secondary)] leading-relaxed max-w-xs" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {data.bio}
        </p>
      )}
      {data.showStats && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <StatBadge icon={<Package className="w-3 h-3" />} value="12" label="ressources" />
          <StatBadge icon={<Users className="w-3 h-3" />} value="45" label="abonnés" />
        </div>
      )}
      {enabledSocials.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {enabledSocials.map(s => (
            <SocialIcon key={s.platform} platform={s.platform} followerCount={s.followerCount} showCount />
          ))}
        </div>
      )}
      {data.showFollowButton && <FollowButton />}
    </div>
  )
}

// Image Grid Preview - NEW v3
function ImageGridPreview({ data }: { data: ImageGridBlockData }) {
  const gap = data.gap || 8
  const borderRadius = data.borderRadius === 'square' ? '0px' : '8px'
  const images = data.images || []

  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[100px] bg-[var(--surface-secondary)] rounded-lg flex items-center justify-center">
        <div className="text-center text-[var(--foreground-secondary)]">
          <Grid className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <span className="text-xs">Ajoutez des images</span>
        </div>
      </div>
    )
  }

  // Determine grid classes based on layout
  const layoutClasses: Record<string, string> = {
    'grid-2': 'grid-cols-2',
    'grid-3': 'grid-cols-3',
    'grid-4': 'grid-cols-4',
    'grid-2x2': 'grid-cols-2',
    'grid-2x3': 'grid-cols-3',
    'masonry': 'grid-cols-2',
  }

  const gridClass = layoutClasses[data.layout] || 'grid-cols-2'

  return (
    <div className={`grid ${gridClass}`} style={{ gap }}>
      {images.map((img, i) => (
        <div key={i} className="relative overflow-hidden" style={{ borderRadius }}>
          {img.url ? (
            <img src={img.url} alt={img.alt || ''} className="w-full aspect-square object-cover" />
          ) : (
            <div className="w-full aspect-square bg-[var(--surface-secondary)] flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[var(--foreground-secondary)]/30" />
            </div>
          )}
          {data.showCaptions && img.caption && (
            <p className="mt-1 text-center truncate" style={{
              fontSize: data.captionFontSize || 12,
              color: data.captionColor || 'var(--foreground-secondary)'
            }}>
              {img.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// FAQ Preview - NEW v3
function FAQPreview({ data }: { data: FAQBlockData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    data.defaultOpen?.[0] ?? 0
  )
  const items = data.items || []
  const faqStyle = data.style || 'bordered'
  const iconStyle = data.iconStyle || 'chevron'

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[80px] flex items-center justify-center">
        <div className="text-center text-[var(--foreground-secondary)]">
          <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <span className="text-xs">Ajoutez des questions</span>
        </div>
      </div>
    )
  }

  const toggleItem = (i: number) => {
    if (data.expandMode === 'multiple') {
      setOpenIndex(prev => prev === i ? null : i)
    } else {
      setOpenIndex(prev => prev === i ? null : i)
    }
  }

  const getIcon = (isOpen: boolean) => {
    if (iconStyle === 'plus') return isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />
    if (iconStyle === 'arrow') return <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    return <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
  }

  const borderRadius = data.borderRadius === 'square' ? '0px' : '8px'

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className={`overflow-hidden transition-colors ${faqStyle === 'card' ? 'shadow-sm' : ''
              }`}
            style={{
              borderRadius,
              backgroundColor: faqStyle === 'card' ? (data.backgroundColor || 'var(--surface)') : 'transparent',
              border: faqStyle !== 'minimal' ? `1px solid ${data.borderColor || 'var(--border)'}` : 'none',
              borderBottom: faqStyle === 'minimal' ? `1px solid ${data.borderColor || 'var(--border)'}` : undefined,
            }}
          >
            <button
              onClick={() => toggleItem(i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <span className="font-medium" style={{
                fontSize: data.questionFontSize || 16,
                fontFamily: data.questionFontFamily ? `"${data.questionFontFamily}", sans-serif` : undefined,
                color: data.questionColor || 'var(--foreground)',
              }}>
                {item.question || 'Question...'}
              </span>
              <span className="flex-shrink-0 ml-2" style={{ color: data.questionColor || 'var(--foreground-secondary)' }}>
                {getIcon(isOpen)}
              </span>
            </button>
            {isOpen && (
              <div className="px-3 pb-3" style={{
                color: data.answerColor || 'var(--foreground-secondary)',
                fontSize: (data.questionFontSize || 16) - 2
              }}>
                {item.answer || 'Réponse...'}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Material Preview - NEW v3 (displays materiel_json from wizard)
function MaterialPreview({ data, formData }: { data: MaterialBlockData; formData?: FormDataPreview }) {
  const materials = formData?.materiel_json || []
  const layout = data.layout || 'two-columns'
  const fontSize = data.fontSize || 14

  const containerStyle: React.CSSProperties = {
    fontFamily: data.fontFamily ? `"${data.fontFamily}", sans-serif` : undefined,
    color: data.textColor || 'var(--foreground)',
  }

  // Placeholder materials when no real data
  const displayMaterials = materials.length > 0 ? materials : [
    { item: 'Feuilles de papier', recup: false },
    { item: 'Ciseaux à bouts ronds', recup: false },
    { item: 'Rouleau carton', recup: true },
    { item: 'Colle vinylique', recup: false },
    { item: 'Peinture à doigts', recup: false },
  ]

  const isPlaceholder = materials.length === 0

  return (
    <div style={containerStyle}>
      {/* Title */}
      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{
        fontSize: fontSize + 4,
        color: data.textColor || 'var(--foreground)'
      }}>
        <Package className="w-4 h-4" style={{ color: 'var(--sage)' }} />
        {data.titleText || 'Matériel'}
      </h4>

      {/* Materials list */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-2" style={{ opacity: isPlaceholder ? 0.6 : 1 }}>
          {displayMaterials.map((m, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-black/[0.03]">
              <span style={{ fontSize }}>
                {m.item}
              </span>
              {data.showRecupBadge && m.recup && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium flex-shrink-0">
                  <Recycle className="w-2.5 h-2.5" /> récup
                </span>
              )}
            </div>
          ))}
        </div>
      ) : layout === 'two-columns' ? (
        <div className="space-y-1.5" style={{ opacity: isPlaceholder ? 0.6 : 1 }}>
          {displayMaterials.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--border)]" style={{ fontSize }}>
              <div className="flex items-center gap-2">
                <span className="text-[var(--sage)]">•</span>
                <span>{m.item}</span>
                {data.showRecupBadge && m.recup && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                    <Recycle className="w-2.5 h-2.5" /> récup
                  </span>
                )}
              </div>
              {data.showLinks && m.url && (
                <a href={m.url} className="flex items-center gap-1 text-[var(--sage)] hover:underline text-xs flex-shrink-0">
                  <ExternalLink className="w-3 h-3" /> Acheter
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* list layout */
        <ul className="space-y-1.5" style={{ opacity: isPlaceholder ? 0.6 : 1, fontSize }}>
          {displayMaterials.map((m, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-[var(--sage)]">•</span>
              <span>{m.item}</span>
              {data.showRecupBadge && m.recup && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                  <Recycle className="w-2.5 h-2.5" /> récup
                </span>
              )}
              {data.showLinks && m.url && (
                <a href={m.url} className="text-[var(--sage)] hover:underline text-xs ml-auto flex-shrink-0">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Affiliate note */}
      {data.showAffiliateNote && data.showLinks && (
        <p className="text-[10px] text-[var(--foreground-secondary)] mt-3 italic">
          * Certains liens sont des liens affiliés
        </p>
      )}

      {/* Placeholder indicator */}
      {isPlaceholder && (
        <p className="text-[10px] text-[var(--foreground-secondary)] mt-2 text-center italic">
          Aperçu — Saisissez le matériel dans l'étape dédiée
        </p>
      )}
    </div>
  )
}

// ============================================
// DOWNLOAD PREVIEW (NOUVEAU v4)
// ============================================
function DownloadPreview({ data }: { data: DownloadBlockData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60px] gap-1">
      <Download className="w-6 h-6 flex-shrink-0" style={{ color: (GEMS[(data.buttonGem || 'gold') as GemColor] || GEMS.gold).light }} />

      <p className="text-sm font-bold text-[var(--foreground)]">Gratuit</p>

      <GemButtonPreview
        text={data.buttonText || 'Télécharger'}
        style={data.buttonStyle}
        shape={data.buttonShape}
        color={data.buttonColor}
        gem={data.buttonGem}
        icon={<Download className="w-3 h-3" />}
      />

      {data.file && (
        <p className="text-[10px] text-gray-500 truncate max-w-full">📎 {data.file.name}</p>
      )}
    </div>
  )
}

// ============================================
// PAID VIDEO PREVIEW (NOUVEAU v4)
// ============================================
function PaidVideoPreview({ data }: { data: PaidVideoBlockData }) {
  const aspectClasses: Record<string, string> = {
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
  }
  const aspect = aspectClasses[data.aspectRatio || '16:9'] || 'aspect-video'
  const radius = data.borderRadius === 'square' ? 0 : 12

  return (
    <div className="relative w-full overflow-hidden" style={{ borderRadius: radius }}>
      {/* Video layer (visible but blurred) */}
      <div className={`relative w-full ${aspect} bg-gray-900 overflow-hidden`}>
        {data.thumbnailUrl ? (
          <img
            src={data.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(20px) brightness(0.7)', transform: 'scale(1.1)' }}
          />
        ) : data.videoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-16 h-16 text-white/20" style={{ filter: 'blur(4px)' }} />
          </div>
        ) : null}

        {/* Play button underneath (blurred, decorative) */}
        {(data.videoUrl || data.thumbnailUrl) && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'blur(6px)', opacity: 0.4 }}>
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
            </div>
          </div>
        )}

        {/* Glass blur overlay */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(24px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        {/* Purchase CTA on top — always visible */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Lock className="w-6 h-6 text-white/80" />
          </div>
          <GemButtonPreview
            text={data.buttonText || 'Débloquer la vidéo'}
            style={data.buttonStyle}
            shape={data.buttonShape}
            color={data.buttonColor}
            gem={data.buttonGem}
            icon={<PlayCircle className="w-3 h-3" />}
          />
          {!data.videoUrl && !data.thumbnailUrl && (
            <p className="text-[10px] text-white/40">Aucune vidéo uploadée</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PAYWALL PREVIEW (NOUVEAU v4)
// ============================================
function PaywallPreview({ data }: { data: PaywallBlockData }) {
  const blurIntensity = data.blurIntensity || 12
  const overlayOpacity = (data.overlayOpacity || 60) / 100

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60px] gap-1.5 relative overflow-hidden">
      {/* Gradient blur effect background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${data.overlayColor || 'rgba(0,0,0,0.15)'} 30%, ${data.overlayColor || 'rgba(0,0,0,0.15)'} 100%)`,
          opacity: overlayOpacity,
          backdropFilter: `blur(${blurIntensity}px)`,
          WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        }}
      />

      {/* Content on top */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <Lock className="w-5 h-5 text-[var(--foreground-secondary)]" />
        {data.message && (
          <p className="text-xs font-medium text-[var(--foreground)]">{data.message}</p>
        )}
        <GemButtonPreview
          text={data.buttonText || 'Débloquer le contenu'}
          style={data.buttonStyle}
          shape={data.buttonShape}
          color={data.buttonColor}
          gem={data.buttonGem}
          icon={<Lock className="w-3 h-3" />}
        />
        <p className="text-[9px] text-[var(--foreground-secondary)] opacity-60">↓ Contenu masqué en dessous ↓</p>
      </div>
    </div>
  )
}

export default BlockPreview
