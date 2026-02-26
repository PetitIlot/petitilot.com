'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Settings, ArrowLeft, Loader2, Save, Gift, ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language, PurchaseBonus, RegistrationBonusConfig } from '@/lib/types'

const translations = {
  fr: {
    title: 'Configuration des bonus',
    back: 'Retour',
    registrationBonus: 'Bonus d\'inscription',
    registrationDesc: 'Crédits gratuits offerts à chaque nouvel utilisateur',
    enabled: 'Activé',
    disabled: 'Désactivé',
    freeCredits: 'Crédits gratuits',
    purchaseBonuses: 'Bonus d\'achat',
    purchaseDesc: 'Crédits gratuits offerts lors de l\'achat d\'un pack',
    pack: 'Pack',
    price: 'Prix',
    bonus: 'Bonus gratuit',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Enregistré !',
    loading: 'Chargement...'
  },
  en: {
    title: 'Bonus settings',
    back: 'Back',
    registrationBonus: 'Registration bonus',
    registrationDesc: 'Free credits granted to each new user',
    enabled: 'Enabled',
    disabled: 'Disabled',
    freeCredits: 'Free credits',
    purchaseBonuses: 'Purchase bonuses',
    purchaseDesc: 'Free credits granted when buying a pack',
    pack: 'Pack',
    price: 'Price',
    bonus: 'Free bonus',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    loading: 'Loading...'
  },
  es: {
    title: 'Configuración de bonos',
    back: 'Volver',
    registrationBonus: 'Bono de registro',
    registrationDesc: 'Créditos gratis otorgados a cada nuevo usuario',
    enabled: 'Activado',
    disabled: 'Desactivado',
    freeCredits: 'Créditos gratis',
    purchaseBonuses: 'Bonos de compra',
    purchaseDesc: 'Créditos gratis otorgados al comprar un pack',
    pack: 'Pack',
    price: 'Precio',
    bonus: 'Bono gratis',
    save: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    loading: 'Cargando...'
  }
}

export default function CreditsSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Registration bonus
  const [regBonusEnabled, setRegBonusEnabled] = useState(true)
  const [regBonusCredits, setRegBonusCredits] = useState(5)

  // Purchase bonuses
  const [purchaseBonuses, setPurchaseBonuses] = useState<PurchaseBonus[]>([])

  const loadConfig = async () => {
    const response = await fetch('/api/admin/config')
    const data = await response.json()

    if (data.success) {
      // Registration bonus
      const regConfig = data.configs.find((c: { key: string }) => c.key === 'registration_bonus')
      if (regConfig) {
        const value = regConfig.value as RegistrationBonusConfig
        setRegBonusEnabled(value.enabled)
        setRegBonusCredits(value.free_credits)
      }

      // Purchase bonuses
      setPurchaseBonuses(data.purchase_bonuses)
    }
  }

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

      await loadConfig()
      setLoading(false)
    }

    checkAdmin()
  }, [lang, router])

  const handleSaveRegBonus = async () => {
    setSaving(true)
    setSaved(false)

    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'registration_bonus',
        value: {
          enabled: regBonusEnabled,
          free_credits: regBonusCredits
        }
      })
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleUpdatePackBonus = async (packId: string, bonusCredits: number) => {
    await fetch('/api/admin/config/purchase-bonuses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pack_id: packId,
        bonus_free_credits: bonusCredits
      })
    })

    // Mettre à jour localement
    setPurchaseBonuses(prev =>
      prev.map(p => p.pack_id === packId ? { ...p, bonus_free_credits: bonusCredits } : p)
    )
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
            <Settings className="w-8 h-8 text-mauve" />
            {t.title}
          </h1>
        </div>

        {/* Registration Bonus */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground dark:text-foreground-dark">{t.registrationBonus}</h2>
              <p className="text-sm text-foreground-secondary">{t.registrationDesc}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground dark:text-foreground-dark">Status</span>
              <button
                onClick={() => setRegBonusEnabled(!regBonusEnabled)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  regBonusEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-foreground-secondary'
                }`}
              >
                {regBonusEnabled ? t.enabled : t.disabled}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground dark:text-foreground-dark">{t.freeCredits}</span>
              <input
                type="number"
                value={regBonusCredits}
                onChange={(e) => setRegBonusCredits(parseInt(e.target.value) || 0)}
                min={0}
                className="w-24 px-3 py-2 rounded-lg text-center bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                style={{ border: '1px solid var(--border)' }}
              />
            </div>

            <Button
              gem="sage"
              onClick={handleSaveRegBonus}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : saved ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.saved}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Purchase Bonuses */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground dark:text-foreground-dark">{t.purchaseBonuses}</h2>
              <p className="text-sm text-foreground-secondary">{t.purchaseDesc}</p>
            </div>
          </div>

          <div className="space-y-3">
            {purchaseBonuses.map((pack) => (
              <div
                key={pack.pack_id}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div>
                  <p className="font-medium text-foreground dark:text-foreground-dark">
                    {pack.pack_name || pack.pack_id}
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    {pack.pack_credits} crédits • {(pack.pack_price_cents / 100).toFixed(2)}€
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm">+</span>
                  <input
                    type="number"
                    value={pack.bonus_free_credits}
                    onChange={(e) => handleUpdatePackBonus(pack.pack_id, parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-16 px-2 py-1 rounded-lg text-center bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                    style={{ border: '1px solid var(--border)' }}
                  />
                  <span className="text-green-600 text-sm">{t.freeCredits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
