'use client'

import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { GEMS } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface RatingHeartsProps {
  ressourceId: string
  variant?: 'display' | 'interactive'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  lang?: string
  socialStyle?: 'gem' | 'gem-outline' | 'classic'
  classicColor?: string
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

const sizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
}

export default function RatingHearts({
  ressourceId,
  variant = 'interactive',
  size = 'md',
  lang = 'fr',
  socialStyle = 'gem',
  classicColor,
}: RatingHeartsProps) {
  const [user, setUser] = useState<any>(null)
  const [allRatings, setAllRatings] = useState<any[]>([])
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  const t = translations[lang as keyof typeof translations] || translations.fr

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      const { data: ratings } = await supabase
        .from('ratings')
        .select('*')
        .eq('ressource_id', ressourceId)

      if (ratings) {
        setAllRatings(ratings)

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
    const existingRating = allRatings.find(r => r.user_id === user.id)

    if (existingRating) {
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

  const isClassic = socialStyle === 'classic'
  const isGemOutline = socialStyle === 'gem-outline'
  const g = GEMS.rose
  const glowRGB = isDark ? g.glowDark : g.glow
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const classicFallback = isDark ? '#FF7AA0' : '#C07A88'
  const gemColor = isDark ? g.dark : g.deep
  const classicFilledColor = classicColor || classicFallback
  const px = sizes[size]

  // Gem chrome sizing (same formula as TitleSocialPreview static preview)
  const gemBoxSize = px + 10
  const gemRadius = Math.round(gemBoxSize * 0.32)
  const gemRadiusInner = gemRadius - 1.5
  const tintAlpha = isDark ? 0.20 : 0.28
  const silverBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,205,215,0.55)'

  const subtextColor = isDark ? 'rgba(200,205,215,0.55)' : 'rgba(93,90,78,0.50)'

  // Render a single heart — classic: plain icon, gem/gem-outline: chrome box wrapper
  const renderHeart = (i: number, filled: boolean, hovered: boolean) => {
    if (isClassic) {
      return (
        <Heart
          style={{
            width: px, height: px,
            fill: filled ? classicFilledColor : 'none',
            color: filled ? classicFilledColor : (isDark ? 'rgba(200,130,145,0.30)' : 'rgba(200,130,145,0.30)'),
            strokeWidth: filled ? 0 : 1.5,
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      )
    }

    if (isGemOutline) {
      return (
        <div
          style={{
            width: gemBoxSize, height: gemBoxSize, borderRadius: gemRadius, padding: 1,
            background: filled ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})` : silverBorder,
            boxShadow: filled
              ? `0 0 8px rgba(${glowRGB},${isDark ? 0.50 : 0.35}), 0 0 3px rgba(${glowRGB},${isDark ? 0.30 : 0.20}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`
              : `0 1px 3px rgba(0,0,0,${isDark ? 0.20 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.50})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: gemRadiusInner,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${filled
              ? `rgba(${glowRGB},${isDark ? 0.85 : 0.70})`
              : (isDark ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)` : `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`)}`,
          }}>
            <Heart style={{
              width: px * 0.7, height: px * 0.7,
              fill: filled ? 'white' : 'none',
              color: filled ? 'white' : (isDark ? 'rgba(255,255,255,0.50)' : `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`),
              strokeWidth: filled ? 0 : 1.5,
              filter: filled ? `drop-shadow(0 0 3px rgba(${glowRGB},${isDark ? 0.60 : 0.45}))` : 'none',
            }} />
          </div>
        </div>
      )
    }

    // Gem (default): frosted glass box with tinted rose fill
    return (
      <div
        style={{
          width: gemBoxSize, height: gemBoxSize, borderRadius: gemRadius, padding: 1,
          background: filled ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})` : silverBorder,
          boxShadow: filled
            ? `0 0 10px rgba(${glowRGB},${isDark ? 0.55 : 0.40}), 0 0 4px rgba(${glowRGB},${isDark ? 0.35 : 0.25}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`
            : `0 1px 3px rgba(0,0,0,${isDark ? 0.20 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.50})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div style={{
          width: '100%', height: '100%', borderRadius: gemRadiusInner,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          background: `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.06}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.04}) 100%)`,
          backdropFilter: 'blur(8px) saturate(130%)',
          WebkitBackdropFilter: 'blur(8px) saturate(130%)',
        }}>
          {/* Frost overlay */}
          <span aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: gemRadiusInner,
            background: isDark
              ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(170deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.40) 100%)',
          }} />
          {/* Glow when filled */}
          {filled && (
            <span aria-hidden style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: gemRadiusInner,
              background: `radial-gradient(circle at 50% 50%, rgba(${glowRGB},${isDark ? 0.50 : 0.55}) 0%, rgba(${glowRGB},${isDark ? 0.15 : 0.18}) 60%, transparent 100%)`,
            }} />
          )}
          <Heart style={{
            position: 'relative', zIndex: 2,
            width: px * 0.7, height: px * 0.7,
            fill: filled ? gemColor : 'none',
            color: filled ? gemColor : (isDark ? `rgba(${g.glowDark},0.40)` : `rgba(${g.glow},0.40)`),
            strokeWidth: filled ? 0 : 1.5,
            filter: filled ? `drop-shadow(0 0 3px rgba(${glowRGB},${isDark ? 0.55 : 0.35}))` : 'none',
          }} />
        </div>
      </div>
    )
  }

  // Display only variant (show average)
  if (variant === 'display') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: isClassic ? px * 0.15 : 3 }}>
        {[1, 2, 3, 4, 5].map((heart) => (
          <React.Fragment key={heart}>
            {renderHeart(heart, heart <= Math.round(averageRating), false)}
          </React.Fragment>
        ))}
        {allRatings.length > 0 && (
          <span style={{ fontSize: 12, color: subtextColor, marginLeft: 4 }}>
            ({averageRating.toFixed(1)})
          </span>
        )}
      </div>
    )
  }

  // Interactive variant
  const activeRating = hoveredRating || userRating || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isClassic ? px * 0.15 : 3 }}>
        {[1, 2, 3, 4, 5].map((heart) => (
          <button
            key={heart}
            onClick={() => handleRate(heart)}
            onMouseEnter={() => setHoveredRating(heart)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={!user}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: user ? 'pointer' : 'default',
              lineHeight: 0,
            }}
          >
            {renderHeart(heart, heart <= activeRating, hoveredRating === heart)}
          </button>
        ))}
      </div>
      {allRatings.length > 0 && (
        <p style={{ fontSize: 12, color: subtextColor, margin: 0 }}>
          {t.average}: {averageRating.toFixed(1)} ({allRatings.length} {t.ratings})
        </p>
      )}
      {!user && (
        <p style={{ fontSize: 12, color: subtextColor, fontStyle: 'italic', margin: 0 }}>
          {t.loginToRate}
        </p>
      )}
    </div>
  )
}
