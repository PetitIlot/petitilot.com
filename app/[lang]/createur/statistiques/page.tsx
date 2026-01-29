'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, TrendingUp, DollarSign, Package, Calendar, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language, Creator, Resource } from '@/lib/types'

const translations = {
  fr: {
    title: 'Statistiques',
    back: 'Retour au dashboard',
    period: 'Période',
    last7days: '7 derniers jours',
    last30days: '30 derniers jours',
    last90days: '90 derniers jours',
    allTime: 'Tout le temps',
    overview: 'Vue d\'ensemble',
    totalViews: 'Vues totales',
    totalSales: 'Ventes',
    totalEarnings: 'Gains totaux',
    totalResources: 'Ressources',
    topResources: 'Ressources les plus populaires',
    resourceName: 'Ressource',
    views: 'Vues',
    sales: 'Ventes',
    earnings: 'Gains',
    noData: 'Pas encore de données',
    createFirst: 'Créez votre première ressource',
    credits: 'crédits'
  },
  en: {
    title: 'Statistics',
    back: 'Back to dashboard',
    period: 'Period',
    last7days: 'Last 7 days',
    last30days: 'Last 30 days',
    last90days: 'Last 90 days',
    allTime: 'All time',
    overview: 'Overview',
    totalViews: 'Total views',
    totalSales: 'Sales',
    totalEarnings: 'Total earnings',
    totalResources: 'Resources',
    topResources: 'Most popular resources',
    resourceName: 'Resource',
    views: 'Views',
    sales: 'Sales',
    earnings: 'Earnings',
    noData: 'No data yet',
    createFirst: 'Create your first resource',
    credits: 'credits'
  },
  es: {
    title: 'Estadísticas',
    back: 'Volver al panel',
    period: 'Período',
    last7days: 'Últimos 7 días',
    last30days: 'Últimos 30 días',
    last90days: 'Últimos 90 días',
    allTime: 'Todo el tiempo',
    overview: 'Resumen',
    totalViews: 'Vistas totales',
    totalSales: 'Ventas',
    totalEarnings: 'Ganancias totales',
    totalResources: 'Recursos',
    topResources: 'Recursos más populares',
    resourceName: 'Recurso',
    views: 'Vistas',
    sales: 'Ventas',
    earnings: 'Ganancias',
    noData: 'Aún no hay datos',
    createFirst: 'Crea tu primer recurso',
    credits: 'créditos'
  }
}

type Period = '7d' | '30d' | '90d' | 'all'

export default function CreatorStatsPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [period, setPeriod] = useState<Period>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [showPeriodMenu, setShowPeriodMenu] = useState(false)

  const [stats, setStats] = useState({
    totalViews: 0,
    totalSales: 0,
    totalEarnings: 0,
    totalResources: 0
  })

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  const periodLabels: Record<Period, string> = {
    '7d': t.last7days,
    '30d': t.last30days,
    '90d': t.last90days,
    'all': t.allTime
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      const { data: creatorData } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!creatorData) {
        router.push(`/${lang}/devenir-createur`)
        return
      }

      setCreator(creatorData as Creator)

      // Fetch all ressources with stats
      const { data: resourcesData } = await supabase
        .from('ressources')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('views_count', { ascending: false })

      // Mapper vers le type Resource
      const allResources = (resourcesData || []).map((r: any) => ({
        ...r,
        title_fr: r.title,
        description_fr: r.description,
        preview_image_url: r.vignette_url,
        resource_file_url: r.pdf_url
      })) as Resource[]
      setResources(allResources)

      // Compute stats
      const computedStats = allResources.reduce((acc, r) => {
        acc.totalViews += r.views_count || 0
        acc.totalSales += r.purchases_count || 0
        return acc
      }, { totalViews: 0, totalSales: 0 })

      setStats({
        totalViews: computedStats.totalViews,
        totalSales: computedStats.totalSales,
        totalEarnings: (creatorData.total_earnings_cents || 0) / 100,
        totalResources: allResources.length
      })

      setIsLoading(false)
    }

    fetchData()
  }, [lang, router, period])

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
          <Link href={`/${lang}/createur`}>
            <Button variant="ghost" className="mb-4 text-foreground dark:text-foreground-dark">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="font-quicksand text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
              {t.title}
            </h1>

            {/* Period Selector */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                className="min-w-[180px] justify-between"
                style={{ border: '1px solid var(--border)' }}
              >
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {periodLabels[period]}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showPeriodMenu && (
                <div className="absolute right-0 top-full mt-2 bg-surface dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden z-10" style={{ border: '1px solid var(--border)' }}>
                  {(Object.keys(periodLabels) as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPeriod(p)
                        setShowPeriodMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors ${
                        period === p ? 'bg-sage/10 text-sage' : 'text-foreground dark:text-foreground-dark'
                      }`}
                    >
                      {periodLabels[p]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark mb-4">
            {t.overview}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <Eye className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sky)' }} />
              <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalViews}</p>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalViews}</p>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <TrendingUp className="w-8 h-8 mb-2" style={{ color: 'var(--icon-terracotta)' }} />
              <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalSales}</p>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalSales}</p>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <DollarSign className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sage)' }} />
              <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalEarnings.toFixed(2)}€</p>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalEarnings}</p>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <Package className="w-8 h-8 mb-2" style={{ color: 'var(--icon-neutral)' }} />
              <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.totalResources}</p>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalResources}</p>
            </div>
          </div>
        </motion.div>

        {/* Top Resources Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-6 md:p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark mb-6">
            {t.topResources}
          </h2>

          {resources.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-foreground/20 dark:text-foreground-dark/20 mx-auto mb-4" />
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.noData}</p>
              <Link href={`/${lang}/createur/ressources/nouvelle`}>
                <Button className="bg-sage hover:bg-sage-light text-white">
                  {t.createFirst}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left py-3 px-4 font-medium text-foreground-secondary dark:text-foreground-dark-secondary">
                      {t.resourceName}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-foreground-secondary dark:text-foreground-dark-secondary">
                      {t.views}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-foreground-secondary dark:text-foreground-dark-secondary">
                      {t.sales}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-foreground-secondary dark:text-foreground-dark-secondary">
                      {t.earnings}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resources.slice(0, 10).map((resource, idx) => {
                    const earnings = (resource.purchases_count || 0) * resource.price_credits * (creator?.commission_rate || 0.9) * 0.50
                    return (
                      <tr
                        key={resource.id}
                        className="hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors"
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <td className="py-4 px-4">
                          <Link
                            href={`/${lang}/createur/ressources/${resource.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-lg bg-surface-secondary dark:bg-surface-dark flex items-center justify-center overflow-hidden flex-shrink-0">
                              {resource.preview_image_url ? (
                                <img
                                  src={resource.preview_image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm font-bold">
                                  {idx + 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground dark:text-foreground-dark truncate max-w-[200px]">
                                {resource.title_fr}
                              </p>
                              <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                                {resource.price_credits} {t.credits}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-right text-foreground dark:text-foreground-dark">
                          {resource.views_count || 0}
                        </td>
                        <td className="py-4 px-4 text-right text-foreground dark:text-foreground-dark">
                          {resource.purchases_count || 0}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-sage">
                          {earnings.toFixed(2)}€
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
