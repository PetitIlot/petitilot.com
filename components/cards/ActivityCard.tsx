'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, BarChart3, User, Tag, Lightbulb, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants/filters'
import { gemPillStyle } from '@/components/filters/gemFilterStyle'
import type { GemColor } from '@/components/filters/gemFilterStyle'

// Type étendu avec créateur optionnel
type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

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

function getCategoryGem(categoryValue: string): GemColor {
  const cat = CATEGORIES.find(c => c.value === categoryValue)
  return (cat?.gem as GemColor) || 'neutral'
}

export default function ActivityCard({ activity, lang }: ActivityCardProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (!activity) return null

  const imageSource = activity.vignette_url || (activity as { additional_images_urls?: string[] }).additional_images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const labels = categoryLabels[lang] || categoryLabels.fr
  const typeLabel = labels[activity.type as keyof typeof labels] || activity.type

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="card-huly group">
          {/* Padding intérieur — les éléments sont "posés" sur le verre */}
          <div className="p-3 flex flex-col gap-2.5">

            {/* Vignette — posée sur le verre */}
            <div className="card-glass-vignette">
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image
                  src={coverImage}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                {/* Gradient overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
                {/* Categories — gem/frozen style */}
                {activity.categories && activity.categories.length > 0 && (
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {activity.categories.slice(0, 3).map((cat, idx) => {
                      const gem = getCategoryGem(cat)
                      const s = gemPillStyle(gem, true, isDark)
                      return (
                        <span
                          key={idx}
                          style={{ ...s.wrapper, borderRadius: 10, padding: 1 }}
                        >
                          <span
                            className="relative overflow-hidden"
                            style={{ ...s.inner, display: 'block', padding: '4px 10px', fontSize: 11, fontWeight: 550, borderRadius: 9 }}
                          >
                            <span aria-hidden style={{ ...s.frost, borderRadius: 9 }} />
                            <span aria-hidden style={{ ...s.shine, borderRadius: '9px 9px 50% 50%' }} />
                            <span style={{ position: 'relative', zIndex: 2 }}>{cat}</span>
                          </span>
                        </span>
                      )
                    })}
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5 card-huly-chip">
                  <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
                </div>
                {activity.is_premium && (
                  <span
                    className="absolute card-huly-chip p-2 rounded-full"
                    style={{
                      top: '48px',
                      right: '10px',
                      backgroundColor: activity.accept_free_credits ? 'rgba(76, 148, 82, 0.65)' : 'rgba(212, 175, 55, 0.65)',
                      color: '#fff',
                      border: activity.accept_free_credits ? '1px solid rgba(76, 148, 82, 0.3)' : '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                    title={activity.accept_free_credits
                      ? (lang === 'fr' ? 'Accessible avec crédits gratuits' : 'Available with free credits')
                      : (lang === 'fr' ? 'Crédits payants requis' : 'Paid credits required')
                    }
                  >
                    <Lock className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Contenu — zone posée sur le verre */}
            <div className="card-glass-body">
              <h3 className="font-semibold text-[var(--foreground)] text-[15px] leading-snug mb-2.5 line-clamp-2 tracking-tight">
                {activity.title}
              </h3>

              {/* Ligne 1 : Âge / Durée / Difficulté / Autonomie */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2.5">
                {activity.age_min !== null && activity.age_max !== null && (
                  <span className="card-huly-meta">
                    <Users className="w-3 h-3 opacity-50" />
                    {activity.age_min}-{activity.age_max} {lang === 'fr' ? 'ans' : lang === 'es' ? 'años' : 'yrs'}
                  </span>
                )}
                {activity.duration && (
                  <span className="card-huly-meta">
                    <Clock className="w-3 h-3 opacity-50" />
                    {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} min
                  </span>
                )}
                {activity.difficulte && (
                  <span className="card-huly-meta">
                    <BarChart3 className="w-3 h-3 opacity-50" />
                    {activity.difficulte === 'beginner' ? (lang === 'fr' ? 'Facile' : 'Easy') :
                     activity.difficulte === 'advanced' ? (lang === 'fr' ? 'Moyen' : 'Medium') :
                     (lang === 'fr' ? 'Difficile' : 'Hard')}
                  </span>
                )}
                {activity.autonomie !== null && (
                  <span className="card-huly-meta">
                    <User className="w-3 h-3 opacity-50" />
                    {activity.autonomie ? (lang === 'fr' ? 'Autonome' : 'Autonomous') : (lang === 'fr' ? 'Avec adulte' : 'With adult')}
                  </span>
                )}
              </div>

              {/* Ligne 2 : Thèmes & Compétences */}
              <div className="flex flex-wrap gap-1.5">
                {activity.themes?.slice(0, 2).map((theme, idx) => (
                  <span key={`theme-${idx}`} className="card-huly-tag card-huly-tag--sage">
                    <Tag className="w-2.5 h-2.5" />
                    {theme}
                  </span>
                ))}
                {activity.competences?.slice(0, 1).map((comp, idx) => (
                  <span key={`comp-${idx}`} className="card-huly-tag card-huly-tag--mauve">
                    <Lightbulb className="w-2.5 h-2.5" />
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Créateur — pied posé sur le verre */}
            {activity.creator && (
              <div className="card-glass-creator flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-sage-light to-sage dark:from-sage dark:to-sage-dark flex-shrink-0 ring-2 ring-white/50 dark:ring-white/10">
                  {activity.creator.avatar_url ? (
                    <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-white font-semibold">
                      {activity.creator.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[var(--foreground)]">
                    {activity.creator.display_name}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-secondary)]">
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
