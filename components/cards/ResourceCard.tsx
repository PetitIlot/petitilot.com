'use client'

import type { Ressource, Language, Creator } from '@/lib/types'
import ActivityCard from './ActivityCard'

/**
 * ResourceCard - Composant routeur
 *
 * Toutes les ressources utilisent désormais le template unifié ActivityCard
 * avec son design glassmorphism.
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface ResourceCardProps {
  resource: RessourceWithCreator
  lang: Language
}

export default function ResourceCard({ resource, lang }: ResourceCardProps) {
  if (!resource) return null
  return <ActivityCard activity={resource} lang={lang} />
}

export type { ResourceCardProps }
