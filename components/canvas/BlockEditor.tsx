'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  X, Upload, Link, Trash2, Plus, GripVertical,
  AlignLeft, AlignCenter, AlignRight, Square, Circle, CheckSquare
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type {
  ContentBlock, BlockType, TextBlockData, ImageBlockData,
  CarouselBlockData, CarouselVideoBlockData, VideoBlockData, ListBlockData, ListLinksBlockData,
  PurchaseBlockData, TipBlockData, TitleBlockData, CreatorBlockData
} from '@/lib/blocks/types'
import { createClient } from '@/lib/supabase-client'

const translations = {
  fr: {
    editText: 'Éditer le texte',
    imageUrl: 'URL de l\'image',
    imageUrlPlaceholder: 'https://...',
    uploadImage: 'Uploader une image',
    videoUrl: 'URL de la vidéo',
    videoUrlPlaceholder: 'YouTube, Instagram ou TikTok',
    addItem: 'Ajouter un élément',
    itemLabel: 'Élément',
    linkLabel: 'Lien (optionnel)',
    uploadFile: 'Uploader le fichier',
    uploadPdf: 'Glissez un PDF ou cliquez',
    fileUploaded: 'Fichier uploadé',
    buttonText: 'Texte du bouton',
    buttonColor: 'Couleur du bouton',
    tipContent: 'Contenu de l\'astuce',
    close: 'Fermer',
    delete: 'Supprimer',
    uploading: 'Envoi...',
    maxSize: 'Taille max: 10MB',
    fontSize: 'Taille du texte',
    fontFamily: 'Police',
    alignment: 'Alignement',
    colors: 'Couleurs',
    textColor: 'Couleur du texte',
    backgroundColor: 'Fond',
    borderColor: 'Bordure',
    borderType: 'Type de bordure',
    rounded: 'Arrondi',
    square: 'Carré',
    carouselType: 'Type de carousel',
    slide: 'Défilement',
    fade: 'Fondu',
    coverflow: 'Coverflow',
    cards: 'Cartes',
    checklist: 'Liste à cocher',
    liveEdit: 'Modifications en direct'
  },
  en: {
    editText: 'Edit text',
    imageUrl: 'Image URL',
    imageUrlPlaceholder: 'https://...',
    uploadImage: 'Upload image',
    videoUrl: 'Video URL',
    videoUrlPlaceholder: 'YouTube, Instagram or TikTok',
    addItem: 'Add item',
    itemLabel: 'Item',
    linkLabel: 'Link (optional)',
    uploadFile: 'Upload file',
    uploadPdf: 'Drag a PDF or click',
    fileUploaded: 'File uploaded',
    buttonText: 'Button text',
    buttonColor: 'Button color',
    tipContent: 'Tip content',
    close: 'Close',
    delete: 'Delete',
    uploading: 'Uploading...',
    maxSize: 'Max size: 10MB',
    fontSize: 'Font size',
    fontFamily: 'Font',
    alignment: 'Alignment',
    colors: 'Colors',
    textColor: 'Text color',
    backgroundColor: 'Background',
    borderColor: 'Border',
    borderType: 'Border type',
    rounded: 'Rounded',
    square: 'Square',
    carouselType: 'Carousel type',
    slide: 'Slide',
    fade: 'Fade',
    coverflow: 'Coverflow',
    cards: 'Cards',
    checklist: 'Checklist',
    liveEdit: 'Live editing'
  },
  es: {
    editText: 'Editar texto',
    imageUrl: 'URL de la imagen',
    imageUrlPlaceholder: 'https://...',
    uploadImage: 'Subir imagen',
    videoUrl: 'URL del video',
    videoUrlPlaceholder: 'YouTube, Instagram o TikTok',
    addItem: 'Agregar elemento',
    itemLabel: 'Elemento',
    linkLabel: 'Enlace (opcional)',
    uploadFile: 'Subir archivo',
    uploadPdf: 'Arrastra un PDF o haz clic',
    fileUploaded: 'Archivo subido',
    buttonText: 'Texto del botón',
    buttonColor: 'Color del botón',
    tipContent: 'Contenido del consejo',
    close: 'Cerrar',
    delete: 'Eliminar',
    uploading: 'Subiendo...',
    maxSize: 'Tamaño máx: 10MB',
    fontSize: 'Tamaño de fuente',
    fontFamily: 'Fuente',
    alignment: 'Alineación',
    colors: 'Colores',
    textColor: 'Color de texto',
    backgroundColor: 'Fondo',
    borderColor: 'Borde',
    borderType: 'Tipo de borde',
    rounded: 'Redondeado',
    square: 'Cuadrado',
    carouselType: 'Tipo de carrusel',
    slide: 'Deslizar',
    fade: 'Desvanecer',
    coverflow: 'Coverflow',
    cards: 'Tarjetas',
    checklist: 'Lista de verificación',
    liveEdit: 'Edición en vivo'
  }
}

// ============================================
// COMMON UI COMPONENTS
// ============================================
function ColorPicker({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-16">{label}</span>
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-200"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:border-[#A8B5A0] outline-none font-mono"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-gray-400 hover:text-gray-600">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function AlignmentPicker({ value, onChange }: { value: string; onChange: (v: 'left' | 'center' | 'right') => void }) {
  return (
    <div className="flex gap-1">
      {(['left', 'center', 'right'] as const).map(a => (
        <button
          key={a}
          onClick={() => onChange(a)}
          className={`p-2 rounded-lg border-2 transition-colors ${
            value === a ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {a === 'left' && <AlignLeft className="w-4 h-4" />}
          {a === 'center' && <AlignCenter className="w-4 h-4" />}
          {a === 'right' && <AlignRight className="w-4 h-4" />}
        </button>
      ))}
    </div>
  )
}

function BorderTypePicker({ value, onChange, t }: {
  value?: 'rounded' | 'square';
  onChange: (v: 'rounded' | 'square') => void;
  t: typeof translations['fr']
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('rounded')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 text-sm transition-colors ${
          value === 'rounded' ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Circle className="w-4 h-4" />
        {t.rounded}
      </button>
      <button
        onClick={() => onChange('square')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 text-sm transition-colors ${
          value === 'square' ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Square className="w-4 h-4" />
        {t.square}
      </button>
    </div>
  )
}

function FontFamilyPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const fonts = [
    { id: 'default', label: 'Par défaut' },
    { id: 'quicksand', label: 'Quicksand' },
    { id: 'serif', label: 'Serif' },
    { id: 'mono', label: 'Mono' }
  ]
  return (
    <select
      value={value || 'default'}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none text-sm"
    >
      {fonts.map(f => (
        <option key={f.id} value={f.id}>{f.label}</option>
      ))}
    </select>
  )
}

// Editor header with live indicator and close button
function EditorHeader({ title, onClose, t }: { title: string; onClose: () => void; t: typeof translations['fr'] }) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-[#5D5A4E] text-sm">{title}</h3>
        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {t.liveEdit}
        </span>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============================================
// MAIN BLOCK EDITOR
// ============================================
interface BlockEditorProps {
  block: ContentBlock
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  lang: Language
}

export function BlockEditor({ block, onUpdate, onClose, lang }: BlockEditorProps) {
  const t = translations[lang]

  switch (block.type) {
    case 'title':
      return <TitleEditor data={block.data as TitleBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'text':
      return <TextEditor data={block.data as TextBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'image':
      return <ImageEditor data={block.data as ImageBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'carousel':
      return <CarouselEditor data={block.data as CarouselBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'carousel-video':
      return <CarouselVideoEditor data={block.data as CarouselVideoBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'video':
      return <VideoEditor data={block.data as VideoBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'list':
      return <ListEditor data={block.data as ListBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'list-links':
      return <ListLinksEditor data={block.data as ListLinksBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'purchase':
      return <PurchaseEditor data={block.data as PurchaseBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'tip':
      return <TipEditor data={block.data as TipBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    case 'creator':
      return <CreatorEditor data={block.data as CreatorBlockData} onUpdate={onUpdate} onClose={onClose} t={t} />
    default:
      return (
        <div className="p-4 text-center text-gray-500">
          Ce bloc ne peut pas être édité directement
          <button onClick={onClose} className="block mx-auto mt-2 text-sm text-[#A8B5A0]">
            Fermer
          </button>
        </div>
      )
  }
}

// ============================================
// TITLE EDITOR - v2.1 LIVE EDITING
// ============================================
function TitleEditor({ data, onUpdate, onClose, t }: {
  data: TitleBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  // Update function that immediately applies changes
  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Titre" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title Size */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.fontSize} (px)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="16"
              max="72"
              value={typeof data.titleSize === 'number' ? data.titleSize : 32}
              onChange={(e) => update('titleSize', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="12"
              max="100"
              value={typeof data.titleSize === 'number' ? data.titleSize : 32}
              onChange={(e) => update('titleSize', parseInt(e.target.value) || 32)}
              className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center"
            />
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.alignment}</label>
          <AlignmentPicker
            value={data.alignment || 'left'}
            onChange={(v) => update('alignment', v)}
          />
        </div>

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.textColor} value={data.titleColor} onChange={(v) => update('titleColor', v || undefined)} />
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
          <ColorPicker label={t.borderColor} value={data.borderColor} onChange={(v) => update('borderColor', v || undefined)} />
        </div>

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// TEXT EDITOR - v2.1 LIVE EDITING
// ============================================
function TextEditor({ data, onUpdate, onClose, t }: {
  data: TextBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Texte" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Text content */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.editText}</label>
          <textarea
            value={data.content || ''}
            onChange={(e) => update('content', e.target.value)}
            placeholder="Votre texte ici..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none resize-none"
          />
        </div>

        {/* Font size */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.fontSize} (px)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="36"
              value={data.fontSize || 16}
              onChange={(e) => update('fontSize', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="8"
              max="72"
              value={data.fontSize || 16}
              onChange={(e) => update('fontSize', parseInt(e.target.value) || 16)}
              className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center"
            />
          </div>
        </div>

        {/* Font family */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.fontFamily}</label>
          <FontFamilyPicker value={data.fontFamily} onChange={(v) => update('fontFamily', v)} />
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.alignment}</label>
          <AlignmentPicker
            value={data.alignment || 'left'}
            onChange={(v) => update('alignment', v)}
          />
        </div>

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.textColor} value={data.textColor} onChange={(v) => update('textColor', v || undefined)} />
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
          <ColorPicker label={t.borderColor} value={data.borderColor} onChange={(v) => update('borderColor', v || undefined)} />
        </div>

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// IMAGE EDITOR - v2.1 LIVE EDITING
// ============================================
function ImageEditor({ data, onUpdate, onClose, t }: {
  data: ImageBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `block-${Date.now()}.${ext}`

      const { data: uploadData, error } = await supabase.storage
        .from('resources')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName)

      if (urlData) {
        update('url', urlData.publicUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Image" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* URL input */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.imageUrl}</label>
          <input
            type="text"
            value={data.url || ''}
            onChange={(e) => update('url', e.target.value)}
            placeholder={t.imageUrlPlaceholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
          />
        </div>

        {/* Upload button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#A8B5A0] transition-colors flex items-center justify-center gap-2 text-sm text-gray-600"
          >
            {uploading ? (
              <span className="animate-pulse">{t.uploading}</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {t.uploadImage}
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 mt-1">{t.maxSize}</p>
        </div>

        {/* Preview */}
        {data.url && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img src={data.url} alt={data.alt || ''} className="w-full h-32 object-cover" />
          </div>
        )}

        {/* Alt text */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Texte alternatif</label>
          <input
            type="text"
            value={data.alt || ''}
            onChange={(e) => update('alt', e.target.value)}
            placeholder="Description de l'image"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
          />
        </div>

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CAROUSEL EDITOR - v2.1 LIVE EDITING
// ============================================
function CarouselEditor({ data, onUpdate, onClose, t }: {
  data: CarouselBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [newImageUrl, setNewImageUrl] = useState('')

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const addImage = () => {
    if (newImageUrl.trim()) {
      const images = [...(data.images || []), { url: newImageUrl, alt: '' }]
      update('images', images)
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    const images = (data.images || []).filter((_, i) => i !== index)
    update('images', images)
  }

  const carouselTypes = [
    { id: 'slide', label: t.slide, icon: '↔️' },
    { id: 'fade', label: t.fade, icon: '✨' },
    { id: 'coverflow', label: t.coverflow, icon: '🎠' },
    { id: 'cards', label: t.cards, icon: '🃏' }
  ]

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Galerie" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Carousel Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.carouselType}</label>
          <div className="grid grid-cols-2 gap-2">
            {carouselTypes.map(type => (
              <button
                key={type.id}
                onClick={() => update('carouselType', type.id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 text-sm transition-colors ${
                  data.carouselType === type.id ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add image */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder={t.imageUrlPlaceholder}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
          />
          <button
            onClick={addImage}
            disabled={!newImageUrl.trim()}
            className="px-3 py-2 bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Image list */}
        {data.images && data.images.length > 0 && (
          <div className="space-y-2">
            {data.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <img src={img.url} alt={img.alt || ''} className="w-12 h-12 object-cover rounded" />
                <span className="flex-1 text-xs text-gray-500 truncate">{img.url}</span>
                <button
                  onClick={() => removeImage(i)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CAROUSEL VIDEO EDITOR - v2.1 LIVE EDITING
// ============================================
function CarouselVideoEditor({ data, onUpdate, onClose, t }: {
  data: CarouselVideoBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [newVideoUrl, setNewVideoUrl] = useState('')

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const detectPlatform = (url: string): 'youtube' | 'instagram' | 'tiktok' | 'auto' => {
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('instagram')) return 'instagram'
    if (url.includes('tiktok')) return 'tiktok'
    return 'auto'
  }

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      const videos = [...(data.videos || []), { url: newVideoUrl, platform: detectPlatform(newVideoUrl) }]
      update('videos', videos)
      setNewVideoUrl('')
    }
  }

  const removeVideo = (index: number) => {
    const videos = (data.videos || []).filter((_, i) => i !== index)
    update('videos', videos)
  }

  const carouselTypes = [
    { id: 'slide', label: t.slide, icon: '↔️' },
    { id: 'fade', label: t.fade, icon: '✨' },
    { id: 'coverflow', label: t.coverflow, icon: '🎠' },
    { id: 'cards', label: t.cards, icon: '🃏' }
  ]

  const platformIcons: Record<string, string> = {
    youtube: '📺',
    instagram: '📸',
    tiktok: '🎵',
    auto: '🎬'
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Galerie Vidéo" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Carousel Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.carouselType}</label>
          <div className="grid grid-cols-2 gap-2">
            {carouselTypes.map(type => (
              <button
                key={type.id}
                onClick={() => update('carouselType', type.id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 text-sm transition-colors ${
                  data.carouselType === type.id ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add video */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder={t.videoUrlPlaceholder}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addVideo()}
          />
          <button
            onClick={addVideo}
            disabled={!newVideoUrl.trim()}
            className="px-3 py-2 bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Video list */}
        {data.videos && data.videos.length > 0 && (
          <div className="space-y-2">
            {data.videos.map((video, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-xl">{platformIcons[video.platform]}</span>
                <span className="flex-1 text-xs text-gray-500 truncate">{video.url}</span>
                <button
                  onClick={() => removeVideo(i)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// VIDEO EDITOR - v2.1 LIVE EDITING
// ============================================
function VideoEditor({ data, onUpdate, onClose, t }: {
  data: VideoBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  // Detect platform
  const url = data.url || ''
  const isYouTube = url.includes('youtube') || url.includes('youtu.be')
  const isInstagram = url.includes('instagram')
  const isTikTok = url.includes('tiktok')

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Vidéo" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* URL */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.videoUrl}</label>
          <input
            type="text"
            value={data.url || ''}
            onChange={(e) => update('url', e.target.value)}
            placeholder={t.videoUrlPlaceholder}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
          />
        </div>

        {/* Platform indicator */}
        {url && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm">
            <span className="text-lg">
              {isYouTube ? '📺' : isInstagram ? '📸' : isTikTok ? '🎵' : '🎬'}
            </span>
            <span className="text-gray-600">
              {isYouTube ? 'YouTube' : isInstagram ? 'Instagram' : isTikTok ? 'TikTok' : 'Vidéo'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// LIST EDITOR - v2.1 LIVE EDITING
// ============================================
function ListEditor({ data, onUpdate, onClose, t }: {
  data: ListBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [newItem, setNewItem] = useState('')

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const addItem = () => {
    if (newItem.trim()) {
      const items = [...(data.items || []), newItem.trim()]
      update('items', items)
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    const items = (data.items || []).filter((_, i) => i !== index)
    update('items', items)
  }

  const updateItem = (index: number, value: string) => {
    const items = [...(data.items || [])]
    items[index] = value
    update('items', items)
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Liste" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Checklist toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isChecklist ?? false}
            onChange={(e) => update('isChecklist', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#A8B5A0] focus:ring-[#A8B5A0]"
          />
          <span className="text-sm text-[#5D5A4E]">{t.checklist}</span>
        </label>

        {/* Items */}
        <div className="space-y-2">
          {(data.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-300" />
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:border-[#A8B5A0] outline-none"
              />
              <button
                onClick={() => removeItem(i)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t.addItem}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim()}
            className="px-3 py-2 bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Font size */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.fontSize} (px)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="24"
              value={data.fontSize || 14}
              onChange={(e) => update('fontSize', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              value={data.fontSize || 14}
              onChange={(e) => update('fontSize', parseInt(e.target.value) || 14)}
              className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center"
            />
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.alignment}</label>
          <AlignmentPicker value={data.alignment || 'left'} onChange={(v) => update('alignment', v)} />
        </div>

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.textColor} value={data.textColor} onChange={(v) => update('textColor', v || undefined)} />
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
          <ColorPicker label={t.borderColor} value={data.borderColor} onChange={(v) => update('borderColor', v || undefined)} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// LIST LINKS EDITOR - v2.1 LIVE EDITING
// ============================================
function ListLinksEditor({ data, onUpdate, onClose, t }: {
  data: ListLinksBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const addItem = () => {
    if (newLabel.trim() && newUrl.trim()) {
      const items = [...(data.items || []), { label: newLabel.trim(), url: newUrl.trim(), icon: '🔗' }]
      update('items', items)
      setNewLabel('')
      setNewUrl('')
    }
  }

  const removeItem = (index: number) => {
    const items = (data.items || []).filter((_, i) => i !== index)
    update('items', items)
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Liens" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Items */}
        <div className="space-y-2">
          {(data.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span>{item.icon || '🔗'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.url}</p>
              </div>
              <button
                onClick={() => removeItem(i)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add link */}
        <div className="space-y-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={t.itemLabel}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button
              onClick={addItem}
              disabled={!newLabel.trim() || !newUrl.trim()}
              className="px-3 py-2 bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Font size */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.fontSize} (px)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="24"
              value={data.fontSize || 14}
              onChange={(e) => update('fontSize', parseInt(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              value={data.fontSize || 14}
              onChange={(e) => update('fontSize', parseInt(e.target.value) || 14)}
              className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.textColor} value={data.textColor} onChange={(v) => update('textColor', v || undefined)} />
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// PURCHASE EDITOR - v2.1 LIVE EDITING
// ============================================
function PurchaseEditor({ data, onUpdate, onClose, t }: {
  data: PurchaseBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `purchase-${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('resources')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName)

      if (urlData) {
        update('file', { name: file.name, url: urlData.publicUrl, size: file.size })
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Achat" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.zip,.doc,.docx"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#A8B5A0] transition-colors"
          >
            {uploading ? (
              <span className="animate-pulse">{t.uploading}</span>
            ) : data.file ? (
              <div className="text-center">
                <p className="text-sm text-[#5D5A4E]">{t.fileUploaded}</p>
                <p className="text-xs text-gray-500">{data.file.name}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">{t.uploadPdf}</p>
              </div>
            )}
          </button>
        </div>

        {/* Button text */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.buttonText}</label>
          <input
            type="text"
            value={data.buttonText || ''}
            onChange={(e) => update('buttonText', e.target.value)}
            placeholder="Obtenir"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
          />
        </div>

        {/* Button color */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.buttonColor}</label>
          <input
            type="color"
            value={data.buttonColor || '#A8B5A0'}
            onChange={(e) => update('buttonColor', e.target.value)}
            className="w-full h-10 rounded cursor-pointer border border-gray-200"
          />
        </div>

        {/* Background & border colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
          <ColorPicker label={t.borderColor} value={data.borderColor} onChange={(v) => update('borderColor', v || undefined)} />
        </div>

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// TIP EDITOR - DEPRECATED
// ============================================
function TipEditor({ data, onUpdate, onClose, t }: {
  data: TipBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Astuce (obsolète)" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          ⚠️ Ce bloc est obsolète. Utilisez plutôt le bloc "Texte" pour créer des astuces personnalisées.
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.tipContent}</label>
          <textarea
            value={data.content || ''}
            onChange={(e) => update('content', e.target.value)}
            placeholder="Votre astuce..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CREATOR EDITOR - v2.1 LIVE EDITING
// ============================================
function CreatorEditor({ data, onUpdate, onClose, t }: {
  data: CreatorBlockData
  onUpdate: (data: Record<string, unknown>) => void
  onClose: () => void
  t: typeof translations['fr']
}) {
  const [newCollabName, setNewCollabName] = useState('')

  const update = useCallback((field: string, value: unknown) => {
    onUpdate({ [field]: value })
  }, [onUpdate])

  const variants = [
    { id: 'minimal', label: 'Mini', icon: '👤' },
    { id: 'compact', label: 'Compact', icon: '📇' },
    { id: 'full', label: 'Complet', icon: '📋' },
    { id: 'collaborators', label: 'Équipe', icon: '👥' }
  ] as const

  const addCollaborator = () => {
    if (newCollabName.trim()) {
      const collaborators = [
        ...(data.collaborators || []),
        { id: crypto.randomUUID(), name: newCollabName.trim(), role: '' }
      ]
      update('collaborators', collaborators)
      setNewCollabName('')
    }
  }

  const removeCollaborator = (id: string) => {
    const collaborators = (data.collaborators || []).filter(c => c.id !== id)
    update('collaborators', collaborators)
  }

  const updateCollaboratorRole = (id: string, role: string) => {
    const collaborators = (data.collaborators || []).map(c =>
      c.id === id ? { ...c, role } : c
    )
    update('collaborators', collaborators)
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <EditorHeader title="Créateur" onClose={onClose} t={t} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Variant selection */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Style d'affichage</label>
          <div className="grid grid-cols-2 gap-2">
            {variants.map(v => (
              <button
                key={v.id}
                onClick={() => update('variant', v.id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border-2 text-sm transition-colors ${
                  data.variant === v.id ? 'border-[#A8B5A0] bg-[#A8B5A0]/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Collaborators section */}
        {data.variant === 'collaborators' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <h4 className="font-medium text-blue-800 text-sm">Collaborateurs</h4>
            </div>

            {/* Existing collaborators */}
            {data.collaborators && data.collaborators.length > 0 && (
              <div className="space-y-2">
                {data.collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#A8B5A0]/20 flex items-center justify-center text-sm font-medium text-[#5D5A4E]">
                      {collab.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#5D5A4E] truncate">{collab.name}</p>
                      <input
                        type="text"
                        value={collab.role || ''}
                        onChange={(e) => updateCollaboratorRole(collab.id, e.target.value)}
                        placeholder="Rôle (ex: Co-créateur)"
                        className="w-full text-xs text-gray-500 bg-transparent border-none outline-none placeholder-gray-300"
                      />
                    </div>
                    <button
                      onClick={() => removeCollaborator(collab.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new collaborator */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCollabName}
                onChange={(e) => setNewCollabName(e.target.value)}
                placeholder="Nom du collaborateur"
                className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-lg focus:border-blue-400 outline-none bg-white"
                onKeyDown={(e) => e.key === 'Enter' && addCollaborator()}
              />
              <button
                onClick={addCollaborator}
                disabled={!newCollabName.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Show revenue share toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-800">
              <input
                type="checkbox"
                checked={data.showRevenueShare ?? false}
                onChange={(e) => update('showRevenueShare', e.target.checked)}
                className="w-4 h-4 rounded border-blue-300 text-blue-500 focus:ring-blue-500"
              />
              <span>Afficher les parts de revenus (mode admin)</span>
            </label>
          </div>
        )}

        {/* Standard options */}
        {data.variant !== 'collaborators' && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showStats ?? true}
                onChange={(e) => update('showStats', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#A8B5A0] focus:ring-[#A8B5A0]"
              />
              <span className="text-sm text-[#5D5A4E]">Afficher les statistiques</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showFollowButton ?? false}
                onChange={(e) => update('showFollowButton', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#A8B5A0] focus:ring-[#A8B5A0]"
              />
              <span className="text-sm text-[#5D5A4E]">Bouton "Suivre"</span>
            </label>
          </div>
        )}

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t">
          <label className="block text-sm text-gray-600">{t.colors}</label>
          <ColorPicker label={t.textColor} value={data.textColor} onChange={(v) => update('textColor', v || undefined)} />
          <ColorPicker label={t.backgroundColor} value={data.backgroundColor} onChange={(v) => update('backgroundColor', v || undefined)} />
          <ColorPicker label={t.borderColor} value={data.borderColor} onChange={(v) => update('borderColor', v || undefined)} />
        </div>

        {/* Border type */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{t.borderType}</label>
          <BorderTypePicker value={data.borderRadius} onChange={(v) => update('borderRadius', v)} t={t} />
        </div>
      </div>
    </div>
  )
}

export default BlockEditor
