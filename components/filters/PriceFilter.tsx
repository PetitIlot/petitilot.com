'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { gemSegmentStyle } from './gemFilterStyle'

interface PriceFilterProps {
  isFree: boolean | null
  priceMin: number | null
  priceMax: number | null
  onFreeChange: (value: boolean | null) => void
  onPriceRangeChange: (min: number | null, max: number | null) => void
  lang: Language
}

const translations = {
  fr: { free: 'Gratuit', paid: 'Payant', all: 'Tous', priceRange: 'Fourchette de prix', credits: 'crédits' },
  en: { free: 'Free', paid: 'Paid', all: 'All', priceRange: 'Price range', credits: 'credits' },
  es: { free: 'Gratis', paid: 'De pago', all: 'Todos', priceRange: 'Rango de precio', credits: 'créditos' }
}

export default function PriceFilter({ isFree, priceMin, priceMax, onFreeChange, onPriceRangeChange, lang }: PriceFilterProps) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const GEM = 'mauve' as const
  const freeOptions: { value: boolean | null; label: string }[] = [
    { value: null, label: t.all }, { value: true, label: t.free }, { value: false, label: t.paid },
  ]

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {freeOptions.map((opt, idx) => {
          const isSelected = isFree === opt.value
          const s = gemSegmentStyle(GEM, isSelected, isDark)
          return (
            <button key={idx} type="button" onClick={() => onFreeChange(opt.value)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${!isSelected ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]' : ''}`}
              style={s}
            >{opt.label}</button>
          )
        })}
      </div>

      {isFree === false && (
        <div className="space-y-2">
          <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.priceRange}</p>
          <div className="flex items-center gap-2">
            <input type="number" min={0} max={100} placeholder="Min" value={priceMin ?? ''}
              onChange={(e) => onPriceRangeChange(e.target.value ? parseInt(e.target.value) : null, priceMax)}
              className="w-20 px-2 py-1.5 rounded-lg text-sm text-center bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-[#A892CB]/30"
              style={{ border: '1px solid var(--border)' }} />
            <span className="text-foreground-secondary dark:text-foreground-dark-secondary">—</span>
            <input type="number" min={0} max={100} placeholder="Max" value={priceMax ?? ''}
              onChange={(e) => onPriceRangeChange(priceMin, e.target.value ? parseInt(e.target.value) : null)}
              className="w-20 px-2 py-1.5 rounded-lg text-sm text-center bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-[#A892CB]/30"
              style={{ border: '1px solid var(--border)' }} />
            <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{t.credits}</span>
          </div>
        </div>
      )}
    </div>
  )
}
