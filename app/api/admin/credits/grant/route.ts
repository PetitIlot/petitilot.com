import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// POST - Attribuer des crédits à un utilisateur
export async function POST(request: NextRequest) {
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
    const {
      user_id,
      free_credits = 0,
      paid_credits = 0,
      unit_value_cents = 0,
      reason = 'admin_grant'
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 })
    }

    if (free_credits <= 0 && paid_credits <= 0) {
      return NextResponse.json({ error: 'Montant de crédits requis' }, { status: 400 })
    }

    // Appeler la fonction RPC
    const { data, error } = await supabase.rpc('admin_grant_credits', {
      p_admin_id: user.id,
      p_user_id: user_id,
      p_free_credits: free_credits,
      p_paid_credits: paid_credits,
      p_unit_value_cents: unit_value_cents,
      p_reason: reason
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error granting credits:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
