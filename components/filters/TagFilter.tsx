'use client'

import { useState, useMemo } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { FilterOption } from '@/lib/constants/filters'

interface TagFilterProps {
  options: FilterOption[]
  groups?: Record<string, Record<Language, string>>
  selected: string[]
  onToggle: (value: string) => void
  lang: Language
  placeholder?: string
  maxVisible?: number
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
  maxVisible = 12
}: TagFilterProps) {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Filtrer les options par recherche
  const filteredOptions = useMemo(() => {
    if (!search) return options
    const query = search.toLowerCase()
    return options.filter(opt =>
      opt.label[lang].toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query)
    )
  }, [options, search, lang])

  // Grouper les options si groups est défini
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

  // Options à afficher (limitées si pas en mode showAll)
  const visibleOptions = useMemo(() => {
    if (showAll || search) return filteredOptions
    return filteredOptions.slice(0, maxVisible)
  }, [filteredOptions, showAll, search, maxVisible])

  const hasMore = filteredOptions.length > maxVisible && !search

  // Afficher les options sélectionnées en premier
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
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tags sélectionnés */}
      {sortedSelected.length > 0 && !search && (
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[var(--border)]">
          {sortedSelected.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#A8B5A0] text-white flex items-center gap-1"
            >
              {opt.emoji && <span>{opt.emoji}</span>}
              <span>{opt.label[lang]}</span>
              <X className="w-3 h-3 ml-0.5" />
            </button>
          ))}
        </div>
      )}

      {/* Toutes les options */}
      {groups ? (
        // Affichage groupé
        <div className="space-y-3">
          {Object.entries(groupedOptions).map(([groupKey, groupOptions]) => {
            if (!groupOptions.length) return null
            const groupLabel = groups[groupKey]?.[lang] || groupKey

            // Ne montrer que les options non sélectionnées
            const unselectedOptions = groupOptions.filter(opt => !selected.includes(opt.value))
            if (!unselectedOptions.length) return null

            return (
              <div key={groupKey}>
                <p className="text-xs font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-1.5">
                  {groupLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unselectedOptions.slice(0, showAll || search ? undefined : 6).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onToggle(opt.value)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20 transition-all flex items-center gap-1"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      {opt.emoji && <span>{opt.emoji}</span>}
                      <span>{opt.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Affichage simple
        <div className="flex flex-wrap gap-1.5">
          {visibleOptions
            .filter(opt => !selected.includes(opt.value))
            .map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20 transition-all flex items-center gap-1"
                style={{ border: '1px solid var(--border)' }}
              >
                {opt.emoji && <span>{opt.emoji}</span>}
                <span>{opt.label[lang]}</span>
              </button>
            ))}
        </div>
      )}

      {/* Bouton "Voir plus" */}
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-xs text-[#A8B5A0] hover:underline"
        >
          <span>Voir tout ({filteredOptions.length})</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
