'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language } from '@/lib/types'
import ActivityCard from '@/components/cards/ActivityCard'

const DEMO_ACTIVITIES: Ressource[] = [
  {
    id: 'recent-1', group_id: 'g1', lang: 'fr', type: 'activite',
    title: 'Peinture avec les doigts aux aquarelles',
    subtitle: 'Explorer les couleurs et les textures en toute liberté',
    vignette_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    categories: ['sensoriel', 'art-plastique'],
    themes: ['Nature', 'Printemps'],
    competences: ['Créativité'],
    age_min: 2, age_max: 5, duration: 25, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: false, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-2', group_id: 'g2', lang: 'fr', type: 'motricite',
    title: 'Circuit d\'équilibre en intérieur',
    vignette_url: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&h=600&fit=crop',
    categories: ['motricite-globale'],
    themes: ['Maison', 'Corps humain'],
    competences: ['Équilibre', 'Coordination'],
    age_min: 3, age_max: 6, duration: 30, duration_max: 45, duration_prep: 10,
    difficulte: 'beginner', autonomie: true, intensity: 'moyen',
    is_premium: false, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-3', group_id: 'g3', lang: 'fr', type: 'alimentation',
    title: 'Mini-pizzas aux légumes du jardin',
    vignette_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    categories: ['cuisine'],
    themes: ['Alimentation', 'Jardin & plantes'],
    competences: ['Autonomie'],
    age_min: 3, age_max: 6, duration: 40, duration_max: null, duration_prep: 15,
    difficulte: 'advanced', autonomie: false, intensity: 'leger',
    is_premium: true, accept_free_credits: true,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-4', group_id: 'g4', lang: 'fr', type: 'activite',
    title: 'Bac sensoriel forêt enchantée',
    vignette_url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop',
    categories: ['sensoriel', 'jeux-symboliques'],
    themes: ['Forêt', 'Animaux'],
    competences: ['Concentration'],
    age_min: 1, age_max: 4, duration: 20, duration_max: null, duration_prep: 15,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-5', group_id: 'g5', lang: 'fr', type: 'activite',
    title: 'Récup créative : robots en carton',
    vignette_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    categories: ['diy-recup', 'art-plastique'],
    themes: ['Maison', 'Contes & Histoires'],
    competences: ['Créativité'],
    age_min: 3, age_max: 6, duration: 50, duration_max: null, duration_prep: 10,
    difficulte: 'advanced', autonomie: false, intensity: 'leger',
    is_premium: true, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-6', group_id: 'g6', lang: 'fr', type: 'motricite',
    title: 'Danse des animaux de la forêt',
    vignette_url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&h=600&fit=crop',
    categories: ['motricite-globale', 'jeux-symboliques'],
    themes: ['Animaux', 'Musique'],
    competences: ['Coordination'],
    age_min: 2, age_max: 5, duration: 20, duration_max: null, duration_prep: 0,
    difficulte: 'beginner', autonomie: true, intensity: 'moyen',
    is_premium: false, accept_free_credits: true,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-7', group_id: 'g7', lang: 'fr', type: 'activite',
    title: 'Impressions nature avec feuilles',
    vignette_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
    categories: ['nature-plein-air', 'art-plastique'],
    themes: ['Nature', 'Automne'],
    competences: ['Observation'],
    age_min: 2, age_max: 6, duration: 30, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: false, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
  {
    id: 'recent-8', group_id: 'g8', lang: 'fr', type: 'activite',
    title: 'Tri et classement de graines',
    vignette_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    categories: ['motricite-fine', 'sensoriel'],
    themes: ['Jardin & plantes', 'Météo'],
    competences: ['Motricité fine', 'Concentration'],
    age_min: 2, age_max: 5, duration: 15, duration_max: null, duration_prep: 5,
    difficulte: 'beginner', autonomie: true, intensity: 'leger',
    is_premium: false, accept_free_credits: false,
    description: null, astuces: null, materiel: null,
    images_urls: null, gallery_urls: null, video_url: null, pdf_url: null,
    materiel_json: null, auteur: null, editeur: null, annee: null,
    illustrateur: null, isbn: null, collection: null,
    nb_joueurs_min: null, nb_joueurs_max: null,
  } as Ressource,
]

interface ActivitiesCarouselProps {
  activities: Ressource[]
  lang: Language
  title?: string
}

export default function ActivitiesCarousel({ activities, lang, title }: ActivitiesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 336 : -336, behavior: 'smooth' })
  }

  const displayActivities = activities.length > 0 ? activities : DEMO_ACTIVITIES

  if (!displayActivities.length) return null

  const defaultTitle = lang === 'fr'
    ? "Nos dernières activités"
    : lang === 'es'
    ? "Nuestras últimas actividades"
    : "Our latest activities"

  return (
    <section className="py-20 md:py-24 bg-background dark:bg-background-dark overflow-hidden">

      {/* Section header — centré comme le reste du contenu */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-end justify-between mb-8"
        >
          <h2 className="text-foreground dark:text-foreground-dark">
            {title || defaultTitle}
          </h2>

          {/* Navigation arrows */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full card-huly flex items-center justify-center text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full card-huly flex items-center justify-center text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll container pleine largeur */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayActivities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-[320px] flex-shrink-0"
          >
            <ActivityCard activity={activity} lang={lang} />
          </motion.div>
        ))}
      </div>

    </section>
  )
}
