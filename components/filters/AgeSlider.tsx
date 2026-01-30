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
 * Permet la sélection multiple de tranches d'âge adjacentes
 */
export default function AgeSlider({ ageMin, ageMax, onChange, lang }: AgeSliderProps) {
  // Vérifier si un preset est dans la plage sélectionnée
  const isPresetInRange = (presetMin: number, presetMax: number): boolean => {
    if (ageMin === null || ageMax === null) return false
    return presetMin >= ageMin && presetMax <= ageMax
  }

  // Toggle un preset - étend ou réduit la plage
  const togglePreset = (presetMin: number, presetMax: number) => {
    // Si aucune sélection, sélectionner ce preset
    if (ageMin === null || ageMax === null) {
      onChange(presetMin, presetMax)
      return
    }

    const isInRange = isPresetInRange(presetMin, presetMax)

    if (isInRange) {
      // Désélectionner - réduire la plage
      if (ageMin === presetMin && ageMax === presetMax) {
        // Seul preset sélectionné -> tout désélectionner
        onChange(null, null)
      } else if (presetMin === ageMin) {
        // Preset le plus bas -> remonter ageMin
        onChange(presetMax, ageMax)
      } else if (presetMax === ageMax) {
        // Preset le plus haut -> baisser ageMax
        onChange(ageMin, presetMin)
      } else {
        // Au milieu -> garder la partie basse
        onChange(ageMin, presetMin)
      }
    } else {
      // Sélectionner - étendre la plage
      const newMin = Math.min(ageMin, presetMin)
      const newMax = Math.max(ageMax, presetMax)
      onChange(newMin, newMax)
    }
  }

  // Vérifier si aucun filtre n'est actif
  const isAllActive = ageMin === null && ageMax === null

  // Afficher la plage sélectionnée
  const getRangeLabel = (): string | null => {
    if (ageMin === null || ageMax === null) return null
    const minYears = Math.floor(ageMin / 12)
    const maxYears = Math.ceil(ageMax / 12)
    if (lang === 'fr') return `${minYears}-${maxYears} ans`
    if (lang === 'es') return `${minYears}-${maxYears} años`
    return `${minYears}-${maxYears} years`
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Bouton "Tous les âges" */}
        <button
          type="button"
          onClick={() => onChange(null, null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: isAllActive ? '#A8B5A0' : undefined,
            color: isAllActive ? 'white' : 'var(--foreground-secondary)',
            border: !isAllActive ? '1px solid var(--border)' : 'none',
          }}
        >
          {lang === 'fr' ? 'Tous' : lang === 'es' ? 'Todos' : 'All'}
        </button>

        {/* Presets d'âge - sélection multiple */}
        {AGE_PRESETS.map((preset, idx) => {
          const isActive = isPresetInRange(preset.min, preset.max)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => togglePreset(preset.min, preset.max)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? '#A8B5A0' : undefined,
                color: isActive ? 'white' : 'var(--foreground-secondary)',
                border: !isActive ? '1px solid var(--border)' : 'none',
              }}
            >
              {preset.label[lang]}
            </button>
          )
        })}
      </div>

      {/* Indicateur de plage sélectionnée */}
      {!isAllActive && (
        <p className="text-xs text-sage font-medium">
          {lang === 'fr' ? 'Plage : ' : lang === 'es' ? 'Rango: ' : 'Range: '}
          {getRangeLabel()}
        </p>
      )}
    </div>
  )
}
