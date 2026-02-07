'use client'

import { Check, AlertCircle, Image as ImageIcon, Recycle, Gift, Paintbrush, Package } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'

const translations = {
  fr: {
    title: 'Récapitulatif',
    subtitle: 'Vérifiez les informations avant de soumettre',
    basicInfo: 'Informations essentielles',
    titleLabel: 'Titre',
    vignette: 'Vignette',
    price: 'Prix',
    credits: 'crédits',
    free: 'Gratuit',
    acceptsFreeCredits: 'Accepte crédits gratuits',
    pedagogy: 'Pédagogie',
    ageRange: 'Tranche d\'âge',
    years: 'ans',
    duration: 'Durée activité',
    durationPrep: 'Préparation',
    intensity: 'Intensité',
    difficulty: 'Difficulté',
    autonomy: 'Autonomie',
    yes: 'Oui',
    no: 'Non',
    minutes: 'min',
    categorization: 'Catégorisation',
    categories: 'Types',
    themes: 'Thèmes',
    competences: 'Compétences',
    keywords: 'Mots-clés',
    materials: 'Matériel',
    budgetType: 'Type budget',
    materialsList: 'Liste',
    canvas: 'Canvas',
    blocksConfigured: 'blocs configurés',
    noBlocks: 'Aucun bloc configuré',
    canvasHelp: 'Retournez à l\'étape Canvas pour ajouter du contenu',
    ready: 'Votre ressource est prête !',
    reviewInfo: 'Elle sera examinée par notre équipe sous 48h.',
    notSpecified: 'Non spécifié',
    noImage: 'Non définie',
    leger: 'Léger',
    moyen: 'Moyen',
    intense: 'Intense',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile'
  },
  en: {
    title: 'Summary',
    subtitle: 'Review the information before submitting',
    basicInfo: 'Essential information',
    titleLabel: 'Title',
    vignette: 'Thumbnail',
    price: 'Price',
    credits: 'credits',
    free: 'Free',
    acceptsFreeCredits: 'Accepts free credits',
    pedagogy: 'Pedagogy',
    ageRange: 'Age range',
    years: 'years',
    duration: 'Activity duration',
    durationPrep: 'Preparation',
    intensity: 'Intensity',
    difficulty: 'Difficulty',
    autonomy: 'Autonomy',
    yes: 'Yes',
    no: 'No',
    minutes: 'min',
    categorization: 'Categorization',
    categories: 'Types',
    themes: 'Themes',
    competences: 'Skills',
    keywords: 'Keywords',
    materials: 'Materials',
    budgetType: 'Budget type',
    materialsList: 'List',
    canvas: 'Canvas',
    blocksConfigured: 'blocks configured',
    noBlocks: 'No blocks configured',
    canvasHelp: 'Go back to Canvas step to add content',
    ready: 'Your resource is ready!',
    reviewInfo: 'It will be reviewed by our team within 48 hours.',
    notSpecified: 'Not specified',
    noImage: 'Not set',
    leger: 'Light',
    moyen: 'Moderate',
    intense: 'Intense',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  },
  es: {
    title: 'Resumen',
    subtitle: 'Revisa la información antes de enviar',
    basicInfo: 'Información esencial',
    titleLabel: 'Título',
    vignette: 'Miniatura',
    price: 'Precio',
    credits: 'créditos',
    free: 'Gratis',
    acceptsFreeCredits: 'Acepta créditos gratuitos',
    pedagogy: 'Pedagogía',
    ageRange: 'Rango de edad',
    years: 'años',
    duration: 'Duración actividad',
    durationPrep: 'Preparación',
    intensity: 'Intensidad',
    difficulty: 'Dificultad',
    autonomy: 'Autonomía',
    yes: 'Sí',
    no: 'No',
    minutes: 'min',
    categorization: 'Categorización',
    categories: 'Tipos',
    themes: 'Temas',
    competences: 'Competencias',
    keywords: 'Palabras clave',
    materials: 'Materiales',
    budgetType: 'Tipo presupuesto',
    materialsList: 'Lista',
    canvas: 'Canvas',
    blocksConfigured: 'bloques configurados',
    noBlocks: 'No hay bloques configurados',
    canvasHelp: 'Vuelve al paso Canvas para agregar contenido',
    ready: '¡Tu recurso está listo!',
    reviewInfo: 'Será revisado por nuestro equipo en 48 horas.',
    notSpecified: 'No especificado',
    noImage: 'No definida',
    leger: 'Ligero',
    moyen: 'Moderado',
    intense: 'Intenso',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  }
}

interface StepReviewProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepReview({ formData, lang }: StepReviewProps) {
  const t = translations[lang]

  const getIntensityLabel = (intensity: string | null) => {
    if (!intensity) return t.notSpecified
    const labels: Record<string, string> = {
      leger: t.leger,
      moyen: t.moyen,
      intense: t.intense
    }
    return labels[intensity] || t.notSpecified
  }

  const getDifficultyLabel = (difficulty: string | null) => {
    if (!difficulty) return t.notSpecified
    const labels: Record<string, string> = {
      beginner: t.easy,
      advanced: t.medium,
      expert: t.hard
    }
    return labels[difficulty] || t.notSpecified
  }

  // Helper components
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
      <h3 className="font-medium text-[#5D5A4E] text-sm mb-3 flex items-center gap-2">
        <Check className="w-4 h-4 text-[#A8B5A0]" />
        {title}
      </h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  )

  const Field = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[#5D5A4E]/60 text-xs">{label}</span>
      <span className="text-[#5D5A4E] font-medium text-right text-xs">{value}</span>
    </div>
  )

  const TagList = ({ items, color }: { items: string[]; color: string }) => (
    <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
      {items.slice(0, 5).map((item, i) => (
        <span key={i} className={`px-2 py-0.5 rounded-full text-xs ${color} text-[#5D5A4E]`}>
          {item}
        </span>
      ))}
      {items.length > 5 && (
        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-[#5D5A4E]/60">
          +{items.length - 5}
        </span>
      )}
    </div>
  )

  // Count blocks from content_blocks
  const blockCount = formData.content_blocks?.layout?.desktop?.length || 0

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E]">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 mt-1">{t.subtitle}</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Basic Info */}
        <Section title={t.basicInfo}>
          <div className="flex gap-4 items-start">
            {/* Vignette preview */}
            <div className="flex-shrink-0">
              {formData.vignette_url ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5E6D3]">
                  <img src={formData.vignette_url} alt="Vignette" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#F5E6D3] flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-[#5D5A4E]/30" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <Field label={t.titleLabel} value={formData.title || '—'} />
              <Field
                label={t.price}
                value={
                  <span className={formData.price_credits === 0 ? 'text-[#A8B5A0]' : ''}>
                    {formData.price_credits === 0 ? t.free : `${formData.price_credits} ${t.credits}`}
                  </span>
                }
              />
              {formData.price_credits > 0 && formData.accept_free_credits && (
                <div className="flex items-center gap-1.5 text-xs text-[#A8B5A0]">
                  <Gift className="w-3 h-3" />
                  {t.acceptsFreeCredits}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Pedagogy */}
        <Section title={t.pedagogy}>
          {(formData.age_min !== null || formData.age_max !== null) && (
            <Field
              label={t.ageRange}
              value={`${formData.age_min ?? '?'} - ${formData.age_max ?? '?'} ${t.years}`}
            />
          )}
          {formData.duration && (
            <Field label={t.duration} value={`${formData.duration} ${t.minutes}`} />
          )}
          {formData.duration_prep && (
            <Field label={t.durationPrep} value={`${formData.duration_prep} ${t.minutes}`} />
          )}
          <Field label={t.intensity} value={getIntensityLabel(formData.intensity)} />
          <Field label={t.difficulty} value={getDifficultyLabel(formData.difficulte)} />
          <Field label={t.autonomy} value={formData.autonomie ? t.yes : t.no} />
        </Section>

        {/* Categorization */}
        <Section title={t.categorization}>
          {formData.categories.length > 0 && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-[#5D5A4E]/60 text-xs">{t.categories}</span>
              <TagList items={formData.categories} color="bg-[#A8B5A0]/20" />
            </div>
          )}
          {formData.themes.length > 0 && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-[#5D5A4E]/60 text-xs">{t.themes}</span>
              <TagList items={formData.themes} color="bg-[#C8D8E4]/50" />
            </div>
          )}
          {formData.competences.length > 0 && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-[#5D5A4E]/60 text-xs">{t.competences}</span>
              <TagList items={formData.competences} color="bg-[#D4A59A]/20" />
            </div>
          )}
          {formData.keywords.length > 0 && (
            <Field label={t.keywords} value={formData.keywords.slice(0, 3).join(', ') + (formData.keywords.length > 3 ? '...' : '')} />
          )}
        </Section>

        {/* Materials */}
        {(formData.materials.length > 0 || formData.materiel_json.length > 0) && (
          <Section title={t.materials}>
            {formData.materials.length > 0 && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#5D5A4E]/60 text-xs">{t.budgetType}</span>
                <TagList items={formData.materials} color="bg-[#F5E6D3]" />
              </div>
            )}
            {formData.materiel_json.length > 0 && (
              <div>
                <span className="text-[#5D5A4E]/60 text-xs">{t.materialsList}:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {formData.materiel_json.slice(0, 8).map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5E6D3]/50 rounded-full text-xs text-[#5D5A4E]">
                      {item.recup && <Recycle className="w-3 h-3 text-green-600" />}
                      {item.item}
                    </span>
                  ))}
                  {formData.materiel_json.length > 8 && (
                    <span className="px-2 py-0.5 text-xs text-[#5D5A4E]/60">
                      +{formData.materiel_json.length - 8}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Canvas / Content Blocks */}
        <Section title={t.canvas}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              blockCount > 0 ? 'bg-[#A8B5A0]/20' : 'bg-amber-50'
            }`}>
              {blockCount > 0 ? (
                <Paintbrush className="w-6 h-6 text-[#A8B5A0]" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-500" />
              )}
            </div>
            <div>
              {blockCount > 0 ? (
                <p className="font-medium text-[#5D5A4E]">
                  {blockCount} {t.blocksConfigured}
                </p>
              ) : (
                <>
                  <p className="font-medium text-amber-600">{t.noBlocks}</p>
                  <p className="text-xs text-[#5D5A4E]/60">{t.canvasHelp}</p>
                </>
              )}
            </div>
          </div>
        </Section>
      </div>

      {/* Ready message */}
      <div className="mt-6 p-4 bg-[#A8B5A0]/10 rounded-xl border border-[#A8B5A0]/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#A8B5A0] flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#5D5A4E]">{t.ready}</p>
            <p className="text-sm text-[#5D5A4E]/70 mt-1">{t.reviewInfo}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
