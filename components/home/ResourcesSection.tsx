'use client'

import { Download, Users, Leaf, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: Leaf,
    iconColor: 'var(--icon-sage)',
    bgColor: 'transparent',
    titleFr: 'Approche nature & zéro écran',
    titleEn: 'Nature & screen-free approach',
    titleEs: 'Enfoque naturaleza y sin pantallas',
    descFr: 'Activités éducatives inspirées Montessori, privilégiant le contact avec la nature et les expériences sensorielles',
    descEn: 'Montessori-inspired educational activities, focusing on nature contact and sensory experiences',
    descEs: 'Actividades educativas inspiradas en Montessori, privilegiando el contacto con la naturaleza'
  },
  {
    icon: Shield,
    iconColor: 'var(--icon-sky)',
    bgColor: 'transparent',
    titleFr: 'Ressources validées par des experts',
    titleEn: 'Expert-validated resources',
    titleEs: 'Recursos validados por expertos',
    descFr: 'Chaque activité est vérifiée par notre équipe pour garantir qualité pédagogique et sécurité',
    descEn: 'Each activity is verified by our team to ensure educational quality and safety',
    descEs: 'Cada actividad es verificada por nuestro equipo para garantizar calidad pedagógica'
  },
  {
    icon: Download,
    iconColor: 'var(--icon-terracotta)',
    bgColor: 'transparent',
    titleFr: 'PDF prêts à imprimer',
    titleEn: 'Print-ready PDFs',
    titleEs: 'PDFs listos para imprimir',
    descFr: 'Téléchargez instantanément des fiches d\'activités, recettes et supports pédagogiques',
    descEn: 'Instantly download activity sheets, recipes and educational materials',
    descEs: 'Descarga instantáneamente fichas de actividades, recetas y materiales pedagógicos'
  },
  {
    icon: Users,
    iconColor: '#CCA6C8',
    iconColorDark: '#FF80EA',
    bgColor: 'transparent',
    bgColorDark: 'transparent',
    titleFr: 'Créateurs rémunérés équitablement',
    titleEn: 'Fairly paid creators',
    titleEs: 'Creadores pagados justamente',
    descFr: '90% de chaque vente revient aux éducateurs et parents qui partagent leurs créations',
    descEn: '90% of each sale goes to educators and parents who share their creations',
    descEs: 'El 90% de cada venta va a los educadores y padres que comparten sus creaciones'
  }
]

const translations = {
  fr: {
    title: 'Ressources pédagogiques pour la petite enfance',
    subtitle: 'Découvrez des activités éducatives créées par des professionnels de la petite enfance : éducateurs Montessori, enseignants et parents expérimentés. Idéal pour accompagner le développement des enfants de 0 à 6 ans.',
    exploreCta: 'Explorer les ressources',
    contactCta: 'Une question ? Contactez-nous'
  },
  en: {
    title: 'Educational resources for early childhood',
    subtitle: 'Discover educational activities created by early childhood professionals: Montessori educators, teachers and experienced parents. Ideal for supporting the development of children aged 0 to 6.',
    exploreCta: 'Explore resources',
    contactCta: 'Questions? Contact us'
  },
  es: {
    title: 'Recursos pedagógicos para la primera infancia',
    subtitle: 'Descubre actividades educativas creadas por profesionales de la primera infancia: educadores Montessori, maestros y padres experimentados. Ideal para acompañar el desarrollo de niños de 0 a 6 años.',
    exploreCta: 'Explorar recursos',
    contactCta: '¿Preguntas? Contáctanos'
  }
}

export default function ResourcesSection({ lang }: { lang: 'fr' | 'en' | 'es' }) {
  const t = translations[lang]
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Détecter le mode sombre
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()

    // Observer les changements de classe
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -20 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15
      }
    }
  }

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-foreground mb-5">
            {t.title}
          </h2>
          <p className="text-body-large text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const title = lang === 'fr' ? feature.titleFr : lang === 'en' ? feature.titleEn : feature.titleEs
            const desc = lang === 'fr' ? feature.descFr : lang === 'en' ? feature.descEn : feature.descEs

            // Gérer les couleurs spéciales (mauve) vs variables CSS
            const iconColor = feature.iconColorDark
              ? (isDark ? feature.iconColorDark : feature.iconColor)
              : feature.iconColor
            const bgColor = feature.bgColorDark
              ? (isDark ? feature.bgColorDark : feature.bgColor)
              : feature.bgColor

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:shadow-lg"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="w-8 h-8" style={{ color: iconColor }} />
                </motion.div>
                <h3 className="text-title text-foreground mb-3 font-semibold">
                  {title}
                </h3>
                <p className="text-body text-foreground-secondary leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
        >
          <Link href={`/${lang}/activites`} className="group">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-2xl hover:scale-108 hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#7FFF7F' : '#7BA376',
                color: isDark ? '#1E1E1E' : '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#9FFF9F' : '#8BA386'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#7FFF7F' : '#7BA376'
              }}
            >
              {t.exploreCta}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
          <div className="inline-flex items-center px-8 py-6 text-base font-medium text-foreground/70">
            <span>{lang === 'fr' ? 'Une question ? ' : lang === 'en' ? 'Questions? ' : '¿Preguntas? '}</span>
            <Link
              href={`/${lang}/contact`}
              className="relative text-foreground/70 hover:text-foreground transition-colors duration-300"
              style={{ display: 'inline-block' }}
              onMouseEnter={(e) => {
                const target = e.currentTarget
                target.style.transform = 'scale(1.1)'
                const underline = target.querySelector('.underline-bar') as HTMLElement
                if (underline) underline.style.width = '100%'
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget
                target.style.transform = 'scale(1)'
                const underline = target.querySelector('.underline-bar') as HTMLElement
                if (underline) underline.style.width = '0'
              }}
            >
              {lang === 'fr' ? 'Contactez-nous' : lang === 'en' ? 'Contact us' : 'Contáctanos'}
              <span
                className="underline-bar absolute left-0 h-0.5 bg-current transition-all duration-300 ease-out"
                style={{ bottom: '-2px', width: '0' }}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
