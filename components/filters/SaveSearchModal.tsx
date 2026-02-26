'use client'

import { useState } from 'react'
import { X, Bell, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Language } from '@/lib/types'
import type { FilterState } from '@/lib/hooks/useFilters'
import {
  CATEGORIES,
  THEMES,
  COMPETENCES,
  DIFFICULTY_OPTIONS,
  getOptionLabel,
} from '@/lib/constants/filters'

interface SaveSearchModalProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  lang: Language
}

const translations = {
  fr: {
    title: 'Enregistrer cette recherche',
    subtitle: 'Recevez une notification quand une nouvelle ressource correspond',
    nameLabel: 'Nom de l\'alerte',
    namePlaceholder: 'Ex: Activités calmes 1-2 ans',
    activeFilters: 'Filtres actifs',
    save: 'Créer l\'alerte',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    success: 'Alerte créée !',
    error: 'Erreur lors de la création',
    ageRange: '{min} - {max} mois',
    free: 'Gratuit',
    paid: 'Payant',
    autonomous: 'Autonome',
  },
  en: {
    title: 'Save this search',
    subtitle: 'Get notified when new resources match',
    nameLabel: 'Alert name',
    namePlaceholder: 'Ex: Calm activities 1-2 years',
    activeFilters: 'Active filters',
    save: 'Create alert',
    saving: 'Saving...',
    cancel: 'Cancel',
    success: 'Alert created!',
    error: 'Error creating alert',
    ageRange: '{min} - {max} months',
    free: 'Free',
    paid: 'Paid',
    autonomous: 'Autonomous',
  },
  es: {
    title: 'Guardar esta búsqueda',
    subtitle: 'Recibe notificaciones cuando haya nuevos recursos',
    nameLabel: 'Nombre de la alerta',
    namePlaceholder: 'Ej: Actividades tranquilas 1-2 años',
    activeFilters: 'Filtros activos',
    save: 'Crear alerta',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    success: '¡Alerta creada!',
    error: 'Error al crear',
    ageRange: '{min} - {max} meses',
    free: 'Gratis',
    paid: 'De pago',
    autonomous: 'Autónomo',
  },
}

export default function SaveSearchModal({ open, onClose, filters, lang }: SaveSearchModalProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const t = translations[lang]

  if (!open) return null

  // Génère les badges pour les filtres actifs
  const filterBadges: Array<{ key: string; label: string }> = []

  // Catégories
  filters.categories.forEach(cat => {
    filterBadges.push({ key: `cat-${cat}`, label: getOptionLabel(CATEGORIES, cat, lang) })
  })

  // Âge
  if (filters.ageMin !== null || filters.ageMax !== null) {
    const min = filters.ageMin ?? 0
    const max = filters.ageMax ?? 72
    filterBadges.push({
      key: 'age',
      label: t.ageRange.replace('{min}', String(min)).replace('{max}', String(max)),
    })
  }

  // Thèmes
  filters.themes.forEach(theme => {
    filterBadges.push({ key: `theme-${theme}`, label: getOptionLabel(THEMES, theme, lang) })
  })

  // Compétences
  filters.competences.forEach(comp => {
    filterBadges.push({ key: `comp-${comp}`, label: getOptionLabel(COMPETENCES, comp, lang) })
  })

  // Difficulté
  if (filters.difficulty) {
    filterBadges.push({
      key: 'diff',
      label: getOptionLabel(DIFFICULTY_OPTIONS, filters.difficulty, lang),
    })
  }

  // Gratuit/Payant
  if (filters.isFree !== null) {
    filterBadges.push({
      key: 'free',
      label: filters.isFree ? t.free : t.paid,
    })
  }

  // Autonomie
  if (filters.autonomy === true) {
    filterBadges.push({ key: 'auto', label: t.autonomous })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), filters }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setName('')
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark rounded-apple-xl shadow-elevation-3 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage/10 dark:bg-sage/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground dark:text-foreground-dark">
                {t.title}
              </h2>
              <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5 text-foreground-secondary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Nom de l'alerte */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1.5">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-2.5 rounded-apple border border-[var(--border)] bg-white dark:bg-black/20 text-foreground dark:text-foreground-dark placeholder:text-foreground-secondary/50 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
              autoFocus
              maxLength={100}
            />
          </div>

          {/* Filtres actifs */}
          {filterBadges.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground dark:text-foreground-dark mb-2">
                {t.activeFilters}
              </p>
              <div className="flex flex-wrap gap-2">
                {filterBadges.map(({ key, label }) => (
                  <Badge key={key} gem="terracotta" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">{t.success}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              gem="terracotta"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              gem="sage"
              disabled={!name.trim() || isLoading || success}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
