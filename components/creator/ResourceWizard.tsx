'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

// Step components
import StepBasicInfo from './wizard/StepBasicInfo'
import StepPedagogy from './wizard/StepPedagogy'
import StepCategories from './wizard/StepCategories'
import StepMaterials from './wizard/StepMaterials'
import StepMedia from './wizard/StepMedia'
import StepReview from './wizard/StepReview'

const translations = {
  fr: {
    step1: 'Infos',
    step2: 'Pédagogie',
    step3: 'Catégories',
    step4: 'Matériel',
    step5: 'Médias',
    step6: 'Validation',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Soumettre pour validation',
    submitting: 'Envoi en cours...',
    saveDraft: 'Sauvegarder brouillon',
    success: 'Ressource créée avec succès !',
    error: 'Une erreur est survenue'
  },
  en: {
    step1: 'Info',
    step2: 'Pedagogy',
    step3: 'Categories',
    step4: 'Materials',
    step5: 'Media',
    step6: 'Review',
    back: 'Back',
    next: 'Next',
    submit: 'Submit for review',
    submitting: 'Submitting...',
    saveDraft: 'Save draft',
    success: 'Resource created successfully!',
    error: 'An error occurred'
  },
  es: {
    step1: 'Info',
    step2: 'Pedagogía',
    step3: 'Categorías',
    step4: 'Materiales',
    step5: 'Medios',
    step6: 'Revisión',
    back: 'Volver',
    next: 'Siguiente',
    submit: 'Enviar para revisión',
    submitting: 'Enviando...',
    saveDraft: 'Guardar borrador',
    success: '¡Recurso creado con éxito!',
    error: 'Ocurrió un error'
  }
}

// Types pour le matériel
export interface MaterielItem {
  item: string
  url: string | null
  recup: boolean
  isCustom?: boolean
}

// Type complet du formulaire
export interface ResourceFormData {
  // Step 1: Infos de base
  title: string
  subtitle: string
  description: string
  price_credits: number
  astuces: string

  // Step 2: Pédagogie
  age_min: number | null
  age_max: number | null
  duration: number | null
  duration_prep: number | null
  intensity: 'leger' | 'moyen' | 'intense' | null
  difficulte: 'beginner' | 'advanced' | 'expert' | null
  autonomie: boolean

  // Step 3: Catégorisation
  categories: string[]
  themes: string[]
  competences: string[]
  keywords: string[]
  customThemes: string[]      // Thèmes custom à review
  customCompetences: string[] // Compétences custom à review

  // Step 4: Matériel
  materials: string[]
  materiel_json: MaterielItem[]

  // Step 5: Médias (URLs uniquement)
  vignette_url: string
  images_urls: string[]
  gallery_urls: string[]
  video_url: string
  pdf_url: string
  meta_seo: string
}

export const initialFormData: ResourceFormData = {
  // Step 1
  title: '',
  subtitle: '',
  description: '',
  price_credits: 0,
  astuces: '',

  // Step 2
  age_min: null,
  age_max: null,
  duration: null,
  duration_prep: null,
  intensity: null,
  difficulte: null,
  autonomie: false,

  // Step 3
  categories: [],
  themes: [],
  competences: [],
  keywords: [],
  customThemes: [],
  customCompetences: [],

  // Step 4
  materials: [],
  materiel_json: [],

  // Step 5
  vignette_url: '',
  images_urls: [],
  gallery_urls: [],
  video_url: '',
  pdf_url: '',
  meta_seo: ''
}

interface ResourceWizardProps {
  lang: Language
  creatorId: string
  initialData?: Partial<ResourceFormData>
  resourceId?: string // Pour mode édition
}

export default function ResourceWizard({ lang, creatorId, initialData, resourceId }: ResourceWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ResourceFormData>({
    ...initialFormData,
    ...initialData
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const t = translations[lang]
  const totalSteps = 6
  const isEditMode = !!resourceId

  const steps = [
    { number: 1, label: t.step1 },
    { number: 2, label: t.step2 },
    { number: 3, label: t.step3 },
    { number: 4, label: t.step4 },
    { number: 5, label: t.step5 },
    { number: 6, label: t.step6 }
  ]

  const updateFormData = (updates: Partial<ResourceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() !== '' && formData.description.trim() !== ''
      case 2:
        return true // Champs optionnels
      case 3:
        return formData.categories.length > 0 || formData.themes.length > 0
      case 4:
        return true // Matériel optionnel
      case 5:
        return true // Lien ressource optionnel
      case 6:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) + '-' + Date.now().toString(36)
  }

  const handleSubmit = async (asDraft: boolean = false) => {
    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()

      // Données à insérer/mettre à jour
      const resourceData = {
        // Identifiants (seulement pour création)
        ...(isEditMode ? {} : {
          group_id: crypto.randomUUID(),
          creator_id: creatorId,
          slug: generateSlug(formData.title),
          lang: lang,
          type: 'activite' as const,
        }),

        // Contenu
        title: formData.title || 'Brouillon sans titre',
        subtitle: formData.subtitle || null,
        description: formData.description || '',
        astuces: formData.astuces || null,

        // Pédagogie
        age_min: formData.age_min,
        age_max: formData.age_max,
        duration: formData.duration,
        duration_prep: formData.duration_prep,
        intensity: formData.intensity,
        difficulte: formData.difficulte,
        autonomie: formData.autonomie,

        // Catégorisation
        categories: formData.categories,
        themes: formData.themes,
        competences: formData.competences,
        keywords: formData.keywords,

        // Matériel
        materials: formData.materials,
        materiel_json: formData.materiel_json,

        // Médias
        vignette_url: formData.vignette_url || null,
        images_urls: formData.images_urls,
        gallery_urls: formData.gallery_urls,
        video_url: formData.video_url || null,
        pdf_url: formData.pdf_url || null,

        // SEO & Marketplace
        meta_seo: formData.meta_seo ? { description: formData.meta_seo } : {},
        price_credits: formData.price_credits,
        is_premium: formData.price_credits > 0,
        status: asDraft ? 'draft' : 'pending_review',
        updated_at: new Date().toISOString()
      }

      let finalResourceId = resourceId

      if (isEditMode) {
        // Mode édition
        const { error: updateError } = await supabase
          .from('ressources')
          .update(resourceData)
          .eq('id', resourceId)

        if (updateError) throw updateError
      } else {
        // Mode création
        const { data: inserted, error: insertError } = await supabase
          .from('ressources')
          .insert(resourceData)
          .select('id')
          .single()

        if (insertError) throw insertError
        finalResourceId = inserted.id
      }

      // Soumettre les tags custom pour review admin
      const customTags: { type: string; value: string }[] = []

      // Custom themes
      formData.customThemes.forEach(theme => {
        customTags.push({ type: 'theme', value: theme })
      })

      // Custom competences
      formData.customCompetences.forEach(comp => {
        customTags.push({ type: 'competence', value: comp })
      })

      // Custom materials
      formData.materiel_json
        .filter(m => m.isCustom)
        .forEach(m => {
          customTags.push({ type: 'material', value: m.item })
        })

      // Insérer les custom tags via la fonction RPC
      if (customTags.length > 0) {
        await Promise.all(
          customTags.map(tag =>
            supabase.rpc('submit_custom_tag', {
              p_type: tag.type,
              p_value: tag.value,
              p_resource_id: finalResourceId
            })
          )
        )
      }

      router.push(`/${lang}/createur/ressources?success=true`)
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string; details?: string }
      console.error('Submit error:', error?.message || error?.code || JSON.stringify(err))
      setError(error?.message || t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    const props = { formData, updateFormData, lang }

    switch (currentStep) {
      case 1: return <StepBasicInfo {...props} />
      case 2: return <StepPedagogy {...props} />
      case 3: return <StepCategories {...props} />
      case 4: return <StepMaterials {...props} />
      case 5: return <StepMedia {...props} creatorId={creatorId} />
      case 6: return <StepReview {...props} />
      default: return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                  disabled={step.number > currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.number
                      ? 'bg-[#A8B5A0] text-white cursor-pointer hover:bg-[#95a28f]'
                      : currentStep === step.number
                      ? 'bg-[#5D5A4E] text-white'
                      : 'bg-[#F5E6D3] text-[#5D5A4E]/60 cursor-not-allowed'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </button>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${
                  currentStep >= step.number ? 'text-[#5D5A4E]' : 'text-[#5D5A4E]/40'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded ${
                  currentStep > step.number ? 'bg-[#A8B5A0]' : 'bg-[#F5E6D3]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="border-[#5D5A4E]/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <div className="flex gap-3">
          {/* Bouton brouillon disponible à chaque étape */}
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting || !formData.title.trim()}
            className="border-[#5D5A4E]/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {t.saveDraft}
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !canProceed()}
              className="bg-[#A8B5A0] hover:bg-[#95a28f] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t.submit}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#A8B5A0] hover:bg-[#95a28f] text-white"
            >
              {t.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
