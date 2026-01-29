import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Ressource } from '@/lib/types'

/**
 * POST /api/webhooks/check-alerts
 *
 * Appelé par le trigger PostgreSQL via pg_net quand une ressource est publiée.
 * Compare la ressource aux alertes sauvegardées et crée des notifications.
 *
 * Body: { ressource_id: string }
 * Headers: Authorization: Bearer <WEBHOOK_SECRET>
 */
export async function POST(request: Request) {
  // Vérifie le secret webhook
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.WEBHOOK_SECRET

  if (!expectedSecret) {
    console.error('WEBHOOK_SECRET non configuré')
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await request.json()
  const { ressource_id } = body

  if (!ressource_id) {
    return NextResponse.json({ error: 'ressource_id requis' }, { status: 400 })
  }

  // Crée un client Supabase avec service role pour bypass RLS
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Pas besoin de set cookies pour service role
        },
      },
    }
  )

  // Récupère la ressource publiée
  const { data: ressource, error: ressourceError } = await supabase
    .from('ressources')
    .select('*')
    .eq('id', ressource_id)
    .single()

  if (ressourceError || !ressource) {
    console.error('Ressource non trouvée:', ressource_id)
    return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })
  }

  // Récupère toutes les alertes actives
  const { data: alerts, error: alertsError } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('is_active', true)

  if (alertsError) {
    console.error('Erreur récupération alertes:', alertsError)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  if (!alerts || alerts.length === 0) {
    return NextResponse.json({ matched: 0 })
  }

  // Pour chaque alerte, vérifie si la ressource correspond
  const notifications: Array<{
    user_id: string
    type: string
    title: string
    message: string
    ressource_id: string
    saved_search_id: string
  }> = []

  for (const alert of alerts) {
    const filters = alert.filters as Record<string, unknown>

    if (matchesFilters(ressource, filters)) {
      notifications.push({
        user_id: alert.user_id,
        type: 'search_match',
        title: `Nouvelle ressource : "${ressource.title}"`,
        message: `Correspond à votre alerte "${alert.name}"`,
        ressource_id: ressource.id,
        saved_search_id: alert.id,
      })
    }
  }

  // Insère les notifications en batch
  if (notifications.length > 0) {
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (insertError) {
      console.error('Erreur insertion notifications:', insertError)
      return NextResponse.json({ error: 'Erreur insertion' }, { status: 500 })
    }

    // Met à jour last_checked_at pour les alertes matchées
    const matchedAlertIds = notifications.map(n => n.saved_search_id)
    await supabase
      .from('saved_searches')
      .update({ last_checked_at: new Date().toISOString() })
      .in('id', matchedAlertIds)
  }

  return NextResponse.json({ matched: notifications.length })
}

/**
 * Vérifie si une ressource correspond aux filtres d'une alerte
 *
 * Le matching est "inclusif" : si un filtre est défini, la ressource
 * doit correspondre. Si le filtre est vide/null, il est ignoré.
 */
function matchesFilters(ressource: Ressource, filters: Record<string, unknown>): boolean {
  // Catégories (OR logic)
  const categories = filters.categories as string[] | undefined
  if (categories && categories.length > 0) {
    const ressourceCategories = ressource.categories || []
    const hasMatchingCategory = categories.some(cat =>
      ressourceCategories.includes(cat)
    )
    if (!hasMatchingCategory) return false
  }

  // Âge (range check)
  const ageMin = filters.ageMin as number | null
  const ageMax = filters.ageMax as number | null

  if (ageMin !== null && ageMin !== undefined) {
    // La ressource doit avoir un age_max >= ageMin (chevauchement possible)
    if (ressource.age_max !== null && ressource.age_max < ageMin) {
      return false
    }
  }

  if (ageMax !== null && ageMax !== undefined) {
    // La ressource doit avoir un age_min <= ageMax (chevauchement possible)
    if (ressource.age_min !== null && ressource.age_min > ageMax) {
      return false
    }
  }

  // Thèmes (OR logic)
  const themes = filters.themes as string[] | undefined
  if (themes && themes.length > 0) {
    const ressourceThemes = ressource.themes || []
    const hasMatchingTheme = themes.some(theme =>
      ressourceThemes.includes(theme)
    )
    if (!hasMatchingTheme) return false
  }

  // Compétences (OR logic)
  const competences = filters.competences as string[] | undefined
  if (competences && competences.length > 0) {
    const ressourceCompetences = ressource.competences || []
    const hasMatchingCompetence = competences.some(comp =>
      ressourceCompetences.includes(comp)
    )
    if (!hasMatchingCompetence) return false
  }

  // Difficulté
  const difficulty = filters.difficulty as string | null
  if (difficulty) {
    if (ressource.difficulte !== difficulty) return false
  }

  // Gratuit/Payant
  const isFree = filters.isFree as boolean | null
  if (isFree !== null && isFree !== undefined) {
    const ressourceIsFree = !ressource.is_premium || (ressource.price_credits === 0)
    if (isFree !== ressourceIsFree) return false
  }

  // Durée max
  const duration = filters.duration as number | null
  if (duration !== null && duration !== undefined) {
    if (ressource.duration !== null && ressource.duration > duration) {
      return false
    }
  }

  // Autonomie
  const autonomy = filters.autonomy as boolean | null
  if (autonomy !== null && autonomy !== undefined) {
    if (ressource.autonomie !== autonomy) return false
  }

  // Créateur spécifique
  const creatorSlug = filters.creatorSlug as string | null
  if (creatorSlug) {
    // Pour matcher le créateur, il faudrait joindre la table creators
    // Simplifié ici : on ignore ce filtre pour les alertes
  }

  // Type de ressource
  const types = filters.types as string[] | undefined
  if (types && types.length > 0) {
    if (!types.includes(ressource.type)) return false
  }

  // Si tous les filtres passent, la ressource correspond
  return true
}
