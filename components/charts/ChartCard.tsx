'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  delay?: number
}

export function ChartCard({ title, subtitle, icon, action, children, className = '', delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 300 }}
      whileHover={{ y: -4, transition: { type: 'spring', damping: 20, stiffness: 400 } }}
      className={`card-huly ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="card-huly-meta w-7 h-7 flex items-center justify-center flex-shrink-0 p-0 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground dark:text-foreground-dark leading-tight">{title}</p>
              {subtitle && (
                <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        {/* Content in glass body */}
        <div className="card-glass-body">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
