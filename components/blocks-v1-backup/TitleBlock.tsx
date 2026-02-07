'use client'

import { Users, Clock, BarChart3, User, Tag, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { TitleBlockData, BlockStyle } from '@/lib/blocks/types'
import { Language } from '@/lib/types'
import FavoriteButton from '@/components/FavoriteButton'
import RatingHearts from '@/components/RatingHearts'

const categoryColors = {
  activite: 'bg-[#A8B5A0]',
  motricite: 'bg-[#C8D8E4]',
  alimentation: 'bg-[#D4A59A]'
}

const categoryLabels = {
  fr: { activite: 'Activité', motricite: 'Motricité', alimentation: 'Recette' },
  en: { activite: 'Activity', motricite: 'Motor skills', alimentation: 'Recipe' },
  es: { activite: 'Actividad', motricite: 'Motricidad', alimentation: 'Receta' }
}

const translations = {
  fr: { years: 'ans', minutes: 'min', beginner: 'Facile', advanced: 'Moyen', expert: 'Difficile', autonomous: 'Autonome', withAdult: 'Avec adulte' },
  en: { years: 'years', minutes: 'min', beginner: 'Easy', advanced: 'Medium', expert: 'Hard', autonomous: 'Autonomous', withAdult: 'With adult' },
  es: { years: 'años', minutes: 'min', beginner: 'Fácil', advanced: 'Medio', expert: 'Difícil', autonomous: 'Autónomo', withAdult: 'Con adulto' }
}

interface TitleBlockProps {
  activity: RessourceWithCreator
  data: TitleBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

const titleSizes = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl',
  xl: 'text-4xl md:text-5xl'
}

export default function TitleBlock({ activity, data, style, lang, isEditing }: TitleBlockProps) {
  const t = translations[lang]

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[data.alignment]

  const justifyClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[data.alignment]

  return (
    <div className={`${alignmentClass}`}>
      {/* Titre */}
      <h1 className={`${titleSizes[data.titleSize]} font-bold text-foreground dark:text-foreground-dark mb-3`}>
        {activity.title}
      </h1>

      {/* Rating & Favorite */}
      <div className={`mb-4 flex flex-wrap items-center gap-4 ${justifyClass}`}>
        <RatingHearts ressourceId={activity.id} lang={lang} />
        <FavoriteButton ressourceId={activity.id} variant="button" lang={lang} />
      </div>

      {/* Primary Badges */}
      {data.showBadges && (
        <div className={`flex flex-wrap gap-3 mb-4 ${justifyClass}`}>
          <Badge className={`${categoryColors[activity.type as keyof typeof categoryColors]} text-white border-0`}>
            {categoryLabels[lang]?.[activity.type as keyof typeof categoryLabels.fr] || activity.type}
          </Badge>

          {activity.age_min !== null && activity.age_max !== null && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
              <Users className="w-3.5 h-3.5 mr-1" />
              {activity.age_min}-{activity.age_max} {t.years}
            </span>
          )}

          {activity.duration && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
              <Clock className="w-3.5 h-3.5 mr-1" />
              {activity.duration_max
                ? `${activity.duration}-${activity.duration_max} ${t.minutes}`
                : `${activity.duration} ${t.minutes}`
              }
            </span>
          )}

          {activity.difficulte && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              {t[activity.difficulte as keyof typeof t]}
            </span>
          )}

          {activity.autonomie !== null && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
              <User className="w-3.5 h-3.5 mr-1" />
              {activity.autonomie ? t.autonomous : t.withAdult}
            </span>
          )}
        </div>
      )}

      {/* Secondary Badges - Themes & Competences */}
      {(data.showThemes || data.showCompetences) && (
        <div className={`flex flex-wrap gap-2 ${justifyClass}`}>
          {data.showThemes && activity.themes && activity.themes.length > 0 && activity.themes.map((theme, idx) => (
            <span
              key={`theme-${idx}`}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
              style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {theme}
            </span>
          ))}

          {data.showCompetences && activity.competences && activity.competences.length > 0 && activity.competences.map((comp, idx) => (
            <span
              key={`comp-${idx}`}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
              style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              {comp}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
