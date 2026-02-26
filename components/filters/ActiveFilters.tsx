'use client'

import { useEffect, useState } from 'react'
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
import { GEMS } from '@/components/ui/button'
import type { GemColor } from '@/components/ui/button'

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
  gem: GemColor
  onRemove: () => void
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
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

  // Dark mode
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Construire la liste des badges
  const badges: FilterBadge[] = []

  // Catégories — avec couleur gemme
  for (const cat of filters.categories) {
    const catOption = CATEGORIES.find(c => c.value === cat)
    badges.push({
      key: `cat-${cat}`,
      label: getOptionLabel(CATEGORIES, cat, lang),
      gem: (catOption?.gem as GemColor) || 'sage',
      onRemove: () => toggleArrayValue('categories', cat)
    })
  }

  // Thèmes — sky
  for (const theme of filters.themes) {
    badges.push({
      key: `theme-${theme}`,
      label: getOptionLabel(THEMES, theme, lang),
      gem: 'sky',
      onRemove: () => toggleArrayValue('themes', theme)
    })
  }

  // Compétences — rose
  for (const comp of filters.competences) {
    badges.push({
      key: `comp-${comp}`,
      label: getOptionLabel(COMPETENCES, comp, lang),
      gem: 'rose',
      onRemove: () => toggleArrayValue('competences', comp)
    })
  }

  // Matériaux — amber
  for (const mat of filters.materials) {
    badges.push({
      key: `mat-${mat}`,
      label: getOptionLabel(MATERIALS, mat, lang),
      gem: 'amber',
      onRemove: () => toggleArrayValue('materials', mat)
    })
  }

  // Mode matériel — sage
  if (filters.materialMode === 'match' && filters.materials.length > 0) {
    badges.push({
      key: 'matmode',
      label: t.matchMode,
      gem: 'sage',
      onRemove: () => setFilters({ materialMode: 'filter' })
    })
  }

  // Âge — neutral
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
      gem: 'neutral',
      onRemove: () => setFilters({ ageMin: null, ageMax: null })
    })
  }

  // Durée — sky
  if (filters.duration !== null) {
    const preset = DURATION_PRESETS.find(p => parseInt(p.value) === filters.duration)
    badges.push({
      key: 'duration',
      label: preset ? preset.label[lang] : `< ${filters.duration} min`,
      gem: 'sky',
      onRemove: () => setFilters({ duration: null })
    })
  }

  // Durée de préparation — terracotta
  if (filters.prepTime !== null) {
    const preset = PREP_TIME_PRESETS.find(p => parseInt(p.value) === filters.prepTime)
    badges.push({
      key: 'prepTime',
      label: `${t.prepTime}: ${preset ? preset.label[lang] : `< ${filters.prepTime} min`}`,
      gem: 'terracotta',
      onRemove: () => setFilters({ prepTime: null })
    })
  }

  // Difficulté — amber
  if (filters.difficulty) {
    badges.push({
      key: 'difficulty',
      label: getOptionLabel(DIFFICULTY_OPTIONS, filters.difficulty, lang),
      gem: 'amber',
      onRemove: () => setFilters({ difficulty: null })
    })
  }

  // Intensité — rose
  if (filters.intensity) {
    badges.push({
      key: 'intensity',
      label: getOptionLabel(INTENSITY_OPTIONS, filters.intensity, lang),
      gem: 'rose',
      onRemove: () => setFilters({ intensity: null })
    })
  }

  // Autonomie — sage
  if (filters.autonomy !== null) {
    badges.push({
      key: 'autonomy',
      label: filters.autonomy ? t.autonomy : `Non ${t.autonomy.toLowerCase()}`,
      gem: 'sage',
      onRemove: () => setFilters({ autonomy: null })
    })
  }

  // Gratuit/Payant — mauve
  if (filters.isFree !== null) {
    badges.push({
      key: 'free',
      label: filters.isFree ? t.free : t.paid,
      gem: 'mauve',
      onRemove: () => setFilters({ isFree: null })
    })
  }

  // Prix range — mauve
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
      gem: 'mauve',
      onRemove: () => setFilters({ priceMin: null, priceMax: null })
    })
  }

  // Créateur — neutral
  if (filters.creatorSlug) {
    badges.push({
      key: 'creator',
      label: `@${filters.creatorSlug}`,
      gem: 'neutral',
      onRemove: () => setFilters({ creatorSlug: null })
    })
  }

  if (badges.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      {badges.map(badge => {
        const g = GEMS[badge.gem]
        const rgb = hexToRgb(isDark ? g.dark : g.light)
        const glowRGB = isDark ? g.glowDark : g.glow
        return (
          <button
            key={badge.key}
            type="button"
            onClick={badge.onRemove}
            className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 hover:opacity-85 active:scale-[0.97]"
            style={{
              borderRadius: 20,
              padding: 1.5,
              background: `linear-gradient(135deg, rgba(${glowRGB},0.6) 0%, rgba(${glowRGB},0.35) 50%, rgba(${glowRGB},0.5) 100%)`,
              boxShadow: `0 0 10px rgba(${glowRGB},${isDark ? 0.35 : 0.20}), 0 1px 4px rgba(0,0,0,${isDark ? 0.2 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.12 : 0.4})`,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 18.5,
                color: isDark ? g.textDark : g.text,
                background: `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.24 : 0.32}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.18 : 0.26}) 100%)`,
                backdropFilter: 'blur(8px) saturate(130%)',
                WebkitBackdropFilter: 'blur(8px) saturate(130%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Frost overlay */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: isDark
                    ? 'linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'linear-gradient(170deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.36) 100%)',
                  borderRadius: 18.5,
                }}
              />
              <span style={{ position: 'relative', zIndex: 2 }}>{badge.label}</span>
              <X className="w-3 h-3" style={{ position: 'relative', zIndex: 2 }} />
            </span>
          </button>
        )
      })}

      {/* Bouton tout effacer */}
      {badges.length > 1 && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark hover:underline ml-1"
        >
          {t.clearAll}
        </button>
      )}
    </div>
  )
}
