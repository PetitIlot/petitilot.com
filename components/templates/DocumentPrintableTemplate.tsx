'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, Download, Printer, Clock, Users, Calendar, CheckSquare, FileStack, Eye, Tag, Lightbulb, ZoomIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { Language } from '@/lib/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { getActivityImageUrl } from '@/lib/cloudinary'
import CreatorWidget from '@/components/CreatorWidget'
import FavoriteButton from '@/components/FavoriteButton'
import PurchaseButton from '@/components/PurchaseButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'
import { Button } from '@/components/ui/button'

/**
 * DocumentPrintableTemplate - Page de détail pour Rituels/Routines & Imprimables
 *
 * Design: Layout orienté document/fiche avec aperçu
 * - Aperçu grand format du document avec effet "page"
 * - Infos pratiques (format, pages, usage)
 * - Mode preview interactif
 * - Couleur Mauve (#CCA6C8) pour l'organisation/planification
 */

const translations = {
  fr: {
    back: 'Retour aux activités',
    routine: 'Routine',
    printable: 'Imprimable',
    age: 'Âge',
    years: 'ans',
    format: 'Format',
    formatA4: 'A4 (21x29,7cm)',
    pages: 'pages',
    usage: 'Utilisation',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    occasional: 'Ponctuel',
    preview: 'Aperçu du document',
    description: 'À propos',
    howToUse: 'Comment utiliser',
    materials: 'Matériel d\'impression',
    tips: 'Conseils d\'utilisation',
    downloadPdf: 'Télécharger le PDF',
    printReady: 'Prêt à imprimer',
    laminate: 'Plastifier pour réutiliser',
    difficulty: 'Difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Avancé',
  },
  en: {
    back: 'Back to activities',
    routine: 'Routine',
    printable: 'Printable',
    age: 'Age',
    years: 'yrs',
    format: 'Format',
    formatA4: 'A4 (8.27x11.69in)',
    pages: 'pages',
    usage: 'Usage',
    daily: 'Daily',
    weekly: 'Weekly',
    occasional: 'Occasional',
    preview: 'Document preview',
    description: 'About',
    howToUse: 'How to use',
    materials: 'Printing materials',
    tips: 'Usage tips',
    downloadPdf: 'Download PDF',
    printReady: 'Print-ready',
    laminate: 'Laminate for reuse',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
  },
  es: {
    back: 'Volver a actividades',
    routine: 'Rutina',
    printable: 'Imprimible',
    age: 'Edad',
    years: 'años',
    format: 'Formato',
    formatA4: 'A4 (21x29,7cm)',
    pages: 'páginas',
    usage: 'Uso',
    daily: 'Diario',
    weekly: 'Semanal',
    occasional: 'Puntual',
    preview: 'Vista previa',
    description: 'Acerca de',
    howToUse: 'Cómo usar',
    materials: 'Material de impresión',
    tips: 'Consejos de uso',
    downloadPdf: 'Descargar PDF',
    printReady: 'Listo para imprimir',
    laminate: 'Plastificar para reutilizar',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
  }
}

// Détecter le type de document
const getDocType = (categories: string[] | null): 'routine' | 'printable' => {
  const cats = (categories || []).map(c => c.toLowerCase())
  if (cats.some(c => c.includes('rituel') || c.includes('routine'))) return 'routine'
  return 'printable'
}

interface DocumentPrintableTemplateProps {
  activity: RessourceWithCreator
  lang: Language
}

export default function DocumentPrintableTemplate({ activity, lang }: DocumentPrintableTemplateProps) {
  const t = translations[lang] || translations.fr
  const [previewOpen, setPreviewOpen] = useState(false)

  const imageSource = activity.images_urls?.[0] || activity.vignette_url
  const previewImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'

  const docType = getDocType(activity.categories)
  const hasPdf = !!activity.pdf_url
  const materiels = activity.materiel_json || []

  const DocIcon = docType === 'routine' ? Calendar : FileText

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FA] to-[#F0ECF5] dark:from-background-dark dark:to-[#1a1a1a] py-8 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href={`/${lang}/activites`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark hover:bg-white/50 dark:hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        {/* Layout deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Colonne gauche - Aperçu document */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {/* Conteneur style "bureau" */}
            <div className="sticky top-24">
              <div className="relative mx-auto" style={{ maxWidth: '380px' }}>
                {/* Ombres de pages empilées */}
                <div
                  className="absolute inset-0 bg-white dark:bg-surface-dark rounded-lg shadow-lg"
                  style={{ transform: 'rotate(3deg) translate(8px, 8px)' }}
                />
                <div
                  className="absolute inset-0 bg-white dark:bg-surface-dark rounded-lg shadow-lg"
                  style={{ transform: 'rotate(1.5deg) translate(4px, 4px)' }}
                />

                {/* Page principale */}
                <div
                  className="relative bg-white dark:bg-surface-dark rounded-lg shadow-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setPreviewOpen(true)}
                >
                  {/* Image aperçu */}
                  <div className="aspect-[3/4] relative">
                    <img
                      src={previewImage}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-4">
                        <ZoomIn className="w-8 h-8 text-foreground" />
                      </div>
                    </div>

                    {/* Badge type */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-lg"
                        style={{ backgroundColor: '#CCA6C8', color: '#fff' }}
                      >
                        <DocIcon className="w-4 h-4" />
                        {docType === 'routine' ? t.routine : t.printable}
                      </span>
                    </div>

                    {/* Badge PDF */}
                    {hasPdf && (
                      <div className="absolute bottom-4 right-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/95 shadow-lg text-foreground">
                          <Download className="w-4 h-4" />
                          PDF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Barre d'infos sous l'image */}
                  <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-foreground-secondary">
                          <FileStack className="w-4 h-4" />
                          {t.formatA4}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-foreground-secondary">
                        <Printer className="w-4 h-4" />
                        {t.printReady}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Label "cliquez pour agrandir" */}
                <p className="text-center text-sm text-foreground-secondary mt-4">
                  <Eye className="w-4 h-4 inline mr-1" />
                  {t.preview}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite - Infos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Titre et rating */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-4">
                {activity.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <RatingHearts ressourceId={activity.id} lang={lang} />
                <FavoriteButton ressourceId={activity.id} variant="button" lang={lang} />
              </div>
            </div>

            {/* Badges métadonnées */}
            <div className="flex flex-wrap gap-3 mb-6">
              {activity.age_min !== null && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: 'rgba(204, 166, 200, 0.15)', color: '#9B7A96' }}>
                  <Users className="w-4 h-4 mr-1.5" />
                  {activity.age_min}-{activity.age_max} {t.years}
                </span>
              )}
              {activity.duration && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: 'rgba(204, 166, 200, 0.15)', color: '#9B7A96' }}>
                  <Clock className="w-4 h-4 mr-1.5" />
                  {activity.duration} {lang === 'fr' ? 'min' : 'min'}
                </span>
              )}
              {activity.difficulte && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: 'rgba(204, 166, 200, 0.15)', color: '#9B7A96' }}>
                  <CheckSquare className="w-4 h-4 mr-1.5" />
                  {activity.difficulte === 'beginner' ? t.easy : activity.difficulte === 'advanced' ? t.medium : t.hard}
                </span>
              )}
            </div>

            {/* Thèmes et compétences */}
            <div className="flex flex-wrap gap-2 mb-8">
              {activity.themes?.map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {theme}
                </span>
              ))}
              {activity.competences?.map((comp, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {comp}
                </span>
              ))}
            </div>

            {/* Créateur */}
            {activity.creator && (
              <div className="mb-8">
                <CreatorWidget creator={activity.creator} lang={lang} />
              </div>
            )}

            {/* Description */}
            {activity.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-3">
                  📋 {t.description}
                </h2>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
              </div>
            )}

            {/* Galerie supplémentaire */}
            {activity.gallery_urls && activity.gallery_urls.length > 0 && (
              <div className="mb-8">
                <GalleryCarousel
                  images={activity.gallery_urls}
                  alt={activity.title}
                  className="w-full max-w-xs"
                />
              </div>
            )}

            {/* Matériel d'impression */}
            {materiels.length > 0 && (
              <div className="mb-8 bg-white dark:bg-surface-dark rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <h2 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-4">
                  🖨️ {t.materials}
                </h2>
                <ul className="space-y-2">
                  {materiels.map((mat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-foreground-secondary dark:text-foreground-dark-secondary">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#CCA6C8' }} />
                      {mat.item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-foreground-secondary italic">
                  💡 {t.laminate}
                </p>
              </div>
            )}

            {/* Astuces */}
            {activity.astuces && (
              <div className="mb-8 rounded-2xl p-6" style={{ backgroundColor: 'rgba(204, 166, 200, 0.1)', borderLeft: '4px solid #CCA6C8' }}>
                <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-2">
                  💡 {t.tips}
                </h3>
                <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
                  {activity.astuces}
                </p>
              </div>
            )}

            {/* Bouton achat/téléchargement */}
            {activity.pdf_url && (
              <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <PurchaseButton
                  ressourceId={activity.id}
                  priceCredits={activity.price_credits ?? (activity.is_premium ? 3 : 0)}
                  pdfUrl={activity.pdf_url}
                  lang={lang}
                  className="w-full h-14 font-semibold text-lg"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
