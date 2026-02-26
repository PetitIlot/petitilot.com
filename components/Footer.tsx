import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'

export default function Footer({ lang }: { lang: string }) {
  const currentYear = new Date().getFullYear()

  const links = {
    fr: {
      follow: 'Suivez-nous',
      home: 'Accueil',
      resources: 'Ressources',
      books: 'Livres',
      games: 'Jeux',
      legal: 'Mentions légales',
      madeWith: 'Fait avec',
      inMontreal: 'à Montréal',
    },
    en: {
      follow: 'Follow us',
      home: 'Home',
      resources: 'Resources',
      books: 'Books',
      games: 'Games',
      legal: 'Legal Notice',
      madeWith: 'Made with',
      inMontreal: 'in Montreal',
    },
    es: {
      follow: 'Síguenos',
      home: 'Inicio',
      resources: 'Recursos',
      books: 'Libros',
      games: 'Juegos',
      legal: 'Aviso legal',
      madeWith: 'Hecho con',
      inMontreal: 'en Montreal',
    },
  }

  const t = links[lang as keyof typeof links] || links.fr

  return (
    <footer className="relative z-10 px-4 pb-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="floating-glass-bar-footer rounded-[24px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-full bg-sage/80 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">PI</span>
                </div>
                <span className="text-sm font-semibold text-foreground dark:text-foreground-dark tracking-tight">
                  Petit Îlot
                </span>
              </div>
              <p className="text-xs text-foreground/50 dark:text-foreground-dark/50 leading-relaxed max-w-xs">
                Ressources éducatives 0-6 ans créées par des éducateurs passionnés.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[11px] font-semibold text-foreground/40 dark:text-foreground-dark/40 mb-3 uppercase tracking-wider">
                Navigation
              </h4>
              <nav className="flex flex-col gap-1.5">
                <Link href={`/${lang}`} className="text-xs text-foreground/60 dark:text-foreground-dark/60 hover:text-foreground dark:hover:text-foreground-dark transition-colors">
                  {t.home}
                </Link>
                <Link href={`/${lang}/activites`} className="text-xs text-foreground/60 dark:text-foreground-dark/60 hover:text-foreground dark:hover:text-foreground-dark transition-colors">
                  {t.resources}
                </Link>
                {/* MASQUÉ TEMPORAIREMENT - Droits d'auteur à clarifier */}
                <Link href={`/${lang}/mentions-legales`} className="text-xs text-foreground/60 dark:text-foreground-dark/60 hover:text-foreground dark:hover:text-foreground-dark transition-colors">
                  {t.legal}
                </Link>
              </nav>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-[11px] font-semibold text-foreground/40 dark:text-foreground-dark/40 mb-3 uppercase tracking-wider">
                {t.follow}
              </h4>
              <div className="flex gap-2">
                <a
                  href="https://instagram.com/petitilot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-foreground/50 dark:text-foreground-dark/50 hover:bg-sage/20 hover:text-sage transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com/@petitilot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-foreground/50 dark:text-foreground-dark/50 hover:bg-foreground/10 dark:hover:bg-foreground-dark/10 hover:text-foreground dark:hover:text-foreground-dark transition-all duration-200"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@petitilot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-foreground/50 dark:text-foreground-dark/50 hover:bg-terracotta/20 hover:text-terracotta transition-all duration-200"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-5 border-t border-white/8 dark:border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-foreground/35 dark:text-foreground-dark/35">
              <p className="flex items-center gap-1.5">
                {t.madeWith}{' '}
                <svg className="w-3 h-3 text-terracotta/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>{' '}
                {t.inMontreal}
              </p>
              <p>© {currentYear} Petit Îlot</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
