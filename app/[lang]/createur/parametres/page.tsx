'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, Globe, Instagram, Mail, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language, Creator } from '@/lib/types'

const translations = {
  fr: {
    title: 'Paramètres',
    back: 'Retour au dashboard',
    profileSection: 'Profil public',
    displayName: 'Nom d\'affichage',
    slug: 'URL personnalisée',
    slugPrefix: 'petitilot.com/createurs/',
    bio: 'Bio courte',
    bioPlaceholder: 'Présentez-vous en quelques mots...',
    philosophy: 'Philosophie éducative',
    philosophyPlaceholder: 'Qu\'est-ce qui vous anime ?',
    socialSection: 'Réseaux sociaux',
    instagram: 'Instagram',
    instagramPlaceholder: '@votre_compte',
    youtube: 'YouTube',
    youtubePlaceholder: '@votre_chaine',
    tiktok: 'TikTok',
    tiktokPlaceholder: '@votre_compte',
    website: 'Site web',
    websitePlaceholder: 'https://votre-site.com',
    paymentSection: 'Paiements',
    payoutEmail: 'Email de paiement',
    payoutEmailDesc: 'Adresse où vous recevrez vos revenus',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Compte connecté',
    stripeNotConnected: 'Non connecté',
    connectStripe: 'Connecter Stripe',
    commissionRate: 'Taux de commission',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    saved: 'Enregistré !',
    error: 'Erreur lors de la sauvegarde',
    accountStatus: 'Statut du compte',
    approved: 'Approuvé',
    pendingApproval: 'En attente d\'approbation',
    approvedSince: 'Approuvé le'
  },
  en: {
    title: 'Settings',
    back: 'Back to dashboard',
    profileSection: 'Public profile',
    displayName: 'Display name',
    slug: 'Custom URL',
    slugPrefix: 'petitilot.com/creators/',
    bio: 'Short bio',
    bioPlaceholder: 'Introduce yourself...',
    philosophy: 'Educational philosophy',
    philosophyPlaceholder: 'What drives you?',
    socialSection: 'Social media',
    instagram: 'Instagram',
    instagramPlaceholder: '@your_account',
    youtube: 'YouTube',
    youtubePlaceholder: '@your_channel',
    tiktok: 'TikTok',
    tiktokPlaceholder: '@your_account',
    website: 'Website',
    websitePlaceholder: 'https://your-site.com',
    paymentSection: 'Payments',
    payoutEmail: 'Payout email',
    payoutEmailDesc: 'Address where you will receive your earnings',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Account connected',
    stripeNotConnected: 'Not connected',
    connectStripe: 'Connect Stripe',
    commissionRate: 'Commission rate',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    error: 'Error saving',
    accountStatus: 'Account status',
    approved: 'Approved',
    pendingApproval: 'Pending approval',
    approvedSince: 'Approved on'
  },
  es: {
    title: 'Configuración',
    back: 'Volver al panel',
    profileSection: 'Perfil público',
    displayName: 'Nombre visible',
    slug: 'URL personalizada',
    slugPrefix: 'petitilot.com/creadores/',
    bio: 'Bio corta',
    bioPlaceholder: 'Preséntate...',
    philosophy: 'Filosofía educativa',
    philosophyPlaceholder: '¿Qué te motiva?',
    socialSection: 'Redes sociales',
    instagram: 'Instagram',
    instagramPlaceholder: '@tu_cuenta',
    youtube: 'YouTube',
    youtubePlaceholder: '@tu_canal',
    tiktok: 'TikTok',
    tiktokPlaceholder: '@tu_cuenta',
    website: 'Sitio web',
    websitePlaceholder: 'https://tu-sitio.com',
    paymentSection: 'Pagos',
    payoutEmail: 'Email de pago',
    payoutEmailDesc: 'Dirección donde recibirás tus ganancias',
    stripeConnect: 'Stripe Connect',
    stripeConnected: 'Cuenta conectada',
    stripeNotConnected: 'No conectado',
    connectStripe: 'Conectar Stripe',
    commissionRate: 'Tasa de comisión',
    save: 'Guardar',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    error: 'Error al guardar',
    accountStatus: 'Estado de la cuenta',
    approved: 'Aprobado',
    pendingApproval: 'Pendiente de aprobación',
    approvedSince: 'Aprobado el'
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

  const [formData, setFormData] = useState({
    display_name: '',
    slug: '',
    bio: '',
    philosophy: '',
    instagram_handle: '',
    youtube_handle: '',
    tiktok_handle: '',
    website_url: '',
    payout_email: ''
  })

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const fetchCreator = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      const { data: creatorData } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!creatorData) {
        router.push(`/${lang}/devenir-createur`)
        return
      }

      setCreator(creatorData as Creator)
      setFormData({
        display_name: creatorData.display_name || '',
        slug: creatorData.slug || '',
        bio: creatorData.bio || '',
        philosophy: creatorData.philosophy || '',
        instagram_handle: creatorData.instagram_handle || '',
        youtube_handle: creatorData.youtube_handle || '',
        tiktok_handle: creatorData.tiktok_handle || '',
        website_url: creatorData.website_url || '',
        payout_email: creatorData.payout_email || ''
      })
      setIsLoading(false)
    }

    fetchCreator()
  }, [lang, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creator) return

    setIsSaving(true)
    setSaveStatus('idle')

    const supabase = createClient()
    const { error } = await supabase
      .from('creators')
      .update({
        display_name: formData.display_name,
        bio: formData.bio,
        philosophy: formData.philosophy,
        instagram_handle: formData.instagram_handle || null,
        youtube_handle: formData.youtube_handle || null,
        tiktok_handle: formData.tiktok_handle || null,
        website_url: formData.website_url || null,
        payout_email: formData.payout_email || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', creator.id!)

    setIsSaving(false)

    if (error) {
      console.error('Error updating creator:', error)
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/${lang}/createur`}>
            <Button variant="ghost" className="mb-4 text-foreground dark:text-foreground-dark">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
          </Link>
          <h1 className="font-quicksand text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
            {t.title}
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark mb-4">
              {t.accountStatus}
            </h2>
            <div className="flex items-center gap-3">
              {creator?.is_approved ? (
                <>
                  <CheckCircle className="w-6 h-6" style={{ color: 'var(--icon-sage)' }} />
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
                  <AlertCircle className="w-6 h-6" style={{ color: 'var(--icon-terracotta)' }} />
                  <p className="font-medium text-terracotta">{t.pendingApproval}</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5" style={{ color: 'var(--icon-sage)' }} />
              <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark">
                {t.profileSection}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.displayName}
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.slug}
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mr-2">{t.slugPrefix}</span>
                  <input
                    type="text"
                    value={formData.slug}
                    disabled
                    className="flex-1 px-4 py-3 rounded-xl bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary cursor-not-allowed"
                    style={{ border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.bio}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={t.bioPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all resize-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.philosophy}
                </label>
                <textarea
                  value={formData.philosophy}
                  onChange={(e) => setFormData(prev => ({ ...prev, philosophy: e.target.value }))}
                  placeholder={t.philosophyPlaceholder}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all resize-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Social Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5" style={{ color: 'var(--icon-sky)' }} />
              <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark">
                {t.socialSection}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  <Instagram className="w-4 h-4 inline mr-1" />
                  {t.instagram}
                </label>
                <input
                  type="text"
                  value={formData.instagram_handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                  placeholder={t.instagramPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.youtube}
                </label>
                <input
                  type="text"
                  value={formData.youtube_handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtube_handle: e.target.value }))}
                  placeholder={t.youtubePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.tiktok}
                </label>
                <input
                  type="text"
                  value={formData.tiktok_handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                  placeholder={t.tiktokPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.website}
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder={t.websitePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5" style={{ color: 'var(--icon-terracotta)' }} />
              <h2 className="font-quicksand text-xl font-bold text-foreground dark:text-foreground-dark">
                {t.paymentSection}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t.payoutEmail}
                </label>
                <input
                  type="email"
                  value={formData.payout_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, payout_email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.payoutEmailDesc}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-secondary dark:bg-surface-dark rounded-xl" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground-dark">{t.stripeConnect}</p>
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                    {creator?.stripe_account_id ? t.stripeConnected : t.stripeNotConnected}
                  </p>
                </div>
                {!creator?.stripe_account_id && (
                  <Button variant="outline" size="sm" disabled style={{ border: '1px solid var(--border)' }}>
                    {t.connectStripe}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-sage/10 rounded-xl">
                <p className="text-foreground dark:text-foreground-dark">{t.commissionRate}</p>
                <p className="font-bold text-sage">{((creator?.commission_rate || 0.9) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-sage hover:bg-sage-light text-white py-3 rounded-xl font-semibold"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t.saving}
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t.saved}
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t.error}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
