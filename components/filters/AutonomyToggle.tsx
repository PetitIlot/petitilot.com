'use client'

import type { Language } from '@/lib/types'

interface AutonomyToggleProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
  lang: Language
}

const translations = {
  fr: {
    label: 'Activité autonome',
    help: 'L\'enfant peut faire seul',
    yes: 'Oui',
    no: 'Non',
    all: 'Tous'
  },
  en: {
    label: 'Independent activity',
    help: 'Child can do alone',
    yes: 'Yes',
    no: 'No',
    all: 'All'
  },
  es: {
    label: 'Actividad autónoma',
    help: 'El niño puede hacer solo',
    yes: 'Sí',
    no: 'No',
    all: 'Todos'
  }
}

/**
 * Toggle 3 états : Tous / Oui / Non
 */
export default function AutonomyToggle({ value, onChange, lang }: AutonomyToggleProps) {
  const t = translations[lang]

  const options = [
    { value: null, label: t.all },
    { value: true, label: t.yes },
    { value: false, label: t.no },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
        {t.help}
      </p>
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
              value === opt.value
                ? 'bg-[#A8B5A0] text-white'
                : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
