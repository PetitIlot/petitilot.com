'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface RatingHeartsProps {
  ressourceId: string
  variant?: 'display' | 'interactive'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  lang?: string
}

const translations = {
  fr: {
    average: 'Moyenne',
    ratings: 'notes',
    loginToRate: 'Connectez-vous pour noter',
    ratingSaved: 'Note enregistrée'
  },
  en: {
    average: 'Average',
    ratings: 'ratings',
    loginToRate: 'Log in to rate',
    ratingSaved: 'Rating saved'
  },
  es: {
    average: 'Promedio',
    ratings: 'calificaciones',
    loginToRate: 'Inicia sesión para calificar',
    ratingSaved: 'Calificación guardada'
  }
}

export default function RatingHearts({
  ressourceId,
  variant = 'interactive',
  size = 'md',
  lang = 'fr'
}: RatingHeartsProps) {
  const [user, setUser] = useState<any>(null)
  const [allRatings, setAllRatings] = useState<any[]>([])
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const t = translations[lang as keyof typeof translations] || translations.fr

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Check auth
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      // Fetch all ratings for this ressource
      const { data: ratings } = await supabase
        .from('ratings')
        .select('*')
        .eq('ressource_id', ressourceId)

      if (ratings) {
        setAllRatings(ratings)

        // Find user's rating if logged in
        if (authUser) {
          const myRating = ratings.find(r => r.user_id === authUser.id)
          if (myRating) {
            setUserRating(myRating.rating)
          }
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [ressourceId])

  const averageRating = allRatings.length > 0
    ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
    : 0

  const handleRate = async (rating: number) => {
    if (!user) {
      alert(t.loginToRate)
      return
    }

    const supabase = createClient()

    // Check if user already rated
    const existingRating = allRatings.find(r => r.user_id === user.id)

    if (existingRating) {
      // Update existing rating
      const { error } = await supabase
        .from('ratings')
        .update({ rating })
        .eq('id', existingRating.id)

      if (!error) {
        setUserRating(rating)
        setAllRatings(prev => prev.map(r =>
          r.id === existingRating.id ? { ...r, rating } : r
        ))
      }
    } else {
      // Create new rating
      const { data, error } = await supabase
        .from('ratings')
        .insert({ user_id: user.id, ressource_id: ressourceId, rating })
        .select()
        .single()

      if (!error && data) {
        setUserRating(rating)
        setAllRatings(prev => [...prev, data])
      }
    }
  }

  if (isLoading) {
    return null
  }

  // Display only variant (show average)
  if (variant === 'display') {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((heart) => (
          <Heart
            key={heart}
            className={`${sizeClasses[size]} ${
              heart <= Math.round(averageRating)
                ? 'text-[#D4A59A] fill-[#D4A59A]'
                : 'text-[#D4A59A]/30'
            }`}
          />
        ))}
        {allRatings.length > 0 && (
          <span className="text-xs text-[#5D5A4E]/60 ml-1">
            ({averageRating.toFixed(1)})
          </span>
        )}
      </div>
    )
  }

  // Interactive variant
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((heart) => (
          <button
            key={heart}
            onClick={() => handleRate(heart)}
            onMouseEnter={() => setHoveredRating(heart)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110 disabled:cursor-default"
            disabled={!user}
          >
            <Heart
              className={`${sizeClasses[size]} ${
                heart <= (hoveredRating || userRating || 0)
                  ? 'text-[#D4A59A] fill-[#D4A59A]'
                  : 'text-[#D4A59A]/30'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {allRatings.length > 0 && (
        <p className="text-xs text-[#5D5A4E]/60">
          {t.average}: {averageRating.toFixed(1)} ({allRatings.length} {t.ratings})
        </p>
      )}
      {!user && (
        <p className="text-xs text-[#5D5A4E]/50 italic">
          {t.loginToRate}
        </p>
      )}
    </div>
  )
}
