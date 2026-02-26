import { getRessources } from '@/lib/supabase-queries'
import type { Language } from '@/lib/types'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import ResourcesSection from '@/components/home/ResourcesSection'
import ActivitiesCarousel from '@/components/home/ActivitiesCarousel'
import WhyCreatorsSection from '@/components/home/WhyCreatorsSection'
import CreatorsCarousel from '@/components/home/CreatorsCarousel'

const translations = {
  fr: { latestResources: "Nos dernières activités d'éveil" },
  en: { latestResources: 'Our latest activities' },
  es: { latestResources: 'Nuestras últimas actividades' }
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
    { limit: 10 }
  )

  const t = translations[currentLang] || translations.fr

  return (
    <div>
      {/* 1. Hero */}
      <HeroSection lang={currentLang} />

      {/* 2. Carousel infinite 2 lignes — no change */}
      <FeaturedCarousel resources={featuredResources} lang={currentLang} />

      {/* 3. Pourquoi Petit Îlot — bento parents (facilité & qualité) */}
      <ResourcesSection lang={currentLang} />

      {/* 4. Dernières activités — 1 ligne, cartes resserrées */}
      <ActivitiesCarousel
        activities={latestResources}
        lang={currentLang}
        title={t.latestResources}
      />

      {/* 5. Pourquoi être créateur — bento aéré + preview dashboard */}
      <WhyCreatorsSection lang={currentLang} />

      {/* 6. Carousel créateurs */}
      <CreatorsCarousel lang={currentLang} />
    </div>
  )
}
