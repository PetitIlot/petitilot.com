'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, BarChart3, User, Tag, Lightbulb, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator } from '@/lib/types'

// Type étendu avec créateur optionnel
type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

const categoryColors = {
  activite: 'bg-[#A8B5A0]',
  motricite: 'bg-[#C8D8E4]',
  alimentation: 'bg-[#D4A59A]',
  livre: 'bg-[#A8B5A0]',
  jeu: 'bg-[#D4A59A]'
}

const categoryLabels = {
  fr: {
    activite: 'Activité',
    motricite: 'Motricité',
    alimentation: 'Recette'
  },
  en: {
    activite: 'Activity',
    motricite: 'Motor skills',
    alimentation: 'Recipe'
  },
  es: {
    activite: 'Actividad',
    motricite: 'Motricidad',
    alimentation: 'Receta'
  }
}

interface ActivityCardProps {
  activity: RessourceWithCreator
  lang: Language
}

export default function ActivityCard({ activity, lang }: ActivityCardProps) {
  if (!activity) return null

  const imageSource = activity.vignette_url || activity.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const labels = categoryLabels[lang] || categoryLabels.fr
  const typeLabel = labels[activity.type as keyof typeof labels] || activity.type

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden relative">
            <Image
              src={coverImage}
              alt={activity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Categories */}
            {activity.categories && activity.categories.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {activity.categories.slice(0, 3).map((cat, idx) => (
                  <span key={idx} className="bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm text-foreground dark:text-foreground-dark text-xs font-medium px-2 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2 py-1">
              <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
            </div>
            {activity.is_premium && (
              <span className="absolute backdrop-blur-sm p-2 rounded-full" style={{ top: '52px', right: '12px', backgroundColor: 'rgba(212, 175, 55, 0.45)', color: '#fff' }}>
                <Lock className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark text-lg leading-tight mb-2 line-clamp-2">
              {activity.title}
            </h3>

            {/* Ligne 1 : Âge / Durée / Difficulté / Autonomie */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
              {activity.age_min !== null && activity.age_max !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Users className="w-3 h-3" />
                  {activity.age_min}-{activity.age_max} {lang === 'fr' ? 'ans' : lang === 'es' ? 'años' : 'yrs'}
                </span>
              )}
              {activity.duration && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Clock className="w-3 h-3" />
                  {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} min
                </span>
              )}
              {activity.difficulte && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <BarChart3 className="w-3 h-3" />
                  {activity.difficulte === 'beginner' ? (lang === 'fr' ? 'Facile' : 'Easy') :
                   activity.difficulte === 'advanced' ? (lang === 'fr' ? 'Moyen' : 'Medium') :
                   (lang === 'fr' ? 'Difficile' : 'Hard')}
                </span>
              )}
              {activity.autonomie !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <User className="w-3 h-3" />
                  {activity.autonomie ? (lang === 'fr' ? 'Autonome' : 'Autonomous') : (lang === 'fr' ? 'Avec adulte' : 'With adult')}
                </span>
              )}
            </div>

            {/* Ligne 2 : Thèmes & Compétences */}
            <div className="flex flex-wrap gap-1.5">
              {activity.themes?.slice(0, 2).map((theme, idx) => (
                <span key={`theme-${idx}`} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md" style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}>
                  <Tag className="w-2.5 h-2.5" />
                  {theme}
                </span>
              ))}
              {activity.competences?.slice(0, 1).map((comp, idx) => (
                <span key={`comp-${idx}`} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md" style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}>
                  <Lightbulb className="w-2.5 h-2.5" />
                  {comp}
                </span>
              ))}
            </div>

            {/* Créateur */}
            {activity.creator && (
              <div className="mt-3 pt-3 border-t border-foreground/[0.08] dark:border-white/[0.1] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-sage-light to-sage dark:from-sage dark:to-sage-dark flex-shrink-0 ring-2 ring-surface dark:ring-surface-dark">
                  {activity.creator.avatar_url ? (
                    <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-white font-semibold">
                      {activity.creator.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground dark:text-foreground-dark">
                    {activity.creator.display_name}
                  </span>
                  <span className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">
                    {lang === 'fr' ? 'Créateur' : lang === 'es' ? 'Creador' : 'Creator'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
