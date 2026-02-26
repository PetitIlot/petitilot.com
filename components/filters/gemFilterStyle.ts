import { GEMS } from '@/components/ui/button'
import type { GemColor } from '@/components/ui/button'

export type { GemColor }
export { GEMS }

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/**
 * Retourne les styles inline pour un bouton-pill de filtre gemstone.
 * `isSelected` contrôle l'état actif/inactif.
 */
export function gemPillStyle(gem: GemColor, isSelected: boolean, isDark: boolean) {
  const g = GEMS[gem]
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const glowRGB = isDark ? g.glowDark : g.glow

  const wrapper = {
    borderRadius: 20,
    padding: 1.5 as number,
    background: isSelected
      ? `linear-gradient(135deg, rgba(${glowRGB},0.65) 0%, rgba(${glowRGB},0.35) 50%, rgba(${glowRGB},0.55) 100%)`
      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)'),
    boxShadow: isSelected
      ? `0 0 12px rgba(${glowRGB},${isDark ? 0.4 : 0.25}), 0 1px 4px rgba(0,0,0,${isDark ? 0.2 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.12 : 0.4})`
      : `0 1px 3px rgba(0,0,0,${isDark ? 0.15 : 0.04}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.4})`,
  }

  const inner: Record<string, string | number> = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 18.5,
    fontSize: 13,
    fontWeight: 650,
    letterSpacing: '-0.01em',
    transition: 'all 0.3s ease',
    color: isSelected
      ? (isDark ? g.textDark : g.text)
      : (isDark ? '#C8CED6' : '#5D5A4E'),
    background: isSelected
      ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.26 : 0.34}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.20 : 0.26}) 100%)`
      : (isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)'),
    backdropFilter: isSelected ? 'blur(10px) saturate(130%)' : 'none',
    WebkitBackdropFilter: isSelected ? 'blur(10px) saturate(130%)' : 'none',
  }

  const frost = {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
    background: isDark
      ? 'linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : 'linear-gradient(170deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.36) 100%)',
    borderRadius: 18.5,
  }

  const shine = {
    position: 'absolute' as const,
    top: 0,
    left: '8%',
    right: '8%',
    height: '45%',
    pointerEvents: 'none' as const,
    background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.08 : 0.25}) 0%, transparent 100%)`,
    borderRadius: '18.5px 18.5px 50% 50%',
  }

  return { wrapper, inner, frost, shine }
}

/**
 * Même style mais pour les boutons segmentés (rounded-xl, pas rounded-full).
 */
export function gemSegmentStyle(gem: GemColor, isSelected: boolean, isDark: boolean) {
  const g = GEMS[gem]
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const glowRGB = isDark ? g.glowDark : g.glow

  return {
    color: isSelected
      ? (isDark ? g.textDark : g.text)
      : (isDark ? '#C8CED6' : 'var(--foreground-secondary)'),
    background: isSelected
      ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.28 : 0.36}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.22 : 0.28}) 100%)`
      : undefined,
    boxShadow: isSelected
      ? `inset 0 0 10px rgba(${glowRGB},${isDark ? 0.25 : 0.15}), 0 0 8px rgba(${glowRGB},${isDark ? 0.3 : 0.15})`
      : undefined,
  }
}
