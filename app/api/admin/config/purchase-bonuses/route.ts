import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Récupérer les bonus d'achat
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: bonuses, error } = await supabase
      .from('purchase_bonuses')
      .select('*')
      .order('pack_credits', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, bonuses })
  } catch (error) {
    console.error('Error fetching purchase bonuses:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH - Mettre à jour un bonus d'achat
export async function PATCH(request: NextRequest) {
  try {
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
    const { pack_id, bonus_free_credits, is_active } = body

    if (!pack_id) {
      return NextResponse.json({ error: 'pack_id requis' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (bonus_free_credits !== undefined) updates.bonus_free_credits = bonus_free_credits
    if (is_active !== undefined) updates.is_active = is_active

    const { data, error } = await supabase
      .from('purchase_bonuses')
      .update(updates)
      .eq('pack_id', pack_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, bonus: data })
  } catch (error) {
    console.error('Error updating purchase bonus:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
