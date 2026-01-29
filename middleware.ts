import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const locales = ['fr', 'en', 'es']
const defaultLocale = 'fr'

// Routes protégées par rôle
const protectedRoutes = {
  creator: ['/createur'],
  admin: ['/admin'],
  authenticated: ['/profil'] // Nécessite connexion mais pas de rôle spécifique
}

// Mode maintenance : si true, le site est protégé par code secret
const MAINTENANCE_MODE = true

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/coming-soon') ||
    pathname.includes('.') // fichiers statiques
  ) {
    return NextResponse.next()
  }

  // === MAINTENANCE MODE ===
  // Redirect root to coming-soon
  if (MAINTENANCE_MODE && pathname === '/') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  // Check if site access is granted (cookie from secret code)
  if (MAINTENANCE_MODE) {
    const hasAccess = request.cookies.get('site_access')?.value === 'granted'

    if (!hasAccess) {
      // Redirect to coming-soon if no access
      return NextResponse.redirect(new URL('/coming-soon', request.url))
    }
  }
  // === END MAINTENANCE MODE ===

  // Extraire la locale du path
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Redirect si pas de locale
  if (!pathnameLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    )
  }

  // Chemin sans la locale pour vérifier les routes protégées
  const pathWithoutLocale = pathname.replace(`/${pathnameLocale}`, '') || '/'

  // Vérifier si c'est une route protégée
  const isCreatorRoute = protectedRoutes.creator.some(route => pathWithoutLocale.startsWith(route))
  const isAdminRoute = protectedRoutes.admin.some(route => pathWithoutLocale.startsWith(route))
  const isAuthenticatedRoute = protectedRoutes.authenticated.some(route => pathWithoutLocale.startsWith(route))

  // Si route protégée, vérifier l'authentification
  if (isCreatorRoute || isAdminRoute || isAuthenticatedRoute) {
    // Créer client Supabase pour le middleware
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Vérifier session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      // Rediriger vers connexion
      const loginUrl = new URL(`/${pathnameLocale}/connexion`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Vérifier rôle si nécessaire
    if (isCreatorRoute || isAdminRoute) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const userRole = profile?.role || 'buyer'

      // Vérifier accès créateur
      if (isCreatorRoute && userRole !== 'creator' && userRole !== 'admin') {
        // Vérifier si créateur en attente d'approbation
        const { data: creator } = await supabase
          .from('creators')
          .select('is_approved')
          .eq('user_id', user.id)
          .single()

        if (creator && !creator.is_approved) {
          // Rediriger vers page "en attente d'approbation"
          return NextResponse.redirect(
            new URL(`/${pathnameLocale}/createur/en-attente`, request.url)
          )
        }

        // Pas créateur du tout, rediriger vers page devenir créateur
        return NextResponse.redirect(
          new URL(`/${pathnameLocale}/devenir-createur`, request.url)
        )
      }

      // Vérifier accès admin
      if (isAdminRoute && userRole !== 'admin') {
        // Rediriger vers accueil (pas autorisé)
        return NextResponse.redirect(
          new URL(`/${pathnameLocale}`, request.url)
        )
      }
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
}
