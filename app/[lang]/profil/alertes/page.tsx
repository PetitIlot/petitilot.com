'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Search,
  User,
  Trash2,
  ExternalLink,
  UserMinus,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase-client'
import { useNotifications } from '@/lib/hooks/useNotifications'
import NotificationItem from '@/components/notifications/NotificationItem'
import type { Language, SavedSearch, Creator, Follow } from '@/lib/types'
import {
  CATEGORIES,
  THEMES,
  COMPETENCES,
  DIFFICULTY_OPTIONS,
  getOptionLabel,
} from '@/lib/constants/filters'

interface PageProps {
  params: Promise<{ lang: string }>
}

const translations = {
  fr: {
    title: 'Mes alertes et abonnements',
    savedSearches: 'Recherches sauvegardées',
    followedCreators: 'Créateurs suivis',
    recentNotifications: 'Notifications récentes',
    noSavedSearches: 'Aucune recherche sauvegardée',
    noFollowedCreators: 'Aucun créateur suivi',
    noNotifications: 'Aucune notification',
    applyFilters: 'Appliquer',
    delete: 'Supprimer',
    viewProfile: 'Voir profil',
    unfollow: 'Ne plus suivre',
    markAllRead: 'Tout marquer comme lu',
    back: 'Retour',
    loading: 'Chargement...',
    active: 'Active',
    paused: 'En pause',
    ageRange: '{min} - {max} mois',
    free: 'Gratuit',
    paid: 'Payant',
    loginRequired: 'Connexion requise',
    loginMessage: 'Connectez-vous pour gérer vos alertes',
    login: 'Se connecter',
  },
  en: {
    title: 'My alerts and subscriptions',
    savedSearches: 'Saved searches',
    followedCreators: 'Followed creators',
    recentNotifications: 'Recent notifications',
    noSavedSearches: 'No saved searches',
    noFollowedCreators: 'No followed creators',
    noNotifications: 'No notifications',
    applyFilters: 'Apply',
    delete: 'Delete',
    viewProfile: 'View profile',
    unfollow: 'Unfollow',
    markAllRead: 'Mark all as read',
    back: 'Back',
    loading: 'Loading...',
    active: 'Active',
    paused: 'Paused',
    ageRange: '{min} - {max} months',
    free: 'Free',
    paid: 'Paid',
    loginRequired: 'Login required',
    loginMessage: 'Sign in to manage your alerts',
    login: 'Sign in',
  },
  es: {
    title: 'Mis alertas y suscripciones',
    savedSearches: 'Búsquedas guardadas',
    followedCreators: 'Creadores seguidos',
    recentNotifications: 'Notificaciones recientes',
    noSavedSearches: 'Sin búsquedas guardadas',
    noFollowedCreators: 'Sin creadores seguidos',
    noNotifications: 'Sin notificaciones',
    applyFilters: 'Aplicar',
    delete: 'Eliminar',
    viewProfile: 'Ver perfil',
    unfollow: 'Dejar de seguir',
    markAllRead: 'Marcar todo como leído',
    back: 'Volver',
    loading: 'Cargando...',
    active: 'Activa',
    paused: 'Pausada',
    ageRange: '{min} - {max} meses',
    free: 'Gratis',
    paid: 'De pago',
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para gestionar tus alertas',
    login: 'Iniciar sesión',
  },
}

export default function AlertesPage({ params }: PageProps) {
  const { lang } = use(params)
  const router = useRouter()
  const t = translations[lang as keyof typeof translations] || translations.fr

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [alerts, setAlerts] = useState<SavedSearch[]>([])
  const [follows, setFollows] = useState<(Follow & { creator: Creator })[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null)

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: refreshNotifications,
  } = useNotifications({ enabled: isLoggedIn })

  // Check auth and load data
  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      setIsLoggedIn(true)

      // Load alerts
      const alertsRes = await fetch('/api/alerts')
      if (alertsRes.ok) {
        const data = await alertsRes.json()
        setAlerts(data.alerts || [])
      }

      // Load follows with creator data
      const { data: followsData } = await supabase
        .from('follows')
        .select('*, creator:creators(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (followsData) {
        setFollows(followsData as (Follow & { creator: Creator })[])
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Delete alert
  const handleDeleteAlert = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error('Erreur suppression alerte:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // Unfollow creator
  const handleUnfollow = async (followId: string, creatorId: string) => {
    setUnfollowingId(followId)
    try {
      const supabase = createClient()
      await supabase
        .from('follows')
        .delete()
        .eq('id', followId)

      setFollows(prev => prev.filter(f => f.id !== followId))
    } catch (err) {
      console.error('Erreur unfollow:', err)
    } finally {
      setUnfollowingId(null)
    }
  }

  // Build URL from filters
  const buildFilterUrl = (filters: Record<string, unknown>): string => {
    const params = new URLSearchParams()

    const categories = filters.categories as string[] | undefined
    if (categories?.length) params.set('cat', categories.join(','))

    const themes = filters.themes as string[] | undefined
    if (themes?.length) params.set('themes', themes.join(','))

    const competences = filters.competences as string[] | undefined
    if (competences?.length) params.set('skills', competences.join(','))

    const ageMin = filters.ageMin as number | null
    if (ageMin !== null && ageMin !== undefined) params.set('age_min', String(ageMin))

    const ageMax = filters.ageMax as number | null
    if (ageMax !== null && ageMax !== undefined) params.set('age_max', String(ageMax))

    const difficulty = filters.difficulty as string | null
    if (difficulty) params.set('diff', difficulty)

    const isFree = filters.isFree as boolean | null
    if (isFree !== null && isFree !== undefined) params.set('free', isFree ? '1' : '0')

    return `/${lang}/activites?${params.toString()}`
  }

  // Generate filter badges
  const getFilterBadges = (filters: Record<string, unknown>): string[] => {
    const badges: string[] = []

    const categories = filters.categories as string[] | undefined
    categories?.forEach(cat => {
      badges.push(getOptionLabel(CATEGORIES, cat, lang as Language))
    })

    const ageMin = filters.ageMin as number | null
    const ageMax = filters.ageMax as number | null
    if (ageMin !== null || ageMax !== null) {
      const min = ageMin ?? 0
      const max = ageMax ?? 72
      badges.push(t.ageRange.replace('{min}', String(min)).replace('{max}', String(max)))
    }

    const themes = filters.themes as string[] | undefined
    themes?.slice(0, 2).forEach(theme => {
      badges.push(getOptionLabel(THEMES, theme, lang as Language))
    })

    const competences = filters.competences as string[] | undefined
    competences?.slice(0, 2).forEach(comp => {
      badges.push(getOptionLabel(COMPETENCES, comp, lang as Language))
    })

    const difficulty = filters.difficulty as string | null
    if (difficulty) {
      badges.push(getOptionLabel(DIFFICULTY_OPTIONS, difficulty, lang as Language))
    }

    const isFree = filters.isFree as boolean | null
    if (isFree !== null && isFree !== undefined) {
      badges.push(isFree ? t.free : t.paid)
    }

    return badges
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    )
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Bell className="w-16 h-16 mx-auto text-sage/30 mb-4" />
          <h1 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">
            {t.loginRequired}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">
            {t.loginMessage}
          </p>
          <Link href={`/${lang}/connexion`}>
            <Button className="bg-sage hover:bg-sage/90 text-white">
              {t.login}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
            {t.title}
          </h1>
        </div>

        {/* Recherches sauvegardées */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-sage" />
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t.savedSearches}
            </h2>
            {alerts.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {alerts.length}
              </Badge>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] p-6 text-center">
              <Search className="w-10 h-10 mx-auto text-foreground-secondary/30 mb-2" />
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary">
                {t.noSavedSearches}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-4 h-4 text-sage" />
                        <span className="font-medium text-foreground dark:text-foreground-dark truncate">
                          {alert.name}
                        </span>
                        <Badge
                          variant={alert.is_active ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.is_active ? t.active : t.paused}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {getFilterBadges(alert.filters).map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={buildFilterUrl(alert.filters)}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {t.applyFilters}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        disabled={deletingId === alert.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        {deletingId === alert.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Créateurs suivis */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-sage" />
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {t.followedCreators}
            </h2>
            {follows.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {follows.length}
              </Badge>
            )}
          </div>

          {follows.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] p-6 text-center">
              <User className="w-10 h-10 mx-auto text-foreground-secondary/30 mb-2" />
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary">
                {t.noFollowedCreators}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {follows.map((follow) => (
                <div
                  key={follow.id}
                  className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center overflow-hidden">
                        {follow.creator.avatar_url ? (
                          <img
                            src={follow.creator.avatar_url}
                            alt={follow.creator.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-sage" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground dark:text-foreground-dark">
                          {follow.creator.display_name}
                        </p>
                        <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                          @{follow.creator.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/${lang}/createurs/${follow.creator.slug}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          {t.viewProfile}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnfollow(follow.id, follow.creator_id)}
                        disabled={unfollowingId === follow.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        {unfollowingId === follow.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserMinus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notifications récentes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sage" />
              <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
                {t.recentNotifications}
              </h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="gap-1 text-sage"
              >
                <CheckCircle className="w-4 h-4" />
                {t.markAllRead}
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] p-6 text-center">
              <Bell className="w-10 h-10 mx-auto text-foreground-secondary/30 mb-2" />
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary">
                {t.noNotifications}
              </p>
            </div>
          ) : (
            <div className="bg-surface dark:bg-surface-dark rounded-apple-lg border border-[var(--border)] overflow-hidden">
              <div className="divide-y divide-[var(--border)]">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-2">
                    <NotificationItem
                      notification={notification}
                      lang={lang as Language}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
