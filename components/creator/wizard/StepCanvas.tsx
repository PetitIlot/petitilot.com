'use client'

import { useCallback, useState, useEffect } from 'react'
import { Info, ChevronRight, ChevronLeft, Eye, Edit3, Save, X, Bookmark, Trash2, Check, Loader2, ExternalLink } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData } from '../ResourceWizard'
import type { ContentBlocksData } from '@/lib/blocks/types'
import { FreeformCanvas } from '@/components/canvas'
import { AVAILABLE_TEMPLATES, createFromTemplate } from '@/lib/blocks/templates'
import {
  saveTemplate,
  loadCreatorTemplates,
  deleteTemplate,
  type SavedTemplate
} from '@/lib/blocks/savedTemplates'

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
    openInNewTab: 'Ouvrir dans un nouvel onglet'
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
    openInNewTab: 'Open in new tab'
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
    openInNewTab: 'Abrir en nueva pestaña'
  }
}

interface StepCanvasProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
  creatorId: string
}

export default function StepCanvas({ formData, updateFormData, lang, creatorId }: StepCanvasProps) {
  const t = translations[lang]
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

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
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5D5A4E]">{t.title}</h2>
            <p className="text-[#5D5A4E]/70 mt-1">{t.subtitle}</p>
          </div>

          {/* Saved Templates Section */}
          {savedTemplates.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#5D5A4E]/70 mb-3 flex items-center gap-2">
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
                    className="p-3 border-2 border-[#A8B5A0]/30 bg-[#A8B5A0]/5 rounded-xl hover:border-[#A8B5A0] hover:bg-[#A8B5A0]/10 transition-colors text-left group relative cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💾</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#5D5A4E] text-sm group-hover:text-[#A8B5A0] transition-colors truncate">
                          {template.name}
                        </h4>
                        {template.description && (
                          <p className="text-xs text-[#5D5A4E]/50 mt-0.5 line-clamp-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteTemplate(template.id, e)}
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                      title={t.deleteConfirm}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Grid */}
          <div>
            <h3 className="text-sm font-medium text-[#5D5A4E]/70 mb-3">
              {t.chooseTemplate}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AVAILABLE_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="p-3 border-2 border-gray-200 rounded-xl hover:border-[#A8B5A0] hover:bg-[#A8B5A0]/5 transition-colors text-left group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#5D5A4E] text-sm group-hover:text-[#A8B5A0] transition-colors truncate">
                        {template.name[lang]}
                      </h4>
                      <p className="text-xs text-[#5D5A4E]/50 mt-0.5 line-clamp-2">
                        {template.description[lang]}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Empty canvas option */}
          <button
            onClick={handleStartEmpty}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#A8B5A0] hover:bg-[#F5E6D3]/10 transition-colors text-center group"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#5D5A4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium text-[#5D5A4E] group-hover:text-[#A8B5A0]">{t.startEmpty}</span>
            </div>
          </button>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 bg-sky-50 rounded-xl text-sm">
            <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div className="text-sky-800">
              <p>{t.tip}</p>
              <p className="text-sky-600 mt-1 text-xs">{t.shortcuts}</p>
            </div>
          </div>

          {/* Loading indicator */}
          {loadingTemplates && (
            <div className="flex items-center justify-center gap-2 text-[#5D5A4E]/50 text-sm">
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Back to template selection */}
          <button
            onClick={handleBackToTemplates}
            className="flex items-center gap-1 px-2 py-1 text-sm text-[#5D5A4E]/70 hover:text-[#5D5A4E] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToTemplates}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Save as template button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-2 py-1 text-sm bg-[#F5E6D3] text-[#5D5A4E] hover:bg-[#F5E6D3]/80 rounded-lg transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {t.saveAsTemplate}
          </button>

          {/* Preview mode toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              isPreviewMode
                ? 'bg-[#A8B5A0] text-white'
                : 'bg-gray-100 text-[#5D5A4E] hover:bg-gray-200'
            }`}
          >
            {isPreviewMode ? (
              <>
                <Eye className="w-4 h-4" />
                {t.preview}
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                {t.editing}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas container - Truly full screen */}
      <div className="flex-1 overflow-hidden">
        {isPreviewMode ? (
          // Preview Mode - Show real page preview
          <ResourcePreview formData={formData} lang={lang} />
        ) : (
          // Edit Mode - Show FreeformCanvas
          <FreeformCanvas
            initialData={formData.content_blocks}
            onChange={handleCanvasChange}
            lang={lang}
            readOnly={false}
          />
        )}
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#5D5A4E]">{t.saveTemplateTitle}</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-[#5D5A4E] mb-1">
                  {t.templateName} *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={t.templateNamePlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Template Description */}
              <div>
                <label className="block text-sm font-medium text-[#5D5A4E] mb-1">
                  {t.templateDescription}
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder={t.templateDescriptionPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm text-[#5D5A4E] hover:bg-gray-100 rounded-lg transition-colors"
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
import { BlockPreview } from '@/components/canvas/BlockPreview'

function ResourcePreview({ formData, lang }: { formData: ResourceFormData; lang: Language }) {
  const blocks = formData.content_blocks?.layout?.desktop || []

  // Sort blocks by z-index for proper layering
  const sortedBlocks = [...blocks].sort((a, b) => a.position.zIndex - b.position.zIndex)

  // Calculate canvas height based on blocks
  const canvasHeight = Math.max(
    600,
    ...sortedBlocks.map(b =>
      b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50
    )
  )

  return (
    <div className="h-full overflow-auto bg-white">
      {/* Canvas Content - 100% width, no header, no margins */}
      <div
        className="relative w-full"
        style={{ minHeight: canvasHeight }}
      >
        {sortedBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
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
              <BlockPreview block={block} lang={lang} formData={formData} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
