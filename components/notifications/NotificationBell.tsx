'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/lib/hooks/useNotifications'
import NotificationItem from './NotificationItem'
import type { Language } from '@/lib/types'

interface NotificationBellProps {
  lang: Language
  isLoggedIn: boolean
}

const translations = {
  fr: {
    notifications: 'Notifications',
    noNotifications: 'Aucune notification',
    markAllRead: 'Tout marquer comme lu',
    viewAll: 'Voir tout',
  },
  en: {
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAllRead: 'Mark all as read',
    viewAll: 'View all',
  },
  es: {
    notifications: 'Notificaciones',
    noNotifications: 'Sin notificaciones',
    markAllRead: 'Marcar todo como leído',
    viewAll: 'Ver todo',
  },
}

export default function NotificationBell({ lang, isLoggedIn }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const t = translations[lang]

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({ enabled: isLoggedIn })

  // Ferme le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Si pas connecté, ne montre pas la cloche
  if (!isLoggedIn) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-foreground/70 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
      >
        <Bell className="w-5 h-5" />

        {/* Badge compteur */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-hidden liquid-glass rounded-apple-lg shadow-apple-elevated animate-scale-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="font-semibold text-sm text-foreground dark:text-foreground-dark">
              {t.notifications}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs text-sage hover:text-sage/80 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                {t.markAllRead}
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[280px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 mx-auto text-foreground-secondary/30 dark:text-foreground-dark-secondary/30 mb-2" />
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                  {t.noNotifications}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    lang={lang}
                    onMarkRead={markAsRead}
                    onDelete={deleteNotification}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--border)]">
              <Link
                href={`/${lang}/profil/alertes`}
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-sage hover:text-sage/80"
              >
                {t.viewAll}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
