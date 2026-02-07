'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, Search, Loader2, ArrowLeft, Check, User } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Attribution manuelle',
    back: 'Retour',
    searchUser: 'Rechercher un utilisateur',
    searchPlaceholder: 'Email de l\'utilisateur',
    search: 'Rechercher',
    userFound: 'Utilisateur trouvé',
    userNotFound: 'Utilisateur non trouvé',
    currentBalance: 'Solde actuel',
    freeCredits: 'Crédits gratuits',
    paidCredits: 'Crédits payants',
    creditType: 'Type de crédits',
    amount: 'Montant',
    reason: 'Raison',
    reasons: {
      support: 'Support client',
      correction: 'Correction d\'erreur',
      promotion: 'Promotion',
      gift: 'Cadeau',
      other: 'Autre'
    },
    grant: 'Attribuer',
    granting: 'Attribution...',
    success: 'Crédits attribués avec succès !',
    error: 'Erreur lors de l\'attribution',
    loading: 'Chargement...'
  },
  en: {
    title: 'Manual grant',
    back: 'Back',
    searchUser: 'Search user',
    searchPlaceholder: 'User email',
    search: 'Search',
    userFound: 'User found',
    userNotFound: 'User not found',
    currentBalance: 'Current balance',
    freeCredits: 'Free credits',
    paidCredits: 'Paid credits',
    creditType: 'Credit type',
    amount: 'Amount',
    reason: 'Reason',
    reasons: {
      support: 'Customer support',
      correction: 'Error correction',
      promotion: 'Promotion',
      gift: 'Gift',
      other: 'Other'
    },
    grant: 'Grant',
    granting: 'Granting...',
    success: 'Credits granted successfully!',
    error: 'Error granting credits',
    loading: 'Loading...'
  },
  es: {
    title: 'Asignación manual',
    back: 'Volver',
    searchUser: 'Buscar usuario',
    searchPlaceholder: 'Email del usuario',
    search: 'Buscar',
    userFound: 'Usuario encontrado',
    userNotFound: 'Usuario no encontrado',
    currentBalance: 'Saldo actual',
    freeCredits: 'Créditos gratis',
    paidCredits: 'Créditos pagados',
    creditType: 'Tipo de créditos',
    amount: 'Cantidad',
    reason: 'Razón',
    reasons: {
      support: 'Soporte al cliente',
      correction: 'Corrección de error',
      promotion: 'Promoción',
      gift: 'Regalo',
      other: 'Otro'
    },
    grant: 'Asignar',
    granting: 'Asignando...',
    success: '¡Créditos asignados con éxito!',
    error: 'Error al asignar créditos',
    loading: 'Cargando...'
  }
}

interface UserProfile {
  id: string
  email: string
  free_credits_balance: number
  paid_credits_balance: number
  role: string
}

export default function GrantCreditsPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [granting, setGranting] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Grant form
  const [creditType, setCreditType] = useState<'free' | 'paid'>('free')
  const [amount, setAmount] = useState(5)
  const [reason, setReason] = useState('support')

  useEffect(() => {
    const checkAdmin = async () => {
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

      setLoading(false)
    }

    checkAdmin()
  }, [lang, router])

  const handleSearch = async () => {
    if (!searchEmail.trim()) return

    setSearching(true)
    setFoundUser(null)
    setNotFound(false)
    setMessage(null)

    const supabase = createClient()
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email, free_credits_balance, paid_credits_balance, role')
      .eq('email', searchEmail.trim().toLowerCase())
      .single()

    if (user) {
      setFoundUser(user)
    } else {
      setNotFound(true)
    }

    setSearching(false)
  }

  const handleGrant = async () => {
    if (!foundUser || amount <= 0) return

    setGranting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/credits/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: foundUser.id,
          free_credits: creditType === 'free' ? amount : 0,
          paid_credits: creditType === 'paid' ? amount : 0,
          unit_value_cents: creditType === 'paid' ? 100 : 0, // 1€ par défaut pour les payants admin
          reason: t.reasons[reason as keyof typeof t.reasons]
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: t.success })
        // Rafraîchir les infos user
        handleSearch()
        setAmount(5)
      } else {
        setMessage({ type: 'error', text: data.error || t.error })
      }
    } catch {
      setMessage({ type: 'error', text: t.error })
    } finally {
      setGranting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${lang}/admin/credits`}
            className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Link>
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Gift className="w-8 h-8 text-green-500" />
            {t.title}
          </h1>
        </div>

        {/* Search */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-semibold text-foreground dark:text-foreground-dark mb-4">{t.searchUser}</h2>
          <div className="flex gap-3">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-4 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
              style={{ border: '1px solid var(--border)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !searchEmail.trim()}
              className="bg-sage hover:bg-sage/90 text-white"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {notFound && (
            <p className="mt-3 text-red-500 text-sm">{t.userNotFound}</p>
          )}
        </div>

        {/* User Found */}
        {foundUser && (
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-sage/20 p-2 rounded-full">
                <User className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="font-semibold text-foreground dark:text-foreground-dark">{foundUser.email}</p>
                <p className="text-xs text-foreground-secondary">{t.userFound}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center" style={{ border: '1px solid #10B981' }}>
                <p className="text-2xl font-bold text-green-600">{foundUser.free_credits_balance || 0}</p>
                <p className="text-xs text-green-500">{t.freeCredits}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center" style={{ border: '1px solid #F59E0B' }}>
                <p className="text-2xl font-bold text-amber-600">{foundUser.paid_credits_balance || 0}</p>
                <p className="text-xs text-amber-500">{t.paidCredits}</p>
              </div>
            </div>

            {/* Grant Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">{t.creditType}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreditType('free')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      creditType === 'free'
                        ? 'bg-green-500 text-white'
                        : 'bg-background dark:bg-background-dark text-foreground-secondary'
                    }`}
                    style={{ border: '1px solid var(--border)' }}
                  >
                    {t.freeCredits}
                  </button>
                  <button
                    onClick={() => setCreditType('paid')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      creditType === 'paid'
                        ? 'bg-amber-500 text-white'
                        : 'bg-background dark:bg-background-dark text-foreground-secondary'
                    }`}
                    style={{ border: '1px solid var(--border)' }}
                  >
                    {t.paidCredits}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.amount}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full px-4 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.reason}</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {Object.entries(t.reasons).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleGrant}
                disabled={granting || amount <= 0}
                className={`w-full ${creditType === 'free' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white`}
              >
                {granting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.granting}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.grant} +{amount} {creditType === 'free' ? t.freeCredits : t.paidCredits}
                  </>
                )}
              </Button>

              {message && (
                <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
