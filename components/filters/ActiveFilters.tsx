'use client'

import { X } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { FilterState } from '@/lib/hooks/useFilters'
import {
  CATEGORIES,
  THEMES,
  COMPETENCES,
  MATERIALS,
  DIFFICULTY_OPTIONS,
  INTENSITY_OPTIONS,
  DURATION_PRESETS,
  PREP_TIME_PRESETS,
  getOptionLabel
} from '@/lib/constants/filters'

interface ActiveFiltersProps {
  filters: FilterState
  toggleArrayValue: (key: keyof FilterState, value: string) => void
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void
  lang: Language
}

interface FilterBadge {
  key: string
  label: string
  color?: string
  onRemove: () => void
}

const translations = {
  fr: {
    clearAll: 'Tout effacer',
    age: 'Âge',
    months: 'mois',
    years: 'ans',
    duration: 'Durée',
    prepTime: 'Prépa',
    intensity: 'Intensité',
    autonomy: 'Autonome',
    free: 'Gratuit',
    paid: 'Payant',
    download: 'PDF',
    matchMode: 'J\'ai ce matériel'
  },
  en: {
    clearAll: 'Clear all',
    age: 'Age',
    months: 'months',
    years: 'years',
    duration: 'Duration',
    prepTime: 'Prep',
    intensity: 'Intensity',
    autonomy: 'Independent',
    free: 'Free',
    paid: 'Paid',
    download: 'PDF',
    matchMode: 'I have this'
  },
  es: {
    clearAll: 'Borrar todo',
    age: 'Edad',
    months: 'meses',
    years: 'años',
    duration: 'Duración',
    prepTime: 'Prepa',
    intensity: 'Intensidad',
    autonomy: 'Autónomo',
    free: 'Gratis',
    paid: 'De pago',
    download: 'PDF',
    matchMode: 'Tengo esto'
  }
}

/**
 * Barre horizontale scrollable avec badges des filtres actifs
 */
export default function ActiveFilters({
  filters,
  toggleArrayValue,
  setFilters,
  clearFilters,
  lang
}: ActiveFiltersProps) {
  const t = translations[lang]

  // Construire la liste des badges
  const badges: FilterBadge[] = []

  // Catégories
  for (const cat of filters.categories) {
    badges.push({
      key: `cat-${cat}`,
      label: getOptionLabel(CATEGORIES, cat, lang),
      color: 'bg-[#A8B5A0]',
      onRemove: () => toggleArrayValue('categories', cat)
    })
  }

  // Thèmes
  for (const theme of filters.themes) {
    badges.push({
      key: `theme-${theme}`,
      label: getOptionLabel(THEMES, theme, lang),
      color: 'bg-[#C8D8E4]',
      onRemove: () => toggleArrayValue('themes', theme)
    })
  }

  // Compétences
  for (const comp of filters.competences) {
    badges.push({
      key: `comp-${comp}`,
      label: getOptionLabel(COMPETENCES, comp, lang),
      color: 'bg-[#D4A59A]',
      onRemove: () => toggleArrayValue('competences', comp)
    })
  }

  // Matériaux
  for (const mat of filters.materials) {
    badges.push({
      key: `mat-${mat}`,
      label: getOptionLabel(MATERIALS, mat, lang),
      color: 'bg-[#F5E6D3] text-[#5D5A4E]',
      onRemove: () => toggleArrayValue('materials', mat)
    })
  }

  // Mode matériel (si match et des matériaux sélectionnés)
  if (filters.materialMode === 'match' && filters.materials.length > 0) {
    badges.push({
      key: 'matmode',
      label: t.matchMode,
      color: 'bg-[#C8D8E4]',
      onRemove: () => setFilters({ materialMode: 'filter' })
    })
  }

  // Âge
  if (filters.ageMin !== null || filters.ageMax !== null) {
    const formatAge = (months: number) => {
      if (months < 12) return `${months} ${t.months}`
      return `${Math.floor(months / 12)} ${t.years}`
    }
    let label = t.age + ': '
    if (filters.ageMin !== null && filters.ageMax !== null) {
      label += `${formatAge(filters.ageMin)} - ${formatAge(filters.ageMax)}`
    } else if (filters.ageMin !== null) {
      label += `${formatAge(filters.ageMin)}+`
    } else {
      label += `< ${formatAge(filters.ageMax!)}`
    }
    badges.push({
      key: 'age',
      label,
      onRemove: () => setFilters({ ageMin: null, ageMax: null })
    })
  }

  // Durée
  if (filters.duration !== null) {
    const preset = DURATION_PRESETS.find(p => parseInt(p.value) === filters.duration)
    badges.push({
      key: 'duration',
      label: preset ? preset.label[lang] : `< ${filters.duration} min`,
      onRemove: () => setFilters({ duration: null })
    })
  }

  // Durée de préparation
  if (filters.prepTime !== null) {
    const preset = PREP_TIME_PRESETS.find(p => parseInt(p.value) === filters.prepTime)
    badges.push({
      key: 'prepTime',
      label: `${t.prepTime}: ${preset ? preset.label[lang] : `< ${filters.prepTime} min`}`,
      onRemove: () => setFilters({ prepTime: null })
    })
  }

  // Difficulté
  if (filters.difficulty) {
    badges.push({
      key: 'difficulty',
      label: getOptionLabel(DIFFICULTY_OPTIONS, filters.difficulty, lang),
      onRemove: () => setFilters({ difficulty: null })
    })
  }

  // Intensité
  if (filters.intensity) {
    badges.push({
      key: 'intensity',
      label: getOptionLabel(INTENSITY_OPTIONS, filters.intensity, lang),
      onRemove: () => setFilters({ intensity: null })
    })
  }

  // Autonomie
  if (filters.autonomy !== null) {
    badges.push({
      key: 'autonomy',
      label: filters.autonomy ? t.autonomy : `Non ${t.autonomy.toLowerCase()}`,
      onRemove: () => setFilters({ autonomy: null })
    })
  }

  // Gratuit/Payant
  if (filters.isFree !== null) {
    badges.push({
      key: 'free',
      label: filters.isFree ? t.free : t.paid,
      onRemove: () => setFilters({ isFree: null })
    })
  }

  // Prix range
  if (filters.priceMin !== null || filters.priceMax !== null) {
    let label = ''
    if (filters.priceMin !== null && filters.priceMax !== null) {
      label = `${filters.priceMin}-${filters.priceMax} crédits`
    } else if (filters.priceMin !== null) {
      label = `≥ ${filters.priceMin} crédits`
    } else {
      label = `≤ ${filters.priceMax} crédits`
    }
    badges.push({
      key: 'price',
      label,
      onRemove: () => setFilters({ priceMin: null, priceMax: null })
    })
  }

  // PDF téléchargeable
  if (filters.hasDownload === true) {
    badges.push({
      key: 'download',
      label: t.download,
      onRemove: () => setFilters({ hasDownload: null })
    })
  }

  // Créateur
  if (filters.creatorSlug) {
    badges.push({
      key: 'creator',
      label: `@${filters.creatorSlug}`,
      onRemove: () => setFilters({ creatorSlug: null })
    })
  }

  if (badges.length === 0) return null

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
      {badges.map(badge => (
        <button
          key={badge.key}
          type="button"
          onClick={badge.onRemove}
          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${
            badge.color || 'bg-[#5D5A4E] text-white'
          }`}
          style={!badge.color ? undefined : badge.color.includes('text-') ? undefined : { color: 'white' }}
        >
          <span>{badge.label}</span>
          <X className="w-3 h-3" />
        </button>
      ))}

      {/* Bouton tout effacer */}
      {badges.length > 1 && (
        <button
          type="button"
          onClick={clearFilters}
          className="shrink-0 text-xs text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark hover:underline ml-1"
        >
          {t.clearAll}
        </button>
      )}
    </div>
  )
}
