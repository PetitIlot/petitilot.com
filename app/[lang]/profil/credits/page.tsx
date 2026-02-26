'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Coins, Sparkles, Star, Crown, Loader2, History, CheckCircle, XCircle, Gift, Ticket, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Language, CreditBreakdown, CreditsTransaction } from '@/lib/types'

const translations = {
  fr: {
    back: 'Retour',
    title: 'Mes crédits',
    subtitle: 'Achetez des crédits pour débloquer des ressources',
    freeCredits: 'Crédits gratuits',
    paidCredits: 'Crédits payants',
    total: 'Total',
    credits: 'crédits',
    noValue: 'Sans valeur €',
    buyCredits: 'Acheter des crédits',
    popular: 'Populaire',
    bestValue: 'Meilleur rapport',
    buy: 'Acheter',
    bonus: 'BONUS',
    freeBonus: 'gratuits',
    promoCode: 'Code promo',
    promoPlaceholder: 'Entrez votre code',
    applyCode: 'Appliquer',
    history: 'Historique des transactions',
    noHistory: 'Aucune transaction',
    loading: 'Chargement...',
    processing: 'Redirection...',
    applying: 'Application...',
    purchase: 'Achat crédits',
    spent: 'Achat ressource',
    sale_earning: 'Vente ressource',
    refund: 'Remboursement',
    registration_bonus: 'Bonus inscription',
    promo_code: 'Code promo',
    purchase_bonus: 'Bonus achat',
    admin_grant: 'Attribution admin',
    paymentSuccess: 'Paiement réussi ! Vos crédits ont été ajoutés.',
    paymentCanceled: 'Paiement annulé.',
    promoSuccess: 'Code appliqué !',
    promoError: 'Code invalide ou expiré',
    free: 'gratuit',
    paid: 'payant',
    mixed: 'mixte'
  },
  en: {
    back: 'Back',
    title: 'My credits',
    subtitle: 'Buy credits to unlock resources',
    freeCredits: 'Free credits',
    paidCredits: 'Paid credits',
    total: 'Total',
    credits: 'credits',
    noValue: 'No € value',
    buyCredits: 'Buy credits',
    popular: 'Popular',
    bestValue: 'Best value',
    buy: 'Buy',
    bonus: 'BONUS',
    freeBonus: 'free',
    promoCode: 'Promo code',
    promoPlaceholder: 'Enter your code',
    applyCode: 'Apply',
    history: 'Transaction history',
    noHistory: 'No transactions',
    loading: 'Loading...',
    processing: 'Redirecting...',
    applying: 'Applying...',
    purchase: 'Credits purchase',
    spent: 'Resource purchase',
    sale_earning: 'Resource sale',
    refund: 'Refund',
    registration_bonus: 'Registration bonus',
    promo_code: 'Promo code',
    purchase_bonus: 'Purchase bonus',
    admin_grant: 'Admin grant',
    paymentSuccess: 'Payment successful! Your credits have been added.',
    paymentCanceled: 'Payment canceled.',
    promoSuccess: 'Code applied!',
    promoError: 'Invalid or expired code',
    free: 'free',
    paid: 'paid',
    mixed: 'mixed'
  },
  es: {
    back: 'Volver',
    title: 'Mis créditos',
    subtitle: 'Compra créditos para desbloquear recursos',
    freeCredits: 'Créditos gratis',
    paidCredits: 'Créditos pagados',
    total: 'Total',
    credits: 'créditos',
    noValue: 'Sin valor €',
    buyCredits: 'Comprar créditos',
    popular: 'Popular',
    bestValue: 'Mejor valor',
    buy: 'Comprar',
    bonus: 'BONUS',
    freeBonus: 'gratis',
    promoCode: 'Código promo',
    promoPlaceholder: 'Ingresa tu código',
    applyCode: 'Aplicar',
    history: 'Historial de transacciones',
    noHistory: 'Sin transacciones',
    loading: 'Cargando...',
    processing: 'Redirigiendo...',
    applying: 'Aplicando...',
    purchase: 'Compra de créditos',
    spent: 'Compra de recurso',
    sale_earning: 'Venta de recurso',
    refund: 'Reembolso',
    registration_bonus: 'Bono de registro',
    promo_code: 'Código promo',
    purchase_bonus: 'Bono de compra',
    admin_grant: 'Asignación admin',
    paymentSuccess: '¡Pago exitoso! Tus créditos han sido agregados.',
    paymentCanceled: 'Pago cancelado.',
    promoSuccess: '¡Código aplicado!',
    promoError: 'Código inválido o expirado',
    free: 'gratis',
    paid: 'pagado',
    mixed: 'mixto'
  }
}

// Packs de crédits avec bonus
const creditPacks = [
  {
    id: 'pack_5',
    credits: 5,
    price: 499,
    priceDisplay: '4,99 €',
    bonusFree: 0,
    icon: Coins,
    color: 'from-[#A8B5A0] to-[#8fa087]'
  },
  {
    id: 'pack_15',
    credits: 15,
    price: 1199,
    priceDisplay: '11,99 €',
    bonusFree: 0,
    icon: Sparkles,
    color: 'from-[#C8D8E4] to-[#a8c4d4]',
    badge: 'popular'
  },
  {
    id: 'pack_30',
    credits: 30,
    price: 1999,
    priceDisplay: '19,99 €',
    bonusFree: 5,
    icon: Star,
    color: 'from-[#D4A59A] to-[#c4958a]'
  },
  {
    id: 'pack_60',
    credits: 60,
    price: 3499,
    priceDisplay: '34,99 €',
    bonusFree: 15,
    icon: Crown,
    color: 'from-[#5D5A4E] to-[#4a4840]',
    badge: 'bestValue'
  }
]

function CreditsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [breakdown, setBreakdown] = useState<CreditBreakdown>({
    free_balance: 0,
    paid_balance: 0,
    total_balance: 0,
    paid_total_value_cents: 0,
    paid_avg_unit_value_cents: 0
  })
  const [transactions, setTransactions] = useState<CreditsTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [processingPack, setProcessingPack] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
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

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Récupérer le breakdown complet
      const { data: profile } = await supabase
        .from('profiles')
        .select('free_credits_balance, paid_credits_balance, credits_balance')
        .eq('id', user.id)
        .single()

      if (profile) {
        setBreakdown({
          free_balance: profile.free_credits_balance || 0,
          paid_balance: profile.paid_credits_balance || 0,
          total_balance: profile.credits_balance || 0,
          paid_total_value_cents: 0,
          paid_avg_unit_value_cents: 0
        })
      }

      // Récupérer l'historique
      const { data: history } = await supabase
        .from('credits_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (history) {
        setTransactions(history as CreditsTransaction[])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
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

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setApplyingPromo(true)
    setPromoMessage(null)

    try {
      const response = await fetch('/api/credits/redeem-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setPromoMessage({ type: 'success', text: `${t.promoSuccess} +${data.credits_added} ${t.credits}` })
        setPromoCode('')
        // Rafraîchir les données
        fetchData()
      } else {
        setPromoMessage({ type: 'error', text: data.error || t.promoError })
      }
    } catch (error) {
      console.error('Promo error:', error)
      setPromoMessage({ type: 'error', text: t.promoError })
    } finally {
      setApplyingPromo(false)
      setTimeout(() => setPromoMessage(null), 5000)
    }
  }

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, string> = {
      purchase: t.purchase,
      spent: t.spent,
      sale_earning: t.sale_earning,
      refund: t.refund,
      bonus: t.registration_bonus,
      registration_bonus: t.registration_bonus,
      promo_code: t.promo_code,
      purchase_bonus: t.purchase_bonus,
      admin_grant: t.admin_grant
    }
    return labels[type] || type
  }

  const getCreditTypeBadge = (creditType: string | null) => {
    if (!creditType) return null
    const colors = {
      free: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      paid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      mixed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    }
    const labels = { free: t.free, paid: t.paid, mixed: t.mixed }
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${colors[creditType as keyof typeof colors] || ''}`}>
        {labels[creditType as keyof typeof labels] || creditType}
      </span>
    )
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
        {/* Back Button */}
        <Link href={`/${lang}/profil`}>
          <Button variant="outline" gem="neutral" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.back}
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.subtitle}</p>
        </div>

        {/* Double Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Free Credits (Green) */}
          <div
            className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center"
            style={{ border: '2px solid #10B981' }}
          >
            <Gift className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-green-600 dark:text-green-400 uppercase tracking-wide text-xs font-medium">{t.freeCredits}</p>
            <p className="text-4xl font-bold mt-1 text-green-700 dark:text-green-300">
              {breakdown.free_balance}
            </p>
            <p className="text-xs text-green-500 dark:text-green-500 mt-1">{t.noValue}</p>
          </div>

          {/* Paid Credits (Gold) */}
          <div
            className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 text-center"
            style={{ border: '2px solid #F59E0B' }}
          >
            <Coins className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <p className="text-amber-600 dark:text-amber-400 uppercase tracking-wide text-xs font-medium">{t.paidCredits}</p>
            <p className="text-4xl font-bold mt-1 text-amber-700 dark:text-amber-300">
              {breakdown.paid_balance}
            </p>
            <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">
              {breakdown.paid_avg_unit_value_cents > 0
                ? `~${(breakdown.paid_avg_unit_value_cents / 100).toFixed(2)}€/crédit`
                : ''}
            </p>
          </div>

          {/* Total */}
          <div
            className="bg-surface dark:bg-surface-dark rounded-2xl p-6 text-center shadow-elevation-1"
            style={{ border: '1px solid var(--border)' }}
          >
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-sage" />
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide text-xs font-medium">{t.total}</p>
            <p className="text-4xl font-bold mt-1 text-foreground dark:text-foreground-dark">
              {breakdown.total_balance}
            </p>
            <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.credits}</p>
          </div>
        </div>

        {/* Promo Code Section */}
        <div
          className="bg-surface dark:bg-surface-dark rounded-2xl p-6 mb-10 shadow-elevation-1"
          style={{ border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-terracotta" />
            {t.promoCode}
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder={t.promoPlaceholder}
              className="flex-1 px-4 py-2 rounded-xl bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary/50"
              style={{ border: '1px solid var(--border)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            />
            <Button
              onClick={handleApplyPromo}
              disabled={applyingPromo || !promoCode.trim()}
              gem="amber"
            >
              {applyingPromo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.applying}
                </>
              ) : (
                t.applyCode
              )}
            </Button>
          </div>
          {promoMessage && (
            <p className={`mt-3 text-sm ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {promoMessage.text}
            </p>
          )}
        </div>

        {/* Credit Packs */}
        <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-6">{t.buyCredits}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {creditPacks.map(pack => {
            const Icon = pack.icon
            return (
              <div
                key={pack.id}
                className="relative bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                {pack.badge && (
                  <div className="absolute top-0 right-0 bg-terracotta text-white text-xs px-2 py-1 rounded-bl-lg">
                    {t[pack.badge as keyof typeof t]}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${pack.color} p-6 text-white text-center relative`}>
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{pack.credits}</p>
                  <p className="text-sm opacity-80">{t.credits}</p>

                  {/* Bonus Badge */}
                  {pack.bonusFree > 0 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                      +{pack.bonusFree} {t.freeBonus} 🎁
                    </div>
                  )}
                </div>
                <div className={`p-4 ${pack.bonusFree > 0 ? 'pt-6' : ''}`}>
                  <p className="text-center text-lg font-semibold text-foreground dark:text-foreground-dark mb-3">
                    {pack.priceDisplay}
                  </p>
                  <Button
                    onClick={() => handleBuyPack(pack.id)}
                    disabled={processingPack !== null}
                    gem="amber"
                    className="w-full"
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
        <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-6" style={{ border: '1px solid var(--border)' }}>
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground dark:text-foreground-dark">
                        {getTransactionLabel(tx.type)}
                      </p>
                      {getCreditTypeBadge(tx.credit_type)}
                    </div>
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
