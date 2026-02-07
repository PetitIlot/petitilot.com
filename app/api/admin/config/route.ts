import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Récupérer toutes les configs
export async function GET() {
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

    // Récupérer les configs
    const { data: configs, error: configError } = await supabase
      .from('app_config')
      .select('*')

    // Récupérer les bonus d'achat
    const { data: bonuses, error: bonusError } = await supabase
      .from('purchase_bonuses')
      .select('*')
      .order('pack_credits', { ascending: true })

    if (configError) throw configError
    if (bonusError) throw bonusError

    return NextResponse.json({
      success: true,
      configs: configs || [],
      purchase_bonuses: bonuses || []
    })
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH - Mettre à jour une config
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
    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: 'Clé de config requise' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('app_config')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, config: data })
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
