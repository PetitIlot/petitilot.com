import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    // Récupérer le code promo
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Code promo manquant' },
        { status: 400 }
      )
    }

    // Appeler la fonction RPC
    const { data, error } = await supabase.rpc('apply_promo_code', {
      p_user_id: user.id,
      p_code: code.trim().toUpperCase()
    })

    if (error) {
      console.error('Promo code error:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'application du code' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
