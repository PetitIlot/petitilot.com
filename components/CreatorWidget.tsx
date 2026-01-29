'use client'

import Link from 'next/link'
import { Instagram, Youtube, Globe, Package, Users } from 'lucide-react'
import type { Creator, Language } from '@/lib/types'
import FollowButton from '@/components/FollowButton'

// Type étendu avec stats
interface CreatorWithStats extends Creator {
  followers_count?: number
}

// Icône TikTok personnalisée
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

interface CreatorWidgetProps {
  creator: CreatorWithStats
  lang: Language
  className?: string
}

const translations = {
  fr: {
    by: 'Par',
    resources: 'ressources',
    followers: 'abonnés',
    viewProfile: 'Voir le profil'
  },
  en: {
    by: 'By',
    resources: 'resources',
    followers: 'followers',
    viewProfile: 'View profile'
  },
  es: {
    by: 'Por',
    resources: 'recursos',
    followers: 'seguidores',
    viewProfile: 'Ver perfil'
  }
}

export default function CreatorWidget({ creator, lang, className = '' }: CreatorWidgetProps) {
  const t = translations[lang]

  const socialLinks = [
    { handle: creator.instagram_handle, icon: Instagram, url: (h: string) => `https://instagram.com/${h.replace('@', '')}`, color: 'hover:text-pink-500' },
    { handle: creator.youtube_handle, icon: Youtube, url: (h: string) => `https://youtube.com/@${h.replace('@', '')}`, color: 'hover:text-red-500' },
    { handle: creator.tiktok_handle, icon: TikTokIcon, url: (h: string) => `https://tiktok.com/@${h.replace('@', '')}`, color: 'hover:text-white dark:hover:text-black' },
    { handle: creator.website_url, icon: Globe, url: (h: string) => h.startsWith('http') ? h : `https://${h}`, color: 'hover:text-sage' },
  ].filter(link => link.handle)

  return (
    <div className={`bg-surface dark:bg-surface-dark rounded-2xl shadow-sm p-4 ${className}`} style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Link href={`/${lang}/createurs/${creator.slug}`}>
          <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-secondary dark:bg-surface-dark flex-shrink-0 ring-2 ring-sage/30 hover:ring-sage transition-all">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground-secondary dark:text-foreground-dark-secondary text-xl font-bold">
                {creator.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.by}</p>
          <Link href={`/${lang}/createurs/${creator.slug}`}>
            <h3 className="font-quicksand font-semibold text-foreground dark:text-foreground-dark hover:text-sage transition-colors truncate">
              {creator.display_name}
            </h3>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-0.5">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {creator.total_resources} {t.resources}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {creator.followers_count || 0} {t.followers}
            </span>
          </div>
        </div>

        {/* Social Links & Follow */}
        <div className="flex items-center gap-3">
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link, idx) => {
                const Icon = link.icon
                return (
                  <a
                    key={idx}
                    href={link.url(link.handle!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-foreground-secondary dark:text-foreground-dark-secondary ${link.color} transition-colors`}
                    title={link.handle!}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
          {creator.id && <FollowButton creatorId={creator.id} lang={lang} />}
        </div>
      </div>
    </div>
  )
}
