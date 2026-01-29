'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Clock, User, ArrowLeft, Users, BarChart3, Lightbulb, Tag, ExternalLink } from 'lucide-react'
import { Language } from '@/lib/types'
import { getRessourceWithCreator, RessourceWithCreator } from '@/lib/supabase-queries'
import { createClient } from '@/lib/supabase-client'
import CreatorWidget from '@/components/CreatorWidget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FavoriteButton from '@/components/FavoriteButton'
import PurchaseButton from '@/components/PurchaseButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'
import { getActivityImageUrl } from '@/lib/cloudinary'

const categoryColors = {
  activite: 'bg-[#A8B5A0]',
  motricite: 'bg-[#C8D8E4]',
  alimentation: 'bg-[#D4A59A]'
}

const categoryLabels = {
  fr: { activite: 'Activité', motricite: 'Motricité', alimentation: 'Recette' },
  en: { activite: 'Activity', motricite: 'Motor skills', alimentation: 'Recipe' },
  es: { activite: 'Actividad', motricite: 'Motricidad', alimentation: 'Receta' }
}

const translations = {
  fr: {
    backToActivities: 'Retour aux activités',
    ageRange: 'Âge',
    difficulty: 'Difficulté',
    autonomy: 'Autonomie',
    withAdult: 'Avec adulte',
    autonomous: 'Autonome',
    materials: 'Matériel nécessaire',
    instructions: 'Instructions',
    teacherTip: 'Astuces',
    downloadPDF: 'Télécharger le PDF',
    beginner: 'Facile',
    advanced: 'Moyen',
    expert: 'Difficile',
    years: 'ans',
    minutes: 'min'
  },
  en: {
    backToActivities: 'Back to activities',
    ageRange: 'Age',
    difficulty: 'Difficulty',
    autonomy: 'Autonomy',
    withAdult: 'With adult',
    autonomous: 'Autonomous',
    materials: 'Materials needed',
    instructions: 'Instructions',
    teacherTip: 'Tips',
    downloadPDF: 'Download PDF',
    beginner: 'Easy',
    advanced: 'Medium',
    expert: 'Hard',
    years: 'years',
    minutes: 'min'
  },
  es: {
    backToActivities: 'Volver a actividades',
    ageRange: 'Edad',
    difficulty: 'Dificultad',
    autonomy: 'Autonomía',
    withAdult: 'Con adulto',
    autonomous: 'Autónomo',
    materials: 'Materiales necesarios',
    instructions: 'Instrucciones',
    teacherTip: 'Consejos',
    downloadPDF: 'Descargar PDF',
    beginner: 'Fácil',
    advanced: 'Medio',
    expert: 'Difícil',
    years: 'años',
    minutes: 'min'
  }
}

export default function ActivityDetailPage({
  params
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [id, setId] = useState<string>('')
  const [activity, setActivity] = useState<RessourceWithCreator | null>(null)
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
    const fetchActivity = async () => {
      setIsLoading(true)
      const data = await getRessourceWithCreator(id)
      setActivity(data)
      setIsLoading(false)

      // Incrémenter le compteur de vues
      if (data) {
        const supabase = createClient()
        await supabase.rpc('increment_views', { resource_id: id })
      }
    }
    fetchActivity()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">Activité non trouvée</p>
          <Link href={`/${lang}/activites`}>
            <Button variant="outline">{t.backToActivities}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const materiels = activity.materiel_json || []
  const imageSource = activity.images_urls?.[0]
  const imageUrl = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800'

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href={`/${lang}/activites`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToActivities}
          </Button>
        </Link>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-[21/9] rounded-2xl overflow-hidden shadow-apple mb-8"
        >
          <img
            src={imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-3">
              {activity.title}
            </h1>

            {/* Rating & Favorite */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <RatingHearts ressourceId={activity.id} lang={lang} />
              <FavoriteButton ressourceId={activity.id} variant="button" lang={lang} />
            </div>

            {/* Primary Badges - Category, Age, Duration, Difficulty */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className={`${categoryColors[activity.type as keyof typeof categoryColors]} text-white border-0`}>
                {categoryLabels[lang]?.[activity.type as keyof typeof categoryLabels.fr] || activity.type}
              </Badge>
              {activity.age_min !== null && activity.age_max !== null && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                  <Users className="w-3.5 h-3.5 mr-1" />
                  {activity.age_min}-{activity.age_max} {t.years}
                </span>
              )}
              {activity.duration && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {activity.duration_max
                    ? `${activity.duration}-${activity.duration_max} ${t.minutes}`
                    : `${activity.duration} ${t.minutes}`
                  }
                </span>
              )}
              {activity.difficulte && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                  <BarChart3 className="w-3.5 h-3.5 mr-1" />
                  {t[activity.difficulte as keyof typeof t]}
                </span>
              )}
              {activity.autonomie !== null && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-foreground-secondary dark:text-foreground-dark-secondary" style={{ border: '1px solid var(--border)' }}>
                  <User className="w-3.5 h-3.5 mr-1" />
                  {activity.autonomie ? t.autonomous : t.withAdult}
                </span>
              )}
            </div>

            {/* Secondary Badges - Themes & Competences */}
            <div className="flex flex-wrap gap-2 mb-6">
              {activity.themes && activity.themes.length > 0 && activity.themes.map((theme, idx) => (
                <span key={`theme-${idx}`} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}>
                  <Tag className="w-3 h-3 mr-1" />
                  {theme}
                </span>
              ))}
              {activity.competences && activity.competences.length > 0 && activity.competences.map((comp, idx) => (
                <span key={`comp-${idx}`} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}>
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {comp}
                </span>
              ))}
            </div>

            {/* Creator Widget */}
            {activity.creator && (
              <div className="mb-6">
                <CreatorWidget creator={activity.creator} lang={lang} />
              </div>
            )}

            {/* Description + Gallery */}
            <div className="mb-8 flex gap-8 items-center">
              {/* Description */}
              {activity.description && (
                <div className="flex-1">
                  <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed whitespace-pre-line">
                    {activity.description}
                  </p>
                </div>
              )}

              {/* Gallery Carousel */}
              {activity.gallery_urls && Array.isArray(activity.gallery_urls) && activity.gallery_urls.length > 0 && (
                <GalleryCarousel
                  images={activity.gallery_urls}
                  alt={activity.title}
                  className="w-48"
                />
              )}
            </div>

            {/* Materials */}
            {materiels.length > 0 && (
              <div className="mb-8 bg-surface-secondary dark:bg-surface-dark rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex gap-6 mb-4">
                  <h2 className="flex-1 text-xl font-bold text-foreground dark:text-foreground-dark">
                    {t.materials}
                  </h2>
                  {materiels.some(mat => mat.url) && (
                    <>
                      <div className="w-px" style={{ backgroundColor: 'var(--border)' }} />
                      <h2 className="flex-1 text-xl font-bold text-foreground dark:text-foreground-dark">
                        {lang === 'fr' ? 'Où acheter' : 'Where to buy'}
                      </h2>
                    </>
                  )}
                </div>

                <div className="flex gap-6">
                  <ul className="flex-1 space-y-2">
                    {materiels.map((mat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sage" />
                        <span className="text-foreground dark:text-foreground-dark">
                          {mat.item}
                          {mat.recup && <span className="ml-2 text-xs text-sage">♻️</span>}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {materiels.some(mat => mat.url) && (
                    <>
                      <div className="w-px" style={{ backgroundColor: 'var(--border)' }} />
                      <ul className="flex-1 space-y-2">
                        {materiels.map((mat, idx) => (
                          <li key={idx} className="flex items-center gap-2 h-6">
                            {mat.url ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-sage" />
                                <a
                                  href={mat.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sage hover:text-sage-light hover:underline flex items-center gap-1"
                                >
                                  {mat.item}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            ) : (
                              <span className="w-2 h-2" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {materiels.some(mat => mat.url) && (
                  <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed">
                      {lang === 'fr'
                        ? `💚 En achetant via ces liens, vous soutenez directement le créateur de cette activité : ${activity.creator?.display_name || 'le créateur'}. Une petite commission est reversée sans frais supplémentaires pour vous. Merci de votre soutien !`
                        : lang === 'en'
                        ? `💚 By purchasing through these links, you directly support of this activity: ${activity.creator?.display_name || 'the creator'}. A small commission is earned at no extra cost to you. Thank you for your support!`
                        : `💚 Al comprar a través de estos enlaces, apoyas directamente a ${activity.creator?.display_name || 'el creador'}, el creadorde esta actividad. Se recibe una pequeña comisión sin costo adicional para ti. ¡Gracias por tu apoyo!`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Teacher's Tip */}
            {activity.astuces && (
              <div className="mb-8 rounded-r-xl p-6" style={{ backgroundColor: 'rgba(122, 139, 111, 0.1)', borderLeft: '4px solid var(--sage)' }}>
                <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
                  💡 {t.teacherTip}
                </h3>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
                  {activity.astuces}
                </p>
              </div>
            )}

            {/* Purchase / Download */}
            {activity.pdf_url && (
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <PurchaseButton
                  ressourceId={activity.id}
                  priceCredits={activity.price_credits ?? (activity.is_premium ? 3 : 0)}
                  pdfUrl={activity.pdf_url}
                  lang={lang}
                  className="w-full h-12 font-semibold"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Instagram Embed */}
        {activity.video_url?.includes('instagram.com') && (
          <div className="mt-8 flex justify-center">
            <iframe
              src={`${activity.video_url.replace(/\/$/, '')}/embed`}
              className="rounded-xl border-0"
              width="400"
              height="480"
              allowFullScreen
              scrolling="no"
            />
          </div>
        )}
      </div>
    </div>
  )
}
