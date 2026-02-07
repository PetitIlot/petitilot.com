'use client'

import { PurchaseBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'
import PurchaseButton from '@/components/PurchaseButton'

interface PurchaseBlockProps {
  activity: RessourceWithCreator
  data: PurchaseBlockData
  style: BlockStyle
  lang: Language
  isEditing?: boolean
}

export default function PurchaseBlock({ activity, data, style, lang, isEditing }: PurchaseBlockProps) {
  if (!activity.pdf_url && !isEditing) {
    return null
  }

  const priceCredits = activity.price_credits ?? (activity.is_premium ? 3 : 0)

  // Variant Full - Bouton pleine largeur avec prix affiché
  if (data.variant === 'full') {
    return (
      <div className="w-full">
        {data.showPrice && priceCredits > 0 && (
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              {priceCredits}
            </span>
            <span className="text-foreground-secondary ml-1">
              {priceCredits > 1 ? 'crédits' : 'crédit'}
            </span>
          </div>
        )}
        <PurchaseButton
          ressourceId={activity.id}
          priceCredits={priceCredits}
          pdfUrl={activity.pdf_url || ''}
          lang={lang}
          className="w-full h-12 font-semibold"
        />
      </div>
    )
  }

  // Variant Compact - Bouton avec prix inline
  if (data.variant === 'compact') {
    return (
      <div className="flex items-center gap-4">
        {data.showPrice && priceCredits > 0 && (
          <span className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            {priceCredits} {priceCredits > 1 ? 'crédits' : 'crédit'}
          </span>
        )}
        <PurchaseButton
          ressourceId={activity.id}
          priceCredits={priceCredits}
          pdfUrl={activity.pdf_url || ''}
          lang={lang}
          className="flex-1 h-10"
        />
      </div>
    )
  }

  // Variant Minimal - Juste le bouton
  return (
    <PurchaseButton
      ressourceId={activity.id}
      priceCredits={priceCredits}
      pdfUrl={activity.pdf_url || ''}
      lang={lang}
      className="h-10"
    />
  )
}
