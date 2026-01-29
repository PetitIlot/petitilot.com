'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/bookmarks'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  ressourceId: string
  variant?: 'icon' | 'button'
  lang?: string
}

const translations = {
  fr: {
    addToFavorites: 'Ajouter aux favoris',
    inFavorites: 'Dans mes favoris',
    loginRequired: 'Connectez-vous pour sauvegarder',
    added: 'Ajouté aux favoris',
    removed: 'Retiré des favoris'
  },
  en: {
    addToFavorites: 'Add to favorites',
    inFavorites: 'In my favorites',
    loginRequired: 'Log in to save',
    added: 'Added to favorites',
    removed: 'Removed from favorites'
  },
  es: {
    addToFavorites: 'Añadir a favoritos',
    inFavorites: 'En mis favoritos',
    loginRequired: 'Inicia sesión para guardar',
    added: 'Añadido a favoritos',
    removed: 'Eliminado de favoritos'
  }
}

export default function FavoriteButton({
  ressourceId,
  variant = 'icon',
  lang = 'fr'
}: FavoriteButtonProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const t = translations[lang as keyof typeof translations] || translations.fr

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        setUser(authUser)
        const bookmarked = await isBookmarked(authUser.id, ressourceId)
        setIsFavorite(bookmarked)
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [ressourceId])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Redirect to login (for now, just refresh - you'll add login modal later)
      alert(t.loginRequired)
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        const success = await removeBookmark(user.id, ressourceId)
        if (success) {
          setIsFavorite(false)
        }
      } else {
        const bookmark = await addBookmark(user.id, ressourceId)
        if (bookmark) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return null
  }

  if (!user) {
    return null // Don't show button if not logged in
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant={isFavorite ? 'default' : 'outline'}
        className={`${
          isFavorite
            ? 'bg-[#D4A59A] hover:bg-[#c4958a] border-[#D4A59A] text-white'
            : 'border-[#D4A59A]/40 text-[#D4A59A] hover:bg-[#D4A59A]/10'
        }`}
      >
        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
        {isFavorite ? t.inFavorites : t.addToFavorites}
      </Button>
    )
  }

  // Icon variant (for cards)
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm z-10"
    >
      <Heart
        className={`w-5 h-5 ${
          isFavorite
            ? 'text-[#D4A59A] fill-[#D4A59A]'
            : 'text-[#5D5A4E]/60'
        }`}
      />
    </button>
  )
}
