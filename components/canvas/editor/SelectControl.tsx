'use client'

import type { ReactNode } from 'react'

interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface SelectControlProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Display as button group instead of dropdown */
  variant?: 'dropdown' | 'buttons'
}

export function SelectControl({ label, value, options, onChange, variant = 'dropdown' }: SelectControlProps) {
  if (variant === 'buttons') {
    return (
      <div className="space-y-1.5">
        <label className="text-xs text-[var(--foreground-secondary)]">{label}</label>
        <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--surface-secondary)]">
          {options.map(opt => {
            const active = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  active
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                }`}
                style={{
                  transitionTimingFunction: 'var(--spring-smooth)'
                }}
              >
                {opt.icon}
                <span className={opt.icon ? 'hidden sm:inline' : ''}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-[var(--foreground-secondary)]">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--sage)] cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386868B' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
