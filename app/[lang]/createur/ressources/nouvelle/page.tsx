'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import ResourceWizard from '@/components/creator/ResourceWizard'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Créer une ressource',
    back: 'Retour aux ressources',
    loading: 'Chargement...',
    notCreator: 'Vous devez être créateur pour accéder à cette page',
    notApproved: 'Votre compte créateur n\'est pas encore approuvé'
  },
  en: {
    title: 'Create a resource',
    back: 'Back to resources',
    loading: 'Loading...',
    notCreator: 'You must be a creator to access this page',
    notApproved: 'Your creator account is not yet approved'
  },
  es: {
    title: 'Crear un recurso',
    back: 'Volver a recursos',
    loading: 'Cargando...',
    notCreator: 'Debes ser creador para acceder a esta página',
    notApproved: 'Tu cuenta de creador aún no está aprobada'
  }
}

export default function NewResourcePage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkCreator = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      // Check if user is an approved creator
      const { data: creator } = await supabase
        .from('creators')
        .select('id, user_id, is_approved')
        .eq('user_id', user.id)
        .single()

      if (!creator) {
        setError(t.notCreator)
        setLoading(false)
        return
      }

      if (!creator.is_approved) {
        setError(t.notApproved)
        setLoading(false)
        return
      }

      // creator_id = creators.id (FK vers table creators)
      setCreatorId(creator.id)
      setLoading(false)
    }

    checkCreator()
  }, [lang, router, t])

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
        <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 p-8 text-center max-w-md" style={{ border: '1px solid var(--border)' }}>
          <p className="text-foreground dark:text-foreground-dark mb-4">{error}</p>
          <Link
            href={`/${lang}/createur`}
            className="text-sage hover:underline"
          >
            {t.back}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${lang}/createur/ressources`}>
            <Button variant="outline" gem="neutral" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          </Link>
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mt-4">{t.title}</h1>
        </div>

        {/* Wizard */}
        {creatorId && (
          <ResourceWizard lang={lang} creatorId={creatorId} />
        )}
      </div>
    </div>
  )
}
