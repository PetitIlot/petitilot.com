'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, TreePine, Wind, Sun, MapPin, Footprints, Mountain } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

/**
 * MovementNatureCard - Template pour motricité globale & nature/plein air
 *
 * Design: Layout immersif mettant en avant le mouvement et l'extérieur
 * - Image panoramique (16:9) pour effet immersif
 * - Overlay gradient avec infos clés sur l'image
 * - Icônes évoquant la nature et le mouvement
 * - Accent couleur Sky (#C8D8E4) pour le côté nature/extérieur
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface MovementNatureCardProps {
  activity: RessourceWithCreator
  lang: Language
}

// Mapping des icônes selon les thèmes détectés
const getEnvironmentIcon = (themes: string[] | null, categories: string[] | null) => {
  const allTags = [...(themes || []), ...(categories || [])].map(t => t.toLowerCase())

  if (allTags.some(t => t.includes('forêt') || t.includes('forest'))) return TreePine
  if (allTags.some(t => t.includes('montagne') || t.includes('mountain'))) return Mountain
  if (allTags.some(t => t.includes('plein air') || t.includes('outdoor') || t.includes('nature'))) return Sun
  if (allTags.some(t => t.includes('vent') || t.includes('wind'))) return Wind
  return Footprints
}

const translations = {
  fr: {
    age: 'ans',
    outdoor: 'Plein air',
    movement: 'En mouvement',
    location: 'Lieu',
  },
  en: {
    age: 'yrs',
    outdoor: 'Outdoor',
    movement: 'Active play',
    location: 'Location',
  },
  es: {
    age: 'años',
    outdoor: 'Al aire libre',
    movement: 'En movimiento',
    location: 'Lugar',
  }
}

export default function MovementNatureCard({ activity, lang }: MovementNatureCardProps) {
  if (!activity) return null

  const imageSource = activity.vignette_url || activity.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const t = translations[lang] || translations.fr
  const EnvironmentIcon = getEnvironmentIcon(activity.themes, activity.categories)

  // Détecter si c'est une activité nature/plein air
  const isOutdoor = activity.categories?.some(c =>
    c.toLowerCase().includes('nature') || c.toLowerCase().includes('plein air')
  )

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>

          {/* Image panoramique 16:9 avec overlay */}
          <div className="aspect-[16/9] overflow-hidden relative">
            <Image
              src={coverImage}
              alt={activity.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Gradient overlay pour lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Badge catégorie en haut à gauche */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-sky/90 dark:bg-sky-dark/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                <EnvironmentIcon className="w-3.5 h-3.5" />
                {isOutdoor ? t.outdoor : t.movement}
              </span>
            </div>

            {/* Rating en haut à droite */}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-lg">
              <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
            </div>

            {/* Infos principales sur l'image (en bas) */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-xl leading-tight mb-2 line-clamp-2 drop-shadow-lg">
                {activity.title}
              </h3>

              {/* Métadonnées compactes */}
              <div className="flex flex-wrap items-center gap-2">
                {activity.age_min !== null && activity.age_max !== null && (
                  <span className="flex items-center gap-1 text-white/90 text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    {activity.age_min}-{activity.age_max} {t.age}
                  </span>
                )}
                {activity.duration && (
                  <span className="flex items-center gap-1 text-white/90 text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section inférieure compacte */}
          <div className="p-4 pt-3">
            {/* Thèmes et compétences avec style nature */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activity.themes?.slice(0, 3).map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    color: 'var(--sky)',
                    backgroundColor: 'rgba(92, 200, 250, 0.12)',
                    border: '1px solid rgba(92, 200, 250, 0.2)'
                  }}
                >
                  {theme}
                </span>
              ))}
              {activity.competences?.slice(0, 1).map((comp, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    color: '#8B7EC8',
                    backgroundColor: 'rgba(139, 126, 200, 0.12)',
                    border: '1px solid rgba(139, 126, 200, 0.2)'
                  }}
                >
                  {comp}
                </span>
              ))}
            </div>

            {/* Créateur */}
            {activity.creator && (
              <div className="pt-3 border-t border-foreground/[0.08] dark:border-white/[0.1] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-sky-light to-sky dark:from-sky dark:to-sky-dark flex-shrink-0 ring-2 ring-surface dark:ring-surface-dark">
                  {activity.creator.avatar_url ? (
                    <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-white font-semibold">
                      {activity.creator.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground dark:text-foreground-dark">
                  {activity.creator.display_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
