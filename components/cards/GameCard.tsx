'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, Tag, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { Ressource, Language } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

interface GameCardProps {
  game: Ressource
  lang: Language
}

export default function GameCard({ game, lang }: GameCardProps) {
  if (!game) return null

  const imageSource = game.vignette_url || game.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/jeux/${game.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden relative">
            <Image
              src={coverImage}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Category Badge */}
            <Badge className="absolute top-3 left-3 bg-[#D4A59A] text-white border-0 font-medium">
              {lang === 'fr' ? 'Jeu' : lang === 'es' ? 'Juego' : 'Game'}
            </Badge>
            <div className="absolute top-3 right-3 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2 py-1">
              <RatingHearts ressourceId={game.id} variant="display" size="xs" lang={lang} />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark text-lg leading-tight mb-1 line-clamp-2">
              {game.title}
            </h3>

            {game.editeur && (
              <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mb-2 line-clamp-1">{game.editeur}</p>
            )}

            {/* Ligne 1 : Âge / Joueurs / Durée */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
              {game.age_min !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Users className="w-3 h-3" />
                  {game.age_min}{game.age_max ? `-${game.age_max}` : '+'} {lang === 'fr' ? 'ans' : lang === 'es' ? 'años' : 'yrs'}
                </span>
              )}
              {game.nb_joueurs_min !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  {game.nb_joueurs_min}{game.nb_joueurs_max ? `-${game.nb_joueurs_max}` : '+'} {lang === 'fr' ? 'joueurs' : 'players'}
                </span>
              )}
              {game.duration !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Clock className="w-3 h-3" />
                  {game.duration_max ? `${game.duration}-${game.duration_max}` : game.duration} min
                </span>
              )}
            </div>

            {/* Ligne 2 : Thèmes & Compétences */}
            <div className="flex flex-wrap gap-1.5">
              {game.themes?.slice(0, 2).map((theme, idx) => (
                <span key={`theme-${idx}`} className="flex items-center gap-1 text-xs font-medium text-sage dark:text-sage-light/80 bg-sage/10 dark:bg-sage/15 px-2 py-1 rounded-md">
                  <Tag className="w-2.5 h-2.5" />
                  {theme}
                </span>
              ))}
              {game.competences?.slice(0, 1).map((comp, idx) => (
                <span key={`comp-${idx}`} className="flex items-center gap-1 text-xs font-medium text-sky dark:text-sky-light/80 bg-sky/10 dark:bg-sky/15 px-2 py-1 rounded-md">
                  <Lightbulb className="w-2.5 h-2.5" />
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
