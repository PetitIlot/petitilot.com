'use client'

import { useState } from 'react'
import { X, Image as ImageIcon, Film, FileText, Plus, Link as LinkIcon } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'

const translations = {
  fr: {
    title: 'Médias et fichiers',
    subtitle: 'Ajoutez les liens vers vos visuels et votre ressource',
    vignette: 'Vignette (carrée)',
    vignetteHelp: 'Format carré 1:1, pour les cards',
    vignettePlaceholder: 'https://res.cloudinary.com/... ou autre URL image',
    mainImage: 'Image principale (portrait)',
    mainImageHelp: 'Format 3:5 portrait, pour la page détail',
    mainImagePlaceholder: 'https://res.cloudinary.com/... ou autre URL image',
    gallery: 'Galerie d\'images',
    galleryHelp: 'Ajoutez jusqu\'à 5 images supplémentaires (URLs séparées)',
    galleryPlaceholder: 'URL de l\'image',
    addImage: 'Ajouter une image',
    video: 'Vidéo (optionnel)',
    videoPlaceholder: 'https://youtube.com/... ou https://instagram.com/reel/...',
    videoHelp: 'Lien YouTube, Instagram Reels, TikTok...',
    resourceUrl: 'Lien vers la ressource',
    resourceUrlPlaceholder: 'https://drive.google.com/... ou https://canva.com/...',
    resourceUrlHelp: 'Lien Google Drive, Canva, Dropbox ou autre plateforme',
    metaDescription: 'Méta-description SEO',
    metaPlaceholder: 'Description courte pour les moteurs de recherche (max 160 caractères)',
    metaHelp: 'Apparaîtra dans les résultats Google'
  },
  en: {
    title: 'Media and files',
    subtitle: 'Add links to your visuals and your resource',
    vignette: 'Thumbnail (square)',
    vignetteHelp: 'Square format 1:1, for cards',
    vignettePlaceholder: 'https://res.cloudinary.com/... or other image URL',
    mainImage: 'Main image (portrait)',
    mainImageHelp: '3:5 portrait format, for detail page',
    mainImagePlaceholder: 'https://res.cloudinary.com/... or other image URL',
    gallery: 'Image gallery',
    galleryHelp: 'Add up to 5 additional images (separate URLs)',
    galleryPlaceholder: 'Image URL',
    addImage: 'Add image',
    video: 'Video (optional)',
    videoPlaceholder: 'https://youtube.com/... or https://instagram.com/reel/...',
    videoHelp: 'YouTube, Instagram Reels, TikTok link...',
    resourceUrl: 'Resource link',
    resourceUrlPlaceholder: 'https://drive.google.com/... or https://canva.com/...',
    resourceUrlHelp: 'Google Drive, Canva, Dropbox or other platform link',
    metaDescription: 'SEO meta description',
    metaPlaceholder: 'Short description for search engines (max 160 characters)',
    metaHelp: 'Will appear in Google results'
  },
  es: {
    title: 'Medios y archivos',
    subtitle: 'Agrega enlaces a tus visuales y tu recurso',
    vignette: 'Miniatura (cuadrada)',
    vignetteHelp: 'Formato cuadrado 1:1, para tarjetas',
    vignettePlaceholder: 'https://res.cloudinary.com/... u otra URL de imagen',
    mainImage: 'Imagen principal (retrato)',
    mainImageHelp: 'Formato 3:5 retrato, para página de detalle',
    mainImagePlaceholder: 'https://res.cloudinary.com/... u otra URL de imagen',
    gallery: 'Galería de imágenes',
    galleryHelp: 'Agrega hasta 5 imágenes adicionales (URLs separadas)',
    galleryPlaceholder: 'URL de la imagen',
    addImage: 'Agregar imagen',
    video: 'Video (opcional)',
    videoPlaceholder: 'https://youtube.com/... o https://instagram.com/reel/...',
    videoHelp: 'Enlace de YouTube, Instagram Reels, TikTok...',
    resourceUrl: 'Enlace al recurso',
    resourceUrlPlaceholder: 'https://drive.google.com/... o https://canva.com/...',
    resourceUrlHelp: 'Enlace de Google Drive, Canva, Dropbox u otra plataforma',
    metaDescription: 'Meta descripción SEO',
    metaPlaceholder: 'Descripción corta para motores de búsqueda (máx 160 caracteres)',
    metaHelp: 'Aparecerá en los resultados de Google'
  }
}

interface StepMediaProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
  creatorId: string
}

export default function StepMedia({ formData, updateFormData, lang }: StepMediaProps) {
  const t = translations[lang]
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  // Ajouter une image à la galerie
  const addGalleryImage = () => {
    if (!newGalleryUrl.trim() || formData.gallery_urls.length >= 5) return
    updateFormData({ gallery_urls: [...formData.gallery_urls, newGalleryUrl.trim()] })
    setNewGalleryUrl('')
  }

  // Supprimer une image de la galerie
  const removeGalleryImage = (index: number) => {
    updateFormData({
      gallery_urls: formData.gallery_urls.filter((_, i) => i !== index)
    })
  }

  // Composant pour prévisualiser une image depuis URL
  const ImagePreview = ({ url, aspectRatio, onRemove }: { url: string; aspectRatio: string; onRemove: () => void }) => (
    <div className={`relative ${aspectRatio} rounded-xl overflow-hidden bg-[#F5E6D3]`}>
      {url ? (
        <>
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-[#5D5A4E]" />
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <ImageIcon className="w-8 h-8 text-[#5D5A4E]/20" />
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E]">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 mt-1">{t.subtitle}</p>
      </div>

      {/* Vignette & Main Image side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Vignette (1:1) */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.vignette}</label>
          <p className="text-xs text-[#5D5A4E]/50 mb-2">{t.vignetteHelp}</p>
          <div className="relative mb-2">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D5A4E]/40" />
            <input
              type="url"
              value={formData.vignette_url}
              onChange={(e) => updateFormData({ vignette_url: e.target.value })}
              placeholder={t.vignettePlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all text-sm"
            />
          </div>
          {formData.vignette_url && (
            <ImagePreview
              url={formData.vignette_url}
              aspectRatio="aspect-square w-32"
              onRemove={() => updateFormData({ vignette_url: '' })}
            />
          )}
        </div>

        {/* Main Image (3:5) */}
        <div>
          <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.mainImage}</label>
          <p className="text-xs text-[#5D5A4E]/50 mb-2">{t.mainImageHelp}</p>
          <div className="relative mb-2">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D5A4E]/40" />
            <input
              type="url"
              value={formData.images_urls[0] || ''}
              onChange={(e) => updateFormData({ images_urls: e.target.value ? [e.target.value] : [] })}
              placeholder={t.mainImagePlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all text-sm"
            />
          </div>
          {formData.images_urls[0] && (
            <ImagePreview
              url={formData.images_urls[0]}
              aspectRatio="aspect-[3/5] w-24"
              onRemove={() => updateFormData({ images_urls: [] })}
            />
          )}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.gallery}</label>
        <p className="text-xs text-[#5D5A4E]/50 mb-2">{t.galleryHelp}</p>

        {/* Images existantes */}
        {formData.gallery_urls.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {formData.gallery_urls.map((url, index) => (
              <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5E6D3]">
                <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-white"
                >
                  <X className="w-3 h-3 text-[#5D5A4E]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter nouvelle image */}
        {formData.gallery_urls.length < 5 && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D5A4E]/40" />
              <input
                type="url"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                placeholder={t.galleryPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all text-sm"
              />
            </div>
            <button
              type="button"
              onClick={addGalleryImage}
              disabled={!newGalleryUrl.trim()}
              className="px-4 py-2.5 bg-[#A8B5A0] text-white rounded-xl hover:bg-[#95a28f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t.addImage}
            </button>
          </div>
        )}
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.video}</label>
        <div className="relative">
          <Film className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5D5A4E]/40" />
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) => updateFormData({ video_url: e.target.value })}
            placeholder={t.videoPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all"
          />
        </div>
        <p className="text-xs text-[#5D5A4E]/50 mt-1">{t.videoHelp}</p>
      </div>

      {/* Resource URL (PDF) */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.resourceUrl}</label>
        <div className="relative">
          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5D5A4E]/40" />
          <input
            type="url"
            value={formData.pdf_url}
            onChange={(e) => updateFormData({ pdf_url: e.target.value })}
            placeholder={t.resourceUrlPlaceholder}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all"
          />
        </div>
        <p className="text-xs text-[#5D5A4E]/50 mt-1">{t.resourceUrlHelp}</p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-1">{t.metaDescription}</label>
        <textarea
          value={formData.meta_seo}
          onChange={(e) => updateFormData({ meta_seo: e.target.value.slice(0, 160) })}
          placeholder={t.metaPlaceholder}
          rows={2}
          maxLength={160}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] outline-none transition-all resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-[#5D5A4E]/50">{t.metaHelp}</p>
          <p className="text-xs text-[#5D5A4E]/50">{formData.meta_seo.length}/160</p>
        </div>
      </div>
    </div>
  )
}
