'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

// Step components (v2 - 6 étapes, Collaboration intégrée dans Step1)
import StepBasicInfo from './wizard/StepBasicInfo'
import StepPedagogy from './wizard/StepPedagogy'
import StepCategories from './wizard/StepCategories'
import StepMaterials from './wizard/StepMaterials'
import StepCanvas from './wizard/StepCanvas'  // Remplace StepMedia + StepLayout
import StepReview from './wizard/StepReview'
import type { ContentBlocksData } from '@/lib/blocks'

const translations = {
  fr: {
    // 6 étapes v2: Infos (+ Collab) → Catégories → Pédagogie → Matériel → Canvas → Validation
    step1: 'Infos',
    step2: 'Catégories',
    step3: 'Pédagogie',
    step4: 'Matériel',
    step5: 'Canvas',
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
    step2: 'Categories',
    step3: 'Pedagogy',
    step4: 'Materials',
    step5: 'Canvas',
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
    step2: 'Categorías',
    step3: 'Pedagogía',
    step4: 'Materiales',
    step5: 'Canvas',
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

// Types pour le matériel (v2 - sans URL, géré via bloc list-links)
export interface MaterielItem {
  item: string
  recup: boolean
  isCustom?: boolean
}

// Types pour les collaborateurs
export interface CollaboratorData {
  id: string                   // ID unique du collaborateur invitation
  email: string               // Email du collaborateur
  creator_id?: string          // ID du créateur (quand accepté)
  display_name?: string        // Nom affiché (quand accepté)
  avatar_url?: string
  can_edit: boolean
  can_publish: boolean
  revenue_share: number       // Pourcentage (0-100)
  status: 'pending' | 'accepted' | 'rejected'
}

// Type complet du formulaire (v2 - simplifié)
export interface ResourceFormData {
  // Step 1: Infos de base (simplifié)
  title: string
  vignette_url: string        // URL image vignette
  price_credits: number
  accept_free_credits: boolean  // NOUVEAU: accepte crédits gratuits

  // Step 1.5: Collaboration (optionnel)
  collaborators: CollaboratorData[]
  owner_revenue_share: number   // Part du créateur principal (%)

  // Step 2: Pédagogie (inchangé)
  age_min: number | null
  age_max: number | null
  duration: number | null
  duration_prep: number | null
  intensity: 'leger' | 'moyen' | 'intense' | null
  difficulte: 'beginner' | 'advanced' | 'expert' | null
  autonomie: boolean

  // Step 3: Catégorisation (inchangé)
  categories: string[]
  themes: string[]
  competences: string[]
  keywords: string[]
  customThemes: string[]
  customCompetences: string[]

  // Step 4: Matériel (simplifié - sans liens affiliés)
  materials: string[]
  materiel_json: MaterielItem[]

  // Step 5: Canvas Editor (tout est dans content_blocks)
  content_blocks: ContentBlocksData | null

  // ============================================
  // Champs obsolètes (conservés pour migration)
  // À supprimer après migration des données
  // ============================================
  /** @deprecated Utiliser bloc texte dans content_blocks */
  subtitle?: string
  /** @deprecated Utiliser bloc texte dans content_blocks */
  description?: string
  /** @deprecated Utiliser bloc tip dans content_blocks */
  astuces?: string
  /** @deprecated Utiliser bloc image dans content_blocks */
  images_urls?: string[]
  /** @deprecated Utiliser bloc carousel dans content_blocks */
  gallery_urls?: string[]
  /** @deprecated Utiliser bloc video dans content_blocks */
  video_url?: string
  /** @deprecated Utiliser upload dans bloc purchase */
  pdf_url?: string
  /** @deprecated Supprimé */
  meta_seo?: string
}

export const initialFormData: ResourceFormData = {
  // Step 1: Infos de base (v2 simplifié)
  title: '',
  vignette_url: '',
  price_credits: 0,
  accept_free_credits: true, // Par défaut accepte les crédits gratuits

  // Collaboration
  collaborators: [],
  owner_revenue_share: 100, // Par défaut 100% pour le créateur

  // Step 2: Pédagogie
  age_min: null,
  age_max: null,
  duration: null,
  duration_prep: null,
  intensity: null,
  difficulte: null,
  autonomie: false,

  // Step 3: Catégorisation
  categories: [],
  themes: [],
  competences: [],
  keywords: [],
  customThemes: [],
  customCompetences: [],

  // Step 4: Matériel
  materials: [],
  materiel_json: [],

  // Step 5: Canvas
  content_blocks: null,

  // Legacy (vide pour nouvelles ressources)
  subtitle: '',
  description: '',
  astuces: '',
  images_urls: [],
  gallery_urls: [],
  video_url: '',
  pdf_url: ''
}

interface ResourceWizardProps {
  lang: Language
  creatorId: string
  initialData?: Partial<ResourceFormData>
  resourceId?: string
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
  const totalSteps = 6  // v2: 6 étapes (Collaboration intégrée dans Step1)
  const isEditMode = !!resourceId
  const isCanvasStep = currentStep === 5

  // v2: 6 étapes - Infos (+ Collab) → Pédagogie → Catégories → Matériel → Canvas → Validation
  const steps = [
    { number: 1, label: t.step1 },  // Infos de base + Collaboration
    { number: 2, label: t.step2 },  // Pédagogie
    { number: 3, label: t.step3 },  // Catégories
    { number: 4, label: t.step4 },  // Matériel
    { number: 5, label: t.step5 },  // Canvas Editor
    { number: 6, label: t.step6 }   // Validation/Review
  ]

  const updateFormData = (updates: Partial<ResourceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        // v2: Titre requis + si collaborateurs, vérifier partage total = 100%
        if (formData.title.trim() === '') return false
        if (formData.collaborators.length > 0) {
          const total = formData.owner_revenue_share +
            formData.collaborators.reduce((sum, c) => sum + c.revenue_share, 0)
          return total === 100
        }
        return true
      case 2:
        return true // Pédagogie - Champs optionnels
      case 3:
        // Au moins une catégorie ou un thème
        return formData.categories.length > 0 || formData.themes.length > 0
      case 4:
        return true // Matériel optionnel
      case 5:
        return true // Canvas - optionnel mais recommandé
      case 6:
        return true // Review - toujours OK
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

      // v2: Données simplifiées avec content_blocks
      const resourceData = {
        // Identifiants (seulement pour création)
        ...(isEditMode ? {} : {
          group_id: crypto.randomUUID(),
          creator_id: creatorId,
          slug: generateSlug(formData.title),
          lang: lang,
          type: 'activite' as const,
        }),

        // Contenu principal (v2)
        title: formData.title || 'Brouillon sans titre',
        vignette_url: formData.vignette_url || null,

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

        // Marketplace (v2)
        price_credits: formData.price_credits,
        // accept_free_credits: formData.accept_free_credits,  // Requiert migration SQL
        is_premium: formData.price_credits > 0,

        // Statut
        status: asDraft ? 'draft' : 'pending_review',
        updated_at: new Date().toISOString(),

        // v2: Tout le contenu visuel est dans content_blocks
        content_blocks: formData.content_blocks,

        // Champs legacy (conservés pour migration, seront null/vide pour nouvelles ressources)
        subtitle: formData.subtitle || null,
        description: formData.description || '',
        astuces: formData.astuces || null,
        images_urls: formData.images_urls || [],
        gallery_urls: formData.gallery_urls || [],
        video_url: formData.video_url || null,
        pdf_url: formData.pdf_url || null,
        meta_seo: {}
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

      // TODO Phase 6: Sauvegarder les collaborateurs
      // if (formData.collaborators.length > 0) {
      //   await saveCollaborators(supabase, finalResourceId, formData.collaborators)
      // }

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
      if (customTags.length > 0 && finalResourceId) {
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

    // v2: 6 étapes - Infos (+ Collab) → Catégories → Pédagogie → Matériel → Canvas → Review
    switch (currentStep) {
      case 1: return <StepBasicInfo {...props} />
      case 2: return <StepCategories {...props} />
      case 3: return <StepPedagogy {...props} />
      case 4: return <StepMaterials {...props} />
      case 5: return <StepCanvas {...props} creatorId={creatorId} />
      case 6: return <StepReview {...props} />
      default: return null
    }
  }

  // Layout spécial pour l'étape Canvas (plein écran)
  if (isCanvasStep) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F6]">
        {/* Header minimal avec navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          {/* Progress mini */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                  disabled={step.number > currentStep}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.number
                      ? 'bg-[#A8B5A0] text-white cursor-pointer hover:bg-[#95a28f]'
                      : currentStep === step.number
                      ? 'bg-[#5D5A4E] text-white'
                      : 'bg-[#F5E6D3] text-[#5D5A4E]/40 cursor-not-allowed'
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-1 rounded ${
                    currentStep > step.number ? 'bg-[#A8B5A0]' : 'bg-[#F5E6D3]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isSubmitting}
              className="border-[#5D5A4E]/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !formData.title.trim()}
              className="border-[#5D5A4E]/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              {t.saveDraft}
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#A8B5A0] hover:bg-[#95a28f] text-white"
            >
              {t.next}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Canvas en plein écran */}
        <div className="flex-1 overflow-hidden">
          <StepCanvas formData={formData} updateFormData={updateFormData} lang={lang} creatorId={creatorId} />
        </div>

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm shadow-lg">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Layout normal pour les autres étapes
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
