import { getRessources } from '@/lib/supabase-queries'
import type { Language } from '@/lib/types'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import ResourcesSection from '@/components/home/ResourcesSection'
import ActivitiesGrid from '@/components/home/ActivitiesGrid'

const translations = {
  fr: {
    latestResources: "S'amuser et grandir : nos dernières activités d'éveil",
    latestBooksGames: 'Derniers livres & jeux'
  },
  en: {
    latestResources: 'Learn through play: our latest activities',
    latestBooksGames: 'Latest books & games'
  },
  es: {
    latestResources: 'Aprender jugando: nuestras últimas actividades',
    latestBooksGames: 'Últimos libros y juegos'
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const currentLang = lang as Language

  // Ressources mises en avant pour le carrousel (les plus récentes)
  const featuredResources = await getRessources(
    ['activite', 'motricite', 'alimentation'],
    currentLang,
    { limit: 5 }
  )

  const latestResources = await getRessources(
    ['activite', 'motricite', 'alimentation'],
    currentLang,
    { limit: 6 }
  )

  // MASQUÉ TEMPORAIREMENT - Droits d'auteur à clarifier
  // const latestBooksGames = await getRessources(
  //   ['livre', 'jeu'],
  //   currentLang,
  //   { limit: 6 }
  // )

  const t = translations[currentLang] || translations.fr

  return (
    <div>
      <HeroSection lang={currentLang} />
      <FeaturedCarousel resources={featuredResources} lang={currentLang} />
      <ResourcesSection lang={currentLang} />

      {/* Dernières ressources */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-foreground mb-12">
            {t.latestResources}
          </h2>
          <ActivitiesGrid activities={latestResources} lang={currentLang} />
        </div>
      </section>

      {/* MASQUÉ TEMPORAIREMENT - Droits d'auteur à clarifier
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-foreground mb-12">
            {t.latestBooksGames}
          </h2>
          <ActivitiesGrid activities={latestBooksGames} lang={currentLang} />
        </div>
      </section>
      */}
    </div>
  )
}
