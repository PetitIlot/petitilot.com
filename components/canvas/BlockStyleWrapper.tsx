'use client'

import React, { useState, useEffect } from 'react'
import type { BlockStyle } from '@/lib/blocks/types'

/** Parse a hex (#RGB or #RRGGBB) or rgb/rgba string into [r, g, b]. Returns null if unparseable. */
function parseColor(color: string): [number, number, number] | null {
  // #RRGGBB or #RGB
  const hex = color.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    const h = hex[1]
    if (h.length === 3) return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)]
    if (h.length >= 6) return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
  }
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgb = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]]
  return null
}

/** Generate a tinted box-shadow from an [r,g,b] color at the given elevation tier. */
function coloredShadow(rgb: [number, number, number], tier: 'sm' | 'md' | 'apple' | 'lg'): string {
  const [r, g, b] = rgb
  // Darken the shadow color by mixing with black (50%)
  const sr = Math.round(r * 0.5)
  const sg = Math.round(g * 0.5)
  const sb = Math.round(b * 0.5)
  switch (tier) {
    case 'sm':    return `0 1px 3px rgba(${sr},${sg},${sb},0.14)`
    case 'md':    return `0 1px 3px rgba(${sr},${sg},${sb},0.14), 0 4px 8px rgba(${sr},${sg},${sb},0.10)`
    case 'apple': return `0 2px 6px rgba(${sr},${sg},${sb},0.18), 0 8px 24px rgba(${sr},${sg},${sb},0.14)`
    case 'lg':    return `0 4px 12px rgba(${sr},${sg},${sb},0.22), 0 16px 40px rgba(${sr},${sg},${sb},0.16)`
  }
}

/** Resolve the effective background color string for a BlockStyle. */
function resolveBlockColor(style: BlockStyle): string | null {
  if (style.backgroundGradient) {
    // Use first gradient stop color
    return style.backgroundGradient.colors[0]?.color || null
  }
  if (style.glass) return null // semi-transparent, no solid color
  return style.backgroundColor || (
    style.backgroundPreset === 'sage' ? '#A8B5A0' :
    style.backgroundPreset === 'terracotta' ? '#D4A59A' :
    style.backgroundPreset === 'sky' ? '#C8D8E4' :
    style.backgroundPreset === 'mauve' ? '#B8A9C9' :
    null
  )
}

// ============================================
// Liquid glass alpha maps per intensity + dark mode
// ============================================
const GLASS_BG_ALPHA = {
  light:  { light: 0.10, dark: 0.08 },
  medium: { light: 0.18, dark: 0.14 },
  strong: { light: 0.28, dark: 0.22 },
} as const

const GLASS_BORDER_ALPHA = { light: 0.25, dark: 0.18 } as const
const GLASS_GLOW_ALPHA = { light: 0.12, dark: 0.10 } as const

/**
 * Compute inline styles from a BlockStyle object.
 * Shared between FreeformCanvas (editor) and BlockCanvas (published view).
 */
export function getBlockInlineStyles(style: BlockStyle, isDark = false): React.CSSProperties {
  const css: React.CSSProperties = {}

  // Background: use only longhand properties (backgroundColor) to avoid
  // React warnings when mixing shorthand (background) with longhand.
  // For gradients, use backgroundImage instead of background.
  if (style.backgroundGradient) {
    const { type, angle, colors } = style.backgroundGradient
    const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ')
    css.backgroundImage = type === 'linear'
      ? `linear-gradient(${angle || 135}deg, ${colorStops})`
      : `radial-gradient(circle, ${colorStops})`
  } else if (style.glass) {
    const intensity = style.glassIntensity || 'medium'
    const glassRgb = style.glassColor ? parseColor(style.glassColor) : null

    if (glassRgb) {
      // Tinted liquid glass
      const [r, g, b] = glassRgb
      const mode = isDark ? 'dark' : 'light'
      const alpha = GLASS_BG_ALPHA[intensity][mode]
      css.backgroundColor = `rgba(${r},${g},${b},${alpha})`
    } else {
      // Neutral white glass (original behavior)
      css.backgroundColor = intensity === 'strong'
        ? 'rgba(255,255,255,0.25)' : intensity === 'light'
        ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)'
    }

    css.backdropFilter = intensity === 'strong'
      ? 'blur(24px) saturate(180%)' : intensity === 'light'
      ? 'blur(8px) saturate(120%)' : 'blur(16px) saturate(160%)'
    css.WebkitBackdropFilter = css.backdropFilter
  } else {
    css.backgroundColor = style.backgroundColor || (
      style.backgroundPreset === 'sage' ? '#A8B5A0' :
      style.backgroundPreset === 'terracotta' ? '#D4A59A' :
      style.backgroundPreset === 'sky' ? '#C8D8E4' :
      style.backgroundPreset === 'mauve' ? '#B8A9C9' :
      style.backgroundPreset === 'surface' ? 'var(--surface)' :
      'transparent'
    )
  }

  // Border radius
  css.borderRadius = style.borderRadius || 12

  // Padding
  css.padding = style.padding || 16

  // Border
  if (style.border) {
    css.border = `${style.borderWidth || 1}px ${style.borderStyle || 'solid'} ${style.borderColor || '#E5E7EB'}`
  } else if (style.glass) {
    const glassRgb = style.glassColor ? parseColor(style.glassColor) : null
    if (glassRgb) {
      const [r, g, b] = glassRgb
      const borderAlpha = isDark ? GLASS_BORDER_ALPHA.dark : GLASS_BORDER_ALPHA.light
      css.border = `1px solid rgba(${r},${g},${b},${borderAlpha})`
    } else {
      css.border = '1px solid rgba(255,255,255,0.18)'
    }
  }

  // Opacity — handled separately via background layer, not on the whole block

  // Shadow — tinted to the block's background color
  if (style.shadow && style.shadow !== 'none') {
    const tier = style.shadow as 'sm' | 'md' | 'apple' | 'lg'
    const bgColor = resolveBlockColor(style)
    const rgb = bgColor ? parseColor(bgColor) : null
    if (rgb) {
      css.boxShadow = coloredShadow(rgb, tier)
    } else {
      // Fallback: neutral shadow for CSS variables / glass / transparent
      css.boxShadow = tier === 'sm'  ? 'var(--elevation-1)'
                    : tier === 'md'  ? 'var(--elevation-1)'
                    : tier === 'apple' ? 'var(--elevation-2)'
                    : 'var(--elevation-3)'
    }
  }

  // Inner glow for tinted glass
  if (style.glass && style.glassColor && (style.glassGlow !== false)) {
    const glowRgb = parseColor(style.glassColor)
    if (glowRgb) {
      const [r, g, b] = glowRgb
      const glowAlpha = isDark ? GLASS_GLOW_ALPHA.dark : GLASS_GLOW_ALPHA.light
      const glowShadow = `inset 0 0 20px rgba(${r},${g},${b},${glowAlpha})`
      css.boxShadow = css.boxShadow ? `${css.boxShadow}, ${glowShadow}` : glowShadow
    }
  }

  return css
}

interface BlockStyleWrapperProps {
  style: BlockStyle
  className?: string
  /** Extra inline styles merged after block styles (e.g. selection shadow) */
  extraStyle?: React.CSSProperties
  children: React.ReactNode
}

/** Compute inner content layer styles if any inner property is set. */
function getInnerStyles(style: BlockStyle): React.CSSProperties | null {
  const hasInner = style.innerBgColor || style.innerBorder || (style.innerShadow && style.innerShadow !== 'none') || style.innerBorderRadius !== undefined
  if (!hasInner) return null

  const css: React.CSSProperties = {}
  if (style.innerBgColor) css.backgroundColor = style.innerBgColor
  css.borderRadius = style.innerBorderRadius ?? 8
  if (style.innerBorder) {
    css.border = `${style.innerBorderWidth || 1}px solid ${style.innerBorderColor || '#E5E7EB'}`
  }
  if (style.innerShadow && style.innerShadow !== 'none') {
    const tier = style.innerShadow as 'sm' | 'md' | 'apple' | 'lg'
    const rgb = style.innerBgColor ? parseColor(style.innerBgColor) : null
    if (rgb) {
      css.boxShadow = coloredShadow(rgb, tier)
    } else {
      css.boxShadow = tier === 'sm' ? 'var(--elevation-1)'
                    : tier === 'md' ? 'var(--elevation-1)'
                    : tier === 'apple' ? 'var(--elevation-2)'
                    : 'var(--elevation-3)'
    }
  }
  css.padding = 12
  css.overflow = 'hidden'
  return css
}

/** Detect dark mode from document class. */
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
}

/**
 * Wraps a block's content with the computed visual styles.
 * Used in both the editor canvas and the published page.
 */
export function BlockStyleWrapper({ style, className, extraStyle, children }: BlockStyleWrapperProps) {
  const isDark = useIsDark()
  const inlineStyles = getBlockInlineStyles(style, isDark)
  const innerStyles = getInnerStyles(style)
  const hasReducedOpacity = style.opacity !== undefined && style.opacity !== 100
  const borderRadius = (style.borderRadius || 12) as number

  // Liquid glass overlays
  const hasTintedGlass = !!(style.glass && style.glassColor)
  const glassSpecular = style.glassSpecular !== false // default true
  const glassRgb = hasTintedGlass ? parseColor(style.glassColor!) : null

  // Wrap children in inner layer if configured
  const content = innerStyles
    ? <div style={innerStyles}>{children}</div>
    : children

  // Glass overlay elements
  const glassOverlays = hasTintedGlass ? (
    <>
      {/* Frost overlay — subtle white gradient for depth */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius, pointerEvents: 'none' as const,
        background: isDark
          ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(170deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.28) 100%)',
      }} />
      {/* Specular highlight — top edge reflection */}
      {glassSpecular && (
        <div style={{
          position: 'absolute', top: 0, left: '5%', right: '5%', height: '42%',
          borderRadius: `${borderRadius}px ${borderRadius}px 50% 50%`, pointerEvents: 'none' as const,
          background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.10 : 0.28}) 0%, transparent 100%)`,
        }} />
      )}
    </>
  ) : null

  if (hasReducedOpacity) {
    // Separate background from content so opacity only affects the frame
    const { backgroundColor, backgroundImage, backdropFilter, WebkitBackdropFilter, border, boxShadow, ...contentStyles } = inlineStyles
    const bgStyles: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      borderRadius: inlineStyles.borderRadius,
      backgroundColor,
      backgroundImage,
      backdropFilter,
      WebkitBackdropFilter,
      border,
      opacity: style.opacity! / 100,
      pointerEvents: 'none',
    }

    return (
      <div
        className={className}
        style={{ ...contentStyles, position: 'relative', boxShadow, borderRadius: inlineStyles.borderRadius, ...extraStyle }}
      >
        <div style={bgStyles} />
        {glassOverlays}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: inlineStyles.borderRadius }}>{content}</div>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ ...inlineStyles, overflow: 'hidden', position: hasTintedGlass ? 'relative' : undefined, ...extraStyle }}
    >
      {glassOverlays}
      {hasTintedGlass ? (
        <div style={{ position: 'relative' }}>{content}</div>
      ) : content}
    </div>
  )
}
