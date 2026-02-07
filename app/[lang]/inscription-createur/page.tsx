'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Sparkles, PartyPopper } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'

const translations = {
  fr: {
    title: 'Bienvenue chez les créateurs !',
    subtitle: 'Complétez votre profil pour commencer à publier',
    displayName: 'Nom d\'affichage',
    displayNamePlaceholder: 'Ex: Marie Éducatrice',
    displayNameHelp: 'Le nom visible par les utilisateurs',
    slug: 'URL personnalisée',
    slugPlaceholder: 'marie-educatrice',
    slugHelp: 'petitilot.com/createurs/',
    slugTaken: 'Cette URL est déjà prise',
    bio: 'Courte bio',
    bioPlaceholder: 'Présentez-vous en quelques mots...',
    bioHelp: 'Apparaît sur votre page créateur',
    philosophy: 'Votre philosophie éducative',
    philosophyPlaceholder: 'Qu\'est-ce qui vous anime dans l\'éducation des enfants ?',
    cguLabel: 'J\'accepte les',
    cguLink: 'Conditions Générales d\'Utilisation',
    cguCreator: 'pour les créateurs',
    cguRequired: 'Vous devez accepter les CGU pour continuer',
    submit: 'Créer mon profil créateur',
    submitting: 'Création en cours...',
    success: 'Profil créé avec succès !',
    successDesc: 'Vous pouvez maintenant publier vos ressources.',
    goToDashboard: 'Aller au dashboard',
    back: 'Retour',
    notInvited: 'Vous n\'avez pas encore été invité',
    notInvitedDesc: 'Vous devez d\'abord postuler ou être invité par un administrateur.',
    apply: 'Postuler',
    alreadyCreator: 'Vous êtes déjà créateur !',
    loginFirst: 'Connectez-vous pour continuer',
    login: 'Se connecter'
  },
  en: {
    title: 'Welcome to the creators!',
    subtitle: 'Complete your profile to start publishing',
    displayName: 'Display name',
    displayNamePlaceholder: 'Ex: Marie Educator',
    displayNameHelp: 'The name visible to users',
    slug: 'Custom URL',
    slugPlaceholder: 'marie-educator',
    slugHelp: 'petitilot.com/creators/',
    slugTaken: 'This URL is already taken',
    bio: 'Short bio',
    bioPlaceholder: 'Introduce yourself in a few words...',
    bioHelp: 'Appears on your creator page',
    philosophy: 'Your educational philosophy',
    philosophyPlaceholder: 'What drives you in educating children?',
    cguLabel: 'I accept the',
    cguLink: 'Terms of Service',
    cguCreator: 'for creators',
    cguRequired: 'You must accept the Terms to continue',
    submit: 'Create my creator profile',
    submitting: 'Creating...',
    success: 'Profile created successfully!',
    successDesc: 'You can now publish your resources.',
    goToDashboard: 'Go to dashboard',
    back: 'Back',
    notInvited: 'You have not been invited yet',
    notInvitedDesc: 'You must first apply or be invited by an administrator.',
    apply: 'Apply',
    alreadyCreator: 'You are already a creator!',
    loginFirst: 'Log in to continue',
    login: 'Log in'
  },
  es: {
    title: '¡Bienvenido a los creadores!',
    subtitle: 'Completa tu perfil para empezar a publicar',
    displayName: 'Nombre visible',
    displayNamePlaceholder: 'Ej: María Educadora',
    displayNameHelp: 'El nombre visible para los usuarios',
    slug: 'URL personalizada',
    slugPlaceholder: 'maria-educadora',
    slugHelp: 'petitilot.com/creadores/',
    slugTaken: 'Esta URL ya está en uso',
    bio: 'Bio corta',
    bioPlaceholder: 'Preséntate en pocas palabras...',
    bioHelp: 'Aparece en tu página de creador',
    philosophy: 'Tu filosofía educativa',
    philosophyPlaceholder: '¿Qué te motiva en la educación infantil?',
    cguLabel: 'Acepto los',
    cguLink: 'Términos y Condiciones',
    cguCreator: 'para creadores',
    cguRequired: 'Debes aceptar los términos para continuar',
    submit: 'Crear mi perfil de creador',
    submitting: 'Creando...',
    success: '¡Perfil creado con éxito!',
    successDesc: 'Ya puedes publicar tus recursos.',
    goToDashboard: 'Ir al panel',
    back: 'Volver',
    notInvited: 'Aún no has sido invitado',
    notInvitedDesc: 'Primero debes postularte o ser invitado por un administrador.',
    apply: 'Postularse',
    alreadyCreator: '¡Ya eres creador!',
    loginFirst: 'Inicia sesión para continuar',
    login: 'Iniciar sesión'
  }
}

export default function CreatorRegistrationPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [user, setUser] = useState<any>(null)
  const [creator, setCreator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [slugError, setSlugError] = useState('')
  const [cguAccepted, setCguAccepted] = useState(false)
  const [cguError, setCguError] = useState(false)

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
        const { data: creatorData } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        setCreator(creatorData)

        // Pré-remplir avec le nom existant si disponible
        if (creatorData?.display_name) {
          setFormData(prev => ({ ...prev, displayName: creatorData.display_name }))
        }
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
    setSlugError('')
  }

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return true

    const supabase = createClient()
    const { data } = await supabase
      .from('creators')
      .select('id')
      .eq('slug', slug)
      .neq('user_id', user?.id)
      .single()

    return !data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !creator) return

    // Vérifier CGU
    if (!cguAccepted) {
      setCguError(true)
      return
    }

    setIsSubmitting(true)
    setCguError(false)

    // Vérifier disponibilité du slug
    const isAvailable = await checkSlugAvailability(formData.slug)
    if (!isAvailable) {
      setSlugError(t.slugTaken)
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()

    // Mettre à jour l'entrée creator existante avec les infos complètes
    const { error } = await supabase
      .from('creators')
      .update({
        slug: formData.slug,
        display_name: formData.displayName,
        bio: formData.bio,
        philosophy: formData.philosophy,
        cgu_accepted_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating creator:', error.message)
      alert(`Erreur: ${error.message}`)
      setIsSubmitting(false)
      return
    }

    // Mettre à jour le rôle dans profiles
    await supabase
      .from('profiles')
      .update({ role: 'creator' })
      .eq('id', user.id)

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
          <Link href={`/${lang}/connexion?redirect=/${lang}/inscription-createur`}>
            <Button className="mt-4 bg-sage hover:bg-sage-light text-white">
              {t.login}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // No creator entry or not approved → not invited
  if (!creator || !creator.is_approved) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sky)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.notInvited}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto mb-4">
            {t.notInvitedDesc}
          </p>
          <Link href={`/${lang}/devenir-createur`}>
            <Button className="mt-4 bg-sage hover:bg-sage-light text-white">
              {t.apply}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Already has slug → already a creator
  if (creator.slug) {
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
          <PartyPopper className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
            {t.success}
          </h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto">
            {t.successDesc}
          </p>
          <Link href={`/${lang}/createur`}>
            <Button className="mt-6 bg-sage hover:bg-sage-light text-white">
              {t.goToDashboard}
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  // Registration form (approved but no slug)
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${lang}/profil`}>
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
          <div className="text-center mb-10">
            <PartyPopper className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
            <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
              {t.title}
            </h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg">
              {t.subtitle}
            </p>
          </div>

          {/* Registration Form */}
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
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">
                  {t.displayNameHelp}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.slug} *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary whitespace-nowrap">
                    {t.slugHelp}
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t.slugPlaceholder}
                    className={`flex-1 px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30 ${slugError ? 'ring-2 ring-red-500' : ''}`}
                    style={{ border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                {slugError && (
                  <p className="text-xs text-red-500 mt-1">{slugError}</p>
                )}
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
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">
                  {t.bioHelp}
                </p>
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

              {/* CGU Checkbox */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cguAccepted}
                    onChange={(e) => {
                      setCguAccepted(e.target.checked)
                      setCguError(false)
                    }}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-sage focus:ring-sage"
                  />
                  <span className="text-sm text-foreground dark:text-foreground-dark">
                    {t.cguLabel}{' '}
                    <Link
                      href={`/${lang}/cgu-createurs`}
                      target="_blank"
                      className="text-sage hover:underline"
                    >
                      {t.cguLink}
                    </Link>{' '}
                    {t.cguCreator}
                  </span>
                </label>
                {cguError && (
                  <p className="text-xs text-red-500">{t.cguRequired}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.displayName || !formData.slug || !cguAccepted}
                className="w-full py-3 rounded-xl font-semibold text-white transition-colors"
                style={{
                  backgroundColor: isSubmitting || !formData.displayName || !formData.slug || !cguAccepted ? '#9ca3af' : '#B794C0',
                  cursor: isSubmitting || !formData.displayName || !formData.slug || !cguAccepted ? 'not-allowed' : 'pointer'
                }}
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
