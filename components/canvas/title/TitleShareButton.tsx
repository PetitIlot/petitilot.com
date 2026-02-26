'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { Button, GEMS } from '@/components/ui/button'
import type { TitleBlockData, GemColor } from '@/lib/blocks/types'
import { ShareModal } from '@/components/ShareModal'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface FormDataForShare {
  title?: string
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
}

interface TitleShareButtonProps {
  data: TitleBlockData
  ressourceId?: string  // present = published mode (functional), absent = editor preview
  isDark?: boolean
  formData?: FormDataForShare
}

/**
 * Share element: share button.
 * - Editor mode (no ressourceId): static visual preview
 * - Published mode (ressourceId present): opens ShareModal
 */
export function TitleShareButton({ data, ressourceId, isDark = false, formData }: TitleShareButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const share = data.share || {
    variant: 'classic' as const,
    style: 'gem' as const,
    shape: 'square' as const,
    text: 'Partager',
    gem: 'sage' as GemColor,
  }

  const isCompact = share.variant === 'compact'
  const style = share.style || 'gem'
  const shape = share.shape || 'square'
  const isRound = shape === 'round'
  const gem = (share.gem || 'sage') as GemColor
  const buttonText = share.text || 'Partager'
  const classicColor = share.classicColor || 'var(--sage)'

  const handleClick = () => {
    if (ressourceId) setShowModal(true)
    // In editor mode: no-op (button is visual only)
  }

  // --- Static gem pill (editor preview for gem/gem-outline styles) ---
  // For editor mode we render a minimal gem-styled preview, not interactive
  const g = GEMS[gem] || GEMS.sage
  const glowRGB = isDark ? g.glowDark : g.glow
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const tintAlpha = isDark ? 0.18 : 0.24
  const gemRadius = isRound ? 9999 : 12
  const gemInnerRadius = isRound ? 9999 : 10

  // --- Button rendering ---
  let button: React.ReactNode

  if (!isCompact) {
    // === Classic variant: full button with text ===
    if (style === 'classic') {
      button = (
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 border transition-colors"
          style={{
            borderRadius: isRound ? '9999px' : '12px',
            borderColor: classicColor,
            color: classicColor,
            cursor: ressourceId ? 'pointer' : 'default',
          }}
        >
          <Share2 style={{ width: 16, height: 16, strokeWidth: 2 }} />
          <span className="text-sm font-medium">{buttonText}</span>
        </button>
      )
    } else if (style === 'gem-outline') {
      button = (
        <Button gem={gem} variant="outline" size="sm" pill={isRound} onClick={handleClick}>
          <Share2 className="w-4 h-4" />
          {buttonText}
        </Button>
      )
    } else {
      // gem (default)
      button = (
        <Button gem={gem} variant="default" size="sm" pill={isRound} onClick={handleClick}>
          <Share2 className="w-4 h-4" />
          {buttonText}
        </Button>
      )
    }
  } else {
    // === Compact variant: icon only ===
    const boxSize = 34

    if (style === 'classic') {
      button = (
        <button
          onClick={handleClick}
          className="flex items-center justify-center border transition-colors"
          style={{
            width: boxSize, height: boxSize,
            borderRadius: isRound ? '9999px' : '12px',
            borderColor: classicColor,
            color: classicColor,
            cursor: ressourceId ? 'pointer' : 'default',
          }}
        >
          <Share2 style={{ width: 16, height: 16, strokeWidth: 2 }} />
        </button>
      )
    } else if (style === 'gem-outline') {
      // Gem-outline compact: glass outline pill
      button = (
        <div
          onClick={handleClick}
          style={{
            width: boxSize, height: boxSize, borderRadius: gemRadius, padding: 1,
            background: `rgba(${glowRGB},${isDark ? 0.55 : 0.40})`,
            boxShadow: `0 0 8px rgba(${glowRGB},${isDark ? 0.40 : 0.28}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: ressourceId ? 'pointer' : 'default',
          }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: gemInnerRadius,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.85)',
            border: `1px solid rgba(${glowRGB},${isDark ? 0.70 : 0.55})`,
          }}>
            <Share2 style={{
              width: 14, height: 14,
              color: isDark ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)` : `rgba(${rgb.r},${rgb.g},${rgb.b},0.90)`,
              strokeWidth: 2,
            }} />
          </div>
        </div>
      )
    } else {
      // gem compact: glass tinted pill
      button = (
        <div
          onClick={handleClick}
          style={{
            width: boxSize, height: boxSize, borderRadius: gemRadius, padding: 1,
            background: `rgba(${glowRGB},${isDark ? 0.65 : 0.50})`,
            boxShadow: `0 0 10px rgba(${glowRGB},${isDark ? 0.50 : 0.35}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: ressourceId ? 'pointer' : 'default',
          }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: gemInnerRadius,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: `linear-gradient(160deg, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.08}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha}) 100%)`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}>
            <span aria-hidden style={{
              position: 'absolute', inset: 0, borderRadius: gemInnerRadius, pointerEvents: 'none',
              background: isDark
                ? 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)'
                : 'linear-gradient(160deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.30) 100%)',
            }} />
            <Share2 style={{
              position: 'relative', zIndex: 2,
              width: 14, height: 14,
              color: isDark ? g.dark : g.deep,
              strokeWidth: 2,
              filter: `drop-shadow(0 0 3px rgba(${glowRGB},${isDark ? 0.50 : 0.35}))`,
            }} />
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {button}
      {showModal && ressourceId && (
        <ShareModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          ressourceId={ressourceId}
          title={formData?.title || 'Ressource Petit Ilot'}
          ageMin={formData?.age_min}
          ageMax={formData?.age_max}
          duration={formData?.duration}
        />
      )}
    </>
  )
}
