import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Modifier un code promo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    // Champs modifiables
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.max_uses !== undefined) updates.max_uses = body.max_uses
    if (body.allow_multiple_per_user !== undefined) updates.allow_multiple_per_user = body.allow_multiple_per_user
    if (body.expires_at !== undefined) updates.expires_at = body.expires_at
    if (body.description !== undefined) updates.description = body.description
    if (body.free_credits !== undefined) updates.free_credits = body.free_credits

    updates.updated_at = new Date().toISOString()

    const { data: updatedCode, error } = await supabase
      .from('promo_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, code: updatedCode })
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un code promo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET - Voir les utilisations d'un code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Récupérer les utilisations
    const { data: redemptions, error } = await supabase
      .from('promo_code_redemptions')
      .select(`
        *,
        profiles:user_id (email)
      `)
      .eq('promo_code_id', id)
      .order('redeemed_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, redemptions })
  } catch (error) {
    console.error('Error fetching redemptions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
