'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Sparkles } from 'lucide-react'
import type { Language } from '@/lib/types'

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
  colorClass = 'bg-[#A8B5A0]/20'
}: AutocompleteTagProps) {
  const t = translations[lang]
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
          className="w-full px-4 py-3 rounded-xl border border-[#A8B5A0]/30 focus:border-[#A8B5A0] focus:ring-2 focus:ring-[#A8B5A0]/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Dropdown */}
        {isOpen && inputValue.trim() && (
          <div
            ref={dropdownRef}
            className="absolute z-20 w-full mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length === 0 && !isCustomValue && (
              <div className="px-4 py-3 text-sm text-[#5D5A4E]/50">
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
                    ? 'bg-[#A8B5A0]/10'
                    : 'hover:bg-[#F5E6D3]/50'
                }`}
              >
                {option.emoji && <span>{option.emoji}</span>}
                <span className="text-sm text-[#5D5A4E]">{option.label[lang]}</span>
              </button>
            ))}

            {/* Option custom */}
            {isCustomValue && allowCustom && canAdd && (
              <button
                type="button"
                onClick={handleAddCustom}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-2 border-t border-[#E5E7EB] transition-colors ${
                  highlightedIndex === filteredOptions.length
                    ? 'bg-[#A8B5A0]/10'
                    : 'hover:bg-[#F5E6D3]/50'
                }`}
              >
                <Plus className="w-4 h-4 text-[#A8B5A0]" />
                <span className="text-sm text-[#5D5A4E]">
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
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map(value => (
            <span
              key={value}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                isCustom(value)
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : `${colorClass} text-[#5D5A4E]`
              }`}
            >
              {getEmoji(value) && <span>{getEmoji(value)}</span>}
              <span>{getLabel(value)}</span>
              {isCustom(value) && (
                <Sparkles className="w-3 h-3 text-amber-500" />
              )}
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="hover:text-red-500 transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
