'use client'

import type { Language } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants/filters'

interface CategoryFilterProps {
  selected: string[]
  onToggle: (value: string) => void
  lang: Language
}

/**
 * Boutons pour sélectionner les types d'activité
 */
export default function CategoryFilter({ selected, onToggle, lang }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => {
        const isSelected = selected.includes(cat.value)
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onToggle(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#A8B5A0] text-white'
                : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
            }`}
            style={!isSelected ? { border: '1px solid var(--border)' } : undefined}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
