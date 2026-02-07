'use client'

import { TextBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'

interface TextBlockProps {
  activity: RessourceWithCreator
  data: TextBlockData
  style: BlockStyle
  isEditing?: boolean
}

const fontSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

const fontWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold'
}

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
}

export default function TextBlock({ activity, data, style, isEditing }: TextBlockProps) {
  // Si pas de contenu personnalisé, utiliser la description de l'activité
  const content = data.content || activity.description || ''

  if (!content && !isEditing) {
    return null
  }

  return (
    <div
      className={`
        ${fontSizes[data.fontSize]}
        ${fontWeights[data.fontWeight]}
        ${alignments[data.alignment]}
        text-foreground-secondary dark:text-foreground-dark-secondary
        leading-relaxed whitespace-pre-line
      `}
      style={{ color: data.textColor }}
    >
      {content || (isEditing && (
        <span className="text-foreground-secondary/50 italic">
          Zone de texte - cliquez pour éditer
        </span>
      ))}
    </div>
  )
}
