'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Eye, CheckCircle, XCircle, ExternalLink, User, Calendar, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language, Ressource } from '@/lib/types'

const translations = {
  fr: {
    title: 'Ressources à valider',
    subtitle: 'Examinez et approuvez les nouvelles ressources',
    noResources: 'Aucune ressource en attente',
    allClear: 'Toutes les ressources ont été examinées',
    approve: 'Approuver',
    reject: 'Refuser',
    viewResource: 'Voir',
    creator: 'Créateur',
    submitted: 'Soumis le',
    categories: 'Catégories',
    price: 'Prix',
    credits: 'crédits',
    rejectReason: 'Raison du refus',
    rejectPlaceholder: 'Expliquez pourquoi cette ressource est refusée...',
    cancel: 'Annuler',
    confirmReject: 'Confirmer le refus',
    approved: 'Ressource approuvée !',
    rejected: 'Ressource refusée'
  },
  en: {
    title: 'Resources to review',
    subtitle: 'Review and approve new resources',
    noResources: 'No pending resources',
    allClear: 'All resources have been reviewed',
    approve: 'Approve',
    reject: 'Reject',
    viewResource: 'View',
    creator: 'Creator',
    submitted: 'Submitted on',
    categories: 'Categories',
    price: 'Price',
    credits: 'credits',
    rejectReason: 'Rejection reason',
    rejectPlaceholder: 'Explain why this resource is rejected...',
    cancel: 'Cancel',
    confirmReject: 'Confirm rejection',
    approved: 'Resource approved!',
    rejected: 'Resource rejected'
  },
  es: {
    title: 'Recursos para validar',
    subtitle: 'Revisa y aprueba nuevos recursos',
    noResources: 'No hay recursos pendientes',
    allClear: 'Todos los recursos han sido revisados',
    approve: 'Aprobar',
    reject: 'Rechazar',
    viewResource: 'Ver',
    creator: 'Creador',
    submitted: 'Enviado el',
    categories: 'Categorías',
    price: 'Precio',
    credits: 'créditos',
    rejectReason: 'Razón del rechazo',
    rejectPlaceholder: 'Explica por qué este recurso es rechazado...',
    cancel: 'Cancelar',
    confirmReject: 'Confirmar rechazo',
    approved: '¡Recurso aprobado!',
    rejected: 'Recurso rechazado'
  }
}

const categoryLabels: Record<string, Record<Language, string>> = {
  'sensory': { fr: 'Sensoriel', en: 'Sensory', es: 'Sensorial' },
  'fine-motor': { fr: 'Motricité fine', en: 'Fine motor', es: 'Motricidad fina' },
  'gross-motor': { fr: 'Motricité globale', en: 'Gross motor', es: 'Motricidad gruesa' },
  'nature-outdoor': { fr: 'Nature & plein air', en: 'Nature & outdoor', es: 'Naturaleza' },
  'creativity-arts': { fr: 'Créativité & arts', en: 'Creativity & arts', es: 'Creatividad' },
  'diy-recycling': { fr: 'DIY & récup', en: 'DIY & recycling', es: 'DIY & reciclaje' },
  'cooking': { fr: 'Cuisine', en: 'Cooking', es: 'Cocina' },
  'imaginative-play': { fr: 'Jeux symboliques', en: 'Imaginative play', es: 'Juego simbólico' },
  'routines': { fr: 'Rituels & routines', en: 'Routines', es: 'Rutinas' },
  'printables': { fr: 'Imprimables', en: 'Printables', es: 'Imprimibles' }
}

interface RessourceWithCreator extends Ressource {
  status?: string
  price_credits?: number
  rejection_reason?: string
  resource_file_url?: string
  creators?: {
    display_name: string
    slug: string
  }
}

export default function AdminResourcesPage() {
  const params = useParams()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [resources, setResources] = useState<RessourceWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ resourceId: string; open: boolean }>({ resourceId: '', open: false })
  const [rejectReason, setRejectReason] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchResources = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('ressources')
      .select(`
        *,
        creators:creator_id (
          display_name,
          slug
        )
      `)
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })

    if (data) setResources(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleApprove = async (resourceId: string) => {
    setProcessingId(resourceId)
    const supabase = createClient()

    const { error } = await supabase
      .from('ressources')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', resourceId)

    if (error) {
      showToast('Erreur lors de l\'approbation', 'error')
    } else {
      showToast(t.approved, 'success')
      setResources(prev => prev.filter(r => r.id !== resourceId))
    }
    setProcessingId(null)
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return

    setProcessingId(rejectModal.resourceId)
    const supabase = createClient()

    const { error } = await supabase
      .from('ressources')
      .update({
        status: 'rejected',
        rejection_reason: rejectReason
      })
      .eq('id', rejectModal.resourceId)

    if (error) {
      showToast('Erreur lors du refus', 'error')
    } else {
      showToast(t.rejected, 'success')
      setResources(prev => prev.filter(r => r.id !== rejectModal.resourceId))
    }

    setProcessingId(null)
    setRejectModal({ resourceId: '', open: false })
    setRejectReason('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 ${
            toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
        </div>

        {/* Resources List */}
        {resources.length === 0 ? (
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-12 text-center" style={{ border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 bg-sage/20 dark:bg-sage/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--icon-sage)' }} />
            </div>
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">{t.noResources}</h2>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.allClear}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {resources.map(resource => (
              <div key={resource.id} className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Preview Image */}
                    <div className="w-32 h-32 rounded-xl bg-surface-secondary dark:bg-surface-dark overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--border)' }}>
                      {resource.vignette_url ? (
                        <img
                          src={resource.vignette_url}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="w-8 h-8" style={{ color: 'var(--icon-neutral)', opacity: 0.3 }} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary line-clamp-2 mb-4">
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-foreground-secondary dark:text-foreground-dark-secondary">
                          <User className="w-4 h-4" />
                          {resource.creators?.display_name || 'Créateur'}
                        </span>
                        <span className="flex items-center gap-1 text-foreground-secondary dark:text-foreground-dark-secondary">
                          <Calendar className="w-4 h-4" />
                          {resource.created_at ? new Date(resource.created_at).toLocaleDateString(lang) : '-'}
                        </span>
                        <span className="flex items-center gap-1 text-foreground-secondary dark:text-foreground-dark-secondary">
                          <Tag className="w-4 h-4" />
                          {resource.price_credits} {t.credits}
                        </span>
                      </div>

                      {/* Categories */}
                      {resource.categories && resource.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {resource.categories.map(cat => (
                            <span
                              key={cat}
                              className="px-2 py-1 bg-sage/20 dark:bg-sage/30 text-foreground dark:text-foreground-dark rounded-full text-xs"
                            >
                              {categoryLabels[cat]?.[lang] || cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-surface-secondary dark:bg-surface-dark flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                  <a
                    href={resource.resource_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sage hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t.viewResource}
                  </a>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setRejectModal({ resourceId: resource.id, open: true })}
                      disabled={processingId === resource.id}
                      className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      {t.reject}
                    </Button>
                    <Button
                      onClick={() => handleApprove(resource.id)}
                      disabled={processingId === resource.id}
                      className="bg-sage hover:bg-sage-light text-white"
                    >
                      {processingId === resource.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {t.approve}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface dark:bg-surface-dark rounded-2xl max-w-md w-full p-6" style={{ border: '1px solid var(--border)' }}>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4">{t.rejectReason}</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t.rejectPlaceholder}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark focus:ring-2 focus:ring-sage/30 outline-none resize-none"
                style={{ border: '1px solid var(--border)' }}
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectModal({ resourceId: '', open: false })
                    setRejectReason('')
                  }}
                  className="text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || processingId === rejectModal.resourceId}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {t.confirmReject}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
