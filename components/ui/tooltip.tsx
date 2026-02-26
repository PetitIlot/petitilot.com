'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Tooltip — Infobulle spring animée
 *
 * Apparition spring avec ombre portée et flèche directionnelle.
 *
 * Usage :
 *   <Tooltip content="Texte d'aide">
 *     <button>Hover me</button>
 *   </Tooltip>
 */

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: 'top' | 'bottom'
  delay?: number
}

export function Tooltip({ children, content, side = 'top', delay = 300 }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), delay)
  }

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const isTop = side === 'top'

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: isTop ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? 4 : -4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute z-50 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[var(--foreground)] shadow-elevation-2 whitespace-nowrap pointer-events-none ${
              isTop ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {content}
            {/* Flèche */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--foreground)] rotate-45 ${
                isTop ? '-bottom-1' : '-top-1'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
