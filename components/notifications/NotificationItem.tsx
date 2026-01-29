'use client'

import Link from 'next/link'
import { Bell, Package, Search, Info, X } from 'lucide-react'
import type { Notification, Language } from '@/lib/types'

interface NotificationItemProps {
  notification: Notification
  lang: Language
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
  onClick?: () => void
}

const translations = {
  fr: {
    viewResource: 'Voir la ressource',
    delete: 'Supprimer',
    justNow: "À l'instant",
    minutesAgo: 'il y a {n} min',
    hoursAgo: 'il y a {n}h',
    daysAgo: 'il y a {n}j',
  },
  en: {
    viewResource: 'View resource',
    delete: 'Delete',
    justNow: 'Just now',
    minutesAgo: '{n} min ago',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',
  },
  es: {
    viewResource: 'Ver recurso',
    delete: 'Eliminar',
    justNow: 'Ahora mismo',
    minutesAgo: 'hace {n} min',
    hoursAgo: 'hace {n}h',
    daysAgo: 'hace {n}d',
  },
}

function formatRelativeTime(dateString: string, lang: Language): string {
  const t = translations[lang]
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return t.justNow
  if (diffMins < 60) return t.minutesAgo.replace('{n}', String(diffMins))
  if (diffHours < 24) return t.hoursAgo.replace('{n}', String(diffHours))
  return t.daysAgo.replace('{n}', String(diffDays))
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'new_content':
      return <Package className="w-4 h-4" />
    case 'search_match':
      return <Search className="w-4 h-4" />
    case 'system':
      return <Info className="w-4 h-4" />
    default:
      return <Bell className="w-4 h-4" />
  }
}

export default function NotificationItem({
  notification,
  lang,
  onMarkRead,
  onDelete,
  onClick,
}: NotificationItemProps) {
  const t = translations[lang]

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id)
    }
    onClick?.()
  }

  const content = (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer
        ${notification.is_read
          ? 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
          : 'bg-sage/10 hover:bg-sage/15 dark:bg-sage/20 dark:hover:bg-sage/25'
        }
      `}
      onClick={handleClick}
    >
      {/* Icône */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${notification.is_read
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          : 'bg-sage/20 text-sage dark:bg-sage/30'
        }
      `}>
        {getNotificationIcon(notification.type)}
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className={`
          text-sm font-medium truncate
          ${notification.is_read
            ? 'text-foreground/70 dark:text-foreground-dark/70'
            : 'text-foreground dark:text-foreground-dark'
          }
        `}>
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-foreground-secondary/60 dark:text-foreground-dark-secondary/60 mt-1">
          {formatRelativeTime(notification.created_at, lang)}
        </p>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(notification.id)
        }}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-foreground-secondary/50 hover:text-foreground-secondary transition-colors"
        title={t.delete}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Indicateur non lu */}
      {!notification.is_read && (
        <div className="absolute top-3 left-3 w-2 h-2 bg-sage rounded-full" />
      )}
    </div>
  )

  // Si ressource_id, wrap dans un Link
  if (notification.ressource_id) {
    return (
      <Link href={`/${lang}/activites/${notification.ressource_id}`} className="block relative">
        {content}
      </Link>
    )
  }

  return <div className="relative">{content}</div>
}
