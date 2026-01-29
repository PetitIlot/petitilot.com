import { createClient } from '@/lib/supabase-client'

export interface Unlock {
  id: string
  user_id: string
  ressource_id: string
  unlock_method: 'free' | 'purchase' | 'gift' | 'subscription'
  transaction_id: string | null
  created_at: string
}

export async function hasUnlocked(userId: string, ressourceId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .rpc('has_unlocked_ressource', {
      p_user_id: userId,
      p_ressource_id: ressourceId
    })

  if (error) {
    console.error('Error checking unlock:', error)
    return false
  }

  return !!data
}

export async function unlockRessource(
  userId: string,
  ressourceId: string,
  method: 'free' | 'purchase' | 'gift' | 'subscription' = 'free',
  transactionId?: string
): Promise<Unlock | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('unlocks')
    .insert({
      user_id: userId,
      ressource_id: ressourceId,
      unlock_method: method,
      transaction_id: transactionId || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error unlocking ressource:', error)
    return null
  }

  return data
}

export async function getUnlockedRessources(userId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('unlocks')
    .select('ressource_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching unlocked ressources:', error)
    return []
  }

  return data?.map(u => u.ressource_id) || []
}
