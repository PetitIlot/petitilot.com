'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  X, Upload, Plus, Trash2, GripVertical,
  AlignLeft, AlignCenter, AlignRight,
  Type, Image as ImageIcon, Video, List, ShoppingCart,
  Minus, User, Images, Film, Grid, HelpCircle, Package,
  Sparkles, Sun, Waves, Circle, Square, Star, Heart, Diamond,
  ChevronDown, ChevronRight, Palette,
  Download, PlayCircle, KeyRound, Lock, LayoutGrid,
  UserCircle, Share2, BookOpen, Instagram, Youtube, Facebook, Globe, Mail, ShoppingBag
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type {
  ContentBlock, BlockType, BlockStyle, TextBlockData, ImageBlockData,
  CarouselBlockData, CarouselVideoBlockData, VideoBlockData, ListBlockData, ListLinksBlockData,
  PurchaseBlockData, TitleBlockData, CreatorBlockData, SeparatorBlockData,
  ImageGridBlockData, FAQBlockData, MaterialBlockData,
  DownloadBlockData, PaywallBlockData, ActivityCardsBlockData,
  GemColor, PaywallConfig, SocialPlatform, SocialLink,
  ProfileHeroBlockData, CreatorResourcesBlockData, CreatorFeaturedBlockData, SocialWidgetBlockData, SocialWidgetPlatform
} from '@/lib/blocks/types'
import { createClient } from '@/lib/supabase-client'
import { EditorSection, ColorPicker, SliderControl, SelectControl, ToggleControl, FontPicker, TiptapEditor, CloudinaryUploader } from './editor'
import { TitleEditor } from './title'
import { GEMS } from '@/components/ui/button'
import ActivityCardsEditor from './ActivityCardsEditor'

// ============================================
// BLOCK TYPE CONFIG
// ============================================
const BLOCK_TYPE_LABELS: Record<BlockType, Record<string, string>> = {
  title: { fr: 'Titre', en: 'Title', es: 'Título' },
  text: { fr: 'Texte', en: 'Text', es: 'Texto' },
  image: { fr: 'Image', en: 'Image', es: 'Imagen' },
  carousel: { fr: 'Galerie', en: 'Gallery', es: 'Galería' },
  'carousel-video': { fr: 'Galerie vidéo', en: 'Video Gallery', es: 'Galería de video' },
  video: { fr: 'Vidéo', en: 'Video', es: 'Video' },
  list: { fr: 'Liste', en: 'List', es: 'Lista' },
  'list-links': { fr: 'Liens', en: 'Links', es: 'Enlaces' },
  purchase: { fr: 'Achat', en: 'Purchase', es: 'Compra' },
  separator: { fr: 'Séparateur', en: 'Separator', es: 'Separador' },
  creator: { fr: 'Créateur', en: 'Creator', es: 'Creador' },
  'image-grid': { fr: 'Grille images', en: 'Image Grid', es: 'Cuadrícula' },
  faq: { fr: 'FAQ', en: 'FAQ', es: 'FAQ' },
  material: { fr: 'Matériel', en: 'Material', es: 'Material' },
  download: { fr: 'Téléchargement', en: 'Download', es: 'Descarga' },
  paywall: { fr: 'Rideau payant', en: 'Paywall', es: 'Paywall' },
  'activity-cards': { fr: 'Carrousel activités', en: 'Activity carousel', es: 'Carrusel' },
  'profile-hero': { fr: 'Profil héro', en: 'Profile hero', es: 'Perfil héroe' },
  'creator-resources': { fr: 'Mes ressources', en: 'My resources', es: 'Mis recursos' },
  'creator-featured': { fr: 'Ressource vedette', en: 'Featured resource', es: 'Recurso destacado' },
  'social-widget': { fr: 'Réseau social', en: 'Social media', es: 'Red social' },
}

const BLOCK_TYPE_ICONS: Record<BlockType, React.ReactNode> = {
  title: <Type className="w-3.5 h-3.5" />,
  text: <Type className="w-3.5 h-3.5" />,
  image: <ImageIcon className="w-3.5 h-3.5" />,
  carousel: <Images className="w-3.5 h-3.5" />,
  'carousel-video': <Film className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
  list: <List className="w-3.5 h-3.5" />,
  'list-links': <List className="w-3.5 h-3.5" />,
  purchase: <ShoppingCart className="w-3.5 h-3.5" />,
  separator: <Minus className="w-3.5 h-3.5" />,
  creator: <User className="w-3.5 h-3.5" />,
  'image-grid': <Grid className="w-3.5 h-3.5" />,
  faq: <HelpCircle className="w-3.5 h-3.5" />,
  material: <Package className="w-3.5 h-3.5" />,
  download: <Download className="w-3.5 h-3.5" />,
  paywall: <KeyRound className="w-3.5 h-3.5" />,
  'activity-cards': <LayoutGrid className="w-3.5 h-3.5" />,
  'profile-hero': <UserCircle className="w-3.5 h-3.5" />,
  'creator-resources': <LayoutGrid className="w-3.5 h-3.5" />,
  'creator-featured': <Star className="w-3.5 h-3.5" />,
  'social-widget': <Share2 className="w-3.5 h-3.5" />,
}

// ============================================
// MAIN BLOCK EDITOR
// ============================================
interface CreatorFormData {
  slug?: string
  display_name?: string
  avatar_url?: string | null
  bio?: string | null
  instagram_handle?: string | null
  youtube_handle?: string | null
  tiktok_handle?: string | null
  website_url?: string | null
}

interface BlockEditorProps {
  block: ContentBlock
  onUpdate: (data: Record<string, unknown>) => void
  onUpdateStyle: (style: Partial<BlockStyle>) => void
  onClose: () => void
  lang: Language
  formData?: { creator?: CreatorFormData | null } | null
  onDetachElement?: (elementName: string) => void
}

export function BlockEditor({ block, onUpdate, onUpdateStyle, onClose, lang, formData, onDetachElement }: BlockEditorProps) {
  const typeName = BLOCK_TYPE_LABELS[block.type]?.[lang] || block.type
  const typeIcon = BLOCK_TYPE_ICONS[block.type]

  // Check if this block type has typography controls
  const hasTypography = ['title', 'text', 'list', 'list-links', 'faq', 'material'].includes(block.type)
  const isNotSeparator = block.type !== 'separator'

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden" style={{
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--elevation-3)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--sage)]">{typeIcon}</span>
          <span className="text-sm font-semibold text-[var(--foreground)]">{typeName}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <X className="w-4 h-4 text-[var(--foreground-secondary)]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Style Section — common to all blocks (except separator which has its own) */}
        {isNotSeparator && (
          <EditorSection title="Style" icon={<Palette className="w-3 h-3" />} defaultOpen={true}>
            <CommonStyleEditor style={block.style} onUpdateStyle={onUpdateStyle} lang={lang} />
          </EditorSection>
        )}

        {/* Content Section — block-specific */}
        <EditorSection title="Contenu" icon={<Type className="w-3 h-3" />} defaultOpen={false}>
          {/* Inner background layer */}
          {isNotSeparator && (
            <InnerStyleEditor style={block.style} onUpdateStyle={onUpdateStyle} />
          )}
          {block.type === 'title' ? (
            <TitleEditor
              data={block.data as TitleBlockData}
              update={(field, value) => onUpdate({ [field]: value })}
              onDetachElement={onDetachElement}
            />
          ) : (
            <BlockContentEditor block={block} onUpdate={onUpdate} lang={lang} creatorProfile={formData?.creator} />
          )}
        </EditorSection>
      </div>
    </div>
  )
}

// ============================================
// COMMON STYLE EDITOR (background, border, shadow, opacity, glass, themes)
// ============================================
function CommonStyleEditor({ style, onUpdateStyle, lang }: {
  style: BlockStyle
  onUpdateStyle: (style: Partial<BlockStyle>) => void
  lang: Language
}) {
  const [bgMode, setBgMode] = useState<'color' | 'gradient' | 'glass'>(
    style.glass ? 'glass' : style.backgroundGradient ? 'gradient' : 'color'
  )

  return (
    <div className="space-y-4">
      {/* Background mode */}
      <SelectControl
        label="Fond"
        value={bgMode}
        variant="buttons"
        options={[
          { value: 'color', label: 'Couleur' },
          { value: 'gradient', label: 'Dégradé' },
          { value: 'glass', label: 'Verre' },
        ]}
        onChange={v => {
          setBgMode(v as typeof bgMode)
          if (v === 'glass') {
            onUpdateStyle({ glass: true, glassIntensity: 'medium', backgroundColor: undefined, backgroundGradient: undefined })
          } else if (v === 'gradient') {
            onUpdateStyle({
              glass: false,
              backgroundGradient: {
                type: 'linear',
                angle: 135,
                colors: [
                  { color: '#F0F4ED', position: 0 },
                  { color: '#FFFFFF', position: 100 }
                ]
              }
            })
          } else {
            onUpdateStyle({ glass: false, backgroundGradient: undefined })
          }
        }}
      />

      {bgMode === 'color' && (
        <ColorPicker
          label="Couleur de fond"
          value={style.backgroundColor}
          onChange={v => onUpdateStyle({ backgroundColor: v })}
        />
      )}

      {bgMode === 'gradient' && style.backgroundGradient && (
        <div className="space-y-3">
          <SliderControl
            label="Angle"
            value={style.backgroundGradient.angle ?? 135}
            min={0} max={360} step={15} unit="°"
            onChange={v => onUpdateStyle({
              backgroundGradient: { ...style.backgroundGradient!, angle: v }
            })}
          />
          <ColorPicker
            label="Couleur début"
            value={style.backgroundGradient.colors[0]?.color}
            onChange={v => {
              const colors = [...(style.backgroundGradient?.colors || [])]
              colors[0] = { color: v, position: 0 }
              onUpdateStyle({ backgroundGradient: { ...style.backgroundGradient!, colors } })
            }}
          />
          <ColorPicker
            label="Couleur fin"
            value={style.backgroundGradient.colors[1]?.color}
            onChange={v => {
              const colors = [...(style.backgroundGradient?.colors || [])]
              colors[1] = { color: v, position: 100 }
              onUpdateStyle({ backgroundGradient: { ...style.backgroundGradient!, colors } })
            }}
          />
        </div>
      )}

      {bgMode === 'glass' && (
        <div className="space-y-3">
          <SelectControl
            label="Intensité"
            value={style.glassIntensity || 'medium'}
            variant="buttons"
            options={[
              { value: 'light', label: 'Léger' },
              { value: 'medium', label: 'Moyen' },
              { value: 'strong', label: 'Fort' },
            ]}
            onChange={v => onUpdateStyle({ glassIntensity: v as BlockStyle['glassIntensity'] })}
          />

          {/* Gem color swatches for liquid glass */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--foreground-secondary)]">Teinte</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Transparent / reset swatch */}
              <button
                onClick={() => onUpdateStyle({ glassColor: undefined })}
                className="w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center"
                style={{
                  borderColor: !style.glassColor ? 'var(--sage)' : 'var(--border)',
                  transform: !style.glassColor ? 'scale(1.15)' : 'scale(1)',
                  background: 'linear-gradient(135deg, #fff 45%, #ddd 45%, #ddd 55%, #fff 55%)',
                }}
                title="Neutre"
              />
              {/* Gem swatches */}
              {(['sage', 'mauve', 'terracotta', 'rose', 'sky', 'amber', 'neutral'] as const).map(gem => {
                const g = GEMS[gem]
                const isActive = style.glassColor === g.light
                return (
                  <button
                    key={gem}
                    onClick={() => onUpdateStyle({ glassColor: g.light })}
                    className="w-7 h-7 rounded-full border-2 transition-transform"
                    style={{
                      backgroundColor: g.light,
                      borderColor: isActive ? g.deep : 'transparent',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isActive ? `0 0 8px ${g.light}60` : 'none',
                    }}
                    title={gem}
                  />
                )
              })}
            </div>
          </div>

          {/* Custom color picker */}
          <ColorPicker
            label="Couleur custom"
            value={style.glassColor}
            onChange={v => onUpdateStyle({ glassColor: v })}
          />

          {/* Specular toggle */}
          <ToggleControl
            label="Reflet"
            checked={style.glassSpecular !== false}
            onChange={v => onUpdateStyle({ glassSpecular: v })}
          />

          {/* Inner glow toggle */}
          <ToggleControl
            label="Lueur"
            checked={style.glassGlow !== false}
            onChange={v => onUpdateStyle({ glassGlow: v })}
          />
        </div>
      )}

      {/* Border */}
      <ToggleControl
        label="Bordure"
        checked={style.border ?? false}
        onChange={v => onUpdateStyle({ border: v })}
      />
      {style.border && (
        <div className="space-y-3 ml-2">
          <ColorPicker
            label="Couleur"
            value={style.borderColor}
            onChange={v => onUpdateStyle({ borderColor: v })}
            allowTransparent={false}
          />
          <SliderControl
            label="Épaisseur"
            value={style.borderWidth ?? 1}
            min={1} max={8} unit="px"
            onChange={v => onUpdateStyle({ borderWidth: v })}
          />
          <SelectControl
            label="Style"
            value={style.borderStyle || 'solid'}
            variant="buttons"
            options={[
              { value: 'solid', label: 'Plein' },
              { value: 'dashed', label: 'Tirets' },
              { value: 'dotted', label: 'Points' },
            ]}
            onChange={v => onUpdateStyle({ borderStyle: v as BlockStyle['borderStyle'] })}
          />
        </div>
      )}

      {/* Border radius */}
      <SliderControl
        label="Arrondi"
        value={style.borderRadius ?? 12}
        min={0} max={32} unit="px"
        onChange={v => onUpdateStyle({ borderRadius: v })}
      />

      {/* Shadow */}
      <SelectControl
        label="Ombre"
        value={style.shadow || 'none'}
        options={[
          { value: 'none', label: 'Aucune' },
          { value: 'sm', label: 'Douce' },
          { value: 'md', label: 'Moyenne' },
          { value: 'lg', label: 'Marquée' },
          { value: 'apple', label: 'Apple' },
        ]}
        onChange={v => onUpdateStyle({ shadow: v as BlockStyle['shadow'] })}
      />

      {/* Padding */}
      <SliderControl
        label="Padding"
        value={style.padding ?? 16}
        min={0} max={48} unit="px"
        onChange={v => onUpdateStyle({ padding: v })}
      />

      {/* Opacity */}
      <SliderControl
        label="Opacité"
        value={style.opacity ?? 100}
        min={10} max={100} step={5} unit="%"
        onChange={v => onUpdateStyle({ opacity: v })}
      />
    </div>
  )
}

// ============================================
// INNER STYLE EDITOR (2nd background layer for content)
// ============================================
function InnerStyleEditor({ style, onUpdateStyle }: {
  style: BlockStyle
  onUpdateStyle: (style: Partial<BlockStyle>) => void
}) {
  const hasInner = !!(style.innerBgColor || style.innerBorder || (style.innerShadow && style.innerShadow !== 'none'))

  return (
    <div className="space-y-3 pb-3 mb-3 border-b border-[var(--border)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-secondary)]">Fond du contenu</span>
      </div>
      <ColorPicker
        label="Couleur"
        value={style.innerBgColor}
        onChange={v => onUpdateStyle({ innerBgColor: v })}
      />
      {hasInner && (
        <>
          <SliderControl
            label="Arrondi"
            value={style.innerBorderRadius ?? 8}
            min={0} max={24} unit="px"
            onChange={v => onUpdateStyle({ innerBorderRadius: v })}
          />
          <ToggleControl
            label="Bordure"
            checked={style.innerBorder ?? false}
            onChange={v => onUpdateStyle({ innerBorder: v })}
          />
          {style.innerBorder && (
            <div className="space-y-3 ml-2">
              <ColorPicker
                label="Couleur"
                value={style.innerBorderColor}
                onChange={v => onUpdateStyle({ innerBorderColor: v })}
                allowTransparent={false}
              />
              <SliderControl
                label="Épaisseur"
                value={style.innerBorderWidth ?? 1}
                min={1} max={6} unit="px"
                onChange={v => onUpdateStyle({ innerBorderWidth: v })}
              />
            </div>
          )}
          <SelectControl
            label="Ombre"
            value={style.innerShadow || 'none'}
            options={[
              { value: 'none', label: 'Aucune' },
              { value: 'sm', label: 'Douce' },
              { value: 'md', label: 'Moyenne' },
              { value: 'lg', label: 'Marquée' },
              { value: 'apple', label: 'Apple' },
            ]}
            onChange={v => onUpdateStyle({ innerShadow: v as BlockStyle['innerShadow'] })}
          />
        </>
      )}
    </div>
  )
}

// ============================================
// BLOCK CONTENT EDITOR (dispatches to type-specific editors)
// ============================================
function BlockContentEditor({ block, onUpdate, lang, creatorProfile }: {
  block: ContentBlock
  onUpdate: (data: Record<string, unknown>) => void
  lang: Language
  creatorProfile?: CreatorFormData | null
}) {
  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  switch (block.type) {
    case 'text':
      return <TextContentEditor data={block.data as TextBlockData} update={update} batchUpdate={onUpdate} />
    case 'image':
      return <ImageContentEditor data={block.data as ImageBlockData} update={update} />
    case 'carousel':
      return <CarouselContentEditor data={block.data as CarouselBlockData} update={update} />
    case 'carousel-video':
      return <CarouselVideoContentEditor data={block.data as CarouselVideoBlockData} update={update} />
    case 'video':
      return <VideoContentEditor data={block.data as VideoBlockData} update={update} />
    case 'list':
      return <ListContentEditor data={block.data as ListBlockData} update={update} />
    case 'list-links':
      return <ListLinksContentEditor data={block.data as ListLinksBlockData} update={update} />
    case 'purchase':
      return <PurchaseContentEditor data={block.data as PurchaseBlockData} update={update} />
    case 'creator':
      return <CreatorContentEditor data={block.data as CreatorBlockData} update={update} creatorProfile={creatorProfile} />
    case 'separator':
      return <SeparatorContentEditor data={block.data as SeparatorBlockData} update={update} />
    case 'image-grid':
      return <ImageGridContentEditor data={block.data as ImageGridBlockData} update={update} />
    case 'faq':
      return <FAQContentEditor data={block.data as FAQBlockData} update={update} />
    case 'material':
      return <MaterialContentEditor data={block.data as MaterialBlockData} update={update} />
    case 'download':
      return <DownloadContentEditor data={block.data as DownloadBlockData} update={update} />
    case 'paywall':
      return <PaywallContentEditor data={block.data as PaywallBlockData} update={update} />
    case 'activity-cards':
      return (
        <ActivityCardsEditor
          data={block.data as ActivityCardsBlockData}
          update={update}
          lang={lang}
        />
      )
    case 'profile-hero':
      return <ProfileHeroEditor data={block.data as ProfileHeroBlockData} update={update} />
    case 'creator-resources':
      return <CreatorResourcesEditor data={block.data as CreatorResourcesBlockData} update={update} />
    case 'creator-featured':
      return <CreatorFeaturedEditor data={block.data as CreatorFeaturedBlockData} update={update} />
    case 'social-widget':
      return <SocialWidgetEditor data={block.data as SocialWidgetBlockData} update={update} creatorProfile={creatorProfile} />
    default:
      return <p className="text-xs text-[var(--foreground-secondary)]">Pas d'options pour ce bloc</p>
  }
}

// ============================================
// TEXT CONTENT EDITOR — Tiptap Rich Text
// ============================================
function TextContentEditor({ data, update, batchUpdate }: { data: TextBlockData; update: (f: string, v: unknown) => void; batchUpdate: (updates: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Contenu</label>
        <TiptapEditor
          content={data.content || ''}
          contentJson={data.contentJson}
          onChange={(html, json) => {
            batchUpdate({ content: html, contentJson: json })
          }}
          placeholder="Votre texte ici..."
        />
      </div>
      <SliderControl label="Taille" value={data.fontSize || 16} min={10} max={36} unit="px" onChange={v => update('fontSize', v)} />
      <FontPicker label="Police" value={data.fontFamily || 'default'} onChange={v => update('fontFamily', v)} />
      <ColorPicker label="Couleur texte" value={data.textColor} onChange={v => update('textColor', v)} />
    </div>
  )
}

// ============================================
// IMAGE CONTENT EDITOR (with Cloudinary upload)
// ============================================
function ImageContentEditor({ data, update }: { data: ImageBlockData; update: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">URL de l'image</label>
        <input
          type="text" value={data.url || ''} onChange={e => update('url', e.target.value)}
          placeholder="https://..."
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <CloudinaryUploader
        onUpload={(url) => update('url', url)}
        folder="petit-ilot/resources/blocks"
      />
      {data.url && (
        <div className="rounded-lg overflow-hidden border border-[var(--border)]">
          <img src={data.url} alt={data.alt || ''} className="w-full h-24 object-cover" />
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Texte alternatif</label>
        <input
          type="text" value={data.alt || ''} onChange={e => update('alt', e.target.value)}
          placeholder="Description de l'image"
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <SelectControl
        label="Ajustement" value={data.objectFit || 'cover'}
        options={[
          { value: 'cover', label: 'Couvrir' },
          { value: 'contain', label: 'Contenir' },
          { value: 'fill', label: 'Remplir' },
        ]}
        onChange={v => update('objectFit', v)}
      />
    </div>
  )
}

// ============================================
// CAROUSEL CONTENT EDITOR
// ============================================
function CarouselContentEditor({ data, update }: { data: CarouselBlockData; update: (f: string, v: unknown) => void }) {
  const [newUrl, setNewUrl] = useState('')

  const addImage = () => {
    if (newUrl.trim()) {
      update('images', [...(data.images || []), { url: newUrl, alt: '' }])
      setNewUrl('')
    }
  }

  return (
    <div className="space-y-3">
      <SelectControl
        label="Type de carousel" value={data.carouselType || 'slide'} variant="buttons"
        options={[
          { value: 'slide', label: 'Slide' },
          { value: 'fade', label: 'Fondu' },
          { value: 'coverflow', label: 'Cover' },
          { value: 'cards', label: 'Cartes' },
        ]}
        onChange={v => update('carouselType', v)}
      />
      <div className="flex gap-1.5">
        <input
          type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL image..."
          onKeyDown={e => e.key === 'Enter' && addImage()}
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <button onClick={addImage} disabled={!newUrl.trim()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {data.images?.map((img, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--surface-secondary)]">
          <img src={img.url} alt="" className="w-10 h-10 rounded object-cover" />
          <span className="flex-1 text-[10px] text-[var(--foreground-secondary)] truncate">{img.url}</span>
          <button onClick={() => update('images', data.images.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <CloudinaryUploader
        compact
        multiple
        onUpload={(url) => update('images', [...(data.images || []), { url, alt: '' }])}
        onUploadMultiple={(results) => update('images', [...(data.images || []), ...results.map(r => ({ url: r.url, alt: '' }))])}
        folder="petit-ilot/resources/carousel"
      />
      <ToggleControl label="Points" checked={data.showDots} onChange={v => update('showDots', v)} />
      <ToggleControl label="Flèches" checked={data.showArrows} onChange={v => update('showArrows', v)} />
      <ToggleControl label="Lecture auto" checked={data.autoPlay} onChange={v => update('autoPlay', v)} />
    </div>
  )
}

// ============================================
// CAROUSEL VIDEO CONTENT EDITOR
// ============================================
function CarouselVideoContentEditor({ data, update }: { data: CarouselVideoBlockData; update: (f: string, v: unknown) => void }) {
  const [newUrl, setNewUrl] = useState('')

  const detectPlatform = (url: string): 'youtube' | 'instagram' | 'tiktok' | 'auto' => {
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('instagram')) return 'instagram'
    if (url.includes('tiktok')) return 'tiktok'
    return 'auto'
  }

  const addVideo = () => {
    if (newUrl.trim()) {
      update('videos', [...(data.videos || []), { url: newUrl, platform: detectPlatform(newUrl) }])
      setNewUrl('')
    }
  }

  return (
    <div className="space-y-3">
      <SelectControl
        label="Type" value={data.carouselType || 'slide'} variant="buttons"
        options={[
          { value: 'slide', label: 'Slide' },
          { value: 'fade', label: 'Fondu' },
          { value: 'coverflow', label: 'Cover' },
          { value: 'cards', label: 'Cartes' },
        ]}
        onChange={v => update('carouselType', v)}
      />
      <div className="flex gap-1.5">
        <input
          type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL vidéo..."
          onKeyDown={e => e.key === 'Enter' && addVideo()}
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <button onClick={addVideo} disabled={!newUrl.trim()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {data.videos?.map((video, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--surface-secondary)]">
          <span className="text-xs font-medium text-[var(--foreground-secondary)] w-16">{video.platform}</span>
          <span className="flex-1 text-[10px] text-[var(--foreground-secondary)] truncate">{video.url}</span>
          <button onClick={() => update('videos', data.videos.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

// ============================================
// VIDEO CONTENT EDITOR
// ============================================
function VideoContentEditor({ data, update }: { data: VideoBlockData; update: (f: string, v: unknown) => void }) {
  const url = data.url || ''
  const platform = url.includes('youtube') || url.includes('youtu.be') ? 'YouTube' : url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : ''

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">URL de la vidéo</label>
        <input
          type="text" value={url} onChange={e => update('url', e.target.value)}
          placeholder="YouTube, Instagram ou TikTok"
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      {platform && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-xs text-[var(--foreground-secondary)]">
          <Video className="w-3.5 h-3.5" /> {platform}
        </div>
      )}
      <SelectControl
        label="Format" value={data.aspectRatio || '16:9'}
        options={[
          { value: '16:9', label: '16:9' },
          { value: '9:16', label: '9:16' },
          { value: '1:1', label: '1:1' },
          { value: '4:5', label: '4:5' },
          { value: '4:3', label: '4:3' },
        ]}
        onChange={v => update('aspectRatio', v)}
      />
    </div>
  )
}

// ============================================
// LIST CONTENT EDITOR
// ============================================
function ListContentEditor({ data, update }: { data: ListBlockData; update: (f: string, v: unknown) => void }) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      update('items', [...(data.items || []), newItem.trim()])
      setNewItem('')
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Titre</label>
        <input
          type="text" value={data.title || ''} onChange={e => update('title', e.target.value)}
          placeholder="Ex: Ingrédients, Matériel..."
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <SelectControl
        label="Style des puces" value={data.bulletStyle || 'dot'} variant="buttons"
        options={[
          { value: 'dot', label: '•' },
          { value: 'check', label: '✓' },
          { value: 'number', label: '1.' },
          { value: 'dash', label: '—' },
        ]}
        onChange={v => update('bulletStyle', v)}
      />
      <ToggleControl label="Liste à cocher" checked={data.isChecklist ?? false} onChange={v => update('isChecklist', v)} />
      {/* Items list */}
      {(data.items || []).map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <GripVertical className="w-3 h-3 text-[var(--foreground-secondary)]/30 flex-shrink-0" />
          <input
            type="text" value={item}
            onChange={e => {
              const items = [...(data.items || [])]
              items[i] = e.target.value
              update('items', items)
            }}
            className="flex-1 h-7 px-2 text-xs rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
          />
          <button onClick={() => update('items', data.items.filter((_, j) => j !== i))} className="p-0.5 text-red-400 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <div className="flex gap-1.5">
        <input
          type="text" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Ajouter..."
          onKeyDown={e => e.key === 'Enter' && addItem()}
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <button onClick={addItem} disabled={!newItem.trim()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <SliderControl label="Taille texte" value={data.fontSize || 14} min={10} max={24} unit="px" onChange={v => update('fontSize', v)} />
      <FontPicker label="Police" value={data.fontFamily || 'default'} onChange={v => update('fontFamily', v)} />
      <ColorPicker label="Couleur texte" value={data.textColor} onChange={v => update('textColor', v)} />
    </div>
  )
}

// ============================================
// LIST LINKS CONTENT EDITOR
// ============================================
function ListLinksContentEditor({ data, update }: { data: ListLinksBlockData; update: (f: string, v: unknown) => void }) {
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addItem = () => {
    if (newLabel.trim() && newUrl.trim()) {
      update('items', [...(data.items || []), { label: newLabel.trim(), url: newUrl.trim() }])
      setNewLabel('')
      setNewUrl('')
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Titre</label>
        <input
          type="text" value={data.title || ''} onChange={e => update('title', e.target.value)}
          placeholder="Ex: Où acheter, Ressources..."
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <SelectControl
        label="Style des puces" value={data.bulletStyle || 'dot'} variant="buttons"
        options={[
          { value: 'dot', label: '•' },
          { value: 'check', label: '✓' },
          { value: 'number', label: '1.' },
          { value: 'dash', label: '—' },
        ]}
        onChange={v => update('bulletStyle', v)}
      />
      {(data.items || []).map((item, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--surface-secondary)]">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">{item.label}</p>
            <p className="text-[10px] text-[var(--foreground-secondary)] truncate">{item.url}</p>
          </div>
          <button onClick={() => update('items', data.items.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <div className="space-y-1.5">
        <input
          type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Libellé"
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <div className="flex gap-1.5">
          <input
            type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..."
            onKeyDown={e => e.key === 'Enter' && addItem()}
            className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
          />
          <button onClick={addItem} disabled={!newLabel.trim() || !newUrl.trim()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <ToggleControl label="Note affiliés" checked={data.showAffiliateNote} onChange={v => update('showAffiliateNote', v)} />
      <SliderControl label="Taille texte" value={data.fontSize || 14} min={10} max={24} unit="px" onChange={v => update('fontSize', v)} />
      <FontPicker label="Police" value={data.fontFamily || 'default'} onChange={v => update('fontFamily', v)} />
      <ColorPicker label="Couleur texte" value={data.textColor} onChange={v => update('textColor', v)} />
    </div>
  )
}

// ============================================
// MONETIZATION BUTTON EDITOR (shared by purchase, download, paywall)
// ============================================
const GEM_OPTIONS: { value: GemColor; label: string }[] = [
  { value: 'gold', label: '🥇 Or' },
  { value: 'sage', label: '🌿 Sauge' },
  { value: 'amber', label: '🍯 Ambre' },
  { value: 'rose', label: '🌸 Rose' },
  { value: 'sky', label: '💎 Ciel' },
  { value: 'mauve', label: '💜 Mauve' },
  { value: 'terracotta', label: '🧱 Terracotta' },
  { value: 'neutral', label: '⚪ Neutre' },
]

function MonetizationButtonEditor({ data, update }: {
  data: { buttonText?: string; buttonStyle?: string; buttonShape?: string; buttonColor?: string; buttonGem?: string }
  update: (field: string, value: unknown) => void
}) {
  const style = (data.buttonStyle || 'gem') as string
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Texte du bouton</label>
        <input
          type="text" value={data.buttonText || ''} onChange={e => update('buttonText', e.target.value)}
          placeholder="Obtenir"
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <SelectControl
        label="Style bouton" value={style} variant="buttons"
        options={[
          { value: 'gem', label: 'Gem' },
          { value: 'gem-outline', label: 'Outline' },
          { value: 'classic', label: 'Classique' },
        ]}
        onChange={v => update('buttonStyle', v)}
      />
      <SelectControl
        label="Forme" value={data.buttonShape || 'rounded'} variant="buttons"
        options={[
          { value: 'rounded', label: 'Rond' },
          { value: 'square', label: 'Carré' },
        ]}
        onChange={v => update('buttonShape', v)}
      />
      {style === 'classic' ? (
        <ColorPicker label="Couleur bouton" value={data.buttonColor || '#A8B5A0'} onChange={v => update('buttonColor', v)} allowTransparent={false} />
      ) : (
        <SelectControl
          label="Couleur gem" value={data.buttonGem || 'gold'}
          options={GEM_OPTIONS}
          onChange={v => update('buttonGem', v)}
        />
      )}
    </div>
  )
}

// ============================================
// FILE UPLOAD DROPZONE (shared by purchase & download)
// ============================================
function FileUploadDropzone({ file, onUpload, accept = '.pdf,.zip,.doc,.docx', label = 'Glissez un fichier ou cliquez' }: {
  file?: { name: string; size?: number } | null
  onUpload: (file: File) => void
  accept?: string
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (f: File) => {
    setUploading(true)
    try {
      await new Promise<void>(resolve => {
        onUpload(f)
        resolve()
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" accept={accept} onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()} disabled={uploading}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files?.[0] && handleUpload(e.dataTransfer.files[0]) }}
        className={`w-full py-3 border border-dashed rounded-lg transition-colors text-center ${dragOver ? 'border-[var(--sage)] bg-[var(--sage)]/5' : 'border-[var(--border-strong)] hover:border-[var(--sage)]'}`}
      >
        {uploading ? (
          <span className="text-xs animate-pulse text-[var(--foreground-secondary)]">Envoi...</span>
        ) : file ? (
          <div><p className="text-xs text-[var(--foreground)]">Fichier uploadé</p><p className="text-[10px] text-[var(--foreground-secondary)]">{file.name}</p></div>
        ) : (
          <div className="text-[var(--foreground-secondary)]"><Upload className="w-5 h-5 mx-auto mb-1" /><p className="text-xs">{label}</p></div>
        )}
      </button>
    </div>
  )
}

// ============================================
// PURCHASE CONTENT EDITOR (refonte v4 — Gem Or)
// ============================================
function PurchaseContentEditor({ data, update }: { data: PurchaseBlockData; update: (f: string, v: unknown) => void }) {
  const handleFileUpload = async (file: File) => {
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `purchase-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('resources').upload(fileName, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('resources').getPublicUrl(fileName)
      if (urlData) update('file', { name: file.name, url: urlData.publicUrl, size: file.size })
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  return (
    <div className="space-y-3">
      <FileUploadDropzone file={data.file} onUpload={handleFileUpload} label="Glissez un PDF ou cliquez" />
      <MonetizationButtonEditor data={data} update={update} />
      <ColorPicker label="Fond" value={data.backgroundColor} onChange={v => update('backgroundColor', v)} />
      <ColorPicker label="Bordure" value={data.borderColor} onChange={v => update('borderColor', v)} />
    </div>
  )
}

// ============================================
// CREATOR CONTENT EDITOR
// ============================================

// Plateformes issues du profil créateur
const PROFILE_SOCIAL_MAP: { platform: SocialPlatform; label: string; profileKey: keyof CreatorFormData }[] = [
  { platform: 'instagram', label: 'Instagram',  profileKey: 'instagram_handle' },
  { platform: 'youtube',   label: 'YouTube',    profileKey: 'youtube_handle'   },
  { platform: 'tiktok',    label: 'TikTok',     profileKey: 'tiktok_handle'    },
  { platform: 'website',   label: 'Site web',   profileKey: 'website_url'      },
]

const SOCIALS_DEFAULT_VISIBLE = 2

function CreatorContentEditor({
  data, update, creatorProfile,
}: {
  data: CreatorBlockData
  update: (f: string, v: unknown) => void
  creatorProfile?: CreatorFormData | null
}) {
  const [newCollabName, setNewCollabName] = useState('')
  const [socialsExpanded, setSocialsExpanded] = useState(false)

  // Filtrer uniquement les réseaux renseignés sur le profil
  const configuredSocials = PROFILE_SOCIAL_MAP.filter(
    p => creatorProfile?.[p.profileKey]
  )

  const toggleSocial = (platform: SocialPlatform, enabled: boolean) => {
    const current = data.socialLinks || []
    const exists = current.find(s => s.platform === platform)
    const updated = exists
      ? current.map(s => s.platform === platform ? { ...s, enabled } : s)
      : [...current, { platform, url: '', enabled }]
    update('socialLinks', updated)
  }

  const isSocialEnabled = (platform: SocialPlatform) =>
    data.socialLinks?.find(s => s.platform === platform)?.enabled ?? false

  const showSocials = data.variant === 'compact' || data.variant === 'full'
  const visibleSocials = socialsExpanded
    ? configuredSocials
    : configuredSocials.slice(0, SOCIALS_DEFAULT_VISIBLE)
  const hasMore = configuredSocials.length > SOCIALS_DEFAULT_VISIBLE

  return (
    <div className="space-y-3">
      {/* Sélecteur de variante */}
      <SelectControl
        label="Variante" value={data.variant || 'full'} variant="buttons"
        options={[
          { value: 'minimal',       label: 'Mini'    },
          { value: 'compact',       label: 'Compact' },
          { value: 'full',          label: 'Complet' },
          { value: 'collaborators', label: 'Équipe'  },
        ]}
        onChange={v => update('variant', v)}
      />

      {/* Réseaux sociaux — compact + complet */}
      {showSocials && configuredSocials.length > 0 && (
        <EditorSection title="Réseaux sociaux" defaultOpen={true}>
          <div className="space-y-1">
            {visibleSocials.map(social => {
              const enabled = isSocialEnabled(social.platform)
              return (
                <div
                  key={social.platform}
                  className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-[var(--surface-secondary)]"
                >
                  <span className="text-xs font-medium">{social.label}</span>
                  <button
                    onClick={() => toggleSocial(social.platform, !enabled)}
                    className={`w-8 h-4.5 rounded-full transition-colors flex-shrink-0 relative ${enabled ? 'bg-[var(--sage)]' : 'bg-[var(--border)]'}`}
                    style={{ height: '18px', width: '32px' }}
                  >
                    <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-[14px]' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              )
            })}
            {hasMore && (
              <button
                onClick={() => setSocialsExpanded(v => !v)}
                className="w-full text-[11px] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] py-1 transition-colors"
              >
                {socialsExpanded
                  ? '↑ Réduire'
                  : `+ ${configuredSocials.length - SOCIALS_DEFAULT_VISIBLE} autre${configuredSocials.length - SOCIALS_DEFAULT_VISIBLE > 1 ? 's' : ''}`
                }
              </button>
            )}
            {configuredSocials.length === 0 && (
              <p className="text-[11px] text-[var(--foreground-secondary)] italic px-1">
                Aucun réseau renseigné sur le profil.
              </p>
            )}
          </div>
        </EditorSection>
      )}

      {/* Collaborateurs — variante équipe */}
      {data.variant === 'collaborators' && (
        <EditorSection title="Collaborateurs" defaultOpen={true}>
          <div className="space-y-1.5">
            {data.collaborators?.map(collab => (
              <div key={collab.id} className="flex items-center gap-2 p-1.5 rounded-md bg-[var(--surface-secondary)]">
                <div className="w-6 h-6 rounded-full bg-[var(--sage)]/20 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                  {collab.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{collab.name}</p>
                  <input
                    type="text" value={collab.role || ''} placeholder="Rôle..."
                    onChange={e => update('collaborators', data.collaborators?.map(c => c.id === collab.id ? { ...c, role: e.target.value } : c))}
                    className="w-full text-[10px] bg-transparent border-0 outline-none text-[var(--foreground-secondary)] placeholder:text-[var(--foreground-secondary)]/30"
                  />
                </div>
                <button onClick={() => update('collaborators', data.collaborators?.filter(c => c.id !== collab.id))} className="p-0.5 text-red-400 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-1.5">
              <input
                type="text" value={newCollabName} onChange={e => setNewCollabName(e.target.value)} placeholder="Nom du collaborateur..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCollabName.trim()) {
                    update('collaborators', [...(data.collaborators || []), { id: crypto.randomUUID(), name: newCollabName.trim(), role: '' }])
                    setNewCollabName('')
                  }
                }}
                className="flex-1 h-7 px-2 text-xs rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
              />
              <button
                onClick={() => {
                  if (newCollabName.trim()) {
                    update('collaborators', [...(data.collaborators || []), { id: crypto.randomUUID(), name: newCollabName.trim(), role: '' }])
                    setNewCollabName('')
                  }
                }}
                disabled={!newCollabName.trim()}
                className="h-7 w-7 flex items-center justify-center rounded bg-[var(--sage)] text-white disabled:opacity-40"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </EditorSection>
      )}

      {/* Options communes */}
      <ToggleControl label="Badges statistiques" checked={data.showStats ?? true} onChange={v => update('showStats', v)} />
      <ToggleControl label="Bouton Suivre" checked={data.showFollowButton ?? false} onChange={v => update('showFollowButton', v)} />
      {data.variant === 'collaborators' && (
        <ToggleControl label="Parts revenus (admin)" checked={data.showRevenueShare ?? false} onChange={v => update('showRevenueShare', v)} />
      )}

      {/* Couleurs */}
      <ColorPicker label="Couleur texte" value={data.textColor} onChange={v => update('textColor', v)} />
      <ColorPicker label="Fond" value={data.backgroundColor} onChange={v => update('backgroundColor', v)} />
      {data.showFollowButton && (
        <ColorPicker label="Couleur bouton" value={data.buttonColor || '#A8B5A0'} onChange={v => update('buttonColor', v)} allowTransparent={false} />
      )}
    </div>
  )
}

// ============================================
// SEPARATOR CONTENT EDITOR
// ============================================
function SeparatorContentEditor({ data, update }: { data: SeparatorBlockData; update: (f: string, v: unknown) => void }) {
  const allStyles = [
    { value: 'line', label: 'Ligne' }, { value: 'dashed', label: 'Tirets' },
    { value: 'dotted', label: 'Pointillé' }, { value: 'double', label: 'Double' },
    { value: 'wave', label: 'Vague' }, { value: 'zigzag', label: 'Zigzag' },
    { value: 'scallop', label: 'Festons' },
    { value: 'dots', label: '● Points' }, { value: 'stars', label: '★ Étoiles' },
    { value: 'hearts', label: '♥ Cœurs' }, { value: 'diamonds', label: '◆ Losanges' },
    { value: 'gradient', label: 'Dégradé' }, { value: 'fade', label: 'Fondu' },
    { value: 'space', label: 'Espace' },
  ]

  const isWave = ['wave', 'zigzag', 'scallop'].includes(data.style)
  const isSymbol = ['dots', 'stars', 'hearts', 'diamonds', 'arrows'].includes(data.style)
  const isGradient = ['gradient', 'fade'].includes(data.style)

  return (
    <div className="space-y-3">
      <SelectControl
        label="Style" value={data.style || 'line'}
        options={allStyles}
        onChange={v => update('style', v)}
      />
      <SelectControl
        label="Direction" value={data.direction || 'horizontal'} variant="buttons"
        options={[
          { value: 'horizontal', label: '↔ Horiz.' },
          { value: 'vertical', label: '↕ Vert.' },
        ]}
        onChange={v => update('direction', v)}
      />
      <SliderControl label="Épaisseur" value={data.thickness || 2} min={1} max={20} unit="px" onChange={v => update('thickness', v)} />
      <SliderControl label="Longueur" value={data.length || 100} min={10} max={100} step={5} unit="%" onChange={v => update('length', v)} />
      <ColorPicker label="Couleur" value={data.color || '#E5E7EB'} onChange={v => update('color', v)} allowTransparent={false} />
      {isGradient && <ColorPicker label="Couleur fin" value={data.colorEnd} onChange={v => update('colorEnd', v)} />}

      {isWave && (
        <>
          <SliderControl label="Amplitude" value={data.amplitude || 10} min={2} max={50} onChange={v => update('amplitude', v)} />
          <SliderControl label="Fréquence" value={data.frequency || 5} min={1} max={20} onChange={v => update('frequency', v)} />
        </>
      )}
      {isSymbol && (
        <>
          <SliderControl label="Taille symbole" value={data.symbolSize || 16} min={8} max={40} unit="px" onChange={v => update('symbolSize', v)} />
          <SliderControl label="Nombre" value={data.symbolCount || 5} min={1} max={20} onChange={v => update('symbolCount', v)} />
        </>
      )}
      <SliderControl label="Opacité" value={data.opacity || 100} min={10} max={100} step={5} unit="%" onChange={v => update('opacity', v)} />
      <ToggleControl label="Ombre" checked={data.shadow ?? false} onChange={v => update('shadow', v)} />
      <ToggleControl label="Lueur" checked={data.glow ?? false} onChange={v => update('glow', v)} />
      {(isWave || isGradient) && <ToggleControl label="Animation" checked={data.animated ?? false} onChange={v => update('animated', v)} />}
    </div>
  )
}

// ============================================
// IMAGE GRID CONTENT EDITOR (NEW)
// ============================================
function ImageGridContentEditor({ data, update }: { data: ImageGridBlockData; update: (f: string, v: unknown) => void }) {
  const [newUrl, setNewUrl] = useState('')

  const addImage = () => {
    if (newUrl.trim()) {
      update('images', [...(data.images || []), { url: newUrl, alt: '' }])
      setNewUrl('')
    }
  }

  return (
    <div className="space-y-3">
      <SelectControl
        label="Disposition" value={data.layout || 'grid-2'}
        options={[
          { value: 'grid-2', label: '2 colonnes' },
          { value: 'grid-3', label: '3 colonnes' },
          { value: 'grid-4', label: '4 colonnes' },
          { value: 'grid-2x2', label: '2×2' },
          { value: 'grid-2x3', label: '2×3' },
          { value: 'masonry', label: 'Masonry' },
        ]}
        onChange={v => update('layout', v)}
      />
      <SliderControl label="Espacement" value={data.gap || 8} min={0} max={24} unit="px" onChange={v => update('gap', v)} />
      <ToggleControl label="Légendes" checked={data.showCaptions ?? false} onChange={v => update('showCaptions', v)} />

      {/* Images list */}
      <div className="grid grid-cols-3 gap-1.5">
        {(data.images || []).map((img, i) => (
          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border)]">
            {img.url ? (
              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--surface-secondary)] flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-[var(--foreground-secondary)]/30" />
              </div>
            )}
            <button
              onClick={() => update('images', data.images.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add image */}
      <div className="flex gap-1.5">
        <input
          type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL image..."
          onKeyDown={e => e.key === 'Enter' && addImage()}
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <button onClick={addImage} disabled={!newUrl.trim()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <CloudinaryUploader
        multiple
        onUpload={(url) => update('images', [...(data.images || []), { url, alt: '' }])}
        onUploadMultiple={(results) => update('images', [...(data.images || []), ...results.map(r => ({ url: r.url, alt: '' }))])}
        folder="petit-ilot/resources/grid"
      />
    </div>
  )
}

// ============================================
// FAQ CONTENT EDITOR (NEW)
// ============================================
function FAQContentEditor({ data, update }: { data: FAQBlockData; update: (f: string, v: unknown) => void }) {
  const [newQ, setNewQ] = useState('')

  return (
    <div className="space-y-3">
      <SelectControl
        label="Style" value={data.style || 'bordered'} variant="buttons"
        options={[
          { value: 'minimal', label: 'Minimal' },
          { value: 'bordered', label: 'Bordure' },
          { value: 'card', label: 'Carte' },
        ]}
        onChange={v => update('style', v)}
      />
      <SelectControl
        label="Mode" value={data.expandMode || 'single'} variant="buttons"
        options={[
          { value: 'single', label: 'Un seul' },
          { value: 'multiple', label: 'Plusieurs' },
        ]}
        onChange={v => update('expandMode', v)}
      />
      <SelectControl
        label="Icône" value={data.iconStyle || 'chevron'} variant="buttons"
        options={[
          { value: 'chevron', label: '›' },
          { value: 'plus', label: '+' },
          { value: 'arrow', label: '↓' },
        ]}
        onChange={v => update('iconStyle', v)}
      />

      {/* FAQ items */}
      {(data.items || []).map((item, i) => (
        <div key={i} className="p-2.5 rounded-lg bg-[var(--surface-secondary)] space-y-1.5">
          <div className="flex items-start gap-1.5">
            <span className="text-xs font-bold text-[var(--sage)] mt-0.5">Q</span>
            <input
              type="text" value={item.question}
              onChange={e => {
                const items = [...(data.items || [])]
                items[i] = { ...items[i], question: e.target.value }
                update('items', items)
              }}
              placeholder="Question..."
              className="flex-1 h-7 px-2 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
            />
            <button onClick={() => update('items', data.items.filter((_, j) => j !== i))} className="p-0.5 text-red-400 hover:text-red-600">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-xs font-bold text-[var(--foreground-secondary)] mt-0.5">R</span>
            <textarea
              value={item.answer}
              onChange={e => {
                const items = [...(data.items || [])]
                items[i] = { ...items[i], answer: e.target.value }
                update('items', items)
              }}
              placeholder="Réponse..."
              rows={2}
              className="flex-1 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)] resize-none"
            />
          </div>
        </div>
      ))}

      {/* Add item */}
      <div className="flex gap-1.5">
        <input
          type="text" value={newQ} onChange={e => setNewQ(e.target.value)} placeholder="Nouvelle question..."
          onKeyDown={e => {
            if (e.key === 'Enter' && newQ.trim()) {
              update('items', [...(data.items || []), { question: newQ.trim(), answer: '' }])
              setNewQ('')
            }
          }}
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
        <button
          onClick={() => {
            if (newQ.trim()) {
              update('items', [...(data.items || []), { question: newQ.trim(), answer: '' }])
              setNewQ('')
            }
          }}
          disabled={!newQ.trim()}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-[var(--sage)] text-white disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <SliderControl label="Taille question" value={data.questionFontSize || 16} min={12} max={24} unit="px" onChange={v => update('questionFontSize', v)} />
      <FontPicker label="Police question" value={data.questionFontFamily || 'default'} onChange={v => update('questionFontFamily', v)} />
      <ColorPicker label="Couleur question" value={data.questionColor} onChange={v => update('questionColor', v)} />
      <ColorPicker label="Couleur réponse" value={data.answerColor} onChange={v => update('answerColor', v)} />
    </div>
  )
}

// ============================================
// MATERIAL CONTENT EDITOR (NEW)
// ============================================
function MaterialContentEditor({ data, update }: { data: MaterialBlockData; update: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">Titre du bloc</label>
        <input
          type="text" value={data.titleText || 'Matériel'} onChange={e => update('titleText', e.target.value)}
          placeholder="Matériel nécessaire"
          className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
        />
      </div>
      <SelectControl
        label="Disposition" value={data.layout || 'two-columns'} variant="buttons"
        options={[
          { value: 'list', label: 'Liste' },
          { value: 'grid', label: 'Grille' },
          { value: 'two-columns', label: '2 col.' },
        ]}
        onChange={v => update('layout', v)}
      />
      <ToggleControl label="Liens d'achat" checked={data.showLinks ?? true} onChange={v => update('showLinks', v)} />
      <ToggleControl label="Badge récup" checked={data.showRecupBadge ?? true} onChange={v => update('showRecupBadge', v)} />
      {data.showLinks && (
        <ToggleControl label="Note affiliés" checked={data.showAffiliateNote ?? true} onChange={v => update('showAffiliateNote', v)} />
      )}
      <SliderControl label="Taille texte" value={data.fontSize || 14} min={10} max={24} unit="px" onChange={v => update('fontSize', v)} />
      <FontPicker label="Police" value={data.fontFamily || 'default'} onChange={v => update('fontFamily', v)} />
      <ColorPicker label="Couleur texte" value={data.textColor} onChange={v => update('textColor', v)} />
      <ColorPicker label="Fond" value={data.backgroundColor} onChange={v => update('backgroundColor', v)} />
      <ColorPicker label="Bordure" value={data.borderColor} onChange={v => update('borderColor', v)} />

      <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)]">
        <p className="text-[10px] text-[var(--foreground-secondary)] leading-relaxed">
          Ce bloc affiche automatiquement la liste de matériel saisie dans l'étape « Matériel » du wizard. Les données sont liées en temps réel.
        </p>
      </div>
    </div>
  )
}

// ============================================
// DOWNLOAD CONTENT EDITOR (NOUVEAU v4)
// ============================================
function DownloadContentEditor({ data, update }: { data: DownloadBlockData; update: (f: string, v: unknown) => void }) {
  const handleFileUpload = async (file: File) => {
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `download-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('resources').upload(fileName, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('resources').getPublicUrl(fileName)
      if (urlData) update('file', { name: file.name, url: urlData.publicUrl, size: file.size, mimeType: file.type, uploadedAt: new Date().toISOString() })
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  return (
    <div className="space-y-3">
      <FileUploadDropzone file={data.file} onUpload={handleFileUpload} label="Glissez un fichier ou cliquez" />
      <MonetizationButtonEditor data={data} update={update} />
      <ColorPicker label="Fond" value={data.backgroundColor} onChange={v => update('backgroundColor', v)} />
      <ColorPicker label="Bordure" value={data.borderColor} onChange={v => update('borderColor', v)} />
    </div>
  )
}

// ============================================
// PAID VIDEO CONTENT EDITOR (NOUVEAU v4)
// ============================================
// ============================================
// PAYWALL CONTENT EDITOR (legacy — kept for backwards compat with old block type)
// ============================================
function PaywallContentEditor({ data, update }: { data: PaywallBlockData; update: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-3">
      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
          Ce bloc est obsolète. Supprimez-le et utilisez le rideau payant via le menu + (il sera ajouté comme overlay canvas).
        </p>
      </div>
    </div>
  )
}

// ============================================
// PAYWALL EDITOR — canvas-level overlay editor (sidebar)
// ============================================
interface PaywallEditorProps {
  paywall: PaywallConfig
  onUpdate: (updates: Partial<PaywallConfig>) => void
  onClose: () => void
  onDelete: () => void
  lang: Language
}

export function PaywallEditor({ paywall, onUpdate, onClose, onDelete, lang }: PaywallEditorProps) {
  const update = (field: string, value: unknown) => {
    onUpdate({ [field]: value } as Partial<PaywallConfig>)
  }

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden" style={{
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--elevation-3)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--sage)]"><KeyRound className="w-3.5 h-3.5" /></span>
          <span className="text-sm font-semibold text-[var(--foreground)]">Rideau payant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
        >
          <X className="w-4 h-4 text-[var(--foreground-secondary)]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)]">
          <p className="text-[10px] text-[var(--foreground-secondary)] leading-relaxed">
            Glissez le bord supérieur sur le canvas pour positionner le rideau. Tout le contenu en dessous sera flouté.
          </p>
        </div>

        {/* Position */}
        <SliderControl
          label="Position Y"
          value={paywall.cutY}
          min={50} max={2000} step={8} unit="px"
          onChange={v => update('cutY', v)}
        />

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--foreground-secondary)]">Message</label>
          <input
            type="text" value={paywall.message || ''} onChange={e => update('message', e.target.value)}
            placeholder="Contenu premium"
            className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)]"
          />
        </div>

        {/* Blur */}
        <SliderControl
          label="Intensité flou"
          value={paywall.blurIntensity || 12}
          min={4} max={24} unit="px"
          onChange={v => update('blurIntensity', v)}
        />

        {/* Overlay color */}
        <ColorPicker
          label="Couleur overlay"
          value={paywall.overlayColor}
          onChange={v => update('overlayColor', v)}
        />

        {/* Overlay opacity */}
        <SliderControl
          label="Opacité overlay"
          value={paywall.overlayOpacity || 60}
          min={0} max={100} step={5} unit="%"
          onChange={v => update('overlayOpacity', v)}
        />

        {/* Button editor */}
        <MonetizationButtonEditor
          data={{
            buttonText: paywall.buttonText,
            buttonStyle: paywall.buttonStyle,
            buttonShape: paywall.buttonShape,
            buttonColor: paywall.buttonColor,
            buttonGem: paywall.buttonGem,
          }}
          update={(field, value) => update(field, value)}
        />

        {/* Delete */}
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer le rideau
        </button>
      </div>
    </div>
  )
}

// ============================================
// PROFILE HERO EDITOR
// ============================================
function ProfileHeroEditor({ data, update }: { data: ProfileHeroBlockData; update: (f: string, v: unknown) => void }) {
  const el = data.elements ?? {
    showAvatar: true, showName: true, showBio: true,
    showThemes: true, showStats: true, showSocials: true, showFollowButton: true
  }
  const updateElement = (key: keyof typeof el, val: boolean) => {
    update('elements', { ...el, [key]: val })
  }

  return (
    <div className="space-y-4">
      <SelectControl
        label="Disposition"
        value={data.layout ?? 'horizontal'}
        options={[
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
          { value: 'centered', label: 'Centré' },
        ]}
        onChange={v => update('layout', v)}
      />
      <SelectControl
        label="Variante"
        value={data.variant ?? 'full'}
        options={[
          { value: 'full', label: 'Complet' },
          { value: 'compact', label: 'Compact' },
          { value: 'mini', label: 'Mini' },
        ]}
        onChange={v => update('variant', v)}
      />
      <SelectControl
        label="Taille avatar"
        value={data.avatarSize ?? 'lg'}
        options={[
          { value: 'lg', label: 'Grand' },
          { value: 'md', label: 'Moyen' },
          { value: 'sm', label: 'Petit' },
        ]}
        onChange={v => update('avatarSize', v)}
      />
      <div>
        <label className="text-xs font-medium text-[var(--foreground-secondary)] mb-2 block">Éléments visibles</label>
        <div className="space-y-1">
          {([
            ['showAvatar', 'Avatar'],
            ['showName', 'Nom'],
            ['showBio', 'Bio'],
            ['showThemes', 'Thèmes'],
            ['showStats', 'Statistiques'],
            ['showSocials', 'Réseaux sociaux'],
            ['showFollowButton', 'Bouton Suivre'],
          ] as [keyof typeof el, string][]).map(([key, label]) => (
            <ToggleControl key={key} label={label} checked={!!el[key]} onChange={v => updateElement(key, v)} />
          ))}
        </div>
      </div>
      <p className="text-xs text-[var(--foreground-secondary)] italic">
        Les données profil (nom, bio, avatar…) sont automatiquement injectées depuis ton profil créateur.
      </p>
    </div>
  )
}

// ============================================
// CREATOR RESOURCES EDITOR
// ============================================
function CreatorResourcesEditor({ data, update }: { data: CreatorResourcesBlockData; update: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <ToggleControl label="Afficher le titre" checked={data.showTitle ?? true} onChange={v => update('showTitle', v)} />
      {data.showTitle && (
        <div>
          <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Titre de la section</label>
          <input
            type="text"
            value={data.title ?? 'Mes ressources'}
            onChange={e => update('title', e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg text-sm border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      )}
      <SelectControl
        label="Disposition"
        value={data.layout ?? 'grid'}
        options={[
          { value: 'grid', label: 'Grille' },
          { value: 'carousel', label: 'Carrousel' },
          { value: 'list', label: 'Liste' },
        ]}
        onChange={v => update('layout', v)}
      />
      {data.layout === 'grid' && (
        <SelectControl
          label="Colonnes"
          value={String(data.columns ?? 3)}
          options={[
            { value: '2', label: '2 colonnes' },
            { value: '3', label: '3 colonnes' },
            { value: '4', label: '4 colonnes' },
          ]}
          onChange={v => update('columns', Number(v))}
        />
      )}
      <SelectControl
        label="Nombre de ressources"
        value={String(data.maxItems ?? 6)}
        options={[
          { value: '4', label: '4' },
          { value: '6', label: '6' },
          { value: '8', label: '8' },
          { value: '12', label: '12' },
        ]}
        onChange={v => update('maxItems', Number(v))}
      />
      <p className="text-xs text-[var(--foreground-secondary)] italic">
        Les ressources affichées sont récupérées automatiquement depuis ton profil.
      </p>
    </div>
  )
}

// ============================================
// CREATOR FEATURED EDITOR
// ============================================
function CreatorFeaturedEditor({ data, update }: { data: CreatorFeaturedBlockData; update: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">ID de la ressource (optionnel)</label>
        <input
          type="text"
          value={data.resourceId ?? ''}
          onChange={e => update('resourceId', e.target.value || undefined)}
          placeholder="Laissez vide pour la première ressource"
          className="w-full px-3 py-1.5 rounded-lg text-sm border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>
      <SelectControl
        label="Style d'affichage"
        value={data.style ?? 'card'}
        options={[
          { value: 'card', label: 'Carte' },
          { value: 'banner', label: 'Bannière' },
          { value: 'minimal', label: 'Minimal' },
        ]}
        onChange={v => update('style', v)}
      />
      <ToggleControl label="Afficher la description" checked={data.showDescription ?? true} onChange={v => update('showDescription', v)} />
      <ToggleControl label="Afficher le prix" checked={data.showPrice ?? true} onChange={v => update('showPrice', v)} />
      <ToggleControl label="Afficher le bouton CTA" checked={data.showCta ?? true} onChange={v => update('showCta', v)} />
      {data.showCta && (
        <div>
          <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Texte du bouton</label>
          <input
            type="text"
            value={data.ctaText ?? 'Voir la ressource'}
            onChange={e => update('ctaText', e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg text-sm border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      )}
    </div>
  )
}

// ============================================
// SOCIAL WIDGET EDITOR
// ============================================
function SocialWidgetEditor({ data, update, creatorProfile }: {
  data: SocialWidgetBlockData
  update: (f: string, v: unknown) => void
  creatorProfile?: CreatorFormData | null
}) {
  const PLATFORM_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'website', label: 'Site web' },
    { value: 'newsletter', label: 'Newsletter' },
  ]

  // Auto-fill handle from creator profile when platform changes
  const getDefaultHandle = (platform: SocialWidgetPlatform): string => {
    if (!creatorProfile) return ''
    switch (platform) {
      case 'instagram': return creatorProfile.instagram_handle ?? ''
      case 'youtube': return creatorProfile.youtube_handle ?? ''
      case 'tiktok': return creatorProfile.tiktok_handle ?? ''
      case 'website': return creatorProfile.website_url ?? ''
      default: return ''
    }
  }

  const handlePlatformChange = (platform: string) => {
    const defaultHandle = getDefaultHandle(platform as SocialWidgetPlatform)
    update('platform', platform)
    if (defaultHandle && !data.handle) {
      update('handle', defaultHandle)
    }
  }

  return (
    <div className="space-y-4">
      <SelectControl
        label="Plateforme"
        value={data.platform ?? 'instagram'}
        options={PLATFORM_OPTIONS}
        onChange={handlePlatformChange}
      />
      <SelectControl
        label="Variante"
        value={data.variant ?? 'compact'}
        options={[
          { value: 'mini', label: 'Mini (icône + lien)' },
          { value: 'compact', label: 'Compact (avec bouton)' },
          { value: 'full', label: 'Complet (avec description)' },
        ]}
        onChange={v => update('variant', v)}
      />
      <div>
        <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Handle / URL</label>
        <input
          type="text"
          value={data.handle ?? getDefaultHandle(data.platform ?? 'instagram')}
          onChange={e => update('handle', e.target.value)}
          placeholder="@nomutilisateur ou URL"
          className="w-full px-3 py-1.5 rounded-lg text-sm border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>
      {(data.variant === 'compact' || data.variant === 'full') && (
        <>
          <ToggleControl label="Afficher nb abonnés" checked={data.showFollowerCount ?? true} onChange={v => update('showFollowerCount', v)} />
          {data.showFollowerCount && (
            <div>
              <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Nombre d'abonnés</label>
              <input
                type="number"
                value={data.followerCount ?? ''}
                onChange={e => update('followerCount', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="ex: 12500"
                className="w-full px-3 py-1.5 rounded-lg text-sm border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          )}
          <div>
            <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Texte bouton</label>
            <input
              type="text"
              value={data.buttonText ?? 'Suivre'}
              onChange={e => update('buttonText', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-sm border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </>
      )}
      {data.variant === 'full' && (
        <div>
          <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">Description (optionnel)</label>
          <textarea
            value={data.description ?? ''}
            onChange={e => update('description', e.target.value)}
            placeholder="Courte description de ta page..."
            rows={2}
            className="w-full px-3 py-1.5 rounded-lg text-sm border resize-none"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      )}
      <ColorPicker label="Couleur accent (optionnel)" value={data.customColor} onChange={v => update('customColor', v || undefined)} />
    </div>
  )
}

export default BlockEditor
