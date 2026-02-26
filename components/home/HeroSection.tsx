'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRef, useEffect, useState } from 'react'
import HeroCarousel from './HeroCarousel'

const translations = {
  fr: {
    title: 'Jouer aujourd\'hui.\nGrandir demain.',
    subtitle: 'Activités éducatives screen-free pour les 0–6 ans, créées par des éducateurs passionnés.',
    features: ['Nature & DIY', 'Zéro écran', 'Créateurs vérifiés'],
    followUs: 'Suivez-nous',
    exploreCta: 'S\'inscrire / Se connecter',
    creatorCta: 'En savoir plus'
  },
  en: {
    title: 'Playing today.\nGrowing tomorrow.',
    subtitle: 'Screen-free educational activities for ages 0–6, created by passionate educators.',
    features: ['Nature & DIY', 'Screen-free', 'Verified creators'],
    followUs: 'Follow us',
    exploreCta: 'Sign up / Log in',
    creatorCta: 'Learn more'
  },
  es: {
    title: 'Juega hoy.\nCrece mañana.',
    subtitle: 'Actividades educativas sin pantallas para 0–6 años, creadas por educadores apasionados.',
    features: ['Naturaleza & DIY', 'Sin pantallas', 'Creadores verificados'],
    followUs: 'Síguenos',
    exploreCta: 'Registrarse / Iniciar sesión',
    creatorCta: 'Saber más'
  }
}

// ─── Ghost Card Outlines ────────────────────────────────────────────
// Faithful outline replicas of the real ActivityCard structure:
// image 4/3 → category chip + rating hearts → title → meta pills → tags → creator row

const ghostCards = [
  { cat: 'art-plastique', catW: 82, title: 'Peinture libre', titleW: 78, age: '1-2 ans', dur: '10 min', diff: 'Facile', tags: ['Printemps', 'Motricité fine'], creator: 'Petit Ilot' },
  { cat: 'nature', catW: 52, title: 'Herbier des saisons', titleW: 90, age: '3-4 ans', dur: '30 min', diff: 'Moyen', tags: ['Nature', 'Éveil sensoriel'], creator: 'MamanCréa' },
  { cat: 'recette', catW: 55, title: 'Cookies banane', titleW: 85, age: '2-4 ans', dur: '20 min', diff: 'Facile', tags: ['Cuisine', 'Autonomie'], creator: 'ChefMini' },
  { cat: 'motricité', catW: 62, title: 'Parcours moteur', titleW: 82, age: '1-3 ans', dur: '15 min', diff: 'Moyen', tags: ['Motricité', 'Intérieur'], creator: 'Petit Ilot' },
  { cat: 'sensoriel', catW: 60, title: 'Bac sensoriel océan', titleW: 95, age: '0-2 ans', dur: '20 min', diff: 'Facile', tags: ['Été', 'Éveil'], creator: 'SensoriKids' },
  { cat: 'bricolage', catW: 65, title: 'Mobile en bois', titleW: 80, age: '4-6 ans', dur: '45 min', diff: 'Difficile', tags: ['DIY', 'Créativité'], creator: 'AtelierBois' },
  { cat: 'musique', catW: 58, title: 'Maracas recyclées', titleW: 88, age: '2-5 ans', dur: '15 min', diff: 'Facile', tags: ['Musique', 'Recyclage'], creator: 'MamanCréa' },
  { cat: 'jardinage', catW: 68, title: 'Semis de printemps', titleW: 92, age: '3-6 ans', dur: '25 min', diff: 'Moyen', tags: ['Nature', 'Patience'], creator: 'Petit Ilot' },
  { cat: 'art-plastique', catW: 82, title: 'Empreintes feuilles', titleW: 94, age: '2-4 ans', dur: '20 min', diff: 'Facile', tags: ['Automne', 'Nature'], creator: 'ChefMini' },
  { cat: 'lecture', catW: 55, title: 'Conte animé', titleW: 72, age: '1-3 ans', dur: '10 min', diff: 'Facile', tags: ['Langage', 'Calme'], creator: 'SensoriKids' },
  { cat: 'motricité', catW: 62, title: 'Yoga enfant', titleW: 70, age: '3-6 ans', dur: '15 min', diff: 'Moyen', tags: ['Corps', 'Calme'], creator: 'AtelierBois' },
  { cat: 'recette', catW: 55, title: 'Smoothie vert', titleW: 76, age: '2-5 ans', dur: '10 min', diff: 'Facile', tags: ['Santé', 'Cuisine'], creator: 'MamanCréa' },
  { cat: 'nature', catW: 52, title: 'Chasse au trésor', titleW: 86, age: '3-6 ans', dur: '30 min', diff: 'Moyen', tags: ['Extérieur', 'Aventure'], creator: 'Petit Ilot' },
  { cat: 'sensoriel', catW: 60, title: 'Pâte à modeler', titleW: 80, age: '2-4 ans', dur: '20 min', diff: 'Facile', tags: ['Toucher', 'Créativité'], creator: 'ChefMini' },
  { cat: 'bricolage', catW: 65, title: 'Cadre photo', titleW: 74, age: '4-6 ans', dur: '25 min', diff: 'Moyen', tags: ['DIY', 'Souvenir'], creator: 'AtelierBois' },
  { cat: 'musique', catW: 58, title: 'Petit orchestre', titleW: 82, age: '2-5 ans', dur: '15 min', diff: 'Facile', tags: ['Rythme', 'Groupe'], creator: 'SensoriKids' },
  { cat: 'jardinage', catW: 68, title: 'Bouture facile', titleW: 78, age: '4-6 ans', dur: '10 min', diff: 'Facile', tags: ['Botanique', 'Science'], creator: 'Petit Ilot' },
  { cat: 'art-plastique', catW: 82, title: 'Collage magazine', titleW: 88, age: '3-5 ans', dur: '20 min', diff: 'Facile', tags: ['Recyclage', 'Art'], creator: 'MamanCréa' },
  { cat: 'lecture', catW: 55, title: 'Imagier sonore', titleW: 76, age: '0-2 ans', dur: '10 min', diff: 'Facile', tags: ['Éveil', 'Sons'], creator: 'ChefMini' },
  { cat: 'motricité', catW: 62, title: 'Parcours coussins', titleW: 90, age: '1-3 ans', dur: '15 min', diff: 'Moyen', tags: ['Équilibre', 'Jeu'], creator: 'AtelierBois' },
]

// Small icon outlines (inline SVGs matching lucide style at ghost opacity)
const IconUsers = () => (
  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
  </svg>
)
const IconClock = () => (
  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconBar = () => (
  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)
const IconTag = () => (
  <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l6.58-6.58a1 1 0 0 0 0-1.42z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
)
const IconBulb = () => (
  <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
)

// Heart icons for rating display (5 hearts)
const RatingHearts = () => (
  <div className="flex gap-[1px]">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ))}
  </div>
)

function GhostCard({ index }: { index: number }) {
  const c = ghostCards[index % ghostCards.length]

  return (
    <div
      className="rounded-xl border border-white/30 bg-white/[0.06] overflow-hidden"
      style={{ boxShadow: '0 0 20px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.12)' }}
    >
      {/* ── Image area — compact 16/9 ────────────── */}
      <div className="aspect-video border-b border-white/20 relative bg-white/[0.03]">
        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white/[0.06] to-transparent" />
        {/* Category chip */}
        <div className="absolute top-1.5 left-1.5">
          <span className="inline-flex items-center h-4 rounded-full border border-white/30 bg-white/[0.12] px-1.5 text-[7px] font-semibold text-white/70 tracking-wide">
            {c.cat}
          </span>
        </div>
        {/* Hearts */}
        <div className="absolute top-1.5 right-1.5">
          <div className="inline-flex items-center h-4 rounded-full border border-white/30 bg-white/[0.12] px-1 gap-[1px] text-white/60">
            <RatingHearts />
          </div>
        </div>
      </div>

      {/* ── Content area ─────────────────────────── */}
      <div className="p-2">
        {/* Title — real text */}
        <p className="text-[9px] font-semibold text-white/60 leading-tight mb-1.5 truncate">
          {c.title}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          <span className="inline-flex items-center gap-0.5 h-4 px-1 rounded-full bg-white/10 border border-white/20 text-[7px] text-white/60">
            <IconUsers />{c.age}
          </span>
          <span className="inline-flex items-center gap-0.5 h-4 px-1 rounded-full bg-white/10 border border-white/20 text-[7px] text-white/60">
            <IconClock />{c.dur}
          </span>
          <span className="inline-flex items-center gap-0.5 h-4 px-1 rounded-full bg-white/10 border border-white/20 text-[7px] text-white/60">
            <IconBar />{c.diff}
          </span>
        </div>

        {/* Tags — sage + mauve with color */}
        <div className="flex flex-wrap gap-1 mb-1.5">
          <span className="inline-flex items-center gap-0.5 h-3.5 px-1 rounded text-[6px] font-semibold text-white/55"
            style={{ background: 'rgba(168,181,160,0.25)', border: '1px solid rgba(168,181,160,0.45)' }}>
            <IconTag />{c.tags[0]}
          </span>
          <span className="inline-flex items-center gap-0.5 h-3.5 px-1 rounded text-[6px] font-semibold text-white/55"
            style={{ background: 'rgba(204,166,200,0.25)', border: '1px solid rgba(204,166,200,0.45)' }}>
            <IconBulb />{c.tags[1]}
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-1 pt-1.5 border-t border-white/15">
          <div className="w-4 h-4 rounded-full border border-white/30 bg-white/[0.12] flex items-center justify-center flex-shrink-0">
            <span className="text-[6px] font-bold text-white/60">{c.creator.charAt(0)}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] font-medium text-white/55 leading-none truncate">{c.creator}</span>
            <span className="text-[5px] text-white/35 leading-none mt-[1px]">Créateur</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hero Section ───────────────────────────────────────────────────

export default function HeroSection({ lang }: { lang: 'fr' | 'en' | 'es' }) {
  const t = translations[lang]
  const sectionRef = useRef<HTMLElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth springs for parallax movement
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  // Image parallax: subtle shift opposite to mouse
  const imgX = useTransform(smoothX, [0, 1], [15, -15])
  const imgY = useTransform(smoothY, [0, 1], [10, -10])

  // Light orb follows mouse with offset
  const orbX = useTransform(smoothX, [0, 1], ['20%', '80%'])
  const orbY = useTransform(smoothY, [0, 1], ['20%', '70%'])

  // Secondary orb — counter-movement for depth
  const orb2X = useTransform(smoothX, [0, 1], ['70%', '30%'])
  const orb2Y = useTransform(smoothY, [0, 1], ['60%', '25%'])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMouse = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      mouseX.set(nx)
      mouseY.set(ny)

      // Update ghost layer mask — "magic lamp" reveal
      if (ghostRef.current) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        // Brumeux (misty): large ellipse, accentuated reveal with gradual fade
        const mask = `radial-gradient(ellipse 500px 450px at ${x}px ${y}px, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.02) 75%, transparent 100%)`
        ghostRef.current.style.setProperty('mask-image', mask)
        ghostRef.current.style.setProperty('-webkit-mask-image', mask)
      }
    }

    const handleEnter = () => setIsHovering(true)

    const handleLeave = () => {
      setIsHovering(false)
      if (ghostRef.current) {
        ghostRef.current.style.removeProperty('mask-image')
        ghostRef.current.style.removeProperty('-webkit-mask-image')
      }
    }

    section.addEventListener('mousemove', handleMouse)
    section.addEventListener('mouseenter', handleEnter)
    section.addEventListener('mouseleave', handleLeave)

    return () => {
      section.removeEventListener('mousemove', handleMouse)
      section.removeEventListener('mouseenter', handleEnter)
      section.removeEventListener('mouseleave', handleLeave)
    }
  }, [mouseX, mouseY])

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden">

      {/* ── Layer 0: Background Image with Parallax ─────────────── */}
      <motion.div
        className="absolute inset-[-20px] z-0"
        style={{ x: imgX, y: imgY }}
      >
        <img
          src="/images/hero-home.jpg?v=2"
          alt="Petit Îlot - Activités éducatives"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </motion.div>

      {/* ── Layer 1: Luminous orbs — depth and movement ─────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Primary warm orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20 blur-[120px]"
          style={{
            left: orbX,
            top: orbY,
            background: 'radial-gradient(circle, rgba(168,181,160,0.6) 0%, rgba(122,139,111,0.2) 50%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Secondary accent orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-15 blur-[100px]"
          style={{
            left: orb2X,
            top: orb2Y,
            background: 'radial-gradient(circle, rgba(204,166,200,0.5) 0%, rgba(201,160,146,0.2) 50%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Animated vertical light streak — Huly-style */}
        <motion.div
          className="absolute right-[30%] top-0 w-[2px] h-full opacity-[0.07] dark:opacity-[0.12]"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.8) 60%, transparent)',
          }}
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Layer 2: Gradient overlay ──────────────────────────── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-background/95 via-background/70 to-transparent dark:from-background-dark/95 dark:via-background-dark/70" />

      {/* ── Layer 3: Ghost Cards — "Magic Lamp" reveal ──────────── */}
      {/* A grid of card outlines hidden behind a CSS mask that follows the cursor.
          The mask creates a soft, misty (brumeux) circle revealing the outlines. */}
      <div
        ref={ghostRef}
        className="absolute inset-0 z-[3] pointer-events-none hidden md:block"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
        }}
      >
        {/* Dark mist backdrop — stronger contrast for outlines */}
        <div className="absolute inset-0 bg-black/[0.4]" />

        {/* Ghost card grid — very dense, small cards, all details visible */}
        <div className="absolute inset-0 grid gap-2.5 p-4 auto-rows-auto content-start"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <GhostCard key={i} index={i} />
          ))}
        </div>
      </div>

      {/* ── Layer 10: Content ──────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left column — Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            {/* Main headline */}
            <h1 className="text-foreground dark:text-foreground-dark leading-[1.05] mb-8 tracking-tight whitespace-pre-line">
              {t.title}
            </h1>

            {/* Subtitle */}
            <p className="text-body-large text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed mb-10 max-w-xl">
              {t.subtitle}
            </p>

            {/* Features pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {t.features.map((feature, index) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="liquid-glass px-5 py-2.5 rounded-[20px] text-callout font-medium text-foreground dark:text-foreground-dark"
                >
                  {feature}
                </motion.span>
              ))}
            </div>

            {/* Call to Action Buttons + Social */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              {/* CTAs — hiérarchie claire : primaire + lien secondaire */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/${lang}/connexion`}>
                  <Button gem="sky" size="lg">
                    {t.exploreCta}
                  </Button>
                </Link>
                <Link
                  href={`/${lang}/a-propos`}
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark transition-colors duration-200 group"
                >
                  {t.creatorCta}
                  <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              {/* Réseaux sociaux — ancré à la colonne gauche, discret */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold tracking-widest uppercase text-foreground-secondary dark:text-foreground-dark-secondary opacity-60">
                  {t.followUs}
                </span>
                <div className="w-px h-3.5 bg-current opacity-20" />
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com/petitilot"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:opacity-100 opacity-70"
                    style={{ background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)' }}
                  >
                    <Instagram className="w-[15px] h-[15px] text-white" />
                  </a>
                  <a
                    href="https://tiktok.com/@petitilot"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:opacity-100 opacity-70 bg-black"
                  >
                    <svg className="w-[15px] h-[15px] text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/@petitilot"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:opacity-100 opacity-70"
                    style={{ background: '#FF0000' }}
                  >
                    <Youtube className="w-[15px] h-[15px] text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column — 3D Card Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block relative h-[480px] mt-11"
          >
            <HeroCarousel lang={lang} />
          </motion.div>

        </div>

      </div>
    </section>
  )
}
