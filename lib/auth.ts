import { createClient } from '@/lib/supabase-client'

export interface Profile {
  id: string
  email: string
  lang: 'fr' | 'en' | 'es'
  newsletter_subscribed: boolean
  created_at: string
  last_login: string | null
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>
): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

export async function updateLastLogin(userId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId)
}

export async function toggleNewsletter(userId: string): Promise<boolean> {
  const supabase = createClient()

  // Get current status
  const profile = await getProfile(userId)
  if (!profile) return false

  // Toggle
  const newStatus = !profile.newsletter_subscribed
  await updateProfile(userId, { newsletter_subscribed: newStatus })

  return newStatus
}

export interface UserStats {
  bookmarks_count: number
  unlocks_count: number
  bookmarks_by_type: {
    activite?: number
    motricite?: number
    alimentation?: number
    livre?: number
    jeu?: number
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_user_stats', { p_user_id: userId })

  if (error) {
    console.error('Error fetching user stats:', error)
    return null
  }

  return data
}
