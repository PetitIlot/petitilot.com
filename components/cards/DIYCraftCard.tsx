'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, Hammer, Scissors, Recycle, Wrench, Sparkles, Package, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator, MaterielItem } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

/**
 * DIYCraftCard - Template pour DIY & récup et jeux symboliques
 *
 * Design: Layout orienté bricolage/fait-main
 * - Mise en avant du matériel et de la récup
 * - Style "atelier" avec liste de matériaux
 * - Icônes outils/bricolage
 * - Badge recyclage si matériel récup détecté
 * - Accent couleur Sage (#A8B5A0) pour le côté éco/fait-main
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface DIYCraftCardProps {
  activity: RessourceWithCreator
  lang: Language
}

const translations = {
  fr: {
    age: 'ans',
    diy: 'DIY',
    craft: 'Bricolage',
    imaginativePlay: 'Jeu imaginatif',
    materials: 'Matériel',
    recycled: 'Récup',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Élaboré',
    steps: 'étapes',
    homemade: 'Fait maison',
  },
  en: {
    age: 'yrs',
    diy: 'DIY',
    craft: 'Craft',
    imaginativePlay: 'Imaginative play',
    materials: 'Materials',
    recycled: 'Recycled',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    steps: 'steps',
    homemade: 'Homemade',
  },
  es: {
    age: 'años',
    diy: 'DIY',
    craft: 'Manualidad',
    imaginativePlay: 'Juego imaginativo',
    materials: 'Materiales',
    recycled: 'Reciclado',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    steps: 'pasos',
    homemade: 'Hecho en casa',
  }
}

// Détecter si c'est DIY/récup ou jeu symbolique
const getCardType = (categories: string[] | null): 'diy' | 'symbolic' => {
  const cats = (categories || []).map(c => c.toLowerCase())
  if (cats.some(c => c.includes('jeux symboliques') || c.includes('symbolique') || c.includes('imaginative'))) {
    return 'symbolic'
  }
  return 'diy'
}

// Compter les matériaux de récup
const countRecycledMaterials = (materiel: MaterielItem[] | null): number => {
  return (materiel || []).filter(m => m.recup === true).length
}

// Mots clés récup pour détection secondaire
const RECUP_KEYWORDS = ['carton', 'rouleau', 'boîte', 'bouteille', 'bouchon', 'pot', 'récup', 'recycle']

const hasRecycledContent = (materiel: MaterielItem[] | null, description: string | null): boolean => {
  const recycledCount = countRecycledMaterials(materiel)
  if (recycledCount > 0) return true

  const textToCheck = [
    ...(materiel || []).map(m => m.item.toLowerCase()),
    (description || '').toLowerCase()
  ].join(' ')

  return RECUP_KEYWORDS.some(keyword => textToCheck.includes(keyword))
}

export default function DIYCraftCard({ activity, lang }: DIYCraftCardProps) {
  if (!activity) return null

  const imageSource = activity.vignette_url || activity.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const t = translations[lang] || translations.fr
  const cardType = getCardType(activity.categories)
  const hasRecup = hasRecycledContent(activity.materiel_json, activity.description)
  const materialsCount = (activity.materiel_json || []).length

  const difficultyLabel = activity.difficulte === 'beginner' ? t.easy
    : activity.difficulte === 'advanced' ? t.medium
    : activity.difficulte === 'expert' ? t.hard : null

  // Icône selon le type
  const TypeIcon = cardType === 'symbolic' ? Sparkles : Hammer

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>

          {/* Image avec style atelier */}
          <div className="aspect-[4/3] overflow-hidden relative">
            <Image
              src={coverImage}
              alt={activity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badge type */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                style={{ backgroundColor: 'rgba(122, 139, 111, 0.95)', color: '#fff' }}
              >
                <TypeIcon className="w-3.5 h-3.5" />
                {cardType === 'symbolic' ? t.imaginativePlay : t.diy}
              </span>

              {/* Badge récup */}
              {hasRecup && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-full shadow-lg bg-emerald-500/90 text-white">
                  <Recycle className="w-3 h-3" />
                  {t.recycled}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2 py-1">
              <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
            </div>
          </div>

          {/* Contenu avec style atelier */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark text-lg leading-tight mb-3 line-clamp-2">
              {activity.title}
            </h3>

            {/* Barre d'infos style "fiche technique" */}
            <div className="grid grid-cols-3 gap-2 mb-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(122, 139, 111, 0.08)' }}>
              {/* Âge */}
              {activity.age_min !== null && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-0.5">
                    <Users className="w-3 h-3" />
                    Âge
                  </div>
                  <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                    {activity.age_min}-{activity.age_max}
                  </span>
                </div>
              )}

              {/* Durée */}
              {activity.duration && (
                <div className="text-center border-l border-foreground/[0.1] dark:border-white/[0.1]">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-0.5">
                    <Clock className="w-3 h-3" />
                    Durée
                  </div>
                  <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                    {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration}min
                  </span>
                </div>
              )}

              {/* Difficulté */}
              {difficultyLabel && (
                <div className="text-center border-l border-foreground/[0.1] dark:border-white/[0.1]">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-0.5">
                    <BarChart3 className="w-3 h-3" />
                    Niveau
                  </div>
                  <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                    {difficultyLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Liste matériel compacte */}
            {materialsCount > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-2">
                  <Package className="w-3 h-3" />
                  {t.materials} ({materialsCount})
                </div>
                <div className="flex flex-wrap gap-1">
                  {(activity.materiel_json || []).slice(0, 5).map((mat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/[0.05] dark:bg-white/[0.08] text-foreground-secondary dark:text-foreground-dark-secondary flex items-center gap-1"
                    >
                      {mat.recup && <Recycle className="w-2.5 h-2.5 text-emerald-500" />}
                      {mat.item}
                    </span>
                  ))}
                  {materialsCount > 5 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sage/20 text-sage-dark font-medium">
                      +{materialsCount - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Thèmes et compétences */}
            <div className="flex flex-wrap gap-1.5">
              {activity.themes?.slice(0, 2).map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
                >
                  {theme}
                </span>
              ))}
              {activity.competences?.slice(0, 1).map((comp, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}
                >
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
