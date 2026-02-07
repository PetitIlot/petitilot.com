'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { ContentBlock, ContentBlocksData, CanvasConfig, DEFAULT_CANVAS_CONFIG } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'
import BlockRenderer from './BlockRenderer'

interface BlockCanvasProps {
  blocksData: ContentBlocksData | null
  activity: RessourceWithCreator
  lang: Language
  isEditing?: boolean
  selectedBlockId?: string | null
  onBlockSelect?: (blockId: string) => void
  onBlocksChange?: (blocks: ContentBlock[]) => void
}

export default function BlockCanvas({
  blocksData,
  activity,
  lang,
  isEditing = false,
  selectedBlockId = null,
  onBlockSelect,
  onBlocksChange
}: BlockCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [viewportType, setViewportType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Détecter la taille du viewport pour le responsive
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const width = canvasRef.current.offsetWidth
        setCanvasWidth(width)
        if (width < 768) {
          setViewportType('mobile')
        } else if (width < 1024) {
          setViewportType('tablet')
        } else {
          setViewportType('desktop')
        }
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Obtenir la configuration du canvas
  const canvasConfig: CanvasConfig = blocksData?.canvas || DEFAULT_CANVAS_CONFIG

  // Obtenir les blocs appropriés selon le viewport
  const blocks = useMemo(() => {
    if (!blocksData?.layout) return []

    // Priorité: mobile > tablet > desktop
    if (viewportType === 'mobile' && blocksData.layout.mobile) {
      return blocksData.layout.mobile
    }
    if (viewportType === 'tablet' && blocksData.layout.tablet) {
      return blocksData.layout.tablet
    }
    return blocksData.layout.desktop || []
  }, [blocksData, viewportType])

  // Trier les blocs par zIndex
  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => (a.position.zIndex || 1) - (b.position.zIndex || 1))
  }, [blocks])

  // Calculer la hauteur totale du canvas basée sur les blocs
  const canvasHeight = useMemo(() => {
    if (canvasConfig.height !== 'auto') {
      return canvasConfig.height
    }

    let maxBottom = 0
    blocks.forEach(block => {
      const blockHeight = block.position.height === 'auto' ? 200 : block.position.height
      const bottom = block.position.y + blockHeight
      if (bottom > maxBottom) maxBottom = bottom
    })

    return maxBottom + 48 // padding en bas
  }, [blocks, canvasConfig])

  // Si pas de blocs, afficher un message
  if (!blocksData || blocks.length === 0) {
    return (
      <div
        ref={canvasRef}
        className="relative w-full min-h-[400px] bg-surface dark:bg-surface-dark rounded-xl flex items-center justify-center"
        style={{ border: '2px dashed var(--border)' }}
      >
        <div className="text-center text-foreground-secondary">
          <p className="text-lg mb-2">Aucun contenu</p>
          {isEditing && (
            <p className="text-sm">Ajoutez des blocs pour construire votre fiche</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full"
      style={{
        minHeight: canvasHeight,
        backgroundColor: canvasConfig.backgroundColor || 'transparent',
        backgroundImage: canvasConfig.backgroundImage ? `url(${canvasConfig.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Grille d'alignement en mode édition */}
      {isEditing && canvasConfig.snapToGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundSize: `${canvasConfig.gridSize}px ${canvasConfig.gridSize}px`,
            backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)'
          }}
        />
      )}

      {/* Rendu des blocs */}
      {sortedBlocks.map(block => {
        // Calculer les dimensions responsives
        const left = `${block.position.x}%`
        const width = `${block.position.width}%`
        const top = block.position.y
        const height = block.position.height === 'auto' ? 'auto' : block.position.height

        return (
          <div
            key={block.id}
            className={`
              ${block.position.height === 'auto' ? '' : 'absolute'}
              ${isEditing && block.locked ? 'opacity-75' : ''}
            `}
            style={block.position.height === 'auto' ? {
              // Layout en flux pour les blocs auto-height
              position: 'relative',
              width,
              marginLeft: left,
              marginTop: blocks.indexOf(block) === 0 ? 0 : 16,
              zIndex: block.position.zIndex
            } : {
              // Positionnement absolu pour les blocs avec hauteur fixe
              position: 'absolute',
              left,
              top,
              width,
              height,
              zIndex: block.position.zIndex
            }}
          >
            <BlockRenderer
              block={block}
              activity={activity}
              lang={lang}
              isEditing={isEditing}
              isSelected={selectedBlockId === block.id}
              onClick={() => onBlockSelect?.(block.id)}
            />

            {/* Indicateur de verrouillage en mode édition */}
            {isEditing && block.locked && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                🔒 Verrouillé
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
