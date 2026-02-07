'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Language = 'fr' | 'en' | 'es'

const translations = {
  fr: {
    login: 'Connexion',
    signup: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    loginButton: 'Se connecter',
    signupButton: "S'inscrire",
    orContinueWith: 'Ou continuer avec',
    google: 'Google',
    noAccount: "Pas encore de compte ?",
    hasAccount: 'Déjà un compte ?',
    forgotPassword: 'Mot de passe oublié ?',
    backHome: 'Retour',
    loginSuccess: 'Connexion réussie !',
    signupSuccess: 'Inscription réussie ! Vérifiez votre email.',
    errorInvalidCredentials: 'Email ou mot de passe incorrect',
    errorEmailExists: 'Cet email est déjà utilisé',
    errorPasswordMismatch: 'Les mots de passe ne correspondent pas',
    errorPasswordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    errorPasswordWeak: 'Le mot de passe ne respecte pas tous les critères',
    errorGeneric: 'Une erreur est survenue',
    errorOAuthCancelled: 'Connexion Google annulée',
    errorSessionFailed: 'Erreur lors de la connexion Google. Veuillez réessayer.',
    pwMinLength: 'Au moins 8 caractères',
    pwUppercase: 'Au moins une majuscule',
    pwNumber: 'Au moins un chiffre',
    pwSpecial: 'Au moins un caractère spécial'
  },
  en: {
    login: 'Login',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginButton: 'Log in',
    signupButton: 'Sign up',
    orContinueWith: 'Or continue with',
    google: 'Google',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    forgotPassword: 'Forgot password?',
    backHome: 'Back',
    loginSuccess: 'Login successful!',
    signupSuccess: 'Sign up successful! Check your email.',
    errorInvalidCredentials: 'Invalid email or password',
    errorEmailExists: 'This email is already in use',
    errorPasswordMismatch: 'Passwords do not match',
    errorPasswordTooShort: 'Password must be at least 8 characters',
    errorPasswordWeak: 'Password does not meet all requirements',
    errorGeneric: 'An error occurred',
    errorOAuthCancelled: 'Google login cancelled',
    errorSessionFailed: 'Error during Google login. Please try again.',
    pwMinLength: 'At least 8 characters',
    pwUppercase: 'At least one uppercase letter',
    pwNumber: 'At least one number',
    pwSpecial: 'At least one special character'
  },
  es: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    loginButton: 'Iniciar sesión',
    signupButton: 'Registrarse',
    orContinueWith: 'O continuar con',
    google: 'Google',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    forgotPassword: '¿Olvidaste tu contraseña?',
    backHome: 'Volver',
    loginSuccess: '¡Inicio de sesión exitoso!',
    signupSuccess: '¡Registro exitoso! Revisa tu correo.',
    errorInvalidCredentials: 'Correo o contraseña incorrectos',
    errorEmailExists: 'Este correo ya está en uso',
    errorPasswordMismatch: 'Las contraseñas no coinciden',
    errorPasswordTooShort: 'La contraseña debe tener al menos 8 caracteres',
    errorPasswordWeak: 'La contraseña no cumple todos los requisitos',
    errorGeneric: 'Ocurrió un error',
    errorOAuthCancelled: 'Inicio de sesión con Google cancelado',
    errorSessionFailed: 'Error al iniciar sesión con Google. Inténtalo de nuevo.',
    pwMinLength: 'Al menos 8 caracteres',
    pwUppercase: 'Al menos una mayúscula',
    pwNumber: 'Al menos un número',
    pwSpecial: 'Al menos un carácter especial'
  }
}

function ConnexionContent({ lang }: { lang: Language }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle OAuth errors from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const t = translations[lang]
      if (errorParam === 'oauth_cancelled') {
        setError(t.errorOAuthCancelled)
      } else if (errorParam === 'session_failed') {
        setError(t.errorSessionFailed)
      }
    }
  }, [searchParams, lang])

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push(`/${lang}/profil`)
      }
    }
    checkAuth()
  }, [lang, router])

  const t = translations[lang]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(t.errorInvalidCredentials)
      setIsLoading(false)
      return
    }

    setSuccess(t.loginSuccess)
    setTimeout(() => {
      router.push(`/${lang}/profil`)
    }, 1000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecial) {
      setError(t.errorPasswordWeak)
      return
    }

    if (password !== confirmPassword) {
      setError(t.errorPasswordMismatch)
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          lang: lang
        }
      }
    })

    if (error) {
      console.error('Signup error:', error.message, error.status)
      if (error.message.includes('already')) {
        setError(t.errorEmailExists)
      } else {
        setError(`${t.errorGeneric}: ${error.message}`)
      }
      setIsLoading(false)
      return
    }

    setSuccess(t.signupSuccess)
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?lang=${lang}`
      }
    })
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center py-12 px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backHome}
        </Link>

        {/* Card */}
        <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-8" style={{ border: '1px solid var(--border)' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">PI</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
              {mode === 'login' ? t.login : t.signup}
            </h1>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                  style={{ border: '1px solid var(--border)' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary dark:text-foreground-dark-secondary hover:text-foreground dark:hover:text-foreground-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password criteria (signup only) */}
            {mode === 'signup' && password.length > 0 && (
              <div className="space-y-1.5 -mt-1">
                {[
                  { met: password.length >= 8, label: t.pwMinLength },
                  { met: /[A-Z]/.test(password), label: t.pwUppercase },
                  { met: /[0-9]/.test(password), label: t.pwNumber },
                  { met: /[^A-Za-z0-9]/.test(password), label: t.pwSpecial },
                ].map(({ met, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    {met ? (
                      <Check className="w-3.5 h-3.5 text-sage" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-foreground-secondary/40 dark:text-foreground-dark-secondary/40" />
                    )}
                    <span className={`text-xs transition-colors ${met ? 'text-sage' : 'text-foreground-secondary/60 dark:text-foreground-dark-secondary/60'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground-dark mb-1">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary dark:text-foreground-dark-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-secondary dark:bg-surface-dark text-foreground dark:text-foreground-dark outline-none transition-all focus:ring-2 focus:ring-sage/30"
                    style={{ border: '1px solid var(--border)' }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Forgot password (login only) */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-sage hover:text-sage-light transition-colors"
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sage hover:bg-sage-light text-white py-3 rounded-xl font-semibold"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? t.loginButton : t.signupButton
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.orContinueWith}</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          </div>

          {/* Google button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08] py-3 rounded-xl font-semibold"
            style={{ border: '1px solid var(--border)' }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t.google}
          </Button>

          {/* Toggle mode */}
          <p className="text-center mt-6 text-foreground-secondary dark:text-foreground-dark-secondary">
            {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setSuccess('')
              }}
              className="text-sage font-semibold hover:text-sage-light transition-colors"
            >
              {mode === 'login' ? t.signup : t.login}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Wrapper avec Suspense pour useSearchParams
export default function ConnexionPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const [lang, setLang] = useState<Language>('fr')

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-pulse text-foreground-secondary">Chargement...</div>
      </div>
    }>
      <ConnexionContent lang={lang} />
    </Suspense>
  )
}
