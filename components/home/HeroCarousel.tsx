'use client'

import { useState, useCallback } from 'react'
import { Users, Clock, BarChart3, Tag, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

// ─── Demo cards — faithful replica of ActivityCard data ──────────────
const carouselCards = [
  {
    title: 'Herbier des saisons',
    category: 'nature',
    categoryLabel: 'Nature',
    age: '3-4 ans',
    duration: '30 min',
    difficulty: 'Moyen',
    themes: ['Printemps', 'Nature'],
    competences: ['Éveil sensoriel'],
    creator: { name: 'MamanCréa', initial: 'M' },
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop&crop=center',
  },
  {
    title: 'Peinture libre en plein air',
    category: 'art-plastique',
    categoryLabel: 'Art plastique',
    age: '1-2 ans',
    duration: '10 min',
    difficulty: 'Facile',
    themes: ['Créativité'],
    competences: ['Motricité fine'],
    creator: { name: 'Petit Ilot', initial: 'P' },
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop&crop=center',
  },
  {
    title: 'Cookies banane avoine',
    category: 'alimentation',
    categoryLabel: 'Recette',
    age: '2-4 ans',
    duration: '20 min',
    difficulty: 'Facile',
    themes: ['Cuisine', 'Goûter'],
    competences: ['Autonomie'],
    creator: { name: 'ChefMini', initial: 'C' },
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=300&fit=crop&crop=center',
  },
  {
    title: 'Bac sensoriel océan',
    category: 'sensoriel',
    categoryLabel: 'Sensoriel',
    age: '0-2 ans',
    duration: '20 min',
    difficulty: 'Facile',
    themes: ['Été', 'Eau'],
    competences: ['Éveil'],
    creator: { name: 'SensoriKids', initial: 'S' },
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=300&fit=crop&crop=center',
  },
  {
    title: 'Parcours moteur coussins',
    category: 'motricite',
    categoryLabel: 'Motricité',
    age: '1-3 ans',
    duration: '15 min',
    difficulty: 'Moyen',
    themes: ['Intérieur'],
    competences: ['Motricité globale'],
    creator: { name: 'Petit Ilot', initial: 'P' },
    image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400&h=300&fit=crop&crop=center',
  },
]

const ctaTranslations = {
  fr: { cta: 'Découvrir', explore: 'Explorer' },
  en: { cta: 'Discover', explore: 'Explore' },
  es: { cta: 'Descubrir', explore: 'Explorar' },
}

// ─── Rating hearts — miniature version ───────────────────────────────
function MiniHearts() {
  return (
    <div className="flex gap-[1px]">
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} className="w-2.5 h-2.5 text-[var(--foreground-secondary)] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Carousel Card — exact ActivityCard replica at smaller scale ─────
function CarouselCard({ card }: { card: (typeof carouselCards)[0] }) {
  return (
    <div className="card-huly w-full h-full transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl">
      {/* Inner padding — elements "posés sur le verre" */}
      <div className="p-2 flex flex-col gap-1.5 h-full">

        {/* ── Vignette — image posée sur le verre ─────── */}
        <div className="card-glass-vignette">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
              loading="lazy"
            />
            {/* Gradient overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />

            {/* Category chip — top left */}
            <div className="absolute top-1.5 left-1.5">
              <span className="card-huly-chip" style={{ fontSize: 9, padding: '2px 7px', borderRadius: 7 }}>
                {card.categoryLabel}
              </span>
            </div>

            {/* Rating hearts — top right */}
            <div className="absolute top-1.5 right-1.5">
              <span className="card-huly-chip" style={{ padding: '2px 5px', borderRadius: 7 }}>
                <MiniHearts />
              </span>
            </div>
          </div>
        </div>

        {/* ── Content body — white zone posée sur le verre ── */}
        <div className="card-glass-body" style={{ padding: '8px 10px' }}>
          {/* Title */}
          <h4 className="font-semibold text-[var(--foreground)] text-[11px] leading-snug mb-1.5 line-clamp-2 tracking-tight">
            {card.title}
          </h4>

          {/* Meta pills — age, duration, difficulty */}
          <div className="flex flex-wrap items-center gap-1 mb-1.5">
            <span className="card-huly-meta" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, gap: 2 }}>
              <Users className="w-2.5 h-2.5 opacity-50" />
              {card.age}
            </span>
            <span className="card-huly-meta" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, gap: 2 }}>
              <Clock className="w-2.5 h-2.5 opacity-50" />
              {card.duration}
            </span>
            <span className="card-huly-meta" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, gap: 2 }}>
              <BarChart3 className="w-2.5 h-2.5 opacity-50" />
              {card.difficulty}
            </span>
          </div>

          {/* Tags — themes (sage) + competences (mauve) */}
          <div className="flex flex-wrap gap-1">
            {card.themes.slice(0, 1).map((theme, idx) => (
              <span key={`t-${idx}`} className="card-huly-tag card-huly-tag--sage" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, gap: 2 }}>
                <Tag className="w-2 h-2" />
                {theme}
              </span>
            ))}
            {card.competences.slice(0, 1).map((comp, idx) => (
              <span key={`c-${idx}`} className="card-huly-tag card-huly-tag--mauve" style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, gap: 2 }}>
                <Lightbulb className="w-2 h-2" />
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* ── Creator footer — white zone posée sur le verre ── */}
        <div className="card-glass-creator flex items-center gap-2" style={{ padding: '6px 10px' }}>
          <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-br from-sage-light to-sage dark:from-sage dark:to-sage-dark flex-shrink-0 ring-1 ring-white/50 dark:ring-white/10 flex items-center justify-center">
            <span className="text-[8px] text-white font-semibold">{card.creator.initial}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-medium text-[var(--foreground)] leading-none">{card.creator.name}</span>
            <span className="text-[7px] text-[var(--foreground-secondary)] leading-none mt-0.5">Créateur</span>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Main Carousel — fan layout, cards link to resources ────────────
export default function HeroCarousel({ lang }: { lang: Language }) {
  const [activeIndex, setActiveIndex] = useState(2)
  const t = ctaTranslations[lang] || ctaTranslations.fr

  const getCardStyle = useCallback(
    (index: number): React.CSSProperties => {
      const offset = index - activeIndex
      const absOffset = Math.abs(offset)

      // Fan layout — wide spread, back cards turned toward center
      const CARD_W = 210
      const CARD_H = 340
      const SPREAD_X = 100       // px between cards (wider)
      const SPREAD_Z = 80        // depth per step
      const ROTATION_Y = 35      // degrees Y — back cards face center
      const SCALE_STEP = 0.08
      const OPACITY_STEP = 0.20

      const translateX = absOffset === 2 ? offset * 110 : offset * SPREAD_X
      const translateZ = -absOffset * SPREAD_Z
      const rotateY = offset * -ROTATION_Y   // left cards face right, right cards face left (toward center)
      const scale = Math.max(0.72, 1 - absOffset * SCALE_STEP)
      const opacity = absOffset > 2 ? 0 : Math.max(0.25, 1 - absOffset * OPACITY_STEP)

      return {
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: 10 - absOffset,
        transition: 'all 0.6s cubic-bezier(0.32, 0.72, 0, 1)',
        position: 'absolute',
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        left: '50%',
        top: '50%',
        marginLeft: `${-CARD_W / 2}px`,
        marginTop: `${-CARD_H / 2}px`,
        cursor: 'pointer',
        pointerEvents: absOffset > 2 ? 'none' : 'auto',
      }
    },
    [activeIndex]
  )

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start select-none">
      {/* Perspective container */}
      <div
        className="relative w-full flex-1"
        style={{ perspective: '1000px', perspectiveOrigin: '50% 45%' }}
      >
        {/* Cards */}
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {carouselCards.map((card, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={index}
                style={getCardStyle(index)}
                onClick={() => {
                  if (!isActive) setActiveIndex(index)
                }}
              >
                {isActive ? (
                  <Link href={`/${lang}/activites`}>
                    <CarouselCard card={card} />
                  </Link>
                ) : (
                  <CarouselCard card={card} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA under carousel */}
      <Link href={`/${lang}/activites`} className="mt-4">
        <Button gem="sage" size="lg">
          {t.cta}
        </Button>
      </Link>
    </div>
  )
}
