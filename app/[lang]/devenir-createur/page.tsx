'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Sparkles, Users, DollarSign, Heart, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Devenir Créateur',
    subtitle: 'Rejoignez la communauté de créateurs Petit Ilot',
    benefit1: 'Publiez vos ressources',
    benefit1Desc: 'Partagez vos activités, fiches et créations avec des milliers de parents',
    benefit2: 'Gagnez des revenus',
    benefit2Desc: 'Recevez 90% des ventes de vos ressources',
    benefit3: 'Rejoignez la communauté',
    benefit3Desc: 'Connectez-vous avec d\'autres éducateurs passionnés',
    benefit4: 'Faites la différence',
    benefit4Desc: 'Aidez les familles à offrir le meilleur à leurs enfants',
    formTitle: 'Postuler pour devenir créateur',
    displayName: 'Votre nom',
    displayNamePlaceholder: 'Ex: Marie Dupont',
    email: 'Email',
    motivation: 'Pourquoi souhaitez-vous devenir créateur ?',
    motivationPlaceholder: 'Parlez-nous de vous, de votre expérience avec les enfants, de ce que vous aimeriez partager...',
    submit: 'Envoyer ma candidature',
    submitting: 'Envoi en cours...',
    success: 'Candidature envoyée !',
    successDesc: 'Merci pour votre intérêt ! Nous examinons votre candidature et vous contacterons par email si elle est retenue.',
    back: 'Retour',
    alreadyApplied: 'Candidature déjà envoyée',
    alreadyAppliedDesc: 'Votre candidature est en cours d\'examen. Nous vous contacterons bientôt !',
    alreadyCreator: 'Vous êtes déjà créateur !',
    goToDashboard: 'Aller au dashboard',
    completeRegistration: 'Compléter mon inscription',
    loginFirst: 'Connectez-vous pour postuler',
    login: 'Se connecter'
  },
  en: {
    title: 'Become a Creator',
    subtitle: 'Join the Petit Ilot creator community',
    benefit1: 'Publish your resources',
    benefit1Desc: 'Share your activities, worksheets, and creations with thousands of parents',
    benefit2: 'Earn revenue',
    benefit2Desc: 'Receive 90% of your resource sales',
    benefit3: 'Join the community',
    benefit3Desc: 'Connect with other passionate educators',
    benefit4: 'Make a difference',
    benefit4Desc: 'Help families give the best to their children',
    formTitle: 'Apply to become a creator',
    displayName: 'Your name',
    displayNamePlaceholder: 'Ex: Marie Dupont',
    email: 'Email',
    motivation: 'Why do you want to become a creator?',
    motivationPlaceholder: 'Tell us about yourself, your experience with children, what you would like to share...',
    submit: 'Submit my application',
    submitting: 'Submitting...',
    success: 'Application sent!',
    successDesc: 'Thank you for your interest! We will review your application and contact you by email if selected.',
    back: 'Back',
    alreadyApplied: 'Application already submitted',
    alreadyAppliedDesc: 'Your application is being reviewed. We will contact you soon!',
    alreadyCreator: 'You are already a creator!',
    goToDashboard: 'Go to dashboard',
    completeRegistration: 'Complete my registration',
    loginFirst: 'Log in to apply',
    login: 'Log in'
  },
  es: {
    title: 'Conviértete en Creador',
    subtitle: 'Únete a la comunidad de creadores de Petit Ilot',
    benefit1: 'Publica tus recursos',
    benefit1Desc: 'Comparte tus actividades y creaciones con miles de padres',
    benefit2: 'Gana ingresos',
    benefit2Desc: 'Recibe el 90% de las ventas de tus recursos',
    benefit3: 'Únete a la comunidad',
    benefit3Desc: 'Conecta con otros educadores apasionados',
    benefit4: 'Marca la diferencia',
    benefit4Desc: 'Ayuda a las familias a dar lo mejor a sus hijos',
    formTitle: 'Solicitar ser creador',
    displayName: 'Tu nombre',
    displayNamePlaceholder: 'Ej: María García',
    email: 'Email',
    motivation: '¿Por qué quieres ser creador?',
    motivationPlaceholder: 'Cuéntanos sobre ti, tu experiencia con niños, lo que te gustaría compartir...',
    submit: 'Enviar mi solicitud',
    submitting: 'Enviando...',
    success: '¡Solicitud enviada!',
    successDesc: '¡Gracias por tu interés! Revisaremos tu solicitud y te contactaremos por email si es seleccionada.',
    back: 'Volver',
    alreadyApplied: 'Solicitud ya enviada',
    alreadyAppliedDesc: 'Tu solicitud está siendo revisada. ¡Te contactaremos pronto!',
    alreadyCreator: '¡Ya eres creador!',
    goToDashboard: 'Ir al panel',
    completeRegistration: 'Completar mi registro',
    loginFirst: 'Inicia sesión para solicitar',
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
    motivation: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    const supabase = createClient()

    // Créer une entrée dans creators avec is_approved: false et PAS de slug
    const { error } = await supabase.from('creators').insert({
      user_id: user.id,
      display_name: formData.displayName,
      application_motivation: formData.motivation,
      is_approved: false,
      // slug: NULL - pas de slug à ce stade
    })

    if (error) {
      console.error('Error creating application:', error.message)
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
            <Button gem="sage" className="mt-4">
              {t.login}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Already has a creator entry
  if (existingCreator) {
    // If approved and has slug → already a creator
    if (existingCreator.is_approved && existingCreator.slug) {
      return (
        <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
            <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
              {t.alreadyCreator}
            </h1>
            <Link href={`/${lang}/createur`}>
              <Button gem="sage" className="mt-4">
                {t.goToDashboard}
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    // If approved but no slug → needs to complete registration
    if (existingCreator.is_approved && !existingCreator.slug) {
      return (
        <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
            <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
              🎉 Invitation acceptée !
            </h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">
              Complétez votre profil créateur pour commencer.
            </p>
            <Link href={`/${lang}/inscription-createur`}>
              <Button gem="sage" className="mt-4">
                {t.completeRegistration}
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    // If not approved → application pending
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Send className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sky)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.alreadyApplied}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto">
            {t.alreadyAppliedDesc}
          </p>
          <Link href={`/${lang}`}>
            <Button variant="outline" className="mt-6" style={{ border: '1px solid var(--border)' }}>
              {t.back}
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

          {/* Simplified Application Form */}
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 p-8" style={{ border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-6">
              {t.formTitle}
            </h2>
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
                  {t.email}
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                  style={{ border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.motivation} *
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder={t.motivationPlaceholder}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all resize-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.displayName || !formData.motivation}
                gem="sage"
                className="w-full py-3 rounded-xl font-semibold transition-colors"
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
