'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Clock, ExternalLink, ArrowLeft, Building2, Calendar, Tag, Lightbulb } from 'lucide-react'
import { Language, Ressource } from '@/lib/types'
import { getRessourceById } from '@/lib/supabase-queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FavoriteButton from '@/components/FavoriteButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'

const translations = {
  fr: {
    backToGames: 'Retour aux jeux',
    players: 'joueurs',
    whyWeLoveIt: 'Pourquoi nous l\'aimons',
    skillsDeveloped: 'Compétences développées',
    themes: 'Thèmes',
    whereToBuy: 'Où acheter',
    buyLink: 'Lien partenaire',
    affiliateNote: '💚 En tant que partenaire, nous recevons une petite commission sur les achats effectués via nos liens, sans frais supplémentaires pour vous. Ces commissions nous aident à continuer de créer et partager gratuitement des activités éducatives pour vos familles. Merci de votre soutien!',
    years: 'ans',
    minutes: 'min',
    publisher: 'Éditeur',
    year: 'Année'
  },
  en: {
    backToGames: 'Back to games',
    players: 'players',
    whyWeLoveIt: 'Why we love it',
    skillsDeveloped: 'Skills developed',
    themes: 'Themes',
    whereToBuy: 'Where to buy',
    buyLink: 'Affiliate link',
    affiliateNote: '💚 As an affiliate partner, we earn a small commission from purchases made through our links, at no extra cost to you. These commissions help us continue to create and share free educational activities for your families. Thank you for your support!',
    years: 'years',
    minutes: 'min',
    publisher: 'Publisher',
    year: 'Year'
  },
  es: {
    backToGames: 'Volver a juegos',
    players: 'jugadores',
    whyWeLoveIt: 'Por qué nos encanta',
    skillsDeveloped: 'Habilidades desarrolladas',
    themes: 'Temas',
    whereToBuy: 'Dónde comprar',
    buyLink: 'Enlace de afiliado',
    affiliateNote: '💚 Como socio afiliado, recibimos una pequeña comisión por las compras realizadas a través de nuestros enlaces, sin costo adicional para usted. Estas comisiones nos ayudan a continuar creando y compartiendo actividades educativas gratuitas para sus familias. ¡Gracias por su apoyo!',
    years: 'años',
    minutes: 'min',
    publisher: 'Editorial',
    year: 'Año'
  }
}

export default function GameDetailPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [id, setId] = useState<string>('')
  const [game, setGame] = useState<Ressource | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l, id: i }) => {
      setLang(l as Language)
      setId(i)
    })
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    if (!id) return
    const fetchGame = async () => {
      setIsLoading(true)
      const data = await getRessourceById(id)
      setGame(data)
      setIsLoading(false)
    }
    fetchGame()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">Jeu non trouvé</p>
          <Link href={`/${lang}/jeux`}>
            <Button variant="outline">{t.backToGames}</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Galerie : gallery_urls si disponible, sinon images_urls
  const galleryImages = (game.gallery_urls && game.gallery_urls.length > 0)
    ? game.gallery_urls
    : (game.images_urls && game.images_urls.length > 0)
      ? game.images_urls
      : ['https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400']

  // Lien d'achat depuis materiel_json
  const buyLink = game.materiel_json?.[0]?.url

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href={`/${lang}/jeux`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToGames}
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden p-6 md:p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Gallery Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 flex flex-col items-center md:items-start"
            >
              <GalleryCarousel
                images={galleryImages}
                alt={game.title}
                className="w-48"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
                  {game.title}
                </h1>
                {game.subtitle && (
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg mb-3">{game.subtitle}</p>
                )}
                {/* Rating & Favorite */}
                <div className="flex flex-wrap items-center gap-4">
                  <RatingHearts ressourceId={game.id} lang={lang} />
                  <FavoriteButton ressourceId={game.id} variant="button" lang={lang} />
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {game.age_min !== null && (
                  <Badge className="bg-sage text-white border-0">
                    <Users className="w-3 h-3 mr-1" />
                    {game.age_min}{game.age_max ? `-${game.age_max}` : '+'} {t.years}
                  </Badge>
                )}
                {game.nb_joueurs_min !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                    <Users className="w-3 h-3 mr-1" />
                    {game.nb_joueurs_min}{game.nb_joueurs_max ? `-${game.nb_joueurs_max}` : '+'} {t.players}
                  </span>
                )}
                {game.duration !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                    <Clock className="w-3 h-3 mr-1" />
                    {game.duration_max
                      ? `${game.duration}-${game.duration_max} ${t.minutes}`
                      : `${game.duration} ${t.minutes}`
                    }
                  </span>
                )}
              </div>

              {/* Publisher & Year */}
              <div className="flex flex-wrap gap-4 text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                {game.editeur && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{game.editeur}</span>
                  </div>
                )}
                {game.annee && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{game.annee}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {game.description && (
                <div>
                  <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.whyWeLoveIt}
                  </h3>
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed whitespace-pre-line">
                    {game.description}
                  </p>
                </div>
              )}

              {/* Competences */}
              {game.competences && game.competences.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.skillsDeveloped}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.competences.map((comp, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}>
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes */}
              {game.themes && game.themes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.themes}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.themes.map((theme, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}>
                        <Tag className="w-3 h-3 mr-1" />
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>

          {/* Where to buy */}
          {buyLink && (
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="bg-surface-secondary dark:bg-surface-dark rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-4">
                  {t.whereToBuy}
                </h3>
                <a href={buyLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-sage hover:bg-sage-light text-white h-12 font-semibold">
                    {t.buyLink}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                    {t.affiliateNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
