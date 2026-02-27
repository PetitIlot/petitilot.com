import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const { email, lang } = body

  // Validation basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim(), lang: lang || 'fr' })

  if (error) {
    if (error.code === '23505') {
      // Email déjà inscrit — on retourne succès quand même (pas d'info leak)
      return NextResponse.json({ success: true })
    }
    console.error('[waitlist]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
