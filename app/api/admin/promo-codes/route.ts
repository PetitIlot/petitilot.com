import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Liste tous les codes promo
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

    // Récupérer les codes promo avec stats
    const { data: codes, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, codes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau code promo
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
      code,
      free_credits,
      max_uses,
      allow_multiple_per_user,
      expires_at,
      description
    } = body

    if (!code || !free_credits) {
      return NextResponse.json({ error: 'Code et crédits requis' }, { status: 400 })
    }

    // Créer le code
    const { data: newCode, error } = await supabase
      .from('promo_codes')
      .insert({
        code: code.toUpperCase().trim(),
        free_credits,
        max_uses: max_uses || null,
        allow_multiple_per_user: allow_multiple_per_user || false,
        expires_at: expires_at || null,
        description: description || null,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 })
      }
      throw error
    }

    return NextResponse.json({ success: true, code: newCode })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
