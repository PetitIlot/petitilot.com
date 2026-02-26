'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Package, Eye, ShoppingCart, Clock, CheckCircle, XCircle, FileEdit, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language, Ressource } from '@/lib/types'

const translations = {
  fr: {
    title: 'Mes ressources',
    subtitle: 'Gérez vos créations',
    back: 'Retour au tableau de bord',
    newResource: 'Nouvelle ressource',
    noResources: 'Vous n\'avez pas encore de ressources',
    createFirst: 'Créez votre première ressource pour commencer à vendre',
    status: {
      draft: 'Brouillon',
      pending_review: 'En attente',
      published: 'Publié',
      rejected: 'Refusé',
      offline: 'Hors ligne'
    },
    views: 'vues',
    sales: 'ventes',
    edit: 'Modifier',
    successMessage: 'Ressource créée avec succès !',
    credits: 'crédits'
  },
  en: {
    title: 'My resources',
    subtitle: 'Manage your creations',
    back: 'Back to dashboard',
    newResource: 'New resource',
    noResources: 'You don\'t have any resources yet',
    createFirst: 'Create your first resource to start selling',
    status: {
      draft: 'Draft',
      pending_review: 'Pending',
      published: 'Published',
      rejected: 'Rejected',
      offline: 'Offline'
    },
    views: 'views',
    sales: 'sales',
    edit: 'Edit',
    successMessage: 'Resource created successfully!',
    credits: 'credits'
  },
  es: {
    title: 'Mis recursos',
    subtitle: 'Gestiona tus creaciones',
    back: 'Volver al panel',
    newResource: 'Nuevo recurso',
    noResources: 'Aún no tienes recursos',
    createFirst: 'Crea tu primer recurso para empezar a vender',
    status: {
      draft: 'Borrador',
      pending_review: 'Pendiente',
      published: 'Publicado',
      rejected: 'Rechazado',
      offline: 'Fuera de línea'
    },
    views: 'vistas',
    sales: 'ventas',
    edit: 'Editar',
    successMessage: '¡Recurso creado con éxito!',
    credits: 'créditos'
  }
}

const statusConfig = {
  draft: { icon: FileEdit, color: 'bg-foreground/10 dark:bg-foreground-dark/10 text-foreground-secondary dark:text-foreground-dark-secondary' },
  pending_review: { icon: Clock, color: 'bg-terracotta/20 text-terracotta' },
  published: { icon: CheckCircle, color: 'bg-sage/20 text-sage' },
  rejected: { icon: XCircle, color: 'bg-red-500/20 text-red-600 dark:text-red-400' },
  offline: { icon: Package, color: 'bg-foreground/10 dark:bg-foreground-dark/10 text-foreground-secondary dark:text-foreground-dark-secondary' }
}

function CreatorResourcesContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [resources, setResources] = useState<(Ressource & { status?: string; price_credits?: number; views_count?: number; purchases_count?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchResources = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Vérifier que l'utilisateur est créateur
        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (creator) {
          // creator_id = creators.id (FK vers table creators)
          const { data } = await supabase
            .from('ressources')
            .select('*')
            .eq('creator_id', creator.id)
            .order('created_at', { ascending: false })

          if (data) setResources(data)
        }
      }
      setLoading(false)
    }

    fetchResources()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
            <CheckCircle className="w-5 h-5" />
            {t.successMessage}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link href={`/${lang}/createur`}>
            <Button variant="outline" gem="neutral" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
            </div>
            <Link href={`/${lang}/createur/ressources/nouvelle`}>
              <Button gem="sage">
                <Plus className="w-4 h-4 mr-2" />
                {t.newResource}
              </Button>
            </Link>
          </div>
        </div>

        {/* Resources List */}
        {resources.length === 0 ? (
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 p-12 text-center" style={{ border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 bg-surface-secondary dark:bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-foreground/40 dark:text-foreground-dark/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">{t.noResources}</h2>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">{t.createFirst}</p>
            <Link href={`/${lang}/createur/ressources/nouvelle`}>
              <Button gem="sage">
                <Plus className="w-4 h-4 mr-2" />
                {t.newResource}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map(resource => {
              const status = resource.status as keyof typeof statusConfig
              const StatusIcon = statusConfig[status]?.icon || Package
              const statusColor = statusConfig[status]?.color || 'bg-foreground/10 dark:bg-foreground-dark/10 text-foreground-secondary dark:text-foreground-dark-secondary'

              return (
                <div
                  key={resource.id}
                  className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-4 flex items-center gap-4"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {/* Preview Image */}
                  <div className="w-20 h-20 rounded-xl bg-surface-secondary dark:bg-surface-dark overflow-hidden flex-shrink-0">
                    {resource.vignette_url ? (
                      <img
                        src={resource.vignette_url}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-foreground/20 dark:text-foreground-dark/20" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground dark:text-foreground-dark truncate">
                        {resource.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusColor}`}>
                        <StatusIcon className="w-3 h-3" />
                        {t.status[status]}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mb-2">
                      {resource.price_credits} {t.credits}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {resource.views_count || 0} {t.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {resource.purchases_count || 0} {t.sales}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <Link href={`/${lang}/createur/ressources/${resource.id}/modifier`}>
                    <Button gem="terracotta" size="sm">
                      <FileEdit className="w-4 h-4 mr-1" />
                      {t.edit}
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreatorResourcesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage" />
      </div>
    }>
      <CreatorResourcesContent />
    </Suspense>
  )
}
