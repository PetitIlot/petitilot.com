'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, ArrowLeft, BookOpen, Calendar, Building2, Palette, Tag, Lightbulb, Users } from 'lucide-react'
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
    backToBooks: 'Retour aux livres',
    whyWeLoveIt: 'Pourquoi nous l\'aimons',
    themes: 'Thèmes',
    competences: 'Compétences',
    whereToBuy: 'Où acheter',
    buyLink: 'Lien partenaire',
    affiliateNote: '💚 En tant que partenaire, nous recevons une petite commission sur les achats effectués via nos liens, sans frais supplémentaires pour vous. Ces commissions nous aident à continuer de créer et partager gratuitement des activités éducatives pour vos familles. Merci de votre soutien!',
    years: 'ans',
    author: 'Auteur',
    illustrator: 'Illustrateur',
    publisher: 'Éditeur',
    collection: 'Collection',
    year: 'Année'
  },
  en: {
    backToBooks: 'Back to books',
    whyWeLoveIt: 'Why we love it',
    themes: 'Themes',
    competences: 'Skills',
    whereToBuy: 'Where to buy',
    buyLink: 'Affiliate link',
    affiliateNote: '💚 As an affiliate partner, we earn a small commission from purchases made through our links, at no extra cost to you. These commissions help us continue to create and share free educational activities for your families. Thank you for your support!',
    years: 'years',
    author: 'Author',
    illustrator: 'Illustrator',
    publisher: 'Publisher',
    collection: 'Collection',
    year: 'Year'
  },
  es: {
    backToBooks: 'Volver a libros',
    whyWeLoveIt: 'Por qué nos encanta',
    themes: 'Temas',
    competences: 'Habilidades',
    whereToBuy: 'Dónde comprar',
    buyLink: 'Enlace de afiliado',
    affiliateNote: '💚 Como socio afiliado, recibimos una pequeña comisión por las compras realizadas a través de nuestros enlaces, sin costo adicional para usted. Estas comisiones nos ayudan a continuar creando y compartiendo actividades educativas gratuitas para sus familias. ¡Gracias por su apoyo!',
    years: 'años',
    author: 'Autor',
    illustrator: 'Ilustrador',
    publisher: 'Editorial',
    collection: 'Colección',
    year: 'Año'
  }
}

export default function BookDetailPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [id, setId] = useState<string>('')
  const [book, setBook] = useState<Ressource | null>(null)
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
    const fetchBook = async () => {
      setIsLoading(true)
      const data = await getRessourceById(id)
      setBook(data)
      setIsLoading(false)
    }
    fetchBook()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">Livre non trouvé</p>
          <Link href={`/${lang}/livres`}>
            <Button variant="outline">{t.backToBooks}</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Galerie : gallery_urls si disponible, sinon images_urls
  const galleryImages = (book.gallery_urls && book.gallery_urls.length > 0)
    ? book.gallery_urls
    : (book.images_urls && book.images_urls.length > 0)
      ? book.images_urls
      : ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500']

  // Lien d'achat depuis materiel_json
  const buyLink = book.materiel_json?.[0]?.url

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href={`/${lang}/livres`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToBooks}
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden p-6 md:p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <GalleryCarousel
                images={galleryImages}
                alt={book.title}
                className="w-full max-w-xs"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
                  {book.title}
                </h1>
                {book.auteur && (
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-lg mb-3">{book.auteur}</p>
                )}
                {/* Rating & Favorite */}
                <div className="flex flex-wrap items-center gap-4">
                  <RatingHearts ressourceId={book.id} lang={lang} />
                  <FavoriteButton ressourceId={book.id} variant="button" lang={lang} />
                </div>
              </div>

              {/* Age Badge */}
              {book.age_min !== null && book.age_max !== null && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                  <Users className="w-3.5 h-3.5 mr-1" />
                  {book.age_min}-{book.age_max} {t.years}
                </span>
              )}

              {/* Book Info */}
              <div className="space-y-2 text-sm text-foreground-secondary dark:text-foreground-dark-secondary">
                {book.illustrateur && (
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>{t.illustrator} : {book.illustrateur}</span>
                  </div>
                )}
                {book.editeur && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{t.publisher} : {book.editeur}</span>
                  </div>
                )}
                {book.collection && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{t.collection} : {book.collection}</span>
                  </div>
                )}
                {book.annee && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t.year} : {book.annee}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.whyWeLoveIt}
                  </h3>
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Themes */}
              {book.themes && book.themes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.themes}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.themes.map((theme, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}>
                        <Tag className="w-3 h-3 mr-1" />
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Competences */}
              {book.competences && book.competences.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark mb-2">
                    {t.competences}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.competences.map((comp, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}>
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {comp}
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
