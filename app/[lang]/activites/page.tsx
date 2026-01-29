'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { getFilteredRessources } from '@/lib/supabase-queries'
import { Language, Ressource } from '@/lib/types'
import { useFilters } from '@/lib/hooks/useFilters'
import { useFilteredResources } from '@/lib/hooks/useFilteredResources'
import { CATEGORIES, SORT_OPTIONS, FILTER_TRANSLATIONS } from '@/lib/constants/filters'
import ActivityCard from '@/components/cards/ActivityCard'
import { Input } from '@/components/ui/input'
import { FilterPanel, ActiveFilters } from '@/components/filters'

const translations = {
  fr: {
    title: 'Ressources',
    subtitle: 'Découvrez nos activités sans écran pour les 0-6 ans',
    all: 'Toutes',
    search: 'Rechercher...',
    results: 'résultats',
    noResults: 'Aucune ressource trouvée',
    noResultsHelp: 'Essayez de modifier vos filtres ou votre recherche',
    filters: 'Filtres',
    sortBy: 'Trier par',
  },
  en: {
    title: 'Resources',
    subtitle: 'Discover our screen-free activities for 0-6 years old',
    all: 'All',
    search: 'Search...',
    results: 'results',
    noResults: 'No resources found',
    noResultsHelp: 'Try adjusting your filters or search',
    filters: 'Filters',
    sortBy: 'Sort by',
  },
  es: {
    title: 'Recursos',
    subtitle: 'Descubre nuestras actividades sin pantallas para niños de 0-6 años',
    all: 'Todas',
    search: 'Buscar...',
    results: 'resultados',
    noResults: 'No se encontraron recursos',
    noResultsHelp: 'Intenta ajustar tus filtros o búsqueda',
    filters: 'Filtros',
    sortBy: 'Ordenar por',
  }
}

function ActivitesContent({ lang }: { lang: Language }) {
  const t = translations[lang]
  const filterT = FILTER_TRANSLATIONS[lang]

  // Hook de filtres avec sync URL
  const {
    filters,
    setFilters,
    clearFilters,
    toggleArrayValue,
    setValue,
    activeFiltersCount,
    hasActiveFilters,
    serverFilters,
    clientFilters,
  } = useFilters()

  // États locaux
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [activites, setActivites] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtrage client-side (themes, competences, materials, intensity)
  const filteredActivites = useFilteredResources(activites, clientFilters)

  // Fetch des données avec filtres serveur
  // On force les types activite/motricite/alimentation pour exclure livres et jeux
  useEffect(() => {
    const fetchActivites = async () => {
      setIsLoading(true)

      const data = await getFilteredRessources(lang, {
        ...serverFilters,
        types: ['activite', 'motricite', 'alimentation']
      })

      setActivites(data)
      setIsLoading(false)
    }

    fetchActivites()
  }, [lang, serverFilters])

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== filters.search) {
        setValue('search', searchInput)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput, filters.search, setValue])

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-8">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Pills */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {/* Bouton "Toutes" */}
            <button
              onClick={() => setFilters({ categories: [] })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.categories.length === 0
                  ? 'bg-[#5D5A4E] text-white shadow-apple'
                  : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
              }`}
              style={filters.categories.length !== 0 ? { border: '1px solid var(--border)' } : undefined}
            >
              {t.all}
            </button>
            {/* Catégories */}
            {CATEGORIES.map((cat) => {
              const isActive = filters.categories.includes(cat.value)
              return (
                <button
                  key={cat.value}
                  onClick={() => toggleArrayValue('categories', cat.value)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#A8B5A0] text-white shadow-apple'
                      : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                  }`}
                  style={!isActive ? { border: '1px solid var(--border)' } : undefined}
                >
                  <span>{cat.emoji}</span>
                  <span className="hidden sm:inline">{cat.label[lang]}</span>
                </button>
              )
            })}
          </div>

          {/* Search + Filter button */}
          <div className="max-w-xl mx-auto mb-4">
            <div className="flex gap-2">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 pr-10 h-12 rounded-full bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary dark:placeholder:text-foreground-dark-secondary"
                  style={{ border: '1px solid var(--border)' }}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('')
                      setValue('search', '')
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="relative h-12 w-12 rounded-full bg-surface-secondary dark:bg-surface-dark flex items-center justify-center text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20 transition-colors"
                style={{ border: '1px solid var(--border)' }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A8B5A0] text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filters badges */}
          {hasActiveFilters && (
            <div className="max-w-xl mx-auto">
              <ActiveFilters
                filters={filters}
                toggleArrayValue={toggleArrayValue}
                setFilters={setFilters}
                clearFilters={clearFilters}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count + Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-foreground-secondary dark:text-foreground-dark-secondary">
            {filteredActivites.length} {t.results}
          </p>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
              {filterT.sortBy}
            </span>
            <select
              value={filters.sort}
              onChange={(e) => setValue('sort', e.target.value as any)}
              className="px-3 py-1.5 rounded-lg text-sm bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none cursor-pointer"
              style={{ border: '1px solid var(--border)' }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
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
        ) : filteredActivites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg mb-2">
              {t.noResults}
            </p>
            <p className="text-foreground-secondary/60 dark:text-foreground-dark-secondary/60 text-sm">
              {t.noResultsHelp}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-full text-sm font-medium bg-[#A8B5A0] text-white hover:bg-[#A8B5A0]/90 transition-colors"
              >
                {FILTER_TRANSLATIONS[lang].clearAll}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivites.map((activite) => (
              <ActivityCard key={activite.id} activity={activite} lang={lang} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel (Sheet) */}
      <FilterPanel
        open={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        toggleArrayValue={toggleArrayValue}
        activeFiltersCount={activeFiltersCount}
        resultCount={filteredActivites.length}
        lang={lang}
      />
    </div>
  )
}

// Wrapper avec Suspense pour useSearchParams
export default function ActivitesPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-background-dark pt-8 flex items-center justify-center">
        <div className="animate-pulse text-foreground-secondary">Chargement...</div>
      </div>
    }>
      <ActivitesContent lang={lang} />
    </Suspense>
  )
}
