'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Sparkles, Leaf, Instagram, Facebook, HandHeart, ChefHat, Scissors, Palette, Brain, Music, Globe } from 'lucide-react'

// Code secret dans variable d'environnement (pas sur GitHub)
const SECRET_CODE = process.env.NEXT_PUBLIC_SITE_ACCESS_CODE || ''

type Language = 'fr' | 'en' | 'es'

const translations = {
  fr: {
    badge: 'Bientôt disponible',
    heroLine1: "L'éducation par la",
    heroHighlight: 'nature',
    heroLine2: ', sans écran.',
    subtitle: "Découvrez une marketplace unique d'activités éducatives pour enfants de 0 à 6 ans. Créées par des passionnés, pour les familles.",
    emailPlaceholder: 'Votre email',
    join: 'Rejoindre',
    emailNote: 'Soyez parmi les premiers informés du lancement.',
    thanks: 'Merci !',
    thanksNote: 'Nous vous préviendrons dès le lancement.',
    madeWith: 'Fait avec amour à Montréal',
    categories: {
      fineMotor: 'Motricité fine',
      recipes: 'Recettes',
      diy: 'DIY',
      art: 'Art & Créativité',
      cognitive: 'Éveil cognitif',
      music: 'Musique',
    }
  },
  en: {
    badge: 'Coming soon',
    heroLine1: 'Education through',
    heroHighlight: 'nature',
    heroLine2: ', screen-free.',
    subtitle: 'Discover a unique marketplace of educational activities for children aged 0-6. Created by passionate educators, for families.',
    emailPlaceholder: 'Your email',
    join: 'Join',
    emailNote: 'Be among the first to know when we launch.',
    thanks: 'Thank you!',
    thanksNote: "We'll notify you when we launch.",
    madeWith: 'Made with love in Montreal',
    categories: {
      fineMotor: 'Fine motor',
      recipes: 'Recipes',
      diy: 'DIY',
      art: 'Art & Creativity',
      cognitive: 'Cognitive skills',
      music: 'Music',
    }
  },
  es: {
    badge: 'Próximamente',
    heroLine1: 'Educación a través de la',
    heroHighlight: 'naturaleza',
    heroLine2: ', sin pantallas.',
    subtitle: 'Descubre un marketplace único de actividades educativas para niños de 0 a 6 años. Creadas por educadores apasionados, para familias.',
    emailPlaceholder: 'Tu email',
    join: 'Unirse',
    emailNote: 'Sé de los primeros en saber cuando lancemos.',
    thanks: '¡Gracias!',
    thanksNote: 'Te avisaremos cuando lancemos.',
    madeWith: 'Hecho con amor en Montreal',
    categories: {
      fineMotor: 'Motricidad fina',
      recipes: 'Recetas',
      diy: 'DIY',
      art: 'Arte y Creatividad',
      cognitive: 'Desarrollo cognitivo',
      music: 'Música',
    }
  }
}

const languageNames: Record<Language, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES'
}

export default function ComingSoonPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [typedKeys, setTypedKeys] = useState('')
  const [lang, setLang] = useState<Language>('fr')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  const t = translations[lang]

  // Secret code detection
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    setTypedKeys(prev => {
      const newTyped = (prev + e.key).slice(-SECRET_CODE.length)

      if (newTyped === SECRET_CODE) {
        // Set cookie to bypass protection (expires in 30 days)
        document.cookie = `site_access=granted; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
        router.push(`/${lang}`)
      }

      return newTyped
    })
  }, [router, lang])

  useEffect(() => {
    setMounted(true)

    // Load saved language preference
    const savedLang = localStorage.getItem('preferred_lang') as Language
    if (savedLang && ['fr', 'en', 'es'].includes(savedLang)) {
      setLang(savedLang)
    }

    // Detect system dark mode preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches)
    darkModeMediaQuery.addEventListener('change', handleChange)

    // Listen for keypress
    window.addEventListener('keypress', handleKeyPress)

    // Close language menu on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleKeyPress])

  const changeLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('preferred_lang', newLang)
    setShowLangMenu(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulation d'envoi (à connecter à Supabase/Mailchimp plus tard)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  const categories = [
    { icon: HandHeart, label: t.categories.fineMotor, color: '#A8B5A0' },
    { icon: ChefHat, label: t.categories.recipes, color: '#D4A59A' },
    { icon: Scissors, label: t.categories.diy, color: '#C8D8E4' },
    { icon: Palette, label: t.categories.art, color: '#CCA6C8' },
    { icon: Brain, label: t.categories.cognitive, color: '#5AC8FA' },
    { icon: Music, label: t.categories.music, color: '#F5A623' },
  ]

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? 'dark' : ''}`}>
      <div className="absolute inset-0 bg-[#FAFAF8] dark:bg-[#0A0A0A]" />
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-[120px] animate-blob"
          style={{ background: 'linear-gradient(135deg, #A8B5A0, #7A8B6F)' }}
        />
        <div
          className="absolute -bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-15 blur-[100px] animate-blob animation-delay-2000"
          style={{ background: 'linear-gradient(135deg, #C8D8E4, #5AC8FA)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-10 blur-[80px] animate-blob animation-delay-4000"
          style={{ background: 'linear-gradient(135deg, #D4A59A, #C9A092)' }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 py-8 sm:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A8B5A0] to-[#7A8B6F] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#1D1D1F] dark:text-white tracking-tight">
                Petit Ilot
              </span>
            </div>

            {/* Language selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 dark:bg-white/10 border border-[#E5E5E5]/50 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#86868B] dark:text-[#A1A1A6]" />
                <span className="text-sm font-medium text-[#1D1D1F] dark:text-white">{languageNames[lang]}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 py-1 bg-white dark:bg-[#2C2C2E] rounded-lg shadow-lg border border-[#E5E5E5] dark:border-[#3A3A3C] min-w-[80px] z-50">
                  {(['fr', 'en', 'es'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLang(l)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F7] dark:hover:bg-[#3A3A3C] transition-colors ${
                        l === lang ? 'text-[#7A8B6F] font-medium' : 'text-[#1D1D1F] dark:text-white'
                      }`}
                    >
                      {languageNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div
            className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A8B5A0]/10 dark:bg-[#A8B5A0]/20 border border-[#A8B5A0]/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#7A8B6F] dark:text-[#A8B5A0]" />
              <span className="text-sm font-medium text-[#7A8B6F] dark:text-[#A8B5A0]">
                {t.badge}
              </span>
            </div>

            {/* Hero title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1D1D1F] dark:text-white tracking-tight leading-[1.1] mb-6">
              {t.heroLine1}{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-[#7A8B6F] via-[#A8B5A0] to-[#C9A092] bg-clip-text text-transparent">
                  {t.heroHighlight}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#A8B5A0]/30 to-[#C9A092]/30 blur-sm" />
              </span>
              <br className="hidden sm:block" />
              {t.heroLine2}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#86868B] dark:text-[#A1A1A6] max-w-xl mx-auto mb-12 leading-relaxed">
              {t.subtitle}
            </p>

            {/* Email signup form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#A8B5A0] via-[#C8D8E4] to-[#D4A59A] rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-[#E5E5E5] dark:border-[#3A3A3C] shadow-lg">
                    <div className="flex items-center gap-2 flex-1 px-3">
                      <Mail className="w-5 h-5 text-[#86868B] shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="flex-1 py-2 bg-transparent text-[#1D1D1F] dark:text-white placeholder:text-[#86868B] focus:outline-none text-base"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] font-medium hover:bg-[#333] dark:hover:bg-[#F5F5F7] transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="hidden sm:inline">{t.join}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#86868B]">
                  {t.emailNote}
                </p>
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-16 p-6 rounded-2xl bg-[#A8B5A0]/10 dark:bg-[#A8B5A0]/20 border border-[#A8B5A0]/20">
                <div className="flex items-center justify-center gap-2 text-[#7A8B6F] dark:text-[#A8B5A0]">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">{t.thanks}</span>
                </div>
                <p className="mt-2 text-[#86868B] dark:text-[#A1A1A6]">
                  {t.thanksNote}
                </p>
              </div>
            )}

            {/* Categories preview */}
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              {categories.map((item, index) => (
                <div
                  key={item.label}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 dark:bg-white/5 border border-[#E5E5E5]/50 dark:border-white/10 backdrop-blur-sm hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color: item.color }} />
                  <span className="text-sm font-medium text-[#1D1D1F] dark:text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8 sm:px-12">
          {/* Social & Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <a
              href="https://instagram.com/petitilot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#86868B] hover:text-[#E4405F] transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm font-medium">@petitilot</span>
            </a>
            <a
              href="https://facebook.com/petitilot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#86868B] hover:text-[#1877F2] transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span className="text-sm font-medium">@petitilot</span>
            </a>
            <a
              href="mailto:contact@petitilot.ca"
              className="flex items-center gap-2 text-[#86868B] hover:text-[#7A8B6F] transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">contact@petitilot.ca</span>
            </a>
          </div>

          <p className="text-sm text-[#86868B] dark:text-[#A1A1A6] text-center">
            {t.madeWith} 🍁
          </p>
        </footer>
      </div>

    </div>
  )
}
