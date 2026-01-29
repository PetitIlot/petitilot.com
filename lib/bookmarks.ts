import { createClient } from '@/lib/supabase-client'
import { Ressource } from './types'

export interface Bookmark {
  id: string
  user_id: string
  ressource_id: string
  created_at: string
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
    return []
  }

  return data || []
}

export async function getBookmarkedRessources(userId: string, type?: string): Promise<Ressource[]> {
  const supabase = createClient()

  let query = supabase
    .from('bookmarks')
    .select(`
      ressource_id,
      ressources (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookmarked ressources:', error)
    return []
  }

  // Extract ressources from join data
  const ressources = (data?.map(item => item.ressources).filter(Boolean) || []) as unknown as Ressource[]

  if (type) {
    return ressources.filter((r) => r.type === type)
  }

  return ressources
}

export async function isBookmarked(userId: string, ressourceId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('ressource_id', ressourceId)
    .single()

  return !!data && !error
}

export async function addBookmark(userId: string, ressourceId: string): Promise<Bookmark | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, ressource_id: ressourceId })
    .select()
    .single()

  if (error) {
    console.error('Error adding bookmark:', error)
    return null
  }

  return data
}

export async function removeBookmark(userId: string, ressourceId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('ressource_id', ressourceId)

  if (error) {
    console.error('Error removing bookmark:', error)
    return false
  }

  return true
}

export async function getBookmarkCountByType(userId: string): Promise<Record<string, number>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      ressource_id,
      ressources (type)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching bookmark counts:', error)
    return {}
  }

  // @ts-ignore
  const counts: Record<string, number> = {}

  data?.forEach((item: any) => {
    const type = item.ressources?.type
    if (type) {
      counts[type] = (counts[type] || 0) + 1
    }
  })

  return counts
}
