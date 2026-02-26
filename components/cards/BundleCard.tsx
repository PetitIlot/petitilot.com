'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, Tag, Sparkles, ArrowRight, Check, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Bundle, Language, Creator } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import RatingHearts from '@/components/RatingHearts'

/**
 * BundleCard - Template pour Packs/Bundles de ressources
 *
 * Design: Layout élégant pour présenter un ensemble de fiches
 * - Grille de miniatures des ressources incluses
 * - Prix total vs prix séparés avec économie
 * - Section description du pack
 * - Design premium pour mettre en valeur l'offre
 * - Accent dégradé multi-couleurs pour effet "collection"
 */

// Type local pour le bundle avec creator simplifié (pour la carte)
type BundleForCard = Omit<Bundle, 'creator'> & {
  creator?: Pick<Creator, 'id' | 'slug' | 'display_name' | 'avatar_url'> | null
}

interface BundleCardProps {
  bundle: BundleForCard
  lang: Language
}

const translations = {
  fr: {
    pack: 'Pack',
    items: 'fiches incluses',
    savings: 'Économie',
    viewPack: 'Voir le pack',
    age: 'ans',
    included: 'Inclus dans ce pack',
    credits: 'crédits',
  },
  en: {
    pack: 'Bundle',
    items: 'items included',
    savings: 'Save',
    viewPack: 'View bundle',
    age: 'yrs',
    included: 'Included in this bundle',
    credits: 'credits',
  },
  es: {
    pack: 'Pack',
    items: 'fichas incluidas',
    savings: 'Ahorro',
    viewPack: 'Ver pack',
    age: 'años',
    included: 'Incluido en este pack',
    credits: 'créditos',
  }
}

export default function BundleCard({ bundle, lang }: BundleCardProps) {
  if (!bundle) return null

  const t = translations[lang] || translations.fr

  // Calcul de l'économie
  const originalPrice = bundle.original_price_credits || bundle.items.reduce((sum, item) => sum + (item.price_credits || 0), 0)
  const savings = originalPrice - bundle.price_credits
  const savingsPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0

  // Image principale du pack
  const coverImage = bundle.vignette_url
    ? (bundle.vignette_url.startsWith('http') ? bundle.vignette_url : getActivityImageUrl(bundle.vignette_url))
    : bundle.items[0]?.vignette_url
      ? (bundle.items[0].vignette_url.startsWith('http') ? bundle.items[0].vignette_url : getActivityImageUrl(bundle.items[0].vignette_url))
      : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${lang}/packs/${bundle.id}`}>
        <div className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 group relative" style={{ border: '1px solid var(--border)' }}>

          {/* Bordure gradient premium */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 181, 160, 0.3), rgba(204, 166, 200, 0.3), rgba(200, 216, 228, 0.3))',
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor'
            }}
          />

          {/* Header avec image principale et badge pack */}
          <div className="relative">
            {/* Image principale */}
            <div className="aspect-[16/9] overflow-hidden relative">
              <Image
                src={coverImage}
                alt={bundle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Badge Pack premium */}
              <div className="absolute top-3 left-3">
                <span
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #A8B5A0, #CCA6C8)',
                    color: '#fff'
                  }}
                >
                  <Package className="w-3.5 h-3.5" />
                  {t.pack}
                </span>
              </div>

              {/* Badge économie */}
              {savingsPercent > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg bg-emerald-500 text-white">
                    <Tag className="w-3 h-3" />
                    -{savingsPercent}%
                  </span>
                </div>
              )}

              {/* Titre sur l'image */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-bold text-white text-xl leading-tight line-clamp-2 drop-shadow-lg">
                  {bundle.title}
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  {bundle.items.length} {t.items}
                </p>
              </div>
            </div>
          </div>

          {/* Grille de miniatures des items */}
          <div className="p-4 pb-3">
            <div className="text-[10px] font-semibold text-foreground-secondary dark:text-foreground-dark-secondary uppercase tracking-wide mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t.included}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {bundle.items.slice(0, 4).map((item, idx) => {
                const itemImage = item.vignette_url
                  ? (item.vignette_url.startsWith('http') ? item.vignette_url : getActivityImageUrl(item.vignette_url))
                  : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100'

                return (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-foreground/10 dark:ring-white/10 group/item"
                  >
                    <Image
                      src={itemImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay avec check */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    {/* Tooltip titre au hover */}
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <span className="text-[9px] text-white line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Indicateur + si plus de 4 items */}
              {bundle.items.length > 4 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface dark:bg-surface-dark flex items-center justify-center text-[10px] font-bold text-foreground dark:text-foreground-dark ring-2 ring-surface dark:ring-surface-dark shadow-md" style={{ transform: 'translate(25%, 25%)' }}>
                  +{bundle.items.length - 4}
                </div>
              )}
            </div>

            {/* Section prix */}
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'rgba(122, 139, 111, 0.08)' }}>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground dark:text-foreground-dark">
                    {bundle.price_credits} {t.credits}
                  </span>
                  {originalPrice > bundle.price_credits && (
                    <span className="text-sm text-foreground-secondary dark:text-foreground-dark-secondary line-through">
                      {originalPrice}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.savings} {savings} {t.credits}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-full transition-colors" style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.15)' }}>
                {t.viewPack}
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {bundle.age_min !== null && bundle.age_max !== null && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-foreground-secondary dark:text-foreground-dark-secondary">
                  <Users className="w-3 h-3" />
                  {bundle.age_min}-{bundle.age_max} {t.age}
                </span>
              )}
              {bundle.themes?.slice(0, 2).map((theme, idx) => (
                <span
                  key={`theme-${idx}`}
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{ color: 'var(--sage)', backgroundColor: 'rgba(122, 139, 111, 0.12)' }}
                >
                  {theme}
                </span>
              ))}
            </div>

            {/* Créateur */}
            {bundle.creator && (
              <div className="mt-3 pt-3 border-t border-foreground/[0.08] dark:border-white/[0.1] flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-surface dark:ring-surface-dark"
                  style={{ background: 'linear-gradient(135deg, #A8B5A0, #CCA6C8)' }}
                >
                  {bundle.creator.avatar_url ? (
                    <img src={bundle.creator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs text-white font-semibold">
                      {bundle.creator.display_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground dark:text-foreground-dark">
                    {bundle.creator.display_name}
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
