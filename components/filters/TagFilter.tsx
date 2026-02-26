'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { FilterOption } from '@/lib/constants/filters'
import { gemPillStyle, type GemColor } from './gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

interface TagFilterProps {
  options: FilterOption[]
  groups?: Record<string, Record<Language, string>>
  selected: string[]
  onToggle: (value: string) => void
  lang: Language
  placeholder?: string
  maxVisible?: number
  gem?: GemColor
}

/**
 * Filtre par tags avec recherche et groupes optionnels
 */
export default function TagFilter({
  options,
  groups,
  selected,
  onToggle,
  lang,
  placeholder = 'Rechercher...',
  maxVisible = 12,
  gem = 'sage'
}: TagFilterProps) {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const query = search.toLowerCase()
    return options.filter(opt =>
      opt.label[lang].toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query)
    )
  }, [options, search, lang])

  const groupedOptions = useMemo(() => {
    if (!groups) return { default: filteredOptions }
    const grouped: Record<string, FilterOption[]> = {}
    for (const opt of filteredOptions) {
      const group = opt.group || 'other'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(opt)
    }
    return grouped
  }, [filteredOptions, groups])

  const visibleOptions = useMemo(() => {
    if (showAll || search) return filteredOptions
    return filteredOptions.slice(0, maxVisible)
  }, [filteredOptions, showAll, search, maxVisible])

  const hasMore = filteredOptions.length > maxVisible && !search

  const sortedSelected = useMemo(() => {
    return options.filter(opt => selected.includes(opt.value))
  }, [options, selected])

  return (
    <div className="space-y-3">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary/50 dark:text-foreground-dark-secondary/50 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 py-2 rounded-xl text-sm bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary/50 dark:placeholder:text-foreground-dark-secondary/50 outline-none focus:ring-2 focus:ring-[#A8B5A0]/30"
          style={{ border: '1px solid var(--border)' }}
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags sélectionnés — gemstone style */}
      {sortedSelected.length > 0 && !search && (
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[var(--border)]">
          {sortedSelected.map(opt => {
            const s = gemPillStyle(gem, true, isDark)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className="transition-all duration-200 active:scale-[0.97]"
                style={{ ...s.wrapper, borderRadius: 16, padding: 1 }}
              >
                <div
                  className="flex items-center gap-1"
                  style={{ ...s.inner, padding: '4px 8px', fontSize: 12, borderRadius: 15 }}
                >
                  <span aria-hidden style={{ ...s.frost, borderRadius: 15 }} />
                  <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={opt.value} size={14} /></span>
                  <span style={{ position: 'relative', zIndex: 2 }}>{opt.label[lang]}</span>
                  <X className="w-3 h-3 ml-0.5" style={{ position: 'relative', zIndex: 2 }} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Toutes les options */}
      {groups ? (
        <div className="space-y-3">
          {Object.entries(groupedOptions).map(([groupKey, groupOptions]) => {
            if (!groupOptions.length) return null
            const groupLabel = groups[groupKey]?.[lang] || groupKey
            const unselectedOptions = groupOptions.filter(opt => !selected.includes(opt.value))
            if (!unselectedOptions.length) return null

            return (
              <div key={groupKey}>
                <p className="text-xs font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-1.5">{groupLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {unselectedOptions.slice(0, showAll || search ? undefined : 6).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onToggle(opt.value)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all flex items-center gap-1"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <FilterIcon value={opt.value} size={14} />
                      <span>{opt.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {visibleOptions
            .filter(opt => !selected.includes(opt.value))
            .map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all flex items-center gap-1"
                style={{ border: '1px solid var(--border)' }}
              >
                <FilterIcon value={opt.value} size={14} />
                <span>{opt.label[lang]}</span>
              </button>
            ))}
        </div>
      )}

      {hasMore && !showAll && (
        <button type="button" onClick={() => setShowAll(true)} className="flex items-center gap-1 text-xs text-foreground-secondary dark:text-foreground-dark-secondary hover:underline">
          <span>Voir tout ({filteredOptions.length})</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
