/**
 * Saved Templates v2
 * Gestion des templates sauvegardés par les créateurs
 */

import type { ContentBlocksData } from './types'
import { createClient } from '@/lib/supabase-client'

export interface SavedTemplate {
  id: string
  creator_id: string
  name: string
  description?: string
  layout: ContentBlocksData
  created_at: string
  updated_at: string
  is_public: boolean
}

/**
 * Sauvegarde un template personnalisé
 */
export async function saveTemplate(
  creatorId: string,
  name: string,
  layout: ContentBlocksData,
  description?: string,
  isPublic: boolean = false
): Promise<SavedTemplate | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_templates')
      .insert({
        creator_id: creatorId,
        name,
        description,
        layout,
        is_public: isPublic
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving template:', error.message, error.code, error.details, error.hint)
      return null
    }

    return data as SavedTemplate
  } catch (err) {
    console.error('Error saving template:', err)
    return null
  }
}

/**
 * Met à jour un template existant
 */
export async function updateTemplate(
  templateId: string,
  updates: {
    name?: string
    description?: string
    layout?: ContentBlocksData
    is_public?: boolean
  }
): Promise<SavedTemplate | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      return null
    }

    return data as SavedTemplate
  } catch (err) {
    console.error('Error updating template:', err)
    return null
  }
}

/**
 * Charge les templates d'un créateur
 */
export async function loadCreatorTemplates(creatorId: string): Promise<SavedTemplate[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_templates')
      .select('*')
      .eq('creator_id', creatorId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error loading creator templates:', error)
      return []
    }

    return (data || []) as SavedTemplate[]
  } catch (err) {
    console.error('Error loading creator templates:', err)
    return []
  }
}

/**
 * Charge les templates publics
 */
export async function loadPublicTemplates(): Promise<SavedTemplate[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_templates')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error loading public templates:', error)
      return []
    }

    return (data || []) as SavedTemplate[]
  } catch (err) {
    console.error('Error loading public templates:', err)
    return []
  }
}

/**
 * Supprime un template
 */
export async function deleteTemplate(templateId: string, creatorId: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('saved_templates')
      .delete()
      .eq('id', templateId)
      .eq('creator_id', creatorId) // Sécurité: seul le créateur peut supprimer

    if (error) {
      console.error('Error deleting template:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Error deleting template:', err)
    return false
  }
}

/**
 * Duplique un template (pour utiliser un template public)
 */
export async function duplicateTemplate(
  templateId: string,
  newCreatorId: string,
  newName: string
): Promise<SavedTemplate | null> {
  try {
    const supabase = createClient()

    // D'abord, récupérer le template original
    const { data: original, error: fetchError } = await supabase
      .from('saved_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (fetchError || !original) {
      console.error('Error fetching template to duplicate:', fetchError)
      return null
    }

    // Créer une copie
    const { data, error } = await supabase
      .from('saved_templates')
      .insert({
        creator_id: newCreatorId,
        name: newName,
        description: original.description,
        layout: original.layout,
        is_public: false // Les copies sont privées par défaut
      })
      .select()
      .single()

    if (error) {
      console.error('Error duplicating template:', error)
      return null
    }

    return data as SavedTemplate
  } catch (err) {
    console.error('Error duplicating template:', err)
    return null
  }
}
