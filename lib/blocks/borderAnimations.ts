/**
 * Border Animation helpers for Title Block v4
 * Maps animation types to CSS classes and custom properties.
 */

import type { BorderAnimationType } from './types'

/**
 * Returns the CSS class name for a given border animation type.
 */
export function getBorderAnimationClass(type: BorderAnimationType): string {
  switch (type) {
    case 'traveling-light':
      return 'border-anim-traveling-light'
    case 'pulsating-shine':
      return 'border-anim-pulsating-shine'
    case 'gradient-spin':
      return 'border-anim-gradient-spin'
    default:
      return ''
  }
}

/**
 * Returns CSS custom properties for a border animation.
 * speed: 1 (slow) to 10 (fast), default 5
 */
export function getBorderAnimationVars(animation: {
  type: BorderAnimationType
  speed?: number
  color?: string
}): React.CSSProperties {
  if (!animation.type || animation.type === 'none') return {}

  const speed = animation.speed ?? 5
  // Map speed 1-10 to duration: 1=6s (slow), 10=1s (fast)
  const duration = Math.max(1, 7 - (speed * 0.6))

  return {
    '--border-anim-color': animation.color || 'var(--sage)',
    '--border-anim-duration': `${duration}s`,
    '--border-anim-width': '2px',
  } as React.CSSProperties
}
