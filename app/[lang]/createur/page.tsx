'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus, Package, TrendingUp, DollarSign, Eye, Settings,
  Pencil, Trash2, Loader2, Camera, X, Check,
  LayoutTemplate, Search, ArrowLeft, ChevronRight,
  Instagram, Globe, Download,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import type { Language, Creator, Resource } from '@/lib/types'
import { ChartCard } from '@/components/charts/ChartCard'
import { SparklineChart } from '@/components/charts/SparklineChart'
import { SalesLineChart } from '@/components/charts/SalesLineChart'
import { RevenueBarChart } from '@/components/charts/RevenueBarChart'
import { RevenueDonutChart } from '@/components/charts/RevenueDonutChart'
import type { DonutSlice } from '@/components/charts/RevenueDonutChart'
import { TopResourcesChart } from '@/components/charts/TopResourcesChart'
import { useChartColors } from '@/components/charts/chartTheme'
import { exportToExcel } from '@/components/charts/exportData'

const SUGGESTED_THEMES = [
  'Montessori', 'Waldorf', 'Nature', 'DIY', 'Motricité', 'Langage',
  'Mathématiques', 'Créativité', 'Musique', 'Éveil sensoriel', 'Autonomie',
  'Arts plastiques', 'Lecture', 'Sciences', 'Plein air', 'Jeu libre',
  'Cuisine', 'Jardinage', 'Émotions', 'Vivre ensemble',
]

const translations = {
  fr: {
    dashboard: 'Mon espace créateur',
    newResource: 'Nouvelle',
    editPage: 'Éditer ma page',
    viewPublic: 'Voir ma page',
    editProfile: 'Modifier le profil',
    settings: 'Paramètres',
    published: 'Publiées',
    totalViews: 'Vues',
    totalSales: 'Ventes',
    totalEarnings: 'Gains',
    draft: 'Brouillon',
    pending: 'En attente',
    rejected: 'Refusée',
    offline: 'Hors ligne',
    allResources: 'Toutes',
    myResources: 'Mes ressources',
    noResources: 'Aucune ressource',
    createFirst: 'Première ressource',
    credits: 'crédits',
    confirmDelete: 'Supprimer cette ressource ?',
    views: 'vues',
    sales: 'ventes',
    earnings: 'gains',
    editProfileTitle: 'Modifier le profil',
    displayName: 'Nom d\'affichage',
    bio: 'Bio',
    bioPlaceholder: 'Présentez-vous...',
    themesLabel: 'Thèmes (max 8)',
    themesPlaceholder: 'Autre thème...',
    themesAdd: 'Ajouter',
    saveProfile: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Enregistré !',
    searchPlaceholder: 'Rechercher...',
    commission: 'commission',
    performance: 'Mes statistiques',
    backOverview: 'Vue d\'ensemble',
    conversionRate: 'Conversion',
    selectResource: 'Cliquez une ressource pour filtrer les stats',
    detailViews: 'Classement par vues',
    detailSales: 'Évolution des ventes',
    detailEarnings: 'Évolution des revenus',
    detailCatalog: 'État du catalogue',
    noPublished: 'Publiez votre première ressource pour voir les stats ici',
    rankOf: 'sur',
    period7d: '7j',
    period30d: '30j',
    period90d: '90j',
    periodAll: 'Tout',
    exportExcel: 'Exporter',
    noData: 'Données cumulées — pas de séries temporelles',
  },
  en: {
    dashboard: 'My creator space',
    newResource: 'New',
    editPage: 'Edit my page',
    viewPublic: 'View my page',
    editProfile: 'Edit profile',
    settings: 'Settings',
    published: 'Published',
    totalViews: 'Views',
    totalSales: 'Sales',
    totalEarnings: 'Earnings',
    draft: 'Draft',
    pending: 'Pending',
    rejected: 'Rejected',
    offline: 'Offline',
    allResources: 'All',
    myResources: 'My resources',
    noResources: 'No resources',
    createFirst: 'First resource',
    credits: 'credits',
    confirmDelete: 'Delete this resource?',
    views: 'views',
    sales: 'sales',
    earnings: 'earnings',
    editProfileTitle: 'Edit profile',
    displayName: 'Display name',
    bio: 'Bio',
    bioPlaceholder: 'Introduce yourself...',
    themesLabel: 'Themes (max 8)',
    themesPlaceholder: 'Other theme...',
    themesAdd: 'Add',
    saveProfile: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    searchPlaceholder: 'Search...',
    commission: 'commission',
    performance: 'My statistics',
    backOverview: 'Overview',
    conversionRate: 'Conversion',
    selectResource: 'Click a resource to filter stats',
    detailViews: 'Ranked by views',
    detailSales: 'Sales over time',
    detailEarnings: 'Revenue over time',
    detailCatalog: 'Catalog status',
    noPublished: 'Publish your first resource to see stats here',
    rankOf: 'of',
    period7d: '7d',
    period30d: '30d',
    period90d: '90d',
    periodAll: 'All',
    exportExcel: 'Export',
    noData: 'Cumulative data — no time series',
  },
  es: {
    dashboard: 'Mi espacio creador',
    newResource: 'Nueva',
    editPage: 'Editar mi página',
    viewPublic: 'Ver mi página',
    editProfile: 'Editar perfil',
    settings: 'Configuración',
    published: 'Publicadas',
    totalViews: 'Vistas',
    totalSales: 'Ventas',
    totalEarnings: 'Ganancias',
    draft: 'Borrador',
    pending: 'Pendiente',
    rejected: 'Rechazada',
    offline: 'Sin conexión',
    allResources: 'Todas',
    myResources: 'Mis recursos',
    noResources: 'Sin recursos',
    createFirst: 'Primer recurso',
    credits: 'créditos',
    confirmDelete: '¿Eliminar este recurso?',
    views: 'vistas',
    sales: 'ventas',
    earnings: 'ganancias',
    editProfileTitle: 'Editar perfil',
    displayName: 'Nombre visible',
    bio: 'Bio',
    bioPlaceholder: 'Preséntate...',
    themesLabel: 'Temas (máx 8)',
    themesPlaceholder: 'Otro tema...',
    themesAdd: 'Agregar',
    saveProfile: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    searchPlaceholder: 'Buscar...',
    commission: 'comisión',
    performance: 'Mis estadísticas',
    backOverview: 'Vista general',
    conversionRate: 'Conversión',
    selectResource: 'Selecciona un recurso para filtrar',
    detailViews: 'Clasificado por vistas',
    detailSales: 'Ventas en el tiempo',
    detailEarnings: 'Ingresos en el tiempo',
    detailCatalog: 'Estado del catálogo',
    noPublished: 'Publica tu primer recurso para ver estadísticas',
    rankOf: 'de',
    period7d: '7d',
    period30d: '30d',
    period90d: '90d',
    periodAll: 'Todo',
    exportExcel: 'Exportar',
    noData: 'Datos acumulados — sin series temporales',
  },
}

type StatusFilter = 'all' | 'published' | 'draft' | 'pending_review' | 'rejected' | 'offline'
type PerfView = 'bento' | 'detail'
type DetailMetric = 'views' | 'sales' | 'earnings' | 'catalog'
type Period = '7d' | '30d' | '90d' | 'all'

interface SaleTransaction {
  created_at: string
  credits_amount: number
  price_eur_cents: number
  related_ressource_id: string | null
}

interface DayData {
  date: string
  value: number
}

// ─── Data utilities ───────────────────────────────────────────────────────────

function periodStart(period: Period): Date | null {
  if (period === 'all') return null
  const d = new Date()
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

function groupByDay(
  transactions: SaleTransaction[],
  mode: 'sales' | 'revenue',
  start: Date | null,
  end: Date = new Date()
): DayData[] {
  const filtered = transactions.filter(t => {
    const d = new Date(t.created_at)
    return !start || d >= start
  })

  const map: Record<string, number> = {}
  for (const t of filtered) {
    const key = t.created_at.slice(0, 10)
    const val = mode === 'sales' ? 1 : (t.price_eur_cents || 0) / 100
    map[key] = (map[key] || 0) + val
  }

  // Fill gaps
  const result: DayData[] = []
  const cursor = new Date(start || (filtered[0]?.created_at ? new Date(filtered[0].created_at) : end))
  cursor.setHours(0, 0, 0, 0)
  const endDay = new Date(end)
  endDay.setHours(23, 59, 59, 999)

  while (cursor <= endDay) {
    const key = cursor.toISOString().slice(0, 10)
    result.push({ date: formatDate(key), value: map[key] || 0 })
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

function buildDonut(
  transactions: SaleTransaction[],
  resources: Resource[],
  mode: 'sales' | 'revenue',
  start: Date | null,
  palette: string[]
): DonutSlice[] {
  const filtered = transactions.filter(t => !start || new Date(t.created_at) >= start)
  const map: Record<string, number> = {}
  for (const t of filtered) {
    if (!t.related_ressource_id) continue
    const val = mode === 'sales' ? 1 : (t.price_eur_cents || 0) / 100
    map[t.related_ressource_id] = (map[t.related_ressource_id] || 0) + val
  }
  const sorted = Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const top5Total = sorted.reduce((s, [, v]) => s + v, 0)
  const totalAll = Object.values(map).reduce((s, v) => s + v, 0)
  const others = totalAll - top5Total

  const slices: DonutSlice[] = sorted.map(([id, value], i) => ({
    name: resources.find(r => r.id === id)?.title_fr || id.slice(0, 8),
    value,
    color: palette[i % palette.length],
  }))

  if (others > 0.01) {
    slices.push({ name: 'Autres', value: others, color: '#B0B0B0' })
  }
  return slices
}

function sparklineLast7(transactions: SaleTransaction[], mode: 'sales' | 'revenue'): number[] {
  const now = new Date()
  const result: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const val = transactions
      .filter(t => t.created_at.startsWith(key))
      .reduce((s, t) => s + (mode === 'sales' ? 1 : (t.price_eur_cents || 0) / 100), 0)
    result.push(val)
  }
  return result
}

// ─── Horizontal bar chart (CSS-only, kept for bento compact view) ─────────────

function HorizBars({ items, color }: {
  items: Array<{ label: string; value: number; sub?: string }>
  color: string
}) {
  const max = Math.max(...items.map(i => i.value), 1)
  if (items.length === 0) {
    return <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary py-4 text-center italic">Aucune donnée</p>
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-foreground dark:text-foreground-dark truncate max-w-[140px]">{item.label}</span>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {item.sub && <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{item.sub}</span>}
              <span className="text-xs font-bold text-foreground dark:text-foreground-dark">{item.value.toLocaleString()}</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${color} transition-all duration-700`}
              style={{ width: `${Math.round((item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Period selector ──────────────────────────────────────────────────────────

function PeriodSelector({ period, onChange, t }: {
  period: Period
  onChange: (p: Period) => void
  t: typeof translations.fr
}) {
  const options: [Period, string][] = [
    ['7d', t.period7d],
    ['30d', t.period30d],
    ['90d', t.period90d],
    ['all', t.periodAll],
  ]
  return (
    <div className="flex gap-1.5">
      {options.map(([p, label]) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`card-huly-chip text-xs px-3 py-1.5 transition-all cursor-pointer ${period === p
            ? 'bg-sage text-white border-sage/60 shadow-sm'
            : 'hover:bg-white/80 dark:hover:bg-white/10'
            }`}
          style={period === p ? { backgroundColor: 'var(--sage)', borderColor: 'var(--sage)', color: 'white' } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function CreatorDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [salesTransactions, setSalesTransactions] = useState<SaleTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Performance panel state
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)
  const [perfView, setPerfView] = useState<PerfView>('bento')
  const [detailMetric, setDetailMetric] = useState<DetailMetric | null>(null)
  const [period, setPeriod] = useState<Period>('30d')

  // Profile edit panel
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    instagram_handle: '',
    youtube_handle: '',
    tiktok_handle: '',
    website_url: '',
  })
  const [editThemes, setEditThemes] = useState<string[]>([])
  const [customTheme, setCustomTheme] = useState('')

  const colors = useChartColors()

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push(`/${lang}/connexion`); return }

    const { data: creatorData } = await supabase
      .from('creators')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!creatorData) { router.push(`/${lang}/inscription-createur`); return }

    setCreator(creatorData as Creator)
    setEditForm({
      display_name: creatorData.display_name || '',
      bio: creatorData.bio || '',
      instagram_handle: creatorData.instagram_handle || '',
      youtube_handle: creatorData.youtube_handle || '',
      tiktok_handle: creatorData.tiktok_handle || '',
      website_url: creatorData.website_url || '',
    })
    setEditThemes(creatorData.themes || [])

    const { data: resourcesData } = await supabase
      .from('ressources')
      .select('*')
      .eq('creator_id', creatorData.id)
      .order('created_at', { ascending: false })

    const resArray = (resourcesData || []) as Resource[]
    setResources(resArray)

    // Fetch sale transactions
    if (resArray.length > 0) {
      const resourceIds = resArray.map(r => r.id)
      const { data: txData } = await supabase
        .from('credits_transactions')
        .select('created_at, credits_amount, price_eur_cents, related_ressource_id')
        .in('related_ressource_id', resourceIds)
        .eq('type', 'sale_earning')
        .order('created_at', { ascending: true })
      setSalesTransactions((txData || []) as SaleTransaction[])
    }

    setIsLoading(false)
  }, [lang, router])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDeleteResource = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('ressources').delete().eq('id', id)
    setResources(prev => prev.filter(r => r.id !== id))
    if (selectedResourceId === id) setSelectedResourceId(null)
    setDeletingId(null)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const toggleTheme = (theme: string) => {
    if (editThemes.includes(theme)) {
      setEditThemes(prev => prev.filter(t => t !== theme))
    } else if (editThemes.length < 8) {
      setEditThemes(prev => [...prev, theme])
    }
  }

  const addCustomTheme = () => {
    const trimmed = customTheme.trim()
    if (!trimmed || editThemes.includes(trimmed) || editThemes.length >= 8) return
    setEditThemes(prev => [...prev, trimmed])
    setCustomTheme('')
  }

  const handleSaveProfile = async () => {
    if (!creator) return
    setIsSaving(true)
    setSaveStatus('idle')
    const supabase = createClient()

    let avatarUrl = creator.avatar_url
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `avatars/${creator.id}.${ext}`
      await supabase.storage.from('creator-assets').upload(path, avatarFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('creator-assets').getPublicUrl(path)
      avatarUrl = publicUrl
    }

    const { error } = await supabase
      .from('creators')
      .update({
        display_name: editForm.display_name,
        bio: editForm.bio || null,
        themes: editThemes.length > 0 ? editThemes : null,
        avatar_url: avatarUrl,
        instagram_handle: editForm.instagram_handle || null,
        youtube_handle: editForm.youtube_handle || null,
        tiktok_handle: editForm.tiktok_handle || null,
        website_url: editForm.website_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', creator.id!)

    setIsSaving(false)
    if (error) {
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
      setShowEditPanel(false)
      fetchData()
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  // ─── Computed stats ───────────────────────────────────────────────────────────

  const stats = {
    published: resources.filter(r => r.status === 'published').length,
    draft: resources.filter(r => r.status === 'draft').length,
    pending: resources.filter(r => r.status === 'pending_review').length,
    rejected: resources.filter(r => r.status === 'rejected').length,
    offline: resources.filter(r => r.status === 'offline').length,
    views: resources.reduce((s, r) => s + (r.views_count || 0), 0),
    sales: resources.reduce((s, r) => s + (r.purchases_count || 0), 0),
    earnings: (creator?.total_earnings_cents || 0) / 100,
  }

  const statusCounts: Record<StatusFilter, number> = {
    all: resources.length,
    published: stats.published,
    draft: stats.draft,
    pending_review: stats.pending,
    rejected: stats.rejected,
    offline: stats.offline,
  }

  const filteredResources = resources.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchSearch = !searchQuery || r.title_fr?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-sage/15 text-sage'
      case 'pending_review': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
      case 'draft': return 'bg-foreground/8 dark:bg-foreground-dark/8 text-foreground-secondary dark:text-foreground-dark-secondary'
      case 'rejected': return 'bg-red-500/15 text-red-600 dark:text-red-400'
      default: return 'bg-foreground/8 dark:bg-foreground-dark/8 text-foreground-secondary dark:text-foreground-dark-secondary'
    }
  }

  const statusLabel = (status: string) => ({
    published: t.published, draft: t.draft,
    pending_review: t.pending, rejected: t.rejected, offline: t.offline,
  })[status] || status

  // ─── Performance data ─────────────────────────────────────────────────────────

  const publishedResources = resources.filter(r => r.status === 'published')
  const commRate = (creator?.commission_rate || 90) / 100
  const selectedResource = selectedResourceId
    ? resources.find(r => r.id === selectedResourceId) || null
    : null

  const resourceEarnings = (r: Resource) =>
    ((r.purchases_count || 0) * (r.price_credits || 0) * commRate) / 100

  const displayStats = selectedResource
    ? {
      views: selectedResource.views_count || 0,
      sales: selectedResource.purchases_count || 0,
      earnings: resourceEarnings(selectedResource),
    }
    : { views: stats.views, sales: stats.sales, earnings: stats.earnings }

  const conversionRate = displayStats.views > 0
    ? ((displayStats.sales / displayStats.views) * 100).toFixed(1)
    : '0.0'

  const globalConversionRate = stats.views > 0
    ? ((stats.sales / stats.views) * 100).toFixed(1)
    : '0.0'

  // Bento bar data (top 5 or selected)
  const rankIn = (list: Resource[], getId: (r: Resource) => number, id: string) =>
    [...list].sort((a, b) => getId(b) - getId(a)).findIndex(r => r.id === id) + 1

  const bentoViewsItems = selectedResource
    ? [{ label: selectedResource.title_fr || '—', value: selectedResource.views_count || 0, sub: `#${rankIn(publishedResources, r => r.views_count || 0, selectedResourceId!)} ${t.rankOf} ${publishedResources.length}` }]
    : [...publishedResources].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5).map(r => ({ label: r.title_fr || '—', value: r.views_count || 0 }))

  const bentoSalesItems = selectedResource
    ? [{ label: selectedResource.title_fr || '—', value: selectedResource.purchases_count || 0, sub: `#${rankIn(publishedResources, r => r.purchases_count || 0, selectedResourceId!)} ${t.rankOf} ${publishedResources.length}` }]
    : [...publishedResources].sort((a, b) => (b.purchases_count || 0) - (a.purchases_count || 0)).slice(0, 5).map(r => ({ label: r.title_fr || '—', value: r.purchases_count || 0 }))

  const bentoRevenueItems = selectedResource
    ? [{ label: selectedResource.title_fr || '—', value: parseFloat(resourceEarnings(selectedResource).toFixed(2)), sub: `#${rankIn(publishedResources, r => resourceEarnings(r), selectedResourceId!)} ${t.rankOf} ${publishedResources.length}` }]
    : [...publishedResources].sort((a, b) => resourceEarnings(b) - resourceEarnings(a)).slice(0, 5).map(r => ({ label: r.title_fr || '—', value: parseFloat(resourceEarnings(r).toFixed(2)) }))

  // Sparkline data (7 days)
  const sparklineSales = sparklineLast7(salesTransactions, 'sales')
  const sparklineRevenue = sparklineLast7(salesTransactions, 'revenue')
  // Views flat sparkline (no time-series)
  const sparklineViews = Array(7).fill(0).map((_, i) => i === 6 ? displayStats.views : 0)

  // Detail view — period-filtered data
  const detailStart = periodStart(period)
  const periodTx = detailStart
    ? salesTransactions.filter(t => new Date(t.created_at) >= detailStart)
    : salesTransactions

  const salesDayData = groupByDay(salesTransactions, 'sales', detailStart)
  const revenueDayData = groupByDay(salesTransactions, 'revenue', detailStart)

  const salesDonut = buildDonut(salesTransactions, resources, 'sales', detailStart, colors.palette)
  const revenueDonut = buildDonut(salesTransactions, resources, 'revenue', detailStart, colors.palette)

  // Top resources (views — no period filter available)
  const detailSource = selectedResource ? [selectedResource] : publishedResources
  const topViewsData = [...detailSource]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 8)
    .map(r => ({ id: r.id, name: r.title_fr || '—', value: r.views_count || 0 }))

  // Export handler
  const handleExport = () => {
    const rows = periodTx.map(t => {
      const res = resources.find(r => r.id === t.related_ressource_id)
      return {
        Date: t.created_at.slice(0, 10),
        Ressource: res?.title_fr || t.related_ressource_id || '—',
        Ventes: 1,
        'Revenus (€)': ((t.price_eur_cents || 0) / 100).toFixed(2),
      }
    })
    const suffix = period === 'all' ? 'tout' : period
    exportToExcel(rows, `petit-ilot-revenus-${suffix}`)
  }

  // ─── Loading ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── PROFILE HERO ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 p-5 md:p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-surface-secondary dark:bg-surface-dark-secondary ring-2 ring-surface dark:ring-surface-dark shadow-sm">
                  {creator?.avatar_url ? (
                    <img src={creator.avatar_url} alt={creator.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-quicksand text-xl font-bold text-sage">
                        {creator?.display_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h1 className="font-quicksand text-xl md:text-2xl font-bold text-foreground dark:text-foreground-dark leading-tight">
                      {creator?.display_name}
                    </h1>
                    <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                      petitilot.com/createurs/{creator?.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:ml-auto">
                    <Button gem="amber" variant="outline" size="sm" className="h-8" onClick={() => setShowEditPanel(true)}>
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />{t.editProfile}
                    </Button>
                    <Link href={`/${lang}/createur/page-createur`}>
                      <Button gem="mauve" variant="outline" size="sm" className="h-8 group">
                        <LayoutTemplate className="w-3.5 h-3.5 sm:mr-1.5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">{t.editPage}</span>
                      </Button>
                    </Link>
                    <Link href={`/${lang}/createur/parametres`}>
                      <Button gem="neutral" variant="outline" size="sm" className="h-8 group px-2 text-foreground-secondary hover:text-foreground transition-colors">
                        <Settings className="w-4 h-4 transition-transform group-hover:rotate-45" />
                        <span className="sr-only">{t.settings}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
                {(creator?.bio || (creator?.themes && creator.themes.length > 0)) && (
                  <div className="mt-2.5">
                    {creator?.bio && (
                      <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mb-2 max-w-2xl line-clamp-2">{creator.bio}</p>
                    )}
                    {creator?.themes && creator.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {creator.themes.map(theme => (
                          <span key={theme} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-sage/10 text-sage dark:bg-sage/15">{theme}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── KPI PILLS ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { metric: 'catalog' as DetailMetric, icon: <Package className="w-4 h-4" />, value: stats.published, label: t.published, sub: `${stats.draft} brouillon${stats.draft > 1 ? 's' : ''}`, colorClass: 'bg-sage/10 text-sage' },
            { metric: 'views' as DetailMetric, icon: <Eye className="w-4 h-4" />, value: stats.views.toLocaleString(), label: t.totalViews, sub: 'toutes ressources', colorClass: 'bg-sky-400/10 text-sky-500' },
            { metric: 'sales' as DetailMetric, icon: <TrendingUp className="w-4 h-4" />, value: stats.sales.toLocaleString(), label: t.totalSales, sub: `${globalConversionRate}% conv.`, colorClass: 'bg-terracotta/10 text-terracotta' },
            { metric: 'earnings' as DetailMetric, icon: <DollarSign className="w-4 h-4" />, value: `${stats.earnings.toFixed(2)}€`, label: t.totalEarnings, sub: `${(creator?.commission_rate || 90).toFixed(0)}% ${t.commission}`, colorClass: 'bg-sage/10 text-sage' },
          ].map(kpi => (
            <motion.button
              key={kpi.metric}
              onClick={() => { setDetailMetric(kpi.metric); setPerfView('detail') }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
              className="group card-huly flex items-center gap-3 p-3 text-left cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.colorClass}`}>
                {kpi.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground dark:text-foreground-dark leading-tight">{kpi.value}</p>
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary truncate">{kpi.label}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-foreground-secondary dark:text-foreground-dark-secondary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </motion.div>

        {/* ── MAIN DASHBOARD: Performance (Full Width) + Resources ── */}
        <div className="flex flex-col gap-6">

          {/* ── STATISTICS PANEL ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 flex flex-col"
            style={{ border: '1px solid var(--border)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark flex-shrink-0">
                  {t.performance}
                </h2>
                <AnimatePresence>
                  {selectedResource && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage/10 text-sage text-xs font-medium min-w-0"
                    >
                      <span className="truncate max-w-[160px]">{selectedResource.title_fr}</span>
                      <button onClick={() => setSelectedResourceId(null)} className="flex-shrink-0 hover:opacity-60 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {perfView === 'detail' && (
                <Button
                  gem="neutral"
                  variant="outline"
                  size="sm"
                  onClick={() => setPerfView('bento')}
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  {t.backOverview}
                </Button>
              )}
            </div>

            <div className="p-6 flex-1">
              {/* Empty state */}
              {publishedResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <TrendingUp className="w-14 h-14 text-foreground/15 dark:text-foreground-dark/15 mb-4" />
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary max-w-xs leading-relaxed">
                    {t.noPublished}
                  </p>
                  <Link href={`/${lang}/createur/ressources/nouvelle`} className="mt-4">
                    <Button gem="sage" size="sm">
                      <Plus className="w-4 h-4 mr-1.5" />
                      {t.newResource}
                    </Button>
                  </Link>
                </div>

              ) : perfView === 'bento' ? (
                /* ── BENTO VIEW: 4 columns glass chart cells ─────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Cell: Vues */}
                  <motion.div
                    whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
                    className="card-huly p-4 cursor-pointer"
                    onClick={() => { setDetailMetric('views'); setPerfView('detail') }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">{t.totalViews}</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground dark:text-foreground-dark tabular-nums">
                        {displayStats.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-3">
                      <SparklineChart data={sparklineViews} color={colors.sky} height={40} />
                    </div>
                    <div className="card-glass-body pt-3 pb-0">
                      <HorizBars items={bentoViewsItems} color="bg-sky-400" />
                    </div>
                  </motion.div>

                  {/* Cell: Ventes */}
                  <motion.div
                    whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
                    className="card-huly p-4 cursor-pointer"
                    onClick={() => { setDetailMetric('sales'); setPerfView('detail') }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-terracotta" />
                        <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">{t.totalSales}</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground dark:text-foreground-dark tabular-nums">
                        {displayStats.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-3">
                      <SparklineChart data={sparklineSales} color={colors.terracotta} height={40} />
                    </div>
                    <div className="card-glass-body pt-3 pb-0">
                      <HorizBars items={bentoSalesItems} color="bg-terracotta" />
                    </div>
                  </motion.div>

                  {/* Cell: Gains */}
                  <motion.div
                    whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
                    className="card-huly p-4 cursor-pointer"
                    onClick={() => { setDetailMetric('earnings'); setPerfView('detail') }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-sage" />
                        <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">{t.totalEarnings}</span>
                      </div>
                      <span className="text-2xl font-bold text-sage tabular-nums">
                        {displayStats.earnings.toFixed(2)}€
                      </span>
                    </div>
                    <div className="mb-3">
                      <SparklineChart data={sparklineRevenue} color={colors.sage} height={40} />
                    </div>
                    <div className="card-glass-body pt-3 pb-0">
                      <HorizBars items={bentoRevenueItems} color="bg-sage" />
                    </div>
                  </motion.div>

                  {/* Cell: Catalogue */}
                  <motion.div
                    whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
                    className="card-huly p-4 cursor-pointer"
                    onClick={() => { setDetailMetric('catalog'); setPerfView('detail') }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-foreground-secondary dark:text-foreground-dark-secondary" />
                      <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">Catalogue</span>
                    </div>
                    <div className="card-glass-body">
                      <div className="space-y-2.5 mb-4">
                        {[
                          { label: t.published, count: stats.published, color: 'bg-sage' },
                          { label: t.pending, count: stats.pending, color: 'bg-amber-500' },
                          { label: t.draft, count: stats.draft, color: 'bg-foreground/25 dark:bg-foreground-dark/25' },
                          { label: t.offline, count: stats.offline, color: 'bg-foreground/10 dark:bg-foreground-dark/10' },
                        ].filter(i => i.count > 0).map(item => {
                          const pct = resources.length > 0 ? (item.count / resources.length) * 100 : 0
                          return (
                            <div key={item.label}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{item.label}</span>
                                <span className="text-xs font-medium text-foreground dark:text-foreground-dark">{item.count}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                                <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.conversionRate}</span>
                          <span className="text-xl font-bold text-mauve tabular-nums">{conversionRate}%</span>
                        </div>
                        <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-0.5">vues → ventes</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

              ) : (
                /* ── DETAIL VIEW ──────────────────────────────── */
                <AnimatePresence mode="wait">
                  <motion.div
                    key={detailMetric}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Detail header: title + period selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                      <h3 className="font-quicksand text-base font-bold text-foreground dark:text-foreground-dark">
                        {detailMetric === 'views' && t.detailViews}
                        {detailMetric === 'sales' && t.detailSales}
                        {detailMetric === 'earnings' && t.detailEarnings}
                        {detailMetric === 'catalog' && t.detailCatalog}
                      </h3>
                      {(detailMetric === 'sales' || detailMetric === 'earnings') && (
                        <div className="flex items-center gap-2">
                          <PeriodSelector period={period} onChange={setPeriod} t={t} />
                          {detailMetric === 'earnings' && (
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button gem="neutral" variant="outline" size="sm" onClick={handleExport}>
                                <Download className="w-3.5 h-3.5 mr-1.5" />{t.exportExcel}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>

                    {detailMetric === 'catalog' ? (
                      /* Catalog breakdown */
                      <div className="space-y-6">
                        {(['published', 'pending_review', 'draft', 'rejected', 'offline'] as const).map(status => {
                          const list = resources.filter(r => r.status === status)
                          if (list.length === 0) return null
                          return (
                            <div key={status}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(status)}`}>
                                  {statusLabel(status)}
                                </span>
                                <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                                  {list.length} ressource{list.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {list.map(r => (
                                  <div key={r.id} className="card-huly flex items-center gap-3 p-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface dark:bg-surface-dark flex-shrink-0">
                                      {r.preview_image_url
                                        ? <img src={r.preview_image_url} alt={r.title_fr} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-foreground/20 dark:text-foreground-dark/20" /></div>
                                      }
                                    </div>
                                    <span className="flex-1 text-sm text-foreground dark:text-foreground-dark truncate">{r.title_fr}</span>
                                    <Link href={`/${lang}/createur/ressources/${r.id}/modifier`}>
                                      <Button gem="amber" variant="outline" size="icon" className="h-7 w-7 flex-shrink-0">
                                        <Pencil className="w-3 h-3" />
                                      </Button>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                    ) : detailMetric === 'views' ? (
                      /* Views: horizontal bar chart */
                      <div className="space-y-4">
                        <ChartCard
                          title={t.detailViews}
                          subtitle={t.noData}
                          icon={<Eye className="w-3.5 h-3.5 text-sky-500" />}
                          delay={0.05}
                        >
                          <TopResourcesChart
                            data={topViewsData}
                            color={colors.sky}
                            unit={t.views}
                            onSelect={(id) => { setSelectedResourceId(id); setPerfView('bento') }}
                          />
                        </ChartCard>
                      </div>

                    ) : detailMetric === 'sales' ? (
                      /* Sales: line chart + donut */
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <ChartCard
                            title={t.detailSales}
                            icon={<TrendingUp className="w-3.5 h-3.5 text-terracotta" />}
                            delay={0.05}
                          >
                            {salesDayData.length > 0 ? (
                              <SalesLineChart data={salesDayData} />
                            ) : (
                              <p className="text-xs text-center py-10 text-foreground-secondary dark:text-foreground-dark-secondary italic">Aucune vente sur cette période</p>
                            )}
                          </ChartCard>
                        </div>
                        <ChartCard
                          title="Répartition"
                          icon={<Package className="w-3.5 h-3.5 text-foreground-secondary dark:text-foreground-dark-secondary" />}
                          delay={0.1}
                        >
                          {salesDonut.length > 0 ? (
                            <RevenueDonutChart
                              data={salesDonut}
                              unit={t.sales}
                              onSelect={(name) => {
                                const res = resources.find(r => r.title_fr === name)
                                if (res) { setSelectedResourceId(res.id); setPerfView('bento') }
                              }}
                            />
                          ) : (
                            <p className="text-xs text-center py-10 text-foreground-secondary dark:text-foreground-dark-secondary italic">Aucune donnée</p>
                          )}
                        </ChartCard>
                      </div>

                    ) : detailMetric === 'earnings' ? (
                      /* Earnings: bar chart + donut + export */
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <ChartCard
                            title={t.detailEarnings}
                            icon={<DollarSign className="w-3.5 h-3.5 text-sage" />}
                            delay={0.05}
                          >
                            {revenueDayData.length > 0 ? (
                              <RevenueBarChart data={revenueDayData} />
                            ) : (
                              <p className="text-xs text-center py-10 text-foreground-secondary dark:text-foreground-dark-secondary italic">Aucun revenu sur cette période</p>
                            )}
                          </ChartCard>
                        </div>
                        <ChartCard
                          title="Répartition"
                          icon={<Package className="w-3.5 h-3.5 text-foreground-secondary dark:text-foreground-dark-secondary" />}
                          delay={0.1}
                        >
                          {revenueDonut.length > 0 ? (
                            <RevenueDonutChart
                              data={revenueDonut}
                              unit="€"
                              onSelect={(name) => {
                                const res = resources.find(r => r.title_fr === name)
                                if (res) { setSelectedResourceId(res.id); setPerfView('bento') }
                              }}
                            />
                          ) : (
                            <p className="text-xs text-center py-10 text-foreground-secondary dark:text-foreground-dark-secondary italic">Aucune donnée</p>
                          )}
                        </ChartCard>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* ── RESOURCES LIST ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 flex flex-col"
            style={{ border: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-quicksand text-base font-bold text-foreground dark:text-foreground-dark">
                  {t.myResources}
                </h2>
                <Link href={`/${lang}/createur/ressources/nouvelle`}>
                  <Button gem="sage" size="sm">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    {t.newResource}
                  </Button>
                </Link>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-secondary dark:text-foreground-dark-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-surface-secondary dark:bg-surface-dark-secondary text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              {/* Status filter chips */}
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {(['all', 'published', 'draft', 'pending_review'] as StatusFilter[]).map(s => {
                  const count = statusCounts[s]
                  if (s !== 'all' && count === 0) return null
                  const labels: Record<string, string> = {
                    all: t.allResources, published: t.published,
                    draft: t.draft, pending_review: t.pending,
                  }
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === s
                        ? 'bg-sage text-white'
                        : 'text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'
                        }`}
                    >
                      {labels[s]}
                      <span className={`px-1 py-0.5 rounded text-xs ${statusFilter === s ? 'bg-white/20' : 'bg-foreground/8 dark:bg-foreground-dark/8'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scrollable resource list */}
            <div className="flex-1 overflow-x-auto p-3">
              <div className="min-w-[800px]">
                {filteredResources.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Package className="w-8 h-8 text-foreground/20 dark:text-foreground-dark/20 mb-2" />
                    <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mb-3">{t.noResources}</p>
                    <Link href={`/${lang}/createur/ressources/nouvelle`}>
                      <Button gem="sage" size="sm" variant="outline">
                        <Plus className="w-3 h-3 mr-1" />{t.createFirst}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border" style={{ borderColor: 'var(--border)' }}>
                    {filteredResources.map(resource => {
                      const isSelected = selectedResourceId === resource.id
                      return (
                        <div
                          key={resource.id}
                          onClick={() => {
                            setSelectedResourceId(isSelected ? null : resource.id)
                            if (perfView === 'detail') setPerfView('bento')
                          }}
                          className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                            ? 'bg-sage/10 ring-1 ring-sage/30'
                            : 'hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'
                            }`}
                        >
                          {/* Thumbnail & Info */}
                          <div className="flex items-center gap-3 w-[40%] flex-shrink-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface-secondary dark:bg-surface-dark-secondary flex-shrink-0" style={{ border: '1px solid var(--border)' }}>
                              {resource.preview_image_url
                                ? <img src={resource.preview_image_url} alt={resource.title_fr} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-foreground/20 dark:text-foreground-dark/20" /></div>
                              }
                            </div>
                            <p className="text-sm font-medium text-foreground dark:text-foreground-dark truncate flex-1">{resource.title_fr}</p>
                          </div>

                          {/* Status */}
                          <div className="w-[15%] flex-shrink-0">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeClass(resource.status)}`}>
                              {statusLabel(resource.status)}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                              <Eye className="w-3.5 h-3.5 text-sky-500" />
                              <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary whitespace-nowrap">{(resource.views_count || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                              <TrendingUp className="w-3.5 h-3.5 text-terracotta" />
                              <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary whitespace-nowrap">{(resource.purchases_count || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[80px]">
                              <DollarSign className="w-3.5 h-3.5 text-sage" />
                              <span className="text-sm font-medium text-sage whitespace-nowrap">{resourceEarnings(resource).toFixed(2)}€</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Link href={`/${lang}/createur/ressources/${resource.id}/modifier`} onClick={e => e.stopPropagation()}>
                              <Button gem="amber" variant="outline" size="icon" className="h-8 w-8">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            <Button
                              gem="rose"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={e => { e.stopPropagation(); handleDeleteResource(resource.id) }}
                              disabled={deletingId === resource.id}
                            >
                              {deletingId === resource.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />
                              }
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer hint */}
            {resources.length > 0 && !selectedResourceId && (
              <div className="px-5 py-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary text-center">
                  {t.selectResource}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── PROFILE EDIT SLIDE PANEL ──────────────────────────── */}
      <AnimatePresence>
        {showEditPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditPanel(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-surface dark:bg-surface-dark shadow-2xl z-50 overflow-y-auto"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="sticky top-0 bg-surface dark:bg-surface-dark flex items-center justify-between p-6 border-b z-10" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark">
                  {t.editProfileTitle}
                </h2>
                <button
                  onClick={() => setShowEditPanel(false)}
                  className="p-2 rounded-lg hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-foreground dark:text-foreground-dark" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-full overflow-hidden group cursor-pointer"
                    style={{ border: '2px dashed var(--border)' }}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : creator?.avatar_url ? (
                      <img src={creator.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-secondary dark:bg-surface-dark-secondary">
                        <span className="font-quicksand text-xl font-bold text-sage">
                          {creator?.display_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </button>
                  <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">Cliquez pour changer la photo</p>
                </div>

                {/* Display name */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">{t.displayName}</label>
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                    style={{ border: '1px solid var(--border)' }}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">{t.bio}</label>
                  <textarea
                    value={editForm.bio}
                    onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder={t.bioPlaceholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none resize-none focus:ring-2 focus:ring-sage/30"
                    style={{ border: '1px solid var(--border)' }}
                  />
                </div>

                {/* Themes */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">{t.themesLabel}</label>
                  {editThemes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editThemes.map(theme => (
                        <span key={theme} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sage/20 text-sage">
                          {theme}
                          <button type="button" onClick={() => toggleTheme(theme)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {SUGGESTED_THEMES.filter(th => !editThemes.includes(th)).map(theme => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => toggleTheme(theme)}
                        disabled={editThemes.length >= 8}
                        className="px-2.5 py-1 rounded-full text-xs transition-colors hover:bg-sage/10 hover:border-sage disabled:opacity-40 text-foreground dark:text-foreground-dark"
                        style={{ border: '1px solid var(--border)' }}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                  {editThemes.length < 8 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTheme}
                        onChange={e => setCustomTheme(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTheme())}
                        placeholder={t.themesPlaceholder}
                        className="flex-1 px-3 py-2 rounded-lg text-xs bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                        style={{ border: '1px solid var(--border)' }}
                      />
                      <Button type="button" gem="sage" variant="outline" size="sm" onClick={addCustomTheme}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Social links */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-3">Réseaux sociaux</label>
                  <div className="space-y-3">
                    {[
                      { key: 'instagram_handle', icon: <Instagram className="w-4 h-4" />, placeholder: '@votre_compte' },
                      { key: 'youtube_handle', icon: <span className="text-xs font-bold">YT</span>, placeholder: '@votre_chaine' },
                      { key: 'tiktok_handle', icon: <span className="text-xs font-bold">TK</span>, placeholder: '@votre_compte' },
                      { key: 'website_url', icon: <Globe className="w-4 h-4" />, placeholder: 'https://votre-site.com' },
                    ].map(({ key, icon, placeholder }) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-8 text-foreground-secondary dark:text-foreground-dark-secondary flex justify-center flex-shrink-0">{icon}</span>
                        <input
                          type="text"
                          value={editForm[key as keyof typeof editForm]}
                          onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="flex-1 px-3 py-2 rounded-lg text-sm bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                          style={{ border: '1px solid var(--border)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <Button type="button" gem="sage" className="w-full" disabled={isSaving} onClick={handleSaveProfile}>
                  {isSaving
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.saving}</>
                    : saveStatus === 'saved'
                      ? <><Check className="w-4 h-4 mr-2" />{t.saved}</>
                      : t.saveProfile
                  }
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
