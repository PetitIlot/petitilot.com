'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, Leaf, Download, Clock } from 'lucide-react'

const translations = {
  fr: {
    eyebrow: '✦ Pourquoi Petit Îlot',
    title: 'Conçu pour votre famille',
    featured: {
      title: 'Qualité & confiance, à chaque ressource',
      desc: 'Chaque activité est revue par nos éducateurs certifiés Montessori & Pikler. Accessible en un clic, pour des moments de qualité en famille.',
      stats: [
        { val: '500+', label: 'Activités' },
        { val: '98%', label: 'Parents satisfaits' },
        { val: '120+', label: 'Créateurs vérifiés' },
      ]
    },
    cards: [
      {
        icon: 'leaf',
        title: 'Nature & zéro écran',
        desc: 'Activités sensorielles, bricolages et recettes — sans tablette, avec amour.'
      },
      {
        icon: 'download',
        title: 'Prêt en 1 clic',
        desc: 'Téléchargez votre PDF, imprimez, jouez. Simple et immédiat.'
      },
      {
        icon: 'clock',
        title: 'Pour les 0–6 ans',
        desc: 'Des contenus adaptés à chaque âge, du tout-petit à la grande section.'
      }
    ],
    cta: 'Explorer les ressources'
  },
  en: {
    eyebrow: '✦ Why Petit Îlot',
    title: 'Designed for your family',
    featured: {
      title: 'Quality & trust, every resource',
      desc: 'Every activity is reviewed by our certified Montessori & Pikler educators. One click away, for quality family moments.',
      stats: [
        { val: '500+', label: 'Activities' },
        { val: '98%', label: 'Happy parents' },
        { val: '120+', label: 'Verified creators' },
      ]
    },
    cards: [
      {
        icon: 'leaf',
        title: 'Nature & screen-free',
        desc: 'Sensory activities, crafts and recipes — no tablet, just love.'
      },
      {
        icon: 'download',
        title: 'Ready in 1 click',
        desc: 'Download your PDF, print, play. Simple and instant.'
      },
      {
        icon: 'clock',
        title: 'Ages 0–6',
        desc: 'Content tailored to every age, from newborn to kindergarten.'
      }
    ],
    cta: 'Explore resources'
  },
  es: {
    eyebrow: '✦ Por qué Petit Îlot',
    title: 'Diseñado para tu familia',
    featured: {
      title: 'Calidad & confianza, en cada recurso',
      desc: 'Cada actividad es revisada por educadores certificados Montessori & Pikler. A un clic, para momentos de calidad en familia.',
      stats: [
        { val: '500+', label: 'Actividades' },
        { val: '98%', label: 'Padres satisfechos' },
        { val: '120+', label: 'Creadores verificados' },
      ]
    },
    cards: [
      {
        icon: 'leaf',
        title: 'Naturaleza & sin pantallas',
        desc: 'Actividades sensoriales, manualidades y recetas — sin tablet, con amor.'
      },
      {
        icon: 'download',
        title: 'Listo en 1 clic',
        desc: 'Descarga tu PDF, imprime, juega. Simple e inmediato.'
      },
      {
        icon: 'clock',
        title: 'Para 0–6 años',
        desc: 'Contenidos adaptados a cada edad, desde bebé hasta preescolar.'
      }
    ],
    cta: 'Explorar recursos'
  }
}

const iconMap = {
  leaf: Leaf,
  download: Download,
  clock: Clock,
  star: Star,
}

const iconColors = {
  leaf: 'var(--icon-sage)',
  download: 'var(--icon-terracotta)',
  clock: '#CCA6C8',
}

export default function ResourcesSection({ lang }: { lang: 'fr' | 'en' | 'es' }) {
  const t = translations[lang] || translations.fr

  return (
    <section className="py-20 md:py-28 bg-surface dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <p className="text-callout font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-3 tracking-widest uppercase">
            {t.eyebrow}
          </p>
          <h2 className="text-foreground dark:text-foreground-dark">
            {t.title}
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Featured card — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:col-span-2 card-huly rounded-[20px] p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden group"
          >
            {/* Subtle gradient accent */}
            <div
              className="absolute inset-0 opacity-[0.07] rounded-[20px] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 50%, var(--sage) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(122,139,111,0.15)' }}
              >
                <Star className="w-6 h-6" style={{ color: 'var(--icon-sage)' }} />
              </div>
              <h3 className="text-[20px] font-semibold text-foreground dark:text-foreground-dark leading-snug mb-3 max-w-sm">
                {t.featured.title}
              </h3>
              <p className="text-body text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed max-w-md">
                {t.featured.desc}
              </p>
            </div>

            {/* Stats row */}
            <div className="relative z-10 flex flex-wrap gap-6 mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
              {t.featured.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-[28px] font-bold text-foreground dark:text-foreground-dark leading-none">
                    {stat.val}
                  </div>
                  <div className="text-[12px] text-foreground-secondary dark:text-foreground-dark-secondary mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Small cards */}
          {t.cards.map((card, i) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap] || Leaf
            const iconColor = iconColors[card.icon as keyof typeof iconColors] || 'var(--icon-sage)'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.08 * (i + 1), ease: [0.25, 0.1, 0.25, 1] }}
                className="card-huly rounded-[20px] p-7 flex flex-col gap-4 min-h-[180px] relative overflow-hidden"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,0,0,0.04)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground dark:text-foreground-dark mb-2">
                    {card.title}
                  </h3>
                  <p className="text-body text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed text-[13px]">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Link href={`/${lang}/activites`}>
            <Button gem="sage" size="lg">
              {t.cta}
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
