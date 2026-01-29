'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Coins, Sparkles, Star, Crown, Loader2, History, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Mes crédits',
    subtitle: 'Achetez des crédits pour débloquer des ressources',
    balance: 'Solde actuel',
    credits: 'crédits',
    buyCredits: 'Acheter des crédits',
    popular: 'Populaire',
    bestValue: 'Meilleur rapport',
    buy: 'Acheter',
    history: 'Historique des transactions',
    noHistory: 'Aucune transaction',
    loading: 'Chargement...',
    processing: 'Redirection...',
    purchase: 'Achat crédits',
    spent: 'Achat ressource',
    sale_earning: 'Vente ressource',
    refund: 'Remboursement',
    bonus: 'Bonus',
    paymentSuccess: 'Paiement réussi ! Vos crédits ont été ajoutés.',
    paymentCanceled: 'Paiement annulé.'
  },
  en: {
    title: 'My credits',
    subtitle: 'Buy credits to unlock resources',
    balance: 'Current balance',
    credits: 'credits',
    buyCredits: 'Buy credits',
    popular: 'Popular',
    bestValue: 'Best value',
    buy: 'Buy',
    history: 'Transaction history',
    noHistory: 'No transactions',
    loading: 'Loading...',
    processing: 'Redirecting...',
    purchase: 'Credits purchase',
    spent: 'Resource purchase',
    sale_earning: 'Resource sale',
    refund: 'Refund',
    bonus: 'Bonus',
    paymentSuccess: 'Payment successful! Your credits have been added.',
    paymentCanceled: 'Payment canceled.'
  },
  es: {
    title: 'Mis créditos',
    subtitle: 'Compra créditos para desbloquear recursos',
    balance: 'Saldo actual',
    credits: 'créditos',
    buyCredits: 'Comprar créditos',
    popular: 'Popular',
    bestValue: 'Mejor valor',
    buy: 'Comprar',
    history: 'Historial de transacciones',
    noHistory: 'Sin transacciones',
    loading: 'Cargando...',
    processing: 'Redirigiendo...',
    purchase: 'Compra de créditos',
    spent: 'Compra de recurso',
    sale_earning: 'Venta de recurso',
    refund: 'Reembolso',
    bonus: 'Bono',
    paymentSuccess: '¡Pago exitoso! Tus créditos han sido agregados.',
    paymentCanceled: 'Pago cancelado.'
  }
}

const creditPacks = [
  {
    id: 'pack_5',
    credits: 5,
    price: 499, // centimes
    priceDisplay: '4,99 €',
    icon: Coins,
    color: 'from-[#A8B5A0] to-[#8fa087]'
  },
  {
    id: 'pack_15',
    credits: 15,
    price: 1199,
    priceDisplay: '11,99 €',
    icon: Sparkles,
    color: 'from-[#C8D8E4] to-[#a8c4d4]',
    badge: 'popular'
  },
  {
    id: 'pack_30',
    credits: 30,
    price: 1999,
    priceDisplay: '19,99 €',
    icon: Star,
    color: 'from-[#D4A59A] to-[#c4958a]'
  },
  {
    id: 'pack_60',
    credits: 60,
    price: 3499,
    priceDisplay: '34,99 €',
    icon: Crown,
    color: 'from-[#5D5A4E] to-[#4a4840]',
    badge: 'bestValue'
  }
]

interface Transaction {
  id: string
  type: string
  credits_amount: number
  description: string | null
  created_at: string
}

function CreditsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [processingPack, setProcessingPack] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCanceled, setShowCanceled] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true)
      setTimeout(() => setShowCanceled(false), 5000)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Récupérer le solde
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits_balance')
          .eq('id', user.id)
          .single()

        if (profile) {
          setBalance(profile.credits_balance || 0)
        }

        // Récupérer l'historique
        const { data: history } = await supabase
          .from('credits_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (history) {
          setTransactions(history)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleBuyPack = async (packId: string) => {
    setProcessingPack(packId)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack_id: packId, lang })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setProcessingPack(null)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setProcessingPack(null)
    }
  }

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = {
      purchase: t.purchase,
      spent: t.spent,
      sale_earning: t.sale_earning,
      refund: t.refund,
      bonus: t.bonus
    }
    return labels[type] || type
  }

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
      {/* Toast Success */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          {t.paymentSuccess}
        </div>
      )}

      {/* Toast Canceled */}
      {showCanceled && (
        <div className="fixed top-4 right-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <XCircle className="w-5 h-5" />
          {t.paymentCanceled}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
        </div>

        {/* Balance Card */}
        <div
          className="bg-surface dark:bg-surface-dark rounded-3xl p-8 text-center mb-10 shadow-apple"
          style={{ border: '1px solid var(--border)' }}
        >
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide text-sm">{t.balance}</p>
          <p className="text-5xl font-bold mt-2 text-foreground dark:text-foreground-dark">
            {balance}
            <span className="text-2xl font-normal ml-2 text-sage">{t.credits}</span>
          </p>
        </div>

        {/* Credit Packs */}
        <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-6">{t.buyCredits}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {creditPacks.map(pack => {
            const Icon = pack.icon
            return (
              <div
                key={pack.id}
                className="relative bg-surface dark:bg-surface-dark rounded-2xl shadow-apple overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                {pack.badge && (
                  <div className="absolute top-0 right-0 bg-terracotta text-white text-xs px-2 py-1 rounded-bl-lg">
                    {t[pack.badge as keyof typeof t]}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pack.color} p-6 text-white text-center`}>
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{pack.credits}</p>
                  <p className="text-sm opacity-80">{t.credits}</p>
                </div>
                <div className="p-4">
                  <p className="text-center text-lg font-semibold text-foreground dark:text-foreground-dark mb-3">
                    {pack.priceDisplay}
                  </p>
                  <Button
                    onClick={() => handleBuyPack(pack.id)}
                    disabled={processingPack !== null}
                    className="w-full bg-foreground dark:bg-foreground-dark hover:bg-foreground/90 dark:hover:bg-foreground-dark/90 text-surface dark:text-surface-dark"
                  >
                    {processingPack === pack.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      t.buy
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transaction History */}
        <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
            <History className="w-5 h-5" style={{ color: 'var(--icon-neutral)' }} />
            {t.history}
          </h2>
          {transactions.length === 0 ? (
            <p className="text-center text-foreground-secondary dark:text-foreground-dark-secondary py-8">{t.noHistory}</p>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 last:border-0"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div>
                    <p className="font-medium text-foreground dark:text-foreground-dark">
                      {getTransactionLabel(tx.type)}
                    </p>
                    <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                      {new Date(tx.created_at).toLocaleDateString(lang, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className={`font-semibold ${tx.credits_amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.credits_amount > 0 ? '+' : ''}{tx.credits_amount} {t.credits}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreditsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage" />
      </div>
    }>
      <CreditsContent />
    </Suspense>
  )
}
