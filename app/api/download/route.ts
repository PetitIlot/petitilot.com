import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ressourceId = request.nextUrl.searchParams.get('ressource_id')

  if (!ressourceId) {
    return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Client admin pour le storage (bypass RLS)
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: ressource } = await supabase
    .from('ressources')
    .select('pdf_url, price_credits')
    .eq('id', ressourceId)
    .single()

  if (!ressource?.pdf_url) {
    return NextResponse.json({ error: 'PDF non disponible' }, { status: 404 })
  }

  // Si payant, vérifier l'achat
  if (ressource.price_credits > 0) {
    const { data: hasPurchased } = await supabase.rpc('has_purchased_ressource', {
      p_user_id: user.id,
      p_ressource_id: ressourceId
    })

    if (!hasPurchased) {
      return NextResponse.json({ error: 'Ressource non achetée' }, { status: 403 })
    }
  }

  const url = ressource.pdf_url

  // URL Supabase Storage
  if (url.includes('/storage/v1/object/')) {
    const match = url.match(/\/storage\/v1\/object\/(?:sign|public)\/([^?]+)/)
    if (match) {
      const parts = match[1].split('/')
      const bucket = parts[0]
      const filePath = parts.slice(1).join('/')

      const { data: signedUrl, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600)

      if (error || !signedUrl) {
        return NextResponse.json({ error: 'Erreur génération URL' }, { status: 500 })
      }

      return NextResponse.json({ url: signedUrl.signedUrl })
    }
  }

  // URL externe (Cloudinary, etc.)
  if (url.startsWith('http') && !url.includes('supabase.co')) {
    return NextResponse.json({ url })
  }

  return NextResponse.json({ error: 'Format URL non supporté' }, { status: 400 })
}
