'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, Sparkles, CreditCard, BarChart2, TrendingUp } from 'lucide-react'

const translations = {
  fr: {
    eyebrow: '✦ Pour les créateurs',
    title: 'Votre mini-site.\nVos règles.',
    subtitle: 'Lancez votre espace créateur en quelques minutes — sans code, sans frais fixes. Seulement 10% sur vos ventes.',
    features: [
      {
        icon: 'globe',
        title: 'Page créateur personnalisée',
        desc: 'Votre mini-site avec votre identité, vos ressources, votre bio — prêt en 5 minutes.'
      },
      {
        icon: 'sparkles',
        title: 'Fiches ressources sur mesure',
        desc: 'Éditeur simple, beau résultat. Vos fiches aux couleurs de votre marque.'
      },
      {
        icon: 'card',
        title: 'Paiements Stripe — 0€ fixe',
        desc: 'Encaissez facilement. Seulement 10% de commission sur vos ventes.'
      },
      {
        icon: 'chart',
        title: 'Dashboard & analytics',
        desc: 'Suivez vos ventes, téléchargements et audience en temps réel.'
      }
    ],
    cta: 'Devenir créateur — c\'est gratuit',
    dashboard: {
      title: 'Tableau de bord créateur',
      stats: [
        { val: '347', label: 'Ventes', color: '#7A8B6F' },
        { val: '€892', label: 'Revenus nets', color: '#9B7EC8' },
        { val: '4.9★', label: 'Note moy.', color: '#C4836A' },
      ],
      recent: [
        { name: 'Herbier de printemps', amount: '+€4.90', color: '#7A8B6F' },
        { name: 'Bac sensoriel lavande', amount: '+€3.50', color: '#9B7EC8' },
        { name: 'Peinture aux doigts', amount: '+€6.00', color: '#9B7EC8' },
        { name: 'Pain surprise coloré', amount: '+€5.20', color: '#7A8B6F' },
      ],
      chartLabel: 'Ventes ce mois',
    }
  },
  en: {
    eyebrow: '✦ For creators',
    title: 'Your mini-site.\nYour rules.',
    subtitle: 'Launch your creator space in minutes — no code, no fixed fees. Just 10% on your sales.',
    features: [
      {
        icon: 'globe',
        title: 'Personalized creator page',
        desc: 'Your mini-site with your identity, resources, bio — ready in 5 minutes.'
      },
      {
        icon: 'sparkles',
        title: 'Custom resource sheets',
        desc: 'Simple editor, beautiful results. Your PDFs in your brand colors.'
      },
      {
        icon: 'card',
        title: 'Stripe payments — €0 fixed',
        desc: 'Easy payouts. Only 10% commission on your sales.'
      },
      {
        icon: 'chart',
        title: 'Dashboard & analytics',
        desc: 'Track your sales, downloads and audience in real time.'
      }
    ],
    cta: 'Become a creator — it\'s free',
    dashboard: {
      title: 'Creator dashboard',
      stats: [
        { val: '347', label: 'Sales', color: '#7A8B6F' },
        { val: '€892', label: 'Net revenue', color: '#9B7EC8' },
        { val: '4.9★', label: 'Avg. rating', color: '#C4836A' },
      ],
      recent: [
        { name: 'Spring herbarium', amount: '+€4.90', color: '#7A8B6F' },
        { name: 'Lavender sensory bin', amount: '+€3.50', color: '#9B7EC8' },
        { name: 'Finger painting', amount: '+€6.00', color: '#9B7EC8' },
        { name: 'Surprise bread', amount: '+€5.20', color: '#7A8B6F' },
      ],
      chartLabel: 'Sales this month',
    }
  },
  es: {
    eyebrow: '✦ Para creadores',
    title: 'Tu mini-sitio.\nTus reglas.',
    subtitle: 'Lanza tu espacio creador en minutos — sin código, sin tarifas fijas. Solo 10% sobre tus ventas.',
    features: [
      {
        icon: 'globe',
        title: 'Página creador personalizada',
        desc: 'Tu mini-sitio con tu identidad, recursos, bio — listo en 5 minutos.'
      },
      {
        icon: 'sparkles',
        title: 'Fichas de recursos a medida',
        desc: 'Editor simple, bello resultado. Tus PDF en los colores de tu marca.'
      },
      {
        icon: 'card',
        title: 'Pagos Stripe — €0 fijo',
        desc: 'Cobra fácilmente. Solo 10% de comisión sobre tus ventas.'
      },
      {
        icon: 'chart',
        title: 'Dashboard & analytics',
        desc: 'Sigue tus ventas, descargas y audiencia en tiempo real.'
      }
    ],
    cta: 'Convertirse en creador — es gratis',
    dashboard: {
      title: 'Panel de creador',
      stats: [
        { val: '347', label: 'Ventas', color: '#7A8B6F' },
        { val: '€892', label: 'Ingresos netos', color: '#9B7EC8' },
        { val: '4.9★', label: 'Nota media', color: '#C4836A' },
      ],
      recent: [
        { name: 'Herbario de primavera', amount: '+€4.90', color: '#7A8B6F' },
        { name: 'Bac sensorial lavanda', amount: '+€3.50', color: '#9B7EC8' },
        { name: 'Pintura de dedos', amount: '+€6.00', color: '#9B7EC8' },
        { name: 'Pan sorpresa', amount: '+€5.20', color: '#7A8B6F' },
      ],
      chartLabel: 'Ventas este mes',
    }
  }
}

const iconMap = {
  globe: Globe,
  sparkles: Sparkles,
  card: CreditCard,
  chart: BarChart2,
}

const iconBg = {
  globe: 'rgba(122,139,111,0.12)',
  sparkles: 'rgba(155,126,200,0.12)',
  card: 'rgba(196,131,106,0.12)',
  chart: 'rgba(100,150,200,0.12)',
}

const iconCol = {
  globe: 'var(--icon-sage)',
  sparkles: '#9B7EC8',
  card: 'var(--icon-terracotta)',
  chart: '#5BA0D0',
}

// Mini bar chart heights (fake data)
const chartBars = [30, 45, 38, 60, 55, 72, 65, 80, 70, 88, 82, 95]

export default function WhyCreatorsSection({ lang }: { lang: 'fr' | 'en' | 'es' }) {
  const t = translations[lang] || translations.fr

  return (
    <section className="py-24 md:py-32 bg-surface dark:bg-surface-dark overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text + features + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-callout font-medium text-foreground-secondary dark:text-foreground-dark-secondary mb-4 tracking-widest uppercase">
              {t.eyebrow}
            </p>
            <h2 className="text-foreground dark:text-foreground-dark leading-tight mb-5 whitespace-pre-line">
              {t.title}
            </h2>
            <p className="text-body-large text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed mb-10 max-w-md">
              {t.subtitle}
            </p>

            {/* Feature list */}
            <ul className="space-y-5 mb-10">
              {t.features.map((f, i) => {
                const Icon = iconMap[f.icon as keyof typeof iconMap] || Globe
                const bg = iconBg[f.icon as keyof typeof iconBg]
                const col = iconCol[f.icon as keyof typeof iconCol]

                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: bg }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: col, width: 18, height: 18 }} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-foreground dark:text-foreground-dark mb-1">
                        {f.title}
                      </h4>
                      <p className="text-[13px] text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </motion.li>
                )
              })}
            </ul>

            <Link href={`/${lang}/devenir-createur`}>
              <Button gem="sage" size="lg">
                {t.cta}
              </Button>
            </Link>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-3xl opacity-20 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(122,139,111,0.4) 0%, rgba(155,126,200,0.2) 50%, transparent 80%)' }}
            />

            {/* Browser chrome mockup */}
            <div className="card-huly rounded-2xl overflow-hidden relative shadow-2xl">

              {/* Top bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: '#FF6B6B' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#FFD93D' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: '#6BCB77' }} />
                </div>
                <span className="text-[11px] text-foreground-secondary dark:text-foreground-dark-secondary font-medium mx-auto">
                  {t.dashboard.title}
                </span>
              </div>

              {/* Dashboard body */}
              <div className="p-5 space-y-5">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {t.dashboard.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                      className="card-glass-body rounded-xl p-3 text-center"
                    >
                      <div
                        className="text-[22px] font-bold leading-none mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.val}
                      </div>
                      <div className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mini chart */}
                <div className="card-glass-body rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-foreground dark:text-foreground-dark">
                      {t.dashboard.chartLabel}
                    </span>
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: '#7A8B6F' }} />
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {chartBars.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i + 0.3, duration: 0.5, ease: 'easeOut' }}
                        className="flex-1 rounded-sm"
                        style={{ background: i >= 8 ? '#7A8B6F' : 'rgba(122,139,111,0.3)' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Recent sales */}
                <div className="card-glass-body rounded-xl p-4 space-y-2.5">
                  {t.dashboard.recent.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[12px] text-foreground dark:text-foreground-dark truncate max-w-[160px]">
                        {item.name}
                      </span>
                      <span
                        className="text-[12px] font-semibold flex-shrink-0"
                        style={{ color: item.color }}
                      >
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
