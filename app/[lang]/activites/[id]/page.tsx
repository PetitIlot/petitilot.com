'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Language } from '@/lib/types'
import { getRessourceWithCreator, RessourceWithCreator } from '@/lib/supabase-queries'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BlockCanvas } from '@/components/blocks'
import { ContentBlocksData } from '@/lib/blocks'

const translations = {
  fr: { backToActivities: 'Retour aux activités', noContent: 'Contenu non disponible' },
  en: { backToActivities: 'Back to activities', noContent: 'Content not available' },
  es: { backToActivities: 'Volver a actividades', noContent: 'Contenido no disponible' }
}

export default function ActivityDetailPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')
  const [id, setId] = useState<string>('')
  const [activity, setActivity] = useState<RessourceWithCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l, id: i }) => {
      setLang(l as Language)
      setId(i)
    })
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    if (!id) return
    const fetchActivity = async () => {
      setIsLoading(true)
      const data = await getRessourceWithCreator(id)
      setActivity(data)
      setIsLoading(false)

      if (data) {
        const supabase = createClient()
        await supabase.rpc('increment_views', { resource_id: id })
      }
    }
    fetchActivity()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">Activité non trouvée</p>
          <Link href={`/${lang}/activites`}>
            <Button variant="outline" gem="neutral" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.backToActivities}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const blocksData = activity.content_blocks as ContentBlocksData | null

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark pt-16">
      <Link href={`/${lang}/activites`} className="fixed top-20 left-4 z-10">
        <Button variant="outline" gem="neutral" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t.backToActivities}
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        {blocksData?.layout?.desktop?.length ? (
          <BlockCanvas
            blocksData={blocksData}
            activity={activity}
            lang={lang}
            isEditing={false}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary">
              {t.noContent}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
