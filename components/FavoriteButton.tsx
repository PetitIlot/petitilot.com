'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { Button, GEMS } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/bookmarks'
import { useRouter } from 'next/navigation'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface FavoriteButtonProps {
  ressourceId: string
  variant?: 'icon' | 'button'
  lang?: string
  socialStyle?: 'gem' | 'gem-outline' | 'classic'
  classicColor?: string
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
  lang = 'fr',
  socialStyle = 'gem',
  classicColor,
}: FavoriteButtonProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [justToggled, setJustToggled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const t = translations[lang as keyof typeof translations] || translations.fr

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

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

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert(t.loginRequired)
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        const success = await removeBookmark(user.id, ressourceId)
        if (success) {
          setIsFavorite(false)
          setJustToggled(true)
          setTimeout(() => setJustToggled(false), 400)
        }
      } else {
        const bookmark = await addBookmark(user.id, ressourceId)
        if (bookmark) {
          setIsFavorite(true)
          setJustToggled(true)
          setTimeout(() => setJustToggled(false), 600)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, isFavorite, ressourceId, t.loginRequired])

  if (isChecking || !user) {
    return null
  }

  if (variant === 'button') {
    // Classic style: plain CSS outline button (no gem component)
    if (socialStyle === 'classic') {
      const btnColor = classicColor || (isDark ? '#FF7AA0' : '#C07A88')
      return (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap"
          style={{
            borderColor: btnColor,
            color: btnColor,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} style={{ strokeWidth: 2 }} />
          <span className="text-sm font-medium">{isFavorite ? t.inFavorites : t.addToFavorites}</span>
        </button>
      )
    }

    // Gem-outline style: always outline variant
    if (socialStyle === 'gem-outline') {
      return (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          gem="rose"
          variant="outline"
          className="whitespace-nowrap"
        >
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? t.inFavorites : t.addToFavorites}
        </Button>
      )
    }

    // Gem style (default): always solid gem button
    return (
      <Button
        onClick={handleClick}
        disabled={isLoading}
        gem="rose"
        variant="default"
        className="whitespace-nowrap"
      >
        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? t.inFavorites : t.addToFavorites}
      </Button>
    )
  }

  // ── Icon variant — adapts to socialStyle ──
  const g = GEMS.rose
  const glowRGB = isDark ? g.glowDark : g.glow
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const emptyHeartColor = isDark ? `rgba(${g.glowDark},0.50)` : `rgba(${g.glow},0.50)`
  const filledHeartColor = isDark ? g.dark : g.deep

  // ── Classic icon: plain heart, no chrome ──
  if (socialStyle === 'classic') {
    const btnColor = classicColor || (isDark ? '#FF7AA0' : '#C07A88')
    const emptyColor = isDark ? 'rgba(200,130,145,0.40)' : 'rgba(200,130,145,0.40)'
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isFavorite ? t.inFavorites : t.addToFavorites}
        className="absolute top-3 right-3 z-10"
        style={{
          background: 'none', border: 'none', padding: 4,
          cursor: isLoading ? 'default' : 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: justToggled && isFavorite ? 'scale(1.18)' : justToggled ? 'scale(0.88)' : undefined,
        }}
      >
        <Heart
          style={{
            width: 20, height: 20,
            fill: isFavorite ? btnColor : 'none',
            color: isFavorite ? btnColor : emptyColor,
            strokeWidth: isFavorite ? 0 : 2,
            transition: 'all 0.3s ease',
          }}
        />
      </button>
    )
  }

  // ── Shared hover state for gem variants ──
  const hoverOn = isHovered && !isLoading

  // Toggle transform
  const toggleTransform = justToggled && isFavorite ? 'scale(1.18)' : justToggled ? 'scale(0.88)' : hoverOn ? 'scale(1.08)' : 'scale(1)'

  // Silver border (like Button system)
  const silverBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,205,215,0.55)'

  // Wrapper background: silver → rose glow on hover / when favorited
  const wrapperBg = hoverOn
    ? `radial-gradient(circle 30px at 50% 50%, rgba(${glowRGB},0.90) 0%, rgba(${glowRGB},0.35) 60%, transparent 100%), linear-gradient(135deg, rgba(${glowRGB},${isDark ? 0.25 : 0.20}) 0%, rgba(${glowRGB},${isDark ? 0.15 : 0.10}) 100%)`
    : isFavorite
      ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})`
      : silverBorder

  // Box-shadow: glow on hover + favorited
  const wrapperShadow = hoverOn
    ? `0 0 16px rgba(${glowRGB},${isDark ? 0.60 : 0.45}), 0 0 6px rgba(${glowRGB},${isDark ? 0.35 : 0.25}), 0 2px 8px rgba(0,0,0,${isDark ? 0.25 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.12 : 0.50})`
    : isFavorite
      ? `0 0 14px rgba(${glowRGB},${isDark ? 0.50 : 0.35}), 0 0 4px rgba(${glowRGB},${isDark ? 0.30 : 0.20}), 0 2px 6px rgba(0,0,0,${isDark ? 0.20 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.10 : 0.40})`
      : `0 2px 8px rgba(0,0,0,${isDark ? 0.25 : 0.08}), 0 1px 2px rgba(0,0,0,${isDark ? 0.15 : 0.03}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.50})`

  // ── Gem-outline icon ──
  if (socialStyle === 'gem-outline') {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute top-3 right-3 z-10"
        style={{
          width: 36, height: 36, borderRadius: 12, padding: 1.5,
          background: wrapperBg,
          boxShadow: wrapperShadow,
          transition: 'background 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: toggleTransform,
          cursor: isLoading ? 'default' : 'pointer',
        }}
      >
        <button
          onClick={handleClick}
          disabled={isLoading}
          aria-label={isFavorite ? t.inFavorites : t.addToFavorites}
          style={{
            width: '100%', height: '100%', borderRadius: 10.5,
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`}`,
            cursor: isLoading ? 'default' : 'pointer',
            padding: 0,
          }}
        >
          {/* Hover glow overlay */}
          <span
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 10.5,
              opacity: hoverOn ? 1 : 0,
              transition: 'opacity 0.35s ease',
              background: `radial-gradient(circle 24px at 50% 50%, rgba(${glowRGB},0.22) 0%, rgba(${glowRGB},0.06) 60%, transparent 100%)`,
            }}
          />
          <Heart
            style={{
              position: 'relative', zIndex: 2,
              width: 17, height: 17,
              fill: isFavorite ? filledHeartColor : 'none',
              color: isFavorite ? filledHeartColor : (isDark ? g.dark : g.deep),
              strokeWidth: isFavorite ? 0 : 2,
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              filter: isFavorite ? `drop-shadow(0 0 4px rgba(${glowRGB},${isDark ? 0.55 : 0.35}))` : 'none',
            }}
          />
        </button>
      </div>
    )
  }

  // ── Gem icon (default): frosted glass heart ──
  const tintAlpha = isDark ? 0.20 : 0.28
  const innerBg = isFavorite
    ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.06}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.04}) 100%)`
    : isDark
      ? 'rgba(30,30,34,0.85)'
      : 'rgba(255,255,255,0.90)'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-3 right-3 z-10"
      style={{
        width: 36, height: 36, borderRadius: 12, padding: 1.5,
        background: wrapperBg,
        boxShadow: wrapperShadow,
        transition: 'background 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: toggleTransform,
        cursor: isLoading ? 'default' : 'pointer',
      }}
    >
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isFavorite ? t.inFavorites : t.addToFavorites}
        style={{
          width: '100%', height: '100%', borderRadius: 10.5,
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: innerBg,
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
          border: 'none', padding: 0,
          cursor: isLoading ? 'default' : 'pointer',
        }}
      >
        {/* Frost overlay */}
        <span
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 10.5,
            background: isDark
              ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(170deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.40) 100%)',
          }}
        />
        {/* Hover glow overlay */}
        <span
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 10.5,
            opacity: hoverOn ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: `radial-gradient(circle 24px at 50% 50%, rgba(${glowRGB},${isDark ? 0.50 : 0.60}) 0%, rgba(${glowRGB},${isDark ? 0.15 : 0.20}) 60%, transparent 100%)`,
          }}
        />
        {/* Top shine */}
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '45%',
            pointerEvents: 'none',
            background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.10 : 0.30}) 0%, transparent 100%)`,
            borderRadius: '10.5px 10.5px 50% 50%',
          }}
        />
        {/* Heart icon */}
        <Heart
          style={{
            position: 'relative', zIndex: 2,
            width: 17, height: 17,
            fill: isFavorite ? filledHeartColor : 'none',
            color: isFavorite ? filledHeartColor : emptyHeartColor,
            strokeWidth: isFavorite ? 0 : 2,
            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            filter: isFavorite
              ? `drop-shadow(0 0 4px rgba(${glowRGB},${isDark ? 0.60 : 0.40}))`
              : 'none',
          }}
        />
      </button>
    </div>
  )
}
