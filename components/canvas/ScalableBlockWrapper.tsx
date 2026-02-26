'use client'

import React from 'react'

interface ScalableBlockWrapperProps {
  children: React.ReactNode
  /** Scale factor from block.position.scale (1 = no scaling) */
  scale?: number
  /** Additional className on the outer container */
  className?: string
}

/**
 * ScalableBlockWrapper — Applies proportional scaling to block content.
 *
 * Two resize modes (controlled by holding Tab in FreeformCanvas):
 *   - Normal resize (mouse only): changes block width/height, content reflows naturally
 *   - Scale resize (Tab + mouse): changes block.position.scale, content scales proportionally
 *
 * This wrapper only handles rendering the scale transform.
 * The scale value is computed and stored by FreeformCanvas during resize.
 */
export default function ScalableBlockWrapper({
  children,
  scale = 1,
  className,
}: ScalableBlockWrapperProps) {
  // No scaling needed
  if (!scale || scale === 1) {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          // Expand render area so content renders at natural size,
          // then scale shrinks/expands it to fit the container
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
