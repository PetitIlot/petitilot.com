'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

// Step components (v3 - 4 étapes)
import StepBasicInfo from './wizard/StepBasicInfo'
import StepMetadata from './wizard/StepMetadata'
import StepCanvas from './wizard/StepCanvas'
import StepReview from './wizard/StepReview'
import GemStepper from './wizard/GemStepper'
import type { ContentBlocksData } from '@/lib/blocks'

const translations = {
  fr: {
    // 4 étapes v3: Infos → Métadonnées → Canvas → Validation
    step1: 'Infos',
    step2: 'Métadonnées',
    step3: 'Canvas',
    step4: 'Validation',
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
    step2: 'Metadata',
    step3: 'Canvas',
    step4: 'Review',
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
    step2: 'Metadatos',
    step3: 'Canvas',
    step4: 'Revisión',
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
  url?: string
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
}

interface ResourceWizardProps {
  lang: Language
  creatorId: string
  initialData?: Partial<ResourceFormData>
  resourceId?: string
}

interface CreatorProfile {
  slug?: string
  display_name?: string
  avatar_url?: string | null
  bio?: string | null
  instagram_handle?: string | null
  youtube_handle?: string | null
  tiktok_handle?: string | null
  website_url?: string | null
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
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)

  // Fetch du profil créateur (bio + réseaux sociaux) pour le canvas
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('creators')
      .select('slug, display_name, avatar_url, bio, instagram_handle, youtube_handle, tiktok_handle, website_url')
      .eq('id', creatorId)
      .single()
      .then(({ data }) => { if (data) setCreatorProfile(data) })
  }, [creatorId])

  const t = translations[lang]
  const totalSteps = 4  // v3: 4 étapes
  const isEditMode = !!resourceId
  const isCanvasStep = currentStep === 3

  // v3: 4 étapes - Infos → Métadonnées → Canvas → Validation
  const steps = [
    { number: 1, label: t.step1 },  // Infos + Type d'activité
    { number: 2, label: t.step2 },  // Thèmes, Pédagogie, Matériel
    { number: 3, label: t.step3 },  // Canvas Editor
    { number: 4, label: t.step4 },  // Validation/Review
  ]

  const updateFormData = (updates: Partial<ResourceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        // Titre + au moins 1 type d'activité requis
        if (formData.title.trim() === '') return false
        if (formData.categories.length === 0) return false
        if (formData.collaborators.length > 0) {
          const total = formData.owner_revenue_share +
            formData.collaborators.reduce((sum, c) => sum + c.revenue_share, 0)
          return total === 100
        }
        return true
      case 2:
        return true // Métadonnées - tout optionnel
      case 3:
        return true // Canvas - optionnel
      case 4:
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
        accept_free_credits: formData.accept_free_credits,
        is_premium: formData.price_credits > 0,

        // Statut
        status: asDraft ? 'draft' : 'pending_review',
        updated_at: new Date().toISOString(),

        // Tout le contenu visuel est dans content_blocks
        content_blocks: formData.content_blocks,
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

    // v3: 4 étapes
    switch (currentStep) {
      case 1: return <StepBasicInfo {...props} />
      case 2: return <StepMetadata {...props} />
      case 3: return <StepCanvas {...props} creatorId={creatorId} creatorProfile={creatorProfile} />
      case 4: return <StepReview {...props} />
      default: return null
    }
  }

  // Layout spécial pour l'étape Canvas (plein écran)
  if (isCanvasStep) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F6] dark:bg-[#1E1E1E] pt-[60px]">
        {/* Canvas en plein écran — navigation intégrée dans la toolbar StepCanvas */}
        <div className="flex-1 overflow-y-auto">
          <StepCanvas
            formData={formData}
            updateFormData={updateFormData}
            lang={lang}
            creatorId={creatorId}
            creatorProfile={creatorProfile}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={() => handleSubmit(true)}
            canProceed={canProceed()}
            canSaveDraft={!isSubmitting && !!formData.title.trim()}
            isSubmitting={isSubmitting}
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm shadow-lg">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Layout normal pour les autres étapes
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps — Gem Stepper */}
      <div className="mb-8">
        <GemStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-3xl shadow-sm p-6 md:p-8 min-h-[400px]">
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
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          gem="terracotta"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        <div className="flex gap-3">
          {/* Bouton brouillon disponible à chaque étape */}
          <Button
            gem="neutral"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting || !formData.title.trim()}
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
              gem="sage"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !canProceed()}
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
              gem="sage"
              onClick={handleNext}
              disabled={!canProceed()}
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
