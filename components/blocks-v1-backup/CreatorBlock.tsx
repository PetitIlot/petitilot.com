'use client'

import { RessourceWithCreator } from '@/lib/supabase-queries'
import { CreatorBlockData, BlockStyle } from '@/lib/blocks/types'
import { Language } from '@/lib/types'
import CreatorWidget from '@/components/CreatorWidget'
import Link from 'next/link'

interface CreatorBlockProps {
  activity: RessourceWithCreator
  data: CreatorBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

export default function CreatorBlock({ activity, data, style, lang, isEditing }: CreatorBlockProps) {
  if (!activity.creator) {
    return (
      <div className="p-4 bg-surface-secondary dark:bg-surface-dark rounded-xl text-center">
        <span className="text-foreground-secondary">Créateur non disponible</span>
      </div>
    )
  }

  // Variant Full - Widget complet
  if (data.variant === 'full') {
    return (
      <CreatorWidget
        creator={activity.creator}
        lang={lang}
        showFollowButton={data.showFollowButton}
      />
    )
  }

  // Variant Compact
  if (data.variant === 'compact') {
    return (
      <Link href={`/${lang}/createurs/${activity.creator.slug}`}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary dark:bg-surface-dark hover:bg-surface dark:hover:bg-surface-dark-hover transition-colors cursor-pointer">
          <img
            src={activity.creator.avatar_url || '/default-avatar.png'}
            alt={activity.creator.display_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground dark:text-foreground-dark">
              {activity.creator.display_name}
            </p>
            {data.showStats && (
              <p className="text-xs text-foreground-secondary">
                {activity.creator.ressource_count || 0} ressources
              </p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Variant Minimal
  return (
    <Link href={`/${lang}/createurs/${activity.creator.slug}`}>
      <div className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors">
        <img
          src={activity.creator.avatar_url || '/default-avatar.png'}
          alt={activity.creator.display_name}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span>par {activity.creator.display_name}</span>
      </div>
    </Link>
  )
}
