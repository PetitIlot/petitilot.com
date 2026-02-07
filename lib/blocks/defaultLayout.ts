/**
 * Default Layout v2
 * Template par défaut pour les ressources sans layout défini
 *
 * NOTE: En cours de refonte pour v2 (canvas libre)
 * TODO Phase 7: Recréer avec nouveaux types
 */

import type { ContentBlocksData, ContentBlock } from './types'
import { DEFAULT_CANVAS_CONFIG, BLOCK_PRESETS, createBlock } from './types'

/**
 * Crée un layout par défaut v2 pour une ressource
 * Pour l'instant, retourne un layout minimal
 */
export function createDefaultLayout(): ContentBlocksData {
  // Layout minimal par défaut avec blocs essentiels
  const blocks: ContentBlock[] = [
    // Bloc titre en haut
    createBlock('title', BLOCK_PRESETS.title.data!, BLOCK_PRESETS.title.position),

    // Bloc texte pour description
    createBlock(
      'text',
      { content: '<p>Description de la ressource...</p>' },
      { x: 20, y: 180, width: 500, height: 'auto', zIndex: 1 }
    ),

    // Bloc créateur
    createBlock('creator', BLOCK_PRESETS.creator.data!, { x: 560, y: 180, width: 220, height: 'auto', zIndex: 5 }),

    // Bloc achat
    createBlock('purchase', BLOCK_PRESETS.purchase.data!, { x: 560, y: 400, width: 220, height: 'auto', zIndex: 20 })
  ]

  return {
    version: 2,
    canvas: DEFAULT_CANVAS_CONFIG,
    layout: {
      desktop: blocks
    }
  }
}

/**
 * Vérifie si une ressource a un layout valide
 */
export function hasValidLayout(data: ContentBlocksData | null): boolean {
  if (!data) return false
  if (data.version !== 2) return false
  if (!data.layout?.desktop || data.layout.desktop.length === 0) return false
  return true
}

/**
 * Alias pour rétrocompatibilité
 * @deprecated Utiliser createDefaultLayout
 */
export const generateDefaultLayout = createDefaultLayout
