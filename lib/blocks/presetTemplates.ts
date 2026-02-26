/**
 * Preset Templates v2.1
 * Templates prédéfinis pour démarrage rapide
 * Réexporte les templates depuis templates.ts
 */

import type { ContentBlocksData } from './types'
import {
  AVAILABLE_TEMPLATES,
  getTemplateById,
  createFromTemplate,
  getTemplatesByCategory,
  type TemplateInfo
} from './templates'

// Réexporter pour compatibilité
export type TemplateId = 'activity' | 'recipe' | 'diy' | 'video-tutorial' | 'gallery' | 'document' | 'minimal' | 'atelier' | 'nature-guide'

export interface PresetTemplate {
  id: TemplateId
  name: {
    fr: string
    en: string
    es: string
  }
  description: {
    fr: string
    en: string
    es: string
  }
  icon: string
  category: 'general' | 'cooking' | 'creative' | 'education'
  layout: ContentBlocksData
}

/**
 * Templates prédéfinis - Génération dynamique depuis templates.ts
 */
export const PRESET_TEMPLATES: PresetTemplate[] = AVAILABLE_TEMPLATES.map(t => ({
  id: t.id as TemplateId,
  name: t.name,
  description: t.description,
  icon: t.icon,
  category: t.category,
  layout: t.create()
}))

/**
 * Obtenir un template par ID
 */
export function getTemplate(id: TemplateId): ContentBlocksData {
  const template = PRESET_TEMPLATES.find(t => t.id === id)
  return template?.layout || PRESET_TEMPLATES[0].layout
}

/**
 * Obtenir tous les templates d'une catégorie
 */
export function getPresetsByCategory(category: PresetTemplate['category']): PresetTemplate[] {
  return PRESET_TEMPLATES.filter(t => t.category === category)
}

// Réexporter les helpers
export { getTemplateById, createFromTemplate, getTemplatesByCategory }
export type { TemplateInfo }
