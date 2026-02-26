'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { DIFFICULTY_OPTIONS } from '@/lib/constants/filters'
import { gemSegmentStyle } from './gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

interface DifficultyFilterProps {
  selected: string | null
  onChange: (value: string | null) => void
  lang: Language
}

export default function DifficultyFilter({ selected, onChange, lang }: DifficultyFilterProps) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const GEM = 'amber' as const

  return (
    <div className="flex gap-2">
      {DIFFICULTY_OPTIONS.map(opt => {
        const isSelected = selected === opt.value
        const s = gemSegmentStyle(GEM, isSelected, isDark)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(isSelected ? null : opt.value)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-[0.97] ${!isSelected ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]' : ''}`}
            style={{ ...s, border: !isSelected ? '1px solid var(--border)' : 'none' }}
          >
            <FilterIcon value={opt.value} size={16} />
            <span>{opt.label[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
