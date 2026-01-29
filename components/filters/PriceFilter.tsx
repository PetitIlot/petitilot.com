'use client'

import { Download } from 'lucide-react'
import type { Language } from '@/lib/types'

interface PriceFilterProps {
  isFree: boolean | null
  hasDownload: boolean | null
  priceMin: number | null
  priceMax: number | null
  onFreeChange: (value: boolean | null) => void
  onDownloadChange: (value: boolean | null) => void
  onPriceRangeChange: (min: number | null, max: number | null) => void
  // Pour batch les changements en un seul router.push
  onBatchChange?: (changes: { hasDownload?: boolean | null; isFree?: boolean | null; priceMin?: number | null; priceMax?: number | null }) => void
  lang: Language
}

const translations = {
  fr: {
    free: 'Gratuit',
    paid: 'Payant',
    all: 'Tous',
    hasDownload: 'PDF téléchargeable',
    priceRange: 'Fourchette de prix',
    credits: 'crédits'
  },
  en: {
    free: 'Free',
    paid: 'Paid',
    all: 'All',
    hasDownload: 'Downloadable PDF',
    priceRange: 'Price range',
    credits: 'credits'
  },
  es: {
    free: 'Gratis',
    paid: 'De pago',
    all: 'Todos',
    hasDownload: 'PDF descargable',
    priceRange: 'Rango de precio',
    credits: 'créditos'
  }
}

/**
 * Filtres de prix : gratuit/payant, PDF, range de prix
 */
export default function PriceFilter({
  isFree,
  hasDownload,
  priceMin,
  priceMax,
  onFreeChange,
  onDownloadChange,
  onPriceRangeChange,
  onBatchChange,
  lang
}: PriceFilterProps) {
  const t = translations[lang]

  // Options gratuit/payant
  const freeOptions = [
    { value: null, label: t.all },
    { value: true, label: t.free },
    { value: false, label: t.paid },
  ]

  return (
    <div className="space-y-4">
      {/* Toggle PDF téléchargeable oui/non */}
      <button
        type="button"
        onClick={() => {
          const newValue = hasDownload === true ? null : true
          // Batch tous les changements en un seul appel pour éviter race conditions
          if (onBatchChange) {
            if (newValue === null) {
              onBatchChange({ hasDownload: null, isFree: null, priceMin: null, priceMax: null })
            } else {
              onBatchChange({ hasDownload: true })
            }
          } else {
            onDownloadChange(newValue)
          }
        }}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
          hasDownload === true
            ? 'bg-[#A8B5A0] text-white'
            : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
        }`}
        style={hasDownload !== true ? { border: '1px solid var(--border)' } : undefined}
      >
        <Download className="w-4 h-4" />
        <span>{t.hasDownload}</span>
      </button>

      {/* Toggle gratuit/payant (si PDF téléchargeable) */}
      {hasDownload === true && (
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {freeOptions.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onFreeChange(opt.value)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
                isFree === opt.value
                  ? 'bg-[#A8B5A0] text-white'
                  : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Range de prix (si PDF ET payant) */}
      {hasDownload === true && isFree === false && (
        <div className="space-y-2">
          <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
            {t.priceRange}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Min"
              value={priceMin ?? ''}
              onChange={(e) => onPriceRangeChange(
                e.target.value ? parseInt(e.target.value) : null,
                priceMax
              )}
              className="w-20 px-2 py-1.5 rounded-lg text-sm text-center bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-[#A8B5A0]/30"
              style={{ border: '1px solid var(--border)' }}
            />
            <span className="text-foreground-secondary dark:text-foreground-dark-secondary">—</span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Max"
              value={priceMax ?? ''}
              onChange={(e) => onPriceRangeChange(
                priceMin,
                e.target.value ? parseInt(e.target.value) : null
              )}
              className="w-20 px-2 py-1.5 rounded-lg text-sm text-center bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none focus:ring-2 focus:ring-[#A8B5A0]/30"
              style={{ border: '1px solid var(--border)' }}
            />
            <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
              {t.credits}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
