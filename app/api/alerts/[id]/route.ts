import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/alerts/[id]
 * Met à jour une alerte (toggle is_active)
 * Body: { is_active?: boolean, name?: string }
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  // Vérifie ownership
  const { data: alert, error: fetchError } = await supabase
    .from('saved_searches')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !alert) {
    return NextResponse.json({ error: 'Alerte non trouvée' }, { status: 404 })
  }

  if (alert.user_id !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // Prépare les updates
  const updates: Record<string, unknown> = {}
  if (typeof body.is_active === 'boolean') {
    updates.is_active = body.is_active
  }
  if (typeof body.name === 'string' && body.name.trim()) {
    updates.name = body.name.trim()
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Aucune modification' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erreur mise à jour alerte:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ alert: data })
}

/**
 * DELETE /api/alerts/[id]
 * Supprime une alerte
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Erreur suppression alerte:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
