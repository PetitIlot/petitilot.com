'use client'

import { useRef, useEffect, useState } from 'react'
import type { Ressource, Language } from '@/lib/types'
import FeaturedCarouselCard from './FeaturedCarouselCard'


type DemoResource = Partial<Ressource> & {
  creator?: { id: string; slug: string; display_name: string; avatar_url: string | null } | null
  subtitle?: string
}

// Données de démonstration pour prévisualiser le carrousel
const demoResources: DemoResource[] = [
  {
    id: 'demo-1',
    title: 'Peinture sensorielle aux légumes',
    subtitle: 'Une activité créative et naturelle pour explorer les couleurs',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=800&fit=crop',
    categories: ['sensoriel', 'art-plastique'],
    themes: ['Nature', 'Printemps'],
    competences: ['Créativité'],
    age_min: 2, age_max: 6, duration: 30, difficulte: 'beginner',
    is_premium: false, accept_free_credits: true,
    creator: { id: 'c1', slug: 'marie-nature', display_name: 'Marie Nature', avatar_url: null } as any,
  },
  {
    id: 'demo-2',
    title: 'Parcours moteur en forêt',
    subtitle: 'Développer l\'équilibre et la coordination en pleine nature',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1200&h=800&fit=crop',
    categories: ['motricite-globale', 'nature-plein-air'],
    themes: ['Forêt', 'Nature'],
    competences: ['Coordination'],
    age_min: 3, age_max: 6, duration: 45, difficulte: 'beginner',
    is_premium: true, accept_free_credits: true,
    creator: { id: 'c2', slug: 'julie-bois', display_name: 'Julie & les Bois', avatar_url: null } as any,
  },
  {
    id: 'demo-3',
    title: 'Recettes de pâtes à modeler maison',
    subtitle: 'Créez vos propres pâtes à modeler non toxiques',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1200&h=800&fit=crop',
    categories: ['diy-recup', 'sensoriel'],
    themes: ['Maison'],
    competences: ['Motricité fine'],
    age_min: 1, age_max: 4, duration: 20, difficulte: 'beginner',
    is_premium: false, accept_free_credits: false,
  },
  {
    id: 'demo-4',
    title: 'Éveil musical avec instruments DIY',
    subtitle: 'Fabriquez des instruments avec des objets du quotidien',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop',
    categories: ['diy-recup', 'art-plastique'],
    themes: ['Musique'],
    competences: ['Créativité'],
    age_min: 2, age_max: 5, duration: 40, difficulte: 'advanced',
    is_premium: true, accept_free_credits: false,
    creator: { id: 'c3', slug: 'lea-diy', display_name: 'Léa DIY', avatar_url: null } as any,
  },
  {
    id: 'demo-5',
    title: 'Jeux d\'eau pour l\'été',
    subtitle: 'Des activités rafraîchissantes pour les journées chaudes',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1473492201326-7c01dd2e596b?w=1200&h=800&fit=crop',
    categories: ['sensoriel', 'motricite-globale'],
    themes: ['Été', 'Nature'],
    competences: ['Coordination'],
    age_min: 2, age_max: 6, duration: 30, difficulte: 'beginner',
    is_premium: false, accept_free_credits: true,
  },
  {
    id: 'demo-6',
    title: 'Jardinage avec les tout-petits',
    subtitle: 'Plantez, arrosez et observez la nature grandir ensemble',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop',
    categories: ['nature-plein-air', 'cuisine'],
    themes: ['Jardin & plantes', 'Nature'],
    competences: ['Observation'],
    age_min: 2, age_max: 5, duration: 60, difficulte: 'beginner',
    is_premium: false, accept_free_credits: false,
    creator: { id: 'c1', slug: 'marie-nature', display_name: 'Marie Nature', avatar_url: null } as any,
  },
  {
    id: 'demo-7',
    title: 'Yoga enfant en famille',
    subtitle: 'Des postures amusantes pour se détendre et bouger',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop',
    categories: ['motricite-globale'],
    themes: ['Corps humain', 'Famille'],
    competences: ['Équilibre'],
    age_min: 3, age_max: 6, duration: 30, difficulte: 'beginner',
    is_premium: true, accept_free_credits: true,
  },
  {
    id: 'demo-8',
    title: 'Cuisine zéro déchet',
    subtitle: 'Recettes saines et écologiques pour toute la famille',
    type: 'alimentation',
    vignette_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=800&fit=crop',
    categories: ['cuisine', 'diy-recup'],
    themes: ['Alimentation', 'Maison'],
    competences: ['Autonomie'],
    age_min: 3, age_max: 6, duration: 45, difficulte: 'advanced',
    is_premium: false, accept_free_credits: false,
    creator: { id: 'c4', slug: 'sophie-cuisine', display_name: 'Sophie Cuisine', avatar_url: null } as any,
  },
  {
    id: 'demo-9',
    title: 'Chasse au trésor nature',
    subtitle: 'Explorez le jardin ou le parc avec une mission ludique',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&h=800&fit=crop',
    categories: ['nature-plein-air', 'jeux-symboliques'],
    themes: ['Forêt', 'Animaux'],
    competences: ['Observation'],
    age_min: 3, age_max: 6, duration: 60, difficulte: 'advanced',
    is_premium: false, accept_free_credits: true,
  },
  {
    id: 'demo-10',
    title: 'Bacs sensoriels thématiques',
    subtitle: 'Créez des univers tactiles pour stimuler les sens',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&h=800&fit=crop',
    categories: ['sensoriel', 'motricite-fine'],
    themes: ['Nature'],
    competences: ['Concentration'],
    age_min: 1, age_max: 4, duration: 20, difficulte: 'beginner',
    is_premium: false, accept_free_credits: false,
    creator: { id: 'c2', slug: 'julie-bois', display_name: 'Julie & les Bois', avatar_url: null } as any,
  },
  {
    id: 'demo-11',
    title: 'Collations créatives',
    subtitle: 'Transformez les fruits en animaux rigolos',
    type: 'alimentation',
    vignette_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=800&fit=crop',
    categories: ['cuisine', 'art-plastique'],
    themes: ['Alimentation', 'Animaux'],
    competences: ['Créativité'],
    age_min: 2, age_max: 6, duration: 25, difficulte: 'beginner',
    is_premium: true, accept_free_credits: true,
    creator: { id: 'c4', slug: 'sophie-cuisine', display_name: 'Sophie Cuisine', avatar_url: null } as any,
  },
  {
    id: 'demo-12',
    title: 'Construction en carton',
    subtitle: 'Recyclez les boîtes pour créer des mondes imaginaires',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    categories: ['diy-recup', 'jeux-symboliques'],
    themes: ['Maison', 'Contes & Histoires'],
    competences: ['Créativité'],
    age_min: 3, age_max: 6, duration: 50, difficulte: 'advanced',
    is_premium: false, accept_free_credits: false,
    creator: { id: 'c3', slug: 'lea-diy', display_name: 'Léa DIY', avatar_url: null } as any,
  },
  {
    id: 'demo-13',
    title: 'Motricité fine avec pinces',
    subtitle: 'Exercices ludiques pour développer la dextérité',
    type: 'motricite',
    vignette_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
    categories: ['motricite-fine'],
    themes: ['École'],
    competences: ['Motricité fine'],
    age_min: 2, age_max: 5, duration: 15, difficulte: 'beginner',
    is_premium: false, accept_free_credits: true,
  },
  {
    id: 'demo-14',
    title: 'Land Art en famille',
    subtitle: 'Créez des œuvres éphémères avec des éléments naturels',
    type: 'activite',
    vignette_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=800&fit=crop',
    categories: ['nature-plein-air', 'art-plastique'],
    themes: ['Nature', 'Forêt'],
    competences: ['Créativité'],
    age_min: 3, age_max: 6, duration: 45, difficulte: 'beginner',
    is_premium: true, accept_free_credits: false,
    creator: { id: 'c1', slug: 'marie-nature', display_name: 'Marie Nature', avatar_url: null } as any,
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

  // Utiliser les données de démo si pas assez de ressources réelles
  const displayResources = resources.length >= 3 ? resources : (showDemo ? demoResources as unknown as Ressource[] : resources)

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

  // Dupliquer les ressources pour créer un défilement infini
  const duplicatedFirstRow = [...firstRow, ...firstRow]
  const duplicatedSecondRow = [...secondRow, ...secondRow]

  return (
    <section className="relative bg-background dark:bg-background-dark overflow-hidden">
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
              <FeaturedCarouselCard
                activity={resource}
                lang={lang}
                variant="large"
              />
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
              <FeaturedCarouselCard
                activity={resource}
                lang={lang}
                variant="small"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
