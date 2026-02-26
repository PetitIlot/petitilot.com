'use client'

import { useState, useEffect } from 'react'
import { Info, ChevronDown } from 'lucide-react'
import type { Language } from '@/lib/types'
import { MATERIALS, MATERIAL_GROUPS, BUDGET_TYPES } from '@/lib/constants/filters'
import { gemPillStyle, gemSegmentStyle } from './gemFilterStyle'
import { FilterIcon } from '@/lib/constants/resourceIcons'
import TagFilter from './TagFilter'

interface MaterialFilterProps {
  selected: string[]
  mode: 'filter' | 'match'
  onToggle: (value: string) => void
  onModeChange: (mode: 'filter' | 'match') => void
  lang: Language
}

const translations = {
  fr: { budgetType: 'Type de matériel', modeFilter: 'Contient', modeMatch: 'J\'ai ce matériel', modeFilterHelp: 'Affiche les ressources contenant au moins un matériau sélectionné', modeMatchHelp: 'Affiche uniquement les ressources faisables avec le matériel que vous possédez', placeholder: 'Rechercher un matériau...', advancedSearch: 'Recherche détaillée' },
  en: { budgetType: 'Material type', modeFilter: 'Contains', modeMatch: 'I have this', modeFilterHelp: 'Shows resources containing at least one selected material', modeMatchHelp: 'Shows only resources doable with materials you own', placeholder: 'Search material...', advancedSearch: 'Detailed search' },
  es: { budgetType: 'Tipo de material', modeFilter: 'Contiene', modeMatch: 'Tengo esto', modeFilterHelp: 'Muestra recursos que contienen al menos un material seleccionado', modeMatchHelp: 'Muestra solo recursos realizables con materiales que posees', placeholder: 'Buscar material...', advancedSearch: 'Búsqueda detallada' }
}

export default function MaterialFilter({ selected, mode, onToggle, onModeChange, lang }: MaterialFilterProps) {
  const t = translations[lang]
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const budgetValues = BUDGET_TYPES.map(b => b.value)
  const selectedMaterials = selected.filter(s => !budgetValues.includes(s))
  const BUDGET_GEM = 'amber' as const

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-2">{t.budgetType}</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_TYPES.map(opt => {
            const isSelected = selected.includes(opt.value)
            const s = gemPillStyle(BUDGET_GEM, isSelected, isDark)
            return (
              <button key={opt.value} type="button" onClick={() => onToggle(opt.value)} className="transition-all duration-300 active:scale-[0.97]" style={s.wrapper}>
                <div className="flex items-center gap-1.5" style={{ ...s.inner, padding: '5px 10px', fontSize: 12 }}>
                  {isSelected && <span aria-hidden style={s.frost} />}
                  {isSelected && <span aria-hidden style={s.shine} />}
                  <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={opt.value} size={16} /></span>
                  <span style={{ position: 'relative', zIndex: 2 }}>{opt.label[lang]}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {(['filter', 'match'] as const).map((m) => {
          const isSelected = mode === m
          const s = gemSegmentStyle(m === 'filter' ? 'sky' : 'sage', isSelected, isDark)
          return (
            <button key={m} type="button" onClick={() => onModeChange(m)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${!isSelected ? 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]' : ''}`}
              style={s}
            >{m === 'filter' ? t.modeFilter : t.modeMatch}</button>
          )
        })}
      </div>

      <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-secondary/50 dark:bg-surface-dark/50">
        <Info className="w-4 h-4 text-foreground-secondary dark:text-foreground-dark-secondary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary">{mode === 'filter' ? t.modeFilterHelp : t.modeMatchHelp}</p>
      </div>

      <div>
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-xs text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark hover:underline">
          <span>{t.advancedSearch}</span>
          {selectedMaterials.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-[#D4B870] text-white rounded-full text-[10px]">{selectedMaterials.length}</span>}
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        {showAdvanced && (
          <div className="mt-3">
            <TagFilter options={MATERIALS} groups={MATERIAL_GROUPS} selected={selectedMaterials} onToggle={onToggle} lang={lang} placeholder={t.placeholder} maxVisible={8} gem="amber" />
          </div>
        )}
      </div>
    </div>
  )
}
