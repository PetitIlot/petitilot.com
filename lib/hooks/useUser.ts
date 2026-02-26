'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Profile, Creator, UserRole } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface UseUserReturn {
  user: User | null
  profile: Profile | null
  creator: Creator | null
  role: UserRole
  isLoading: boolean
  isAuthenticated: boolean
  isCreator: boolean
  isAdmin: boolean
  refetch: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [creator, setCreator] = useState<Creator | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = useCallback(async (guard?: { cancelled: boolean }) => {
    const supabase = createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (guard?.cancelled) return

    if (!authUser) {
      setUser(null); setProfile(null); setCreator(null); setIsLoading(false)
      return
    }
    setUser(authUser)

    const { data: profileData } = await supabase
      .from('profiles').select('*').eq('id', authUser.id).single()
    if (guard?.cancelled) return
    setProfile(profileData as Profile | null)

    if (profileData?.role === 'creator' || profileData?.role === 'admin') {
      const { data: creatorData } = await supabase
        .from('creators').select('*').eq('user_id', authUser.id).single()
      if (guard?.cancelled) return
      setCreator(creatorData as Creator | null)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const guard = { cancelled: false }
    fetchUserData(guard)

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchUserData(guard)
      }
    })

    return () => {
      guard.cancelled = true
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  const role: UserRole = profile?.role || 'buyer'

  return {
    user,
    profile,
    creator,
    role,
    isLoading,
    isAuthenticated: !!user,
    isCreator: role === 'creator' || role === 'admin',
    isAdmin: role === 'admin',
    refetch: () => fetchUserData(),
  }
}
