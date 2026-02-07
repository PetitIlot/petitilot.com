'use client'

import { ExternalLink, Circle } from 'lucide-react'
import { ListLinksBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'

interface ListLinksBlockProps {
  activity: RessourceWithCreator
  data: ListLinksBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

const translations = {
  fr: {
    whereToBuy: 'Où acheter',
    affiliateNote: '💚 En achetant via ces liens, vous soutenez directement le créateur. Une petite commission est reversée sans frais supplémentaires pour vous.',
    noLinks: 'Aucun lien disponible'
  },
  en: {
    whereToBuy: 'Where to buy',
    affiliateNote: '💚 By purchasing through these links, you directly support the creator. A small commission is earned at no extra cost to you.',
    noLinks: 'No links available'
  },
  es: {
    whereToBuy: 'Dónde comprar',
    affiliateNote: '💚 Al comprar a través de estos enlaces, apoyas directamente al creador. Se recibe una pequeña comisión sin costo adicional para ti.',
    noLinks: 'No hay enlaces disponibles'
  }
}

export default function ListLinksBlock({ activity, data, style, lang, isEditing }: ListLinksBlockProps) {
  const t = translations[lang]

  // Récupérer les items avec liens
  let items: Array<{ label: string; url: string }> = []

  if (data.sourceField === 'materiel_json') {
    items = (activity.materiel_json || [])
      .filter(mat => mat.url)
      .map(mat => ({
        label: mat.item,
        url: mat.url as string
      }))
  } else if (data.customItems) {
    items = data.customItems
  }

  if (items.length === 0 && !isEditing) {
    return null
  }

  return (
    <div>
      {data.title && (
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4">
          {data.title}
        </h3>
      )}

      {items.length === 0 ? (
        <p className="text-foreground-secondary italic">{t.noLinks}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-sage text-sage flex-shrink-0" />
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage hover:text-sage-light hover:underline flex items-center gap-1"
              >
                {item.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      )}

      {data.showAffiliateNote && items.length > 0 && (
        <p className="mt-4 pt-4 text-xs text-foreground-secondary leading-relaxed" style={{ borderTop: '1px solid var(--border)' }}>
          {t.affiliateNote}
        </p>
      )}
    </div>
  )
}
