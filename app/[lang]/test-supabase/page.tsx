import { getRessources, countRessources } from '@/lib/supabase-queries'

import type { Language } from '@/lib/types'

export default async function TestSupabasePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const currentLang = lang as Language

  // Test 1: Compter les ressources
  const totalActivites = await countRessources('activite', currentLang)
  const totalMotricite = await countRessources('motricite', currentLang)
  const totalAlimentation = await countRessources('alimentation', currentLang)

  // Test 2: Récupérer quelques ressources
  const activites = await getRessources('activite', currentLang, { limit: 5 })

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brown mb-8">
          Test Connexion Supabase
        </h1>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brown mb-4">
            Statistiques (Langue: {lang.toUpperCase()})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-sage/10 p-4 rounded-lg">
              <p className="text-sm text-brown/60">Activités</p>
              <p className="text-3xl font-bold text-sage">{totalActivites}</p>
            </div>
            <div className="bg-sage/10 p-4 rounded-lg">
              <p className="text-sm text-brown/60">Motricité</p>
              <p className="text-3xl font-bold text-sage">{totalMotricite}</p>
            </div>
            <div className="bg-terracotta/10 p-4 rounded-lg">
              <p className="text-sm text-brown/60">Recettes</p>
              <p className="text-3xl font-bold text-terracotta">{totalAlimentation}</p>
            </div>
          </div>
        </div>

        {/* Activités */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-brown mb-4">
            Dernières Activités ({activites.length})
          </h2>
          {activites.length > 0 ? (
            <ul className="space-y-2">
              {activites.map((act) => (
                <li key={act.id} className="border-l-4 border-sage pl-4 py-2">
                  <p className="font-semibold text-brown">{act.title}</p>
                  <p className="text-sm text-brown/60">
                    Type: {act.type} | Âge: {act.age_min}-{act.age_max} ans
                  </p>
                  {act.themes && (
                    <p className="text-xs text-brown/50">
                      Thèmes: {act.themes.join(', ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown/60">Aucune activité trouvée</p>
          )}
        </div>

        {/* Status de connexion */}
        <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-semibold">
            ✅ Connexion Supabase réussie !
          </p>
          <p className="text-sm text-green-700 mt-1">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>
      </div>
    </div>
  )
}
