'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  X, Image as ImageIcon, Coins, Gift, Users,
  Plus, Trash2, UserPlus, Percent, Crown, Edit2, Check, AlertTriangle
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData, CollaboratorData } from '../ResourceWizard'
import { createClient } from '@/lib/supabase-client'
import { GEMS, type GemColor } from '@/components/ui/button'
import { hexToRgb } from '@/components/filters/gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const categoryOptions: { value: string; label: Record<string, string>; gem: GemColor }[] = [
  { value: 'sensoriel', label: { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' }, gem: 'rose' },
  { value: 'motricite-fine', label: { fr: 'Motricité fine', en: 'Fine motor', es: 'Motricidad fina' }, gem: 'mauve' },
  { value: 'motricite-globale', label: { fr: 'Motricité globale', en: 'Gross motor', es: 'Motricidad gruesa' }, gem: 'sky' },
  { value: 'art-plastique', label: { fr: 'Art plastique', en: 'Visual arts', es: 'Artes plásticas' }, gem: 'terracotta' },
  { value: 'nature-plein-air', label: { fr: 'Nature & plein air', en: 'Nature & outdoor', es: 'Naturaleza' }, gem: 'sage' },
  { value: 'diy-recup', label: { fr: 'DIY & récup', en: 'DIY & recycling', es: 'DIY & reciclaje' }, gem: 'amber' },
  { value: 'cuisine', label: { fr: 'Cuisine', en: 'Cooking', es: 'Cocina' }, gem: 'terracotta' },
  { value: 'jeux-symboliques', label: { fr: 'Jeux symboliques', en: 'Imaginative play', es: 'Juego simbólico' }, gem: 'mauve' },
  { value: 'rituels-routines', label: { fr: 'Rituels & routines', en: 'Routines', es: 'Rutinas' }, gem: 'neutral' },
  { value: 'imprimables', label: { fr: 'Imprimables', en: 'Printables', es: 'Imprimibles' }, gem: 'sky' },
]

const translations = {
  fr: {
    title: 'Informations essentielles',
    subtitle: 'Les bases de votre ressource',
    titleLabel: 'Titre *',
    categories: 'Type d\'activité *',
    categoriesHelp: 'Sélectionnez 1 à 3 types',
    titlePlaceholder: 'Ex: Activité sensorielle - Bac à sable lunaire',
    titleHelp: 'Un titre accrocheur qui décrit clairement votre activité',
    vignetteLabel: 'Image de couverture',
    vignetteHelp: 'Image carrée recommandée (1:1). Taille max 2MB.',
    vignetteUpload: 'Cliquer ou glisser une image',
    vignetteChange: 'Changer l\'image',
    priceLabel: 'Prix en crédits',
    priceHelp: '0 = Gratuit. 1 crédit ≈ 1€. Recommandé : 1-5 pour fiches simples.',
    credits: 'crédits',
    free: 'Gratuit',
    acceptFreeCredits: 'Accepter les crédits gratuits',
    acceptFreeCreditsHelp: 'Permet aux utilisateurs avec des crédits d\'essai gratuits d\'obtenir votre ressource. ⚠️ Les crédits gratuits ne génèrent pas de rémunération.',
    uploading: 'Envoi en cours...',
    uploadError: 'Erreur d\'upload',
    // Collaboration
    hasCollaborators: 'Créer avec un collaborateur',
    hasCollaboratorsHelp: 'Invitez un co-créateur et partagez les revenus',
    addCollaborator: 'Ajouter un collaborateur',
    revenueShare: 'Partage des revenus',
    yourShare: 'Votre part',
    totalShare: 'Total',
    owner: 'Propriétaire',
    totalWarning: 'Le total doit être égal à 100%',
    emailLabel: 'Email du collaborateur',
    emailPlaceholder: 'collaborateur@email.com',
    shareLabel: 'Part des revenus (%)',
    permissionsLabel: 'Permissions',
    canEdit: 'Peut éditer',
    canPublish: 'Peut publier',
    pending: 'En attente',
    accepted: 'Accepté',
    cancel: 'Annuler',
    remove: 'Retirer'
  },
  en: {
    title: 'Essential Information',
    subtitle: 'The basics of your resource',
    titleLabel: 'Title *',
    titlePlaceholder: 'Ex: Sensory activity - Moon sand bin',
    titleHelp: 'A catchy title that clearly describes your activity',
    categories: 'Activity type *',
    categoriesHelp: 'Select 1 to 3 types',
    vignetteLabel: 'Cover image',
    vignetteHelp: 'Square image recommended (1:1). Max size 2MB.',
    vignetteUpload: 'Click or drag an image',
    vignetteChange: 'Change image',
    priceLabel: 'Price in credits',
    priceHelp: '0 = Free. 1 credit ≈ €1. Recommended: 1-5 for simple worksheets.',
    credits: 'credits',
    free: 'Free',
    acceptFreeCredits: 'Accept free credits',
    acceptFreeCreditsHelp: 'Allow users with free trial credits to get your resource. ⚠️ Free credits do not generate revenue.',
    uploading: 'Uploading...',
    uploadError: 'Upload error',
    // Collaboration
    hasCollaborators: 'Create with a collaborator',
    hasCollaboratorsHelp: 'Invite a co-creator and share revenue',
    addCollaborator: 'Add collaborator',
    revenueShare: 'Revenue share',
    yourShare: 'Your share',
    totalShare: 'Total',
    owner: 'Owner',
    totalWarning: 'Total must equal 100%',
    emailLabel: 'Collaborator email',
    emailPlaceholder: 'collaborator@email.com',
    shareLabel: 'Revenue share (%)',
    permissionsLabel: 'Permissions',
    canEdit: 'Can edit',
    canPublish: 'Can publish',
    pending: 'Pending',
    accepted: 'Accepted',
    cancel: 'Cancel',
    remove: 'Remove'
  },
  es: {
    title: 'Información esencial',
    subtitle: 'Los fundamentos de tu recurso',
    titleLabel: 'Título *',
    titlePlaceholder: 'Ej: Actividad sensorial - Bandeja de arena lunar',
    titleHelp: 'Un título atractivo que describa claramente tu actividad',
    categories: 'Tipo de actividad *',
    categoriesHelp: 'Selecciona de 1 a 3 tipos',
    vignetteLabel: 'Imagen de portada',
    vignetteHelp: 'Imagen cuadrada recomendada (1:1). Tamaño máx 2MB.',
    vignetteUpload: 'Haz clic o arrastra una imagen',
    vignetteChange: 'Cambiar imagen',
    priceLabel: 'Precio en créditos',
    priceHelp: '0 = Gratis. 1 crédito ≈ 1€. Recomendado: 1-5 para fichas simples.',
    credits: 'créditos',
    free: 'Gratis',
    acceptFreeCredits: 'Aceptar créditos gratuitos',
    acceptFreeCreditsHelp: 'Permite a usuarios con créditos de prueba obtener tu recurso. ⚠️ Los créditos gratuitos no generan remuneración.',
    uploading: 'Subiendo...',
    uploadError: 'Error de subida',
    // Collaboration
    hasCollaborators: 'Crear con un colaborador',
    hasCollaboratorsHelp: 'Invita a un co-creador y comparte ingresos',
    addCollaborator: 'Agregar colaborador',
    revenueShare: 'Reparto de ingresos',
    yourShare: 'Tu parte',
    totalShare: 'Total',
    owner: 'Propietario',
    totalWarning: 'El total debe ser igual a 100%',
    emailLabel: 'Email del colaborador',
    emailPlaceholder: 'colaborador@email.com',
    shareLabel: 'Parte de ingresos (%)',
    permissionsLabel: 'Permisos',
    canEdit: 'Puede editar',
    canPublish: 'Puede publicar',
    pending: 'Pendiente',
    accepted: 'Aceptado',
    cancel: 'Cancelar',
    remove: 'Eliminar'
  }
}

interface StepBasicInfoProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
}

export default function StepBasicInfo({ formData, updateFormData, lang }: StepBasicInfoProps) {
  const t = translations[lang]
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const toggleCategory = (value: string) => {
    const current = formData.categories
    if (current.includes(value)) {
      updateFormData({ categories: current.filter(c => c !== value) })
    } else if (current.length < 3) {
      updateFormData({ categories: [...current, value] })
    }
  }

  // Collaboration state
  const [hasCollaborators, setHasCollaborators] = useState(formData.collaborators.length > 0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newShare, setNewShare] = useState(10)
  const [newCanEdit, setNewCanEdit] = useState(true)
  const [newCanPublish, setNewCanPublish] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editShare, setEditShare] = useState(0)

  // Collaboration helpers
  const collaborators = formData.collaborators || []
  const ownerShare = formData.owner_revenue_share ?? 100
  const collaboratorsTotalShare = collaborators.reduce((sum, c) => sum + c.revenue_share, 0)
  const totalShare = ownerShare + collaboratorsTotalShare
  const isValidTotal = totalShare === 100

  // Upload image vers Supabase Storage
  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Le fichier doit être une image')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('L\'image ne doit pas dépasser 2MB')
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      const supabase = createClient()

      // Générer un nom unique
      const ext = file.name.split('.').pop()
      const fileName = `vignette-${Date.now()}.${ext}`
      const filePath = `ressources/vignettes/${fileName}`

      // Upload
      const { error: uploadErr } = await supabase.storage
        .from('resource-previews')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadErr) throw uploadErr

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('resource-previews')
        .getPublicUrl(filePath)

      updateFormData({ vignette_url: publicUrl })
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError(t.uploadError)
    } finally {
      setIsUploading(false)
    }
  }

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    updateFormData({ vignette_url: '' })
  }

  // Toggle collaboration mode
  const handleCollaboratorToggle = (checked: boolean) => {
    setHasCollaborators(checked)
    if (!checked) {
      // Reset collaboration data when disabled
      updateFormData({
        collaborators: [],
        owner_revenue_share: 100
      })
      setShowAddForm(false)
    }
  }

  // Add collaborator
  const handleAddCollaborator = useCallback(() => {
    if (!newEmail.trim()) return
    if (newShare < 1 || newShare > 99) return

    // Check if email already exists
    if (collaborators.some(c => c.email.toLowerCase() === newEmail.toLowerCase())) {
      return
    }

    const newCollaborator: CollaboratorData = {
      id: `collab-${Date.now()}`,
      email: newEmail.trim(),
      revenue_share: newShare,
      status: 'pending',
      can_edit: newCanEdit,
      can_publish: newCanPublish
    }

    // Calculate new owner share
    const newOwnerShare = Math.max(1, ownerShare - newShare)

    updateFormData({
      collaborators: [...collaborators, newCollaborator],
      owner_revenue_share: newOwnerShare
    })

    // Reset form
    setNewEmail('')
    setNewShare(10)
    setNewCanEdit(true)
    setNewCanPublish(false)
    setShowAddForm(false)
  }, [newEmail, newShare, newCanEdit, newCanPublish, collaborators, ownerShare, updateFormData])

  // Remove collaborator
  const handleRemoveCollaborator = useCallback((id: string) => {
    const collaborator = collaborators.find(c => c.id === id)
    if (!collaborator) return

    const newOwnerShare = Math.min(100, ownerShare + collaborator.revenue_share)

    updateFormData({
      collaborators: collaborators.filter(c => c.id !== id),
      owner_revenue_share: newOwnerShare
    })
  }, [collaborators, ownerShare, updateFormData])

  // Start editing share
  const startEditShare = (id: string, currentShare: number) => {
    setEditingId(id)
    setEditShare(currentShare)
  }

  // Save edited share
  const saveEditShare = useCallback((id: string) => {
    const collaborator = collaborators.find(c => c.id === id)
    if (!collaborator) return
    if (editShare < 1 || editShare > 99) return

    const shareDiff = editShare - collaborator.revenue_share
    const newOwnerShare = Math.max(1, Math.min(99, ownerShare - shareDiff))

    updateFormData({
      collaborators: collaborators.map(c =>
        c.id === id ? { ...c, revenue_share: editShare } : c
      ),
      owner_revenue_share: newOwnerShare
    })

    setEditingId(null)
  }, [collaborators, editShare, ownerShare, updateFormData])

  // Update owner share directly
  const handleOwnerShareChange = useCallback((newOwnerShareValue: number) => {
    if (newOwnerShareValue < 1 || newOwnerShareValue > 99) return
    if (collaborators.length === 0) {
      updateFormData({ owner_revenue_share: 100 })
      return
    }

    const availableForCollaborators = 100 - newOwnerShareValue
    const currentCollabTotal = collaboratorsTotalShare

    if (currentCollabTotal > 0) {
      // Proportionally adjust all collaborators
      const ratio = availableForCollaborators / currentCollabTotal
      const adjustedCollaborators = collaborators.map(c => ({
        ...c,
        revenue_share: Math.max(1, Math.round(c.revenue_share * ratio))
      }))

      updateFormData({
        collaborators: adjustedCollaborators,
        owner_revenue_share: newOwnerShareValue
      })
    } else {
      updateFormData({ owner_revenue_share: newOwnerShareValue })
    }
  }, [collaborators, collaboratorsTotalShare, updateFormData])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-[#5D5A4E] dark:text-white">{t.title}</h2>
        <p className="text-[#5D5A4E]/60 dark:text-white/50 mt-1">{t.subtitle}</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.titleLabel}
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder={t.titlePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 bg-transparent dark:bg-white/5 focus:border-[#A8B5A0] dark:focus:border-[#6EE8A0]/50 focus:ring-2 focus:ring-[#A8B5A0]/20 dark:focus:ring-[#6EE8A0]/20 outline-none transition-all text-lg dark:text-white dark:placeholder:text-white/30"
        />
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mt-2">{t.titleHelp}</p>
      </div>

      {/* Type d'activité */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-[#C8CED6] mb-1">
          {t.categories}
        </label>
        <p className="text-xs text-[#5D5A4E]/50 dark:text-[#C8CED6]/50 mb-3">{t.categoriesHelp}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categoryOptions.map(cat => {
            const selected = formData.categories.includes(cat.value)
            const g = GEMS[cat.gem]
            const rgb = hexToRgb(isDark ? g.dark : g.light)
            const glowRGB = isDark ? g.glowDark : g.glow
            const atMax = formData.categories.length >= 3 && !selected
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                disabled={atMax}
                className="group relative overflow-hidden transition-all duration-300 active:scale-[0.97]"
                style={{
                  borderRadius: 12,
                  padding: 1.5,
                  background: selected
                    ? `linear-gradient(135deg, rgba(${glowRGB},0.7) 0%, rgba(${glowRGB},0.4) 50%, rgba(${glowRGB},0.6) 100%)`
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)',
                  boxShadow: selected
                    ? `0 0 14px rgba(${glowRGB},${isDark ? 0.45 : 0.30}), 0 2px 6px rgba(0,0,0,${isDark ? 0.2 : 0.04})`
                    : `0 1px 4px rgba(0,0,0,${isDark ? 0.15 : 0.03})`,
                  opacity: atMax ? 0.4 : 1,
                  cursor: atMax ? 'not-allowed' : 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 12px',
                    borderRadius: 10.5,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: selected ? (isDark ? g.textDark : g.text) : (isDark ? '#C8CED6' : '#5D5A4E'),
                    background: selected
                      ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.26 : 0.34}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.20 : 0.28}) 100%)`
                      : isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)',
                    backdropFilter: selected ? 'blur(12px) saturate(140%)' : 'none',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                  }}
                >
                  <FilterIcon value={cat.value} size={15} className="flex-shrink-0" />
                  <span className="truncate flex-1 text-left">{cat.label[lang]}</span>
                  {selected && <Check className="w-3 h-3 flex-shrink-0" strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vignette / Cover Image */}
      <div>
        <label className="block text-sm font-medium text-[#5D5A4E] dark:text-white/80 mb-2">
          {t.vignetteLabel}
        </label>

        {formData.vignette_url ? (
          // Image preview
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#A8B5A0]/30 group">
            <img
              src={formData.vignette_url}
              alt="Vignette"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-[#5D5A4E] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {t.vignetteChange}
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Upload zone
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`w-48 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#A8B5A0] dark:border-[#6EE8A0] bg-[#A8B5A0]/10 dark:bg-[#6EE8A0]/10'
                : 'border-[#A8B5A0]/30 dark:border-white/15 hover:border-[#A8B5A0]/60 dark:hover:border-[#6EE8A0]/40 hover:bg-[#F5E6D3]/20 dark:hover:bg-white/5'
            } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isUploading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#A8B5A0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-sm text-[#5D5A4E]/60 dark:text-white/50">{t.uploading}</span>
              </div>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-[#A8B5A0]/60 dark:text-white/30 mb-2" />
                <span className="text-sm text-[#5D5A4E]/60 dark:text-white/40 text-center px-4">
                  {t.vignetteUpload}
                </span>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {uploadError && (
          <p className="text-sm text-red-500 mt-2">{uploadError}</p>
        )}
        <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40 mt-2">{t.vignetteHelp}</p>
      </div>

      {/* Price Slider */}
      <div className="bg-[#F5E6D3]/30 dark:bg-[#FFD040]/[0.06] dark:border dark:border-[#FFD040]/15 rounded-2xl p-6">
        <label className="flex items-center gap-2 text-sm font-medium text-[#5D5A4E] dark:text-[#FFE8A0] mb-4">
          <Coins className="w-4 h-4 dark:text-[#FFD040]" />
          {t.priceLabel}
        </label>

        <div className="flex items-center gap-6">
          <input
            type="range"
            min="0"
            max="20"
            value={formData.price_credits}
            onChange={(e) => updateFormData({ price_credits: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-white dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A8B5A0] dark:accent-[#FFD040]"
          />
          <div className="flex items-center gap-2 min-w-[100px]">
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
                  ? 'bg-[#A8B5A0]/20 text-[#A8B5A0] border-[#A8B5A0]/30 dark:bg-[#FFD040]/15 dark:text-[#FFD040] dark:border-[#FFD040]/30'
                  : 'bg-white text-[#5D5A4E] border-[#A8B5A0]/30 dark:bg-white/10 dark:text-white dark:border-[#FFD040]/30'
              }`}
            />
            <span className="text-sm text-[#5D5A4E]/60 dark:text-[#FFE8A0]/60 font-medium">
              {formData.price_credits === 0 ? t.free : t.credits}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5D5A4E]/50 dark:text-[#FFE8A0]/40 mt-3">{t.priceHelp}</p>

        {/* Accept Free Credits Toggle - only show if price > 0 */}
        {formData.price_credits > 0 && (
          <label className="flex items-start gap-3 mt-6 p-4 bg-white dark:bg-white/5 dark:border dark:border-[#FFD040]/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={formData.accept_free_credits}
              onChange={(e) => updateFormData({ accept_free_credits: e.target.checked })}
              className="mt-0.5 w-5 h-5 rounded border-[#A8B5A0]/40 text-[#A8B5A0] focus:ring-[#A8B5A0]/20 dark:border-[#FFD040]/40 dark:text-[#FFD040]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#A8B5A0] dark:text-[#FFD040]" />
                <span className="font-medium text-[#5D5A4E] dark:text-[#FFE8A0]">{t.acceptFreeCredits}</span>
              </div>
              <p className="text-xs text-[#5D5A4E]/60 dark:text-[#FFE8A0]/50 mt-1">{t.acceptFreeCreditsHelp}</p>
            </div>
          </label>
        )}
      </div>

      {/* Collaboration Checkbox - after price */}
      <div className="bg-[#C8D8E4]/20 dark:bg-[#5AC8FF]/[0.06] dark:border dark:border-[#5AC8FF]/15 rounded-2xl p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasCollaborators}
            onChange={(e) => handleCollaboratorToggle(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-[#7BA3C4]/40 text-[#7BA3C4] focus:ring-[#7BA3C4]/20 dark:border-[#5AC8FF]/40 dark:text-[#5AC8FF]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#7BA3C4] dark:text-[#5AC8FF]" />
              <span className="font-medium text-[#5D5A4E] dark:text-[#B0E4FF]">{t.hasCollaborators}</span>
            </div>
            <p className="text-xs text-[#5D5A4E]/60 dark:text-[#B0E4FF]/50 mt-1">{t.hasCollaboratorsHelp}</p>
          </div>
        </label>

        {/* Collaboration UI - only when checkbox is checked */}
        {hasCollaborators && (
          <div className="mt-6 space-y-4 pt-4 border-t border-[#7BA3C4]/20 dark:border-[#5AC8FF]/15">
            {/* Revenue Share Overview */}
            <div className="space-y-3">
              <h4 className="font-medium text-[#5D5A4E] dark:text-[#B0E4FF] flex items-center gap-2 text-sm">
                <Percent className="w-4 h-4 dark:text-[#5AC8FF]" />
                {t.revenueShare}
              </h4>

              {/* Owner share */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A8B5A0]/20 dark:bg-[#6EE8A0]/15 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[#A8B5A0] dark:text-[#6EE8A0]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#5D5A4E] dark:text-white text-sm">{t.yourShare}</p>
                    <p className="text-xs text-[#5D5A4E]/50 dark:text-white/40">{t.owner}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={ownerShare}
                    onChange={(e) => handleOwnerShareChange(parseInt(e.target.value) || 1)}
                    className="w-14 px-2 py-1 text-right text-lg font-bold text-[#A8B5A0] dark:text-[#6EE8A0] bg-[#A8B5A0]/10 dark:bg-[#6EE8A0]/15 border-0 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] dark:focus:ring-[#6EE8A0] outline-none"
                  />
                  <span className="text-[#5D5A4E]/60 dark:text-white/40 text-sm">%</span>
                </div>
              </div>

              {/* Collaborators shares */}
              {collaborators.map(collab => (
                <div key={collab.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 dark:border dark:border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C8D8E4]/30 dark:bg-[#5AC8FF]/15 flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-[#7BA3C4] dark:text-[#5AC8FF]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#5D5A4E] dark:text-white text-sm">{collab.email}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          collab.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {collab.status === 'accepted' ? t.accepted : t.pending}
                        </span>
                        {collab.can_edit && <span className="text-xs text-[#5D5A4E]/50 dark:text-white/40">{t.canEdit}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === collab.id ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={editShare}
                          onChange={(e) => setEditShare(parseInt(e.target.value) || 1)}
                          className="w-14 px-2 py-1 text-right text-lg font-bold text-[#7BA3C4] dark:text-[#5AC8FF] bg-[#C8D8E4]/30 dark:bg-[#5AC8FF]/15 border-0 rounded-lg focus:ring-2 focus:ring-[#7BA3C4] dark:focus:ring-[#5AC8FF] outline-none"
                          autoFocus
                        />
                        <span className="text-[#5D5A4E]/60 dark:text-white/40 text-sm">%</span>
                        <button
                          onClick={() => saveEditShare(collab.id)}
                          className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg font-bold text-[#7BA3C4] dark:text-[#5AC8FF]">{collab.revenue_share}</span>
                        <span className="text-[#5D5A4E]/60 dark:text-white/40 text-sm">%</span>
                        <button
                          onClick={() => startEditShare(collab.id, collab.revenue_share)}
                          className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveCollaborator(collab.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Total */}
              {collaborators.length > 0 && (
                <div className={`flex items-center justify-between p-3 rounded-xl border-2 ${
                  isValidTotal ? 'border-green-200 bg-green-50 dark:border-green-700/40 dark:bg-green-900/20' : 'border-amber-200 bg-amber-50 dark:border-amber-700/40 dark:bg-amber-900/20'
                }`}>
                  <span className="font-medium text-[#5D5A4E] dark:text-white text-sm">{t.totalShare}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isValidTotal ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {totalShare}%
                    </span>
                    {!isValidTotal && (
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    )}
                  </div>
                </div>
              )}

              {!isValidTotal && collaborators.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {t.totalWarning}
                </p>
              )}
            </div>

            {/* Add Collaborator Button / Form */}
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#7BA3C4] dark:text-[#5AC8FF] hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors w-full justify-center border-2 border-dashed border-[#7BA3C4]/30 dark:border-[#5AC8FF]/25"
              >
                <Plus className="w-4 h-4" />
                {t.addCollaborator}
              </button>
            ) : (
              <div className="p-4 border-2 border-dashed border-[#7BA3C4]/50 dark:border-[#5AC8FF]/30 rounded-xl bg-white dark:bg-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#5D5A4E]/70 dark:text-white/50 mb-1">{t.emailLabel}</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent dark:bg-white/5 rounded-lg focus:border-[#7BA3C4] dark:focus:border-[#5AC8FF]/50 outline-none dark:text-white dark:placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#5D5A4E]/70 dark:text-white/50 mb-1">{t.shareLabel}</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={newShare}
                      onChange={(e) => setNewShare(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent dark:bg-white/5 rounded-lg focus:border-[#7BA3C4] dark:focus:border-[#5AC8FF]/50 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#5D5A4E]/70 dark:text-white/50 mb-2">{t.permissionsLabel}</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCanEdit}
                        onChange={(e) => setNewCanEdit(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-[#7BA3C4] dark:text-[#5AC8FF] focus:ring-[#7BA3C4]"
                      />
                      <span className="text-sm text-[#5D5A4E] dark:text-white/80">{t.canEdit}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCanPublish}
                        onChange={(e) => setNewCanPublish(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-[#7BA3C4] dark:text-[#5AC8FF] focus:ring-[#7BA3C4]"
                      />
                      <span className="text-sm text-[#5D5A4E] dark:text-white/80">{t.canPublish}</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleAddCollaborator}
                    disabled={!newEmail.trim() || newShare < 1 || newShare > 99}
                    className="px-3 py-1.5 text-sm bg-[#7BA3C4] dark:bg-[#5AC8FF]/20 text-white dark:text-[#5AC8FF] dark:border dark:border-[#5AC8FF]/30 rounded-lg hover:bg-[#6992b3] dark:hover:bg-[#5AC8FF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.addCollaborator}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
