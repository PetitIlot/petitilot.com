'use client'

import { useCallback, useState, useEffect } from 'react'
import { Info, ChevronRight, ChevronLeft, Eye, Edit3, Save, X, Bookmark, Trash2, Check, Loader2, ExternalLink, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'
import type { ContentBlocksData } from '@/lib/blocks/types'
import { FreeformCanvas } from '@/components/canvas'
import { AVAILABLE_TEMPLATES, TEMPLATE_LAYOUT_LABELS, createFromTemplate } from '@/lib/blocks/templates'
import {
  saveTemplate,
  loadCreatorTemplates,
  deleteTemplate,
  type SavedTemplate
} from '@/lib/blocks/savedTemplates'
import GemStepper from './GemStepper'

const translations = {
  fr: {
    title: 'Canvas de mise en page',
    subtitle: 'Placez librement vos contenus comme sur un tableau blanc',
    tip: 'Glissez-déposez les blocs, redimensionnez-les, et créez votre mise en page unique.',
    shortcuts: 'Double-clic (éditer) • Ctrl+D (dupliquer) • Ctrl+Z/Shift+Z (annuler/rétablir) • Ctrl+[/] (reculer/avancer)',
    startTemplate: 'Commencer avec un template',
    startEmpty: 'Canvas vide',
    backToTemplates: 'Templates',
    preview: 'Aperçu',
    editing: 'Édition',
    chooseTemplate: 'Choisissez un template',
    myTemplates: 'Mes templates sauvegardés',
    noSavedTemplates: 'Aucun template sauvegardé',
    saveAsTemplate: 'Sauvegarder template',
    saveTemplateTitle: 'Sauvegarder le template',
    templateName: 'Nom du template',
    templateNamePlaceholder: 'Ex: Ma mise en page préférée',
    templateDescription: 'Description (optionnel)',
    templateDescriptionPlaceholder: 'Décrivez votre template...',
    cancel: 'Annuler',
    save: 'Sauvegarder',
    saving: 'Sauvegarde...',
    saved: 'Template sauvegardé !',
    deleteConfirm: 'Supprimer ce template ?',
    deleteSuccess: 'Template supprimé',
    previewTitle: 'Aperçu de la ressource',
    closePreview: 'Fermer l\'aperçu',
    openInNewTab: 'Ouvrir dans un nouvel onglet',
    saveDraft: 'Sauvegarder brouillon',
    next: 'Suivant',
  },
  en: {
    title: 'Layout Canvas',
    subtitle: 'Freely place your content like on a whiteboard',
    tip: 'Drag and drop blocks, resize them, and create your unique layout.',
    shortcuts: 'Double-click (edit) • Ctrl+D (duplicate) • Ctrl+Z/Shift+Z (undo/redo) • Ctrl+[/] (back/front)',
    startTemplate: 'Start with template',
    startEmpty: 'Empty canvas',
    backToTemplates: 'Templates',
    preview: 'Preview',
    editing: 'Editing',
    chooseTemplate: 'Choose a template',
    myTemplates: 'My saved templates',
    noSavedTemplates: 'No saved templates',
    saveAsTemplate: 'Save template',
    saveTemplateTitle: 'Save template',
    templateName: 'Template name',
    templateNamePlaceholder: 'Ex: My favorite layout',
    templateDescription: 'Description (optional)',
    templateDescriptionPlaceholder: 'Describe your template...',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Template saved!',
    deleteConfirm: 'Delete this template?',
    deleteSuccess: 'Template deleted',
    previewTitle: 'Resource preview',
    closePreview: 'Close preview',
    openInNewTab: 'Open in new tab',
    saveDraft: 'Save draft',
    next: 'Next',
  },
  es: {
    title: 'Canvas de diseño',
    subtitle: 'Coloca libremente tu contenido como en una pizarra',
    tip: 'Arrastra y suelta bloques, redimensiónalos y crea tu diseño único.',
    shortcuts: 'Doble clic (editar) • Ctrl+D (duplicar) • Ctrl+Z/Shift+Z (deshacer/rehacer) • Ctrl+[/] (atrás/adelante)',
    startTemplate: 'Empezar con plantilla',
    startEmpty: 'Canvas vacío',
    backToTemplates: 'Plantillas',
    preview: 'Vista previa',
    editing: 'Edición',
    chooseTemplate: 'Elige una plantilla',
    myTemplates: 'Mis plantillas guardadas',
    noSavedTemplates: 'No hay plantillas guardadas',
    saveAsTemplate: 'Guardar plantilla',
    saveTemplateTitle: 'Guardar plantilla',
    templateName: 'Nombre de la plantilla',
    templateNamePlaceholder: 'Ej: Mi diseño favorito',
    templateDescription: 'Descripción (opcional)',
    templateDescriptionPlaceholder: 'Describe tu plantilla...',
    cancel: 'Cancelar',
    save: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Plantilla guardada!',
    deleteConfirm: '¿Eliminar esta plantilla?',
    deleteSuccess: 'Plantilla eliminada',
    previewTitle: 'Vista previa del recurso',
    closePreview: 'Cerrar vista previa',
    openInNewTab: 'Abrir en nueva pestaña',
    saveDraft: 'Guardar borrador',
    next: 'Siguiente',
  }
}

interface StepCanvasCreatorProfile {
  slug?: string
  display_name?: string
  avatar_url?: string | null
  bio?: string | null
  instagram_handle?: string | null
  youtube_handle?: string | null
  tiktok_handle?: string | null
  website_url?: string | null
}

interface StepCanvasProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
  creatorId: string
  creatorProfile?: StepCanvasCreatorProfile | null
  // Navigation props (passés depuis ResourceWizard pour l'étape canvas)
  onNext?: () => void
  onBack?: () => void
  onSaveDraft?: () => void
  canProceed?: boolean
  canSaveDraft?: boolean
  isSubmitting?: boolean
  steps?: { number: number; label: string }[]
  currentStep?: number
  onStepClick?: (step: number) => void
}

export default function StepCanvas({ formData, updateFormData, lang, creatorId, creatorProfile, onNext, onBack, onSaveDraft, canProceed, canSaveDraft, isSubmitting, steps, currentStep, onStepClick }: StepCanvasProps) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  // Sync dark mode state with document
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = useCallback(() => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
  }, [isDark])

  // Load saved templates
  useEffect(() => {
    if (creatorId && !formData.content_blocks) {
      setLoadingTemplates(true)
      loadCreatorTemplates(creatorId)
        .then(templates => {
          setSavedTemplates(templates)
        })
        .finally(() => {
          setLoadingTemplates(false)
        })
    }
  }, [creatorId, formData.content_blocks])

  // Handle canvas changes
  const handleCanvasChange = useCallback((data: ContentBlocksData) => {
    updateFormData({ content_blocks: data })
  }, [updateFormData])

  // Initialize with a specific template
  const handleSelectTemplate = useCallback((templateId: string) => {
    const templateData = createFromTemplate(templateId)
    if (templateData) {
      updateFormData({ content_blocks: templateData })
    }
  }, [updateFormData])

  // Initialize with a saved template
  const handleSelectSavedTemplate = useCallback((template: SavedTemplate) => {
    updateFormData({ content_blocks: template.layout })
  }, [updateFormData])

  // Delete a saved template
  const handleDeleteTemplate = useCallback(async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t.deleteConfirm)) return

    const success = await deleteTemplate(templateId, creatorId)
    if (success) {
      setSavedTemplates(prev => prev.filter(t => t.id !== templateId))
    }
  }, [creatorId, t.deleteConfirm])

  // Initialize empty canvas
  const handleStartEmpty = useCallback(() => {
    const emptyLayout: ContentBlocksData = {
      version: 2,
      canvas: {
        width: 800,
        height: 'auto',
        gridSize: 8,
        snapToGrid: true
      },
      layout: {
        desktop: []
      }
    }
    updateFormData({ content_blocks: emptyLayout })
  }, [updateFormData])

  // Reset to template selection
  const handleBackToTemplates = useCallback(() => {
    updateFormData({ content_blocks: null })
  }, [updateFormData])

  // Save as template
  const handleSaveTemplate = useCallback(async () => {
    if (!templateName.trim() || !formData.content_blocks) return

    setIsSaving(true)
    try {
      const saved = await saveTemplate(
        creatorId,
        templateName.trim(),
        formData.content_blocks,
        templateDescription.trim() || undefined
      )

      if (saved) {
        setSaveSuccess(true)
        setSavedTemplates(prev => [saved, ...prev])
        setTimeout(() => {
          setShowSaveModal(false)
          setSaveSuccess(false)
          setTemplateName('')
          setTemplateDescription('')
        }, 1500)
      }
    } catch (err: unknown) {
      const error = err as { message?: string; code?: string }
      console.error('Error saving template:', error?.message || error?.code || JSON.stringify(err))
    } finally {
      setIsSaving(false)
    }
  }, [creatorId, formData.content_blocks, templateName, templateDescription])

  // Show initialization options if no content_blocks yet
  if (!formData.content_blocks) {
    return (
      <div className="min-h-full flex items-start justify-center p-8 pt-10">
        <div className="max-w-4xl w-full space-y-6">
          {/* Back button */}
          {onBack && (
            <div>
              <Button variant="outline" gem="neutral" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
          )}
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5D5A4E] dark:text-white">{t.title}</h2>
            <p className="text-[#5D5A4E]/70 dark:text-white/50 mt-1">{t.subtitle}</p>
          </div>

          {/* Saved Templates Section */}
          {savedTemplates.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#5D5A4E]/70 dark:text-white/50 mb-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                {t.myTemplates}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {savedTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectSavedTemplate(template)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectSavedTemplate(template)}
                    className="p-3 border-2 border-[#A8B5A0]/30 bg-[#A8B5A0]/5 dark:border-[#6EE8A0]/20 dark:bg-[#6EE8A0]/5 rounded-xl hover:border-[#A8B5A0] hover:bg-[#A8B5A0]/10 dark:hover:border-[#6EE8A0]/40 dark:hover:bg-[#6EE8A0]/10 transition-colors text-left group relative cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💾</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#5D5A4E] text-sm group-hover:text-[#A8B5A0] dark:text-white dark:group-hover:text-[#6EE8A0] transition-colors truncate">
                          {template.name}
                        </h4>
                        {template.description && (
                          <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mt-0.5 line-clamp-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteTemplate(template.id, e)}
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title={t.deleteConfirm}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Grid — groupé par format */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium text-[#5D5A4E]/70 dark:text-white/50">
              {t.chooseTemplate}
            </h3>
            {(['narrow', 'medium', 'full'] as const).map(layoutType => {
              const templates = AVAILABLE_TEMPLATES.filter(tmpl => tmpl.layout === layoutType)
              const label = TEMPLATE_LAYOUT_LABELS[layoutType][lang]
              const widthBars: Record<typeof layoutType, string> = {
                narrow:  'w-1/3',
                medium:  'w-2/3',
                full:    'w-full',
              }
              return (
                <div key={layoutType}>
                  {/* Group header */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="flex items-center gap-0.5 h-3">
                      <div className={`h-2.5 ${widthBars[layoutType]} max-w-[48px] bg-[#A8B5A0]/40 dark:bg-[#6EE8A0]/25 rounded-sm`} />
                    </div>
                    <span className="text-xs font-semibold text-[#5D5A4E]/50 dark:text-white/35 uppercase tracking-wide">{label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className="p-3 border-2 border-gray-200 rounded-xl hover:border-[#A8B5A0] hover:bg-[#A8B5A0]/5 dark:border-white/10 dark:hover:border-[#6EE8A0]/30 dark:hover:bg-[#6EE8A0]/5 transition-colors text-left group"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{template.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#5D5A4E] text-sm group-hover:text-[#A8B5A0] dark:text-white dark:group-hover:text-[#6EE8A0] transition-colors truncate">
                              {template.name[lang]}
                            </h4>
                            <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mt-0.5 line-clamp-2">
                              {template.description[lang]}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty canvas option */}
          <button
            onClick={handleStartEmpty}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#A8B5A0] hover:bg-[#F5E6D3]/10 dark:border-white/15 dark:hover:border-[#6EE8A0]/30 dark:hover:bg-white/5 transition-colors text-center group"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#5D5A4E] dark:text-gray-500 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium text-[#5D5A4E] group-hover:text-[#A8B5A0] dark:text-white dark:group-hover:text-[#6EE8A0]">{t.startEmpty}</span>
            </div>
          </button>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 bg-sky-50 dark:bg-sky-900/20 dark:border dark:border-sky-500/20 rounded-xl text-sm">
            <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div className="text-sky-800 dark:text-sky-300">
              <p>{t.tip}</p>
              <p className="text-sky-600 dark:text-sky-400 mt-1 text-xs">{t.shortcuts}</p>
            </div>
          </div>

          {/* Loading indicator */}
          {loadingTemplates && (
            <div className="flex items-center justify-center gap-2 text-[#5D5A4E]/50 dark:text-white/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Chargement des templates...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show canvas editor - Full screen mode
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar — 3 colonnes : [templates] [stepper centré] [actions] */}
      <div className="flex items-center px-4 py-2 bg-white border-b border-gray-200 dark:bg-[#1e1e22] dark:border-white/10 gap-2">
        {/* Gauche : retour templates + sauvegarder template */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleBackToTemplates}
            variant="outline"
            gem="neutral"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToTemplates}
          </Button>
          <Button
            onClick={() => setShowSaveModal(true)}
            variant="outline"
            gem="amber"
            size="sm"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {t.saveAsTemplate}
          </Button>
        </div>

        {/* Centre : wizard stepper */}
        {steps && currentStep !== undefined && onStepClick && (
          <div className="flex-1 flex justify-center px-2">
            <div style={{ width: 220 }}>
              <GemStepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} mini />
            </div>
          </div>
        )}

        {/* Droite : theme toggle + brouillon (icône) + aperçu + suivant */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-amber-200/40 dark:text-amber-100 dark:hover:bg-amber-200/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sauvegarder brouillon — icône uniquement */}
          {onSaveDraft && (
            <button
              onClick={onSaveDraft}
              disabled={!canSaveDraft}
              title={t.saveDraft}
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white/20 dark:text-white/70 dark:hover:bg-white/10 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          )}

          {/* Aperçu */}
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant={isPreviewMode ? 'outline' : 'default'}
            gem="mauve"
            size="sm"
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="w-4 h-4" />
                {t.editing}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                {t.preview}
              </>
            )}
          </Button>

          {/* Suivant */}
          {onNext && (
            <Button
              gem="sage"
              size="sm"
              onClick={onNext}
              disabled={!canProceed}
            >
              {t.next}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Canvas container - Truly full screen */}
      <div className="flex-1 overflow-hidden">
        {isPreviewMode ? (
          // Preview Mode - Show real page preview
          <ResourcePreview formData={formData} creator={creatorProfile} lang={lang} />
        ) : (
          // Edit Mode - Show FreeformCanvas
          <FreeformCanvas
            initialData={formData.content_blocks}
            onChange={handleCanvasChange}
            lang={lang}
            readOnly={false}
            formData={{ ...formData, creator: creatorProfile ?? null }}
          />
        )}
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e1e22] rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-[#5D5A4E] dark:text-white">{t.saveTemplateTitle}</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">
                  {t.templateName} *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={t.templateNamePlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] focus:border-transparent dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/30"
                  autoFocus
                />
              </div>

              {/* Template Description */}
              <div>
                <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-1">
                  {t.templateDescription}
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder={t.templateDescriptionPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] focus:border-transparent dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/30 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm text-[#5D5A4E] hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10 rounded-lg transition-colors"
                disabled={isSaving}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || isSaving}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-[#A8B5A0] text-white hover:bg-[#A8B5A0]/90 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t.saved}
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t.save}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// RESOURCE PREVIEW COMPONENT
// ============================================
import { BlockPreview, GemButtonPreview } from '@/components/canvas/BlockPreview'
import { BlockStyleWrapper } from '@/components/canvas/BlockStyleWrapper'
import { Lock } from 'lucide-react'

function ResourcePreview({ formData, lang, creator }: { formData: ResourceFormData; lang: Language; creator: StepCanvasCreatorProfile | null | undefined }) {
  // Merge creator profile into formData for block rendering
  const previewFormData = { ...formData, creator }
  const blocks = formData.content_blocks?.layout?.desktop || []
  const config = formData.content_blocks?.canvas
  const paywall = config?.paywall

  // Sort blocks by z-index for proper layering
  const sortedBlocks = [...blocks].sort((a, b) => a.position.zIndex - b.position.zIndex)

  // Use saved canvas height from editor, fallback to estimate
  const savedHeight = typeof config?.height === 'number' ? config.height : 0
  const estimatedHeight = Math.max(
    600,
    ...sortedBlocks.map(b =>
      b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50
    )
  )
  const canvasHeight = Math.max(savedHeight, estimatedHeight)

  return (
    <div className="h-full overflow-auto bg-white dark:bg-[#1e1e22]">
      {/* Canvas Content - 100% width, no header, no margins */}
      <div
        className="relative w-full"
        style={{
          minHeight: canvasHeight,
          backgroundColor: 'var(--surface)'
        }}
      >
        {sortedBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
            <p>Aucun contenu dans le canvas</p>
          </div>
        ) : (
          sortedBlocks.map(block => (
            <div
              key={block.id}
              className="absolute"
              style={{
                left: block.position.x,
                top: block.position.y,
                width: block.position.width,
                height: block.position.height === 'auto' ? 'auto' : block.position.height,
                zIndex: block.position.zIndex,
                opacity: block.visible === false ? 0.3 : 1
              }}
            >
              {/* ✨ FIX: Wrapping with BlockStyleWrapper for pixel-perfect rendering */}
              <BlockStyleWrapper style={block.style} className="w-full h-full">
                <BlockPreview block={block} lang={lang} formData={previewFormData} />
              </BlockStyleWrapper>
            </div>
          ))
        )}

        {/* ══════════════════════════════════════════
            PAYWALL OVERLAY — canvas-level curtain
           ══════════════════════════════════════════ */}
        {paywall?.enabled && (() => {
          const pw = paywall
          const blurPx = pw.blurIntensity ?? 12
          const opacity = (pw.overlayOpacity ?? 60) / 100
          const transitionHeight = 40

          return (
            <>
              {/* Gradient transition zone (above cutY) */}
              <div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: pw.cutY - transitionHeight,
                  height: transitionHeight,
                  zIndex: 100,
                  background: `linear-gradient(180deg, transparent 0%, ${pw.overlayColor || 'rgba(255,255,255,0.6)'} 100%)`,
                  opacity,
                  backdropFilter: `blur(${blurPx * 0.3}px)`,
                  WebkitBackdropFilter: `blur(${blurPx * 0.3}px)`,
                }}
              />

              {/* Main paywall overlay */}
              <div
                className="absolute left-0 right-0 bottom-0"
                style={{
                  top: pw.cutY,
                  zIndex: 100,
                  backdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                  WebkitBackdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                  background: pw.overlayColor || 'rgba(255,255,255,0.6)',
                  opacity,
                }}
              />

              {/* Paywall content (Lock + message + button) */}
              <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
                style={{
                  top: pw.cutY + 40,
                  zIndex: 101,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Lock className="w-6 h-6 text-[var(--foreground-secondary)]" />
                </div>
                {pw.message && (
                  <p className="text-sm font-medium text-[var(--foreground)]">{pw.message}</p>
                )}
                <div className="pointer-events-auto">
                  <GemButtonPreview
                    text={pw.buttonText || 'Débloquer le contenu'}
                    style={pw.buttonStyle}
                    shape={pw.buttonShape}
                    color={pw.buttonColor}
                    gem={pw.buttonGem}
                    icon={<Lock className="w-3 h-3" />}
                  />
                </div>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
