'use client'

import type { Language } from '@/lib/types'
import { DURATION_PRESETS } from '@/lib/constants/filters'

interface DurationFilterProps {
  selected: number | null
  onChange: (value: number | null) => void
  lang: Language
}

/**
 * Boutons presets pour filtrer par durée maximum
 */
export default function DurationFilter({ selected, onChange, lang }: DurationFilterProps) {
  const handleClick = (value: number) => {
    // Toggle : si déjà sélectionné, on désélectionne
    onChange(selected === value ? null : value)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DURATION_PRESETS.map(preset => {
        const value = parseInt(preset.value)
        const isSelected = selected === value
        return (
          <button
            key={preset.value}
            type="button"
            onClick={() => handleClick(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#A8B5A0] text-white'
                : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
            }`}
            style={!isSelected ? { border: '1px solid var(--border)' } : undefined}
          >
            <span>{preset.emoji}</span>
            <span>{preset.label[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
