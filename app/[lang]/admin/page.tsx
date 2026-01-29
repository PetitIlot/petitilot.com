'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Package, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    dashboard: 'Administration',
    overview: 'Vue d\'ensemble',
    pendingReview: 'En attente de validation',
    creators: 'Créateurs',
    resources: 'Ressources',
    monitoring: 'Monitoring',
    finance: 'Finance',
    totalCreators: 'Créateurs',
    pendingCreators: 'En attente',
    totalResources: 'Ressources',
    publishedResources: 'Publiées',
    deadLinks: 'Liens morts',
    pendingResources: 'À valider',
    totalRevenue: 'Revenus',
    viewAll: 'Voir tout',
    approve: 'Approuver',
    reject: 'Rejeter',
    noItems: 'Aucun élément en attente',
    quickActions: 'Actions rapides',
    manageCreators: 'Gérer les créateurs',
    reviewResources: 'Valider les ressources',
    checkUrls: 'Vérifier les URLs',
    viewFinance: 'Voir les finances'
  },
  en: {
    dashboard: 'Administration',
    overview: 'Overview',
    pendingReview: 'Pending review',
    creators: 'Creators',
    resources: 'Resources',
    monitoring: 'Monitoring',
    finance: 'Finance',
    totalCreators: 'Creators',
    pendingCreators: 'Pending',
    totalResources: 'Resources',
    publishedResources: 'Published',
    deadLinks: 'Dead links',
    pendingResources: 'To review',
    totalRevenue: 'Revenue',
    viewAll: 'View all',
    approve: 'Approve',
    reject: 'Reject',
    noItems: 'No pending items',
    quickActions: 'Quick actions',
    manageCreators: 'Manage creators',
    reviewResources: 'Review resources',
    checkUrls: 'Check URLs',
    viewFinance: 'View finance'
  },
  es: {
    dashboard: 'Administración',
    overview: 'Resumen',
    pendingReview: 'Pendiente de revisión',
    creators: 'Creadores',
    resources: 'Recursos',
    monitoring: 'Monitoreo',
    finance: 'Finanzas',
    totalCreators: 'Creadores',
    pendingCreators: 'Pendientes',
    totalResources: 'Recursos',
    publishedResources: 'Publicados',
    deadLinks: 'Enlaces rotos',
    pendingResources: 'Por revisar',
    totalRevenue: 'Ingresos',
    viewAll: 'Ver todo',
    approve: 'Aprobar',
    reject: 'Rechazar',
    noItems: 'No hay elementos pendientes',
    quickActions: 'Acciones rápidas',
    manageCreators: 'Gestionar creadores',
    reviewResources: 'Revisar recursos',
    checkUrls: 'Verificar URLs',
    viewFinance: 'Ver finanzas'
  }
}

interface Stats {
  totalCreators: number
  pendingCreators: number
  approvedCreators: number
  totalResources: number
  publishedResources: number
  pendingResources: number
  deadLinks: number
}

export default function AdminDashboardPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [stats, setStats] = useState<Stats>({
    totalCreators: 0,
    pendingCreators: 0,
    approvedCreators: 0,
    totalResources: 0,
    publishedResources: 0,
    pendingResources: 0,
    deadLinks: 0
  })
  const [pendingResources, setPendingResources] = useState<any[]>([])
  const [pendingCreators, setPendingCreators] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      // Verify admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push(`/${lang}`)
        return
      }

      // Fetch stats
      const [creatorsData, resourcesData] = await Promise.all([
        supabase.from('creators').select('is_approved'),
        supabase.from('resources').select('status, url_status')
      ])

      const creators = creatorsData.data || []
      const resources = resourcesData.data || []

      setStats({
        totalCreators: creators.length,
        pendingCreators: creators.filter(c => !c.is_approved).length,
        approvedCreators: creators.filter(c => c.is_approved).length,
        totalResources: resources.length,
        publishedResources: resources.filter(r => r.status === 'published').length,
        pendingResources: resources.filter(r => r.status === 'pending_review').length,
        deadLinks: resources.filter(r => r.url_status === 'dead').length
      })

      // Fetch pending items
      const [pendingResourcesData, pendingCreatorsData] = await Promise.all([
        supabase
          .from('resources')
          .select('*, creators(display_name)')
          .eq('status', 'pending_review')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('creators')
          .select('*')
          .eq('is_approved', false)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      setPendingResources(pendingResourcesData.data || [])
      setPendingCreators(pendingCreatorsData.data || [])

      setIsLoading(false)
    }

    fetchData()
  }, [lang, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-quicksand text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
            {t.dashboard}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.overview}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <Users className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sage)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalCreators}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalCreators}</p>
            {stats.pendingCreators > 0 && (
              <p className="text-xs text-terracotta mt-1">
                {stats.pendingCreators} {t.pendingCreators.toLowerCase()}
              </p>
            )}
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <Package className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sky)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalResources}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalResources}</p>
            <p className="text-xs text-sage mt-1">
              {stats.publishedResources} {t.publishedResources.toLowerCase()}
            </p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <Clock className="w-8 h-8 mb-2" style={{ color: 'var(--icon-terracotta)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.pendingResources}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.pendingResources}</p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <AlertTriangle className="w-8 h-8 text-red-400 dark:text-red-500 mb-2" />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.deadLinks}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.deadLinks}</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Link href={`/${lang}/admin/createurs`}>
            <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple hover:shadow-lg transition-all cursor-pointer text-center" style={{ border: '1px solid var(--border)' }}>
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--icon-sage)' }} />
              <p className="text-sm font-medium text-foreground dark:text-foreground-dark">{t.manageCreators}</p>
            </div>
          </Link>

          <Link href={`/${lang}/admin/ressources`}>
            <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple hover:shadow-lg transition-all cursor-pointer text-center" style={{ border: '1px solid var(--border)' }}>
              <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--icon-sky)' }} />
              <p className="text-sm font-medium text-foreground dark:text-foreground-dark">{t.reviewResources}</p>
            </div>
          </Link>

          <Link href={`/${lang}/admin/monitoring`}>
            <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple hover:shadow-lg transition-all cursor-pointer text-center" style={{ border: '1px solid var(--border)' }}>
              <AlertTriangle className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--icon-terracotta)' }} />
              <p className="text-sm font-medium text-foreground dark:text-foreground-dark">{t.checkUrls}</p>
            </div>
          </Link>

          <Link href={`/${lang}/admin/finance`}>
            <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple hover:shadow-lg transition-all cursor-pointer text-center" style={{ border: '1px solid var(--border)' }}>
              <DollarSign className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--icon-sage)' }} />
              <p className="text-sm font-medium text-foreground dark:text-foreground-dark">{t.viewFinance}</p>
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark">
                {t.pendingResources} ({stats.pendingResources})
              </h2>
              <Link href={`/${lang}/admin/ressources?status=pending_review`}>
                <Button variant="ghost" size="sm" className="text-sage">
                  {t.viewAll}
                </Button>
              </Link>
            </div>

            {pendingResources.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--icon-sage)', opacity: 0.4 }} />
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.noItems}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingResources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/${lang}/admin/ressources/${resource.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-surface-secondary dark:bg-surface-dark flex items-center justify-center" style={{ border: '1px solid var(--border)' }}>
                        <FileText className="w-5 h-5" style={{ color: 'var(--icon-neutral)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground dark:text-foreground-dark truncate text-sm">
                          {resource.title_fr}
                        </p>
                        <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                          par {resource.creators?.display_name}
                        </p>
                      </div>
                      <Clock className="w-4 h-4" style={{ color: 'var(--icon-terracotta)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pending Creators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark">
                {t.pendingCreators} ({stats.pendingCreators})
              </h2>
              <Link href={`/${lang}/admin/createurs?status=pending`}>
                <Button variant="ghost" size="sm" className="text-sage">
                  {t.viewAll}
                </Button>
              </Link>
            </div>

            {pendingCreators.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--icon-sage)', opacity: 0.4 }} />
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.noItems}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCreators.map((creator) => (
                  <Link
                    key={creator.id}
                    href={`/${lang}/admin/createurs/${creator.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors">
                      <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center text-white font-bold">
                        {creator.display_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground dark:text-foreground-dark truncate text-sm">
                          {creator.display_name}
                        </p>
                        <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                          @{creator.slug}
                        </p>
                      </div>
                      <Clock className="w-4 h-4" style={{ color: 'var(--icon-terracotta)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
