'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Ressource, Language } from '@/lib/types'

const translations = {
  fr: {
    featured: 'À découvrir',
    discover: 'Découvrir',
    new: 'Nouveau',
  },
  en: {
    featured: 'Featured',
    discover: 'Discover',
    new: 'New',
  },
  es: {
    featured: 'Destacado',
    discover: 'Descubrir',
    new: 'Nuevo',
  },
}

const categoryLabels: Record<string, Record<Language, string>> = {
  activite: { fr: 'Activité', en: 'Activity', es: 'Actividad' },
  motricite: { fr: 'Motricité', en: 'Motor skills', es: 'Motricidad' },
  alimentation: { fr: 'Alimentation', en: 'Food', es: 'Alimentación' },
}

// Données de démonstration pour prévisualiser le carrousel
const demoResources: Partial<Ressource>[] = [
  {
    id: 'demo-1',
    title: 'Peinture sensorielle aux légumes',
    subtitle: 'Une activité créative et naturelle pour explorer les couleurs',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-2',
    title: 'Parcours moteur en forêt',
    subtitle: 'Développer l\'équilibre et la coordination en pleine nature',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-3',
    title: 'Recettes de pâtes à modeler maison',
    subtitle: 'Créez vos propres pâtes à modeler non toxiques',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-4',
    title: 'Éveil musical avec instruments DIY',
    subtitle: 'Fabriquez des instruments avec des objets du quotidien',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-5',
    title: 'Jeux d\'eau pour l\'été',
    subtitle: 'Des activités rafraîchissantes pour les journées chaudes',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1473492201326-7c01dd2e596b?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-6',
    title: 'Jardinage avec les tout-petits',
    subtitle: 'Plantez, arrosez et observez la nature grandir ensemble',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-7',
    title: 'Yoga enfant en famille',
    subtitle: 'Des postures amusantes pour se détendre et bouger',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-8',
    title: 'Cuisine zéro déchet',
    subtitle: 'Recettes saines et écologiques pour toute la famille',
    type: 'alimentation',
    vignette_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-9',
    title: 'Chasse au trésor nature',
    subtitle: 'Explorez le jardin ou le parc avec une mission ludique',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-10',
    title: 'Bacs sensoriels thématiques',
    subtitle: 'Créez des univers tactiles pour stimuler les sens',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-11',
    title: 'Collations créatives',
    subtitle: 'Transformez les fruits en animaux rigolos',
    type: 'alimentation',
    vignette_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-12',
    title: 'Construction en carton',
    subtitle: 'Recyclez les boîtes pour créer des mondes imaginaires',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-13',
    title: 'Motricité fine avec pinces',
    subtitle: 'Exercices ludiques pour développer la dextérité',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
  },
  {
    id: 'demo-14',
    title: 'Land Art en famille',
    subtitle: 'Créez des œuvres éphémères avec des éléments naturels',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=800&fit=crop',
  },
]

interface FeaturedCarouselProps {
  resources: Ressource[]
  lang: Language
  showDemo?: boolean
}

export default function FeaturedCarousel({ resources, lang, showDemo = true }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const [isPaused1, setIsPaused1] = useState(false)
  const [isPaused2, setIsPaused2] = useState(false)
  const t = translations[lang]

  // Utiliser les données de démo si pas assez de ressources réelles
  const displayResources = resources.length >= 3 ? resources : (showDemo ? demoResources as Ressource[] : resources)

  // Reprendre l'animation après un délai d'inactivité
  useEffect(() => {
    if (isPaused1) {
      const timer = setTimeout(() => setIsPaused1(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPaused1])

  useEffect(() => {
    if (isPaused2) {
      const timer = setTimeout(() => setIsPaused2(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPaused2])

  const handleInteraction1 = () => setIsPaused1(true)
  const handleInteraction2 = () => setIsPaused2(true)

  if (displayResources.length === 0) return null

  // Séparer les ressources en deux lignes
  const firstRow = displayResources.slice(0, Math.ceil(displayResources.length / 2))
  const secondRow = displayResources.slice(Math.ceil(displayResources.length / 2))

  const renderCard = (resource: Ressource, index: number, isSmall = false) => (
    <Link
      href={resource.id.startsWith('demo-') ? '#' : `/${lang}/activites/${resource.id}`}
      className="group flex-shrink-0"
    >
      <div
        className="relative overflow-hidden transition-all duration-500 group-hover:brightness-110"
        style={{
          width: isSmall ? '40vw' : '80vw',
          maxWidth: isSmall ? '450px' : '900px',
          height: isSmall ? '200px' : '350px'
        }}
      >
        {/* Background Image */}
        {resource.vignette_url ? (
          <img
            src={resource.vignette_url}
            alt={resource.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sage to-mauve" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
              {categoryLabels[resource.type]?.[lang] || resource.type}
            </span>
            {index === 0 && !isSmall && (
              <span className="px-2 py-0.5 rounded-full bg-sage text-white text-xs font-medium">
                {t.new}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white leading-tight ${isSmall ? 'text-lg md:text-xl' : 'text-xl md:text-2xl mb-1'}`}>
            {resource.title}
          </h3>

          {/* Subtitle - only on large cards */}
          {!isSmall && resource.subtitle && (
            <p className="text-white/80 text-sm mb-4 line-clamp-1 max-w-lg">
              {resource.subtitle}
            </p>
          )}

          {/* CTA Button - only on large cards */}
          {!isSmall && (
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 text-black text-sm font-semibold hover:bg-white transition-colors duration-200">
                {t.discover}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )

  // Dupliquer les ressources pour créer un défilement infini
  const duplicatedFirstRow = [...firstRow, ...firstRow]
  const duplicatedSecondRow = [...secondRow, ...secondRow]

  return (
    <section className="relative bg-background overflow-hidden">
      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-right {
          animation: scrollRight 180s linear infinite;
        }
        .animate-scroll-left {
          animation: scrollLeft 240s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* First Row - Larger cards - Scrolling right */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleInteraction1}
        onMouseEnter={handleInteraction1}
        onTouchStart={handleInteraction1}
      >
        <div
          ref={scrollRef}
          className={`flex gap-1 animate-scroll-right ${isPaused1 ? 'paused' : ''}`}
          style={{ width: 'fit-content' }}
        >
          {duplicatedFirstRow.map((resource, index) => (
            <div key={`first-${index}`}>
              {renderCard(resource, index % firstRow.length, false)}
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Smaller cards - Scrolling left */}
      <div
        className="overflow-x-auto mt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleInteraction2}
        onMouseEnter={handleInteraction2}
        onTouchStart={handleInteraction2}
      >
        <div
          ref={scrollRef2}
          className={`flex gap-1 animate-scroll-left ${isPaused2 ? 'paused' : ''}`}
          style={{ width: 'fit-content' }}
        >
          {duplicatedSecondRow.map((resource, index) => (
            <div key={`second-${index}`}>
              {renderCard(resource, index % secondRow.length, true)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
