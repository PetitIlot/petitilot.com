'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Sparkles, Users, DollarSign, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Devenir Créateur',
    subtitle: 'Partagez vos ressources éducatives avec la communauté Petit Ilot',
    benefit1: 'Publiez vos ressources',
    benefit1Desc: 'Partagez vos activités, fiches et créations avec des milliers de parents',
    benefit2: 'Gagnez des revenus',
    benefit2Desc: 'Recevez 90% des ventes de vos ressources',
    benefit3: 'Rejoignez la communauté',
    benefit3Desc: 'Connectez-vous avec d\'autres éducateurs passionnés',
    benefit4: 'Faites la différence',
    benefit4Desc: 'Aidez les familles à offrir le meilleur à leurs enfants',
    displayName: 'Nom d\'affichage',
    displayNamePlaceholder: 'Ex: Marie Éducatrice',
    slug: 'URL personnalisée',
    slugPlaceholder: 'marie-educatrice',
    slugHelp: 'petitilot.com/createurs/',
    bio: 'Courte bio',
    bioPlaceholder: 'Présentez-vous en quelques mots...',
    philosophy: 'Votre philosophie éducative',
    philosophyPlaceholder: 'Qu\'est-ce qui vous anime dans l\'éducation des enfants ?',
    submit: 'Soumettre ma candidature',
    submitting: 'Envoi en cours...',
    success: 'Candidature envoyée !',
    successDesc: 'Nous examinons votre candidature et vous répondrons sous 48h.',
    back: 'Retour',
    alreadyCreator: 'Vous êtes déjà créateur !',
    goToDashboard: 'Aller au dashboard',
    loginFirst: 'Connectez-vous pour devenir créateur',
    login: 'Se connecter'
  },
  en: {
    title: 'Become a Creator',
    subtitle: 'Share your educational resources with the Petit Ilot community',
    benefit1: 'Publish your resources',
    benefit1Desc: 'Share your activities, worksheets, and creations with thousands of parents',
    benefit2: 'Earn revenue',
    benefit2Desc: 'Receive 90% of your resource sales',
    benefit3: 'Join the community',
    benefit3Desc: 'Connect with other passionate educators',
    benefit4: 'Make a difference',
    benefit4Desc: 'Help families give the best to their children',
    displayName: 'Display name',
    displayNamePlaceholder: 'Ex: Marie Educator',
    slug: 'Custom URL',
    slugPlaceholder: 'marie-educator',
    slugHelp: 'petitilot.com/creators/',
    bio: 'Short bio',
    bioPlaceholder: 'Introduce yourself in a few words...',
    philosophy: 'Your educational philosophy',
    philosophyPlaceholder: 'What drives you in educating children?',
    submit: 'Submit my application',
    submitting: 'Submitting...',
    success: 'Application sent!',
    successDesc: 'We will review your application and respond within 48 hours.',
    back: 'Back',
    alreadyCreator: 'You are already a creator!',
    goToDashboard: 'Go to dashboard',
    loginFirst: 'Log in to become a creator',
    login: 'Log in'
  },
  es: {
    title: 'Conviértete en Creador',
    subtitle: 'Comparte tus recursos educativos con la comunidad Petit Ilot',
    benefit1: 'Publica tus recursos',
    benefit1Desc: 'Comparte tus actividades y creaciones con miles de padres',
    benefit2: 'Gana ingresos',
    benefit2Desc: 'Recibe el 90% de las ventas de tus recursos',
    benefit3: 'Únete a la comunidad',
    benefit3Desc: 'Conecta con otros educadores apasionados',
    benefit4: 'Marca la diferencia',
    benefit4Desc: 'Ayuda a las familias a dar lo mejor a sus hijos',
    displayName: 'Nombre visible',
    displayNamePlaceholder: 'Ej: María Educadora',
    slug: 'URL personalizada',
    slugPlaceholder: 'maria-educadora',
    slugHelp: 'petitilot.com/creadores/',
    bio: 'Bio corta',
    bioPlaceholder: 'Preséntate en pocas palabras...',
    philosophy: 'Tu filosofía educativa',
    philosophyPlaceholder: '¿Qué te motiva en la educación infantil?',
    submit: 'Enviar mi solicitud',
    submitting: 'Enviando...',
    success: '¡Solicitud enviada!',
    successDesc: 'Revisaremos tu solicitud y responderemos en 48 horas.',
    back: 'Volver',
    alreadyCreator: '¡Ya eres creador!',
    goToDashboard: 'Ir al panel',
    loginFirst: 'Inicia sesión para convertirte en creador',
    login: 'Iniciar sesión'
  }
}

export default function BecomeCreatorPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [user, setUser] = useState<any>(null)
  const [existingCreator, setExistingCreator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    displayName: '',
    slug: '',
    bio: '',
    philosophy: ''
  })

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data: creator } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        setExistingCreator(creator)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    const supabase = createClient()
    const { error } = await supabase.from('creators').insert({
      user_id: user.id,
      slug: formData.slug,
      display_name: formData.displayName,
      bio: formData.bio,
      philosophy: formData.philosophy,
      is_approved: false,
      cgu_accepted_at: new Date().toISOString()
    })

    if (error) {
      console.error('Error creating creator:', error.message, error.code, error.details, error.hint)
      alert(`Erreur: ${error.message}`)
      setIsSubmitting(false)
      return
    }

    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.loginFirst}
          </h1>
          <Link href={`/${lang}/connexion?redirect=/${lang}/devenir-createur`}>
            <Button className="mt-4 bg-sage hover:bg-sage-light text-white">
              {t.login}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Already a creator
  if (existingCreator) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.alreadyCreator}
          </h1>
          <Link href={`/${lang}/createur`}>
            <Button className="mt-4 bg-sage hover:bg-sage-light text-white">
              {t.goToDashboard}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.success}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto">
            {t.successDesc}
          </p>
          <Link href={`/${lang}`}>
            <Button variant="outline" className="mt-6" style={{ border: '1px solid var(--border)' }}>
              {t.back}
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href={`/${lang}`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
            <h1 className="font-quicksand text-4xl font-bold text-foreground dark:text-foreground-dark mb-2">
              {t.title}
            </h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Sparkles, title: t.benefit1, desc: t.benefit1Desc, color: 'var(--icon-sage)' },
              { icon: DollarSign, title: t.benefit2, desc: t.benefit2Desc, color: 'var(--icon-sage)' },
              { icon: Users, title: t.benefit3, desc: t.benefit3Desc, color: 'var(--icon-sky)' },
              { icon: Heart, title: t.benefit4, desc: t.benefit4Desc, color: 'var(--icon-terracotta)' }
            ].map((benefit, i) => (
              <div key={i} className="bg-surface dark:bg-surface-dark rounded-2xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
                <benefit.icon className="w-8 h-8 mx-auto mb-2" style={{ color: benefit.color }} />
                <h3 className="font-semibold text-foreground dark:text-foreground-dark text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-8" style={{ border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.displayName} *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder={t.displayNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.slug} *
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mr-2">{t.slugHelp}</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t.slugPlaceholder}
                    className="flex-1 px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                    style={{ border: '1px solid var(--border)' }}
                    required
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

              <Button
                type="submit"
                disabled={isSubmitting || !formData.displayName || !formData.slug}
                className="w-full bg-sage hover:bg-sage-light text-white py-3 rounded-xl font-semibold"
              >
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
