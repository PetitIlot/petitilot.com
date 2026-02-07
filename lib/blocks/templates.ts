/**
 * Canvas Templates
 * Templates prédéfinis pour différents types de ressources
 */

import type { ContentBlocksData, ContentBlock, BlockPosition, BlockStyle } from './types'
import { createBlock, BLOCK_PRESETS } from './types'

// Helper pour créer un ID unique
const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Template: Activité classique
// Titre + Description + Image + Astuce + Achat
export function createActivityTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    // Titre en haut
    createBlock('title', {
      showBadges: true,
      showThemes: true,
      showCompetences: false,
      titleSize: 'xl' as const,
      alignment: 'left' as const
    }, { x: 32, y: 32, width: 540, height: 'auto', zIndex: 1 }),

    // Image principale à droite
    createBlock('image', {
      url: '',
      alt: '',
      objectFit: 'cover' as const
    }, { x: 450, y: 32, width: 300, height: 225, zIndex: 2 }),

    // Description sous le titre
    createBlock('text', {
      content: '<p>Description de votre activité...</p>'
    }, { x: 32, y: 180, width: 400, height: 'auto', zIndex: 3 }),

    // Astuce
    createBlock('tip', {
      content: '<p>Partagez un conseil utile ici...</p>',
      icon: 'lightbulb' as const,
      accentColor: 'sage' as const
    }, { x: 32, y: 320, width: 400, height: 'auto', zIndex: 4 }),

    // Bloc achat
    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Obtenir',
      buttonColor: '#A8B5A0'
    }, { x: 500, y: 280, width: 250, height: 'auto', zIndex: 5 }),

    // Créateur en bas
    createBlock('creator', {
      variant: 'compact' as const,
      showStats: true,
      showFollowButton: true
    }, { x: 32, y: 450, width: 300, height: 'auto', zIndex: 6 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'activity',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Template: Recette de cuisine
// Titre + Image + Liste d'ingrédients + Instructions + Astuce chef
export function createRecipeTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    // Titre
    createBlock('title', {
      showBadges: true,
      showThemes: false,
      showCompetences: false,
      titleSize: 'xl' as const,
      alignment: 'center' as const
    }, { x: 100, y: 32, width: 600, height: 'auto', zIndex: 1 }),

    // Image du plat
    createBlock('image', {
      url: '',
      alt: '',
      objectFit: 'cover' as const
    }, { x: 150, y: 120, width: 500, height: 280, zIndex: 2 }),

    // Liste des ingrédients
    createBlock('list', {
      title: 'Ingrédients',
      items: ['Ingrédient 1', 'Ingrédient 2', 'Ingrédient 3'],
      bulletStyle: 'check' as const,
      columns: 1
    }, { x: 32, y: 420, width: 340, height: 'auto', zIndex: 3 }),

    // Instructions
    createBlock('list', {
      title: 'Préparation',
      items: ['Étape 1', 'Étape 2', 'Étape 3'],
      bulletStyle: 'number' as const,
      columns: 1
    }, { x: 400, y: 420, width: 360, height: 'auto', zIndex: 4 }),

    // Astuce du chef
    createBlock('tip', {
      content: '<p>Astuce du chef : ...</p>',
      icon: 'chef' as const,
      accentColor: 'terracotta' as const
    }, { x: 32, y: 600, width: 350, height: 'auto', zIndex: 5 }),

    // Achat
    createBlock('purchase', {
      variant: 'compact' as const,
      showPrice: true,
      buttonText: 'Télécharger la recette',
      buttonColor: '#D4A59A'
    }, { x: 430, y: 600, width: 330, height: 'auto', zIndex: 6 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'recipe',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Template: Galerie / Portfolio
// Titre + Galerie d'images + Description + Liens
export function createGalleryTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    // Titre centré
    createBlock('title', {
      showBadges: false,
      showThemes: true,
      showCompetences: false,
      titleSize: 'lg' as const,
      alignment: 'center' as const
    }, { x: 100, y: 32, width: 600, height: 'auto', zIndex: 1 }),

    // Galerie carousel
    createBlock('carousel', {
      images: [],
      autoPlay: false,
      showDots: true,
      showArrows: true,
      interval: 3000
    }, { x: 50, y: 120, width: 700, height: 400, zIndex: 2 }),

    // Description
    createBlock('text', {
      content: '<p>Description de la galerie...</p>'
    }, { x: 50, y: 540, width: 450, height: 'auto', zIndex: 3 }),

    // Liens / Ressources
    createBlock('list-links', {
      title: 'Ressources',
      items: [],
      showAffiliateNote: false
    }, { x: 520, y: 540, width: 230, height: 'auto', zIndex: 4 }),

    // Créateur
    createBlock('creator', {
      variant: 'full' as const,
      showStats: true,
      showFollowButton: true
    }, { x: 300, y: 680, width: 200, height: 'auto', zIndex: 5 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'gallery',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Template: Tutoriel vidéo
// Titre + Vidéo + Description + Liste étapes + Téléchargement
export function createVideoTutorialTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    // Titre
    createBlock('title', {
      showBadges: true,
      showThemes: false,
      showCompetences: true,
      titleSize: 'xl' as const,
      alignment: 'left' as const
    }, { x: 32, y: 32, width: 500, height: 'auto', zIndex: 1 }),

    // Vidéo principale
    createBlock('video', {
      url: '',
      platform: 'auto' as const,
      aspectRatio: '16:9' as const
    }, { x: 32, y: 130, width: 520, height: 290, zIndex: 2 }),

    // Description à droite
    createBlock('text', {
      content: '<p>Dans ce tutoriel, vous apprendrez...</p>'
    }, { x: 570, y: 130, width: 200, height: 'auto', zIndex: 3 }),

    // Liste des étapes
    createBlock('list', {
      title: 'Ce que vous apprendrez',
      items: ['Compétence 1', 'Compétence 2', 'Compétence 3'],
      bulletStyle: 'check' as const,
      columns: 1
    }, { x: 570, y: 280, width: 200, height: 'auto', zIndex: 4 }),

    // Astuce
    createBlock('tip', {
      content: '<p>Conseil : Prenez des notes pendant le visionnage !</p>',
      icon: 'info' as const,
      accentColor: 'sky' as const
    }, { x: 32, y: 440, width: 350, height: 'auto', zIndex: 5 }),

    // Achat / Téléchargement
    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Télécharger les ressources',
      buttonColor: '#7BA3C4'
    }, { x: 400, y: 440, width: 370, height: 'auto', zIndex: 6 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'video-tutorial',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Template: Document / Guide
// Titre + Introduction + Sections multiples + Téléchargement PDF
export function createDocumentTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    // Titre
    createBlock('title', {
      showBadges: true,
      showThemes: true,
      showCompetences: false,
      titleSize: 'xl' as const,
      alignment: 'center' as const
    }, { x: 100, y: 32, width: 600, height: 'auto', zIndex: 1 }),

    // Séparateur
    createBlock('separator', {
      style: 'line' as const,
      thickness: 1,
      color: '#E5E7EB',
      direction: 'horizontal' as const
    }, { x: 150, y: 120, width: 500, height: 20, zIndex: 2 }),

    // Introduction
    createBlock('text', {
      content: '<p><strong>Introduction</strong></p><p>Présentation du guide...</p>'
    }, { x: 100, y: 150, width: 600, height: 'auto', zIndex: 3 }),

    // Section 1
    createBlock('text', {
      content: '<p><strong>Section 1</strong></p><p>Contenu de la première section...</p>'
    }, { x: 100, y: 280, width: 600, height: 'auto', zIndex: 4 }),

    // Astuce
    createBlock('tip', {
      content: '<p>Point important à retenir...</p>',
      icon: 'star' as const,
      accentColor: 'mauve' as const
    }, { x: 100, y: 400, width: 350, height: 'auto', zIndex: 5 }),

    // Téléchargement PDF
    createBlock('purchase', {
      variant: 'full' as const,
      showPrice: true,
      buttonText: 'Télécharger le PDF complet',
      buttonColor: '#9B8AA8'
    }, { x: 480, y: 400, width: 220, height: 'auto', zIndex: 6 }),

    // Créateur
    createBlock('creator', {
      variant: 'compact' as const,
      showStats: true,
      showFollowButton: false
    }, { x: 100, y: 520, width: 300, height: 'auto', zIndex: 7 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'document',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Template: Minimaliste
// Juste titre + texte + achat
export function createMinimalTemplate(): ContentBlocksData {
  const blocks: ContentBlock[] = [
    createBlock('title', {
      showBadges: true,
      showThemes: false,
      showCompetences: false,
      titleSize: 'lg' as const,
      alignment: 'center' as const
    }, { x: 150, y: 50, width: 500, height: 'auto', zIndex: 1 }),

    createBlock('text', {
      content: '<p>Votre contenu ici...</p>'
    }, { x: 150, y: 150, width: 500, height: 'auto', zIndex: 2 }),

    createBlock('purchase', {
      variant: 'minimal' as const,
      showPrice: true,
      buttonText: 'Obtenir',
      buttonColor: '#A8B5A0'
    }, { x: 250, y: 280, width: 300, height: 'auto', zIndex: 3 })
  ]

  return {
    version: 2,
    canvas: {
      width: 800,
      height: 'auto',
      gridSize: 8,
      snapToGrid: true
    },
    layout: {
      desktop: blocks
    },
    metadata: {
      templateName: 'minimal',
      lastEditedAt: new Date().toISOString()
    }
  }
}

// Liste des templates disponibles
export interface TemplateInfo {
  id: string
  name: {
    fr: string
    en: string
    es: string
  }
  description: {
    fr: string
    en: string
    es: string
  }
  icon: string // Emoji ou nom d'icône
  create: () => ContentBlocksData
}

export const AVAILABLE_TEMPLATES: TemplateInfo[] = [
  {
    id: 'activity',
    name: {
      fr: 'Activité classique',
      en: 'Classic Activity',
      es: 'Actividad clásica'
    },
    description: {
      fr: 'Titre, image, description et bloc achat',
      en: 'Title, image, description and purchase block',
      es: 'Título, imagen, descripción y bloque de compra'
    },
    icon: '🎨',
    create: createActivityTemplate
  },
  {
    id: 'recipe',
    name: {
      fr: 'Recette de cuisine',
      en: 'Recipe',
      es: 'Receta'
    },
    description: {
      fr: 'Image, ingrédients, étapes de préparation',
      en: 'Image, ingredients, preparation steps',
      es: 'Imagen, ingredientes, pasos de preparación'
    },
    icon: '🍳',
    create: createRecipeTemplate
  },
  {
    id: 'gallery',
    name: {
      fr: 'Galerie / Portfolio',
      en: 'Gallery / Portfolio',
      es: 'Galería / Portfolio'
    },
    description: {
      fr: 'Carousel d\'images avec description',
      en: 'Image carousel with description',
      es: 'Carrusel de imágenes con descripción'
    },
    icon: '🖼️',
    create: createGalleryTemplate
  },
  {
    id: 'video-tutorial',
    name: {
      fr: 'Tutoriel vidéo',
      en: 'Video Tutorial',
      es: 'Tutorial en video'
    },
    description: {
      fr: 'Vidéo principale avec liste des apprentissages',
      en: 'Main video with learning objectives',
      es: 'Video principal con lista de aprendizajes'
    },
    icon: '🎬',
    create: createVideoTutorialTemplate
  },
  {
    id: 'document',
    name: {
      fr: 'Document / Guide',
      en: 'Document / Guide',
      es: 'Documento / Guía'
    },
    description: {
      fr: 'Structure de document avec sections',
      en: 'Document structure with sections',
      es: 'Estructura de documento con secciones'
    },
    icon: '📄',
    create: createDocumentTemplate
  },
  {
    id: 'minimal',
    name: {
      fr: 'Minimaliste',
      en: 'Minimal',
      es: 'Minimalista'
    },
    description: {
      fr: 'Juste l\'essentiel : titre, texte, achat',
      en: 'Just the essentials: title, text, purchase',
      es: 'Solo lo esencial: título, texto, compra'
    },
    icon: '✨',
    create: createMinimalTemplate
  }
]

// Helper pour obtenir un template par ID
export function getTemplateById(id: string): TemplateInfo | undefined {
  return AVAILABLE_TEMPLATES.find(t => t.id === id)
}

// Helper pour créer un layout depuis un template
export function createFromTemplate(templateId: string): ContentBlocksData | null {
  const template = getTemplateById(templateId)
  if (!template) return null
  return template.create()
}
