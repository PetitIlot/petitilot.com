'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { GemColor } from '@/components/ui/button'
import { gemPillStyle } from '@/components/filters/gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'

export interface TagItem {
  value: string
  label: Record<Language, string>
  emoji?: string
  isCustom?: boolean
}

interface AutocompleteTagProps {
  lang: Language
  predefinedOptions: TagItem[]
  selectedValues: string[]
  onAdd: (value: string, isCustom: boolean) => void
  onRemove: (value: string) => void
  placeholder: string
  maxItems?: number
  allowCustom?: boolean
  customLabel?: string
  colorClass?: string
  gem?: GemColor
  hideTags?: boolean
}

const translations = {
  fr: {
    addCustom: 'Ajouter',
    customBadge: 'Suggestion',
    noResults: 'Aucun résultat',
    typeToSearch: 'Tapez pour rechercher...'
  },
  en: {
    addCustom: 'Add',
    customBadge: 'Suggestion',
    noResults: 'No results',
    typeToSearch: 'Type to search...'
  },
  es: {
    addCustom: 'Agregar',
    customBadge: 'Sugerencia',
    noResults: 'Sin resultados',
    typeToSearch: 'Escribe para buscar...'
  }
}

export default function AutocompleteTag({
  lang,
  predefinedOptions,
  selectedValues,
  onAdd,
  onRemove,
  placeholder,
  maxItems,
  allowCustom = true,
  colorClass = 'bg-[#A8B5A0]/20',
  gem,
  hideTags = false
}: AutocompleteTagProps) {
  const t = translations[lang]
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect dark mode for gem styles
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    if (!gem) return
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [gem])

  // Filtrer les options disponibles
  const availableOptions = predefinedOptions.filter(
    opt => !selectedValues.includes(opt.value)
  )

  // Filtrer selon la recherche
  const filteredOptions = inputValue.trim()
    ? availableOptions.filter(opt => {
        const searchLower = inputValue.toLowerCase()
        return (
          opt.value.toLowerCase().includes(searchLower) ||
          opt.label[lang].toLowerCase().includes(searchLower)
        )
      })
    : availableOptions

  // Vérifier si la valeur saisie est un custom (pas dans les prédéfinis)
  const isCustomValue = inputValue.trim() && !predefinedOptions.some(
    opt => opt.value.toLowerCase() === inputValue.trim().toLowerCase() ||
           opt.label[lang].toLowerCase() === inputValue.trim().toLowerCase()
  )

  // Vérifier si on peut encore ajouter
  const canAdd = !maxItems || selectedValues.length < maxItems

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlight quand les options changent
  useEffect(() => {
    setHighlightedIndex(0)
  }, [inputValue])

  const handleSelect = (option: TagItem) => {
    if (!canAdd) return
    onAdd(option.value, false)
    setInputValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleAddCustom = () => {
    if (!canAdd || !inputValue.trim() || !allowCustom) return
    const customValue = inputValue.trim()
    // Éviter les doublons
    if (selectedValues.includes(customValue)) return
    onAdd(customValue, true)
    setInputValue('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev =>
        Math.min(prev + 1, filteredOptions.length - 1 + (isCustomValue && allowCustom ? 1 : 0))
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isCustomValue && allowCustom && highlightedIndex === filteredOptions.length) {
        handleAddCustom()
      } else if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex])
      } else if (isCustomValue && allowCustom) {
        handleAddCustom()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const getLabel = (value: string): string => {
    const option = predefinedOptions.find(opt => opt.value === value)
    return option ? option.label[lang] : value
  }

  const getEmoji = (value: string): string | undefined => {
    const option = predefinedOptions.find(opt => opt.value === value)
    return option?.emoji
  }

  const isCustom = (value: string): boolean => {
    return !predefinedOptions.some(opt => opt.value === value)
  }

  return (
    <div className="space-y-3">
      {/* Input avec dropdown */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={canAdd ? placeholder : `Maximum ${maxItems} atteint`}
          disabled={!canAdd}
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 dark:border-white/10 bg-transparent dark:bg-white/5 focus:border-[#A8B5A0] dark:focus:border-[#6EE8A0]/50 focus:ring-2 focus:ring-[#A8B5A0]/20 dark:focus:ring-[#6EE8A0]/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-white/30"
        />

        {/* Dropdown */}
        {isOpen && inputValue.trim() && (
          <div
            ref={dropdownRef}
            className="absolute z-20 w-full mt-1 bg-white dark:bg-[#1e1e22] rounded-xl border border-[#E5E7EB] dark:border-white/10 shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length === 0 && !isCustomValue && (
              <div className="px-4 py-3 text-sm text-[#5D5A4E]/50 dark:text-white/40">
                {t.noResults}
              </div>
            )}

            {/* Options prédéfinies */}
            {filteredOptions.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-2 transition-colors ${
                  highlightedIndex === index
                    ? 'bg-[#A8B5A0]/10 dark:bg-white/10'
                    : 'hover:bg-[#F5E6D3]/50 dark:hover:bg-white/5'
                }`}
              >
                <FilterIcon value={option.value} size={14} />
                <span className="text-sm text-[#5D5A4E] dark:text-white">{option.label[lang]}</span>
              </button>
            ))}

            {/* Option custom */}
            {isCustomValue && allowCustom && canAdd && (
              <button
                type="button"
                onClick={handleAddCustom}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-2 border-t border-[#E5E7EB] dark:border-white/10 transition-colors ${
                  highlightedIndex === filteredOptions.length
                    ? 'bg-[#A8B5A0]/10 dark:bg-white/10'
                    : 'hover:bg-[#F5E6D3]/50 dark:hover:bg-white/5'
                }`}
              >
                <Plus className="w-4 h-4 text-[#A8B5A0] dark:text-[#6EE8A0]" />
                <span className="text-sm text-[#5D5A4E] dark:text-white">
                  {t.addCustom} "<strong>{inputValue.trim()}</strong>"
                </span>
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {t.customBadge}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tags sélectionnés */}
      {!hideTags && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map(value => {
            // Custom tags keep the amber style
            if (isCustom(value)) {
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/30"
                >
                  <FilterIcon value={value} size={14} />
                  <span>{getLabel(value)}</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <button
                    type="button"
                    onClick={() => onRemove(value)}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )
            }

            // Gem-styled tags
            if (gem) {
              const gs = gemPillStyle(gem, true, isDark)
              return (
                <span
                  key={value}
                  className="inline-flex transition-all duration-300"
                  style={{ ...gs.wrapper, borderRadius: 20, padding: 1.5 }}
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5"
                    style={{ ...gs.inner, borderRadius: 18.5, display: 'inline-flex', position: 'relative', overflow: 'hidden' } as React.CSSProperties}
                  >
                    <span style={gs.frost as React.CSSProperties} aria-hidden />
                    <span style={gs.shine as React.CSSProperties} aria-hidden />
                    <span className="relative z-[2] inline-flex items-center gap-1.5 text-sm" style={{ fontWeight: 600 }}>
                      <FilterIcon value={value} size={14} />
                      <span>{getLabel(value)}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(value)}
                        className="hover:opacity-60 transition-opacity ml-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </span>
                </span>
              )
            }

            // Fallback: simple colorClass style
            return (
              <span
                key={value}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${colorClass} text-[#5D5A4E] dark:text-white/80`}
              >
                <FilterIcon value={value} size={14} />
                <span>{getLabel(value)}</span>
                <button
                  type="button"
                  onClick={() => onRemove(value)}
                  className="hover:text-red-500 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
