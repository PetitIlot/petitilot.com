'use client'

import { motion } from 'framer-motion'
import { Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const translations = {
  fr: {
    title: 'Éveillez la curiosité de vos enfants, naturellement',
    subtitle: 'Découvrez des activités éducatives pensées pour les 0-6 ans : bricolages, recettes, jeux sensoriels... Créées par des éducateurs passionnés, pour des moments de qualité loin des écrans.',
    features: ['Activités nature & DIY', 'Zéro écran', 'Créateurs vérifiés'],
    followUs: 'Suivez-nous',
    learnMore: 'En savoir plus',
    joinUs: 'Nous rejoindre'
  },
  en: {
    title: "Nurture your children's curiosity, naturally",
    subtitle: 'Discover educational activities designed for ages 0-6: crafts, recipes, sensory games... Created by passionate educators, for quality screen-free moments.',
    features: ['Nature & DIY activities', 'Screen-free', 'Verified creators'],
    followUs: 'Follow us',
    learnMore: 'Learn more',
    joinUs: 'Join us'
  },
  es: {
    title: 'Despierta la curiosidad de tus hijos, naturalmente',
    subtitle: 'Descubre actividades educativas diseñadas para niños de 0-6 años: manualidades, recetas, juegos sensoriales... Creadas por educadores apasionados, para momentos de calidad sin pantallas.',
    features: ['Actividades naturaleza & DIY', 'Sin pantallas', 'Creadores verificados'],
    followUs: 'Síguenos',
    learnMore: 'Saber más',
    joinUs: 'Únete'
  }
}

export default function HeroSection({ lang }: { lang: 'fr' | 'en' | 'es' }) {
  const t = translations[lang]

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-home.jpg?v=2"
          alt="Petit Îlot - Activités éducatives"
          className="w-full h-full object-cover"
        />
        {/* Apple-style gradient - more subtle, luminous */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-2xl"
        >
          {/* Main headline - Apple style */}
          <h1 className="text-foreground leading-[1.05] mb-8 tracking-tight">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-body-large text-foreground-secondary leading-relaxed mb-10 max-w-xl">
            {t.subtitle}
          </p>

          {/* Features pills - Apple style */}
          <div className="flex flex-wrap gap-3 mb-10">
            {t.features.map((feature, index) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="liquid-glass px-5 py-2.5 rounded-[20px] text-callout font-medium text-foreground"
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href={`/${lang}/connexion`} className="group">
              <Button
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-semibold text-white shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1"
                style={{
                  background: 'rgba(204, 166, 200, 0.75)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(204, 166, 200, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(204, 166, 200, 0.75)'}
              >
                {t.joinUs}
              </Button>
            </Link>
            <Link href={`/${lang}/a-propos`} className="group">
              <Button
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-semibold text-white shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:-translate-y-1"
                style={{
                  background: 'rgba(209, 164, 133, 0.75)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(209, 164, 133, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(209, 164, 133, 0.75)'}
              >
                {t.learnMore}
              </Button>
            </Link>
          </motion.div>

          {/* Social Icons - prominent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-12"
          >
            <span className="text-base font-medium text-foreground/70">{t.followUs}</span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/petitilot"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)' }}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 text-white shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-7 h-7" />
              </a>
              <a
                href="https://tiktok.com/@petitilot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 text-white shadow-lg"
                aria-label="TikTok"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@petitilot"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#FF0000' }}
                className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 text-white shadow-lg"
                aria-label="YouTube"
              >
                <Youtube className="w-7 h-7" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
