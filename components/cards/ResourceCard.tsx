'use client'

import type { Ressource, Language, Creator } from '@/lib/types'

// Import de tous les templates
import ActivityCard from './ActivityCard'
import MovementNatureCard from './MovementNatureCard'
import DocumentPrintableCard from './DocumentPrintableCard'
import RecipeCard from './RecipeCard'
import DIYCraftCard from './DIYCraftCard'

/**
 * ResourceCard - Composant routeur intelligent
 *
 * Route automatiquement vers le bon template de carte
 * en fonction des catégories de la ressource.
 *
 * Mapping des catégories vers templates:
 * - sensoriel, motricité fine, art plastique → ActivityCard (template par défaut)
 * - motricité globale, nature & plein air → MovementNatureCard
 * - rituels & routines, imprimables → DocumentPrintableCard
 * - cuisine → RecipeCard
 * - DIY & récup, jeux symboliques → DIYCraftCard
 *
 * Note: BundleCard est utilisé séparément pour les packs (type différent)
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface ResourceCardProps {
  resource: RessourceWithCreator
  lang: Language
  /** Force un template spécifique (override la détection automatique) */
  forceTemplate?: 'default' | 'movement' | 'document' | 'recipe' | 'diy'
}

// Catégories pour chaque template
const MOVEMENT_NATURE_CATEGORIES = [
  'motricite-globale',
  'motricité globale',
  'nature-plein-air',
  'nature & plein air',
  'nature',
  'plein air',
  'outdoor',
  'gross motor',
]

const DOCUMENT_PRINTABLE_CATEGORIES = [
  'rituels-routines',
  'rituels & routines',
  'rituels',
  'routines',
  'imprimables',
  'imprimable',
  'printables',
  'printable',
]

const RECIPE_CATEGORIES = [
  'cuisine',
  'cooking',
  'cocina',
  'recette',
  'recipe',
  'alimentation',
]

const DIY_CRAFT_CATEGORIES = [
  'diy-recup',
  'diy & récup',
  'diy',
  'récup',
  'bricolage',
  'jeux-symboliques',
  'jeux symboliques',
  'jeu symbolique',
  'imaginative play',
  'symbolic play',
]

/**
 * Détermine le template à utiliser en fonction des catégories
 */
function detectTemplate(categories: string[] | null, type: string | null): 'default' | 'movement' | 'document' | 'recipe' | 'diy' {
  if (!categories || categories.length === 0) {
    // Fallback sur le type si pas de catégories
    if (type === 'alimentation') return 'recipe'
    return 'default'
  }

  const normalizedCategories = categories.map(c => c.toLowerCase().trim())

  // Vérifier chaque groupe de catégories (ordre de priorité)
  // Recette en premier car plus spécifique
  if (normalizedCategories.some(c => RECIPE_CATEGORIES.some(rc => c.includes(rc)))) {
    return 'recipe'
  }

  // DIY/Craft
  if (normalizedCategories.some(c => DIY_CRAFT_CATEGORIES.some(dc => c.includes(dc)))) {
    return 'diy'
  }

  // Document/Imprimable
  if (normalizedCategories.some(c => DOCUMENT_PRINTABLE_CATEGORIES.some(dc => c.includes(dc)))) {
    return 'document'
  }

  // Mouvement/Nature
  if (normalizedCategories.some(c => MOVEMENT_NATURE_CATEGORIES.some(mc => c.includes(mc)))) {
    return 'movement'
  }

  // Type alimentation comme fallback
  if (type === 'alimentation') {
    return 'recipe'
  }

  return 'default'
}

export default function ResourceCard({ resource, lang, forceTemplate }: ResourceCardProps) {
  if (!resource) return null

  // Déterminer le template à utiliser
  const template = forceTemplate || detectTemplate(resource.categories, resource.type)

  // Router vers le bon composant
  switch (template) {
    case 'movement':
      return <MovementNatureCard activity={resource} lang={lang} />

    case 'document':
      return <DocumentPrintableCard activity={resource} lang={lang} />

    case 'recipe':
      return <RecipeCard activity={resource} lang={lang} />

    case 'diy':
      return <DIYCraftCard activity={resource} lang={lang} />

    case 'default':
    default:
      return <ActivityCard activity={resource} lang={lang} />
  }
}

// Export des utilitaires pour usage externe
export { detectTemplate }
export type { ResourceCardProps }
