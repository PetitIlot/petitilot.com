import * as React from 'react'

/**
 * Skeleton — Shimmer loading placeholder
 *
 * Remplace les spinners par des zones de chargement élégantes.
 * Utilise l'animation shimmer définie dans globals.css.
 *
 * Usage :
 *   <Skeleton className="h-4 w-40" />           // Ligne de texte
 *   <Skeleton className="h-48 w-full" />         // Image
 *   <Skeleton className="h-10 w-10 rounded-full" /> // Avatar
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton animate-pulse ${className}`}
      {...props}
    />
  )
}

/**
 * SkeletonCard — Squelette complet pour une carte ressource
 */
function SkeletonCard() {
  return (
    <div className="bg-[var(--surface)] rounded-2xl overflow-hidden shadow-elevation-1" style={{ border: '1px solid var(--border)' }}>
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <div className="pt-3 border-t border-[var(--border)] flex items-center gap-2.5">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * SkeletonText — Plusieurs lignes de texte skeleton
 */
function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonText }
