import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const lang = requestUrl.searchParams.get('lang') || 'fr'
  const redirectTo = requestUrl.searchParams.get('redirect')

  // Handle OAuth error (user refused or cancelled)
  const error = requestUrl.searchParams.get('error')
  if (error) {
    return NextResponse.redirect(new URL(`/${lang}/connexion?error=oauth_cancelled`, request.url))
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    // Handle session exchange error
    if (exchangeError) {
      console.error('OAuth session exchange error:', exchangeError.message)
      return NextResponse.redirect(new URL(`/${lang}/connexion?error=session_failed`, request.url))
    }
  }

  const successUrl = redirectTo || `/${lang}/profil`
  return NextResponse.redirect(new URL(successUrl, request.url))
}
