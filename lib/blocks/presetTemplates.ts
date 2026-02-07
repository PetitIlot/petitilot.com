/**
 * Preset Templates v2
 * Templates prédéfinis pour démarrage rapide
 *
 * NOTE: En cours de refonte pour v2 (canvas libre)
 * TODO Phase 7: Recréer avec nouveaux types
 */

import type { ContentBlocksData } from './types'
import { createDefaultLayout } from './defaultLayout'

export type TemplateId = 'base' | 'recipe' | 'craft' | 'game'

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
  layout: ContentBlocksData
}

/**
 * Templates prédéfinis - Version placeholder
 * TODO Phase 7: Créer vrais templates avec layouts spécifiques
 */
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'base',
    name: {
      fr: 'Template de base',
      en: 'Basic Template',
      es: 'Plantilla básica'
    },
    description: {
      fr: 'Layout simple et polyvalent',
      en: 'Simple and versatile layout',
      es: 'Diseño simple y versátil'
    },
    layout: createDefaultLayout()
  }
]

export function getTemplate(id: TemplateId): ContentBlocksData {
  const template = PRESET_TEMPLATES.find(t => t.id === id)
  return template?.layout || createDefaultLayout()
}
