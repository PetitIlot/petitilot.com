'use client'

import { Lightbulb, Star, Heart, Info, AlertTriangle } from 'lucide-react'
import { TipBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'

interface TipBlockProps {
  activity: RessourceWithCreator
  data: TipBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

const translations = {
  fr: { tip: 'Astuce', advice: 'Conseil' },
  en: { tip: 'Tip', advice: 'Advice' },
  es: { tip: 'Consejo', advice: 'Sugerencia' }
}

const icons = {
  lightbulb: Lightbulb,
  star: Star,
  heart: Heart,
  info: Info,
  warning: AlertTriangle
}

const accentColors = {
  sage: {
    bg: 'rgba(122, 139, 111, 0.1)',
    border: 'var(--sage)',
    text: 'var(--sage)'
  },
  terracotta: {
    bg: 'rgba(212, 165, 154, 0.15)',
    border: '#D4A59A',
    text: '#D4A59A'
  },
  sky: {
    bg: 'rgba(90, 200, 250, 0.1)',
    border: '#5AC8FA',
    text: '#5AC8FA'
  },
  mauve: {
    bg: 'rgba(204, 166, 200, 0.15)',
    border: '#CCA6C8',
    text: '#CCA6C8'
  }
}

export default function TipBlock({ activity, data, style, lang, isEditing }: TipBlockProps) {
  const t = translations[lang]
  const content = activity.astuces

  if (!content && !isEditing) {
    return null
  }

  const Icon = icons[data.icon]
  const colors = accentColors[data.accentColor]

  return (
    <div
      className="rounded-r-xl p-5"
      style={{
        backgroundColor: colors.bg,
        borderLeft: `4px solid ${colors.border}`
      }}
    >
      <h3
        className="text-lg font-bold mb-2 flex items-center gap-2"
        style={{ color: colors.text }}
      >
        <Icon className="w-5 h-5" />
        {t.tip}
      </h3>
      <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
        {content || (isEditing && 'Contenu de l\'astuce...')}
      </p>
    </div>
  )
}
