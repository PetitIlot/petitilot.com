'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Package, TrendingUp, DollarSign, Eye, FileText, Settings, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language, Creator, Resource } from '@/lib/types'

const translations = {
  fr: {
    dashboard: 'Tableau de bord créateur',
    welcome: 'Bienvenue',
    newResource: 'Nouvelle ressource',
    myResources: 'Mes ressources',
    stats: 'Statistiques',
    settings: 'Paramètres',
    totalResources: 'Ressources',
    totalViews: 'Vues totales',
    totalSales: 'Ventes',
    totalEarnings: 'Gains',
    draft: 'Brouillon',
    pending: 'En attente',
    published: 'Publiées',
    noResources: "Vous n'avez pas encore de ressources",
    createFirst: 'Créez votre première ressource',
    recentResources: 'Ressources récentes',
    viewAll: 'Voir tout',
    credits: 'crédits',
    edit: 'Modifier'
  },
  en: {
    dashboard: 'Creator Dashboard',
    welcome: 'Welcome',
    newResource: 'New resource',
    myResources: 'My resources',
    stats: 'Statistics',
    settings: 'Settings',
    totalResources: 'Resources',
    totalViews: 'Total views',
    totalSales: 'Sales',
    totalEarnings: 'Earnings',
    draft: 'Draft',
    pending: 'Pending',
    published: 'Published',
    noResources: "You don't have any resources yet",
    createFirst: 'Create your first resource',
    recentResources: 'Recent resources',
    viewAll: 'View all',
    credits: 'credits',
    edit: 'Edit'
  },
  es: {
    dashboard: 'Panel de creador',
    welcome: 'Bienvenido',
    newResource: 'Nuevo recurso',
    myResources: 'Mis recursos',
    stats: 'Estadísticas',
    settings: 'Configuración',
    totalResources: 'Recursos',
    totalViews: 'Vistas totales',
    totalSales: 'Ventas',
    totalEarnings: 'Ganancias',
    draft: 'Borrador',
    pending: 'Pendiente',
    published: 'Publicadas',
    noResources: 'Aún no tienes recursos',
    createFirst: 'Crea tu primer recurso',
    recentResources: 'Recursos recientes',
    viewAll: 'Ver todo',
    credits: 'créditos',
    edit: 'Editar'
  }
}

export default function CreatorDashboardPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    published: 0,
    views: 0,
    sales: 0
  })
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

      // Fetch creator profile
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (creatorError) {
        alert(`Erreur creators: ${creatorError.message} (user_id: ${user.id})`)
        return
      }

      if (!creatorData) {
        alert(`Pas de créateur trouvé pour user_id: ${user.id}`)
        router.push(`/${lang}/devenir-createur`)
        return
      }

      setCreator(creatorData as Creator)

      // Fetch ressources (table enrichie)
      const { data: resourcesData } = await supabase
        .from('ressources')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Mapper vers le type Resource
      const mappedResources = (resourcesData || []).map((r: any) => ({
        ...r,
        title_fr: r.title,
        description_fr: r.description,
        preview_image_url: r.vignette_url,
        resource_file_url: r.pdf_url
      })) as Resource[]
      setResources(mappedResources)

      // Compute stats
      const { data: allResources } = await supabase
        .from('ressources')
        .select('status, views_count, purchases_count')
        .eq('creator_id', creatorData.id)

      if (allResources) {
        const computedStats = allResources.reduce((acc, r) => {
          acc.total++
          acc[r.status as keyof typeof acc]++
          acc.views += r.views_count || 0
          acc.sales += r.purchases_count || 0
          return acc
        }, { total: 0, draft: 0, pending_review: 0, published: 0, rejected: 0, offline: 0, views: 0, sales: 0 })

        setStats({
          total: computedStats.total,
          draft: computedStats.draft,
          pending: computedStats.pending_review,
          published: computedStats.published,
          views: computedStats.views,
          sales: computedStats.sales
        })
      }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-quicksand text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
                {t.dashboard}
              </h1>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">
                {t.welcome}, {creator?.display_name}
              </p>
            </div>
            <Link href={`/${lang}/createur/ressources/nouvelle`}>
              <Button
                className="text-white font-semibold px-5 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: '#FDBA74' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.newResource}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <Package className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sage)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.total}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalResources}</p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <Eye className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sky)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.views}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalViews}</p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <TrendingUp className="w-8 h-8 mb-2" style={{ color: 'var(--icon-terracotta)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{stats.sales}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalSales}</p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <DollarSign className="w-8 h-8 mb-2" style={{ color: 'var(--icon-sage)' }} />
            <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">
              {((creator?.total_earnings_cents || 0) / 100).toFixed(2)}€
            </p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.totalEarnings}</p>
          </div>
        </motion.div>

        {/* Status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple text-center" style={{ border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold text-foreground dark:text-foreground-dark">{stats.draft}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.draft}</p>
          </div>
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple text-center" style={{ border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold text-terracotta">{stats.pending}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.pending}</p>
          </div>
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-apple text-center" style={{ border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold text-sage">{stats.published}</p>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.published}</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link href={`/${lang}/createur/ressources`}>
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all cursor-pointer" style={{ border: '1px solid var(--border)' }}>
              <FileText className="w-8 h-8 mb-3" style={{ color: 'var(--icon-sage)' }} />
              <h3 className="font-semibold text-foreground dark:text-foreground-dark">{t.myResources}</h3>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{stats.total} ressources</p>
            </div>
          </Link>

          <Link href={`/${lang}/createur/statistiques`}>
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all cursor-pointer" style={{ border: '1px solid var(--border)' }}>
              <TrendingUp className="w-8 h-8 mb-3" style={{ color: 'var(--icon-sky)' }} />
              <h3 className="font-semibold text-foreground dark:text-foreground-dark">{t.stats}</h3>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{stats.views} vues ce mois</p>
            </div>
          </Link>

          <Link href={`/${lang}/createur/parametres`}>
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover hover:-translate-y-1 transition-all cursor-pointer" style={{ border: '1px solid var(--border)' }}>
              <Settings className="w-8 h-8 mb-3" style={{ color: 'var(--icon-terracotta)' }} />
              <h3 className="font-semibold text-foreground dark:text-foreground-dark">{t.settings}</h3>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">Profil & paiements</p>
            </div>
          </Link>
        </motion.div>

        {/* Recent Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-6 md:p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark">
              {t.recentResources}
            </h2>
            <Link href={`/${lang}/createur/ressources`}>
              <Button variant="ghost" size="sm" className="text-sage">
                {t.viewAll}
              </Button>
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-foreground/20 dark:text-foreground-dark/20 mx-auto mb-4" />
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.noResources}</p>
              <Link href={`/${lang}/createur/ressources/nouvelle`}>
                <Button
                  className="text-white font-semibold px-6 py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: '#B794C0' }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t.createFirst}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors"
                >
                  <Link href={`/${lang}/activites/${resource.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-surface-secondary dark:bg-surface-dark flex items-center justify-center overflow-hidden flex-shrink-0">
                      {resource.preview_image_url ? (
                        <img
                          src={resource.preview_image_url}
                          alt={resource.title_fr}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-6 h-6 text-foreground/40 dark:text-foreground-dark/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground dark:text-foreground-dark truncate">
                        {resource.title_fr}
                      </h3>
                      <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                        {resource.price_credits} {t.credits} • {resource.views_count} vues
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      resource.status === 'published'
                        ? 'bg-sage/20 text-sage'
                        : resource.status === 'pending_review'
                        ? 'bg-terracotta/20 text-terracotta'
                        : 'bg-foreground/10 dark:bg-foreground-dark/10 text-foreground-secondary dark:text-foreground-dark-secondary'
                    }`}>
                      {resource.status === 'published' ? t.published :
                       resource.status === 'pending_review' ? t.pending : t.draft}
                    </span>
                    <Link href={`/${lang}/createur/ressources/${resource.id}/modifier`}>
                      <Button variant="ghost" size="sm" className="text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
