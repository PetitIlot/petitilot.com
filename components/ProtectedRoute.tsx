'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { UserRole } from '@/lib/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  lang: string
  fallbackUrl?: string
}

export default function ProtectedRoute({
  children,
  requiredRole,
  lang,
  fallbackUrl
}: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${lang}/connexion`)
        return
      }

      // Si pas de rôle requis, juste vérifier authentification
      if (!requiredRole) {
        setIsAuthorized(true)
        setIsLoading(false)
        return
      }

      // Vérifier le rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const userRole = profile?.role || 'buyer'
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

      // Admin a accès à tout
      if (userRole === 'admin' || allowedRoles.includes(userRole as UserRole)) {
        setIsAuthorized(true)
      } else {
        router.push(fallbackUrl || `/${lang}`)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole, lang, fallbackUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A8B5A0]" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
