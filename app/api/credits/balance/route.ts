import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Appeler la fonction RPC pour obtenir le breakdown complet
    const { data, error } = await supabase.rpc('get_credit_breakdown', {
      p_user_id: user.id
    })

    if (error) {
      console.error('Credit breakdown error:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la récupération des crédits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ...data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
