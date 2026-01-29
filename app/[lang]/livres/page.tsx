'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { getRessources } from '@/lib/supabase-queries'
import { Language, Ressource } from '@/lib/types'
import BookCard from '@/components/cards/BookCard'
import { Input } from '@/components/ui/input'

const translations = {
  fr: {
    title: 'Livres',
    subtitle: 'Sélection de livres éducatifs pour les tout-petits',
    search: 'Rechercher...',
    results: 'résultats',
    noResults: 'Aucun livre trouvé'
  },
  en: {
    title: 'Books',
    subtitle: 'Educational books selection for young children',
    search: 'Search...',
    results: 'results',
    noResults: 'No books found'
  },
  es: {
    title: 'Libros',
    subtitle: 'Selección de libros educativos para los más pequeños',
    search: 'Buscar...',
    results: 'resultados',
    noResults: 'No se encontraron libros'
  }
}

export default function LivresPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')
  const [searchQuery, setSearchQuery] = useState('')
  const [livres, setLivres] = useState<Ressource[]>([])
  const [filteredLivres, setFilteredLivres] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const fetchLivres = async () => {
      setIsLoading(true)
      const data = await getRessources(['livre'], lang)
      setLivres(data)
      setFilteredLivres(data)
      setIsLoading(false)
    }
    fetchLivres()
  }, [lang])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = livres.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query)
      )
      setFilteredLivres(filtered)
    } else {
      setFilteredLivres(livres)
    }
  }, [livres, searchQuery])

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
          {filteredLivres.length} {t.results}
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
        ) : filteredLivres.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLivres.map((livre) => (
              <BookCard key={livre.id} book={livre} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
