import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * GET /api/alerts
 * Récupère les recherches sauvegardées de l'utilisateur
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur récupération alertes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ alerts: data })
}

/**
 * POST /api/alerts
 * Crée une nouvelle alerte (recherche sauvegardée)
 * Body: { name: string, filters: FilterState }
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const { name, filters } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  }

  if (!filters || typeof filters !== 'object') {
    return NextResponse.json({ error: 'Filtres requis' }, { status: 400 })
  }

  // Limite à 10 alertes par utilisateur
  const { count } = await supabase
    .from('saved_searches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count >= 10) {
    return NextResponse.json(
      { error: 'Limite de 10 alertes atteinte' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: user.id,
      name: name.trim(),
      filters,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur création alerte:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ alert: data }, { status: 201 })
}
