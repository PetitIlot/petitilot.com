'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Instagram, Youtube, Globe, Package, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { Language, Creator, Ressource } from '@/lib/types'
import FollowButton from '@/components/FollowButton'

// Icône TikTok
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

const translations = {
  fr: {
    back: 'Retour',
    resources: 'ressources',
    followers: 'abonnés',
    philosophy: 'Ma philosophie',
    myResources: 'Mes ressources',
    noResources: 'Aucune ressource pour le moment',
    notFound: 'Créateur non trouvé'
  },
  en: {
    back: 'Back',
    resources: 'resources',
    followers: 'followers',
    philosophy: 'My philosophy',
    myResources: 'My resources',
    noResources: 'No resources yet',
    notFound: 'Creator not found'
  },
  es: {
    back: 'Volver',
    resources: 'recursos',
    followers: 'seguidores',
    philosophy: 'Mi filosofía',
    myResources: 'Mis recursos',
    noResources: 'No hay recursos todavía',
    notFound: 'Creador no encontrado'
  }
}

export default function CreatorPublicPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [slug, setSlug] = useState('')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Ressource[]>([])
  const [stats, setStats] = useState({ resources: 0, followers: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l, slug: s }) => {
      setLang(l as Language)
      setSlug(s)
    })
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    if (!slug) return

    const fetchCreator = async () => {
      const supabase = createClient()

      // Récupérer le créateur par slug
      const { data: creatorData, error } = await supabase
        .from('creators')
        .select('*')
        .eq('slug', slug)
        .eq('is_approved', true)
        .single()

      if (error || !creatorData) {
        setIsLoading(false)
        return
      }

      setCreator(creatorData as Creator)

      // Récupérer les ressources du créateur
      const { data: resourcesData } = await supabase
        .from('ressources')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('lang', lang)
        .order('created_at', { ascending: false })

      setResources((resourcesData || []) as Ressource[])

      // Count ressources
      const { count: resourcesCount } = await supabase
        .from('ressources')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorData.id)

      // Count followers
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorData.id)

      setStats({
        resources: resourcesCount || 0,
        followers: followersCount || 0
      })

      setIsLoading(false)
    }

    fetchCreator()
  }, [slug, lang])

  const socialLinks = creator ? [
    { handle: creator.instagram_handle, icon: Instagram, url: (h: string) => `https://instagram.com/${h.replace('@', '')}`, label: 'Instagram' },
    { handle: creator.youtube_handle, icon: Youtube, url: (h: string) => `https://youtube.com/@${h.replace('@', '')}`, label: 'YouTube' },
    { handle: creator.tiktok_handle, icon: TikTokIcon, url: (h: string) => `https://tiktok.com/@${h.replace('@', '')}`, label: 'TikTok' },
    { handle: creator.website_url, icon: Globe, url: (h: string) => h.startsWith('http') ? h : `https://${h}`, label: 'Site web' },
  ].filter(link => link.handle) : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">{t.notFound}</p>
          <Button variant="outline" onClick={() => router.back()} style={{ border: '1px solid var(--border)' }}>
            {t.back}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden mb-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="p-6 md:p-8">
            <div className="flex gap-8">
              {/* Avatar - colonne gauche */}
              <div className="flex items-center justify-center w-40 flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-secondary dark:bg-surface-dark ring-4 ring-sage/30">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={creator.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/40 dark:text-foreground-dark/40 text-5xl font-bold">
                      {creator.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info - colonne droite */}
              <div className="flex-1 text-center">
                <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
                  {creator.display_name}
                </h1>

                {creator.bio && (
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{creator.bio}</p>
                )}

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-foreground dark:text-foreground-dark">
                    <Package className="w-5 h-5" style={{ color: 'var(--icon-sage)' }} />
                    <span className="font-semibold">{stats.resources}</span>
                    <span className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.resources}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground dark:text-foreground-dark">
                    <Users className="w-5 h-5" style={{ color: 'var(--icon-terracotta)' }} />
                    <span className="font-semibold">{stats.followers}</span>
                    <span className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.followers}</span>
                  </div>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {socialLinks.map((link, idx) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={idx}
                          href={link.url(link.handle!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-sage hover:text-white transition-colors text-sm"
                          style={{ border: '1px solid var(--border)' }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{link.handle}</span>
                        </a>
                      )
                    })}
                  </div>
                )}

                {/* Follow Button */}
                <FollowButton creatorId={creator.id!} lang={lang} />
              </div>
            </div>

            {/* Philosophy */}
            {creator.philosophy && (
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark mb-3">
                  {t.philosophy}
                </h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary whitespace-pre-line">{creator.philosophy}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="p-6 md:p-8">
            <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark mb-6">
              {t.myResources}
            </h2>

            {resources.length === 0 ? (
              <p className="text-center text-foreground-secondary dark:text-foreground-dark-secondary py-8">{t.noResources}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/${lang}/activites/${resource.id}`}
                    className="block"
                  >
                    <div className="flex gap-4 p-4 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all" style={{ border: '1px solid var(--border)' }}>
                      <div className="w-20 h-20 rounded-lg bg-surface-secondary dark:bg-surface-dark flex-shrink-0 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        {resource.vignette_url ? (
                          <img
                            src={resource.vignette_url}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8" style={{ color: 'var(--icon-neutral)', opacity: 0.3 }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground dark:text-foreground-dark truncate">{resource.title}</h3>
                        <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary line-clamp-2">{resource.description}</p>
                        <Badge className="mt-2 bg-sage/20 dark:bg-sage/30 text-sage border-0">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
