'use client'

interface ToggleControlProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleControl({ label, description, checked, onChange }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-xs text-[var(--foreground)]">{label}</span>
        {description && (
          <p className="text-[10px] text-[var(--foreground-secondary)] truncate">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: checked ? 'var(--sage)' : 'var(--border-strong)',
          transitionTimingFunction: 'var(--spring-smooth)'
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{
            transform: checked ? 'translateX(16px)' : 'translateX(0)',
            transitionTimingFunction: 'var(--spring-bounce)'
          }}
        />
      </button>
    </div>
  )
}
