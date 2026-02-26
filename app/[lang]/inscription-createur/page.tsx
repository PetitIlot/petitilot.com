'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Sparkles, PartyPopper, Camera, X, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'

// Thèmes éducatifs suggérés
const SUGGESTED_THEMES = [
  'Montessori', 'Waldorf', 'Nature', 'DIY', 'Motricité', 'Langage',
  'Mathématiques', 'Créativité', 'Musique', 'Éveil sensoriel', 'Autonomie',
  'Arts plastiques', 'Lecture', 'Sciences', 'Plein air', 'Jeu libre',
  'Cuisine', 'Jardinage', 'Émotions', 'Vivre ensemble'
]

const translations = {
  fr: {
    title: 'Bienvenue chez les créateurs !',
    subtitle: 'Complétez votre profil pour commencer à publier',
    avatarSection: 'Photo de profil',
    avatarHint: 'Cliquez pour ajouter une photo (recommandé)',
    avatarUploading: 'Upload en cours...',
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
    themesSection: 'Thèmes & approches éducatives',
    themesHint: 'Sélectionnez ou ajoutez vos thèmes (max 8)',
    themesAdd: 'Ajouter',
    themesPlaceholder: 'Autre thème...',
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
    avatarSection: 'Profile photo',
    avatarHint: 'Click to add a photo (recommended)',
    avatarUploading: 'Uploading...',
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
    themesSection: 'Themes & educational approaches',
    themesHint: 'Select or add your themes (max 8)',
    themesAdd: 'Add',
    themesPlaceholder: 'Other theme...',
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
    avatarSection: 'Foto de perfil',
    avatarHint: 'Haz clic para agregar una foto (recomendado)',
    avatarUploading: 'Subiendo...',
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
    themesSection: 'Temas y enfoques educativos',
    themesHint: 'Selecciona o agrega tus temas (máx 8)',
    themesAdd: 'Agregar',
    themesPlaceholder: 'Otro tema...',
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

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // Themes
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [customTheme, setCustomTheme] = useState('')

  const [formData, setFormData] = useState({
    displayName: '',
    slug: '',
    bio: '',
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

        if (creatorData?.display_name) {
          setFormData(prev => ({ ...prev, displayName: creatorData.display_name }))
        }
        if (creatorData?.avatar_url) {
          setAvatarPreview(creatorData.avatar_url)
        }
        if (creatorData?.themes) {
          setSelectedThemes(creatorData.themes)
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const toggleTheme = (theme: string) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(prev => prev.filter(t => t !== theme))
    } else if (selectedThemes.length < 8) {
      setSelectedThemes(prev => [...prev, theme])
    }
  }

  const addCustomTheme = () => {
    const trimmed = customTheme.trim()
    if (!trimmed || selectedThemes.includes(trimmed) || selectedThemes.length >= 8) return
    setSelectedThemes(prev => [...prev, trimmed])
    setCustomTheme('')
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

  const uploadAvatar = async (creatorId: string): Promise<string | null> => {
    if (!avatarFile) return null
    setAvatarUploading(true)
    const supabase = createClient()
    const ext = avatarFile.name.split('.').pop()
    const path = `avatars/${creatorId}.${ext}`
    const { error } = await supabase.storage
      .from('creator-assets')
      .upload(path, avatarFile, { upsert: true })
    setAvatarUploading(false)
    if (error) { console.error('Avatar upload error:', error); return null }
    const { data: { publicUrl } } = supabase.storage.from('creator-assets').getPublicUrl(path)
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !creator) return

    if (!cguAccepted) { setCguError(true); return }

    setIsSubmitting(true)
    setCguError(false)

    const isAvailable = await checkSlugAvailability(formData.slug)
    if (!isAvailable) {
      setSlugError(t.slugTaken)
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()

    // Upload avatar si présent
    let avatarUrl: string | null = creator.avatar_url || null
    if (avatarFile) {
      avatarUrl = await uploadAvatar(creator.id)
    }

    const { error } = await supabase
      .from('creators')
      .update({
        slug: formData.slug,
        display_name: formData.displayName,
        bio: formData.bio,
        themes: selectedThemes.length > 0 ? selectedThemes : null,
        avatar_url: avatarUrl,
        cgu_accepted_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating creator:', error.message)
      alert(`Erreur: ${error.message}`)
      setIsSubmitting(false)
      return
    }

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">{t.loginFirst}</h1>
          <Link href={`/${lang}/connexion?redirect=/${lang}/inscription-createur`}>
            <Button gem="sage" className="mt-4">{t.login}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!creator || !creator.is_approved) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sky)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">{t.notInvited}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto mb-4">{t.notInvitedDesc}</p>
          <Link href={`/${lang}/devenir-createur`}>
            <Button gem="sage" className="mt-4">{t.apply}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (creator.slug) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">{t.alreadyCreator}</h1>
          <Link href={`/${lang}/createur`}>
            <Button gem="sage" className="mt-4">{t.goToDashboard}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <PartyPopper className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
          <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">{t.success}</h1>
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary max-w-md mx-auto">{t.successDesc}</p>
          <Link href={`/${lang}/createur`}>
            <Button gem="sage" className="mt-6">{t.goToDashboard}</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${lang}/profil`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <PartyPopper className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--icon-sage)' }} />
            <h1 className="font-quicksand text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">{t.title}</h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg">{t.subtitle}</p>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-elevation-1 p-8" style={{ border: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full overflow-hidden group cursor-pointer"
                  style={{ border: '2px dashed var(--border)' }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-secondary dark:bg-surface-dark-secondary">
                      <Camera className="w-8 h-8 text-foreground/30 dark:text-foreground-dark/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                </button>
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
                  {avatarUploading ? t.avatarUploading : t.avatarHint}
                </p>
              </div>

              {/* Display name */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.displayName} *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, displayName: e.target.value }))
                    if (!formData.slug) handleSlugChange(e.target.value)
                  }}
                  placeholder={t.displayNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.displayNameHelp}</p>
              </div>

              {/* Slug */}
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
                {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-2">{t.bio}</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={t.bioPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all resize-none focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                />
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-1">{t.bioHelp}</p>
              </div>

              {/* Themes */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">
                  {t.themesSection}
                </label>
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mb-3">{t.themesHint}</p>

                {/* Selected themes */}
                {selectedThemes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedThemes.map(theme => (
                      <span
                        key={theme}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-sage/20 text-sage"
                      >
                        {theme}
                        <button type="button" onClick={() => toggleTheme(theme)} className="hover:text-sage/60">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested themes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTED_THEMES.filter(t => !selectedThemes.includes(t)).map(theme => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => toggleTheme(theme)}
                      disabled={selectedThemes.length >= 8}
                      className="px-3 py-1 rounded-full text-sm border transition-colors hover:bg-sage/10 hover:border-sage disabled:opacity-40 disabled:cursor-not-allowed text-foreground dark:text-foreground-dark"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      {theme}
                    </button>
                  ))}
                </div>

                {/* Custom theme */}
                {selectedThemes.length < 8 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTheme())}
                      placeholder={t.themesPlaceholder}
                      className="flex-1 px-3 py-2 rounded-lg text-sm bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-sage/30"
                      style={{ border: '1px solid var(--border)' }}
                    />
                    <Button type="button" gem="sage" variant="outline" size="sm" onClick={addCustomTheme}>
                      <Plus className="w-4 h-4 mr-1" />
                      {t.themesAdd}
                    </Button>
                  </div>
                )}
              </div>

              {/* CGU */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cguAccepted}
                    onChange={(e) => { setCguAccepted(e.target.checked); setCguError(false) }}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-sage focus:ring-sage"
                  />
                  <span className="text-sm text-foreground dark:text-foreground-dark">
                    {t.cguLabel}{' '}
                    <Link href={`/${lang}/cgu-createurs`} target="_blank" className="text-sage hover:underline">
                      {t.cguLink}
                    </Link>{' '}
                    {t.cguCreator}
                  </span>
                </label>
                {cguError && <p className="text-xs text-red-500">{t.cguRequired}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.displayName || !formData.slug || !cguAccepted}
                gem="mauve"
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
