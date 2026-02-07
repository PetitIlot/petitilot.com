'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, ChefHat, UtensilsCrossed, AlertTriangle, Timer, Flame, CheckCircle2, Circle, Tag, Lightbulb, ShoppingCart, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Language, MaterielItem } from '@/lib/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { getActivityImageUrl } from '@/lib/cloudinary'
import CreatorWidget from '@/components/CreatorWidget'
import FavoriteButton from '@/components/FavoriteButton'
import PurchaseButton from '@/components/PurchaseButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'
import { Button } from '@/components/ui/button'

/**
 * RecipeTemplate - Page de détail pour catégorie Cuisine
 *
 * Design: Layout inspiré des sites de recettes professionnels
 * - Hero image appétissante
 * - Sidebar fixe avec ingrédients
 * - Indicateurs allergènes
 * - Check-liste pour les étapes
 * - Couleur Terracotta (#D4A59A) pour la chaleur cuisine
 */

const translations = {
  fr: {
    back: 'Retour aux activités',
    recipe: 'Recette',
    age: 'Âge',
    years: 'ans',
    prepTime: 'Préparation',
    cookTime: 'Cuisson',
    totalTime: 'Temps total',
    minutes: 'min',
    servings: 'Portions',
    difficulty: 'Difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Élaboré',
    withAdult: 'Avec un adulte',
    ingredients: 'Ingrédients',
    utensils: 'Ustensiles',
    allergenWarning: 'Allergènes potentiels',
    allergenDisclaimer: 'Cette recette peut contenir des allergènes. Vérifiez toujours les étiquettes et adaptez selon vos besoins.',
    steps: 'Préparation',
    tips: 'Astuces du chef',
    buyIngredients: 'Où acheter',
    stepPrefix: 'Étape',
  },
  en: {
    back: 'Back to activities',
    recipe: 'Recipe',
    age: 'Age',
    years: 'yrs',
    prepTime: 'Prep time',
    cookTime: 'Cook time',
    totalTime: 'Total time',
    minutes: 'min',
    servings: 'Servings',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    withAdult: 'With an adult',
    ingredients: 'Ingredients',
    utensils: 'Utensils',
    allergenWarning: 'Potential allergens',
    allergenDisclaimer: 'This recipe may contain allergens. Always check labels and adapt to your needs.',
    steps: 'Instructions',
    tips: 'Chef tips',
    buyIngredients: 'Where to buy',
    stepPrefix: 'Step',
  },
  es: {
    back: 'Volver a actividades',
    recipe: 'Receta',
    age: 'Edad',
    years: 'años',
    prepTime: 'Preparación',
    cookTime: 'Cocción',
    totalTime: 'Tiempo total',
    minutes: 'min',
    servings: 'Porciones',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    withAdult: 'Con un adulto',
    ingredients: 'Ingredientes',
    utensils: 'Utensilios',
    allergenWarning: 'Alérgenos potenciales',
    allergenDisclaimer: 'Esta receta puede contener alérgenos. Verifica siempre las etiquetas.',
    steps: 'Preparación',
    tips: 'Consejos del chef',
    buyIngredients: 'Dónde comprar',
    stepPrefix: 'Paso',
  }
}

// Allergènes courants
const COMMON_ALLERGENS = {
  lait: { fr: 'Lait', en: 'Milk', es: 'Leche', emoji: '🥛' },
  oeuf: { fr: 'Œufs', en: 'Eggs', es: 'Huevos', emoji: '🥚' },
  gluten: { fr: 'Gluten', en: 'Gluten', es: 'Gluten', emoji: '🌾' },
  arachide: { fr: 'Arachides', en: 'Peanuts', es: 'Cacahuetes', emoji: '🥜' },
  noix: { fr: 'Fruits à coque', en: 'Tree nuts', es: 'Frutos secos', emoji: '🌰' },
  soja: { fr: 'Soja', en: 'Soy', es: 'Soja', emoji: '🫘' },
  poisson: { fr: 'Poisson', en: 'Fish', es: 'Pescado', emoji: '🐟' },
}

// Détecter les allergènes
const detectAllergens = (materiel: MaterielItem[] | null, description: string | null): string[] => {
  const text = [
    ...(materiel || []).map(m => m.item.toLowerCase()),
    (description || '').toLowerCase()
  ].join(' ')

  const detected: string[] = []
  if (text.match(/lait|beurre|crème|fromage|milk|butter|cream|cheese/)) detected.push('lait')
  if (text.match(/oeuf|œuf|egg/)) detected.push('oeuf')
  if (text.match(/farine|blé|gluten|flour|wheat/)) detected.push('gluten')
  if (text.match(/arachide|cacahuète|peanut/)) detected.push('arachide')
  if (text.match(/noix|amande|noisette|nut|almond|hazelnut/)) detected.push('noix')
  if (text.match(/soja|soy/)) detected.push('soja')
  if (text.match(/poisson|fish|saumon|thon/)) detected.push('poisson')

  return detected
}

// Séparer ingrédients et ustensiles
const categorizeItems = (materiel: MaterielItem[] | null) => {
  const ingredients: MaterielItem[] = []
  const utensils: MaterielItem[] = []

  const utensilKeywords = ['couteau', 'cuillère', 'bol', 'plat', 'moule', 'fouet', 'casserole', 'poêle', 'spatule', 'mixer', 'robot', 'four', 'plaque', 'balance', 'verre', 'mesureur', 'rouleau', 'knife', 'spoon', 'bowl', 'pan', 'pot', 'whisk', 'oven', 'baking']

  ;(materiel || []).forEach(item => {
    const itemLower = item.item.toLowerCase()
    if (utensilKeywords.some(k => itemLower.includes(k))) {
      utensils.push(item)
    } else {
      ingredients.push(item)
    }
  })

  return { ingredients, utensils }
}

interface RecipeTemplateProps {
  activity: RessourceWithCreator
  lang: Language
}

export default function RecipeTemplate({ activity, lang }: RecipeTemplateProps) {
  const t = translations[lang] || translations.fr
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())

  const imageSource = activity.images_urls?.[0] || activity.vignette_url
  const heroImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200'

  const allergens = detectAllergens(activity.materiel_json, activity.description)
  const { ingredients, utensils } = categorizeItems(activity.materiel_json)

  const difficultyLabel = activity.difficulte === 'beginner' ? t.easy
    : activity.difficulte === 'advanced' ? t.medium : t.hard

  // Simuler des étapes à partir de la description
  const steps = activity.description?.split(/\n\n|\. (?=[A-Z])/).filter(s => s.trim().length > 20) || []

  const toggleStep = (idx: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(idx)) newChecked.delete(idx)
    else newChecked.add(idx)
    setCheckedSteps(newChecked)
  }

  const toggleIngredient = (idx: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(idx)) newChecked.delete(idx)
    else newChecked.add(idx)
    setCheckedIngredients(newChecked)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={heroImage}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href={`/${lang}/activites`}>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <RatingHearts ressourceId={activity.id} variant="display" size="sm" lang={lang} />
              </div>
              <FavoriteButton ressourceId={activity.id} variant="icon" lang={lang} />
            </div>
          </div>
        </div>

        {/* Titre sur l'image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-6xl mx-auto">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm mb-4"
              style={{ backgroundColor: 'rgba(212, 165, 154, 0.9)' }}
            >
              <ChefHat className="w-4 h-4" />
              {t.recipe}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
              {activity.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Barre d'infos rapides */}
      <div className="bg-white dark:bg-surface-dark border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {activity.duration && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 165, 154, 0.15)' }}>
                  <Timer className="w-5 h-5" style={{ color: '#C9A092' }} />
                </div>
                <div>
                  <p className="text-xs text-foreground-secondary uppercase">{t.prepTime}</p>
                  <p className="font-semibold text-foreground dark:text-foreground-dark">
                    {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} {t.minutes}
                  </p>
                </div>
              </div>
            )}
            {activity.difficulte && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 165, 154, 0.15)' }}>
                  <Flame className="w-5 h-5" style={{ color: '#C9A092' }} />
                </div>
                <div>
                  <p className="text-xs text-foreground-secondary uppercase">{t.difficulty}</p>
                  <p className="font-semibold text-foreground dark:text-foreground-dark">{difficultyLabel}</p>
                </div>
              </div>
            )}
            {activity.age_min !== null && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 165, 154, 0.15)' }}>
                  <Users className="w-5 h-5" style={{ color: '#C9A092' }} />
                </div>
                <div>
                  <p className="text-xs text-foreground-secondary uppercase">{t.age}</p>
                  <p className="font-semibold text-foreground dark:text-foreground-dark">{activity.age_min}-{activity.age_max} {t.years}</p>
                </div>
              </div>
            )}
            {!activity.autonomie && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{t.withAdult}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal - Layout 2 colonnes */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar - Ingrédients & Ustensiles */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Allergènes */}
              {allergens.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800"
                >
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {t.allergenWarning}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allergens.map(allergen => (
                      <span
                        key={allergen}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-amber-100 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200"
                      >
                        {COMMON_ALLERGENS[allergen as keyof typeof COMMON_ALLERGENS]?.emoji}
                        {COMMON_ALLERGENS[allergen as keyof typeof COMMON_ALLERGENS]?.[lang] || allergen}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {t.allergenDisclaimer}
                  </p>
                </motion.div>
              )}

              {/* Ingrédients */}
              {ingredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-surface-dark rounded-2xl p-5"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <h3 className="font-bold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" style={{ color: '#C9A092' }} />
                    {t.ingredients}
                  </h3>
                  <ul className="space-y-3">
                    {ingredients.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        {checkedIngredients.has(idx) ? (
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A092' }} />
                        ) : (
                          <Circle className="w-5 h-5 flex-shrink-0 text-foreground-secondary group-hover:text-foreground" />
                        )}
                        <span className={`flex-1 ${checkedIngredients.has(idx) ? 'line-through text-foreground-secondary' : 'text-foreground dark:text-foreground-dark'}`}>
                          {item.item}
                        </span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                            <ExternalLink className="w-4 h-4 text-sage hover:text-sage-dark" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Ustensiles */}
              {utensils.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-surface-dark rounded-2xl p-5"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <h3 className="font-bold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" style={{ color: '#C9A092' }} />
                    {t.utensils}
                  </h3>
                  <ul className="space-y-2">
                    {utensils.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground-secondary">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A092' }} />
                        {item.item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Créateur */}
            {activity.creator && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <CreatorWidget creator={activity.creator} lang={lang} />
              </motion.div>
            )}

            {/* Thèmes et compétences */}
            <div className="flex flex-wrap gap-2 mb-8">
              {activity.themes?.map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
                >
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                  {theme}
                </span>
              ))}
              {activity.competences?.map((comp, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}
                >
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                  {comp}
                </span>
              ))}
            </div>

            {/* Galerie */}
            {activity.gallery_urls && activity.gallery_urls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <GalleryCarousel
                  images={activity.gallery_urls}
                  alt={activity.title}
                  className="w-full max-w-md"
                />
              </motion.div>
            )}

            {/* Étapes de préparation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-6">
                👨‍🍳 {t.steps}
              </h2>

              {steps.length > 0 ? (
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                        checkedSteps.has(idx)
                          ? 'bg-sage/10 dark:bg-sage/20'
                          : 'bg-white dark:bg-surface-dark hover:bg-surface-secondary dark:hover:bg-surface-dark'
                      }`}
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                          checkedSteps.has(idx)
                            ? 'bg-sage text-white'
                            : 'text-foreground-secondary'
                        }`}
                        style={!checkedSteps.has(idx) ? { backgroundColor: 'rgba(212, 165, 154, 0.15)', color: '#C9A092' } : {}}
                      >
                        {checkedSteps.has(idx) ? '✓' : idx + 1}
                      </div>
                      <p className={`flex-1 leading-relaxed ${checkedSteps.has(idx) ? 'text-foreground-secondary line-through' : 'text-foreground dark:text-foreground-dark'}`}>
                        {step.trim()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : activity.description && (
                <div className="prose prose-lg dark:prose-invert">
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed whitespace-pre-line">
                    {activity.description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Astuces */}
            {activity.astuces && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 rounded-2xl p-6"
                style={{ backgroundColor: 'rgba(212, 165, 154, 0.1)', borderLeft: '4px solid #D4A59A' }}
              >
                <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-3">
                  💡 {t.tips}
                </h3>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
                  {activity.astuces}
                </p>
              </motion.div>
            )}

            {/* Bouton achat/téléchargement */}
            {activity.pdf_url && (
              <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <PurchaseButton
                  ressourceId={activity.id}
                  priceCredits={activity.price_credits ?? (activity.is_premium ? 3 : 0)}
                  pdfUrl={activity.pdf_url}
                  lang={lang}
                  className="w-full h-14 font-semibold text-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
