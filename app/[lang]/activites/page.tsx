'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { getFilteredRessources } from '@/lib/supabase-queries'
import { Language, Ressource } from '@/lib/types'
import { useFilters } from '@/lib/hooks/useFilters'
import { useFilteredResources } from '@/lib/hooks/useFilteredResources'
import { CATEGORIES, SORT_OPTIONS, FILTER_TRANSLATIONS } from '@/lib/constants/filters'
import { Button, GEMS } from '@/components/ui/button'
import type { GemColor } from '@/components/ui/button'
import { gemPillStyle } from '@/components/filters/gemFilterStyle'
import ActivityCard from '@/components/cards/ActivityCard'
import { Input } from '@/components/ui/input'
import { FilterPanel, ActiveFilters } from '@/components/filters'
import { FilterIcon } from '@/lib/constants/resourceIcons'

const DEMO_RESSOURCES: Ressource[] = [
  {
    id: 'demo-act-1', group_id: 'g1', lang: 'fr', type: 'activite',
    title: 'Peinture sensorielle aux légumes',
    vignette_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
    categories: ['sensoriel', 'art-plastique'],
    themes: ['Nature', 'Printemps'],
    competences: ['Créativité'],
    age_min: 2, age_max: 6, duration: 30, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: false, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-2', group_id: 'g2', lang: 'fr', type: 'motricite',
    title: 'Parcours moteur en forêt',
    vignette_url: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=600&fit=crop',
    categories: ['motricite-globale', 'nature-plein-air'],
    themes: ['Forêt', 'Nature'],
    competences: ['Coordination'],
    age_min: 3, age_max: 6, duration: 45, duration_max: null, duration_prep: 10,
    difficulte: 'beginner', autonomie: true, intensity: 'moyen',
    is_premium: true, accept_free_credits: true,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-3', group_id: 'g3', lang: 'fr', type: 'alimentation',
    title: 'Mini-pizzas aux légumes du jardin',
    vignette_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    categories: ['cuisine'],
    themes: ['Alimentation', 'Jardin & plantes'],
    competences: ['Autonomie'],
    age_min: 3, age_max: 6, duration: 40, duration_max: null, duration_prep: 15,
    difficulte: 'advanced', autonomie: false, intensity: 'leger',
    is_premium: true, accept_free_credits: true,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-4', group_id: 'g4', lang: 'fr', type: 'activite',
    title: 'Bac sensoriel forêt enchantée',
    vignette_url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop',
    categories: ['sensoriel', 'jeux-symboliques'],
    themes: ['Forêt', 'Animaux'],
    competences: ['Concentration'],
    age_min: 1, age_max: 4, duration: 20, duration_max: null, duration_prep: 15,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-5', group_id: 'g5', lang: 'fr', type: 'activite',
    title: 'Récup créative : robots en carton',
    vignette_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    categories: ['diy-recup', 'art-plastique'],
    themes: ['Maison', 'Contes & Histoires'],
    competences: ['Créativité'],
    age_min: 3, age_max: 6, duration: 50, duration_max: null, duration_prep: 10,
    difficulte: 'advanced', autonomie: false, intensity: 'leger',
    is_premium: true, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-6', group_id: 'g6', lang: 'fr', type: 'motricite',
    title: 'Yoga des animaux de la forêt',
    vignette_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    categories: ['motricite-globale'],
    themes: ['Animaux', 'Corps humain'],
    competences: ['Équilibre'],
    age_min: 3, age_max: 6, duration: 30, duration_max: null, duration_prep: 0,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: true,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-7', group_id: 'g7', lang: 'fr', type: 'activite',
    title: 'Impressions nature avec feuilles',
    vignette_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
    categories: ['nature-plein-air', 'art-plastique'],
    themes: ['Nature', 'Automne'],
    competences: ['Observation'],
    age_min: 2, age_max: 6, duration: 30, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: false, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-8', group_id: 'g8', lang: 'fr', type: 'alimentation',
    title: 'Cuisine zéro déchet en famille',
    vignette_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop',
    categories: ['cuisine', 'diy-recup'],
    themes: ['Alimentation', 'Maison'],
    competences: ['Autonomie'],
    age_min: 3, age_max: 6, duration: 45, duration_max: null, duration_prep: 20,
    difficulte: 'advanced', autonomie: false, intensity: 'moyen',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-9', group_id: 'g9', lang: 'fr', type: 'activite',
    title: 'Chasse au trésor nature',
    vignette_url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&h=600&fit=crop',
    categories: ['nature-plein-air', 'jeux-symboliques'],
    themes: ['Forêt', 'Animaux'],
    competences: ['Observation'],
    age_min: 3, age_max: 6, duration: 60, duration_max: null, duration_prep: 15,
    difficulte: 'advanced', autonomie: false, intensity: 'intense',
    is_premium: false, accept_free_credits: true,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-10', group_id: 'g10', lang: 'fr', type: 'activite',
    title: 'Pâtes à modeler maison à la farine',
    vignette_url: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&h=600&fit=crop',
    categories: ['diy-recup', 'sensoriel', 'motricite-fine'],
    themes: ['Maison'],
    competences: ['Motricité fine'],
    age_min: 1, age_max: 4, duration: 20, duration_max: null, duration_prep: 10,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-11', group_id: 'g11', lang: 'fr', type: 'motricite',
    title: 'Parcours d\'équilibre avec coussins',
    vignette_url: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&h=600&fit=crop',
    categories: ['motricite-globale'],
    themes: ['Maison', 'Corps humain'],
    competences: ['Équilibre', 'Coordination'],
    age_min: 2, age_max: 5, duration: 20, duration_max: 30, duration_prep: 5,
    difficulte: 'beginner', autonomie: true, intensity: 'moyen',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
  {
    id: 'demo-act-12', group_id: 'g12', lang: 'fr', type: 'activite',
    title: 'Tri sensoriel de graines et légumineuses',
    vignette_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    categories: ['motricite-fine', 'sensoriel'],
    themes: ['Jardin & plantes'],
    competences: ['Motricité fine', 'Concentration'],
    age_min: 2, age_max: 5, duration: 15, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    materiel_json: null,
  } as Ressource,
]

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

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
  const router = useRouter()

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

  // Dark mode detection
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // États locaux
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [activites, setActivites] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Vérifier l'état d'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()

    // Écouter les changements d'auth
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

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

      setActivites(data.length > 0 ? data : DEMO_RESSOURCES)
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
    <div className="min-h-screen bg-background dark:bg-background-dark pt-15">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Pills — Gemstone style */}
          <div className="flex justify-center gap-2.5 mb-6 flex-wrap">
            {/* Bouton "Toutes" — neutral gem */}
            {(() => {
              const isAllActive = filters.categories.length === 0
              const s = gemPillStyle('neutral', isAllActive, isDark)
              return (
                <button
                  onClick={() => setFilters({ categories: [] })}
                  className="transition-all duration-300 active:scale-[0.97]"
                  style={s.wrapper}
                >
                  <div
                    style={{ ...s.inner, padding: '8px 18px' }}
                  >
                    {isAllActive && <span aria-hidden style={s.frost} />}
                    {isAllActive && <span aria-hidden style={s.shine} />}
                    <span style={{ position: 'relative', zIndex: 2 }}>{t.all}</span>
                  </div>
                </button>
              )
            })()}
            {/* Catégories avec couleurs gemme */}
            {CATEGORIES.map((cat) => {
              const isActive = filters.categories.includes(cat.value)
              const gem = cat.gem || 'sage'
              const g = GEMS[gem as GemColor]
              const rgb = hexToRgb(isDark ? g.dark : g.light)
              const glowRGB = isDark ? g.glowDark : g.glow

              return (
                <button
                  key={cat.value}
                  onClick={() => toggleArrayValue('categories', cat.value)}
                  className="transition-all duration-300 active:scale-[0.97]"
                  style={{
                    borderRadius: 20,
                    padding: 1.5,
                    background: isActive
                      ? `linear-gradient(135deg, rgba(${glowRGB},0.7) 0%, rgba(${glowRGB},0.4) 50%, rgba(${glowRGB},0.6) 100%)`
                      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)'),
                    boxShadow: isActive
                      ? `0 0 14px rgba(${glowRGB},${isDark ? 0.45 : 0.30}), 0 2px 8px rgba(0,0,0,${isDark ? 0.2 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.15 : 0.45})`
                      : `0 1px 4px rgba(0,0,0,${isDark ? 0.15 : 0.04}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.45})`,
                  }}
                >
                  <div
                    className="flex items-center gap-1.5"
                    style={{
                      position: 'relative',
                      padding: '8px 14px',
                      borderRadius: 18.5,
                      fontSize: 13,
                      fontWeight: 650,
                      letterSpacing: '-0.01em',
                      overflow: 'hidden',
                      color: isActive
                        ? (isDark ? g.textDark : g.text)
                        : (isDark ? '#C8CED6' : '#5D5A4E'),
                      background: isActive
                        ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.26 : 0.34}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.20 : 0.28}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.24 : 0.32}) 100%)`
                        : (isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)'),
                      backdropFilter: isActive ? 'blur(12px) saturate(140%)' : 'none',
                      WebkitBackdropFilter: isActive ? 'blur(12px) saturate(140%)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Frost overlay for active state */}
                    {isActive && (
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          background: isDark
                            ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
                            : 'linear-gradient(170deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.38) 45%, rgba(255,255,255,0.42) 100%)',
                          borderRadius: 18.5,
                        }}
                      />
                    )}
                    {/* Glass shine */}
                    {isActive && (
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '8%',
                          right: '8%',
                          height: '45%',
                          pointerEvents: 'none',
                          background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.10 : 0.28}) 0%, rgba(255,255,255,${isDark ? 0.02 : 0.05}) 50%, transparent 100%)`,
                          borderRadius: '18.5px 18.5px 50% 50%',
                        }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={cat.value} size={16} /></span>
                    <span className="hidden sm:inline" style={{ position: 'relative', zIndex: 2 }}>{cat.label[lang]}</span>
                  </div>
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
            <div className="max-w-4xl mx-auto">
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
              <Button
                gem="terracotta"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                {FILTER_TRANSLATIONS[lang].clearAll}
              </Button>
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
        isLoggedIn={isLoggedIn}
        onLoginRequired={() => router.push(`/${lang}/connexion`)}
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
