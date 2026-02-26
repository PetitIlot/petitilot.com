'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { gemSegmentStyle } from './gemFilterStyle'

interface AutonomyToggleProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
  lang: Language
}

const translations = {
  fr: { help: 'L\'enfant peut faire seul', yes: 'Oui', no: 'Non', all: 'Tous' },
  en: { help: 'Child can do alone', yes: 'Yes', no: 'No', all: 'All' },
  es: { help: 'El niño puede hacer solo', yes: 'Sí', no: 'No', all: 'Todos' }
}

export default function AutonomyToggle({ value, onChange, lang }: AutonomyToggleProps) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const options: { value: boolean | null; label: string }[] = [
    { value: null, label: t.all },
    { value: true, label: t.yes },
    { value: false, label: t.no },
  ]
  const GEM = 'sage' as const

  return (
    <div className="space-y-2">
      <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.help}</p>
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {options.map((opt, idx) => {
          const isSelected = value === opt.value
          const s = gemSegmentStyle(GEM, isSelected, isDark)
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${!isSelected ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]' : ''}`}
              style={s}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
