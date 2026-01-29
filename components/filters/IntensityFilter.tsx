'use client'

import type { Language } from '@/lib/types'
import { INTENSITY_OPTIONS } from '@/lib/constants/filters'

interface IntensityFilterProps {
  selected: string | null
  onChange: (value: string | null) => void
  lang: Language
}

/**
 * 3 boutons pour sélectionner l'intensité (calme/modéré/actif)
 */
export default function IntensityFilter({ selected, onChange, lang }: IntensityFilterProps) {
  const handleClick = (value: string) => {
    onChange(selected === value ? null : value)
  }

  return (
    <div className="flex gap-2">
      {INTENSITY_OPTIONS.map(opt => {
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleClick(opt.value)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              isSelected
                ? 'bg-[#A8B5A0] text-white'
                : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
            }`}
            style={!isSelected ? { border: '1px solid var(--border)' } : undefined}
          >
            <span>{opt.emoji}</span>
            <span>{opt.label[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
