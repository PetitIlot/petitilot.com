'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Heart, Mail, LogOut, BookOpen, Palette, Dumbbell, Coins, ShoppingBag, Sparkles } from 'lucide-react'
import { Language, Ressource } from '@/lib/types'
import { createClient } from '@/lib/supabase-client'
import { getProfile, toggleNewsletter, Profile } from '@/lib/auth'
import { getBookmarkedRessources, getBookmarkCountByType } from '@/lib/bookmarks'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import ActivityCard from '@/components/cards/ActivityCard'
import BookCard from '@/components/cards/BookCard'
import GameCard from '@/components/cards/GameCard'
import Link from 'next/link'

const translations = {
  fr: {
    myProfile: 'Mon Profil',
    logout: 'Déconnexion',
    activities: 'Activités',
    books: 'Livres',
    games: 'Jeux',
    newsletter: 'Newsletter',
    myActivities: 'Mes activités',
    myBooks: 'Mes livres',
    myGames: 'Mes jeux',
    newsletterSettings: 'Abonnement Newsletter',
    subscribed: 'Abonné',
    notSubscribed: 'Non abonné',
    noActivities: "Vous n'avez pas encore d'activités favorites",
    noBooks: "Vous n'avez pas encore de livres favoris",
    noGames: "Vous n'avez pas encore de jeux favoris",
    discover: 'Découvrir',
    youAreSubscribed: 'Vous êtes abonné!',
    newsletterIn: 'Newsletter en',
    french: 'français',
    english: 'anglais',
    spanish: 'espagnol',
    subscribedSince: 'Abonné depuis',
    unsubscribe: 'Se désabonner',
    notSubscribedYet: "Vous n'êtes pas encore abonné à notre newsletter",
    subscribe: "S'abonner",
    newsletterDesc: 'Recevez nos activités en PDF et ressources exclusives',
    credits: 'Crédits',
    myPurchases: 'Mes achats',
    buyCredits: 'Acheter des crédits',
    creatorSpace: 'Espace créateur',
    becomeCreator: 'Devenir créateur',
    creatorDashboard: 'Gérer mes ressources',
    creatorCta: 'Partagez vos créations'
  },
  en: {
    myProfile: 'My Profile',
    logout: 'Logout',
    activities: 'Activities',
    books: 'Books',
    games: 'Games',
    newsletter: 'Newsletter',
    myActivities: 'My activities',
    myBooks: 'My books',
    myGames: 'My games',
    newsletterSettings: 'Newsletter Subscription',
    subscribed: 'Subscribed',
    notSubscribed: 'Not subscribed',
    noActivities: "You don't have any favorite activities yet",
    noBooks: "You don't have any favorite books yet",
    noGames: "You don't have any favorite games yet",
    discover: 'Discover',
    youAreSubscribed: 'You are subscribed!',
    newsletterIn: 'Newsletter in',
    french: 'French',
    english: 'English',
    spanish: 'Spanish',
    subscribedSince: 'Subscribed since',
    unsubscribe: 'Unsubscribe',
    notSubscribedYet: "You are not subscribed to our newsletter yet",
    subscribe: 'Subscribe',
    newsletterDesc: 'Receive our activities in PDF and exclusive resources',
    credits: 'Credits',
    myPurchases: 'My purchases',
    buyCredits: 'Buy credits',
    creatorSpace: 'Creator space',
    becomeCreator: 'Become a creator',
    creatorDashboard: 'Manage my resources',
    creatorCta: 'Share your creations'
  },
  es: {
    myProfile: 'Mi Perfil',
    logout: 'Cerrar sesión',
    activities: 'Actividades',
    books: 'Libros',
    games: 'Juegos',
    newsletter: 'Newsletter',
    myActivities: 'Mis actividades',
    myBooks: 'Mis libros',
    myGames: 'Mis juegos',
    newsletterSettings: 'Suscripción Newsletter',
    subscribed: 'Suscrito',
    notSubscribed: 'No suscrito',
    noActivities: 'Aún no tienes actividades favoritas',
    noBooks: 'Aún no tienes libros favoritos',
    noGames: 'Aún no tienes juegos favoritos',
    discover: 'Descubrir',
    youAreSubscribed: '¡Estás suscrito!',
    newsletterIn: 'Newsletter en',
    french: 'francés',
    english: 'inglés',
    spanish: 'español',
    subscribedSince: 'Suscrito desde',
    unsubscribe: 'Cancelar suscripción',
    notSubscribedYet: 'Aún no estás suscrito a nuestro newsletter',
    subscribe: 'Suscribirse',
    newsletterDesc: 'Recibe nuestras actividades en PDF y recursos exclusivos',
    credits: 'Créditos',
    myPurchases: 'Mis compras',
    buyCredits: 'Comprar créditos',
    creatorSpace: 'Espacio creador',
    becomeCreator: 'Convertirse en creador',
    creatorDashboard: 'Gestionar mis recursos',
    creatorCta: 'Comparte tus creaciones'
  }
}

export default function ProfilPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeTab, setActiveTab] = useState<'activities' | 'books' | 'games' | 'newsletter'>('activities')
  const [activities, setActivities] = useState<Ressource[]>([])
  const [books, setBooks] = useState<Ressource[]>([])
  const [games, setGames] = useState<Ressource[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [creditsBalance, setCreditsBalance] = useState(0)
  const [isCreator, setIsCreator] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push(`/${lang}`)
        return
      }

      setUser(authUser)

      // Fetch profile
      const userProfile = await getProfile(authUser.id)
      setProfile(userProfile)

      // Fetch credits balance
      const { data: profileData } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setCreditsBalance(profileData.credits_balance || 0)
      }

      // Check if user is a creator
      const { data: creatorData } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', authUser.id)
        .single()

      setIsCreator(!!creatorData)

      // Fetch bookmarked ressources
      const [activitiesData, booksData, gamesData, countsData] = await Promise.all([
        getBookmarkedRessources(authUser.id, 'activite'),
        getBookmarkedRessources(authUser.id, 'livre'),
        getBookmarkedRessources(authUser.id, 'jeu'),
        getBookmarkCountByType(authUser.id)
      ])

      setActivities(activitiesData)
      setBooks(booksData)
      setGames(gamesData)
      setCounts(countsData)
      setIsLoading(false)
    }

    checkAuth()
  }, [lang, router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${lang}`)
  }

  const handleToggleNewsletter = async () => {
    if (!user) return
    await toggleNewsletter(user.id)
    const updatedProfile = await getProfile(user.id)
    setProfile(updatedProfile)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const activitiesCount = (counts.activite || 0) + (counts.motricite || 0) + (counts.alimentation || 0)
  const booksCount = counts.livre || 0
  const gamesCount = counts.jeu || 0

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 md:py-16 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">
                  {t.myProfile}
                </h1>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary">{profile.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
              style={{ border: '1px solid var(--border)' }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <Palette className="w-8 h-8" style={{ color: 'var(--icon-sage)' }} />
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{activitiesCount}</p>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.activities}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <BookOpen className="w-8 h-8" style={{ color: 'var(--icon-sky)' }} />
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{booksCount}</p>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.books}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <Dumbbell className="w-8 h-8" style={{ color: 'var(--icon-terracotta)' }} />
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground dark:text-foreground-dark">{gamesCount}</p>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">{t.games}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <Mail className="w-8 h-8" style={{ color: 'var(--icon-sage)' }} />
              <div className="text-right">
                <p className="text-lg font-bold text-foreground dark:text-foreground-dark">
                  {profile.newsletter_subscribed ? t.subscribed : t.notSubscribed}
                </p>
                <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">Newsletter</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credits & Purchases Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Link href={`/${lang}/profil/credits`}>
            <div
              className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover transition-shadow cursor-pointer"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">{t.credits}</p>
                  <p className="text-4xl font-bold text-foreground dark:text-foreground-dark mt-1">{creditsBalance}</p>
                </div>
                <Coins className="w-12 h-12" style={{ color: 'var(--icon-sage)', opacity: 0.3 }} />
              </div>
              <p className="text-sm text-sage mt-4">{t.buyCredits} →</p>
            </div>
          </Link>

          <Link href={`/${lang}/profil/achats`}>
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover transition-shadow cursor-pointer" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">{t.myPurchases}</p>
                  <p className="text-xl font-bold text-foreground dark:text-foreground-dark mt-1">Voir mes ressources</p>
                </div>
                <ShoppingBag className="w-12 h-12" style={{ color: 'var(--icon-terracotta)', opacity: 0.3 }} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Creator Space Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-8"
        >
          <Link href={isCreator ? `/${lang}/createur` : `/${lang}/devenir-createur`}>
            <div
              className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-apple hover:shadow-apple-hover transition-shadow cursor-pointer"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                    {t.creatorSpace}
                  </p>
                  <p className="text-xl font-bold mt-1 text-foreground dark:text-foreground-dark">
                    {isCreator ? t.creatorDashboard : t.becomeCreator}
                  </p>
                  {!isCreator && (
                    <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary mt-2">{t.creatorCta}</p>
                  )}
                </div>
                <Sparkles className="w-12 h-12" style={{ color: 'var(--icon-sky)', opacity: 0.3 }} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                activeTab === 'activities'
                  ? 'bg-sage text-white'
                  : 'bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
              }`}
              style={activeTab !== 'activities' ? { border: '1px solid var(--border)' } : undefined}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              {t.myActivities}
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                activeTab === 'books'
                  ? 'bg-sky text-white'
                  : 'bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
              }`}
              style={activeTab !== 'books' ? { border: '1px solid var(--border)' } : undefined}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              {t.myBooks}
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                activeTab === 'games'
                  ? 'bg-terracotta text-white'
                  : 'bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
              }`}
              style={activeTab !== 'games' ? { border: '1px solid var(--border)' } : undefined}
            >
              <Dumbbell className="w-4 h-4 inline mr-2" />
              {t.myGames}
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                activeTab === 'newsletter'
                  ? 'bg-foreground dark:bg-foreground-dark text-surface dark:text-surface-dark'
                  : 'bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
              }`}
              style={activeTab !== 'newsletter' ? { border: '1px solid var(--border)' } : undefined}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Newsletter
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple p-6 md:p-8" style={{ border: '1px solid var(--border)' }}>
            {activeTab === 'activities' && (
              activities.length === 0 ? (
                <div className="py-16 text-center">
                  <Heart className="w-16 h-16 text-foreground/20 dark:text-foreground-dark/20 mx-auto mb-4" />
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.noActivities}</p>
                  <Link href={`/${lang}/activites`}>
                    <Button className="bg-sage hover:bg-sage-light text-white">
                      {t.discover}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} lang={lang} />
                  ))}
                </div>
              )
            )}

            {activeTab === 'books' && (
              books.length === 0 ? (
                <div className="py-16 text-center">
                  <BookOpen className="w-16 h-16 text-foreground/20 dark:text-foreground-dark/20 mx-auto mb-4" />
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.noBooks}</p>
                  <Link href={`/${lang}/livres`}>
                    <Button className="bg-sky hover:bg-sky-light text-white">
                      {t.discover}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} lang={lang} />
                  ))}
                </div>
              )
            )}

            {activeTab === 'games' && (
              games.length === 0 ? (
                <div className="py-16 text-center">
                  <Dumbbell className="w-16 h-16 text-foreground/20 dark:text-foreground-dark/20 mx-auto mb-4" />
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.noGames}</p>
                  <Link href={`/${lang}/jeux`}>
                    <Button className="bg-terracotta hover:bg-terracotta-light text-white">
                      {t.discover}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} lang={lang} />
                  ))}
                </div>
              )
            )}

            {activeTab === 'newsletter' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-2">
                  {t.newsletterSettings}
                </h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-6">{t.newsletterDesc}</p>

                {profile.newsletter_subscribed ? (
                  <div className="space-y-4">
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(122, 139, 111, 0.1)' }}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-1">
                            {t.youAreSubscribed}
                          </h3>
                          <p className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                            {t.newsletterIn} {
                              profile.lang === 'fr' ? t.french :
                              profile.lang === 'en' ? t.english :
                              t.spanish
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleToggleNewsletter}
                      variant="outline"
                      className="border-terracotta text-terracotta hover:bg-terracotta/10"
                    >
                      {t.unsubscribe}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-surface-secondary dark:bg-surface-dark rounded-xl p-6 text-center" style={{ border: '1px solid var(--border)' }}>
                      <p className="text-foreground-secondary dark:text-foreground-dark-secondary mb-4">{t.notSubscribedYet}</p>
                      <Button
                        onClick={handleToggleNewsletter}
                        className="bg-sage hover:bg-sage-light text-white"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {t.subscribe}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
