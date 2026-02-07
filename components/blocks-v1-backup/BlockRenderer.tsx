'use client'

import { ContentBlock, BlockStyle, BlockType } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'

import TitleBlock from './TitleBlock'
import ImageBlock from './ImageBlock'
import CarouselBlock from './CarouselBlock'
import CreatorBlock from './CreatorBlock'
import TextBlock from './TextBlock'
import ListBlock from './ListBlock'
import ListLinksBlock from './ListLinksBlock'
import PurchaseBlock from './PurchaseBlock'
import VideoBlock from './VideoBlock'
import TipBlock from './TipBlock'
import SeparatorBlock from './SeparatorBlock'

interface BlockRendererProps {
  block: ContentBlock
  activity: RessourceWithCreator
  lang: Language
  isEditing?: boolean
  isSelected?: boolean
  onClick?: () => void
}

// Map des couleurs preset vers valeurs CSS
const presetColors: Record<string, string> = {
  sage: 'rgba(122, 139, 111, 0.1)',
  terracotta: 'rgba(212, 165, 154, 0.15)',
  sky: 'rgba(90, 200, 250, 0.1)',
  mauve: 'rgba(204, 166, 200, 0.15)',
  transparent: 'transparent',
  surface: 'var(--surface)'
}

// Map des ombres
const shadowStyles: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  apple: '0 4px 14px rgba(0, 0, 0, 0.1)'
}

export default function BlockRenderer({
  block,
  activity,
  lang,
  isEditing = false,
  isSelected = false,
  onClick
}: BlockRendererProps) {
  // Si le bloc n'est pas visible, ne pas le rendre (sauf en mode édition)
  if (block.visible === false && !isEditing) {
    return null
  }

  // Construire les styles du conteneur
  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundPreset
      ? presetColors[block.style.backgroundPreset]
      : block.style.backgroundColor || 'transparent',
    borderRadius: block.style.borderRadius ?? 12,
    padding: block.style.padding ?? 0,
    boxShadow: shadowStyles[block.style.shadow || 'none'],
    border: block.style.border ? '1px solid var(--border)' : 'none',
    opacity: (block.style.opacity ?? 100) / 100,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }

  // Outline de sélection en mode édition
  if (isEditing && isSelected) {
    containerStyle.outline = '2px solid var(--sage)'
    containerStyle.outlineOffset = '2px'
  }

  // Rendre le bloc selon son type
  const renderBlock = () => {
    switch (block.type) {
      case 'title':
        return (
          <TitleBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'image':
        return (
          <ImageBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            isEditing={isEditing}
          />
        )

      case 'carousel':
        return (
          <CarouselBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            isEditing={isEditing}
          />
        )

      case 'creator':
        return (
          <CreatorBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'text':
        return (
          <TextBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            isEditing={isEditing}
          />
        )

      case 'list':
        return (
          <ListBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'list-links':
        return (
          <ListLinksBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'purchase':
        return (
          <PurchaseBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'video':
        return (
          <VideoBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            isEditing={isEditing}
          />
        )

      case 'tip':
        return (
          <TipBlock
            activity={activity}
            data={block.data as any}
            style={block.style}
            lang={lang}
            isEditing={isEditing}
          />
        )

      case 'separator':
        return (
          <SeparatorBlock
            data={block.data as any}
            style={block.style}
          />
        )

      default:
        return (
          <div className="p-4 bg-red-100 text-red-600 rounded-lg">
            Bloc inconnu: {block.type}
          </div>
        )
    }
  }

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      className={`
        ${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-sage/30' : ''}
        ${block.visible === false ? 'opacity-40' : ''}
      `}
    >
      {renderBlock()}
    </div>
  )
}
