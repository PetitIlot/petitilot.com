'use client'

import { motion } from 'framer-motion'
import ActivityCard from '@/components/cards/ActivityCard'
import type { Ressource, Language } from '@/lib/types'

interface ActivitiesGridProps {
  activities: Ressource[]
  lang: Language
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    }
  }
}

export default function ActivitiesGrid({ activities, lang }: ActivitiesGridProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-body">
          {lang === 'fr' ? 'Aucun contenu disponible pour le moment.' : 'No content available at the moment.'}
        </p>
      </div>
    )
  }

  const renderCard = (item: Ressource) => {
    return <ActivityCard key={item.id} activity={item} lang={lang} />
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {activities.map((item) => (
        <motion.div key={item.id} variants={cardVariants}>
          {renderCard(item)}
        </motion.div>
      ))}
    </motion.div>
  )
}
