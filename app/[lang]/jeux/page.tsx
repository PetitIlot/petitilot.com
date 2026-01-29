'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { getRessources } from '@/lib/supabase-queries'
import { Language, Ressource } from '@/lib/types'
import GameCard from '@/components/cards/GameCard'
import { Input } from '@/components/ui/input'

const translations = {
  fr: {
    title: 'Jeux',
    subtitle: 'Jeux éducatifs et ludiques pour apprendre en s\'amusant',
    search: 'Rechercher...',
    results: 'résultats',
    noResults: 'Aucun jeu trouvé'
  },
  en: {
    title: 'Games',
    subtitle: 'Educational and fun games to learn while playing',
    search: 'Search...',
    results: 'results',
    noResults: 'No games found'
  },
  es: {
    title: 'Juegos',
    subtitle: 'Juegos educativos y divertidos para aprender jugando',
    search: 'Buscar...',
    results: 'resultados',
    noResults: 'No se encontraron juegos'
  }
}

export default function JeuxPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')
  const [searchQuery, setSearchQuery] = useState('')
  const [jeux, setJeux] = useState<Ressource[]>([])
  const [filteredJeux, setFilteredJeux] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const fetchJeux = async () => {
      setIsLoading(true)
      const data = await getRessources(['jeu'], lang)
      setJeux(data)
      setFilteredJeux(data)
      setIsLoading(false)
    }
    fetchJeux()
  }, [lang])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = jeux.filter(j =>
        j.title.toLowerCase().includes(query) ||
        j.description?.toLowerCase().includes(query)
      )
      setFilteredJeux(filtered)
    } else {
      setFilteredJeux(jeux)
    }
  }, [jeux, searchQuery])

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-6">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-foreground-dark mb-4">
              {t.title}
            </h1>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary dark:placeholder:text-foreground-dark-secondary"
                style={{ border: '1px solid var(--border)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">
          {filteredJeux.length} {t.results}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden h-96 animate-pulse" style={{ border: '1px solid var(--border)' }}>
                <div className="h-48 bg-black/[0.05] dark:bg-white/[0.05]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-black/[0.05] dark:bg-white/[0.05] rounded w-3/4" />
                  <div className="h-4 bg-black/[0.05] dark:bg-white/[0.05] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJeux.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJeux.map((jeu) => (
              <GameCard key={jeu.id} game={jeu} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
