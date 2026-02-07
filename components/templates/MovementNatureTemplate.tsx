'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, MapPin, TreePine, Sun, Wind, Mountain, Footprints, Play, ChevronDown, Tag, Lightbulb, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Language } from '@/lib/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { getActivityImageUrl } from '@/lib/cloudinary'
import CreatorWidget from '@/components/CreatorWidget'
import FavoriteButton from '@/components/FavoriteButton'
import PurchaseButton from '@/components/PurchaseButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'
import { Button } from '@/components/ui/button'

/**
 * MovementNatureTemplate - Page de détail pour Motricité globale & Nature/Plein air
 *
 * Design: Layout immersif inspiré des apps outdoor/aventure
 * - Hero image plein écran avec parallax
 * - Infos clés en overlay sur l'image
 * - Scroll reveal pour le contenu
 * - Couleurs Sky (#5AC8FA) pour le côté nature/extérieur
 * - Icônes évoquant le mouvement et la nature
 */

const translations = {
  fr: {
    back: 'Retour',
    outdoor: 'Plein air',
    movement: 'En mouvement',
    age: 'Âge',
    duration: 'Durée',
    years: 'ans',
    minutes: 'min',
    difficulty: 'Niveau',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    withAdult: 'Avec adulte',
    autonomous: 'Autonome',
    description: 'L\'aventure',
    materials: 'Matériel',
    tips: 'Conseils terrain',
    scrollDown: 'Découvrir',
    location: 'Lieu idéal',
    weather: 'Météo',
    season: 'Saison',
  },
  en: {
    back: 'Back',
    outdoor: 'Outdoor',
    movement: 'Active play',
    age: 'Age',
    duration: 'Duration',
    years: 'yrs',
    minutes: 'min',
    difficulty: 'Level',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    withAdult: 'With adult',
    autonomous: 'Autonomous',
    description: 'The adventure',
    materials: 'Gear',
    tips: 'Field tips',
    scrollDown: 'Discover',
    location: 'Best location',
    weather: 'Weather',
    season: 'Season',
  },
  es: {
    back: 'Volver',
    outdoor: 'Al aire libre',
    movement: 'En movimiento',
    age: 'Edad',
    duration: 'Duración',
    years: 'años',
    minutes: 'min',
    difficulty: 'Nivel',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    withAdult: 'Con adulto',
    autonomous: 'Autónomo',
    description: 'La aventura',
    materials: 'Equipo',
    tips: 'Consejos de campo',
    scrollDown: 'Descubrir',
    location: 'Lugar ideal',
    weather: 'Clima',
    season: 'Temporada',
  }
}

// Mapping des icônes selon les thèmes
const getEnvironmentIcon = (themes: string[] | null, categories: string[] | null) => {
  const allTags = [...(themes || []), ...(categories || [])].map(t => t.toLowerCase())
  if (allTags.some(t => t.includes('forêt') || t.includes('forest'))) return TreePine
  if (allTags.some(t => t.includes('montagne') || t.includes('mountain'))) return Mountain
  if (allTags.some(t => t.includes('vent') || t.includes('wind'))) return Wind
  if (allTags.some(t => t.includes('plein air') || t.includes('outdoor') || t.includes('nature'))) return Sun
  return Footprints
}

interface MovementNatureTemplateProps {
  activity: RessourceWithCreator
  lang: Language
}

export default function MovementNatureTemplate({ activity, lang }: MovementNatureTemplateProps) {
  const t = translations[lang] || translations.fr
  const [showContent, setShowContent] = useState(false)

  const imageSource = activity.images_urls?.[0] || activity.vignette_url
  const heroImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1476673160081-cf065f5db4c6?w=1200'

  const EnvironmentIcon = getEnvironmentIcon(activity.themes, activity.categories)
  const materiels = activity.materiel_json || []

  const isOutdoor = activity.categories?.some(c =>
    c.toLowerCase().includes('nature') || c.toLowerCase().includes('plein air')
  )

  const difficultyLabel = activity.difficulte === 'beginner' ? t.easy
    : activity.difficulte === 'advanced' ? t.medium : t.hard

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero Section - Plein écran immersif */}
      <div className="relative h-screen">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        </div>

        {/* Navigation flottante */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href={`/${lang}/activites`}>
              <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <RatingHearts ressourceId={activity.id} variant="display" size="sm" lang={lang} />
              </div>
              <FavoriteButton ressourceId={activity.id} variant="icon" lang={lang} />
            </div>
          </div>
        </div>

        {/* Contenu Hero */}
        <div className="absolute inset-0 flex flex-col justify-end z-10 p-6 sm:p-10">
          <div className="max-w-4xl">
            {/* Badge catégorie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg"
                style={{ backgroundColor: 'rgba(92, 200, 250, 0.9)' }}>
                <EnvironmentIcon className="w-4 h-4" />
                {isOutdoor ? t.outdoor : t.movement}
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight"
            >
              {activity.title}
            </motion.h1>

            {/* Métadonnées en ligne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              {activity.age_min !== null && (
                <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{activity.age_min}-{activity.age_max} {t.years}</span>
                </div>
              )}
              {activity.duration && (
                <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} {t.minutes}
                  </span>
                </div>
              )}
              {activity.difficulte && (
                <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Mountain className="w-5 h-5" />
                  <span className="font-medium">{difficultyLabel}</span>
                </div>
              )}
            </motion.div>

            {/* Bouton scroll */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => {
                setShowContent(true)
                window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })
              }}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">{t.scrollDown}</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-20 -mt-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Card principale avec contenu */}
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="p-6 sm:p-8 md:p-10">

              {/* Thèmes et compétences */}
              <div className="flex flex-wrap gap-2 mb-8">
                {activity.themes?.map((theme, idx) => (
                  <span
                    key={`theme-${idx}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ color: '#5AC8FA', backgroundColor: 'rgba(92, 200, 250, 0.12)', border: '1px solid rgba(92, 200, 250, 0.2)' }}
                  >
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    {theme}
                  </span>
                ))}
                {activity.competences?.map((comp, idx) => (
                  <span
                    key={`comp-${idx}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)', border: '1px solid rgba(139, 126, 200, 0.2)' }}
                  >
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                    {comp}
                  </span>
                ))}
              </div>

              {/* Créateur */}
              {activity.creator && (
                <div className="mb-8">
                  <CreatorWidget creator={activity.creator} lang={lang} />
                </div>
              )}

              {/* Description avec galerie */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                  <Play className="w-6 h-6" style={{ color: '#5AC8FA' }} />
                  {t.description}
                </h2>
                <div className="flex gap-8 items-start">
                  <div className="flex-1">
                    <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed text-lg whitespace-pre-line">
                      {activity.description}
                    </p>
                  </div>
                  {activity.gallery_urls && activity.gallery_urls.length > 0 && (
                    <GalleryCarousel
                      images={activity.gallery_urls}
                      alt={activity.title}
                      className="w-56"
                    />
                  )}
                </div>
              </div>

              {/* Matériel - style outdoor */}
              {materiels.length > 0 && (
                <div className="mb-10 rounded-2xl p-6" style={{ backgroundColor: 'rgba(92, 200, 250, 0.08)', border: '1px solid rgba(92, 200, 250, 0.15)' }}>
                  <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                    🎒 {t.materials}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {materiels.map((mat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white dark:bg-surface-dark rounded-xl px-4 py-3"
                        style={{ border: '1px solid var(--border)' }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5AC8FA' }} />
                        <span className="text-foreground dark:text-foreground-dark text-sm">
                          {mat.item}
                        </span>
                        {mat.recup && <span className="text-xs">♻️</span>}
                        {mat.url && (
                          <a href={mat.url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                            <ExternalLink className="w-3.5 h-3.5 text-sky" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Astuces terrain */}
              {activity.astuces && (
                <div className="mb-10 rounded-2xl p-6" style={{ backgroundColor: 'rgba(92, 200, 250, 0.08)', borderLeft: '4px solid #5AC8FA' }}>
                  <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-3 flex items-center gap-2">
                    🧭 {t.tips}
                  </h3>
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
                    {activity.astuces}
                  </p>
                </div>
              )}

              {/* Bouton achat/téléchargement */}
              {activity.pdf_url && (
                <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <PurchaseButton
                    ressourceId={activity.id}
                    priceCredits={activity.price_credits ?? (activity.is_premium ? 3 : 0)}
                    pdfUrl={activity.pdf_url}
                    lang={lang}
                    className="w-full h-14 font-semibold text-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Espace en bas */}
      <div className="h-20" />
    </div>
  )
}
