'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, BarChart3, User, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants/filters'
import { gemPillStyle } from '@/components/filters/gemFilterStyle'
import type { GemColor } from '@/components/filters/gemFilterStyle'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
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

interface FeaturedCarouselCardProps {
  activity: RessourceWithCreator
  lang: Language
  variant?: 'large' | 'small'
}

function getCategoryGem(categoryValue: string): GemColor {
  const cat = CATEGORIES.find(c => c.value === categoryValue)
  return (cat?.gem as GemColor) || 'neutral'
}

export default function FeaturedCarouselCard({
  activity,
  lang,
  variant = 'large'
}: FeaturedCarouselCardProps) {
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

  const isLarge = variant === 'large'

  // Variante LARGE : Format portrait élargi (image top, infos bottom)
  if (isLarge) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          width: '450px'
        }}
      >
        <Link href={`/${lang}/activites/${activity.id}`}>
          <div className="card-huly group h-full">
            <div className="p-3 flex flex-col gap-2.5 h-full">

              {/* Vignette */}
              <div className="card-glass-vignette flex-shrink-0">
                <div className="aspect-[3/2] overflow-hidden relative">
                  <Image
                    src={coverImage}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  />
                  {/* Gradient overlay bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

                  {/* Categories gem tags */}
                  {activity.categories && activity.categories.length > 0 && (
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      {activity.categories.slice(0, 2).map((cat, idx) => {
                        const gem = getCategoryGem(cat)
                        const s = gemPillStyle(gem, true, isDark)
                        return (
                          <span
                            key={idx}
                            style={{ ...s.wrapper, borderRadius: 8, padding: 1 }}
                          >
                            <span
                              className="relative overflow-hidden"
                              style={{ ...s.inner, display: 'block', padding: '3px 8px', fontSize: 10, fontWeight: 550, borderRadius: 7 }}
                            >
                              <span aria-hidden style={{ ...s.frost, borderRadius: 7 }} />
                              <span aria-hidden style={{ ...s.shine, borderRadius: '7px 7px 50% 50%' }} />
                              <span style={{ position: 'relative', zIndex: 2 }}>{cat}</span>
                            </span>
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-2.5 right-2.5 card-huly-chip">
                    <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
                  </div>

                  {/* Premium lock */}
                  {activity.is_premium && (
                    <span
                      className="absolute card-huly-chip p-1.5 rounded-full"
                      style={{
                        top: '55px',
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
                      <Lock className="w-3 h-3" />
                    </span>
                  )}

                  {/* Creator badge overlay - en bas à droite */}
                  {activity.creator && (
                    <div className="absolute bottom-2.5 right-2.5 card-huly-chip flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-br from-sage-light to-sage dark:from-sage dark:to-sage-dark flex-shrink-0">
                        {activity.creator.avatar_url ? (
                          <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-[9px] text-white font-semibold">
                            {activity.creator.display_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium">
                        {activity.creator.display_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content body - tout sur une ligne */}
              <div className="card-glass-body">
                <h3 className="font-semibold text-[var(--foreground)] text-sm leading-tight mb-2 line-clamp-2 tracking-tight">
                  {activity.title}
                </h3>

                {/* Tout sur une seule ligne : Métadonnées + Thèmes + Compétences */}
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {/* Métadonnées */}
                  {activity.age_min !== null && activity.age_max !== null && (
                    <span className="card-huly-meta !text-[10px] !px-1.5 !py-0.5">
                      <Users className="w-2.5 h-2.5 opacity-50" />
                      {activity.age_min}-{activity.age_max}{lang === 'fr' ? 'a' : 'y'}
                    </span>
                  )}
                  {activity.duration && (
                    <span className="card-huly-meta !text-[10px] !px-1.5 !py-0.5">
                      <Clock className="w-2.5 h-2.5 opacity-50" />
                      {activity.duration}min
                    </span>
                  )}
                  {activity.difficulte && (
                    <span className="card-huly-meta !text-[10px] !px-1.5 !py-0.5">
                      <BarChart3 className="w-2.5 h-2.5 opacity-50" />
                      {activity.difficulte === 'beginner' ? (lang === 'fr' ? 'Facile' : 'Easy') :
                       activity.difficulte === 'advanced' ? (lang === 'fr' ? 'Moyen' : 'Med') :
                       (lang === 'fr' ? 'Diff' : 'Hard')}
                    </span>
                  )}

                  {/* Thèmes */}
                  {activity.themes?.slice(0, 1).map((theme, idx) => (
                    <span key={`theme-${idx}`} className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky/10 text-sky dark:bg-sky/20 dark:text-sky-light border border-sky/20">
                      {theme.length > 12 ? theme.slice(0, 12) + '...' : theme}
                    </span>
                  ))}

                  {/* Compétences */}
                  {activity.competences?.slice(0, 1).map((comp, idx) => (
                    <span key={`comp-${idx}`} className="text-[10px] px-1.5 py-0.5 rounded-md bg-mauve/10 text-mauve dark:bg-mauve/20 dark:text-mauve-light border border-mauve/20">
                      {comp.length > 12 ? comp.slice(0, 12) + '...' : comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Variante SMALL : Format immersif (image plein fond, infos en overlay)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        width: '40vw',
        maxWidth: '450px',
        minWidth: '280px',
        height: '200px'
      }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="card-huly group h-full relative">
          {/* Image avec padding pour laisser voir le verre derrière */}
          <div className="absolute inset-2 rounded-xl overflow-hidden">
            <Image
              src={coverImage}
              alt={activity.title}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
            {/* Gradient overlay dark en bas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Categories gem tags - en haut à gauche */}
          {activity.categories && activity.categories.length > 0 && (
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
              {activity.categories.slice(0, 2).map((cat, idx) => {
                const gem = getCategoryGem(cat)
                const s = gemPillStyle(gem, true, isDark)
                return (
                  <span
                    key={idx}
                    style={{ ...s.wrapper, borderRadius: 10, padding: 1 }}
                  >
                    <span
                      className="relative overflow-hidden"
                      style={{ ...s.inner, display: 'block', padding: '3px 8px', fontSize: 10, fontWeight: 550, borderRadius: 9 }}
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

          {/* Rating - en haut à droite */}
          <div className="absolute top-2.5 right-2.5 card-huly-chip z-10">
            <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
          </div>

          {/* Premium lock */}
          {activity.is_premium && (
            <span
              className="absolute card-huly-chip p-1.5 rounded-full z-10"
              style={{
                top: '40px',
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
              <Lock className="w-3 h-3" />
            </span>
          )}

          {/* Content overlay en bas - transparent avec blur léger */}
          <div className="absolute inset-x-0 bottom-0 p-3 z-10">
            <div
              className="rounded-xl p-3"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2 tracking-tight drop-shadow-lg">
                {activity.title}
              </h3>

              {/* Métadonnées condensées avec plus de contraste */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
                {activity.age_min !== null && activity.age_max !== null && (
                  <span className="!text-[10px] !px-2 !py-1 rounded-lg bg-white/90 dark:bg-black/80 text-[var(--foreground)] flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 opacity-50" />
                    {activity.age_min}-{activity.age_max}{lang === 'fr' ? 'a' : 'y'}
                  </span>
                )}
                {activity.duration && (
                  <span className="!text-[10px] !px-2 !py-1 rounded-lg bg-white/90 dark:bg-black/80 text-[var(--foreground)] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 opacity-50" />
                    {activity.duration}min
                  </span>
                )}
              </div>

              {/* Creator condensé */}
              {activity.creator && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-br from-sage-light to-sage dark:from-sage dark:to-sage-dark flex-shrink-0 ring-1 ring-white/30">
                    {activity.creator.avatar_url ? (
                      <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[9px] text-white font-semibold">
                        {activity.creator.display_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow-md">
                    {activity.creator.display_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
