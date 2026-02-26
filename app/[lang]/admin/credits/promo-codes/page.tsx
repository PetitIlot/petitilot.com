'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Ticket, Plus, Loader2, Trash2, ToggleLeft, ToggleRight, Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language, PromoCode } from '@/lib/types'

const translations = {
  fr: {
    title: 'Codes promo',
    back: 'Retour',
    createNew: 'Créer un code',
    code: 'Code',
    credits: 'Crédits',
    uses: 'Utilisations',
    expires: 'Expiration',
    status: 'Statut',
    actions: 'Actions',
    active: 'Actif',
    inactive: 'Inactif',
    noExpiry: 'Sans expiration',
    expired: 'Expiré',
    unlimited: 'Illimité',
    copied: 'Copié !',
    loading: 'Chargement...',
    noPromoCodes: 'Aucun code promo',
    createFirst: 'Créez votre premier code promo',
    // Modal
    createTitle: 'Créer un code promo',
    codeLabel: 'Code (sera en majuscules)',
    codePlaceholder: 'Ex: BIENVENUE10',
    creditsLabel: 'Crédits gratuits à offrir',
    maxUsesLabel: 'Nombre max d\'utilisations (vide = illimité)',
    expiresLabel: 'Date d\'expiration (optionnel)',
    allowMultipleLabel: 'Autoriser plusieurs utilisations par user',
    descriptionLabel: 'Description (interne)',
    create: 'Créer',
    creating: 'Création...',
    cancel: 'Annuler',
    deleteConfirm: 'Supprimer ce code ?'
  },
  en: {
    title: 'Promo codes',
    back: 'Back',
    createNew: 'Create code',
    code: 'Code',
    credits: 'Credits',
    uses: 'Uses',
    expires: 'Expires',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    noExpiry: 'No expiry',
    expired: 'Expired',
    unlimited: 'Unlimited',
    copied: 'Copied!',
    loading: 'Loading...',
    noPromoCodes: 'No promo codes',
    createFirst: 'Create your first promo code',
    createTitle: 'Create promo code',
    codeLabel: 'Code (will be uppercase)',
    codePlaceholder: 'Ex: WELCOME10',
    creditsLabel: 'Free credits to grant',
    maxUsesLabel: 'Max uses (empty = unlimited)',
    expiresLabel: 'Expiration date (optional)',
    allowMultipleLabel: 'Allow multiple uses per user',
    descriptionLabel: 'Description (internal)',
    create: 'Create',
    creating: 'Creating...',
    cancel: 'Cancel',
    deleteConfirm: 'Delete this code?'
  },
  es: {
    title: 'Códigos promo',
    back: 'Volver',
    createNew: 'Crear código',
    code: 'Código',
    credits: 'Créditos',
    uses: 'Usos',
    expires: 'Expira',
    status: 'Estado',
    actions: 'Acciones',
    active: 'Activo',
    inactive: 'Inactivo',
    noExpiry: 'Sin expiración',
    expired: 'Expirado',
    unlimited: 'Ilimitado',
    copied: '¡Copiado!',
    loading: 'Cargando...',
    noPromoCodes: 'Sin códigos promo',
    createFirst: 'Crea tu primer código promo',
    createTitle: 'Crear código promo',
    codeLabel: 'Código (será en mayúsculas)',
    codePlaceholder: 'Ej: BIENVENIDO10',
    creditsLabel: 'Créditos gratis a otorgar',
    maxUsesLabel: 'Máximo de usos (vacío = ilimitado)',
    expiresLabel: 'Fecha de expiración (opcional)',
    allowMultipleLabel: 'Permitir múltiples usos por usuario',
    descriptionLabel: 'Descripción (interna)',
    create: 'Crear',
    creating: 'Creando...',
    cancel: 'Cancelar',
    deleteConfirm: '¿Eliminar este código?'
  }
}

export default function PromoCodesPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as Language) || 'fr'
  const t = translations[lang]

  const [loading, setLoading] = useState(true)
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Form state
  const [newCode, setNewCode] = useState('')
  const [newCredits, setNewCredits] = useState(5)
  const [newMaxUses, setNewMaxUses] = useState<number | ''>('')
  const [newExpires, setNewExpires] = useState('')
  const [newAllowMultiple, setNewAllowMultiple] = useState(false)
  const [newDescription, setNewDescription] = useState('')

  const loadPromoCodes = async () => {
    const response = await fetch('/api/admin/promo-codes')
    const data = await response.json()
    if (data.success) {
      setPromoCodes(data.codes)
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

      await loadPromoCodes()
      setLoading(false)
    }

    checkAdmin()
  }, [lang, router])

  const handleCreate = async () => {
    if (!newCode.trim() || newCredits <= 0) return

    setCreating(true)
    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          free_credits: newCredits,
          max_uses: newMaxUses || null,
          expires_at: newExpires || null,
          allow_multiple_per_user: newAllowMultiple,
          description: newDescription || null
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowModal(false)
        setNewCode('')
        setNewCredits(5)
        setNewMaxUses('')
        setNewExpires('')
        setNewAllowMultiple(false)
        setNewDescription('')
        await loadPromoCodes()
      }
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (id: string, currentActive: boolean) => {
    await fetch(`/api/admin/promo-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !currentActive })
    })
    await loadPromoCodes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return
    await fetch(`/api/admin/promo-codes/${id}`, { method: 'DELETE' })
    await loadPromoCodes()
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/${lang}/admin/credits`}
              className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> {t.back}
            </Link>
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
              <Ticket className="w-8 h-8 text-terracotta" />
              {t.title}
            </h1>
          </div>
          <Button
            gem="terracotta"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> {t.createNew}
          </Button>
        </div>

        {/* Table */}
        {promoCodes.length === 0 ? (
          <div className="text-center py-12 bg-surface dark:bg-surface-dark rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <Ticket className="w-12 h-12 mx-auto mb-4 text-foreground-secondary" />
            <p className="text-foreground dark:text-foreground-dark font-medium">{t.noPromoCodes}</p>
            <p className="text-foreground-secondary text-sm">{t.createFirst}</p>
          </div>
        ) : (
          <div className="bg-surface dark:bg-surface-dark rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead className="bg-background dark:bg-background-dark">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.code}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.credits}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.uses}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.expires}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.status}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-foreground-secondary uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((code) => {
                  const isExpired = code.expires_at && new Date(code.expires_at) < new Date()
                  return (
                    <tr key={code.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="bg-background dark:bg-background-dark px-2 py-1 rounded text-sm font-mono text-foreground dark:text-foreground-dark">
                            {code.code}
                          </code>
                          <button
                            onClick={() => handleCopy(code.code)}
                            className="text-foreground-secondary hover:text-foreground"
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {code.description && (
                          <p className="text-xs text-foreground-secondary mt-1">{code.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-600 font-medium">+{code.free_credits}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-foreground dark:text-foreground-dark">
                        {code.current_uses}/{code.max_uses || '∞'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {code.expires_at ? (
                          <span className={isExpired ? 'text-red-500' : 'text-foreground-secondary'}>
                            {isExpired ? t.expired : new Date(code.expires_at).toLocaleDateString(lang)}
                          </span>
                        ) : (
                          <span className="text-foreground-secondary">{t.noExpiry}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          code.is_active && !isExpired
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {code.is_active && !isExpired ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggle(code.id, code.is_active)}
                            className="text-foreground-secondary hover:text-foreground"
                          >
                            {code.is_active ? (
                              <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="text-foreground-secondary hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md" style={{ border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-4">{t.createTitle}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.codeLabel}</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder={t.codePlaceholder}
                  className="w-full px-3 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.creditsLabel}</label>
                <input
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full px-3 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.maxUsesLabel}</label>
                <input
                  type="number"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(e.target.value ? parseInt(e.target.value) : '')}
                  min={1}
                  className="w-full px-3 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.expiresLabel}</label>
                <input
                  type="date"
                  value={newExpires}
                  onChange={(e) => setNewExpires(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  checked={newAllowMultiple}
                  onChange={(e) => setNewAllowMultiple(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="allowMultiple" className="text-sm text-foreground dark:text-foreground-dark">{t.allowMultipleLabel}</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">{t.descriptionLabel}</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
              <Button
                gem="terracotta"
                onClick={handleCreate}
                disabled={creating || !newCode.trim() || newCredits <= 0}
                className="flex-1"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.creating}
                  </>
                ) : (
                  t.create
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
