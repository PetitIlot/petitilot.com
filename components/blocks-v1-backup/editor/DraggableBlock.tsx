'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Copy, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { ContentBlock } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'
import BlockRenderer from '../BlockRenderer'

interface DraggableBlockProps {
  block: ContentBlock
  activity: RessourceWithCreator
  lang: Language
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onToggleVisibility: () => void
  onToggleLock: () => void
}

export default function DraggableBlock({
  block,
  activity,
  lang,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock
}: DraggableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id, disabled: block.locked })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : block.position.zIndex
  }

  const blockTypeLabels: Record<string, string> = {
    title: '📝 Titre',
    image: '🖼️ Image',
    carousel: '🎠 Carrousel',
    creator: '👤 Créateur',
    text: '📄 Texte',
    list: '📋 Liste',
    'list-links': '🔗 Liens',
    purchase: '💳 Achat',
    video: '🎬 Vidéo',
    tip: '💡 Astuce',
    separator: '➖ Séparateur'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group mb-4
        ${isSelected ? 'ring-2 ring-sage ring-offset-2' : ''}
        ${block.visible === false ? 'opacity-40' : ''}
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Toolbar */}
      <div
        className={`
          absolute -top-10 left-0 right-0 flex items-center justify-between
          bg-surface dark:bg-surface-dark rounded-t-lg px-2 py-1
          border border-b-0 border-border
          transition-opacity
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        {/* Left: Drag handle + Type */}
        <div className="flex items-center gap-2">
          {!block.locked && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-sage/20 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-foreground-secondary" />
            </button>
          )}
          <span className="text-xs font-medium text-foreground dark:text-foreground-dark">
            {blockTypeLabels[block.type] || block.type}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility()
            }}
            className="p-1 hover:bg-sage/20 rounded"
            title={block.visible === false ? 'Afficher' : 'Masquer'}
          >
            {block.visible === false ? (
              <EyeOff className="w-3.5 h-3.5 text-foreground-secondary" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-foreground-secondary" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLock()
            }}
            className="p-1 hover:bg-sage/20 rounded"
            title={block.locked ? 'Déverrouiller' : 'Verrouiller'}
          >
            {block.locked ? (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-foreground-secondary" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="p-1 hover:bg-sage/20 rounded"
            title="Dupliquer"
          >
            <Copy className="w-3.5 h-3.5 text-foreground-secondary" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div
        className={`
          rounded-xl overflow-hidden
          ${isSelected ? '' : 'hover:ring-1 hover:ring-sage/30'}
        `}
        style={{
          minHeight: block.position.height === 'auto' ? 50 : block.position.height
        }}
      >
        <BlockRenderer
          block={block}
          activity={activity}
          lang={lang}
          isEditing={true}
          isSelected={isSelected}
        />
      </div>
    </div>
  )
}
