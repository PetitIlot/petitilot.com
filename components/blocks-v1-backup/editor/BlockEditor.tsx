'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { Save, Undo, Redo, Eye, Edit3, Layout, Smartphone, Monitor } from 'lucide-react'
import { ContentBlock, ContentBlocksData, BlockType, BLOCK_PRESETS, createBlock } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Language } from '@/lib/types'
import { Button } from '@/components/ui/button'

import DraggableBlock from './DraggableBlock'
import BlockToolbar from './BlockToolbar'
import BlockPropertiesPanel from './BlockPropertiesPanel'

interface BlockEditorProps {
  initialData: ContentBlocksData
  activity: RessourceWithCreator
  lang: Language
  onSave: (data: ContentBlocksData) => Promise<void>
  isSaving?: boolean
}

export default function BlockEditor({
  initialData,
  activity,
  lang,
  onSave,
  isSaving = false
}: BlockEditorProps) {
  const [blocksData, setBlocksData] = useState<ContentBlocksData>(initialData)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [history, setHistory] = useState<ContentBlocksData[]>([initialData])
  const [historyIndex, setHistoryIndex] = useState(0)

  const blocks = blocksData.layout.desktop

  // Sensors pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Commence le drag après 8px de mouvement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Sauvegarder dans l'historique
  const saveToHistory = useCallback((newData: ContentBlocksData) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Mettre à jour les blocs
  const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
    const newData = {
      ...blocksData,
      layout: {
        ...blocksData.layout,
        desktop: newBlocks
      }
    }
    setBlocksData(newData)
    saveToHistory(newData)
  }, [blocksData, saveToHistory])

  // Gestion du drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        position: {
          ...block.position,
          y: index * 16 // Recalculer les positions Y
        }
      }))

      updateBlocks(newBlocks)
    }
  }

  // Ajouter un bloc
  const handleAddBlock = (type: BlockType) => {
    const preset = BLOCK_PRESETS[type]
    const lastBlock = blocks[blocks.length - 1]
    const newY = lastBlock
      ? lastBlock.position.y + (lastBlock.position.height === 'auto' ? 200 : lastBlock.position.height) + 24
      : 0

    const newBlock = createBlock(
      type,
      preset.data!,
      { ...preset.position, y: newY },
      preset.style
    )

    updateBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  // Supprimer un bloc
  const handleDeleteBlock = (blockId: string) => {
    updateBlocks(blocks.filter(b => b.id !== blockId))
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
  }

  // Dupliquer un bloc
  const handleDuplicateBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return

    const blockIndex = blocks.findIndex(b => b.id === blockId)
    const newBlock: ContentBlock = {
      ...block,
      id: crypto.randomUUID(),
      position: {
        ...block.position,
        y: block.position.y + (block.position.height === 'auto' ? 200 : block.position.height) + 24
      }
    }

    const newBlocks = [...blocks]
    newBlocks.splice(blockIndex + 1, 0, newBlock)
    updateBlocks(newBlocks)
    setSelectedBlockId(newBlock.id)
  }

  // Toggle visibilité
  const handleToggleVisibility = (blockId: string) => {
    updateBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, visible: b.visible === false ? true : false } : b
    ))
  }

  // Toggle verrouillage
  const handleToggleLock = (blockId: string) => {
    updateBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, locked: !b.locked } : b
    ))
  }

  // Mettre à jour un bloc
  const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    updateBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, ...updates } : b
    ))
  }

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setBlocksData(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setBlocksData(history[historyIndex + 1])
    }
  }

  // Sauvegarder
  const handleSave = async () => {
    await onSave(blocksData)
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  return (
    <div className="h-screen flex flex-col bg-background dark:bg-background-dark">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-surface dark:bg-surface-dark border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Title & Info */}
          <div>
            <h2 className="font-semibold text-foreground dark:text-foreground-dark">
              Éditeur de fiche
            </h2>
            <p className="text-xs text-foreground-secondary">
              {activity.title} • {blocks.length} blocs
            </p>
          </div>

          {/* Center: Viewport Toggle */}
          <div className="flex items-center gap-1 bg-surface-secondary dark:bg-surface-dark rounded-lg p-1">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
            ].map((viewport) => {
              const Icon = viewport.icon
              return (
                <button
                  key={viewport.id}
                  onClick={() => setViewportSize(viewport.id as typeof viewportSize)}
                  className={`
                    p-2 rounded-md transition-colors
                    ${viewportSize === viewport.id
                      ? 'bg-sage text-white'
                      : 'text-foreground-secondary hover:text-foreground'
                    }
                  `}
                  title={viewport.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-border" />

            <Button
              variant={isPreview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreview ? 'Éditer' : 'Aperçu'}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Block Toolbar */}
        {!isPreview && (
          <div className="w-64 flex-shrink-0 border-r border-border p-4 overflow-y-auto">
            <BlockToolbar onAddBlock={handleAddBlock} />
          </div>
        )}

        {/* Center: Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className={`
              mx-auto bg-surface dark:bg-surface-dark rounded-2xl shadow-lg overflow-hidden
              transition-all duration-300
              ${viewportSize === 'mobile' ? 'max-w-[375px]' : viewportSize === 'tablet' ? 'max-w-[768px]' : 'max-w-4xl'}
            `}
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="p-6">
              {isPreview ? (
                // Mode aperçu - sans drag & drop
                <div className="space-y-4">
                  {blocks
                    .filter(b => b.visible !== false)
                    .map((block) => (
                      <div key={block.id}>
                        <DraggableBlock
                          block={block}
                          activity={activity}
                          lang={lang}
                          isSelected={false}
                          onSelect={() => {}}
                          onDelete={() => {}}
                          onDuplicate={() => {}}
                          onToggleVisibility={() => {}}
                          onToggleLock={() => {}}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                // Mode édition avec drag & drop
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 pt-10">
                      {blocks.map((block) => (
                        <DraggableBlock
                          key={block.id}
                          block={block}
                          activity={activity}
                          lang={lang}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onDuplicate={() => handleDuplicateBlock(block.id)}
                          onToggleVisibility={() => handleToggleVisibility(block.id)}
                          onToggleLock={() => handleToggleLock(block.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {blocks.length === 0 && (
                <div className="text-center py-16 text-foreground-secondary">
                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">Aucun bloc</p>
                  <p className="text-sm">Ajoutez des blocs depuis le panneau de gauche</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Properties Panel */}
        {!isPreview && selectedBlock && (
          <div className="w-72 flex-shrink-0 border-l border-border p-4 overflow-y-auto">
            <BlockPropertiesPanel
              block={selectedBlock}
              onUpdate={(updates) => handleUpdateBlock(selectedBlock.id, updates)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
