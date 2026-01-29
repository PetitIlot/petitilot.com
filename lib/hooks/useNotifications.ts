'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Notification } from '@/lib/types'

interface UseNotificationsOptions {
  pollInterval?: number // ms, default 60000 (1 min)
  enabled?: boolean
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook pour gérer les notifications utilisateur
 *
 * - Polling du compteur toutes les 60s
 * - Fonctions pour marquer lu, supprimer
 * - Refresh manuel possible
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { pollInterval = 60000, enabled = true } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=10')
      if (!res.ok) {
        if (res.status === 401) {
          // Non connecté, pas d'erreur
          setNotifications([])
          return
        }
        throw new Error('Erreur fetch notifications')
      }
      const data = await res.json()
      setNotifications(data.notifications || [])
      setError(null)
    } catch (err) {
      console.error('Erreur notifications:', err)
      setError('Impossible de charger les notifications')
    }
  }, [])

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/unread-count')
      if (!res.ok) return
      const data = await res.json()
      setUnreadCount(data.count || 0)
    } catch (err) {
      console.error('Erreur unread count:', err)
    }
  }, [])

  // Initial fetch + polling
  useEffect(() => {
    if (!enabled) return

    setIsLoading(true)
    Promise.all([fetchNotifications(), fetchUnreadCount()])
      .finally(() => setIsLoading(false))

    // Polling du compteur uniquement (léger)
    const interval = setInterval(fetchUnreadCount, pollInterval)
    return () => clearInterval(interval)
  }, [enabled, pollInterval, fetchNotifications, fetchUnreadCount])

  // Mark single as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Erreur mark as read')

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erreur markAsRead:', err)
      throw err
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' })
      if (!res.ok) throw new Error('Erreur mark all read')

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Erreur markAllAsRead:', err)
      throw err
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur delete')

      // Update local state
      const deleted = notifications.find(n => n.id === id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (deleted && !deleted.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Erreur deleteNotification:', err)
      throw err
    }
  }, [notifications])

  // Manual refresh
  const refresh = useCallback(async () => {
    setIsLoading(true)
    await Promise.all([fetchNotifications(), fetchUnreadCount()])
    setIsLoading(false)
  }, [fetchNotifications, fetchUnreadCount])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  }
}
