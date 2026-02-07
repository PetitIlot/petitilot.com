'use client'

import {
  Type, Image, Images, User, FileText, List, Link,
  CreditCard, Video, Lightbulb, Minus, Plus
} from 'lucide-react'
import { BlockType, BLOCK_PRESETS, createBlock } from '@/lib/blocks/types'
import { Button } from '@/components/ui/button'

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void
}

const blockCategories = [
  {
    name: 'Contenu',
    blocks: [
      { type: 'title' as BlockType, icon: Type, label: 'Titre', description: 'Titre avec badges et tags' },
      { type: 'text' as BlockType, icon: FileText, label: 'Texte', description: 'Zone de texte libre' },
      { type: 'tip' as BlockType, icon: Lightbulb, label: 'Astuce', description: 'Bloc conseil/astuce' },
    ]
  },
  {
    name: 'Médias',
    blocks: [
      { type: 'image' as BlockType, icon: Image, label: 'Image', description: 'Image unique' },
      { type: 'carousel' as BlockType, icon: Images, label: 'Carrousel', description: 'Galerie d\'images' },
      { type: 'video' as BlockType, icon: Video, label: 'Vidéo', description: 'Vidéo Instagram/YouTube' },
    ]
  },
  {
    name: 'Listes',
    blocks: [
      { type: 'list' as BlockType, icon: List, label: 'Liste', description: 'Liste de matériel' },
      { type: 'list-links' as BlockType, icon: Link, label: 'Liens', description: 'Liste avec liens' },
    ]
  },
  {
    name: 'Widgets',
    blocks: [
      { type: 'creator' as BlockType, icon: User, label: 'Créateur', description: 'Widget créateur' },
      { type: 'purchase' as BlockType, icon: CreditCard, label: 'Achat', description: 'Bouton achat/téléchargement' },
      { type: 'separator' as BlockType, icon: Minus, label: 'Séparateur', description: 'Séparateur visuel' },
    ]
  }
]

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  return (
    <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border p-4">
      <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Ajouter un bloc
      </h3>

      <div className="space-y-4">
        {blockCategories.map((category) => (
          <div key={category.name}>
            <p className="text-xs font-medium text-foreground-secondary mb-2 uppercase tracking-wider">
              {category.name}
            </p>
            <div className="grid grid-cols-1 gap-1">
              {category.blocks.map((block) => {
                const Icon = block.icon
                return (
                  <button
                    key={block.type}
                    onClick={() => onAddBlock(block.type)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-sage/10 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center group-hover:bg-sage/20">
                      <Icon className="w-4 h-4 text-sage" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground dark:text-foreground-dark">
                        {block.label}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {block.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
