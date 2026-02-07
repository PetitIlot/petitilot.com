'use client'

import { Check, Circle, Minus } from 'lucide-react'
import { ListBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'

interface ListBlockProps {
  activity: RessourceWithCreator
  data: ListBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

const translations = {
  fr: { materials: 'Matériel nécessaire', noMaterials: 'Aucun matériel spécifié' },
  en: { materials: 'Materials needed', noMaterials: 'No materials specified' },
  es: { materials: 'Materiales necesarios', noMaterials: 'Sin materiales especificados' }
}

export default function ListBlock({ activity, data, style, lang, isEditing }: ListBlockProps) {
  const t = translations[lang]

  // Récupérer les items selon la source
  let items: Array<{ item: string; recup?: boolean }> = []

  if (data.sourceField === 'materiel_json') {
    items = (activity.materiel_json || []).map(mat =>
      typeof mat === 'string' ? { item: mat } : mat
    )
  } else if (data.customItems) {
    items = data.customItems.map(item => ({ item }))
  }

  if (items.length === 0 && !isEditing) {
    return null
  }

  const BulletIcon = ({ index }: { index: number }) => {
    switch (data.bulletStyle) {
      case 'check':
        return <Check className="w-4 h-4 text-sage flex-shrink-0" />
      case 'number':
        return (
          <span className="w-5 h-5 rounded-full bg-sage/20 text-sage text-xs flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
        )
      case 'dash':
        return <Minus className="w-4 h-4 text-foreground-secondary flex-shrink-0" />
      default:
        return <Circle className="w-2 h-2 fill-sage text-sage flex-shrink-0" />
    }
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[data.columns]

  return (
    <div>
      {data.title && (
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4">
          {data.title}
        </h3>
      )}

      {items.length === 0 ? (
        <p className="text-foreground-secondary italic">{t.noMaterials}</p>
      ) : (
        <ul className={`grid ${gridCols} gap-2`}>
          {items.map((mat, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <BulletIcon index={idx} />
              <span className="text-foreground dark:text-foreground-dark">
                {mat.item}
                {data.showRecupBadge && mat.recup && (
                  <span className="ml-2 text-xs text-sage">♻️ récup</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
