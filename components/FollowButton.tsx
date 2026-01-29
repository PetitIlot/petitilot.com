'use client'

import { useState, useEffect } from 'react'
import { UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/types'

interface FollowButtonProps {
  creatorId: string
  lang: Language
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

export default function FollowButton({ creatorId, lang, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const t = translations[lang]

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

  const handleFollow = async () => {
    if (!userId) {
      window.location.href = `/${lang}/connexion`
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isFollowing) {
      // Unfollow
      await supabase
        .from('follows')
        .delete()
        .eq('user_id', userId)
        .eq('creator_id', creatorId)

      setIsFollowing(false)
      onFollowChange?.(false)
    } else {
      // Follow
      await supabase
        .from('follows')
        .insert({ user_id: userId, creator_id: creatorId })

      setIsFollowing(true)
      onFollowChange?.(true)
    }

    setIsLoading(false)
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
      className={isFollowing
        ? 'border-[#A8B5A0] text-[#A8B5A0] hover:bg-[#A8B5A0]/10'
        : 'bg-[#A8B5A0] hover:bg-[#95a28f] text-white'
      }
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4 mr-2" />
          {t.following}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          {t.follow}
        </>
      )}
    </Button>
  )
}
