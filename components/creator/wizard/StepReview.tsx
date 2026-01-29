'use client'

import { Check, AlertCircle, Image as ImageIcon, Film, FileText, Recycle } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'

const translations = {
  fr: {
    title: 'Récapitulatif',
    subtitle: 'Vérifiez les informations avant de soumettre',
    basicInfo: 'Informations de base',
    titleLabel: 'Titre',
    subtitleLabel: 'Sous-titre',
    description: 'Description',
    astuces: 'Astuces',
    price: 'Prix',
    credits: 'crédits',
    free: 'Gratuit',
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
    media: 'Médias',
    vignette: 'Vignette',
    mainImage: 'Image principale',
    gallery: 'Galerie',
    video: 'Vidéo',
    resourceUrl: 'Lien ressource',
    noImage: 'Non définie',
    images: 'images',
    ready: 'Votre ressource est prête !',
    reviewInfo: 'Elle sera examinée par notre équipe sous 48h.',
    notSpecified: 'Non spécifié',
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
    basicInfo: 'Basic information',
    titleLabel: 'Title',
    subtitleLabel: 'Subtitle',
    description: 'Description',
    astuces: 'Tips',
    price: 'Price',
    credits: 'credits',
    free: 'Free',
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
    media: 'Media',
    vignette: 'Thumbnail',
    mainImage: 'Main image',
    gallery: 'Gallery',
    video: 'Video',
    resourceUrl: 'Resource link',
    noImage: 'Not set',
    images: 'images',
    ready: 'Your resource is ready!',
    reviewInfo: 'It will be reviewed by our team within 48 hours.',
    notSpecified: 'Not specified',
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
    basicInfo: 'Información básica',
    titleLabel: 'Título',
    subtitleLabel: 'Subtítulo',
    description: 'Descripción',
    astuces: 'Consejos',
    price: 'Precio',
    credits: 'créditos',
    free: 'Gratis',
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
    media: 'Medios',
    vignette: 'Miniatura',
    mainImage: 'Imagen principal',
    gallery: 'Galería',
    video: 'Video',
    resourceUrl: 'Enlace recurso',
    noImage: 'No definida',
    images: 'imágenes',
    ready: '¡Tu recurso está listo!',
    reviewInfo: 'Será revisado por nuestro equipo en 48 horas.',
    notSpecified: 'No especificado',
    leger: 'Ligera',
    moyen: 'Moderada',
    intense: 'Intensa',
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

  const getIntensityLabel = (intensity: string | null): string => {
    if (!intensity) return t.notSpecified
    const labels: Record<string, string> = { leger: t.leger, moyen: t.moyen, intense: t.intense }
    return labels[intensity] || intensity
  }

  const getDifficultyLabel = (difficulty: string | null): string => {
    if (!difficulty) return t.notSpecified
    const labels: Record<string, string> = { beginner: t.easy, advanced: t.medium, expert: t.hard }
    return labels[difficulty] || difficulty
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-[#E5E7EB] pb-4">
      <h3 className="font-semibold text-[#5D5A4E] mb-3 flex items-center gap-2">
        <Check className="w-4 h-4 text-[#A8B5A0]" />
        {title}
      </h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  )

  const Field = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex justify-between gap-4">
      <span className="text-[#5D5A4E]/60 flex-shrink-0">{label}</span>
      <span className="text-[#5D5A4E] font-medium text-right truncate">{value || '-'}</span>
    </div>
  )

  const TagList = ({ items, color }: { items: string[]; color: string }) => (
    <div className="flex flex-wrap gap-1 justify-end">
      {items.map(item => (
        <span key={item} className={`px-2 py-0.5 ${color} rounded-full text-xs`}>
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E]">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 mt-1">{t.subtitle}</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {/* Basic Info */}
        <Section title={t.basicInfo}>
          <Field label={t.titleLabel} value={formData.title} />
          {formData.subtitle && <Field label={t.subtitleLabel} value={formData.subtitle} />}
          <Field
            label={t.description}
            value={formData.description.slice(0, 80) + (formData.description.length > 80 ? '...' : '')}
          />
          <Field
            label={t.price}
            value={formData.price_credits === 0 ? t.free : `${formData.price_credits} ${t.credits}`}
          />
          {formData.astuces && (
            <Field
              label={t.astuces}
              value={formData.astuces.slice(0, 50) + (formData.astuces.length > 50 ? '...' : '')}
            />
          )}
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
              <span className="text-[#5D5A4E]/60">{t.categories}</span>
              <TagList items={formData.categories} color="bg-[#A8B5A0]/20" />
            </div>
          )}
          {formData.themes.length > 0 && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-[#5D5A4E]/60">{t.themes}</span>
              <TagList items={formData.themes} color="bg-[#C8D8E4]/50" />
            </div>
          )}
          {formData.competences.length > 0 && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-[#5D5A4E]/60">{t.competences}</span>
              <TagList items={formData.competences} color="bg-[#D4A59A]/20" />
            </div>
          )}
          {formData.keywords.length > 0 && (
            <Field label={t.keywords} value={formData.keywords.join(', ')} />
          )}
        </Section>

        {/* Materials */}
        {(formData.materials.length > 0 || formData.materiel_json.length > 0) && (
          <Section title={t.materials}>
            {formData.materials.length > 0 && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#5D5A4E]/60">{t.budgetType}</span>
                <TagList items={formData.materials} color="bg-[#F5E6D3]" />
              </div>
            )}
            {formData.materiel_json.length > 0 && (
              <div>
                <span className="text-[#5D5A4E]/60 text-xs">{t.materialsList}:</span>
                <div className="mt-1 space-y-1">
                  {formData.materiel_json.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {item.recup && <Recycle className="w-3 h-3 text-green-600" />}
                      <span className="text-[#5D5A4E]">{item.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Media */}
        <Section title={t.media}>
          <div className="flex gap-3 mb-2">
            {/* Vignette preview */}
            <div className="text-center">
              <p className="text-xs text-[#5D5A4E]/60 mb-1">{t.vignette}</p>
              {formData.vignette_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5E6D3]">
                  <img src={formData.vignette_url} alt="Vignette" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#F5E6D3] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#5D5A4E]/30" />
                </div>
              )}
            </div>

            {/* Main image preview */}
            <div className="text-center">
              <p className="text-xs text-[#5D5A4E]/60 mb-1">{t.mainImage}</p>
              {formData.images_urls[0] ? (
                <div className="w-10 h-16 rounded-lg overflow-hidden bg-[#F5E6D3]">
                  <img src={formData.images_urls[0]} alt="Main" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-16 rounded-lg bg-[#F5E6D3] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#5D5A4E]/30" />
                </div>
              )}
            </div>

            {/* Gallery count */}
            {formData.gallery_urls.length > 0 && (
              <div className="text-center">
                <p className="text-xs text-[#5D5A4E]/60 mb-1">{t.gallery}</p>
                <div className="w-12 h-12 rounded-lg bg-[#F5E6D3] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#5D5A4E]">+{formData.gallery_urls.length}</span>
                </div>
              </div>
            )}
          </div>

          {formData.video_url && (
            <Field
              label={t.video}
              value={
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  {formData.video_url.slice(0, 25)}...
                </span>
              }
            />
          )}
          {formData.pdf_url && (
            <Field
              label={t.resourceUrl}
              value={
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {formData.pdf_url.replace(/^https?:\/\//, '').slice(0, 25)}...
                </span>
              }
            />
          )}
        </Section>
      </div>

      {/* Ready message */}
      <div className="bg-[#A8B5A0]/10 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-[#A8B5A0]/20 rounded-full flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-[#A8B5A0]" />
        </div>
        <div>
          <p className="font-medium text-[#5D5A4E]">{t.ready}</p>
          <p className="text-sm text-[#5D5A4E]/60 mt-1">{t.reviewInfo}</p>
        </div>
      </div>
    </div>
  )
}
