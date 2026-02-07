'use client'

import { Language } from '@/lib/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'

// Import de tous les templates
import MovementNatureTemplate from './MovementNatureTemplate'
import DocumentPrintableTemplate from './DocumentPrintableTemplate'
import RecipeTemplate from './RecipeTemplate'
import DIYCraftTemplate from './DIYCraftTemplate'

// Import du template par défaut (page actuelle)
// Note: Le template par défaut reste dans la page pour rétrocompatibilité

/**
 * ActivityDetailRouter - Routeur intelligent pour les pages de détail
 *
 * Sélectionne automatiquement le bon template de page complète
 * en fonction des catégories de la ressource.
 *
 * Mapping des catégories vers templates:
 * - sensoriel, motricité fine, art plastique → Default (page actuelle)
 * - motricité globale, nature & plein air → MovementNatureTemplate
 * - rituels & routines, imprimables → DocumentPrintableTemplate
 * - cuisine → RecipeTemplate
 * - DIY & récup, jeux symboliques → DIYCraftTemplate
 */

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

export type TemplateType = 'default' | 'movement' | 'document' | 'recipe' | 'diy'

/**
 * Détermine le template à utiliser en fonction des catégories
 */
export function detectPageTemplate(categories: string[] | null, type: string | null): TemplateType {
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

interface ActivityDetailRouterProps {
  activity: RessourceWithCreator
  lang: Language
  /** Force un template spécifique (override la détection automatique) */
  forceTemplate?: TemplateType
  /** Composant à utiliser pour le template par défaut */
  DefaultTemplate?: React.ComponentType<{ activity: RessourceWithCreator; lang: Language }>
}

/**
 * Composant routeur qui sélectionne le bon template
 */
export default function ActivityDetailRouter({
  activity,
  lang,
  forceTemplate,
  DefaultTemplate
}: ActivityDetailRouterProps) {
  // Déterminer le template à utiliser
  const template = forceTemplate || detectPageTemplate(activity.categories, activity.type)

  // Router vers le bon composant
  switch (template) {
    case 'movement':
      return <MovementNatureTemplate activity={activity} lang={lang} />

    case 'document':
      return <DocumentPrintableTemplate activity={activity} lang={lang} />

    case 'recipe':
      return <RecipeTemplate activity={activity} lang={lang} />

    case 'diy':
      return <DIYCraftTemplate activity={activity} lang={lang} />

    case 'default':
    default:
      // Si un composant par défaut est fourni, l'utiliser
      if (DefaultTemplate) {
        return <DefaultTemplate activity={activity} lang={lang} />
      }
      // Sinon retourner null (la page parente gère le rendu par défaut)
      return null
  }
}
