import type { BlockStyle } from './types'

export interface BlockTheme {
  id: string
  name: Record<string, string>
  style: Partial<BlockStyle>
}

export const BLOCK_THEMES: BlockTheme[] = [
  {
    id: 'nature',
    name: { fr: 'Nature', en: 'Nature', es: 'Naturaleza' },
    style: {
      backgroundColor: '#F0F4ED',
      borderColor: '#C5D4BC',
      border: true,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 20,
      shadow: 'sm',
      padding: 20,
      opacity: 100
    }
  },
  {
    id: 'minimal',
    name: { fr: 'Minimal', en: 'Minimal', es: 'Minimal' },
    style: {
      backgroundPreset: 'surface',
      borderColor: '#E5E7EB',
      border: true,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 8,
      shadow: 'none',
      padding: 16,
      opacity: 100
    }
  },
  {
    id: 'playful',
    name: { fr: 'Ludique', en: 'Playful', es: 'Lúdico' },
    style: {
      backgroundColor: '#FFF8F0',
      borderColor: '#F0D4C0',
      border: true,
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 24,
      shadow: 'md',
      padding: 20,
      opacity: 100
    }
  },
  {
    id: 'elegant',
    name: { fr: 'Élégant', en: 'Elegant', es: 'Elegante' },
    style: {
      backgroundColor: '#FAF9F7',
      borderColor: '#D4CFC7',
      border: true,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 12,
      shadow: 'apple',
      padding: 24,
      opacity: 100
    }
  },
  {
    id: 'glass',
    name: { fr: 'Verre', en: 'Glass', es: 'Cristal' },
    style: {
      glass: true,
      glassIntensity: 'medium',
      glassColor: '#9DC3A9',
      glassSpecular: true,
      glassGlow: true,
      borderRadius: 16,
      shadow: 'md',
      padding: 20,
      border: false,
      opacity: 100
    }
  }
]
