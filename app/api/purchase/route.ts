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

    // Récupérer l'ID de la ressource
    const { ressource_id } = await request.json()

    if (!ressource_id) {
      return NextResponse.json(
        { success: false, error: 'ID ressource manquant' },
        { status: 400 }
      )
    }

    // Appeler la fonction d'achat
    const { data, error } = await supabase.rpc('purchase_ressource', {
      p_buyer_id: user.id,
      p_ressource_id: ressource_id
    })

    if (error) {
      console.error('Purchase error:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'achat' },
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
