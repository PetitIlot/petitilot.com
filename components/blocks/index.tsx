/**
 * Block Components v2
 * Composants pour le système de blocs canvas libre
 */

'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import type { ContentBlocksData, ContentBlock } from '@/lib/blocks/types'
import type { GemColor } from '@/lib/blocks/types'
import { BlockPreview, GemButtonPreview } from '@/components/canvas/BlockPreview'
import { BlockStyleWrapper } from '@/components/canvas/BlockStyleWrapper'
import ScalableBlockWrapper from '@/components/canvas/ScalableBlockWrapper'
import { migratePaywallBlock } from '@/lib/blocks/migratePaywallBlock'
import { GEMS } from '@/components/ui/button'
import type { Language } from '@/lib/types'

// Types v2 depuis lib/blocks
export * from '@/lib/blocks/types'

// Activity data type for real data display
interface ActivityData {
  id?: string
  title?: string
  price_credits?: number | null
  type?: string | null
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  duration_max?: number | null
  duration_prep?: number | null
  intensity?: string | null
  difficulte?: string | null
  autonomie?: boolean | null
  themes?: string[] | null
  competences?: string[] | null
  categories?: string[] | null
  vignette_url?: string | null
  // Infos créateur - DOIT contenir tous les champs pour le bloc créateur
  creator?: {
    id?: string
    slug?: string
    display_name?: string
    avatar_url?: string | null
    bio?: string | null
    instagram_handle?: string | null
    youtube_handle?: string | null
    tiktok_handle?: string | null
    website_url?: string | null
    total_resources?: number
    followers_count?: number
  } | null
}

// Props interface pour BlockCanvas
interface BlockCanvasProps {
  blocksData?: ContentBlocksData | null
  activity?: ActivityData
  lang?: Language | string
  isEditing?: boolean
  selectedBlockId?: string | null
  onBlockSelect?: (id: string | null) => void
  [key: string]: unknown // Allow any other props
}

/**
 * BlockCanvas v2 - Renders canvas blocks in full width
 * Used on published resource pages
 */
export const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocksData: rawBlocksData, activity, lang = 'fr' }) => {
  // Migrate paywall blocks → canvas config
  const blocksData = rawBlocksData ? migratePaywallBlock(rawBlocksData) : null
  const blocks = blocksData?.layout?.desktop || []

  // Sort blocks by z-index for proper layering, filter out residual paywall blocks
  const sortedBlocks = [...blocks].filter(b => b.type !== 'paywall').sort((a, b) => a.position.zIndex - b.position.zIndex)

  // Use the measured canvas height saved by the editor, fallback to block-based estimate
  const savedHeight = typeof blocksData?.canvas?.height === 'number' ? blocksData.canvas.height : 0
  const estimatedHeight = Math.max(
    400,
    ...sortedBlocks.map(b =>
      b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50
    )
  )
  const canvasHeight = Math.max(savedHeight, estimatedHeight)

  // Prepare form data for BlockPreview
  const formData = activity ? {
    title: activity.title,
    price_credits: activity.price_credits,
    type: activity.type,
    age_min: activity.age_min,
    age_max: activity.age_max,
    duration: activity.duration,
    duration_max: activity.duration_max,
    duration_prep: activity.duration_prep,
    intensity: activity.intensity,
    difficulte: activity.difficulte,
    autonomie: activity.autonomie,
    themes: activity.themes,
    competences: activity.competences,
    categories: activity.categories,
    vignette_url: activity.vignette_url,
    creator: activity.creator,
    ressourceId: activity.id,
  } : undefined

  if (sortedBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>Aucun contenu</p>
      </div>
    )
  }

  return (
    <div
      className="relative w-full"
      style={{ minHeight: canvasHeight }}
    >
      {sortedBlocks.map(block => (
        <div
          key={block.id}
          className="absolute"
          style={{
            left: block.position.x,
            top: block.position.y,
            width: block.position.width,
            height: block.position.height === 'auto' ? 'auto' : block.position.height,
            zIndex: block.position.zIndex,
            opacity: block.visible === false ? 0 : 1
          }}
        >
          <BlockStyleWrapper
            style={block.style}
            className="w-full h-full"
          >
            <ScalableBlockWrapper scale={block.position.scale}>
              <BlockPreview block={block} lang={lang as Language} formData={formData} />
            </ScalableBlockWrapper>
          </BlockStyleWrapper>
        </div>
      ))}

      {/* Paywall overlay — public view (non-interactive) */}
      {blocksData?.canvas?.paywall?.enabled && (() => {
        const pw = blocksData.canvas.paywall!
        const blurPx = pw.blurIntensity ?? 12
        const opacity = (pw.overlayOpacity ?? 60) / 100
        const transitionHeight = 40

        return (
          <>
            {/* Gradient transition zone */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: pw.cutY - transitionHeight,
                height: transitionHeight,
                zIndex: 100,
                background: `linear-gradient(180deg, transparent 0%, ${pw.overlayColor || 'rgba(255,255,255,0.6)'} 100%)`,
                opacity,
                backdropFilter: `blur(${blurPx * 0.3}px)`,
                WebkitBackdropFilter: `blur(${blurPx * 0.3}px)`,
              }}
            />

            {/* Main blur overlay */}
            <div
              className="absolute left-0 right-0 bottom-0 pointer-events-none"
              style={{
                top: pw.cutY,
                zIndex: 100,
                backdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                WebkitBackdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                background: pw.overlayColor || 'rgba(255,255,255,0.6)',
                opacity,
              }}
            />

            {/* Paywall content (Lock + message + button) */}
            <div
              className="absolute left-0 right-0 flex flex-col items-center justify-center gap-3"
              style={{
                top: pw.cutY + 40,
                zIndex: 101,
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Lock className="w-6 h-6 text-[var(--foreground-secondary)]" />
              </div>
              {pw.message && (
                <p className="text-sm font-medium text-[var(--foreground)]">{pw.message}</p>
              )}
              <GemButtonPreview
                text={pw.buttonText || 'Débloquer le contenu'}
                style={pw.buttonStyle}
                shape={pw.buttonShape}
                color={pw.buttonColor}
                gem={pw.buttonGem}
                icon={<Lock className="w-3 h-3" />}
              />
            </div>
          </>
        )
      })()}
    </div>
  )
}

export const BlockRenderer: React.FC<{ block?: unknown }> = () => {
  return null
}

// Legacy components - will be rebuilt
export const TitleBlock: React.FC = () => null
export const ImageBlock: React.FC = () => null
export const CarouselBlock: React.FC = () => null
export const CreatorBlock: React.FC = () => null
export const TextBlock: React.FC = () => null
export const ListBlock: React.FC = () => null
export const ListLinksBlock: React.FC = () => null
export const PurchaseBlock: React.FC = () => null
export const VideoBlock: React.FC = () => null
export const TipBlock: React.FC = () => null
export const SeparatorBlock: React.FC = () => null
