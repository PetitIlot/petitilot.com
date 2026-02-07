'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users, Clock, ChefHat, UtensilsCrossed, Flame, AlertTriangle, Timer, CookingPot } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator, MaterielItem } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

/**
 * RecipeCard - Template pour catégorie Cuisine
 *
 * Design: Layout rythmé entre image et information, style fiche recette
 * - Image appétissante avec overlay gradient subtil
 * - Section ingrédients/ustensiles mis en avant
 * - Temps de préparation clairement visible
 * - Disclaimer allergènes si détecté
 * - Accent couleur Terracotta (#D4A59A) pour la chaleur/cuisine
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface RecipeCardProps {
  activity: RessourceWithCreator
  lang: Language
}

const translations = {
  fr: {
    age: 'ans',
    recipe: 'Recette',
    prepTime: 'Préparation',
    cookTime: 'Cuisson',
    ingredients: 'Ingrédients',
    utensils: 'Ustensiles',
    allergenWarning: 'Vérifier allergènes',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Élaboré',
    withAdult: 'Avec adulte',
  },
  en: {
    age: 'yrs',
    recipe: 'Recipe',
    prepTime: 'Prep',
    cookTime: 'Cook',
    ingredients: 'Ingredients',
    utensils: 'Utensils',
    allergenWarning: 'Check allergens',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    withAdult: 'With adult',
  },
  es: {
    age: 'años',
    recipe: 'Receta',
    prepTime: 'Preparación',
    cookTime: 'Cocción',
    ingredients: 'Ingredientes',
    utensils: 'Utensilios',
    allergenWarning: 'Verificar alérgenos',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    withAdult: 'Con adulto',
  }
}

// Liste d'allergènes courants à détecter
const COMMON_ALLERGENS = [
  'lait', 'milk', 'leche',
  'oeuf', 'œuf', 'egg', 'huevo',
  'gluten', 'blé', 'wheat', 'trigo',
  'arachide', 'peanut', 'cacahuete',
  'noix', 'nut', 'nuez',
  'soja', 'soy', 'soya',
  'poisson', 'fish', 'pescado',
  'crustacé', 'shellfish', 'marisco'
]

// Détecter si la recette contient des allergènes potentiels
const hasAllergens = (materiel: MaterielItem[] | null, description: string | null): boolean => {
  const textToCheck = [
    ...(materiel || []).map(m => m.item.toLowerCase()),
    (description || '').toLowerCase()
  ].join(' ')

  return COMMON_ALLERGENS.some(allergen => textToCheck.includes(allergen))
}

// Séparer ingrédients et ustensiles du matériel
const categorizeItems = (materiel: MaterielItem[] | null) => {
  const ingredients: string[] = []
  const utensils: string[] = []

  const utensilKeywords = ['couteau', 'cuillère', 'bol', 'plat', 'moule', 'fouet', 'casserole', 'poêle', 'spatule', 'mixer', 'robot', 'four', 'plaque', 'balance', 'verre', 'mesureur', 'knife', 'spoon', 'bowl', 'pan', 'pot', 'whisk', 'oven']

  ;(materiel || []).forEach(item => {
    const itemLower = item.item.toLowerCase()
    if (utensilKeywords.some(k => itemLower.includes(k))) {
      utensils.push(item.item)
    } else {
      ingredients.push(item.item)
    }
  })

  return { ingredients, utensils }
}

export default function RecipeCard({ activity, lang }: RecipeCardProps) {
  if (!activity) return null

  const imageSource = activity.vignette_url || activity.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const t = translations[lang] || translations.fr
  const showAllergenWarning = hasAllergens(activity.materiel_json, activity.description)
  const { ingredients, utensils } = categorizeItems(activity.materiel_json)

  const difficultyLabel = activity.difficulte === 'beginner' ? t.easy
    : activity.difficulte === 'advanced' ? t.medium
    : activity.difficulte === 'expert' ? t.hard : null

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>

          {/* Image avec style recette */}
          <div className="aspect-[4/3] overflow-hidden relative">
            <Image
              src={coverImage}
              alt={activity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badge Recette */}
            <div className="absolute top-3 left-3">
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                style={{ backgroundColor: 'rgba(212, 165, 154, 0.95)', color: '#fff' }}
              >
                <ChefHat className="w-3.5 h-3.5" />
                {t.recipe}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-3 right-3 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2 py-1">
              <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
            </div>

            {/* Avertissement allergènes */}
            {showAllergenWarning && (
              <div className="absolute bottom-3 left-3">
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/90 text-white shadow-lg">
                  <AlertTriangle className="w-3 h-3" />
                  {t.allergenWarning}
                </span>
              </div>
            )}
          </div>

          {/* Contenu structuré */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark text-lg leading-tight mb-3 line-clamp-2">
              {activity.title}
            </h3>

            {/* Barre d'infos temps/difficulté */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-foreground/[0.08] dark:border-white/[0.1]">
              {/* Temps */}
              {activity.duration && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(212, 165, 154, 0.15)' }}
                  >
                    <Timer className="w-4 h-4" style={{ color: '#C9A092' }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide">
                      {t.prepTime}
                    </span>
                    <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                      {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} min
                    </span>
                  </div>
                </div>
              )}

              {/* Séparateur */}
              {activity.duration && difficultyLabel && (
                <div className="w-px h-8 bg-foreground/[0.08] dark:bg-white/[0.1]" />
              )}

              {/* Difficulté */}
              {difficultyLabel && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(212, 165, 154, 0.15)' }}
                  >
                    <Flame className="w-4 h-4" style={{ color: '#C9A092' }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide">
                      Niveau
                    </span>
                    <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                      {difficultyLabel}
                    </span>
                  </div>
                </div>
              )}

              {/* Âge */}
              {activity.age_min !== null && (
                <div className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Users className="w-3 h-3" />
                  {activity.age_min}-{activity.age_max} {t.age}
                </div>
              )}
            </div>

            {/* Aperçu ingrédients/ustensiles */}
            {(ingredients.length > 0 || utensils.length > 0) && (
              <div className="flex gap-4 mb-3">
                {/* Ingrédients */}
                {ingredients.length > 0 && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-1">
                      <CookingPot className="w-3 h-3" />
                      {t.ingredients}
                    </div>
                    <p className="text-xs text-foreground dark:text-foreground-dark line-clamp-2">
                      {ingredients.slice(0, 4).join(', ')}
                      {ingredients.length > 4 && '...'}
                    </p>
                  </div>
                )}

                {/* Ustensiles */}
                {utensils.length > 0 && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-1">
                      <UtensilsCrossed className="w-3 h-3" />
                      {t.utensils}
                    </div>
                    <p className="text-xs text-foreground dark:text-foreground-dark line-clamp-2">
                      {utensils.slice(0, 3).join(', ')}
                      {utensils.length > 3 && '...'}
                    </p>
                  </div>
                )}
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
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-terracotta-light to-terracotta dark:from-terracotta dark:to-terracotta-dark flex-shrink-0 ring-2 ring-surface dark:ring-surface-dark">
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
