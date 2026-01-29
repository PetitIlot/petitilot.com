'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterSectionProps {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}

/**
 * Section pliable pour les filtres
 * Utilise CSS grid pour une animation fluide de la hauteur
 */
export default function FilterSection({
  title,
  count = 0,
  defaultOpen = false,
  children
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground dark:text-foreground-dark">
            {title}
          </span>
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium bg-[#A8B5A0] text-white rounded-full">
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-foreground-secondary dark:text-foreground-dark-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Grid trick pour animer height: auto */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
