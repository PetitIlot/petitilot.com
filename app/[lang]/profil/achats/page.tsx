'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Download, Package, Calendar, CreditCard, ExternalLink, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Mes achats',
    subtitle: 'Retrouvez toutes vos ressources achetées',
    noPurchases: 'Aucun achat',
    noPurchasesDesc: 'Explorez notre catalogue pour trouver des ressources',
    explore: 'Explorer les ressources',
    download: 'Télécharger',
    view: 'Voir',
    purchasedOn: 'Acheté le',
    credits: 'crédits',
    totalSpent: 'Total dépensé',
    loading: 'Chargement...'
  },
  en: {
    title: 'My purchases',
    subtitle: 'Find all your purchased resources',
    noPurchases: 'No purchases',
    noPurchasesDesc: 'Explore our catalog to find resources',
    explore: 'Explore resources',
    download: 'Download',
    view: 'View',
    purchasedOn: 'Purchased on',
    credits: 'credits',
    totalSpent: 'Total spent',
    loading: 'Loading...'
  },
  es: {
    title: 'Mis compras',
    subtitle: 'Encuentra todos tus recursos comprados',
    noPurchases: 'Sin compras',
    noPurchasesDesc: 'Explora nuestro catálogo para encontrar recursos',
    explore: 'Explorar recursos',
    download: 'Descargar',
    view: 'Ver',
    purchasedOn: 'Comprado el',
    credits: 'créditos',
    totalSpent: 'Total gastado',
    loading: 'Cargando...'
  }
}

interface Purchase {
  purchase_id: string
  ressource_id: string
  ressource_title: string
  ressource_type: string
  ressource_vignette: string | null
  ressource_pdf: string | null
  credits_spent: number
  purchased_at: string
}

function DownloadButton({ ressourceId, label }: { ressourceId: string; label: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/download?ressource_id=${ressourceId}`)
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="bg-sage hover:bg-sage-light text-white"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
      {label}
    </Button>
  )
}

export default function PurchasesPage() {
  const params = useParams()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    const fetchPurchases = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase.rpc('get_user_purchases', {
          p_user_id: user.id
        })

        if (!error && data) {
          setPurchases(data)
          setTotalSpent(data.reduce((sum: number, p: Purchase) => sum + p.credits_spent, 0))
        }
      }
      setLoading(false)
    }

    fetchPurchases()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4" />
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
          </div>
          {purchases.length > 0 && (
            <div className="bg-surface dark:bg-surface-dark rounded-2xl px-6 py-4 shadow-apple" style={{ border: '1px solid var(--border)' }}>
              <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide">{t.totalSpent}</p>
              <p className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                {totalSpent} <span className="text-sm font-normal">{t.credits}</span>
              </p>
            </div>
          )}
        </div>

        {/* Purchases List */}
        {purchases.length === 0 ? (
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-12 text-center" style={{ border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 bg-surface-secondary dark:bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-foreground/40 dark:text-foreground-dark/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">{t.noPurchases}</h2>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">{t.noPurchasesDesc}</p>
            <Link href={`/${lang}/activites`}>
              <Button className="bg-sage hover:bg-sage-light text-white">
                {t.explore}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map(purchase => (
              <div
                key={purchase.purchase_id}
                className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-4 flex items-center gap-4"
                style={{ border: '1px solid var(--border)' }}
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-surface-secondary dark:bg-surface-dark overflow-hidden flex-shrink-0">
                  {purchase.ressource_vignette ? (
                    <img
                      src={purchase.ressource_vignette}
                      alt={purchase.ressource_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-foreground/20 dark:text-foreground-dark/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground dark:text-foreground-dark truncate">
                    {purchase.ressource_title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(purchase.purchased_at).toLocaleDateString(lang)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      {purchase.credits_spent} {t.credits}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/${lang}/${purchase.ressource_type}s/${purchase.ressource_id}`}>
                    <Button variant="outline" size="sm" style={{ border: '1px solid var(--border)' }}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      {t.view}
                    </Button>
                  </Link>
                  {purchase.ressource_pdf && (
                    <DownloadButton ressourceId={purchase.ressource_id} label={t.download} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
