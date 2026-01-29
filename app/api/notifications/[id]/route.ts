import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/notifications/[id]
 * Marque une notification comme lue
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  // Vérifie que la notification appartient à l'utilisateur
  const { data: notification, error: fetchError } = await supabase
    .from('notifications')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !notification) {
    return NextResponse.json({ error: 'Notification non trouvée' }, { status: 404 })
  }

  if (notification.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // Marque comme lue
  const { error: updateError } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (updateError) {
    console.error('Erreur mise à jour notification:', updateError)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

/**
 * DELETE /api/notifications/[id]
 * Supprime une notification
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  // Supprime (RLS vérifiera l'ownership)
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Erreur suppression notification:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
