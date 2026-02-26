'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CreditCard, CheckCircle, AlertCircle, Mail,
  FileText, ExternalLink, Save, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language, Creator } from '@/lib/types'

const translations = {
  fr: {
    title: 'Paramètres',
    back: 'Retour au dashboard',
    accountStatus: 'Statut du compte',
    approved: 'Approuvé',
    pendingApproval: 'En attente d\'approbation',
    approvedSince: 'Approuvé le',
    paymentSection: 'Paiements',
    payoutEmail: 'Email de virement',
    payoutEmailDesc: 'Adresse où vous recevrez vos revenus (via Stripe)',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Compte connecté',
    stripeNotConnected: 'Non connecté',
    connectStripe: 'Connecter Stripe',
    stripeDesc: 'Connectez votre compte Stripe pour recevoir vos paiements automatiquement',
    commissionRate: 'Taux de commission',
    commissionDesc: 'Votre part sur chaque vente',
    cguSection: 'Conditions légales',
    cguCreator: 'CGU Créateurs',
    cguAccepted: 'Acceptées le',
    cguNotAccepted: 'Non acceptées',
    cguView: 'Lire les CGU',
    privacyPolicy: 'Politique de confidentialité',
    deleteAccount: 'Supprimer le compte',
    deleteAccountDesc: 'Pour supprimer votre compte créateur, contactez-nous.',
    contactUs: 'Nous contacter',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Enregistré !',
    error: 'Erreur lors de la sauvegarde',
  },
  en: {
    title: 'Settings',
    back: 'Back to dashboard',
    accountStatus: 'Account status',
    approved: 'Approved',
    pendingApproval: 'Pending approval',
    approvedSince: 'Approved on',
    paymentSection: 'Payments',
    payoutEmail: 'Payout email',
    payoutEmailDesc: 'Address where you will receive your earnings (via Stripe)',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Account connected',
    stripeNotConnected: 'Not connected',
    connectStripe: 'Connect Stripe',
    stripeDesc: 'Connect your Stripe account to receive payments automatically',
    commissionRate: 'Commission rate',
    commissionDesc: 'Your share on each sale',
    cguSection: 'Legal',
    cguCreator: 'Creator Terms',
    cguAccepted: 'Accepted on',
    cguNotAccepted: 'Not accepted',
    cguView: 'Read terms',
    privacyPolicy: 'Privacy policy',
    deleteAccount: 'Delete account',
    deleteAccountDesc: 'To delete your creator account, contact us.',
    contactUs: 'Contact us',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    error: 'Error saving',
  },
  es: {
    title: 'Configuración',
    back: 'Volver al panel',
    accountStatus: 'Estado de la cuenta',
    approved: 'Aprobado',
    pendingApproval: 'Pendiente de aprobación',
    approvedSince: 'Aprobado el',
    paymentSection: 'Pagos',
    payoutEmail: 'Email de pago',
    payoutEmailDesc: 'Dirección donde recibirás tus ganancias (vía Stripe)',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Cuenta conectada',
    stripeNotConnected: 'No conectado',
    connectStripe: 'Conectar Stripe',
    stripeDesc: 'Conecta tu cuenta Stripe para recibir pagos automáticamente',
    commissionRate: 'Tasa de comisión',
    commissionDesc: 'Tu parte en cada venta',
    cguSection: 'Legal',
    cguCreator: 'Términos del Creador',
    cguAccepted: 'Aceptado el',
    cguNotAccepted: 'No aceptado',
    cguView: 'Leer términos',
    privacyPolicy: 'Política de privacidad',
    deleteAccount: 'Eliminar cuenta',
    deleteAccountDesc: 'Para eliminar tu cuenta de creador, contáctanos.',
    contactUs: 'Contactarnos',
    save: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    error: 'Error al guardar',
  }
}

export default function CreatorSettingsPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [payoutEmail, setPayoutEmail] = useState('')

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const fetchCreator = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/${lang}/connexion`); return }

      const { data } = await supabase.from('creators').select('*').eq('user_id', user.id).single()
      if (!data) { router.push(`/${lang}/devenir-createur`); return }

      setCreator(data as Creator)
      setPayoutEmail(data.payout_email || '')
      setIsLoading(false)
    }
    fetchCreator()
  }, [lang, router])

  const handleSave = async () => {
    if (!creator) return
    setIsSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('creators')
      .update({ payout_email: payoutEmail || null, updated_at: new Date().toISOString() })
      .eq('id', creator.id!)
    setIsSaving(false)
    if (error) { setSaveStatus('error') }
    else { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 3000) }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href={`/${lang}/createur`}>
            <Button variant="outline" gem="neutral" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          </Link>
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark">{t.title}</h1>
        </motion.div>

        <div className="space-y-6">
          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark mb-4">{t.accountStatus}</h2>
            <div className="flex items-center gap-3">
              {creator?.is_approved ? (
                <>
                  <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--icon-sage)' }} />
                  <div>
                    <p className="font-medium text-foreground dark:text-foreground-dark">{t.approved}</p>
                    {creator.approval_date && (
                      <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                        {t.approvedSince} {new Date(creator.approval_date).toLocaleDateString(lang)}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--icon-terracotta)' }} />
                  <p className="font-medium text-terracotta">{t.pendingApproval}</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5" style={{ color: 'var(--icon-terracotta)' }} />
              <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark">{t.paymentSection}</h2>
            </div>

            <div className="space-y-5">
              {/* Commission rate */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-sage/8" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground-dark">{t.commissionRate}</p>
                  <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.commissionDesc}</p>
                </div>
                <p className="text-2xl font-bold text-sage">{(creator?.commission_rate || 90).toFixed(0)}%</p>
              </div>

              {/* Payout email */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t.payoutEmail}
                </label>
                <input
                  type="email"
                  value={payoutEmail}
                  onChange={e => setPayoutEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.payoutEmailDesc}</p>
              </div>

              {/* Stripe Connect */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground-dark">{t.stripeConnect}</p>
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                    {creator?.stripe_account_id ? t.stripeConnected : t.stripeNotConnected}
                  </p>
                  <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.stripeDesc}</p>
                </div>
                {creator?.stripe_account_id ? (
                  <CheckCircle className="w-6 h-6 text-sage flex-shrink-0" />
                ) : (
                  <Button gem="amber" size="sm" disabled>
                    {t.connectStripe}
                  </Button>
                )}
              </div>
            </div>

            {/* Save */}
            <div className="mt-6">
              <Button gem="sage" className="w-full" disabled={isSaving} onClick={handleSave}>
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.saving}</>
                ) : saveStatus === 'saved' ? (
                  <><CheckCircle className="w-4 h-4 mr-2" />{t.saved}</>
                ) : saveStatus === 'error' ? (
                  <><AlertCircle className="w-4 h-4 mr-2" />{t.error}</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />{t.save}</>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Legal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" style={{ color: 'var(--icon-sky)' }} />
              <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark">{t.cguSection}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-medium text-sm text-foreground dark:text-foreground-dark">{t.cguCreator}</p>
                  <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                    {(creator as any)?.cgu_accepted_at
                      ? `${t.cguAccepted} ${new Date((creator as any).cgu_accepted_at).toLocaleDateString(lang)}`
                      : t.cguNotAccepted}
                  </p>
                </div>
                <Link href={`/${lang}/cgu-createurs`} target="_blank">
                  <Button gem="sky" variant="outline" size="sm">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    {t.cguView}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary dark:bg-surface-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                <p className="font-medium text-sm text-foreground dark:text-foreground-dark">{t.privacyPolicy}</p>
                <Link href={`/${lang}/confidentialite`} target="_blank">
                  <Button gem="sky" variant="outline" size="sm">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Lire
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-elevation-1 p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <h2 className="font-quicksand text-lg font-bold text-foreground dark:text-foreground-dark mb-4">{t.deleteAccount}</h2>
            <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.deleteAccountDesc}</p>
            <Link href={`/${lang}/contact`}>
              <Button gem="neutral" variant="outline" size="sm">
                {t.contactUs}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
