'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Gift, Settings, Users, Loader2, ArrowRight, Coins } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Gestion des crédits',
    subtitle: 'Codes promo, attribution manuelle et configuration',
    promoCodes: 'Codes promo',
    promoDesc: 'Créer et gérer les codes promotionnels',
    grant: 'Attribution manuelle',
    grantDesc: 'Attribuer des crédits à un utilisateur',
    settings: 'Configuration',
    settingsDesc: 'Bonus inscription et bonus achat',
    stats: 'Statistiques',
    totalFreeDistributed: 'Crédits gratuits distribués',
    totalPromoUsed: 'Codes promo utilisés',
    activePromoCodes: 'Codes actifs',
    loading: 'Chargement...'
  },
  en: {
    title: 'Credits management',
    subtitle: 'Promo codes, manual grants and settings',
    promoCodes: 'Promo codes',
    promoDesc: 'Create and manage promotional codes',
    grant: 'Manual grant',
    grantDesc: 'Grant credits to a user',
    settings: 'Settings',
    settingsDesc: 'Registration bonus and purchase bonus',
    stats: 'Statistics',
    totalFreeDistributed: 'Free credits distributed',
    totalPromoUsed: 'Promo codes used',
    activePromoCodes: 'Active codes',
    loading: 'Loading...'
  },
  es: {
    title: 'Gestión de créditos',
    subtitle: 'Códigos promo, asignación manual y configuración',
    promoCodes: 'Códigos promo',
    promoDesc: 'Crear y gestionar códigos promocionales',
    grant: 'Asignación manual',
    grantDesc: 'Asignar créditos a un usuario',
    settings: 'Configuración',
    settingsDesc: 'Bono de registro y bono de compra',
    stats: 'Estadísticas',
    totalFreeDistributed: 'Créditos gratis distribuidos',
    totalPromoUsed: 'Códigos promo usados',
    activePromoCodes: 'Códigos activos',
    loading: 'Cargando...'
  }
}

export default function AdminCreditsPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFreeDistributed: 0,
    totalPromoUsed: 0,
    activePromoCodes: 0
  })

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push(`/${lang}`)
        return
      }

      // Charger les stats
      const { data: promoCodes } = await supabase
        .from('promo_codes')
        .select('current_uses, is_active')

      if (promoCodes) {
        setStats({
          totalFreeDistributed: promoCodes.reduce((sum, c) => sum + (c.current_uses || 0), 0),
          totalPromoUsed: promoCodes.reduce((sum, c) => sum + (c.current_uses || 0), 0),
          activePromoCodes: promoCodes.filter(c => c.is_active).length
        })
      }

      setLoading(false)
    }

    checkAdminAndLoadData()
  }, [lang, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sage mx-auto mb-4" />
          <p className="text-foreground-secondary">{t.loading}</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      href: `/${lang}/admin/credits/promo-codes`,
      icon: Ticket,
      title: t.promoCodes,
      description: t.promoDesc,
      color: 'bg-terracotta'
    },
    {
      href: `/${lang}/admin/credits/grant`,
      icon: Gift,
      title: t.grant,
      description: t.grantDesc,
      color: 'bg-green-500'
    },
    {
      href: `/${lang}/admin/credits/settings`,
      icon: Settings,
      title: t.settings,
      description: t.settingsDesc,
      color: 'bg-mauve'
    }
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
            <Coins className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-foreground dark:text-foreground-dark">{stats.totalFreeDistributed}</p>
            <p className="text-xs text-foreground-secondary">{t.totalFreeDistributed}</p>
          </div>
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
            <Users className="w-6 h-6 mx-auto mb-2 text-terracotta" />
            <p className="text-2xl font-bold text-foreground dark:text-foreground-dark">{stats.totalPromoUsed}</p>
            <p className="text-xs text-foreground-secondary">{t.totalPromoUsed}</p>
          </div>
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
            <Ticket className="w-6 h-6 mx-auto mb-2 text-mauve" />
            <p className="text-2xl font-bold text-foreground dark:text-foreground-dark">{stats.activePromoCodes}</p>
            <p className="text-xs text-foreground-secondary">{t.activePromoCodes}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 bg-surface dark:bg-surface-dark rounded-xl p-4 hover:shadow-lg transition-shadow"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className={`${item.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground dark:text-foreground-dark">{item.title}</h3>
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{item.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground-secondary" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
