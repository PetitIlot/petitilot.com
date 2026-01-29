'use client'

import type { Language } from '@/lib/types'

interface AgeSliderProps {
  ageMin: number | null
  ageMax: number | null
  onChange: (ageMin: number | null, ageMax: number | null) => void
  lang: Language
}

// Presets d'âge pour une sélection rapide
const AGE_PRESETS = [
  { label: { fr: '0-1 an', en: '0-1 year', es: '0-1 año' }, min: 0, max: 12 },
  { label: { fr: '1-2 ans', en: '1-2 years', es: '1-2 años' }, min: 12, max: 24 },
  { label: { fr: '2-3 ans', en: '2-3 years', es: '2-3 años' }, min: 24, max: 36 },
  { label: { fr: '3-4 ans', en: '3-4 years', es: '3-4 años' }, min: 36, max: 48 },
  { label: { fr: '4-5 ans', en: '4-5 years', es: '4-5 años' }, min: 48, max: 60 },
  { label: { fr: '5-6 ans', en: '5-6 years', es: '5-6 años' }, min: 60, max: 72 },
]

/**
 * Sélecteur d'âge par presets
 * Plus simple et intuitif qu'un double slider
 */
export default function AgeSlider({ ageMin, ageMax, onChange, lang }: AgeSliderProps) {
  // Appliquer un preset (toggle)
  const applyPreset = (min: number, max: number) => {
    if (ageMin === min && ageMax === max) {
      onChange(null, null)
    } else {
      onChange(min, max)
    }
  }

  // Vérifier si un preset est actif
  const isPresetActive = (min: number, max: number) => {
    return ageMin === min && ageMax === max
  }

  // Vérifier si aucun filtre n'est actif
  const isAllActive = ageMin === null && ageMax === null

  return (
    <div className="flex flex-wrap gap-2">
      {/* Bouton "Tous les âges" */}
      <button
        type="button"
        onClick={() => onChange(null, null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isAllActive
            ? 'bg-[#A8B5A0] text-white'
            : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
        }`}
        style={!isAllActive ? { border: '1px solid var(--border)' } : undefined}
      >
        {lang === 'fr' ? 'Tous' : lang === 'es' ? 'Todos' : 'All'}
      </button>

      {/* Presets d'âge */}
      {AGE_PRESETS.map((preset, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => applyPreset(preset.min, preset.max)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isPresetActive(preset.min, preset.max)
              ? 'bg-[#A8B5A0] text-white'
              : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
          }`}
          style={!isPresetActive(preset.min, preset.max) ? { border: '1px solid var(--border)' } : undefined}
        >
          {preset.label[lang]}
        </button>
      ))}
    </div>
  )
}
