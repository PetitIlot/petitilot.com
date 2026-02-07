'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, Tag, Sparkles, Check, Users, ExternalLink, ChevronRight, Gift, Percent } from 'lucide-react'
import { motion } from 'framer-motion'
import { Language, Bundle, Creator } from '@/lib/types'
import { getActivityImageUrl } from '@/lib/cloudinary'
import CreatorWidget from '@/components/CreatorWidget'
import FavoriteButton from '@/components/FavoriteButton'
import RatingHearts from '@/components/RatingHearts'
import { Button } from '@/components/ui/button'

/**
 * BundleTemplate - Page de détail pour les Packs/Bundles
 *
 * Design: Layout premium pour présenter une collection de fiches
 * - Hero avec gradient premium multi-couleurs
 * - Grille des ressources incluses (cliquables)
 * - Section description personnalisée par le créateur
 * - Comparaison prix total vs prix pack avec économie
 * - Call-to-action proéminent
 */

const translations = {
  fr: {
    back: 'Retour',
    pack: 'Pack',
    items: 'fiches incluses',
    age: 'Âge',
    years: 'ans',
    included: 'Ce pack contient',
    viewItem: 'Voir la fiche',
    description: 'À propos de ce pack',
    creatorNote: 'Note du créateur',
    pricing: 'Votre économie',
    separatePrice: 'Prix séparé',
    packPrice: 'Prix du pack',
    savings: 'Vous économisez',
    buyPack: 'Acheter le pack',
    credits: 'crédits',
    alreadyOwned: 'Déjà acheté',
    partiallyOwned: 'fiches déjà possédées',
  },
  en: {
    back: 'Back',
    pack: 'Bundle',
    items: 'items included',
    age: 'Age',
    years: 'yrs',
    included: 'This bundle includes',
    viewItem: 'View item',
    description: 'About this bundle',
    creatorNote: 'Creator note',
    pricing: 'Your savings',
    separatePrice: 'Separate price',
    packPrice: 'Bundle price',
    savings: 'You save',
    buyPack: 'Buy bundle',
    credits: 'credits',
    alreadyOwned: 'Already owned',
    partiallyOwned: 'items already owned',
  },
  es: {
    back: 'Volver',
    pack: 'Pack',
    items: 'fichas incluidas',
    age: 'Edad',
    years: 'años',
    included: 'Este pack contiene',
    viewItem: 'Ver ficha',
    description: 'Sobre este pack',
    creatorNote: 'Nota del creador',
    pricing: 'Tu ahorro',
    separatePrice: 'Precio separado',
    packPrice: 'Precio del pack',
    savings: 'Ahorras',
    buyPack: 'Comprar pack',
    credits: 'créditos',
    alreadyOwned: 'Ya comprado',
    partiallyOwned: 'fichas ya poseídas',
  }
}

// Type étendu pour le bundle avec creator complet
type BundleWithCreator = Bundle & {
  creator?: Creator
}

interface BundleTemplateProps {
  bundle: BundleWithCreator
  lang: Language
}

export default function BundleTemplate({ bundle, lang }: BundleTemplateProps) {
  const t = translations[lang] || translations.fr
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Calculs prix
  const originalPrice = bundle.original_price_credits || bundle.items.reduce((sum, item) => sum + (item.price_credits || 0), 0)
  const savings = originalPrice - bundle.price_credits
  const savingsPercent = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0

  // Image principale
  const coverImage = bundle.vignette_url
    ? (bundle.vignette_url.startsWith('http') ? bundle.vignette_url : getActivityImageUrl(bundle.vignette_url))
    : bundle.items[0]?.vignette_url
      ? (bundle.items[0].vignette_url.startsWith('http') ? bundle.items[0].vignette_url : getActivityImageUrl(bundle.items[0].vignette_url))
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200'

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero avec gradient premium */}
      <div className="relative overflow-hidden">
        {/* Background gradient animé */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 181, 160, 0.3) 0%, rgba(204, 166, 200, 0.3) 50%, rgba(200, 216, 228, 0.3) 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:to-background-dark" />

        {/* Navigation */}
        <div className="relative z-10 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href={`/${lang}/activites`}>
              <Button variant="ghost" className="text-foreground dark:text-foreground-dark hover:bg-white/50 dark:hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </Link>
            <FavoriteButton ressourceId={bundle.id} variant="icon" lang={lang} />
          </div>
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image du pack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={coverImage}
                  alt={bundle.title}
                  className="w-full h-full object-cover"
                />
                {/* Badge Pack */}
                <div className="absolute top-4 left-4">
                  <span
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #A8B5A0, #CCA6C8)' }}
                  >
                    <Package className="w-5 h-5" />
                    {t.pack}
                  </span>
                </div>
                {/* Badge économie */}
                {savingsPercent > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold shadow-lg bg-emerald-500 text-white">
                      <Percent className="w-4 h-4" />
                      -{savingsPercent}%
                    </span>
                  </div>
                )}
              </div>
              {/* Miniatures superposées */}
              <div className="absolute -bottom-6 -right-6 flex">
                {bundle.items.slice(0, 3).map((item, idx) => {
                  const itemImage = item.vignette_url
                    ? (item.vignette_url.startsWith('http') ? item.vignette_url : getActivityImageUrl(item.vignette_url))
                    : coverImage
                  return (
                    <div
                      key={item.id}
                      className="w-16 h-16 rounded-xl overflow-hidden shadow-lg ring-4 ring-background dark:ring-background-dark"
                      style={{ marginLeft: idx > 0 ? '-12px' : 0, zIndex: 3 - idx }}
                    >
                      <img src={itemImage} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )
                })}
                {bundle.items.length > 3 && (
                  <div
                    className="w-16 h-16 rounded-xl shadow-lg ring-4 ring-background dark:ring-background-dark flex items-center justify-center bg-surface dark:bg-surface-dark font-bold text-foreground"
                    style={{ marginLeft: '-12px' }}
                  >
                    +{bundle.items.length - 3}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Infos */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground dark:text-foreground-dark mb-4">
                {bundle.title}
              </h1>

              <p className="text-xl text-foreground-secondary dark:text-foreground-dark-secondary mb-6">
                {bundle.items.length} {t.items}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-3 mb-6">
                {bundle.age_min !== null && bundle.age_max !== null && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 dark:bg-surface-dark/80 text-foreground dark:text-foreground-dark">
                    <Users className="w-4 h-4 mr-2" />
                    {bundle.age_min}-{bundle.age_max} {t.years}
                  </span>
                )}
                {bundle.themes?.slice(0, 2).map((theme, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 dark:bg-surface-dark/80"
                    style={{ color: 'var(--sage)' }}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {theme}
                  </span>
                ))}
              </div>

              {/* Section prix */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg mb-6" style={{ border: '1px solid var(--border)' }}>
                <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" style={{ color: '#CCA6C8' }} />
                  {t.pricing}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-secondary">{t.separatePrice}</span>
                    <span className="text-foreground-secondary line-through">{originalPrice} {t.credits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground dark:text-foreground-dark font-medium">{t.packPrice}</span>
                    <span className="text-2xl font-bold text-foreground dark:text-foreground-dark">{bundle.price_credits} {t.credits}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t.savings}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        {savings} {t.credits} ({savingsPercent}%)
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-6 h-14 text-lg font-semibold"
                  style={{ background: 'linear-gradient(135deg, #A8B5A0, #CCA6C8)', color: '#fff' }}
                >
                  <Package className="w-5 h-5 mr-2" />
                  {t.buyPack} — {bundle.price_credits} {t.credits}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Créateur */}
        {bundle.creator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <CreatorWidget creator={bundle.creator} lang={lang} />
          </motion.div>
        )}

        {/* Description du pack */}
        {bundle.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-4">
              📝 {t.description}
            </h2>
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed text-lg whitespace-pre-line">
                {bundle.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Liste des fiches incluses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6" style={{ color: '#CCA6C8' }} />
            {t.included}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundle.items.map((item, idx) => {
              const itemImage = item.vignette_url
                ? (item.vignette_url.startsWith('http') ? item.vignette_url : getActivityImageUrl(item.vignette_url))
                : coverImage

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.05 }}
                >
                  <Link href={`/${lang}/activites/${item.id}`}>
                    <div
                      className="group bg-surface dark:bg-surface-dark rounded-xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-all duration-300"
                      style={{ border: '1px solid var(--border)' }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={itemImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Check inclus */}
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-2 line-clamp-2 group-hover:text-sage transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          {item.price_credits && (
                            <span className="text-sm text-foreground-secondary line-through">
                              {item.price_credits} {t.credits}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-sm font-medium text-sage group-hover:text-sage-dark transition-colors">
                            {t.viewItem}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-surface dark:bg-surface-dark rounded-2xl p-8 shadow-lg" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xl text-foreground dark:text-foreground-dark mb-4">
              {bundle.items.length} {t.items} • <span className="font-bold">{savings} {t.credits}</span> {t.savings.toLowerCase()}
            </p>
            <Button
              size="lg"
              className="h-14 px-12 text-lg font-semibold"
              style={{ background: 'linear-gradient(135deg, #A8B5A0, #CCA6C8)', color: '#fff' }}
            >
              <Package className="w-5 h-5 mr-2" />
              {t.buyPack} — {bundle.price_credits} {t.credits}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
