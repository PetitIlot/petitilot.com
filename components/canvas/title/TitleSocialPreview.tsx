'use client'

import { Heart } from 'lucide-react'
import { Button, GEMS } from '@/components/ui/button'
import type { TitleBlockData } from '@/lib/blocks/types'
import FavoriteButton from '@/components/FavoriteButton'
import RatingHearts from '@/components/RatingHearts'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface TitleSocialPreviewProps {
  data: TitleBlockData
  ressourceId?: string  // If present → real Supabase components (published mode)
  isDark?: boolean
  lang?: string
}

/**
 * Social element: favorite button + rating hearts.
 * - Editor mode (no ressourceId): static visual preview
 * - Published mode (ressourceId present): real interactive Supabase components
 */
export function TitleSocialPreview({ data, ressourceId, isDark = false, lang = 'fr' }: TitleSocialPreviewProps) {
  const social = data.social || { variant: 'classic' as const, style: 'gem' as const }
  const isCompact = social.variant === 'compact'
  const style = social.style || 'gem'
  const shape = social.shape || 'square'
  const isRound = shape === 'round'

  // If we have a real ressourceId, render functional components
  if (ressourceId) {
    const favVariant = !isCompact ? 'button' : 'icon'
    return (
      <div className={`flex flex-nowrap ${isCompact ? 'flex-col items-center gap-2' : 'items-center gap-3'}`}>
        <div className="flex-shrink-0">
          <RatingHearts ressourceId={ressourceId} variant="interactive" size="sm" lang={lang} socialStyle={style} classicColor={social.classicColor} />
        </div>
        <div className="flex-shrink-0">
          <FavoriteButton ressourceId={ressourceId} variant={favVariant} lang={lang} socialStyle={style} classicColor={social.classicColor} />
        </div>
      </div>
    )
  }

  // Static preview mode (editor)
  const g = GEMS.rose
  const glowRGB = isDark ? g.glowDark : g.glow
  const gemColor = isDark ? g.dark : g.deep
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const classicFallback = 'var(--rose)'
  const classicFilledColor = social.classicColor || classicFallback

  const ratingHeartSize = isCompact ? 14 : 17
  // Gem wrapper sizing
  const gemBoxSize = ratingHeartSize + 10
  const gemRadius = isRound ? gemBoxSize / 2 : Math.round(gemBoxSize * 0.32)
  const gemRadiusInner = isRound ? (gemBoxSize / 2) - 1 : gemRadius - 1.5
  const silverBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,205,215,0.55)'
  const tintAlpha = isDark ? 0.20 : 0.28

  // Rating hearts (static preview at 3.5/5) — 3 distinct styles
  const staticRating = 3.5
  const ratingHearts = [1, 2, 3, 4, 5].map(i => {
    const filled = i <= Math.round(staticRating)

    if (style === 'classic') {
      // Classic: simple outline/fill, no gem chrome
      return (
        <Heart
          key={i}
          style={{
            width: ratingHeartSize, height: ratingHeartSize,
            fill: filled ? classicFilledColor : 'none',
            color: filled ? classicFilledColor : (isDark ? 'rgba(var(--rose-rgb),0.30)' : 'rgba(var(--rose-rgb),0.30)'),
            strokeWidth: filled ? 0 : 1.5,
            filter: 'none',
          }}
        />
      )
    }

    if (style === 'gem-outline') {
      // Gem-outline: white heart, rose glass outline wrapper, filled = luminous glow border
      const outlineBorder = filled
        ? `rgba(${glowRGB},${isDark ? 0.85 : 0.70})`
        : isDark ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)` : `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`
      return (
        <div
          key={i}
          style={{
            width: gemBoxSize, height: gemBoxSize, borderRadius: gemRadius, padding: 1,
            background: filled
              ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})`
              : silverBorder,
            boxShadow: filled
              ? `0 0 8px rgba(${glowRGB},${isDark ? 0.50 : 0.35}), 0 0 3px rgba(${glowRGB},${isDark ? 0.30 : 0.20}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`
              : `0 1px 3px rgba(0,0,0,${isDark ? 0.20 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.50})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: gemRadiusInner,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${outlineBorder}`,
          }}>
            <Heart style={{
              width: ratingHeartSize * 0.7, height: ratingHeartSize * 0.7,
              fill: filled ? 'white' : 'none',
              color: filled ? 'white' : (isDark ? `rgba(255,255,255,0.50)` : `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`),
              strokeWidth: filled ? 0 : 1.5,
              filter: filled ? `drop-shadow(0 0 3px rgba(${glowRGB},${isDark ? 0.60 : 0.45}))` : 'none',
            }} />
          </div>
        </div>
      )
    }

    // Gem (default): silver border wrapper, red tinted glass, filled = glow illumination
    return (
      <div
        key={i}
        style={{
          width: gemBoxSize, height: gemBoxSize, borderRadius: gemRadius, padding: 1,
          background: filled
            ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})`
            : silverBorder,
          boxShadow: filled
            ? `0 0 10px rgba(${glowRGB},${isDark ? 0.55 : 0.40}), 0 0 4px rgba(${glowRGB},${isDark ? 0.35 : 0.25}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`
            : `0 1px 3px rgba(0,0,0,${isDark ? 0.20 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.50})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '100%', height: '100%', borderRadius: gemRadiusInner,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          background: `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.06}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.04}) 100%)`,
          backdropFilter: 'blur(8px) saturate(130%)',
          WebkitBackdropFilter: 'blur(8px) saturate(130%)',
          border: 'none',
        }}>
          {/* Frost overlay */}
          <span aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: gemRadiusInner,
            background: isDark
              ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(170deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.40) 100%)',
          }} />
          {/* Glow overlay when filled */}
          {filled && (
            <span aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: gemRadiusInner,
              background: `radial-gradient(circle at 50% 50%, rgba(${glowRGB},${isDark ? 0.50 : 0.55}) 0%, rgba(${glowRGB},${isDark ? 0.15 : 0.18}) 60%, transparent 100%)`,
            }} />
          )}
          <Heart style={{
            position: 'relative', zIndex: 2,
            width: ratingHeartSize * 0.7, height: ratingHeartSize * 0.7,
            fill: filled ? (isDark ? g.dark : g.deep) : 'none',
            color: filled ? (isDark ? g.dark : g.deep) : (isDark ? `rgba(${g.glowDark},0.40)` : `rgba(${g.glow},0.40)`),
            strokeWidth: filled ? 0 : 1.5,
            filter: filled ? `drop-shadow(0 0 3px rgba(${glowRGB},${isDark ? 0.55 : 0.35}))` : 'none',
          }} />
        </div>
      </div>
    )
  })

  // Favorite button preview — depends on style (gem/outline/classic) and variant (classic/compact)
  // Shape: round → rond (icon) / pillule (button with text) | square → carré (actuel)
  let favoritePreview: React.ReactNode

  if (!isCompact) {
    // Variante classique → full button with text
    if (style === 'classic') {
      favoritePreview = (
        <button
          className="flex items-center gap-2 px-4 py-2 border transition-colors"
          style={{
            borderRadius: isRound ? '9999px' : '12px',
            borderColor: social.classicColor || classicFallback,
            color: social.classicColor || classicFallback,
          }}
        >
          <Heart style={{ width: 16, height: 16, strokeWidth: 2 }} />
          <span className="text-sm font-medium">Ajouter aux favoris</span>
        </button>
      )
    } else if (style === 'gem-outline') {
      favoritePreview = (
        <Button gem="rose" variant="outline" size="sm" pill={isRound}>
          <Heart className="w-4 h-4" />
          Ajouter aux favoris
        </Button>
      )
    } else {
      favoritePreview = (
        <Button gem="rose" variant="default" size="sm" pill={isRound}>
          <Heart className="w-4 h-4" />
          Ajouter aux favoris
        </Button>
      )
    }
  } else {
    // Variante compact → icon only
    if (style === 'classic') {
      favoritePreview = (
        <button
          className="flex items-center justify-center w-9 h-9 border transition-colors"
          style={{
            borderRadius: isRound ? '9999px' : '12px',
            borderColor: social.classicColor || classicFallback,
            color: social.classicColor || classicFallback,
          }}
        >
          <Heart style={{ width: 16, height: 16, strokeWidth: 2 }} />
        </button>
      )
    } else if (style === 'gem-outline') {
      favoritePreview = (
        <Button gem="rose" variant="outline" size="icon" pill={isRound}>
          <Heart className="w-4 h-4" />
        </Button>
      )
    } else {
      favoritePreview = (
        <Button gem="rose" variant="default" size="icon" pill={isRound}>
          <Heart className="w-4 h-4" />
        </Button>
      )
    }
  }

  return (
    <div className={`flex ${isCompact ? 'flex-col items-center gap-2' : 'items-center gap-3'}`}>
      {/* Rating hearts */}
      <div className="flex items-center gap-0.5">
        {ratingHearts}
        <span className="text-[10px] ml-1" style={{ color: isDark ? 'rgba(200,205,215,0.55)' : 'rgba(93,90,78,0.50)' }}>
          ({staticRating.toFixed(1)})
        </span>
      </div>

      {/* Favorite button */}
      {favoritePreview}
    </div>
  )
}
