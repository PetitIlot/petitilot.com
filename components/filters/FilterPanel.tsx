'use client'

import { X } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { FilterState } from '@/lib/hooks/useFilters'
import {
  CATEGORIES,
  THEMES,
  THEME_GROUPS,
  COMPETENCES,
  COMPETENCE_GROUPS,
  FILTER_TRANSLATIONS
} from '@/lib/constants/filters'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import FilterSection from './FilterSection'
import CategoryFilter from './CategoryFilter'
import AgeSlider from './AgeSlider'
import DurationFilter from './DurationFilter'
import PrepTimeFilter from './PrepTimeFilter'
import DifficultyFilter from './DifficultyFilter'
import IntensityFilter from './IntensityFilter'
import AutonomyToggle from './AutonomyToggle'
import TagFilter from './TagFilter'
import MaterialFilter from './MaterialFilter'
import PriceFilter from './PriceFilter'
import SaveSearchButton from './SaveSearchButton'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void
  toggleArrayValue: (key: keyof FilterState, value: string) => void
  activeFiltersCount: number
  resultCount: number
  lang: Language
  isLoggedIn?: boolean
  onLoginRequired?: () => void
}

/**
 * Panneau de filtres complet (Sheet)
 */
export default function FilterPanel({
  open,
  onClose,
  filters,
  setFilters,
  clearFilters,
  toggleArrayValue,
  activeFiltersCount,
  resultCount,
  lang,
  isLoggedIn = false,
  onLoginRequired = () => {},
}: FilterPanelProps) {
  const t = FILTER_TRANSLATIONS[lang]

  // Compte les filtres par section
  const countCategories = filters.categories.length
  const countAge = (filters.ageMin !== null || filters.ageMax !== null) ? 1 : 0
  const countThemes = filters.themes.length
  const countCompetences = filters.competences.length
  const countMaterials = filters.materials.length
  const countPractical = (filters.duration !== null ? 1 : 0) +
                         (filters.prepTime !== null ? 1 : 0) +
                         (filters.difficulty !== null ? 1 : 0) +
                         (filters.intensity !== null ? 1 : 0) +
                         (filters.autonomy !== null ? 1 : 0)
  const countPrice = (filters.isFree !== null ? 1 : 0) +
                     (filters.hasDownload !== null ? 1 : 0) +
                     (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[320px] sm:w-[360px] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg text-foreground dark:text-foreground-dark">
              {t.filters}
            </h2>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium bg-[#A8B5A0] text-white rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Catégories */}
          <FilterSection title={t.categories} count={countCategories} defaultOpen={true}>
            <CategoryFilter
              selected={filters.categories}
              onToggle={(v) => toggleArrayValue('categories', v)}
              lang={lang}
            />
          </FilterSection>

          {/* Âge */}
          <FilterSection title={t.age} count={countAge} defaultOpen={true}>
            <AgeSlider
              ageMin={filters.ageMin}
              ageMax={filters.ageMax}
              onChange={(min, max) => setFilters({ ageMin: min, ageMax: max })}
              lang={lang}
            />
          </FilterSection>

          {/* Thèmes */}
          <FilterSection title={t.themes} count={countThemes}>
            <TagFilter
              options={THEMES}
              groups={THEME_GROUPS}
              selected={filters.themes}
              onToggle={(v) => toggleArrayValue('themes', v)}
              lang={lang}
              placeholder={lang === 'fr' ? 'Rechercher un thème...' : 'Search theme...'}
            />
          </FilterSection>

          {/* Compétences */}
          <FilterSection title={t.competences} count={countCompetences}>
            <TagFilter
              options={COMPETENCES}
              groups={COMPETENCE_GROUPS}
              selected={filters.competences}
              onToggle={(v) => toggleArrayValue('competences', v)}
              lang={lang}
              placeholder={lang === 'fr' ? 'Rechercher une compétence...' : 'Search skill...'}
            />
          </FilterSection>

          {/* Matériel */}
          <FilterSection title={t.materials} count={countMaterials}>
            <MaterialFilter
              selected={filters.materials}
              mode={filters.materialMode}
              onToggle={(v) => toggleArrayValue('materials', v)}
              onModeChange={(mode) => setFilters({ materialMode: mode })}
              lang={lang}
            />
          </FilterSection>

          {/* Pratique */}
          <FilterSection title={t.practical} count={countPractical}>
            <div className="space-y-4">
              {/* Durée */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.duration}
                </p>
                <DurationFilter
                  selected={filters.duration}
                  onChange={(v) => setFilters({ duration: v })}
                  lang={lang}
                />
              </div>

              {/* Durée de préparation */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.prepTime}
                </p>
                <PrepTimeFilter
                  selected={filters.prepTime}
                  onChange={(v) => setFilters({ prepTime: v })}
                  lang={lang}
                />
              </div>

              {/* Difficulté */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.difficulty}
                </p>
                <DifficultyFilter
                  selected={filters.difficulty}
                  onChange={(v) => setFilters({ difficulty: v })}
                  lang={lang}
                />
              </div>

              {/* Intensité */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.intensity}
                </p>
                <IntensityFilter
                  selected={filters.intensity}
                  onChange={(v) => setFilters({ intensity: v })}
                  lang={lang}
                />
              </div>

              {/* Autonomie */}
              <div>
                <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                  {t.autonomy}
                </p>
                <AutonomyToggle
                  value={filters.autonomy}
                  onChange={(v) => setFilters({ autonomy: v })}
                  lang={lang}
                />
              </div>
            </div>
          </FilterSection>

          {/* Prix */}
          <FilterSection title={t.price} count={countPrice}>
            <PriceFilter
              isFree={filters.isFree}
              hasDownload={filters.hasDownload}
              priceMin={filters.priceMin}
              priceMax={filters.priceMax}
              onFreeChange={(v) => setFilters({ isFree: v })}
              onDownloadChange={(v) => setFilters({ hasDownload: v })}
              onPriceRangeChange={(min, max) => setFilters({ priceMin: min, priceMax: max })}
              onBatchChange={(changes) => setFilters(changes)}
              lang={lang}
            />
          </FilterSection>
        </div>

        {/* Footer sticky */}
        <div className="p-4 border-t border-[var(--border)] bg-surface dark:bg-surface-dark space-y-3">
          {/* Bouton sauvegarder recherche */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-center">
              <SaveSearchButton
                filters={filters}
                activeFiltersCount={activeFiltersCount}
                lang={lang}
                isLoggedIn={isLoggedIn}
                onLoginRequired={onLoginRequired}
              />
            </div>
          )}

          {/* Boutons actions */}
          <div className="flex gap-3">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1"
              >
                {t.clearAll}
              </Button>
            )}
            <Button
              onClick={onClose}
              className="flex-1 bg-[#A8B5A0] hover:bg-[#A8B5A0]/90 text-white"
            >
              {t.showResults.replace('{count}', String(resultCount))}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
