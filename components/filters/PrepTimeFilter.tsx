'use client'

import type { Language } from '@/lib/types'
import { PREP_TIME_PRESETS } from '@/lib/constants/filters'

interface PrepTimeFilterProps {
  selected: number | null
  onChange: (value: number | null) => void
  lang: Language
}

/**
 * Boutons presets pour filtrer par temps de préparation maximum
 */
export default function PrepTimeFilter({ selected, onChange, lang }: PrepTimeFilterProps) {
  const handleClick = (value: number) => {
    onChange(selected === value ? null : value)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PREP_TIME_PRESETS.map(preset => {
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
