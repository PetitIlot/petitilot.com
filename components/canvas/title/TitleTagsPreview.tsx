'use client'

import {
  Clock, BarChart3, Tag, Activity, Timer, Users, User, Lightbulb
} from 'lucide-react'
import type { TitleBlockData, GemColor } from '@/lib/blocks/types'
import { CATEGORIES } from '@/lib/constants/filters'
import { BADGE_GEMS } from '@/components/ui/badge'

interface FormDataForTags {
  type?: string | null
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  duration_max?: number | null
  duration_prep?: number | null
  intensity?: string | null
  difficulte?: string | null
  autonomie?: boolean | null
  themes?: string[] | null
  competences?: string[] | null
  categories?: string[] | null
}

interface TitleTagsPreviewProps {
  data: TitleBlockData
  formData?: FormDataForTags
  isDark?: boolean
}

export function TitleTagsPreview({ data, formData, isDark = false }: TitleTagsPreviewProps) {
  const tags = data.tags || {
    variant: 'classic' as const,
    alignment: 'left' as const,
    style: 'gem' as const,
    shape: 'pill' as const,
    themeColor: 'sky' as const,
    competenceColor: 'rose' as const,
  }

  const alignment = tags.alignment || 'left'
  const isCompact = tags.variant === 'compact'
  const shape = tags.shape || 'pill'

  const themes = formData?.themes || []
  const competences = formData?.competences || []
  const categories = formData?.categories || []

  // Map metadata
  const ageMin = formData?.age_min
  const ageMax = formData?.age_max
  const duration = formData?.duration
  const durationMax = formData?.duration_max
  const prepTime = formData?.duration_prep
  const intensity = formData?.intensity
  const difficulte = formData?.difficulte
  const autonomie = formData?.autonomie

  const difficulteLabels: Record<string, string> = {
    beginner: 'Facile', advanced: 'Moyen', expert: 'Difficile'
  }
  const intensityLabels: Record<string, string> = {
    leger: 'Léger', moyen: 'Modéré', intense: 'Intense'
  }
  const difficulteLabel = difficulte ? difficulteLabels[difficulte] || difficulte : null
  const intensityLabel = intensity ? intensityLabels[intensity] || intensity : null

  const hasData = formData && (categories.length > 0 || ageMin != null || duration || prepTime || intensity || difficulte || autonomie !== undefined)
  const hasThemesOrCompetences = themes.length > 0 || competences.length > 0

  const alignClass = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : ''
  const badgeClass = 'flex items-center gap-1 px-2.5 py-1 text-xs'
  const radius = shape === 'pill' ? 20 : 6

  // Metadata badge style — matches the real detail page: outline with var(--border)
  const metaBadgeStyle = {
    borderRadius: radius,
    border: '1px solid var(--border)',
    color: 'var(--foreground-secondary)',
    backgroundColor: 'transparent',
  }

  // Classic colors for themes/competences — uses CSS variables from design system
  const CLASSIC_COLORS: Record<string, { color: string; bg: string }> = {
    sage:       { color: 'var(--sage)',       bg: 'rgba(var(--sage-rgb), 0.12)' },
    terracotta: { color: 'var(--terracotta)', bg: 'rgba(var(--terracotta-rgb), 0.12)' },
    sky:        { color: 'var(--sky)',        bg: 'rgba(var(--sky-rgb), 0.12)' },
    mauve:      { color: 'var(--mauve)',      bg: 'rgba(var(--mauve-rgb), 0.12)' },
    rose:       { color: 'var(--rose)',       bg: 'rgba(var(--rose-rgb), 0.12)' },
    amber:      { color: 'var(--amber)',      bg: 'rgba(var(--amber-rgb), 0.12)' },
    neutral:    { color: 'var(--neutral)',    bg: 'rgba(var(--neutral-rgb), 0.12)' },
  }

  // Get gem badge style based on tags.style
  const getTagStyle = (gem: GemColor): React.CSSProperties => {
    const g = BADGE_GEMS[gem] || BADGE_GEMS.sage
    if (tags.style === 'gem-outline') {
      return {
        color: isDark ? g.darkText : g.text,
        backgroundColor: 'transparent',
        border: `1px solid ${isDark ? g.darkBorder : g.border}`,
        borderRadius: radius,
      }
    }
    if (tags.style === 'classic') {
      const c = CLASSIC_COLORS[gem] || CLASSIC_COLORS.sage
      return {
        color: c.color,
        backgroundColor: c.bg,
        borderRadius: radius,
      }
    }
    // Gem default — matches Badge component
    return {
      color: isDark ? g.darkText : g.text,
      backgroundColor: isDark ? g.darkBg : g.bg,
      border: `1px solid ${isDark ? g.darkBorder : g.border}`,
      borderRadius: radius,
    }
  }

  // Category pill: uses CATEGORIES gem color
  const getCategoryGem = (catValue: string): GemColor => {
    const cat = CATEGORIES.find(c => c.value === catValue)
    return (cat?.gem as GemColor) || 'sage'
  }
  const getCategoryLabel = (catValue: string): string => {
    const cat = CATEGORIES.find(c => c.value === catValue)
    return cat?.label.fr || catValue
  }

  return (
    <div>
      {/* Ligne 1: Catégories + metadata badges */}
      <div className={`flex flex-wrap items-center gap-1.5 ${alignClass}`}>
        {hasData ? (
          <>
            {/* Catégories from CATEGORIES with gem color */}
            {categories.map((cat, i) => (
              <span
                key={`cat-${i}`}
                className={`${badgeClass} font-medium`}
                style={getTagStyle(getCategoryGem(cat))}
              >
                {!isCompact && <Tag className="w-2.5 h-2.5" />}
                {getCategoryLabel(cat)}
              </span>
            ))}
            {/* Metadata badges */}
            {(ageMin != null && ageMax != null) && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <Users className="w-3 h-3" />}
                {ageMin}-{ageMax} ans
              </span>
            )}
            {duration && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <Clock className="w-3 h-3" />}
                {durationMax ? `${duration}-${durationMax}` : duration} min
              </span>
            )}
            {prepTime && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <Timer className="w-3 h-3" />}
                {isCompact ? `${prepTime}m prépa` : `Prépa ${prepTime} min`}
              </span>
            )}
            {intensityLabel && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <Activity className="w-3 h-3" />}
                {intensityLabel}
              </span>
            )}
            {difficulteLabel && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <BarChart3 className="w-3 h-3" />}
                {difficulteLabel}
              </span>
            )}
            {autonomie != null && (
              <span className={badgeClass} style={metaBadgeStyle}>
                {!isCompact && <User className="w-3 h-3" />}
                {autonomie ? 'Autonome' : 'Avec adulte'}
              </span>
            )}
          </>
        ) : (
          <>
            {/* Placeholder categories */}
            <span className={`${badgeClass} font-medium`} style={getTagStyle('sage')}>
              {!isCompact && <Tag className="w-2.5 h-2.5" />}
              Catégorie
            </span>
            <span className={badgeClass} style={metaBadgeStyle}>
              {!isCompact && <Users className="w-3 h-3" />}
              3-6 ans
            </span>
            <span className={badgeClass} style={metaBadgeStyle}>
              {!isCompact && <Clock className="w-3 h-3" />}
              30 min
            </span>
          </>
        )}
      </div>

      {/* Ligne 2: Thèmes (sky/bleu) + Compétences (rose) */}
      <div className={`flex flex-wrap gap-1.5 mt-2 ${alignClass}`}>
        {hasThemesOrCompetences ? (
          <>
            {themes.map((theme, i) => (
              <span
                key={`theme-${i}`}
                className={`${badgeClass} font-medium`}
                style={getTagStyle(tags.themeColor || 'sky')}
              >
                {!isCompact && <Tag className="w-2.5 h-2.5" />}
                {theme}
              </span>
            ))}
            {competences.map((comp, i) => (
              <span
                key={`comp-${i}`}
                className={`${badgeClass} font-medium`}
                style={getTagStyle(tags.competenceColor || 'rose')}
              >
                {!isCompact && <Lightbulb className="w-2.5 h-2.5" />}
                {comp}
              </span>
            ))}
          </>
        ) : (
          <>
            <span className={`${badgeClass} font-medium`} style={getTagStyle(tags.themeColor || 'sky')}>
              {!isCompact && <Tag className="w-2.5 h-2.5" />}
              Thème
            </span>
            <span className={`${badgeClass} font-medium`} style={getTagStyle(tags.competenceColor || 'rose')}>
              {!isCompact && <Lightbulb className="w-2.5 h-2.5" />}
              Compétence
            </span>
          </>
        )}
      </div>
    </div>
  )
}
