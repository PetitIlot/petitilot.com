'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * ScrollReveal — Wrapper pour fadeIn + slideUp au scroll
 *
 * Utilise Framer Motion whileInView pour déclencher l'animation
 * quand l'élément entre dans le viewport.
 *
 * Usage :
 *   <ScrollReveal>
 *     <h2>Contenu qui apparaît</h2>
 *   </ScrollReveal>
 *
 *   <ScrollReveal delay={0.2} direction="left">
 *     <Card />
 *   </ScrollReveal>
 */

interface ScrollRevealProps {
  children: ReactNode
  /** Délai avant l'animation (en secondes) */
  delay?: number
  /** Direction du slide : up (défaut), down, left, right */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Distance du slide en pixels */
  distance?: number
  /** Durée de l'animation */
  duration?: number
  /** Ne jouer l'animation qu'une seule fois */
  once?: boolean
  /** Pourcentage de l'élément visible pour déclencher (0-1) */
  threshold?: number
  /** className supplémentaire */
  className?: string
}

const directionOffsets = {
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  distance,
  duration = 0.5,
  once = true,
  threshold = 0.15,
  className = '',
}: ScrollRevealProps) {
  const offset = directionOffsets[direction]
  const d = distance ?? Math.abs(offset.x || offset.y)
  const initialOffset = {
    x: offset.x !== 0 ? (offset.x > 0 ? d : -d) : 0,
    y: offset.y !== 0 ? (offset.y > 0 ? d : -d) : 0,
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: initialOffset.x,
      y: initialOffset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // spring-smooth
      },
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealGroup — Conteneur pour animations staggered
 *
 * Usage :
 *   <ScrollRevealGroup>
 *     <ScrollReveal><Card /></ScrollReveal>
 *     <ScrollReveal><Card /></ScrollReveal>
 *   </ScrollRevealGroup>
 */
export function ScrollRevealGroup({
  children,
  stagger = 0.1,
  className = '',
}: {
  children: ReactNode
  stagger?: number
  className?: string
}) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
