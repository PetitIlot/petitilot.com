'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Language } from '@/lib/types'
import CreatorCard, { type CreatorCardData } from './CreatorCard'

const demoCreators: CreatorCardData[] = [
  {
    slug: 'maman-crea',
    display_name: 'Maman Créa',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #C8E0C4 0%, #8FA98C 100%)',
    bio: 'Éducatrice Montessori passionnée de nature et bricolages écolos pour les tout-petits.',
    themes: ['Montessori', 'Nature'],
    total_resources: 24,
    followers: 1240,
    is_approved: true,
    is_featured: true,
  },
  {
    slug: 'sensori-kids',
    display_name: 'SensoriKids',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #E0D0F5 0%, #B39DDB 100%)',
    bio: 'Spécialiste des bacs sensoriels et jeux d\'éveil pour les 0-3 ans.',
    themes: ['Sensoriel', 'Éveil'],
    total_resources: 18,
    followers: 876,
    is_approved: true,
  },
  {
    slug: 'chef-mini',
    display_name: 'Chef Mini',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #F0D4C0 0%, #D4A574 100%)',
    bio: 'Recettes créatives et accessibles pour cuisiner avec les enfants dès 2 ans.',
    themes: ['Cuisine', 'DIY'],
    total_resources: 31,
    followers: 2105,
    is_approved: true,
  },
  {
    slug: 'atelier-bois',
    display_name: 'Atelier Bois',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #E8D5B0 0%, #C4986A 100%)',
    bio: 'Fabricant de jouets en bois et activités manuelles pour les 4-6 ans.',
    themes: ['DIY', 'Créativité'],
    total_resources: 12,
    followers: 543,
    is_approved: true,
  },
  {
    slug: 'jardin-des-petits',
    display_name: 'Jardin des Petits',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #B8E0C8 0%, #68A880 100%)',
    bio: 'Jardinage, botanique et découverte de la nature pour les enfants curieux.',
    themes: ['Jardinage', 'Nature'],
    total_resources: 20,
    followers: 934,
    is_approved: true,
  },
  {
    slug: 'yoga-kids',
    display_name: 'Yoga Kids',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #FFD6D6 0%, #F0A0A0 100%)',
    bio: 'Yoga, relaxation et pleine conscience adaptés aux enfants de 2 à 6 ans.',
    themes: ['Motricité', 'Bien-être'],
    total_resources: 15,
    followers: 712,
    is_approved: true,
  },
  {
    slug: 'petit-ilot-studio',
    display_name: 'Petit Ilot Studio',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #A8C8E0 0%, #6897B8 100%)',
    bio: 'Activités d\'art, musique et expression créative pour les jeunes artistes.',
    themes: ['Art plastique', 'Musique'],
    total_resources: 28,
    followers: 1876,
    is_approved: true,
    is_featured: true,
  },
  {
    slug: 'pikler-play',
    display_name: 'Pikler Play',
    avatar_url: null,
    avatarGradient: 'linear-gradient(135deg, #D8C8F0 0%, #A88CC4 100%)',
    bio: 'Développement moteur libre et jeu autonome inspirés de la pédagogie Pikler.',
    themes: ['Motricité', 'Pikler'],
    total_resources: 9,
    followers: 389,
    is_approved: true,
  },
]

const translations = {
  fr: {
    eyebrow: '✦ Notre communauté',
    title: 'Ils créent pour vos enfants',
    subtitle: 'Des éducateurs, pédagogues et parents passionnés du monde entier.',
  },
  en: {
    eyebrow: '✦ Our community',
    title: 'They create for your children',
    subtitle: 'Educators, pedagogues and passionate parents from around the world.',
  },
  es: {
    eyebrow: '✦ Nuestra comunidad',
    title: 'Crean para tus hijos',
    subtitle: 'Educadores, pedagogos y padres apasionados de todo el mundo.',
  }
}

export default function CreatorsCarousel({ lang }: { lang: Language }) {
  const t = translations[lang] || translations.fr
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Resume auto-scroll after 3s of inactivity
  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => setIsPaused(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isPaused])

  // Duplicate for infinite scroll
  const duplicated = [...demoCreators, ...demoCreators]

  return (
    <section className="py-20 md:py-24 bg-background dark:bg-background-dark overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <p className="text-callout font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-3 tracking-widest uppercase">
            {t.eyebrow}
          </p>
          <h2 className="text-foreground dark:text-foreground-dark mb-3">
            {t.title}
          </h2>
          <p className="text-body text-foreground-secondary dark:text-foreground-dark-secondary max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Carousel with CSS animation */}
      <style jsx>{`
        @keyframes scrollCreators {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-creators {
          animation: scrollCreators 60s linear infinite;
        }
        .animate-scroll-creators.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
      >
        <div
          ref={scrollRef}
          className={`flex gap-4 px-6 animate-scroll-creators ${isPaused ? 'paused' : ''}`}
          style={{ width: 'fit-content' }}
        >
          {duplicated.map((creator, i) => (
            <div
              key={`${creator.slug}-${i}`}
              className="w-[230px] flex-shrink-0"
            >
              <CreatorCard creator={creator} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
