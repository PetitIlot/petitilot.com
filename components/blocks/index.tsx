/**
 * Block Components v2
 * Composants pour le système de blocs canvas libre
 */

'use client'

import React from 'react'
import type { ContentBlocksData, ContentBlock } from '@/lib/blocks/types'
import { BlockPreview } from '@/components/canvas/BlockPreview'
import type { Language } from '@/lib/types'

// Types v2 depuis lib/blocks
export * from '@/lib/blocks/types'

// Activity data type for real data display
interface ActivityData {
  title?: string
  price_credits?: number | null
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  difficulte?: string | null
  themes?: string[]
  vignette_url?: string
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
export const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocksData, activity, lang = 'fr' }) => {
  const blocks = blocksData?.layout?.desktop || []

  // Sort blocks by z-index for proper layering
  const sortedBlocks = [...blocks].sort((a, b) => a.position.zIndex - b.position.zIndex)

  // Calculate canvas height based on blocks
  const canvasHeight = Math.max(
    400,
    ...sortedBlocks.map(b =>
      b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50
    )
  )

  // Prepare form data for BlockPreview
  const formData = activity ? {
    title: activity.title,
    price_credits: activity.price_credits,
    age_min: activity.age_min,
    age_max: activity.age_max,
    duration: activity.duration,
    difficulte: activity.difficulte,
    themes: activity.themes,
    vignette_url: activity.vignette_url
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
          <BlockPreview block={block} lang={lang as Language} formData={formData} />
        </div>
      ))}
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
