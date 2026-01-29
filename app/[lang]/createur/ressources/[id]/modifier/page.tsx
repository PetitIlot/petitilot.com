'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import ResourceWizard, { type ResourceFormData } from '@/components/creator/ResourceWizard'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Modifier la ressource',
    back: 'Retour aux ressources',
    loading: 'Chargement...',
    notFound: 'Ressource non trouvée',
    notCreator: 'Accès non autorisé',
    delete: 'Supprimer cette ressource',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.',
    status: 'Statut',
    draft: 'Brouillon',
    pending: 'En attente',
    published: 'Publié',
    rejected: 'Refusé'
  },
  en: {
    title: 'Edit resource',
    back: 'Back to resources',
    loading: 'Loading...',
    notFound: 'Resource not found',
    notCreator: 'Unauthorized access',
    delete: 'Delete this resource',
    confirmDelete: 'Are you sure you want to delete this resource? This action cannot be undone.',
    status: 'Status',
    draft: 'Draft',
    pending: 'Pending',
    published: 'Published',
    rejected: 'Rejected'
  },
  es: {
    title: 'Editar recurso',
    back: 'Volver a recursos',
    loading: 'Cargando...',
    notFound: 'Recurso no encontrado',
    notCreator: 'Acceso no autorizado',
    delete: 'Eliminar este recurso',
    confirmDelete: '¿Estás seguro de que quieres eliminar este recurso? Esta acción no se puede deshacer.',
    status: 'Estado',
    draft: 'Borrador',
    pending: 'Pendiente',
    published: 'Publicado',
    rejected: 'Rechazado'
  }
}

export default function EditResourcePage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const resourceId = params.id as string
  const t = translations[lang]

  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<Partial<ResourceFormData> | null>(null)
  const [resourceStatus, setResourceStatus] = useState<string>('draft')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResource = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      // Vérifier que l'utilisateur est créateur
      const { data: creator } = await supabase
        .from('creators')
        .select('id, is_approved')
        .eq('user_id', user.id)
        .single()

      if (!creator || !creator.is_approved) {
        setError(t.notCreator)
        setLoading(false)
        return
      }

      // Récupérer la ressource
      const { data: resource } = await supabase
        .from('ressources')
        .select('*')
        .eq('id', resourceId)
        .eq('creator_id', creator.id)
        .single()

      if (!resource) {
        setError(t.notFound)
        setLoading(false)
        return
      }

      // Mapper les données DB vers ResourceFormData
      setInitialData({
        title: resource.title || '',
        subtitle: resource.subtitle || '',
        description: resource.description || '',
        price_credits: resource.price_credits || 0,
        astuces: resource.astuces || '',
        age_min: resource.age_min,
        age_max: resource.age_max,
        duration: resource.duration,
        duration_prep: resource.duration_prep,
        intensity: resource.intensity,
        difficulte: resource.difficulte,
        autonomie: resource.autonomie || false,
        categories: resource.categories || [],
        themes: resource.themes || [],
        competences: resource.competences || [],
        keywords: resource.keywords || [],
        customThemes: [],
        customCompetences: [],
        materials: resource.materials || [],
        materiel_json: resource.materiel_json || [],
        vignette_url: resource.vignette_url || '',
        images_urls: resource.images_urls || [],
        gallery_urls: resource.gallery_urls || [],
        video_url: resource.video_url || '',
        pdf_url: resource.pdf_url || '',
        meta_seo: resource.meta_seo?.description || ''
      })

      setResourceStatus(resource.status || 'draft')
      setCreatorId(creator.id)
      setLoading(false)
    }

    fetchResource()
  }, [resourceId, lang, router, t])

  const handleDelete = async () => {
    if (!confirm(t.confirmDelete)) return

    const supabase = createClient()
    await supabase
      .from('ressources')
      .delete()
      .eq('id', resourceId)

    router.push(`/${lang}/createur/ressources`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4" />
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">{error}</p>
          <Link href={`/${lang}/createur/ressources`} className="text-sage hover:underline">
            {t.back}
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    pending_review: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  }

  const statusLabels: Record<string, string> = {
    draft: t.draft,
    pending_review: t.pending,
    published: t.published,
    rejected: t.rejected
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/${lang}/createur/ressources`}
              className="inline-flex items-center text-sm text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Link>
            <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[resourceStatus]}`}>
            {statusLabels[resourceStatus]}
          </span>
        </div>

        {/* Wizard en mode édition */}
        {creatorId && initialData && (
          <ResourceWizard
            lang={lang}
            creatorId={creatorId}
            initialData={initialData}
            resourceId={resourceId}
          />
        )}

        {/* Zone de danger - Suppression */}
        {resourceStatus === 'draft' && (
          <div className="mt-12 p-6 border border-red-200 dark:border-red-700 rounded-2xl bg-red-50/50 dark:bg-red-900/20">
            <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">Zone de danger</h3>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
              La suppression est définitive et ne peut pas être annulée.
            </p>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.delete}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
