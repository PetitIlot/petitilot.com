'use client'

import { useState, useCallback } from 'react'
import {
  Users, Plus, Trash2, Search, UserPlus, Percent,
  Crown, Edit2, Check, X, Info, AlertTriangle
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ResourceFormData, CollaboratorData } from '../ResourceWizard'

const translations = {
  fr: {
    title: 'Collaboration',
    subtitle: 'Ajoutez des co-créateurs et partagez les revenus',
    addCollaborator: 'Ajouter un collaborateur',
    searchPlaceholder: 'Rechercher par email ou nom...',
    noResults: 'Aucun résultat trouvé',
    collaborators: 'Collaborateurs',
    revenueShare: 'Partage des revenus',
    yourShare: 'Votre part',
    totalShare: 'Total',
    owner: 'Propriétaire',
    collaborator: 'Collaborateur',
    remove: 'Retirer',
    editShare: 'Modifier le partage',
    save: 'Enregistrer',
    cancel: 'Annuler',
    minShare: 'Part minimum: 1%',
    maxShare: 'Part maximum: 99%',
    totalWarning: 'Le total doit être égal à 100%',
    noCollaborators: 'Aucun collaborateur ajouté',
    noCollaboratorsHint: 'Vous pouvez créer cette ressource seul ou inviter des collaborateurs',
    emailLabel: 'Email du collaborateur',
    emailPlaceholder: 'collaborateur@email.com',
    shareLabel: 'Part des revenus (%)',
    permissionsLabel: 'Permissions',
    canEdit: 'Peut éditer',
    canPublish: 'Peut publier',
    inviteSent: 'Invitation envoyée',
    pending: 'En attente',
    accepted: 'Accepté',
    tip: 'Les revenus sont partagés automatiquement lors de chaque vente. Chaque collaborateur reçoit sa part directement sur son compte.'
  },
  en: {
    title: 'Collaboration',
    subtitle: 'Add co-creators and share revenue',
    addCollaborator: 'Add collaborator',
    searchPlaceholder: 'Search by email or name...',
    noResults: 'No results found',
    collaborators: 'Collaborators',
    revenueShare: 'Revenue share',
    yourShare: 'Your share',
    totalShare: 'Total',
    owner: 'Owner',
    collaborator: 'Collaborator',
    remove: 'Remove',
    editShare: 'Edit share',
    save: 'Save',
    cancel: 'Cancel',
    minShare: 'Minimum share: 1%',
    maxShare: 'Maximum share: 99%',
    totalWarning: 'Total must equal 100%',
    noCollaborators: 'No collaborators added',
    noCollaboratorsHint: 'You can create this resource alone or invite collaborators',
    emailLabel: 'Collaborator email',
    emailPlaceholder: 'collaborator@email.com',
    shareLabel: 'Revenue share (%)',
    permissionsLabel: 'Permissions',
    canEdit: 'Can edit',
    canPublish: 'Can publish',
    inviteSent: 'Invitation sent',
    pending: 'Pending',
    accepted: 'Accepted',
    tip: 'Revenue is automatically shared on each sale. Each collaborator receives their share directly to their account.'
  },
  es: {
    title: 'Colaboración',
    subtitle: 'Agrega co-creadores y comparte ingresos',
    addCollaborator: 'Agregar colaborador',
    searchPlaceholder: 'Buscar por email o nombre...',
    noResults: 'No se encontraron resultados',
    collaborators: 'Colaboradores',
    revenueShare: 'Reparto de ingresos',
    yourShare: 'Tu parte',
    totalShare: 'Total',
    owner: 'Propietario',
    collaborator: 'Colaborador',
    remove: 'Eliminar',
    editShare: 'Editar reparto',
    save: 'Guardar',
    cancel: 'Cancelar',
    minShare: 'Parte mínima: 1%',
    maxShare: 'Parte máxima: 99%',
    totalWarning: 'El total debe ser igual a 100%',
    noCollaborators: 'Sin colaboradores agregados',
    noCollaboratorsHint: 'Puedes crear este recurso solo o invitar colaboradores',
    emailLabel: 'Email del colaborador',
    emailPlaceholder: 'colaborador@email.com',
    shareLabel: 'Parte de ingresos (%)',
    permissionsLabel: 'Permisos',
    canEdit: 'Puede editar',
    canPublish: 'Puede publicar',
    inviteSent: 'Invitación enviada',
    pending: 'Pendiente',
    accepted: 'Aceptado',
    tip: 'Los ingresos se comparten automáticamente en cada venta. Cada colaborador recibe su parte directamente en su cuenta.'
  }
}

interface StepCollaborationProps {
  formData: ResourceFormData
  updateFormData: (updates: Partial<ResourceFormData>) => void
  lang: Language
  creatorId: string
}

export default function StepCollaboration({
  formData,
  updateFormData,
  lang,
  creatorId
}: StepCollaborationProps) {
  const t = translations[lang]

  // Local state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newShare, setNewShare] = useState(10)
  const [newCanEdit, setNewCanEdit] = useState(true)
  const [newCanPublish, setNewCanPublish] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editShare, setEditShare] = useState(0)

  // Get collaborators from form data
  const collaborators = formData.collaborators || []
  const ownerShare = formData.owner_revenue_share ?? 100

  // Calculate total share
  const collaboratorsTotalShare = collaborators.reduce((sum, c) => sum + c.revenue_share, 0)
  const totalShare = ownerShare + collaboratorsTotalShare
  const isValidTotal = totalShare === 100

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#5D5A4E] flex items-center gap-2">
          <Users className="w-6 h-6 text-[#A8B5A0]" />
          {t.title}
        </h2>
        <p className="text-[#5D5A4E]/70 mt-1">{t.subtitle}</p>
      </div>

      {/* Revenue Share Overview */}
      <div className="p-4 bg-gradient-to-r from-[#A8B5A0]/10 to-[#C8D8E4]/20 rounded-2xl">
        <h3 className="font-medium text-[#5D5A4E] mb-3 flex items-center gap-2">
          <Percent className="w-4 h-4" />
          {t.revenueShare}
        </h3>

        <div className="space-y-3">
          {/* Owner share */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A8B5A0]/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#A8B5A0]" />
              </div>
              <div>
                <p className="font-medium text-[#5D5A4E]">{t.yourShare}</p>
                <p className="text-xs text-[#5D5A4E]/50">{t.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="99"
                value={ownerShare}
                onChange={(e) => handleOwnerShareChange(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-right text-lg font-bold text-[#A8B5A0] bg-[#A8B5A0]/10 border-0 rounded-lg focus:ring-2 focus:ring-[#A8B5A0] outline-none"
              />
              <span className="text-[#5D5A4E]/60">%</span>
            </div>
          </div>

          {/* Collaborators shares */}
          {collaborators.map(collab => (
            <div key={collab.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8D8E4]/30 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#7BA3C4]" />
                </div>
                <div>
                  <p className="font-medium text-[#5D5A4E]">{collab.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      collab.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {collab.status === 'accepted' ? t.accepted : t.pending}
                    </span>
                    {collab.can_edit && <span className="text-xs text-[#5D5A4E]/50">{t.canEdit}</span>}
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
                      className="w-16 px-2 py-1 text-right text-lg font-bold text-[#7BA3C4] bg-[#C8D8E4]/30 border-0 rounded-lg focus:ring-2 focus:ring-[#7BA3C4] outline-none"
                      autoFocus
                    />
                    <span className="text-[#5D5A4E]/60">%</span>
                    <button
                      onClick={() => saveEditShare(collab.id)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-[#7BA3C4]">{collab.revenue_share}</span>
                    <span className="text-[#5D5A4E]/60">%</span>
                    <button
                      onClick={() => startEditShare(collab.id, collab.revenue_share)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveCollaborator(collab.id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Total */}
          <div className={`flex items-center justify-between p-3 rounded-xl border-2 ${
            isValidTotal ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
          }`}>
            <span className="font-medium text-[#5D5A4E]">{t.totalShare}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${isValidTotal ? 'text-green-600' : 'text-amber-600'}`}>
                {totalShare}%
              </span>
              {!isValidTotal && (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>

          {!isValidTotal && (
            <p className="text-sm text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {t.totalWarning}
            </p>
          )}
        </div>
      </div>

      {/* Collaborators List / Add Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#5D5A4E]">{t.collaborators}</h3>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#A8B5A0] hover:bg-[#A8B5A0]/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.addCollaborator}
            </button>
          )}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 border-2 border-dashed border-[#A8B5A0]/50 rounded-2xl bg-[#A8B5A0]/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#5D5A4E]/70 mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#5D5A4E]/70 mb-1">{t.shareLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newShare}
                  onChange={(e) => setNewShare(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5A0] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#5D5A4E]/70 mb-2">{t.permissionsLabel}</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCanEdit}
                    onChange={(e) => setNewCanEdit(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#A8B5A0] focus:ring-[#A8B5A0]"
                  />
                  <span className="text-sm text-[#5D5A4E]">{t.canEdit}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCanPublish}
                    onChange={(e) => setNewCanPublish(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#A8B5A0] focus:ring-[#A8B5A0]"
                  />
                  <span className="text-sm text-[#5D5A4E]">{t.canPublish}</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddCollaborator}
                disabled={!newEmail.trim() || newShare < 1 || newShare > 99}
                className="px-4 py-2 text-sm bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.addCollaborator}
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {collaborators.length === 0 && !showAddForm && (
          <div className="p-8 text-center bg-gray-50 rounded-2xl">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-[#5D5A4E] font-medium">{t.noCollaborators}</p>
            <p className="text-sm text-[#5D5A4E]/60 mt-1">{t.noCollaboratorsHint}</p>
          </div>
        )}
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-3 p-4 bg-sky-50 rounded-xl">
        <Info className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800">{t.tip}</p>
      </div>
    </div>
  )
}
