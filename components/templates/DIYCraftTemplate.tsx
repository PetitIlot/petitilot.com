'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Hammer, Scissors, Recycle, Wrench, Package, BarChart3, CheckCircle2, Circle, Tag, Lightbulb, ExternalLink, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Language, MaterielItem } from '@/lib/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { getActivityImageUrl } from '@/lib/cloudinary'
import CreatorWidget from '@/components/CreatorWidget'
import FavoriteButton from '@/components/FavoriteButton'
import PurchaseButton from '@/components/PurchaseButton'
import RatingHearts from '@/components/RatingHearts'
import GalleryCarousel from '@/components/ui/GalleryCarousel'
import { Button } from '@/components/ui/button'

/**
 * DIYCraftTemplate - Page de détail pour DIY & récup et Jeux symboliques
 *
 * Design: Layout atelier/bricolage avec accent sur le fait-main
 * - En-tête avec badge récup si applicable
 * - Liste matériel en grille visuelle
 * - Étapes de construction numérotées
 * - Style "fiche technique" / plan de construction
 * - Couleur Sage (#A8B5A0) pour le côté éco/fait-main
 */

const translations = {
  fr: {
    back: 'Retour aux activités',
    diy: 'DIY',
    craft: 'Bricolage',
    imaginativePlay: 'Jeu imaginatif',
    recycled: 'Matériaux récup',
    age: 'Âge',
    years: 'ans',
    duration: 'Durée',
    minutes: 'min',
    difficulty: 'Difficulté',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Élaboré',
    withAdult: 'Avec un adulte',
    autonomous: 'Autonome',
    materials: 'Matériaux nécessaires',
    tools: 'Outils',
    recycledItems: 'Matériaux de récup',
    newItems: 'À acheter',
    steps: 'Étapes de construction',
    tips: 'Astuces bricolage',
    result: 'Le résultat',
    buyMaterials: 'Où trouver',
    stepPrefix: 'Étape',
    ecoFriendly: 'Éco-responsable',
    homemade: 'Fait maison',
  },
  en: {
    back: 'Back to activities',
    diy: 'DIY',
    craft: 'Craft',
    imaginativePlay: 'Imaginative play',
    recycled: 'Recycled materials',
    age: 'Age',
    years: 'yrs',
    duration: 'Duration',
    minutes: 'min',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Advanced',
    withAdult: 'With an adult',
    autonomous: 'Autonomous',
    materials: 'Materials needed',
    tools: 'Tools',
    recycledItems: 'Recycled items',
    newItems: 'To buy',
    steps: 'Build steps',
    tips: 'Craft tips',
    result: 'The result',
    buyMaterials: 'Where to find',
    stepPrefix: 'Step',
    ecoFriendly: 'Eco-friendly',
    homemade: 'Homemade',
  },
  es: {
    back: 'Volver a actividades',
    diy: 'DIY',
    craft: 'Manualidad',
    imaginativePlay: 'Juego imaginativo',
    recycled: 'Materiales reciclados',
    age: 'Edad',
    years: 'años',
    duration: 'Duración',
    minutes: 'min',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Avanzado',
    withAdult: 'Con un adulto',
    autonomous: 'Autónomo',
    materials: 'Materiales necesarios',
    tools: 'Herramientas',
    recycledItems: 'Materiales reciclados',
    newItems: 'Para comprar',
    steps: 'Pasos de construcción',
    tips: 'Consejos de bricolaje',
    result: 'El resultado',
    buyMaterials: 'Dónde encontrar',
    stepPrefix: 'Paso',
    ecoFriendly: 'Ecológico',
    homemade: 'Hecho en casa',
  }
}

// Détecter si c'est DIY ou jeu symbolique
const getProjectType = (categories: string[] | null): 'diy' | 'symbolic' => {
  const cats = (categories || []).map(c => c.toLowerCase())
  if (cats.some(c => c.includes('jeux symboliques') || c.includes('symbolique') || c.includes('imaginative'))) {
    return 'symbolic'
  }
  return 'diy'
}

// Séparer les matériaux récup, outils et autres
const categorizeMaterials = (materiel: MaterielItem[] | null) => {
  const recycled: MaterielItem[] = []
  const tools: MaterielItem[] = []
  const other: MaterielItem[] = []

  const toolKeywords = ['ciseaux', 'colle', 'pistolet', 'règle', 'cutter', 'agrafeuse', 'pinceau', 'stylo', 'crayon', 'feutre', 'scissors', 'glue', 'ruler', 'brush', 'pen', 'pencil', 'marker']

  ;(materiel || []).forEach(item => {
    const itemLower = item.item.toLowerCase()
    if (item.recup) {
      recycled.push(item)
    } else if (toolKeywords.some(k => itemLower.includes(k))) {
      tools.push(item)
    } else {
      other.push(item)
    }
  })

  return { recycled, tools, other }
}

interface DIYCraftTemplateProps {
  activity: RessourceWithCreator
  lang: Language
}

export default function DIYCraftTemplate({ activity, lang }: DIYCraftTemplateProps) {
  const t = translations[lang] || translations.fr
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())

  const imageSource = activity.images_urls?.[0] || activity.vignette_url
  const heroImage = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200'

  const projectType = getProjectType(activity.categories)
  const { recycled, tools, other } = categorizeMaterials(activity.materiel_json)
  const hasRecycled = recycled.length > 0

  const difficultyLabel = activity.difficulte === 'beginner' ? t.easy
    : activity.difficulte === 'advanced' ? t.medium : t.hard

  // Étapes à partir de la description
  const steps = activity.description?.split(/\n\n|\. (?=[A-Z0-9])/).filter(s => s.trim().length > 15) || []

  const toggleStep = (idx: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(idx)) newChecked.delete(idx)
    else newChecked.add(idx)
    setCheckedSteps(newChecked)
  }

  const TypeIcon = projectType === 'symbolic' ? Sparkles : Hammer

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href={`/${lang}/activites`}>
          <Button variant="ghost" className="mb-6 text-foreground dark:text-foreground-dark hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </Link>

        {/* Header avec image et infos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-surface-dark rounded-3xl shadow-apple overflow-hidden mb-8"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Section image + titre */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={heroImage}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              {/* Badges sur l'image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg"
                  style={{ backgroundColor: 'rgba(122, 139, 111, 0.95)', color: '#fff' }}
                >
                  <TypeIcon className="w-4 h-4" />
                  {projectType === 'symbolic' ? t.imaginativePlay : t.diy}
                </span>
                {hasRecycled && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg bg-emerald-500 text-white">
                    <Recycle className="w-4 h-4" />
                    {t.ecoFriendly}
                  </span>
                )}
              </div>
              {/* Rating */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <RatingHearts ressourceId={activity.id} variant="display" size="sm" lang={lang} />
              </div>
            </div>

            {/* Infos */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark mb-4">
                {activity.title}
              </h1>

              {/* Fiche technique */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(122, 139, 111, 0.08)' }}>
                {activity.age_min !== null && (
                  <div>
                    <p className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">{t.age}</p>
                    <p className="font-semibold text-foreground dark:text-foreground-dark flex items-center gap-1">
                      <Users className="w-4 h-4 text-sage" />
                      {activity.age_min}-{activity.age_max} {t.years}
                    </p>
                  </div>
                )}
                {activity.duration && (
                  <div>
                    <p className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">{t.duration}</p>
                    <p className="font-semibold text-foreground dark:text-foreground-dark flex items-center gap-1">
                      <Clock className="w-4 h-4 text-sage" />
                      {activity.duration_max ? `${activity.duration}-${activity.duration_max}` : activity.duration} {t.minutes}
                    </p>
                  </div>
                )}
                {activity.difficulte && (
                  <div>
                    <p className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">{t.difficulty}</p>
                    <p className="font-semibold text-foreground dark:text-foreground-dark flex items-center gap-1">
                      <BarChart3 className="w-4 h-4 text-sage" />
                      {difficultyLabel}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">Autonomie</p>
                  <p className="font-semibold text-foreground dark:text-foreground-dark">
                    {activity.autonomie ? t.autonomous : t.withAdult}
                  </p>
                </div>
              </div>

              {/* Thèmes et compétences */}
              <div className="flex flex-wrap gap-2 mb-4">
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

              <FavoriteButton ressourceId={activity.id} variant="button" lang={lang} />
            </div>
          </div>
        </motion.div>

        {/* Créateur */}
        {activity.creator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <CreatorWidget creator={activity.creator} lang={lang} />
          </motion.div>
        )}

        {/* Section Matériaux - Style panneau d'atelier */}
        {(recycled.length > 0 || tools.length > 0 || other.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 bg-surface dark:bg-surface-dark rounded-2xl p-6"
            style={{ border: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-sage" />
              {t.materials}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Matériaux récup */}
              {recycled.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <Recycle className="w-5 h-5" />
                    {t.recycledItems}
                  </h3>
                  <ul className="space-y-2">
                    {recycled.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground dark:text-foreground-dark">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="flex-1">{item.item}</span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outils */}
              {tools.length > 0 && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(122, 139, 111, 0.08)', border: '1px solid rgba(122, 139, 111, 0.2)' }}>
                  <h3 className="font-semibold text-sage-dark dark:text-sage-light mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    {t.tools}
                  </h3>
                  <ul className="space-y-2">
                    {tools.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground dark:text-foreground-dark">
                        <span className="w-2 h-2 rounded-full bg-sage" />
                        <span className="flex-1">{item.item}</span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-sage hover:text-sage-dark" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Autres matériaux */}
              {other.length > 0 && (
                <div className="p-4 rounded-xl bg-surface-secondary dark:bg-surface-dark" style={{ border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-3 flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-sage" />
                    {t.newItems}
                  </h3>
                  <ul className="space-y-2">
                    {other.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground dark:text-foreground-dark">
                        <span className="w-2 h-2 rounded-full bg-foreground-secondary" />
                        <span className="flex-1">{item.item}</span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-sage hover:text-sage-dark" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Galerie */}
        {activity.gallery_urls && activity.gallery_urls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark mb-4">
              📸 {t.result}
            </h2>
            <GalleryCarousel
              images={activity.gallery_urls}
              alt={activity.title}
              className="w-full max-w-lg"
            />
          </motion.div>
        )}

        {/* Étapes de construction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-6 flex items-center gap-2">
            🔨 {t.steps}
          </h2>

          {steps.length > 0 ? (
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => toggleStep(idx)}
                  className={`flex gap-4 p-5 rounded-xl cursor-pointer transition-all ${
                    checkedSteps.has(idx)
                      ? 'bg-sage/15 dark:bg-sage/25'
                      : 'bg-surface dark:bg-surface-dark hover:bg-surface-secondary'
                  }`}
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                      checkedSteps.has(idx)
                        ? 'bg-sage text-white'
                        : 'bg-sage/20 text-sage-dark'
                    }`}
                  >
                    {checkedSteps.has(idx) ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">
                      {t.stepPrefix} {idx + 1}
                    </p>
                    <p className={`leading-relaxed ${checkedSteps.has(idx) ? 'text-foreground-secondary line-through' : 'text-foreground dark:text-foreground-dark'}`}>
                      {step.trim()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : activity.description && (
            <div className="bg-surface dark:bg-surface-dark rounded-xl p-6" style={{ border: '1px solid var(--border)' }}>
              <p className="text-foreground-secondary dark:text-foreground-dark-secondary leading-relaxed whitespace-pre-line">
                {activity.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Astuces */}
        {activity.astuces && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 rounded-2xl p-6"
            style={{ backgroundColor: 'rgba(122, 139, 111, 0.1)', borderLeft: '4px solid var(--sage)' }}
          >
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark mb-3">
              💡 {t.tips}
            </h3>
            <p className="text-foreground-secondary dark:text-foreground-dark-secondary italic leading-relaxed">
              {activity.astuces}
            </p>
          </motion.div>
        )}

        {/* Bouton achat/téléchargement */}
        {activity.pdf_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="pt-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <PurchaseButton
              ressourceId={activity.id}
              priceCredits={activity.price_credits ?? (activity.is_premium ? 3 : 0)}
              pdfUrl={activity.pdf_url}
              lang={lang}
              className="w-full h-14 font-semibold text-lg"
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
