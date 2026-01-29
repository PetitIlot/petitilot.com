'use client'

import { useState, useEffect } from 'react'
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

  const fetchUserData = async () => {
    const supabase = createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setUser(null)
      setProfile(null)
      setCreator(null)
      setIsLoading(false)
      return
    }

    setUser(authUser)

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setProfile(profileData as Profile | null)

    // Si créateur ou admin, fetch creator profile aussi
    if (profileData?.role === 'creator' || profileData?.role === 'admin') {
      const { data: creatorData } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      setCreator(creatorData as Creator | null)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchUserData()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchUserData()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
    refetch: fetchUserData
  }
}
