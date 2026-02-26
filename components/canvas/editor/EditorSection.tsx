'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface EditorSectionProps {
  title: string
  icon?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function EditorSection({ title, icon, defaultOpen = true, children }: EditorSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  // Allow overflow (for dropdowns) only after open transition completes
  const [settled, setSettled] = useState(defaultOpen)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setSettled(true), 220)
      return () => clearTimeout(t)
    } else {
      setSettled(false)
    }
  }, [open])

  return (
    <div className="border-b border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-150"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="opacity-60">{icon}</span>}
          {title}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transitionTimingFunction: 'var(--spring-smooth)'
          }}
        />
      </button>
      <div
        className={`transition-all duration-200 ${settled ? 'overflow-visible' : 'overflow-hidden'}`}
        style={{
          maxHeight: open ? (settled ? 'none' : '2000px') : '0',
          opacity: open ? 1 : 0,
          transitionTimingFunction: 'var(--spring-smooth)'
        }}
      >
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}
