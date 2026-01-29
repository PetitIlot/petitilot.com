import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * GET /api/notifications/unread-count
 * Retourne le nombre de notifications non lues
 * Utilisé pour le badge dans le Header (polling toutes les 60s)
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ count: 0 })
  }

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('Erreur comptage notifications:', error)
    return NextResponse.json({ count: 0 })
  }

  return NextResponse.json({ count: count || 0 })
}
