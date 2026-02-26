'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X, Users, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ActivityCard from '@/components/cards/ActivityCard'
import CreatorCard from '@/components/home/CreatorCard'
import { searchAll, CreatorSearchResult } from '@/lib/supabase-queries'
import type { Language, Ressource } from '@/lib/types'

const labels = {
  fr: {
    placeholder: 'Rechercher une activité, un créateur, un thème…',
    resources: 'Ressources',
    creators: 'Créateurs',
    noResults: 'Aucun résultat pour',
    noResultsHint: 'Essayez un autre mot-clé',
    results: 'résultats',
    loading: 'Recherche en cours…',
    all: 'Tous les résultats',
  },
  en: {
    placeholder: 'Search an activity, a creator, a theme…',
    resources: 'Resources',
    creators: 'Creators',
    noResults: 'No results for',
    noResultsHint: 'Try another keyword',
    results: 'results',
    loading: 'Searching…',
    all: 'All results',
  },
  es: {
    placeholder: 'Buscar una actividad, un creador, un tema…',
    resources: 'Recursos',
    creators: 'Creadores',
    noResults: 'Sin resultados para',
    noResultsHint: 'Prueba otra palabra clave',
    results: 'resultados',
    loading: 'Buscando…',
    all: 'Todos los resultados',
  },
}

function RecherchePage({ lang }: { lang: Language }) {
  const t = labels[lang] || labels.fr
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const initialQ = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(initialQ)
  const [query, setQuery] = useState(initialQ)

  const [resources, setResources] = useState<Ressource[]>([])
  const [creators, setCreators] = useState<CreatorSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Sync when URL changes (e.g. navigating back/forward)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setInputValue(q)
    setQuery(q)
  }, [searchParams])

  // Run search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResources([])
      setCreators([])
      setHasSearched(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    searchAll(query.trim(), lang).then(({ resources, creators }) => {
      if (cancelled) return
      setResources(resources as Ressource[])
      setCreators(creators)
      setHasSearched(true)
      setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [query, lang])

  // Debounced URL + query update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const q = inputValue.trim()
      if (q === query) return
      setQuery(q)
      if (q) {
        router.replace(`/${lang}/recherche?q=${encodeURIComponent(q)}`, { scroll: false })
      } else {
        router.replace(`/${lang}/recherche`, { scroll: false })
      }
    }, 350)
    return () => clearTimeout(timeout)
  }, [inputValue, query, lang, router])

  const total = resources.length + creators.length

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={t.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = inputValue.trim()
                  setQuery(q)
                  if (q) router.replace(`/${lang}/recherche?q=${encodeURIComponent(q)}`, { scroll: false })
                }
              }}
              className="pl-12 pr-12 h-14 rounded-2xl text-base bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary dark:placeholder:text-foreground-dark-secondary"
              style={{ border: '1px solid var(--border)' }}
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('')
                  setQuery('')
                  router.replace(`/${lang}/recherche`, { scroll: false })
                  inputRef.current?.focus()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#A8B5A0] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Résultats */}
        {!isLoading && hasSearched && (
          <>
            {total === 0 ? (
              <div className="text-center py-20">
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg mb-2">
                  {t.noResults} &laquo;{query}&raquo;
                </p>
                <p className="text-foreground-secondary/60 dark:text-foreground-dark-secondary/60 text-sm">
                  {t.noResultsHint}
                </p>
              </div>
            ) : (
              <div className="space-y-12">

                {/* Ressources */}
                {resources.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen className="w-4 h-4 text-[#A8B5A0]" />
                      <h2 className="text-sm font-semibold text-foreground/70 dark:text-foreground-dark/70 uppercase tracking-wider">
                        {t.resources}
                      </h2>
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary"
                        style={{ border: '1px solid var(--border)' }}>
                        {resources.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.map((r) => (
                        <ActivityCard key={r.id} activity={r} lang={lang} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Créateurs */}
                {creators.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-5">
                      <Users className="w-4 h-4 text-[#CCA6C8]" />
                      <h2 className="text-sm font-semibold text-foreground/70 dark:text-foreground-dark/70 uppercase tracking-wider">
                        {t.creators}
                      </h2>
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary"
                        style={{ border: '1px solid var(--border)' }}>
                        {creators.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {creators.map((c) => (
                        <CreatorCard key={c.id} creator={c} lang={lang} />
                      ))}
                    </div>
                  </section>
                )}

              </div>
            )}
          </>
        )}

        {/* État initial (aucune recherche) */}
        {!isLoading && !hasSearched && !query && (
          <div className="text-center py-20 text-foreground-secondary/50 dark:text-foreground-dark-secondary/50 text-sm">
            {t.placeholder}
          </div>
        )}

      </div>
    </div>
  )
}

export default function RecherchePageWrapper({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-background-dark pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A8B5A0] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RecherchePage lang={lang} />
    </Suspense>
  )
}
