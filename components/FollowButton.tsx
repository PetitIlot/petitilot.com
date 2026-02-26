'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button, GEMS } from '@/components/ui/button'
import type { Language } from '@/lib/types'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface FollowButtonProps {
  creatorId: string
  lang: Language
  variant?: 'icon' | 'button'
  socialStyle?: 'gem' | 'gem-outline' | 'classic'
  classicColor?: string
  onFollowChange?: (isFollowing: boolean) => void
}

const translations = {
  fr: {
    follow: 'Suivre',
    following: 'Abonné',
    login: 'Connectez-vous pour suivre'
  },
  en: {
    follow: 'Follow',
    following: 'Following',
    login: 'Log in to follow'
  },
  es: {
    follow: 'Seguir',
    following: 'Siguiendo',
    login: 'Inicia sesión para seguir'
  }
}

export default function FollowButton({
  creatorId,
  lang,
  variant = 'button',
  socialStyle = 'gem',
  classicColor,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [justToggled, setJustToggled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const checkFollowStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('user_id', user.id)
        .eq('creator_id', creatorId)
        .single()

      setIsFollowing(!!data)
      setIsLoading(false)
    }

    checkFollowStatus()
  }, [creatorId])

  const handleFollow = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (!userId) {
      window.location.href = `/${lang}/connexion`
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('user_id', userId)
        .eq('creator_id', creatorId)

      setIsFollowing(false)
      setJustToggled(true)
      setTimeout(() => setJustToggled(false), 400)
      onFollowChange?.(false)
    } else {
      await supabase
        .from('follows')
        .insert({ user_id: userId, creator_id: creatorId })

      setIsFollowing(true)
      setJustToggled(true)
      setTimeout(() => setJustToggled(false), 600)
      onFollowChange?.(true)
    }

    setIsLoading(false)
  }, [userId, isFollowing, creatorId, lang, onFollowChange])

  // ── Button variant ──
  if (variant === 'button') {
    if (socialStyle === 'classic') {
      const btnColor = classicColor || (isDark ? '#5AC8FF' : '#5FA0BE')
      return (
        <button
          onClick={handleFollow}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors"
          style={{
            borderColor: btnColor,
            color: btnColor,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isFollowing
            ? <UserCheck className="w-4 h-4" style={{ strokeWidth: 2 }} />
            : <UserPlus className="w-4 h-4" style={{ strokeWidth: 2 }} />}
          <span className="text-sm font-medium">{isFollowing ? t.following : t.follow}</span>
        </button>
      )
    }

    if (socialStyle === 'gem-outline') {
      return (
        <Button onClick={handleFollow} disabled={isLoading} gem="sky" variant="outline">
          {isFollowing
            ? <><UserCheck className="w-4 h-4 mr-2" />{t.following}</>
            : <><UserPlus className="w-4 h-4 mr-2" />{t.follow}</>}
        </Button>
      )
    }

    // Gem (default)
    return (
      <Button onClick={handleFollow} disabled={isLoading} gem="sky" variant={isFollowing ? 'default' : 'outline'}>
        {isFollowing
          ? <><UserCheck className="w-4 h-4 mr-2" />{t.following}</>
          : <><UserPlus className="w-4 h-4 mr-2" />{t.follow}</>}
      </Button>
    )
  }

  // ── Icon variant — adapts to socialStyle ──
  const Icon = isFollowing ? UserCheck : UserPlus
  const g = GEMS.sky
  const glowRGB = isDark ? g.glowDark : g.glow
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const emptyIconColor = isDark ? `rgba(${g.glowDark},0.50)` : `rgba(${g.glow},0.50)`
  const filledIconColor = isDark ? g.dark : g.deep

  // ── Classic icon: plain icon, no chrome ──
  if (socialStyle === 'classic') {
    const btnColor = classicColor || (isDark ? '#5AC8FF' : '#5FA0BE')
    const emptyColor = isDark ? 'rgba(100,168,200,0.40)' : 'rgba(100,168,200,0.40)'
    return (
      <button
        onClick={handleFollow}
        disabled={isLoading}
        aria-label={isFollowing ? t.following : t.follow}
        className="absolute top-3 right-3 z-10"
        style={{
          background: 'none', border: 'none', padding: 4,
          cursor: isLoading ? 'default' : 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: justToggled && isFollowing ? 'scale(1.18)' : justToggled ? 'scale(0.88)' : undefined,
        }}
      >
        <Icon
          style={{
            width: 20, height: 20,
            color: isFollowing ? btnColor : emptyColor,
            strokeWidth: 2,
            transition: 'all 0.3s ease',
          }}
        />
      </button>
    )
  }

  // ── Shared hover state for gem variants ──
  const hoverOn = isHovered && !isLoading
  const toggleTransform = justToggled && isFollowing ? 'scale(1.18)' : justToggled ? 'scale(0.88)' : hoverOn ? 'scale(1.08)' : 'scale(1)'
  const silverBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,205,215,0.55)'

  const wrapperBg = hoverOn
    ? `radial-gradient(circle 30px at 50% 50%, rgba(${glowRGB},0.90) 0%, rgba(${glowRGB},0.35) 60%, transparent 100%), linear-gradient(135deg, rgba(${glowRGB},${isDark ? 0.25 : 0.20}) 0%, rgba(${glowRGB},${isDark ? 0.15 : 0.10}) 100%)`
    : isFollowing
      ? `rgba(${glowRGB},${isDark ? 0.70 : 0.55})`
      : silverBorder

  const wrapperShadow = hoverOn
    ? `0 0 16px rgba(${glowRGB},${isDark ? 0.60 : 0.45}), 0 0 6px rgba(${glowRGB},${isDark ? 0.35 : 0.25}), 0 2px 8px rgba(0,0,0,${isDark ? 0.25 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.12 : 0.50})`
    : isFollowing
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
          onClick={handleFollow}
          disabled={isLoading}
          aria-label={isFollowing ? t.following : t.follow}
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
          <span
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 10.5,
              opacity: hoverOn ? 1 : 0,
              transition: 'opacity 0.35s ease',
              background: `radial-gradient(circle 24px at 50% 50%, rgba(${glowRGB},0.22) 0%, rgba(${glowRGB},0.06) 60%, transparent 100%)`,
            }}
          />
          <Icon
            style={{
              position: 'relative', zIndex: 2,
              width: 17, height: 17,
              color: isFollowing ? filledIconColor : (isDark ? g.dark : g.deep),
              strokeWidth: 2,
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              filter: isFollowing ? `drop-shadow(0 0 4px rgba(${glowRGB},${isDark ? 0.55 : 0.35}))` : 'none',
            }}
          />
        </button>
      </div>
    )
  }

  // ── Gem icon (default): frosted glass ──
  const tintAlpha = isDark ? 0.20 : 0.28
  const innerBg = isFollowing
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
        onClick={handleFollow}
        disabled={isLoading}
        aria-label={isFollowing ? t.following : t.follow}
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
        {/* Icon */}
        <Icon
          style={{
            position: 'relative', zIndex: 2,
            width: 17, height: 17,
            color: isFollowing ? filledIconColor : emptyIconColor,
            strokeWidth: 2,
            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            filter: isFollowing
              ? `drop-shadow(0 0 4px rgba(${glowRGB},${isDark ? 0.60 : 0.40}))`
              : 'none',
          }}
        />
      </button>
    </div>
  )
}
