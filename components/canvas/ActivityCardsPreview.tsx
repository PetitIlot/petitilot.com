'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Language } from '@/lib/types'
import type { ActivityCardsBlockData } from '@/lib/blocks/types'
import type { RessourceWithCreator } from '@/lib/supabase-queries'
import { getResourcesForCarouselBlock, getResourcesByIds } from '@/lib/supabase-queries'
import ActivityCard from '@/components/cards/ActivityCard'
import FeaturedCarouselCard from '@/components/home/FeaturedCarouselCard'

interface ActivityCardsPreviewProps {
  data: ActivityCardsBlockData
  lang: Language
  isEditing?: boolean
  formData?: {
    ressourceId?: string
    type?: string | null
    themes?: string[] | null
    competences?: string[] | null
  }
}

// ============================================
// Demo fallback (editeur sans contexte)
// ============================================
const DEMO_CARDS: RessourceWithCreator[] = [
  {
    id: 'demo-1',
    title: 'Activité sensorielle au jardin',
    type: 'activite',
    lang: 'fr',
    age_min: 2, age_max: 5,
    duration: 20,
    duration_max: null,
    duration_prep: null,
    difficulte: 'beginner',
    autonomie: false,
    themes: ['nature', 'sensory'],
    competences: ['motricité fine'],
    categories: ['activite'],
    is_premium: false,
    accept_free_credits: false,
    price_credits: 0,
    vignette_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
    is_published: true,
    featured: false,
    group_id: null,
    intensity: null,
    creator: { id: 'demo', slug: 'demo', display_name: 'Créateur Demo', avatar_url: null },
  } as unknown as RessourceWithCreator,
  {
    id: 'demo-2',
    title: 'Peinture avec les doigts',
    type: 'activite',
    lang: 'fr',
    age_min: 1, age_max: 4,
    duration: 30,
    duration_max: null,
    duration_prep: 10,
    difficulte: 'beginner',
    autonomie: false,
    themes: ['art', 'creativity'],
    competences: ['créativité'],
    categories: ['activite'],
    is_premium: false,
    accept_free_credits: false,
    price_credits: 0,
    vignette_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400',
    is_published: true,
    featured: false,
    group_id: null,
    intensity: null,
    creator: { id: 'demo', slug: 'demo', display_name: 'Créateur Demo', avatar_url: null },
  } as unknown as RessourceWithCreator,
  {
    id: 'demo-3',
    title: 'Jeu de tri des couleurs',
    type: 'motricite',
    lang: 'fr',
    age_min: 2, age_max: 4,
    duration: 15,
    duration_max: null,
    duration_prep: 5,
    difficulte: 'beginner',
    autonomie: true,
    themes: ['couleurs', 'logique'],
    competences: ['concentration'],
    categories: ['motricite'],
    is_premium: false,
    accept_free_credits: false,
    price_credits: 0,
    vignette_url: 'https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=400',
    is_published: true,
    featured: false,
    group_id: null,
    intensity: null,
    creator: { id: 'demo', slug: 'demo', display_name: 'Créateur Demo', avatar_url: null },
  } as unknown as RessourceWithCreator,
  {
    id: 'demo-4',
    title: 'Recette de crêpes légères',
    type: 'alimentation',
    lang: 'fr',
    age_min: 3, age_max: 6,
    duration: 25,
    duration_max: null,
    duration_prep: 5,
    difficulte: 'advanced',
    autonomie: false,
    themes: ['cuisine', 'partage'],
    competences: ['autonomie'],
    categories: ['alimentation'],
    is_premium: true,
    accept_free_credits: true,
    price_credits: 3,
    vignette_url: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400',
    is_published: true,
    featured: false,
    group_id: null,
    intensity: null,
    creator: { id: 'demo', slug: 'demo', display_name: 'Créateur Demo', avatar_url: null },
  } as unknown as RessourceWithCreator,
]

// ============================================
// Card Skeleton
// ============================================
function CardSkeleton({ style }: { style: ActivityCardsBlockData['cardStyle'] }) {
  const aspectRatio = style === 'landscape-large' ? '11/8'
    : style === 'landscape-small' ? '6/5'
    : '11/16'

  return (
    <div
      className="animate-pulse rounded-2xl bg-[var(--surface-secondary)] flex-shrink-0 w-full"
      style={{ aspectRatio, maxWidth: style === 'landscape-large' ? 440 : style === 'landscape-small' ? 240 : 220 }}
    />
  )
}

// ============================================
// Card renderer
// ============================================
function ActivityCardItem({
  activity,
  lang,
  cardStyle,
  isEditing,
}: {
  activity: RessourceWithCreator
  lang: Language
  cardStyle: ActivityCardsBlockData['cardStyle']
  isEditing?: boolean
}) {
  const card = cardStyle === 'classic'
    ? <ActivityCard activity={activity} lang={lang} />
    : <FeaturedCarouselCard activity={activity} lang={lang} variant={cardStyle === 'landscape-large' ? 'large' : 'small'} />

  if (!isEditing) return card

  return (
    <div style={{ position: 'relative' }}>
      {card}
      {/* Overlay transparent bloquant les liens en mode édition */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }} />
    </div>
  )
}

// ============================================
// Layout: scroll-compact (style Hero)
// ============================================
function ScrollCompactLayout({
  cards,
  data,
  lang,
  isEditing,
}: {
  cards: RessourceWithCreator[]
  data: ActivityCardsBlockData
  lang: Language
  isEditing?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(240)

  // Adapt card width to container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width || 0
      // Card = ~80% of container, clamped between 140-280px
      setCardWidth(Math.max(140, Math.min(280, w * 0.8)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? cardWidth + 12 : -(cardWidth + 12), behavior: 'smooth' })
  }, [cardWidth])

  return (
    <div ref={containerRef}>
      {/* Header with arrows */}
      {(data.title || data.showArrows) && (
        <div className="flex items-center justify-between mb-3">
          {data.title ? (
            <h3 className="text-sm font-semibold text-[var(--foreground)]">{data.title}</h3>
          ) : (
            <div />
          )}
          {data.showArrows && (
            <div className="flex gap-1.5">
              <button
                onClick={() => scrollBy('left')}
                className="w-7 h-7 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollBy('right')}
                className="w-7 h-7 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingRight: 60,
          paddingBottom: 4,
        }}
      >
        {cards.map(card => (
          <div key={card.id} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: cardWidth }}>
            <ActivityCardItem activity={card} lang={lang} cardStyle={data.cardStyle} isEditing={isEditing} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Layout: scroll-wide (style FeaturedCarousel)
// ============================================
function ScrollWideLayout({
  cards,
  data,
  lang,
  isEditing,
}: {
  cards: RessourceWithCreator[]
  data: ActivityCardsBlockData
  lang: Language
  isEditing?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(440)

  // Adapt card width to container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width || 0
      // Card = ~90% of container, clamped between 200-520px
      setCardWidth(Math.max(200, Math.min(520, w * 0.9)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? cardWidth + 20 : -(cardWidth + 20), behavior: 'smooth' })
  }, [cardWidth])

  return (
    <div ref={containerRef}>
      {/* Header with arrows */}
      {(data.title || data.showArrows) && (
        <div className="flex items-center justify-between mb-4">
          {data.title ? (
            <h3 className="text-base font-semibold text-[var(--foreground)]">{data.title}</h3>
          ) : (
            <div />
          )}
          {data.showArrows && (
            <div className="flex gap-2">
              <button
                onClick={() => scrollBy('left')}
                className="w-8 h-8 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBy('right')}
                className="w-8 h-8 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingRight: 80,
          paddingBottom: 4,
        }}
      >
        {cards.map(card => (
          <div key={card.id} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: cardWidth }}>
            <ActivityCardItem activity={card} lang={lang} cardStyle={data.cardStyle} isEditing={isEditing} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Layout: spotlight (focus centré)
// ============================================
function SpotlightLayout({
  cards,
  data,
  lang,
  isEditing,
}: {
  cards: RessourceWithCreator[]
  data: ActivityCardsBlockData
  lang: Language
  isEditing?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(entries => {
      setContainerWidth(entries[0]?.contentRect.width || 600)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const prev = useCallback(() => {
    setActiveIndex(i => Math.max(0, i - 1))
  }, [])

  const next = useCallback(() => {
    setActiveIndex(i => Math.min(cards.length - 1, i + 1))
  }, [cards.length])

  // Card width relative to container (~55% of container, clamped)
  const cardWidth = Math.max(160, Math.min(440, containerWidth * 0.55))
  const carouselWidth = Math.min(containerWidth, cardWidth * 2.2)

  return (
    <div className="relative" ref={containerRef}>
      {data.title && (
        <h3 className="text-base font-semibold text-[var(--foreground)] text-center mb-4">{data.title}</h3>
      )}

      <div className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: Math.max(200, cardWidth * 0.9) }}>
        {/* Prev arrow */}
        {data.showArrows && activeIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-0 z-10 w-9 h-9 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
            style={{ transform: 'translateY(-50%)', top: '50%' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Cards */}
        <div className="relative flex items-center justify-center" style={{ width: carouselWidth, overflow: 'visible' }}>
          {cards.map((card, idx) => {
            const diff = idx - activeIndex
            if (Math.abs(diff) > 1) return null

            const isActive = diff === 0
            const scale = isActive ? 1 : 0.88
            const opacity = isActive ? 1 : 0.55
            const translateX = diff * (cardWidth * 0.72)
            const zIndex = isActive ? 2 : 1

            return (
              <div
                key={card.id}
                onClick={() => !isActive && setActiveIndex(idx)}
                style={{
                  position: 'absolute',
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  cursor: isActive ? 'default' : 'pointer',
                  boxShadow: isActive ? '0 20px 60px rgba(0,0,0,0.18)' : 'none',
                  borderRadius: 16,
                  width: cardWidth,
                }}
              >
                <ActivityCardItem activity={card} lang={lang} cardStyle={data.cardStyle} isEditing={isEditing} />
              </div>
            )
          })}
        </div>

        {/* Next arrow */}
        {data.showArrows && activeIndex < cards.length - 1 && (
          <button
            onClick={next}
            className="absolute right-0 z-10 w-9 h-9 rounded-full flex items-center justify-center card-huly-chip hover:bg-[var(--surface-secondary)] transition-colors"
            style={{ transform: 'translateY(-50%)', top: '50%' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dots */}
      {data.showDots && cards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="rounded-full transition-all"
              style={{
                width: idx === activeIndex ? 16 : 6,
                height: 6,
                backgroundColor: idx === activeIndex ? 'var(--sage)' : 'var(--border)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Layout: vertical-stack
// ============================================
function VerticalStackLayout({
  cards,
  data,
  lang,
  isEditing,
}: {
  cards: RessourceWithCreator[]
  data: ActivityCardsBlockData
  lang: Language
  isEditing?: boolean
}) {
  return (
    <div>
      {data.title && (
        <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">{data.title}</h3>
      )}
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {cards.map(card => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ActivityCardItem activity={card} lang={lang} cardStyle={data.cardStyle} isEditing={isEditing} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ============================================
// Main component
// ============================================
export default function ActivityCardsPreview({
  data,
  lang,
  isEditing,
  formData,
}: ActivityCardsPreviewProps) {
  const [cards, setCards] = useState<RessourceWithCreator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    async function fetchCards() {
      try {
        let results: RessourceWithCreator[] = []

        if (data.selectionMode === 'manual' && data.manualIds && data.manualIds.length > 0) {
          results = await getResourcesByIds(data.manualIds, lang)
        } else if (data.preset) {
          const needsContext = ['same-type', 'same-theme', 'same-competence'].includes(data.preset)

          if (needsContext && !formData?.ressourceId && !formData?.type && !formData?.themes?.length && !formData?.competences?.length) {
            // No context available → use demo cards
            if (!cancelled) {
              setCards(DEMO_CARDS.slice(0, data.limit))
              setLoading(false)
            }
            return
          }

          results = await getResourcesForCarouselBlock(
            data.preset,
            lang,
            {
              id: formData?.ressourceId,
              type: formData?.type,
              themes: formData?.themes,
              competences: formData?.competences,
            },
            data.limit
          )
        }

        if (!cancelled) {
          setCards(results.length > 0 ? results : DEMO_CARDS.slice(0, data.limit))
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setCards(DEMO_CARDS.slice(0, data.limit))
          setLoading(false)
        }
      }
    }

    fetchCards()
    return () => { cancelled = true }
  }, [data.selectionMode, data.preset, data.manualIds, data.limit, lang, formData?.ressourceId, formData?.type])

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: Math.min(data.limit, 3) }).map((_, i) => (
          <CardSkeleton key={i} style={data.cardStyle} />
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-[var(--foreground-secondary)] italic rounded-xl border border-dashed border-[var(--border)]">
        Aucune ressource trouvée
      </div>
    )
  }

  switch (data.layout) {
    case 'scroll-compact':
      return <ScrollCompactLayout cards={cards} data={data} lang={lang} isEditing={isEditing} />
    case 'scroll-wide':
      return <ScrollWideLayout cards={cards} data={data} lang={lang} isEditing={isEditing} />
    case 'spotlight':
      return <SpotlightLayout cards={cards} data={data} lang={lang} isEditing={isEditing} />
    case 'vertical-stack':
      return <VerticalStackLayout cards={cards} data={data} lang={lang} isEditing={isEditing} />
    default:
      return <ScrollWideLayout cards={cards} data={data} lang={lang} isEditing={isEditing} />
  }
}
