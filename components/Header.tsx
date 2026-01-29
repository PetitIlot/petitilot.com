'use client'

import Link from 'next/link'
import { Search, Menu, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationBell from '@/components/notifications/NotificationBell'
import type { Language } from '@/lib/types'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

const translations = {
  fr: {
    home: 'Accueil',
    resources: 'Ressources',
    books: 'Livres',
    games: 'Jeux',
    about: 'À propos',
    contact: 'Contact',
  },
  en: {
    home: 'Home',
    resources: 'Resources',
    books: 'Books',
    games: 'Games',
    about: 'About',
    contact: 'Contact',
  },
  es: {
    home: 'Inicio',
    resources: 'Recursos',
    books: 'Libros',
    games: 'Juegos',
    about: 'Acerca de',
    contact: 'Contacto',
  },
}

export default function Header({ lang }: { lang: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const t = translations[lang as keyof typeof translations] || translations.fr

  useEffect(() => {
    const handleClickOutside = () => setLangOpen(false)
    if (langOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [langOpen])

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { label: t.home, href: `/${lang}` },
    { label: t.resources, href: `/${lang}/activites` },
    // MASQUÉ TEMPORAIREMENT - Droits d'auteur à clarifier
    // { label: t.books, href: `/${lang}/livres` },
    // { label: t.games, href: `/${lang}/jeux` },
    { label: t.about, href: `/${lang}/a-propos` },
    { label: t.contact, href: `/${lang}/contact` },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 liquid-glass">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-sage/80 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-semibold text-sm">PI</span>
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">
              Petit Îlot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href={`/${lang}/recherche`}>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            <Link href={isLoggedIn ? `/${lang}/profil` : `/${lang}/connexion`}>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5">
                {isLoggedIn ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              </Button>
            </Link>

            <NotificationBell lang={lang as Language} isLoggedIn={isLoggedIn} />
            <ThemeToggle />

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangOpen(!langOpen)}
                className="text-foreground/70 hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 font-medium px-3 text-sm"
              >
                {lang.toUpperCase()}
              </Button>
              {langOpen && (
                <div className="absolute right-0 mt-2 liquid-glass rounded-apple-lg shadow-apple-elevated overflow-hidden min-w-[100px] animate-scale-in">
                  {[
                    { code: 'fr', label: 'Français' },
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                  ].map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                        l.code === lang
                          ? 'bg-white/20 text-foreground'
                          : 'text-foreground/80 hover:bg-white/10'
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground py-3 px-5 rounded-[16px] hover:bg-white/15 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
