/**
 * Cards Components Index
 *
 * Export centralisé de tous les composants de cartes pour les ressources.
 *
 * Templates disponibles:
 * - ActivityCard: Template par défaut (sensoriel, motricité fine, art plastique)
 * - MovementNatureCard: Pour motricité globale & nature/plein air
 * - DocumentPrintableCard: Pour rituels/routines & imprimables
 * - RecipeCard: Pour la catégorie cuisine
 * - DIYCraftCard: Pour DIY/récup & jeux symboliques
 * - BundleCard: Pour les packs de ressources
 * - ResourceCard: Routeur intelligent qui sélectionne le bon template
 *
 * Composants legacy:
 * - BookCard: Pour les livres
 * - GameCard: Pour les jeux
 */

// Template par défaut
export { default as ActivityCard } from './ActivityCard'

// Templates spécialisés par catégorie
export { default as MovementNatureCard } from './MovementNatureCard'
export { default as DocumentPrintableCard } from './DocumentPrintableCard'
export { default as RecipeCard } from './RecipeCard'
export { default as DIYCraftCard } from './DIYCraftCard'

// Template Bundle/Pack
export { default as BundleCard } from './BundleCard'
// Note: Bundle et BundleItem types sont exportés depuis '@/lib/types'

// Routeur intelligent
export { default as ResourceCard, detectTemplate } from './ResourceCard'
export type { ResourceCardProps } from './ResourceCard'

// Composants legacy
export { default as BookCard } from './BookCard'
export { default as GameCard } from './GameCard'
