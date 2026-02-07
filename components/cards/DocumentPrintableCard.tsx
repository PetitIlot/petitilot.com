'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, Download, Printer, Users, FileStack, CheckSquare, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Ressource, Language, Creator } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

/**
 * DocumentPrintableCard - Template pour rituels/routines & imprimables
 *
 * Design: Layout orienté document/fiche à imprimer
 * - Aperçu document style "page" avec ombre portée
 * - Indication nombre de pages / format
 * - Icônes imprimante / téléchargement
 * - Accent couleur Mauve (#CCA6C8) pour le côté organisation/planification
 */

type RessourceWithCreator = Ressource & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface DocumentPrintableCardProps {
  activity: RessourceWithCreator
  lang: Language
}

const translations = {
  fr: {
    age: 'ans',
    printable: 'Imprimable',
    routine: 'Routine',
    downloadPdf: 'PDF disponible',
    pages: 'pages',
    format: 'Format A4',
  },
  en: {
    age: 'yrs',
    printable: 'Printable',
    routine: 'Routine',
    downloadPdf: 'PDF available',
    pages: 'pages',
    format: 'A4 Format',
  },
  es: {
    age: 'años',
    printable: 'Imprimible',
    routine: 'Rutina',
    downloadPdf: 'PDF disponible',
    pages: 'páginas',
    format: 'Formato A4',
  }
}

// Détecter le type de document
const getDocumentType = (categories: string[] | null) => {
  const cats = (categories || []).map(c => c.toLowerCase())
  if (cats.some(c => c.includes('imprimable') || c.includes('printable'))) return 'printable'
  if (cats.some(c => c.includes('rituel') || c.includes('routine'))) return 'routine'
  return 'document'
}

export default function DocumentPrintableCard({ activity, lang }: DocumentPrintableCardProps) {
  if (!activity) return null

  const imageSource = activity.vignette_url || activity.images_urls?.[0]
  const coverImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  const t = translations[lang] || translations.fr
  const docType = getDocumentType(activity.categories)
  const hasPdf = !!activity.pdf_url

  // Icône selon le type
  const DocIcon = docType === 'routine' ? Calendar : docType === 'printable' ? Printer : FileText

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/activites/${activity.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300 group" style={{ border: '1px solid var(--border)' }}>

          {/* Section aperçu document */}
          <div className="p-5 pb-3 bg-gradient-to-br from-[#F8F6FA] to-[#F0ECF5] dark:from-[#2D2A32] dark:to-[#252228]">
            <div className="relative">
              {/* Conteneur style "page" */}
              <div className="relative mx-auto" style={{ width: '85%', maxWidth: '200px' }}>
                {/* Ombre de pages empilées */}
                <div
                  className="absolute -bottom-1 -right-1 w-full h-full rounded-lg bg-foreground/5 dark:bg-white/5"
                  style={{ transform: 'rotate(2deg)' }}
                />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-full h-full rounded-lg bg-foreground/10 dark:bg-white/10"
                  style={{ transform: 'rotate(1deg)' }}
                />

                {/* Page principale avec image */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-white dark:bg-surface-dark ring-1 ring-foreground/10 dark:ring-white/10">
                  <Image
                    src={coverImage}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge type en haut */}
                  <div className="absolute top-2 left-2">
                    <span
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md shadow-sm"
                      style={{
                        backgroundColor: 'rgba(204, 166, 200, 0.95)',
                        color: '#fff'
                      }}
                    >
                      <DocIcon className="w-3 h-3" />
                      {docType === 'routine' ? t.routine : t.printable}
                    </span>
                  </div>

                  {/* Indicateur PDF */}
                  {hasPdf && (
                    <div className="absolute bottom-2 right-2">
                      <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm shadow-sm text-foreground dark:text-foreground-dark">
                        <Download className="w-3 h-3" />
                        PDF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating flottant */}
              <div className="absolute top-0 right-0 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                <RatingHearts ressourceId={activity.id} variant="display" size="xs" lang={lang} />
              </div>
            </div>
          </div>

          {/* Contenu texte */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark text-lg leading-tight mb-2 line-clamp-2">
              {activity.title}
            </h3>

            {/* Infos document */}
            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
              {activity.age_min !== null && activity.age_max !== null && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Users className="w-3 h-3" />
                  {activity.age_min}-{activity.age_max} {t.age}
                </span>
              )}
              {hasPdf && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md text-foreground-secondary dark:text-foreground-dark-secondary" style={{ backgroundColor: 'rgba(204, 166, 200, 0.15)' }}>
                  <FileStack className="w-3 h-3" />
                  {t.format}
                </span>
              )}
            </div>

            {/* Thèmes et compétences */}
            <div className="flex flex-wrap gap-1.5">
              {activity.themes?.slice(0, 2).map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
                  style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
                >
                  {theme}
                </span>
              ))}
              {activity.competences?.slice(0, 1).map((comp, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
                  style={{ color: '#8B7EC8', backgroundColor: 'rgba(139, 126, 200, 0.12)' }}
                >
                  {comp}
                </span>
              ))}
            </div>

            {/* Créateur */}
            {activity.creator && (
              <div className="mt-3 pt-3 border-t border-foreground/[0.08] dark:border-white/[0.1] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-[#D4B8D0] to-[#CCA6C8] flex-shrink-0 ring-2 ring-surface dark:ring-surface-dark">
                  {activity.creator.avatar_url ? (
                    <img src={activity.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-white font-semibold">
                      {activity.creator.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground dark:text-foreground-dark">
                    {activity.creator.display_name}
                  </span>
                  <span className="text-[10px] text-foreground-secondary dark:text-foreground-dark-secondary">
                    {lang === 'fr' ? 'Créateur' : lang === 'es' ? 'Creador' : 'Creator'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
