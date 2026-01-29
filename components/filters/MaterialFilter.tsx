'use client'

import { useState } from 'react'
import { Info, ChevronDown } from 'lucide-react'
import type { Language } from '@/lib/types'
import { MATERIALS, MATERIAL_GROUPS, BUDGET_TYPES } from '@/lib/constants/filters'
import TagFilter from './TagFilter'

interface MaterialFilterProps {
  selected: string[]
  mode: 'filter' | 'match'
  onToggle: (value: string) => void
  onModeChange: (mode: 'filter' | 'match') => void
  lang: Language
}

const translations = {
  fr: {
    budgetType: 'Type de matériel',
    modeFilter: 'Contient',
    modeMatch: 'J\'ai ce matériel',
    modeFilterHelp: 'Affiche les ressources contenant au moins un matériau sélectionné',
    modeMatchHelp: 'Affiche uniquement les ressources faisables avec le matériel que vous possédez',
    placeholder: 'Rechercher un matériau...',
    advancedSearch: 'Recherche détaillée',
  },
  en: {
    budgetType: 'Material type',
    modeFilter: 'Contains',
    modeMatch: 'I have this',
    modeFilterHelp: 'Shows resources containing at least one selected material',
    modeMatchHelp: 'Shows only resources doable with materials you own',
    placeholder: 'Search material...',
    advancedSearch: 'Detailed search',
  },
  es: {
    budgetType: 'Tipo de material',
    modeFilter: 'Contiene',
    modeMatch: 'Tengo esto',
    modeFilterHelp: 'Muestra recursos que contienen al menos un material seleccionado',
    modeMatchHelp: 'Muestra solo recursos realizables con materiales que posees',
    placeholder: 'Buscar material...',
    advancedSearch: 'Búsqueda detallada',
  }
}

/**
 * Filtre par matériaux avec :
 * 1. Tags généraux (type de budget)
 * 2. Mode filtre/match
 * 3. Recherche détaillée par matériau
 */
export default function MaterialFilter({
  selected,
  mode,
  onToggle,
  onModeChange,
  lang
}: MaterialFilterProps) {
  const t = translations[lang]
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Séparer les sélections : budget types vs matériaux détaillés
  const budgetValues = BUDGET_TYPES.map(b => b.value)
  const selectedBudgets = selected.filter(s => budgetValues.includes(s))
  const selectedMaterials = selected.filter(s => !budgetValues.includes(s))

  return (
    <div className="space-y-4">
      {/* Tags généraux de type de matériel */}
      <div>
        <p className="text-xs font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-2">
          {t.budgetType}
        </p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_TYPES.map(opt => {
            const isSelected = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#A8B5A0] text-white'
                    : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
                }`}
                style={!isSelected ? { border: '1px solid var(--border)' } : undefined}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label[lang]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <button
          type="button"
          onClick={() => onModeChange('filter')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
            mode === 'filter'
              ? 'bg-[#A8B5A0] text-white'
              : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#A8B5A0]/20'
          }`}
        >
          {t.modeFilter}
        </button>
        <button
          type="button"
          onClick={() => onModeChange('match')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
            mode === 'match'
              ? 'bg-[#C8D8E4] text-[#5D5A4E]'
              : 'bg-surface-secondary dark:bg-surface-dark text-foreground-secondary dark:text-foreground-dark-secondary hover:bg-[#C8D8E4]/20'
          }`}
        >
          {t.modeMatch}
        </button>
      </div>

      {/* Info sur le mode actuel */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-secondary/50 dark:bg-surface-dark/50">
        <Info className="w-4 h-4 text-foreground-secondary dark:text-foreground-dark-secondary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">
          {mode === 'filter' ? t.modeFilterHelp : t.modeMatchHelp}
        </p>
      </div>

      {/* Recherche détaillée (pliable) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-[#A8B5A0] hover:underline"
        >
          <span>{t.advancedSearch}</span>
          {selectedMaterials.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-[#A8B5A0] text-white rounded-full text-[10px]">
              {selectedMaterials.length}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="mt-3">
            <TagFilter
              options={MATERIALS}
              groups={MATERIAL_GROUPS}
              selected={selectedMaterials}
              onToggle={onToggle}
              lang={lang}
              placeholder={t.placeholder}
              maxVisible={8}
            />
          </div>
        )}
      </div>
    </div>
  )
}
