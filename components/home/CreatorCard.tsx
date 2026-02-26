'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, BookOpen, CheckCircle, Users } from 'lucide-react'
import type { Language } from '@/lib/types'

export interface CreatorCardData {
  slug: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  themes: string[] | null
  total_resources: number
  followers?: number
  is_approved: boolean
  is_featured?: boolean
  // optional gradient override for demo cards
  avatarGradient?: string
}

interface CreatorCardProps {
  creator: CreatorCardData
  lang: Language
}

export default function CreatorCard({ creator, lang }: CreatorCardProps) {
  const initials = creator.display_name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const resourceLabel = lang === 'fr'
    ? (creator.total_resources > 1 ? 'ressources' : 'ressource')
    : lang === 'es'
    ? (creator.total_resources > 1 ? 'recursos' : 'recurso')
    : (creator.total_resources > 1 ? 'resources' : 'resource')


  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <Link href={`/${lang}/createurs/${creator.slug}`}>
        <div className="card-huly group">
          <div className="p-3 flex flex-col gap-2.5">

            {/* Vignette — avatar sur fond dégradé */}
            <div className="card-glass-vignette">
              <div className="aspect-[4/3] overflow-hidden relative">

                {/* Gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: creator.avatarGradient ||
                      'linear-gradient(135deg, rgba(168,181,160,0.35) 0%, rgba(204,166,200,0.25) 100%)'
                  }}
                />

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                  }}
                />

                {/* Centered avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[72px] h-[72px] rounded-full ring-[3px] ring-white/60 dark:ring-white/20 overflow-hidden shadow-lg flex-shrink-0">
                    {creator.avatar_url ? (
                      <img
                        src={creator.avatar_url}
                        alt={creator.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: creator.avatarGradient ||
                            'linear-gradient(135deg, #8FA98C 0%, #6B9A68 100%)'
                        }}
                      >
                        <span className="text-white text-2xl font-bold">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Themes chip — top left (like category chip) */}
                {creator.themes && creator.themes[0] && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="card-huly-chip px-2.5 py-1 text-[11px] font-semibold rounded-full inline-block">
                      {creator.themes[0]}
                    </span>
                  </div>
                )}

                {/* Verified badge — top right (like rating chip) */}
                {creator.is_approved && (
                  <div className="absolute top-2.5 right-2.5 card-huly-chip px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-medium">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="hidden sm:inline">{lang === 'fr' ? 'Vérifié' : lang === 'es' ? 'Verificado' : 'Verified'}</span>
                  </div>
                )}

              </div>
            </div>

            {/* Contenu — zone posée sur le verre */}
            <div className="card-glass-body">
              <h3 className="font-semibold text-[var(--foreground)] text-[15px] leading-snug mb-2 tracking-tight truncate">
                {creator.display_name}
              </h3>

              {/* Bio */}
              {creator.bio && (
                <p className="text-[12px] text-[var(--foreground-secondary)] leading-relaxed mb-2 line-clamp-2">
                  {creator.bio}
                </p>
              )}

              {/* Themes — like tags in ActivityCard */}
              {creator.themes && creator.themes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {creator.themes.slice(0, 2).map((theme, idx) => (
                    <span key={idx} className="card-huly-tag card-huly-tag--sage">
                      <Tag className="w-2.5 h-2.5" />
                      {theme}
                    </span>
                  ))}
                  {creator.themes.length > 2 && (
                    <span className="card-huly-tag card-huly-tag--mauve">
                      +{creator.themes.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer — stats */}
            <div className="card-glass-creator flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-[var(--foreground-secondary)]">
                <Users className="w-3 h-3 opacity-50" />
                <span>
                  {creator.followers ?? 0}
                  {' '}{lang === 'fr' ? 'abonnés' : lang === 'es' ? 'seguidores' : 'followers'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[var(--foreground-secondary)]">
                <BookOpen className="w-3 h-3 opacity-50" />
                <span>{creator.total_resources} {resourceLabel}</span>
              </div>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  )
}
