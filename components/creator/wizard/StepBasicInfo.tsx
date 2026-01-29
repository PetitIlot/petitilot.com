'use client'

import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'

const translations = {
  fr: {
    title: 'Informations de base',
    subtitle: 'Décrivez votre ressource',
    titleLabel: 'Titre *',
    titlePlaceholder: 'Ex: Activité sensorielle - Bac à sable lunaire',
    subtitleLabel: 'Sous-titre',
    subtitlePlaceholder: 'Ex: Découvrir les textures à travers le jeu libre',
    descriptionLabel: 'Description *',
    descriptionPlaceholder: 'Décrivez votre activité en détail : objectifs pédagogiques, déroulement, résultats attendus...',
    priceLabel: 'Prix en crédits',
    priceHelp: '0 = Gratuit. 1 crédit ≈ 1€. Recommandé : 1-5 pour fiches simples, 5-10 pour ressources complètes.',
    credits: 'crédits',
    free: 'Gratuit',
    astucesLabel: 'Astuces & conseils',
    astucesPlaceholder: 'Partagez vos conseils de pro : variantes, adaptations selon l\'âge, erreurs à éviter...'
  },
  en: {
    title: 'Basic Information',
    subtitle: 'Describe your resource',
    titleLabel: 'Title *',
    titlePlaceholder: 'Ex: Sensory activity - Moon sand bin',
    subtitleLabel: 'Subtitle',
    subtitlePlaceholder: 'Ex: Discover textures through free play',
    descriptionLabel: 'Description *',
    descriptionPlaceholder: 'Describe your activity in detail: learning objectives, process, expected results...',
    priceLabel: 'Price in credits',
    priceHelp: '0 = Free. 1 credit ≈ €1. Recommended: 1-5 for simple worksheets, 5-10 for complete resources.',
    credits: 'credits',
    free: 'Free',
    astucesLabel: 'Tips & advice',
    astucesPlaceholder: 'Share your pro tips: variations, age adaptations, mistakes to avoid...'
  },
  es: {
    title: 'Información básica',
    subtitle: 'Describe tu recurso',
    titleLabel: 'Título *',
    titlePlaceholder: 'Ej: Actividad sensorial - Bandeja de arena lunar',
    subtitleLabel: 'Subtítulo',
    subtitlePlaceholder: 'Ej: Descubrir texturas a través del juego libre',
    descriptionLabel: 'Descripción *',
    descriptionPlaceholder: 'Describe tu actividad en detalle: objetivos pedagógicos, desarrollo, resultados esperados...',
    priceLabel: 'Precio en créditos',
    priceHelp: '0 = Gratis. 1 crédito ≈ 1€. Recomendado: 1-5 para fichas simples, 5-10 para recursos completos.',
    credits: 'créditos',
    free: 'Gratis',
    astucesLabel: 'Consejos y trucos',
    astucesPlaceholder: 'Comparte tus consejos: variantes, adaptaciones por edad, errores a evitar...'
  }
}

interface StepBasicInfoProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepBasicInfo({ formData, updateFormData, lang }: StepBasicInfoProps) {
  const t = translations[lang]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E]">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 mt-1">{t.subtitle}</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.titleLabel}
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder={t.titlePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.subtitleLabel}
        </label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => updateFormData({ subtitle: e.target.value })}
          placeholder={t.subtitlePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.descriptionLabel}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder={t.descriptionPlaceholder}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.priceLabel}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="20"
            value={formData.price_credits}
            onChange={(e) => updateFormData({ price_credits: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-[#F5E6D3] rounded-lg appearance-none cursor-pointer accent-[#A8B5A0]"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={formData.price_credits}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                updateFormData({ price_credits: Math.max(0, val) })
              }}
              className={`w-16 px-2 py-2 rounded-xl text-center font-bold text-lg border outline-none transition-all ${
                formData.price_credits === 0
                  ? 'bg-[#A8B5A0]/20 text-[#A8B5A0] border-[#A8B5A0]/30'
                  : 'bg-[#F5E6D3] text-[#5D5A4E] border-[#F5E6D3]'
              }`}
            />
            <span className="text-sm text-[#5D5A4E]/60">
              {formData.price_credits === 0 ? t.free : t.credits}
            </span>
          </div>
        </div>
        <p className="text-xs text-[#5D5A4E]/50 mt-2">{t.priceHelp}</p>
      </div>

      {/* Astuces */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] mb-2">
          {t.astucesLabel}
        </label>
        <textarea
          value={formData.astuces}
          onChange={(e) => updateFormData({ astuces: e.target.value })}
          placeholder={t.astucesPlaceholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all resize-none"
        />
      </div>
    </div>
  )
}
