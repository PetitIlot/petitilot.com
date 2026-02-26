'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { PREP_TIME_PRESETS } from '@/lib/constants/filters'
import { gemPillStyle } from './gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

interface PrepTimeFilterProps {
  selected: number | null
  onChange: (value: number | null) => void
  lang: Language
}

export default function PrepTimeFilter({ selected, onChange, lang }: PrepTimeFilterProps) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const GEM = 'terracotta' as const

  return (
    <div className="flex flex-wrap gap-2">
      {PREP_TIME_PRESETS.map(preset => {
        const value = parseInt(preset.value)
        const isSelected = selected === value
        const s = gemPillStyle(GEM, isSelected, isDark)
        return (
          <button key={preset.value} type="button" onClick={() => onChange(isSelected ? null : value)} className="transition-all duration-300 active:scale-[0.97]" style={s.wrapper}>
            <div className="flex items-center gap-1.5" style={{ ...s.inner, padding: '6px 12px' }}>
              {isSelected && <span aria-hidden style={s.frost} />}
              {isSelected && <span aria-hidden style={s.shine} />}
              <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={preset.value} size={16} /></span>
              <span style={{ position: 'relative', zIndex: 2 }}>{preset.label[lang]}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
