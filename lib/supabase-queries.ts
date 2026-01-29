import { supabase } from './supabase'
import type { Ressource, RessourceType, Language, Creator } from './types'
import type { ServerFilters } from './hooks/useFilters'

export type RessourceWithCreator = Ressource & { creator: Creator | null }

/**
 * Récupère les ressources par type et langue (avec infos créateur)
 */
export async function getRessources(
  type: RessourceType | RessourceType[],
  lang: Language,
  options?: {
    limit?: number
    offset?: number
    featured?: boolean
  }
) {
  let query = supabase
    .from('ressources')
    .select('*, creator:creators!creator_id(id, slug, display_name, avatar_url)')
    .eq('lang', lang)

  // Filtre par type (un seul ou plusieurs)
  if (Array.isArray(type)) {
    query = query.in('type', type)
  } else {
    query = query.eq('type', type)
  }

  // Filtre featured si demandé
  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }

  // Ordre par date de création (plus récent en premier)
  query = query.order('created_at', { ascending: false })

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching ressources:', error)
    return []
  }

  return data as Ressource[]
}

/**
 * Récupère une ressource par ID
 */
export async function getRessourceById(id: string) {
  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching ressource:', error)
    return null
  }

  return data as Ressource
}

/**
 * Récupère une ressource par ID avec les infos du créateur
 */
export async function getRessourceWithCreator(id: string): Promise<RessourceWithCreator | null> {
  // 1. Récupérer la ressource
  const { data: ressource, error: ressourceError } = await supabase
    .from('ressources')
    .select('*')
    .eq('id', id)
    .single()

  if (ressourceError || !ressource) {
    console.error('Error fetching ressource:', ressourceError)
    return null
  }

  // 2. Si creator_id existe, récupérer le créateur + count ressources
  let creator = null
  if (ressource.creator_id) {
    const { data: creatorData } = await supabase
      .from('creators')
      .select('*')
      .eq('id', ressource.creator_id)
      .single()

    if (creatorData) {
      // Count des ressources du créateur
      const { count: resourcesCount } = await supabase
        .from('ressources')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorData.id)

      // Count des followers
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorData.id)

      creator = {
        ...creatorData,
        total_resources: resourcesCount || 0,
        followers_count: followersCount || 0
      }
    }
  }

  return { ...ressource, creator } as RessourceWithCreator
}

/**
 * Récupère les ressources du même groupe (traductions)
 */
export async function getRessourceTranslations(groupId: string, excludeLang?: Language) {
  let query = supabase
    .from('ressources')
    .select('*')
    .eq('group_id', groupId)

  if (excludeLang) {
    query = query.neq('lang', excludeLang)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching translations:', error)
    return []
  }

  return data as Ressource[]
}

/**
 * Recherche de ressources
 */
export async function searchRessources(
  searchTerm: string,
  lang: Language,
  filters?: {
    type?: RessourceType[]
    ageMin?: number
    ageMax?: number
    themes?: string[]
    difficulte?: string
    autonomie?: boolean
  }
) {
  let query = supabase
    .from('ressources')
    .select('*')
    .eq('lang', lang)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)

  if (filters?.type?.length) {
    query = query.in('type', filters.type)
  }

  if (filters?.ageMin !== undefined) {
    query = query.gte('age_min', filters.ageMin)
  }

  if (filters?.ageMax !== undefined) {
    query = query.lte('age_max', filters.ageMax)
  }

  if (filters?.themes?.length) {
    query = query.overlaps('themes', filters.themes)
  }

  if (filters?.difficulte) {
    query = query.eq('difficulte', filters.difficulte)
  }

  if (filters?.autonomie !== undefined) {
    query = query.eq('autonomie', filters.autonomie)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching ressources:', error)
    return []
  }

  return data as Ressource[]
}

/**
 * Compte le nombre total de ressources
 */
export async function countRessources(type?: RessourceType, lang?: Language) {
  let query = supabase
    .from('ressources')
    .select('*', { count: 'exact', head: true })

  if (type) {
    query = query.eq('type', type)
  }

  if (lang) {
    query = query.eq('lang', lang)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error counting ressources:', error)
    return 0
  }

  return count || 0
}

/**
 * Récupère les ressources filtrées (filtres serveur uniquement)
 * Les filtres sur themes/competences/materials/intensity se font côté client
 */
export async function getFilteredRessources(
  lang: Language,
  filters: ServerFilters,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<RessourceWithCreator[]> {
  let query = supabase
    .from('ressources')
    .select('*, creator:creators!creator_id(id, slug, display_name, avatar_url)')
    .eq('lang', lang)

  // Filtre par types (activite, motricite, alimentation, etc.)
  if (filters.types?.length) {
    query = query.in('type', filters.types)
  }

  // Filtre par catégories (sensoriel, art-plastique, etc.) - utilise l'index GIN
  if (filters.categories?.length) {
    query = query.overlaps('categories', filters.categories)
  }

  // Filtre par âge (en mois)
  // Une ressource est compatible si son range chevauche le filtre
  if (filters.ageMin !== null) {
    // age_max de la ressource doit être >= ageMin du filtre (ou null)
    query = query.or(`age_max.gte.${filters.ageMin},age_max.is.null`)
  }
  if (filters.ageMax !== null) {
    // age_min de la ressource doit être <= ageMax du filtre (ou null)
    query = query.or(`age_min.lte.${filters.ageMax},age_min.is.null`)
  }

  // Filtre par durée max
  if (filters.duration !== null) {
    query = query.lte('duration', filters.duration)
  }

  // Filtre par difficulté
  if (filters.difficulty) {
    query = query.eq('difficulte', filters.difficulty)
  }

  // Filtre par autonomie
  if (filters.autonomy !== null) {
    query = query.eq('autonomie', filters.autonomy)
  }

  // Filtre PDF téléchargeable
  if (filters.hasDownload === true) {
    query = query.not('pdf_url', 'is', null)
  }

  // Filtre gratuit/payant
  if (filters.isFree === true) {
    query = query.or('price_credits.eq.0,price_credits.is.null')
  } else if (filters.isFree === false) {
    query = query.gt('price_credits', 0)
  }

  // Filtre par range de prix
  if (filters.priceMin !== null) {
    query = query.gte('price_credits', filters.priceMin)
  }
  if (filters.priceMax !== null) {
    query = query.lte('price_credits', filters.priceMax)
  }

  // Filtre par créateur (via slug)
  if (filters.creatorSlug) {
    // On doit d'abord trouver le creator_id via le slug
    const { data: creator } = await supabase
      .from('creators')
      .select('id')
      .eq('slug', filters.creatorSlug)
      .single()

    if (creator) {
      query = query.eq('creator_id', creator.id)
    }
  }

  // Recherche texte (titre et description)
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  // Tri
  switch (filters.sort) {
    case 'popular':
      // On pourrait utiliser views_count ou purchases_count si disponible
      query = query.order('created_at', { ascending: false })
      break
    case 'price_asc':
      query = query.order('price_credits', { ascending: true, nullsFirst: true })
      break
    case 'price_desc':
      query = query.order('price_credits', { ascending: false, nullsFirst: false })
      break
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false })
  }

  // Pagination
  const limit = options?.limit || 100
  const offset = options?.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching filtered ressources:', error)
    return []
  }

  return (data || []) as RessourceWithCreator[]
}
