'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Loader2, Download, Lock, Gift, Coins } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    buy: 'Acheter',
    credits: 'crédits',
    purchased: 'Acheté',
    download: 'Télécharger',
    purchasing: 'Achat...',
    login: 'Se connecter',
    insufficientCredits: 'Crédits insuffisants',
    buyCredits: 'Acheter des crédits',
    error: 'Erreur',
    free: 'Gratuit',
    freeCredits: 'gratuits',
    paidCredits: 'payants'
  },
  en: {
    buy: 'Buy',
    credits: 'credits',
    purchased: 'Purchased',
    download: 'Download',
    purchasing: 'Buying...',
    login: 'Log in',
    insufficientCredits: 'Insufficient credits',
    buyCredits: 'Buy credits',
    error: 'Error',
    free: 'Free',
    freeCredits: 'free',
    paidCredits: 'paid'
  },
  es: {
    buy: 'Comprar',
    credits: 'créditos',
    purchased: 'Comprado',
    download: 'Descargar',
    purchasing: 'Comprando...',
    login: 'Iniciar sesión',
    insufficientCredits: 'Créditos insuficientes',
    buyCredits: 'Comprar créditos',
    error: 'Error',
    free: 'Gratis',
    freeCredits: 'gratis',
    paidCredits: 'pagados'
  }
}

interface PurchaseButtonProps {
  ressourceId: string
  priceCredits: number
  pdfUrl?: string | null
  lang: Language
  className?: string
}

export default function PurchaseButton({
  ressourceId,
  priceCredits,
  pdfUrl,
  lang,
  className = ''
}: PurchaseButtonProps) {
  const router = useRouter()
  const t = translations[lang]

  const [user, setUser] = useState<{ id: string } | null>(null)
  const [freeCredits, setFreeCredits] = useState(0)
  const [paidCredits, setPaidCredits] = useState(0)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Récupérer les deux balances
        const { data: profile } = await supabase
          .from('profiles')
          .select('free_credits_balance, paid_credits_balance')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFreeCredits(profile.free_credits_balance || 0)
          setPaidCredits(profile.paid_credits_balance || 0)
        }

        // Vérifier si déjà acheté
        const { data: purchased } = await supabase.rpc('has_purchased_ressource', {
          p_user_id: user.id,
          p_ressource_id: ressourceId
        })

        setHasPurchased(purchased || false)
      }

      setIsLoading(false)
    }

    checkStatus()
  }, [ressourceId])

  // Calculer la répartition FIFO
  const totalCredits = freeCredits + paidCredits
  const freeToSpend = Math.min(freeCredits, priceCredits)
  const paidToSpend = priceCredits - freeToSpend

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/${lang}/connexion`)
      return
    }

    if (totalCredits < priceCredits) {
      router.push(`/${lang}/profil/credits`)
      return
    }

    setIsPurchasing(true)
    setError('')

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ressource_id: ressourceId })
      })

      const data = await response.json()

      if (data.success) {
        setHasPurchased(true)
        // Mettre à jour les balances avec les nouvelles valeurs
        if (data.new_free_balance !== undefined) {
          setFreeCredits(data.new_free_balance)
        }
        if (data.new_paid_balance !== undefined) {
          setPaidCredits(data.new_paid_balance)
        }
      } else {
        setError(data.error || t.error)
      }
    } catch {
      setError(t.error)
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <Button disabled className={`bg-[#A8B5A0] ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/download?ressource_id=${ressourceId}`)
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        setError(data.error || t.error)
      }
    } catch {
      setError(t.error)
    } finally {
      setIsLoading(false)
    }
  }

  // Ressource gratuite
  if (priceCredits === 0) {
    if (pdfUrl) {
      return (
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className={`bg-[#A8B5A0] hover:bg-[#95a28f] text-white ${className}`}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {t.free}
        </Button>
      )
    }
    return null
  }

  // Déjà acheté
  if (hasPurchased) {
    if (pdfUrl) {
      return (
        <Button
          onClick={handleDownload}
          disabled={isLoading}
          className={`bg-[#A8B5A0] hover:bg-[#95a28f] text-white ${className}`}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {t.download}
        </Button>
      )
    }
    return (
      <Button disabled className={`bg-[#A8B5A0]/50 text-white ${className}`}>
        <Check className="w-4 h-4 mr-2" />
        {t.purchased}
      </Button>
    )
  }

  // Non connecté
  if (!user) {
    return (
      <Button
        onClick={() => router.push(`/${lang}/connexion`)}
        className={`bg-[#5D5A4E] hover:bg-[#4a4840] text-white ${className}`}
      >
        <Lock className="w-4 h-4 mr-2" />
        {t.login}
      </Button>
    )
  }

  // Crédits insuffisants
  if (totalCredits < priceCredits) {
    return (
      <div className="space-y-2">
        <Button
          onClick={() => router.push(`/${lang}/profil/credits`)}
          className={`bg-[#D4A59A] hover:bg-[#c49589] text-white ${className}`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {priceCredits} {t.credits}
        </Button>
        <p className="text-xs text-red-500">{t.insufficientCredits}</p>
      </div>
    )
  }

  // Bouton d'achat avec répartition
  return (
    <div className="space-y-2">
      <Button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className={`bg-[#A8B5A0] hover:bg-[#95a28f] text-white ${className}`}
      >
        {isPurchasing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.purchasing}
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t.buy} • {priceCredits} {t.credits}
          </>
        )}
      </Button>

      {/* Afficher la répartition si mixte */}
      {!isPurchasing && freeToSpend > 0 && paidToSpend > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <Gift className="w-3 h-3" />
            {freeToSpend} {t.freeCredits}
          </span>
          <span className="text-gray-400">+</span>
          <span className="flex items-center gap-1 text-amber-600">
            <Coins className="w-3 h-3" />
            {paidToSpend} {t.paidCredits}
          </span>
        </div>
      )}

      {/* Si tout gratuit */}
      {!isPurchasing && freeToSpend > 0 && paidToSpend === 0 && (
        <p className="text-xs text-green-600 flex items-center justify-center gap-1">
          <Gift className="w-3 h-3" />
          {freeToSpend} {t.freeCredits}
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
