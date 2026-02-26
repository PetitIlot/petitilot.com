'use client'

import Link from 'next/link'
import { Search, User, LogIn, Home, BookOpen, Mail, Palette, X, LayoutDashboard, LogOut } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationBell from '@/components/notifications/NotificationBell'
import type { Language } from '@/lib/types'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const translations = {
  fr: {
    home: 'Accueil',
    resources: 'Ressources',
    about: 'À propos',
    contact: 'Contact',
  },
  en: {
    home: 'Home',
    resources: 'Resources',
    about: 'About',
    contact: 'Contact',
  },
  es: {
    home: 'Inicio',
    resources: 'Recursos',
    about: 'Acerca de',
    contact: 'Contacto',
  },
}

const LOCALES = ['fr', 'en', 'es']

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [langOpen, setLangOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Derive lang from URL path
  const segments = pathname.split('/')
  const lang = LOCALES.includes(segments[1]) ? segments[1] : 'fr'
  const t = translations[lang as keyof typeof translations] || translations.fr

  useEffect(() => {
    const handleClickOutside = () => setLangOpen(false)
    if (langOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [langOpen])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearchValue('')
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  function handleSearchSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const q = searchValue.trim()
    if (q) {
      router.push(`/${lang}/recherche?q=${encodeURIComponent(q)}`)
    }
    setSearchOpen(false)
  }

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async (userId?: string) => {
      if (!userId) {
        setIsLoggedIn(false)
        setIsCreator(false)
        return
      }
      setIsLoggedIn(true)
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      setIsCreator(data?.role === 'creator' || data?.role === 'admin')
    }

    supabase.auth.getUser().then(({ data: { user } }) => checkUser(user?.id))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      checkUser(session?.user?.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  const navLinks = [
    { label: t.home, href: `/${lang}`, icon: Home },
    { label: t.resources, href: `/${lang}/activites`, icon: Palette },
    { label: t.about, href: `/${lang}/a-propos`, icon: BookOpen },
    { label: t.contact, href: `/${lang}/contact`, icon: Mail },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '12px 16px 0',
        pointerEvents: 'none',
      }}
    >
      <div style={{ maxWidth: 896, margin: '0 auto', pointerEvents: 'auto' }}>
        <nav className="floating-glass-bar flex items-center justify-between h-12 px-2">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 pl-3 pr-3 py-1 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 group"
          >
            <span className="text-sm font-semibold text-foreground/90 dark:text-foreground-dark/90 tracking-tight hidden sm:inline">
              Petit Îlot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground/70 dark:text-foreground-dark/70 hover:text-foreground dark:hover:text-foreground-dark rounded-full hover:bg-white/15 dark:hover:bg-white/8 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Search — dropdown bubble */}
            <div className="relative" ref={searchDropdownRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="floating-glass-icon-btn"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 mt-2 floating-glass-dropdown animate-scale-in z-50 p-3"
                  style={{ width: 280 }}>
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <Search className="w-4 h-4 flex-shrink-0 text-foreground/40 dark:text-foreground-dark/40" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                      placeholder="Rechercher…"
                      className="flex-1 bg-transparent text-sm text-foreground dark:text-foreground-dark placeholder:text-foreground/40 dark:placeholder:text-foreground-dark/40 outline-none"
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onClick={() => setSearchValue('')}
                        className="flex-shrink-0 text-foreground/40 dark:text-foreground-dark/40 hover:text-foreground dark:hover:text-foreground-dark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Profile button */}
            {!isLoggedIn ? (
              <Link href={`/${lang}/connexion`}>
                <button className="floating-glass-icon-btn" aria-label="Connexion">
                  <LogIn className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <div className="relative" ref={profileDropdownRef} onClick={(e) => e.stopPropagation()}>
                <button
                  className="floating-glass-icon-btn"
                  aria-label="Profil"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <User className="w-4 h-4" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 floating-glass-dropdown min-w-[160px] animate-scale-in z-50">
                    <Link
                      href={`/${lang}/profil`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground/70 dark:text-foreground-dark/70 hover:text-foreground dark:hover:text-foreground-dark hover:bg-white/10 dark:hover:bg-white/5 rounded-lg mx-1 my-0.5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Espace perso</span>
                    </Link>
                    {isCreator && (
                      <Link
                        href={`/${lang}/createur`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground/70 dark:text-foreground-dark/70 hover:text-foreground dark:hover:text-foreground-dark hover:bg-white/10 dark:hover:bg-white/5 rounded-lg mx-1 my-0.5 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard créateur</span>
                      </Link>
                    )}
                    <hr className="my-1 mx-2 border-white/10 dark:border-white/5" />
                    <button
                      onClick={async () => {
                        setProfileOpen(false)
                        await createClient().auth.signOut()
                        router.push(`/${lang}`)
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/8 rounded-lg mx-1 my-0.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <NotificationBell lang={lang as Language} isLoggedIn={isLoggedIn} />
            <ThemeToggle />

            {/* Language selector */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="floating-glass-icon-btn text-xs font-semibold w-auto px-2"
              >
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 floating-glass-dropdown min-w-[120px] animate-scale-in">
                  {[
                    { code: 'fr', label: 'Français' },
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                  ].map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center px-3 py-2 text-xs font-medium transition-colors rounded-lg mx-1 my-0.5 ${
                        l.code === lang
                          ? 'bg-white/20 dark:bg-white/10 text-foreground dark:text-foreground-dark'
                          : 'text-foreground/70 dark:text-foreground-dark/70 hover:bg-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </nav>

      </div>
    </header>
  )
}
