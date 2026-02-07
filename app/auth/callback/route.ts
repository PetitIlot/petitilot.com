import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const lang = requestUrl.searchParams.get('lang') || 'fr'

  // Handle OAuth error (user refused or cancelled)
  const error = requestUrl.searchParams.get('error')
  if (error) {
    return NextResponse.redirect(new URL(`/${lang}/connexion?error=oauth_cancelled`, request.url))
  }

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    // Handle session exchange error
    if (exchangeError) {
      console.error('OAuth session exchange error:', exchangeError.message)
      return NextResponse.redirect(new URL(`/${lang}/connexion?error=session_failed`, request.url))
    }

    // Accorder le bonus d'inscription si c'est un nouvel utilisateur
    if (sessionData?.user) {
      try {
        const { data: bonusResult, error: bonusError } = await supabase.rpc('grant_registration_bonus', {
          p_user_id: sessionData.user.id
        })

        if (bonusError) {
          console.error('Registration bonus error:', bonusError)
        } else if (bonusResult?.credits_added > 0) {
          console.log(`Granted ${bonusResult.credits_added} registration bonus credits to user ${sessionData.user.id}`)
        }
      } catch (err) {
        console.error('Error granting registration bonus:', err)
      }
    }
  }

  return NextResponse.redirect(new URL(`/${lang}/profil`, request.url))
}
