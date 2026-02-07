/**
 * Templates Components Index
 *
 * Export centralisé de tous les templates de pages de détail.
 *
 * Templates disponibles:
 * - MovementNatureTemplate: Pour motricité globale & nature/plein air (layout immersif)
 * - DocumentPrintableTemplate: Pour rituels/routines & imprimables (layout document)
 * - RecipeTemplate: Pour la catégorie cuisine (layout recette avec ingrédients)
 * - DIYCraftTemplate: Pour DIY/récup & jeux symboliques (layout atelier)
 * - BundleTemplate: Pour les packs de ressources
 * - ActivityDetailRouter: Routeur intelligent qui sélectionne le bon template
 */

// Templates de pages spécialisés
export { default as MovementNatureTemplate } from './MovementNatureTemplate'
export { default as DocumentPrintableTemplate } from './DocumentPrintableTemplate'
export { default as RecipeTemplate } from './RecipeTemplate'
export { default as DIYCraftTemplate } from './DIYCraftTemplate'
export { default as BundleTemplate } from './BundleTemplate'

// Routeur intelligent
export { default as ActivityDetailRouter, detectPageTemplate } from './ActivityDetailRouter'
export type { TemplateType } from './ActivityDetailRouter'
