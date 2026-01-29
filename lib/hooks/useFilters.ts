'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

// Types pour l'état des filtres
export interface FilterState {
  // Types et catégories
  types: string[]
  categories: string[]

  // Pédagogie
  themes: string[]
  competences: string[]

  // Pratique
  ageMin: number | null      // en mois
  ageMax: number | null      // en mois
  duration: number | null    // max minutes (preset)
  prepTime: number | null    // temps de préparation en minutes
  difficulty: string | null
  intensity: string | null
  autonomy: boolean | null

  // Matériel
  materials: string[]
  materialMode: 'filter' | 'match'

  // Prix et téléchargement
  hasDownload: boolean | null
  isFree: boolean | null
  priceMin: number | null
  priceMax: number | null

  // Créateur
  creatorSlug: string | null

  // Tri
  sort: 'recent' | 'popular' | 'price_asc' | 'price_desc'

  // Recherche texte
  search: string
}

// État initial vide
export const INITIAL_FILTER_STATE: FilterState = {
  types: [],
  categories: [],
  themes: [],
  competences: [],
  ageMin: null,
  ageMax: null,
  duration: null,
  prepTime: null,
  difficulty: null,
  intensity: null,
  autonomy: null,
  materials: [],
  materialMode: 'filter',
  hasDownload: null,
  isFree: null,
  priceMin: null,
  priceMax: null,
  creatorSlug: null,
  sort: 'recent',
  search: '',
}

// Mapping entre clés d'état et paramètres URL (raccourcis)
const URL_PARAM_MAP: Record<keyof FilterState, string> = {
  types: 'type',
  categories: 'cat',
  themes: 'themes',
  competences: 'skills',
  ageMin: 'age_min',
  ageMax: 'age_max',
  duration: 'dur',
  prepTime: 'prep',
  difficulty: 'diff',
  intensity: 'int',
  autonomy: 'auto',
  materials: 'mat',
  materialMode: 'matmode',
  hasDownload: 'dl',
  isFree: 'free',
  priceMin: 'price_min',
  priceMax: 'price_max',
  creatorSlug: 'creator',
  sort: 'sort',
  search: 'q',
}

/**
 * Parse une valeur URL en array (séparé par virgules)
 */
function parseArrayParam(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

/**
 * Parse une valeur URL en nombre ou null
 */
function parseNumberParam(value: string | null): number | null {
  if (!value) return null
  const num = parseInt(value, 10)
  return isNaN(num) ? null : num
}

/**
 * Parse une valeur URL en boolean ou null
 */
function parseBooleanParam(value: string | null): boolean | null {
  if (value === '1' || value === 'true') return true
  if (value === '0' || value === 'false') return false
  return null
}

/**
 * Convertit un array en string URL
 */
function arrayToUrlParam(arr: string[]): string | null {
  if (!arr.length) return null
  return arr.join(',')
}

/**
 * Hook principal pour la gestion des filtres avec sync URL
 */
export function useFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Parse les filtres depuis l'URL
  const filters: FilterState = useMemo(() => ({
    types: parseArrayParam(searchParams.get(URL_PARAM_MAP.types)),
    categories: parseArrayParam(searchParams.get(URL_PARAM_MAP.categories)),
    themes: parseArrayParam(searchParams.get(URL_PARAM_MAP.themes)),
    competences: parseArrayParam(searchParams.get(URL_PARAM_MAP.competences)),
    ageMin: parseNumberParam(searchParams.get(URL_PARAM_MAP.ageMin)),
    ageMax: parseNumberParam(searchParams.get(URL_PARAM_MAP.ageMax)),
    duration: parseNumberParam(searchParams.get(URL_PARAM_MAP.duration)),
    prepTime: parseNumberParam(searchParams.get(URL_PARAM_MAP.prepTime)),
    difficulty: searchParams.get(URL_PARAM_MAP.difficulty),
    intensity: searchParams.get(URL_PARAM_MAP.intensity),
    autonomy: parseBooleanParam(searchParams.get(URL_PARAM_MAP.autonomy)),
    materials: parseArrayParam(searchParams.get(URL_PARAM_MAP.materials)),
    materialMode: (searchParams.get(URL_PARAM_MAP.materialMode) as 'filter' | 'match') || 'filter',
    hasDownload: parseBooleanParam(searchParams.get(URL_PARAM_MAP.hasDownload)),
    isFree: parseBooleanParam(searchParams.get(URL_PARAM_MAP.isFree)),
    priceMin: parseNumberParam(searchParams.get(URL_PARAM_MAP.priceMin)),
    priceMax: parseNumberParam(searchParams.get(URL_PARAM_MAP.priceMax)),
    creatorSlug: searchParams.get(URL_PARAM_MAP.creatorSlug),
    sort: (searchParams.get(URL_PARAM_MAP.sort) as FilterState['sort']) || 'recent',
    search: searchParams.get(URL_PARAM_MAP.search) || '',
  }), [searchParams])

  // Met à jour l'URL avec les nouveaux filtres
  const setFilters = useCallback((newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString())
    const merged = { ...filters, ...newFilters }

    // Types et catégories
    const typesVal = arrayToUrlParam(merged.types)
    typesVal ? params.set(URL_PARAM_MAP.types, typesVal) : params.delete(URL_PARAM_MAP.types)

    const catsVal = arrayToUrlParam(merged.categories)
    catsVal ? params.set(URL_PARAM_MAP.categories, catsVal) : params.delete(URL_PARAM_MAP.categories)

    // Pédagogie
    const themesVal = arrayToUrlParam(merged.themes)
    themesVal ? params.set(URL_PARAM_MAP.themes, themesVal) : params.delete(URL_PARAM_MAP.themes)

    const skillsVal = arrayToUrlParam(merged.competences)
    skillsVal ? params.set(URL_PARAM_MAP.competences, skillsVal) : params.delete(URL_PARAM_MAP.competences)

    // Age
    merged.ageMin !== null ? params.set(URL_PARAM_MAP.ageMin, String(merged.ageMin)) : params.delete(URL_PARAM_MAP.ageMin)
    merged.ageMax !== null ? params.set(URL_PARAM_MAP.ageMax, String(merged.ageMax)) : params.delete(URL_PARAM_MAP.ageMax)

    // Pratique
    merged.duration !== null ? params.set(URL_PARAM_MAP.duration, String(merged.duration)) : params.delete(URL_PARAM_MAP.duration)
    merged.prepTime !== null ? params.set(URL_PARAM_MAP.prepTime, String(merged.prepTime)) : params.delete(URL_PARAM_MAP.prepTime)
    merged.difficulty ? params.set(URL_PARAM_MAP.difficulty, merged.difficulty) : params.delete(URL_PARAM_MAP.difficulty)
    merged.intensity ? params.set(URL_PARAM_MAP.intensity, merged.intensity) : params.delete(URL_PARAM_MAP.intensity)
    merged.autonomy !== null ? params.set(URL_PARAM_MAP.autonomy, merged.autonomy ? '1' : '0') : params.delete(URL_PARAM_MAP.autonomy)

    // Matériel
    const matsVal = arrayToUrlParam(merged.materials)
    matsVal ? params.set(URL_PARAM_MAP.materials, matsVal) : params.delete(URL_PARAM_MAP.materials)
    merged.materialMode !== 'filter' ? params.set(URL_PARAM_MAP.materialMode, merged.materialMode) : params.delete(URL_PARAM_MAP.materialMode)

    // Prix et téléchargement
    merged.hasDownload !== null ? params.set(URL_PARAM_MAP.hasDownload, merged.hasDownload ? '1' : '0') : params.delete(URL_PARAM_MAP.hasDownload)
    merged.isFree !== null ? params.set(URL_PARAM_MAP.isFree, merged.isFree ? '1' : '0') : params.delete(URL_PARAM_MAP.isFree)
    merged.priceMin !== null ? params.set(URL_PARAM_MAP.priceMin, String(merged.priceMin)) : params.delete(URL_PARAM_MAP.priceMin)
    merged.priceMax !== null ? params.set(URL_PARAM_MAP.priceMax, String(merged.priceMax)) : params.delete(URL_PARAM_MAP.priceMax)

    // Créateur
    merged.creatorSlug ? params.set(URL_PARAM_MAP.creatorSlug, merged.creatorSlug) : params.delete(URL_PARAM_MAP.creatorSlug)

    // Tri
    merged.sort !== 'recent' ? params.set(URL_PARAM_MAP.sort, merged.sort) : params.delete(URL_PARAM_MAP.sort)

    // Recherche
    merged.search ? params.set(URL_PARAM_MAP.search, merged.search) : params.delete(URL_PARAM_MAP.search)

    // Navigate (sans recharger la page)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router, filters])

  // Reset tous les filtres
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  // Toggle une valeur dans un array (ex: types, themes)
  const toggleArrayValue = useCallback((key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value]
    setFilters({ [key]: newArray })
  }, [filters, setFilters])

  // Set une valeur unique (ex: difficulty, sort)
  const setValue = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ [key]: value })
  }, [setFilters])

  // Compte le nombre de filtres actifs (hors tri et recherche)
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.types.length) count += filters.types.length
    if (filters.categories.length) count += filters.categories.length
    if (filters.themes.length) count += filters.themes.length
    if (filters.competences.length) count += filters.competences.length
    if (filters.materials.length) count += filters.materials.length
    if (filters.ageMin !== null || filters.ageMax !== null) count += 1
    if (filters.duration !== null) count += 1
    if (filters.prepTime !== null) count += 1
    if (filters.difficulty) count += 1
    if (filters.intensity) count += 1
    if (filters.autonomy !== null) count += 1
    if (filters.hasDownload !== null) count += 1
    if (filters.isFree !== null) count += 1
    if (filters.priceMin !== null || filters.priceMax !== null) count += 1
    if (filters.creatorSlug) count += 1
    return count
  }, [filters])

  // Vérifie si des filtres sont actifs
  const hasActiveFilters = activeFiltersCount > 0 || filters.search.length > 0

  // Extrait les filtres "serveur" (avec index BDD)
  const serverFilters = useMemo(() => ({
    types: filters.types,
    categories: filters.categories,
    ageMin: filters.ageMin,
    ageMax: filters.ageMax,
    duration: filters.duration,
    prepTime: filters.prepTime,
    difficulty: filters.difficulty,
    autonomy: filters.autonomy,
    hasDownload: filters.hasDownload,
    isFree: filters.isFree,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    creatorSlug: filters.creatorSlug,
    sort: filters.sort,
    search: filters.search,
  }), [filters])

  // Extrait les filtres "client" (sans index BDD, filtrage en mémoire)
  const clientFilters = useMemo(() => ({
    themes: filters.themes,
    competences: filters.competences,
    materials: filters.materials,
    materialMode: filters.materialMode,
    intensity: filters.intensity,
  }), [filters])

  return {
    filters,
    setFilters,
    clearFilters,
    toggleArrayValue,
    setValue,
    activeFiltersCount,
    hasActiveFilters,
    serverFilters,
    clientFilters,
  }
}

// Type pour les filtres serveur uniquement
export type ServerFilters = ReturnType<typeof useFilters>['serverFilters']
// Type pour les filtres client uniquement
export type ClientFilters = ReturnType<typeof useFilters>['clientFilters']
