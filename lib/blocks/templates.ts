/**
 * Canvas Templates v4.0
 * 6 templates organisés par format de mise en page :
 *   ÉTROIT   (2) — paddingHorizontal 400 — colonne 600px
 *   MOYEN    (2) — paddingHorizontal 200 — zone 1000px
 *   PLEINE   (2) — paddingHorizontal   0 — largeur totale ~1400px
 */

import type { ContentBlocksData, ContentBlock } from './types'
import { createBlock } from './types'

// ─────────────────────────────────────────────
// HELPERS géométrie
// ─────────────────────────────────────────────

/** ÉTROIT : colonne 600px centrée, marge 400 de chaque côté */
const NARROW = { left: 400, w: 600 }

/** MOYEN : zone 1000px, marge 200 de chaque côté */
const MEDIUM = { left: 200, w: 1000, colW: 480, col2: 720 }

/** PLEIN : largeur totale ~1400px */
const FULL = { left: 40, w: 1320, colW: 640, col2: 720 }

// ─────────────────────────────────────────────
// T1 — ÉTROIT : Fiche Essentielle
// Colonne unique épurée. Titre → Image → Texte → Matériel → Achat → Créateur
// ─────────────────────────────────────────────
export function createNarrowEssentialTemplate(): ContentBlocksData {
  const { left, w } = NARROW
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 36,
      alignment: 'center' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'center' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 40, width: w, height: 'auto', zIndex: 1 }),

    createBlock('image', {
      url: '',
      alt: 'Illustration principale',
      objectFit: 'cover' as const,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 220, width: w, height: 280, zIndex: 2 }, {
      borderRadius: 16,
      shadow: 'apple',
    }),

    createBlock('text', {
      content: '<p>Décrivez votre activité ici. Expliquez ce que les enfants vont apprendre et pourquoi elle est enrichissante pour leur développement.</p>',
      fontSize: 15,
      alignment: 'left' as const,
    }, { x: left, y: 520, width: w, height: 'auto', zIndex: 3 }),

    createBlock('material', {
      showLinks: true,
      showRecupBadge: true,
      showAffiliateNote: false,
      layout: 'list' as const,
      titleText: 'Matériel',
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 670, width: w, height: 'auto', zIndex: 4 }, {
      backgroundColor: '#F0F4ED',
      borderRadius: 14,
      padding: 20,
      border: true,
      borderColor: '#C5D4BC',
      shadow: 'sm',
    }),

    createBlock('separator', {
      style: 'fade' as const,
      direction: 'horizontal' as const,
      thickness: 1,
      length: 60,
      color: '#C5D4BC',
      align: 'center' as const,
      opacity: 50,
    }, { x: left + 100, y: 920, width: w - 200, height: 20, zIndex: 5 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Obtenir cette fiche',
      buttonColor: '#7A8B6F',
      borderRadius: 'rounded' as const,
    }, { x: left, y: 960, width: w, height: 'auto', zIndex: 6 }, {
      borderRadius: 18,
      padding: 22,
      shadow: 'apple',
      backgroundGradient: {
        type: 'linear',
        angle: 145,
        colors: [
          { color: '#F0F4ED', position: 0 },
          { color: '#FFFFFF', position: 100 },
        ],
      },
    }),

    createBlock('creator', {
      variant: 'compact' as const,
      showStats: false,
      showFollowButton: true,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 1140, width: w, height: 'auto', zIndex: 7 }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 400 },
    layout: { desktop: blocks },
    metadata: { templateName: 'narrow-essential', lastEditedAt: new Date().toISOString() },
  }
}

// ─────────────────────────────────────────────
// T2 — ÉTROIT : Journal & Découverte
// Story-driven, texte en tête. Titre → Intro → Liste → Image → Astuce → Créateur → Achat
// ─────────────────────────────────────────────
export function createNarrowStoryTemplate(): ContentBlocksData {
  const { left, w } = NARROW
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 38,
      alignment: 'left' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'left' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 40, width: w, height: 'auto', zIndex: 1 }),

    createBlock('text', {
      content: '<p>Une courte introduction pour accrocher le lecteur. Expliquez en quelques phrases pourquoi cette activité est précieuse pour les enfants.</p>',
      fontSize: 15,
      alignment: 'left' as const,
    }, { x: left, y: 220, width: w, height: 'auto', zIndex: 2 }),

    createBlock('separator', {
      style: 'fade' as const,
      direction: 'horizontal' as const,
      thickness: 1,
      length: 30,
      color: '#A8B5A0',
      align: 'start' as const,
      opacity: 60,
    }, { x: left, y: 370, width: 200, height: 20, zIndex: 3 }),

    createBlock('list', {
      title: 'Ce que l\'on va explorer',
      items: ['Observation de la nature', 'Manipulation et toucher', 'Éveil créatif', 'Partage et langage', 'Patience et concentration'],
      bulletStyle: 'check' as const,
      columns: 1,
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 410, width: w, height: 'auto', zIndex: 4 }, {
      borderRadius: 14,
      padding: 20,
      border: true,
      borderColor: '#C5D4BC',
      backgroundColor: '#F8FAF7',
    }),

    createBlock('image', {
      url: '',
      alt: 'Photo de l\'activité',
      objectFit: 'cover' as const,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 630, width: w, height: 260, zIndex: 5 }, {
      borderRadius: 14,
      shadow: 'md',
    }),

    createBlock('text', {
      content: '<p><strong>Astuce pédagogique</strong></p><p>Laissez l\'enfant aller à son rythme. L\'observation libre est souvent plus riche qu\'une consigne stricte.</p>',
      fontSize: 14,
    }, { x: left, y: 910, width: w, height: 'auto', zIndex: 6 }, {
      borderRadius: 14,
      padding: 18,
      border: true,
      borderColor: 'rgba(168, 181, 160, 0.4)',
      backgroundColor: 'rgba(168, 181, 160, 0.08)',
    }),

    createBlock('creator', {
      variant: 'compact' as const,
      showStats: false,
      showFollowButton: true,
    }, { x: left, y: 1050, width: w, height: 'auto', zIndex: 7 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Accéder à la ressource',
      buttonColor: '#7A8B6F',
      borderRadius: 'rounded' as const,
    }, { x: left, y: 1200, width: w, height: 'auto', zIndex: 8 }, {
      borderRadius: 18,
      padding: 22,
      shadow: 'apple',
    }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 400 },
    layout: { desktop: blocks },
    metadata: { templateName: 'narrow-story', lastEditedAt: new Date().toISOString() },
  }
}

// ─────────────────────────────────────────────
// T3 — MOYEN : Activité & Matériel
// Deux colonnes confortables. Titre → Image bannière → Texte|Matériel → Créateur|Achat
// ─────────────────────────────────────────────
export function createMediumActivityTemplate(): ContentBlocksData {
  const { left, w, colW, col2 } = MEDIUM
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 40,
      alignment: 'left' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'left' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 40, width: w, height: 'auto', zIndex: 1 }),

    createBlock('image', {
      url: '',
      alt: 'Image principale',
      objectFit: 'cover' as const,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 220, width: w, height: 340, zIndex: 2 }, {
      borderRadius: 20,
      shadow: 'apple',
    }),

    createBlock('text', {
      content: '<h3>Description</h3><p>Expliquez en détail le déroulement de l\'activité. Mentionnez les compétences développées, l\'âge recommandé et le niveau d\'autonomie nécessaire.</p>',
      fontSize: 15,
    }, { x: left, y: 580, width: colW, height: 'auto', zIndex: 3 }),

    createBlock('material', {
      showLinks: true,
      showRecupBadge: true,
      showAffiliateNote: true,
      layout: 'two-columns' as const,
      titleText: 'Matériel nécessaire',
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 580, width: colW, height: 'auto', zIndex: 4 }, {
      backgroundColor: '#F0F4ED',
      borderRadius: 16,
      padding: 20,
      border: true,
      borderColor: '#C5D4BC',
      shadow: 'sm',
    }),

    createBlock('separator', {
      style: 'fade' as const,
      direction: 'horizontal' as const,
      thickness: 1,
      length: 60,
      color: '#C5D4BC',
      align: 'center' as const,
      opacity: 50,
    }, { x: left + 100, y: 840, width: w - 200, height: 20, zIndex: 5 }),

    createBlock('creator', {
      variant: 'compact' as const,
      showStats: true,
      showFollowButton: true,
    }, { x: left, y: 880, width: colW, height: 'auto', zIndex: 6 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Obtenir cette activité',
      buttonColor: '#7A8B6F',
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 880, width: colW, height: 'auto', zIndex: 7 }, {
      glass: true,
      glassIntensity: 'medium',
      borderRadius: 20,
      padding: 24,
      shadow: 'apple',
    }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 200 },
    layout: { desktop: blocks },
    metadata: { templateName: 'medium-activity', lastEditedAt: new Date().toISOString() },
  }
}

// ─────────────────────────────────────────────
// T4 — MOYEN : Tutoriel Vidéo
// Vidéo + objectifs côte à côte → FAQ|Achat → Créateur pleine largeur
// ─────────────────────────────────────────────
export function createMediumVideoTemplate(): ContentBlocksData {
  const { left, w, col2 } = MEDIUM
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 38,
      alignment: 'left' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'left' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 40, width: w, height: 'auto', zIndex: 1 }),

    // Vidéo large + liste objectifs à droite
    createBlock('video', {
      url: '',
      platform: 'auto' as const,
      aspectRatio: '16:9' as const,
    }, { x: left, y: 220, width: 620, height: 350, zIndex: 2 }, {
      borderRadius: 16,
      shadow: 'apple',
    }),

    createBlock('list', {
      title: 'Ce que vous apprendrez',
      items: ['Compétence clé 1', 'Compétence clé 2', 'Compétence clé 3', 'Compétence clé 4'],
      bulletStyle: 'check' as const,
      columns: 1,
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: col2 + 40, y: 220, width: 340, height: 'auto', zIndex: 3 }, {
      backgroundColor: '#F0F4ED',
      borderRadius: 16,
      padding: 20,
      border: true,
      borderColor: '#C5D4BC',
    }),

    createBlock('text', {
      content: '<p>Dans ce tutoriel, suivez les étapes une à une. Mettez pause dès que vous en avez besoin. Chaque geste compte !</p>',
      fontSize: 15,
    }, { x: left, y: 590, width: w, height: 'auto', zIndex: 4 }),

    createBlock('faq', {
      items: [
        { question: 'Quel âge est recommandé ?', answer: 'Dès 3 ans avec accompagnement, en autonomie à partir de 5 ans.' },
        { question: 'Ai-je besoin de matériel spécifique ?', answer: 'Non, tout le matériel est listé dans la fiche téléchargeable.' },
      ],
      style: 'bordered' as const,
      expandMode: 'single' as const,
      iconStyle: 'chevron' as const,
      questionFontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 720, width: 480, height: 'auto', zIndex: 5 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Télécharger les ressources',
      buttonColor: '#7BA3C4',
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 720, width: 480, height: 'auto', zIndex: 6 }, {
      backgroundGradient: {
        type: 'linear',
        angle: 135,
        colors: [
          { color: '#EDF4F8', position: 0 },
          { color: '#FFFFFF', position: 100 },
        ],
      },
      borderRadius: 20,
      padding: 24,
      shadow: 'apple',
    }),

    createBlock('creator', {
      variant: 'compact' as const,
      showStats: true,
      showFollowButton: true,
    }, { x: left, y: 960, width: w, height: 'auto', zIndex: 7 }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 200 },
    layout: { desktop: blocks },
    metadata: { templateName: 'medium-video', lastEditedAt: new Date().toISOString() },
  }
}

// ─────────────────────────────────────────────
// T5 — PLEIN : Galerie de Projet
// Image-forward, pleine largeur. Titre → Carousel → Texte|Liens → Grille → Créateur|Achat
// ─────────────────────────────────────────────
export function createFullGalleryTemplate(): ContentBlocksData {
  const { left, w, colW, col2 } = FULL
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 42,
      alignment: 'center' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'center' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 30, width: w, height: 'auto', zIndex: 1 }),

    createBlock('carousel', {
      images: [],
      carouselType: 'coverflow' as const,
      autoPlay: false,
      showDots: true,
      showArrows: true,
      interval: 3000,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 210, width: w, height: 450, zIndex: 2 }, {
      borderRadius: 20,
      shadow: 'apple',
    }),

    createBlock('text', {
      content: '<p>Décrivez votre projet ou galerie. Expliquez la démarche créative, les matériaux utilisés et ce que les enfants ont découvert en réalisant chaque pièce.</p>',
      fontSize: 15,
    }, { x: left, y: 680, width: colW, height: 'auto', zIndex: 3 }),

    createBlock('list-links', {
      title: 'Ressources & fournitures',
      items: [],
      bulletStyle: 'dot' as const,
      showAffiliateNote: true,
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 680, width: colW, height: 'auto', zIndex: 4 }, {
      borderRadius: 16,
      padding: 20,
      border: true,
      borderColor: 'var(--border)',
    }),

    createBlock('image-grid', {
      images: [],
      layout: 'grid-3' as const,
      gap: 10,
      borderRadius: 'rounded' as const,
      showCaptions: true,
      captionFontSize: 11,
    }, { x: left, y: 890, width: w, height: 'auto', zIndex: 5 }, {
      borderRadius: 16,
    }),

    createBlock('creator', {
      variant: 'full' as const,
      showStats: true,
      showFollowButton: true,
    }, { x: left, y: 1200, width: colW, height: 'auto', zIndex: 6 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Obtenir le dossier complet',
      buttonColor: '#7A8B6F',
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 1200, width: colW, height: 'auto', zIndex: 7 }, {
      glass: true,
      glassIntensity: 'light',
      borderRadius: 20,
      padding: 24,
      shadow: 'md',
    }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 0 },
    layout: { desktop: blocks },
    metadata: { templateName: 'full-gallery', lastEditedAt: new Date().toISOString() },
  }
}

// ─────────────────────────────────────────────
// T6 — PLEIN : Atelier & DIY
// Complet et structuré. Titre|Image → Texte|Matériel → Grille photos → Étapes|FAQ → Créateur|Achat
// ─────────────────────────────────────────────
export function createFullWorkshopTemplate(): ContentBlocksData {
  const { left, w, colW, col2 } = FULL
  const blocks: ContentBlock[] = [
    createBlock('title', {
      titleSize: 40,
      alignment: 'left' as const,
      borderRadius: 'rounded' as const,
      elements: { showTitle: true, showSocial: true, showTags: true },
      social: { variant: 'classic' as const, style: 'gem' as const },
      tags: { variant: 'classic' as const, alignment: 'left' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const },
    }, { x: left, y: 30, width: 780, height: 'auto', zIndex: 1 }),

    createBlock('image', {
      url: '',
      alt: 'Résultat final',
      objectFit: 'cover' as const,
      borderRadius: 'rounded' as const,
    }, { x: 860, y: 30, width: 500, height: 260, zIndex: 2 }, {
      borderRadius: 20,
      shadow: 'apple',
    }),

    createBlock('text', {
      content: '<h3>Présentation</h3><p>Décrivez l\'atelier : ce que les enfants vont réaliser, les compétences développées, la durée et le niveau de difficulté.</p>',
      fontSize: 15,
    }, { x: left, y: 320, width: colW, height: 'auto', zIndex: 3 }),

    createBlock('material', {
      showLinks: true,
      showRecupBadge: true,
      showAffiliateNote: true,
      layout: 'two-columns' as const,
      titleText: 'Matériel nécessaire',
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 320, width: colW, height: 'auto', zIndex: 4 }, {
      backgroundColor: '#FFF8F0',
      borderRadius: 16,
      padding: 20,
      border: true,
      borderColor: '#F0D4C0',
      shadow: 'sm',
    }),

    createBlock('image-grid', {
      images: [],
      layout: 'grid-2x2' as const,
      gap: 8,
      borderRadius: 'rounded' as const,
      showCaptions: true,
      captionFontSize: 11,
    }, { x: left, y: 600, width: w, height: 400, zIndex: 5 }, {
      borderRadius: 16,
    }),

    createBlock('list', {
      title: 'Étapes de réalisation',
      items: ['Préparez votre espace de travail', 'Rassemblez le matériel', 'Suivez les étapes pas à pas', 'Laissez sécher si nécessaire', 'Admirez le résultat !'],
      bulletStyle: 'number' as const,
      columns: 1,
      fontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: left, y: 1020, width: colW, height: 'auto', zIndex: 6 }, {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      border: true,
      borderColor: '#F0D4C0',
      shadow: 'sm',
    }),

    createBlock('faq', {
      items: [
        { question: 'À partir de quel âge ?', answer: 'Adapté dès 3 ans avec accompagnement adulte.' },
        { question: 'Combien de temps prévoir ?', answer: '30 à 45 minutes selon le rythme de l\'enfant.' },
        { question: 'Peut-on adapter l\'activité ?', answer: 'Oui, chaque étape est modulable selon l\'âge.' },
      ],
      style: 'card' as const,
      expandMode: 'single' as const,
      iconStyle: 'chevron' as const,
      questionFontSize: 14,
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 1020, width: colW, height: 'auto', zIndex: 7 }, {
      borderRadius: 16,
      padding: 16,
    }),

    createBlock('separator', {
      style: 'fade' as const,
      direction: 'horizontal' as const,
      thickness: 1,
      length: 50,
      color: '#A8B5A0',
      align: 'center' as const,
      opacity: 40,
    }, { x: 200, y: 1290, width: w - 160, height: 20, zIndex: 8 }),

    createBlock('creator', {
      variant: 'compact' as const,
      showStats: true,
      showFollowButton: true,
    }, { x: left, y: 1330, width: colW, height: 'auto', zIndex: 9 }),

    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Obtenir le tutoriel complet',
      buttonColor: '#7A8B6F',
      borderRadius: 'rounded' as const,
    }, { x: col2, y: 1330, width: colW, height: 'auto', zIndex: 10 }, {
      glass: true,
      glassIntensity: 'medium',
      borderRadius: 20,
      padding: 24,
      shadow: 'apple',
    }),
  ]

  return {
    version: 2,
    canvas: { width: 800, height: 'auto', gridSize: 8, snapToGrid: true, paddingHorizontal: 0 },
    layout: { desktop: blocks },
    metadata: { templateName: 'full-workshop', lastEditedAt: new Date().toISOString() },
  }
}

// ===========================================
// Registre des templates
// ===========================================

export interface TemplateInfo {
  id: string
  layout: 'narrow' | 'medium' | 'full'
  name: { fr: string; en: string; es: string }
  description: { fr: string; en: string; es: string }
  icon: string
  category: 'general' | 'cooking' | 'creative' | 'education'
  create: () => ContentBlocksData
}

export const AVAILABLE_TEMPLATES: TemplateInfo[] = [
  // ── ÉTROIT ──────────────────────────────
  {
    id: 'narrow-essential',
    layout: 'narrow',
    name: { fr: 'Fiche essentielle', en: 'Essential Sheet', es: 'Ficha esencial' },
    description: {
      fr: 'Colonne unique épurée. Titre, image, matériel et achat.',
      en: 'Clean single column. Title, image, materials and purchase.',
      es: 'Columna única limpia. Título, imagen, materiales y compra.',
    },
    icon: '📋',
    category: 'general',
    create: createNarrowEssentialTemplate,
  },
  {
    id: 'narrow-story',
    layout: 'narrow',
    name: { fr: 'Journal & Découverte', en: 'Journal & Discovery', es: 'Diario & Descubrimiento' },
    description: {
      fr: 'Style récit. Intro, liste d\'objectifs, image et astuce.',
      en: 'Story style. Intro, objectives list, image and tip.',
      es: 'Estilo relato. Intro, lista de objetivos, imagen y consejo.',
    },
    icon: '📖',
    category: 'general',
    create: createNarrowStoryTemplate,
  },

  // ── MOYEN ───────────────────────────────
  {
    id: 'medium-activity',
    layout: 'medium',
    name: { fr: 'Activité & Matériel', en: 'Activity & Materials', es: 'Actividad & Materiales' },
    description: {
      fr: 'Deux colonnes confortables. Image bannière, texte et matériel.',
      en: 'Comfortable two columns. Banner image, text and materials.',
      es: 'Dos columnas amplias. Imagen banner, texto y materiales.',
    },
    icon: '🎯',
    category: 'general',
    create: createMediumActivityTemplate,
  },
  {
    id: 'medium-video',
    layout: 'medium',
    name: { fr: 'Tutoriel Vidéo', en: 'Video Tutorial', es: 'Tutorial en Vídeo' },
    description: {
      fr: 'Vidéo + objectifs côte à côte, FAQ et bloc téléchargement.',
      en: 'Video + goals side by side, FAQ and download block.',
      es: 'Vídeo + objetivos uno al lado del otro, FAQ y descarga.',
    },
    icon: '🎬',
    category: 'education',
    create: createMediumVideoTemplate,
  },

  // ── PLEINE PAGE ──────────────────────────
  {
    id: 'full-gallery',
    layout: 'full',
    name: { fr: 'Galerie de Projet', en: 'Project Gallery', es: 'Galería de Proyecto' },
    description: {
      fr: 'Pleine largeur. Carousel, grille photos et liens ressources.',
      en: 'Full width. Carousel, image grid and resource links.',
      es: 'Ancho completo. Carrusel, cuadrícula y enlaces de recursos.',
    },
    icon: '🖼️',
    category: 'creative',
    create: createFullGalleryTemplate,
  },
  {
    id: 'full-workshop',
    layout: 'full',
    name: { fr: 'Atelier & DIY', en: 'Workshop & DIY', es: 'Taller & DIY' },
    description: {
      fr: 'Complet. Matériel, grille photos, étapes et FAQ.',
      en: 'Full featured. Materials, image grid, steps and FAQ.',
      es: 'Completo. Materiales, cuadrícula, pasos y FAQ.',
    },
    icon: '🔨',
    category: 'creative',
    create: createFullWorkshopTemplate,
  },
]

export const TEMPLATE_LAYOUT_LABELS = {
  narrow: { fr: 'Étroit', en: 'Narrow', es: 'Estrecho' },
  medium: { fr: 'Moyen', en: 'Medium', es: 'Medio' },
  full: { fr: 'Pleine page', en: 'Full page', es: 'Página completa' },
} as const

export function getTemplateById(id: string): TemplateInfo | undefined {
  return AVAILABLE_TEMPLATES.find(t => t.id === id)
}

export function createFromTemplate(templateId: string): ContentBlocksData | null {
  const template = getTemplateById(templateId)
  if (!template) return null
  return template.create()
}

export function getTemplatesByLayout(layout: TemplateInfo['layout']): TemplateInfo[] {
  return AVAILABLE_TEMPLATES.filter(t => t.layout === layout)
}

export function getTemplatesByCategory(category: TemplateInfo['category']): TemplateInfo[] {
  return AVAILABLE_TEMPLATES.filter(t => t.category === category)
}
