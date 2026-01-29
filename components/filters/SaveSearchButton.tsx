'use client'

import { useState } from 'react'
import { BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SaveSearchModal from './SaveSearchModal'
import type { Language } from '@/lib/types'
import type { FilterState } from '@/lib/hooks/useFilters'

interface SaveSearchButtonProps {
  filters: FilterState
  activeFiltersCount: number
  lang: Language
  isLoggedIn: boolean
  onLoginRequired: () => void
}

const translations = {
  fr: { save: 'Enregistrer cette recherche' },
  en: { save: 'Save this search' },
  es: { save: 'Guardar esta búsqueda' },
}

export default function SaveSearchButton({
  filters,
  activeFiltersCount,
  lang,
  isLoggedIn,
  onLoginRequired,
}: SaveSearchButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const t = translations[lang]

  // Ne montre le bouton que si des filtres sont actifs
  if (activeFiltersCount === 0) return null

  const handleClick = () => {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    setShowModal(true)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="gap-2 text-sage hover:text-sage border-sage/30 hover:border-sage/50 hover:bg-sage/5"
      >
        <BookmarkPlus className="w-4 h-4" />
        <span className="hidden sm:inline">{t.save}</span>
      </Button>

      <SaveSearchModal
        open={showModal}
        onClose={() => setShowModal(false)}
        filters={filters}
        lang={lang}
      />
    </>
  )
}
