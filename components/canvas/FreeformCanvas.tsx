'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import {
  Plus, Undo2, Redo2, Trash2, Lock, Unlock, Eye, EyeOff,
  Type, Image, Video, List, ShoppingCart, Lightbulb, Minus,
  GripVertical, User, Images, X, Edit3, Copy, ArrowUp, ArrowDown,
  Layers, Film
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type {
  ContentBlock, BlockType, ContentBlocksData, CanvasConfig,
  BlockPosition, BlockStyle
} from '@/lib/blocks/types'
import { BLOCK_PRESETS, DEFAULT_CANVAS_CONFIG, createBlock } from '@/lib/blocks/types'
import { useCanvasHistory } from './useCanvasHistory'
import { BlockPreview } from './BlockPreview'
import { BlockEditor } from './BlockEditor'

const translations = {
  fr: {
    addBlock: 'Ajouter un bloc',
    undo: 'Annuler',
    redo: 'Rétablir',
    delete: 'Supprimer',
    lock: 'Verrouiller',
    unlock: 'Déverrouiller',
    hide: 'Masquer',
    show: 'Afficher',
    duplicate: 'Dupliquer',
    bringForward: 'Avancer',
    sendBackward: 'Reculer',
    edit: 'Éditer',
    blocks: {
      title: 'Titre',
      text: 'Texte',
      image: 'Image',
      carousel: 'Galerie',
      'carousel-video': 'Galerie vidéo',
      video: 'Vidéo',
      list: 'Liste',
      'list-links': 'Liens',
      purchase: 'Achat',
      tip: 'Astuce',
      separator: 'Séparateur',
      creator: 'Créateur'
    },
    emptyCanvas: 'Cliquez sur + pour ajouter votre premier bloc',
    gridSnap: 'Grille magnétique',
    blocksCount: 'blocs'
  },
  en: {
    addBlock: 'Add block',
    undo: 'Undo',
    redo: 'Redo',
    delete: 'Delete',
    lock: 'Lock',
    unlock: 'Unlock',
    hide: 'Hide',
    show: 'Show',
    duplicate: 'Duplicate',
    bringForward: 'Bring forward',
    sendBackward: 'Send backward',
    edit: 'Edit',
    blocks: {
      title: 'Title',
      text: 'Text',
      image: 'Image',
      carousel: 'Gallery',
      'carousel-video': 'Video Gallery',
      video: 'Video',
      list: 'List',
      'list-links': 'Links',
      purchase: 'Purchase',
      tip: 'Tip',
      separator: 'Separator',
      creator: 'Creator'
    },
    emptyCanvas: 'Click + to add your first block',
    gridSnap: 'Snap to grid',
    blocksCount: 'blocks'
  },
  es: {
    addBlock: 'Agregar bloque',
    undo: 'Deshacer',
    redo: 'Rehacer',
    delete: 'Eliminar',
    lock: 'Bloquear',
    unlock: 'Desbloquear',
    hide: 'Ocultar',
    show: 'Mostrar',
    duplicate: 'Duplicar',
    bringForward: 'Traer adelante',
    sendBackward: 'Enviar atrás',
    edit: 'Editar',
    blocks: {
      title: 'Título',
      text: 'Texto',
      image: 'Imagen',
      carousel: 'Galería',
      'carousel-video': 'Galería de video',
      video: 'Video',
      list: 'Lista',
      'list-links': 'Enlaces',
      purchase: 'Compra',
      tip: 'Consejo',
      separator: 'Separador',
      creator: 'Creador'
    },
    emptyCanvas: 'Haz clic en + para agregar tu primer bloque',
    gridSnap: 'Ajustar a cuadrícula',
    blocksCount: 'bloques'
  }
}

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
  title: <Type className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  carousel: <Images className="w-4 h-4" />,
  'carousel-video': <Film className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  list: <List className="w-4 h-4" />,
  'list-links': <List className="w-4 h-4" />,
  purchase: <ShoppingCart className="w-4 h-4" />,
  tip: <Lightbulb className="w-4 h-4" />,
  separator: <Minus className="w-4 h-4" />,
  creator: <User className="w-4 h-4" />
}

interface FreeformCanvasProps {
  initialData?: ContentBlocksData | null
  onChange?: (data: ContentBlocksData) => void
  lang: Language
  readOnly?: boolean
}

export function FreeformCanvas({
  initialData,
  onChange,
  lang,
  readOnly = false
}: FreeformCanvasProps) {
  const t = translations[lang]
  const canvasRef = useRef<HTMLDivElement>(null)

  // Canvas config
  const [config, setConfig] = useState<CanvasConfig>(
    initialData?.canvas || DEFAULT_CANVAS_CONFIG
  )

  // History & blocks
  const {
    blocks,
    canUndo,
    canRedo,
    setBlocks,
    addBlock,
    removeBlock,
    moveBlock,
    resizeBlock,
    updateBlock,
    undo,
    redo,
    resetHistory
  } = useCanvasHistory(initialData?.layout?.desktop || [])

  // UI State
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(config.snapToGrid)

  // Track if we've initialized to prevent infinite loops
  const initializedRef = useRef(false)

  // Mark as initialized after first render
  useEffect(() => {
    // Small delay to prevent initial render from triggering onChange
    const timer = setTimeout(() => {
      initializedRef.current = true
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Track last output to prevent unnecessary onChange calls
  const lastOutputRef = useRef<string | null>(null)

  // Notify parent of changes (only when blocks actually change, not on initial render)
  useEffect(() => {
    if (!onChange || !initializedRef.current) return

    const blocksStr = JSON.stringify(blocks)

    // Skip if blocks haven't changed
    if (blocksStr === lastOutputRef.current) return
    lastOutputRef.current = blocksStr

    const data: ContentBlocksData = {
      version: 2,
      canvas: config,
      layout: {
        desktop: blocks
      },
      metadata: {
        lastEditedAt: new Date().toISOString()
      }
    }
    onChange(data)
  }, [blocks, config, onChange])

  // Keyboard shortcuts
  useEffect(() => {
    if (readOnly) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      // Redo: Ctrl/Cmd + Shift + Z ou Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
      // Delete: Backspace ou Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedBlockId) {
        const target = e.target as HTMLElement
        // Ne pas supprimer si on est dans un input
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          removeBlock(selectedBlockId)
          setSelectedBlockId(null)
        }
      }
      // Escape: Deselect or close editor
      if (e.key === 'Escape') {
        if (editingBlockId) {
          setEditingBlockId(null)
        } else {
          setSelectedBlockId(null)
          setShowAddMenu(false)
        }
      }
      // Enter: Open editor for selected block
      if (e.key === 'Enter' && selectedBlockId && !editingBlockId) {
        const block = blocks.find(b => b.id === selectedBlockId)
        if (block && !block.locked) {
          e.preventDefault()
          setEditingBlockId(selectedBlockId)
        }
      }
      // Duplicate: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedBlockId) {
        e.preventDefault()
        const block = blocks.find(b => b.id === selectedBlockId)
        if (block) {
          const newBlock: ContentBlock = {
            ...JSON.parse(JSON.stringify(block)),
            id: `block-${Date.now()}`,
            position: {
              ...block.position,
              x: block.position.x + 20,
              y: block.position.y + 20,
              zIndex: blocks.length + 1
            }
          }
          addBlock(newBlock, 'Duplicate block')
          setSelectedBlockId(newBlock.id)
        }
      }
      // Bring forward: Ctrl/Cmd + ]
      if ((e.ctrlKey || e.metaKey) && e.key === ']' && selectedBlockId) {
        e.preventDefault()
        const block = blocks.find(b => b.id === selectedBlockId)
        if (block) {
          const maxZ = Math.max(...blocks.map(b => b.position.zIndex))
          if (block.position.zIndex < maxZ) {
            updateBlock(selectedBlockId, {
              position: { ...block.position, zIndex: block.position.zIndex + 1 }
            }, 'Bring forward')
          }
        }
      }
      // Send backward: Ctrl/Cmd + [
      if ((e.ctrlKey || e.metaKey) && e.key === '[' && selectedBlockId) {
        e.preventDefault()
        const block = blocks.find(b => b.id === selectedBlockId)
        if (block && block.position.zIndex > 1) {
          updateBlock(selectedBlockId, {
            position: { ...block.position, zIndex: block.position.zIndex - 1 }
          }, 'Send backward')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [readOnly, undo, redo, selectedBlockId, editingBlockId, removeBlock, blocks, addBlock, updateBlock])

  // Add block handler
  const handleAddBlock = useCallback((type: BlockType) => {
    const preset = BLOCK_PRESETS[type]
    const newBlock = createBlock(
      type,
      preset.data!,
      {
        ...preset.position,
        // Position au centre du canvas visible
        x: 50,
        y: blocks.length * 30 + 50, // Décalage vertical pour chaque nouveau bloc
        zIndex: blocks.length + 1
      },
      preset.style
    )
    addBlock(newBlock, `Ajout bloc ${type}`)
    setSelectedBlockId(newBlock.id)
    setShowAddMenu(false)
  }, [blocks.length, addBlock])

  // Snap to grid helper
  const snapValue = useCallback((value: number): number => {
    if (!snapToGrid) return value
    return Math.round(value / config.gridSize) * config.gridSize
  }, [snapToGrid, config.gridSize])

  // Handle block drag
  const handleDragStop = useCallback((id: string, x: number, y: number) => {
    moveBlock(id, snapValue(x), snapValue(y))
  }, [moveBlock, snapValue])

  // Handle block resize
  const handleResizeStop = useCallback((
    id: string,
    width: number,
    height: number,
    x: number,
    y: number
  ) => {
    updateBlock(id, {
      position: {
        ...blocks.find(b => b.id === id)!.position,
        x: snapValue(x),
        y: snapValue(y),
        width: snapValue(width),
        height: height
      }
    }, 'Resize block')
  }, [blocks, updateBlock, snapValue])

  // Toggle block lock
  const toggleLock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      updateBlock(id, { locked: !block.locked }, block.locked ? 'Unlock block' : 'Lock block')
    }
  }, [blocks, updateBlock])

  // Toggle block visibility
  const toggleVisibility = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      updateBlock(id, { visible: block.visible === false ? true : false }, 'Toggle visibility')
    }
  }, [blocks, updateBlock])

  // Handle block data update from editor
  const handleBlockDataUpdate = useCallback((id: string, dataUpdates: Record<string, unknown>) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      updateBlock(id, { data: { ...block.data, ...dataUpdates } as ContentBlock['data'] }, `Edit ${block.type}`)
    }
  }, [blocks, updateBlock])

  // Open editor for a block
  const openEditor = useCallback((id: string) => {
    setEditingBlockId(id)
    setSelectedBlockId(id)
  }, [])

  // Duplicate a block
  const duplicateBlock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      const newBlock: ContentBlock = {
        ...JSON.parse(JSON.stringify(block)),
        id: `block-${Date.now()}`,
        position: {
          ...block.position,
          x: block.position.x + 20,
          y: block.position.y + 20,
          zIndex: blocks.length + 1
        }
      }
      addBlock(newBlock, 'Duplicate block')
      setSelectedBlockId(newBlock.id)
    }
  }, [blocks, addBlock])

  // Bring block forward (increase z-index)
  const bringForward = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      const maxZ = Math.max(...blocks.map(b => b.position.zIndex))
      if (block.position.zIndex < maxZ) {
        updateBlock(id, {
          position: { ...block.position, zIndex: block.position.zIndex + 1 }
        }, 'Bring forward')
      }
    }
  }, [blocks, updateBlock])

  // Send block backward (decrease z-index)
  const sendBackward = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block && block.position.zIndex > 1) {
      updateBlock(id, {
        position: { ...block.position, zIndex: block.position.zIndex - 1 }
      }, 'Send backward')
    }
  }, [blocks, updateBlock])

  // Selected block
  const selectedBlock = blocks.find(b => b.id === selectedBlockId)
  const editingBlock = blocks.find(b => b.id === editingBlockId)

  // Canvas height calculation
  const canvasHeight = Math.max(
    600,
    ...blocks.map(b => b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50)
  )

  return (
    <div className="flex h-full">
      {/* Main canvas area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${editingBlock ? 'mr-80' : ''}`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-2 p-3 bg-white border-b border-gray-200">
          {/* Left: Add block */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-[#A8B5A0] text-white rounded-lg hover:bg-[#95a28f] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{t.addBlock}</span>
            </button>

            {/* Add menu dropdown */}
            {showAddMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {(Object.keys(BLOCK_PRESETS) as BlockType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#5D5A4E] hover:bg-[#F5E6D3]/30 transition-colors"
                  >
                    {BLOCK_ICONS[type]}
                    <span>{t.blocks[type]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Undo/Redo + Block count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={`${t.undo} (Ctrl+Z)`}
              >
                <Undo2 className="w-4 h-4 text-[#5D5A4E]" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={`${t.redo} (Ctrl+Shift+Z)`}
              >
                <Redo2 className="w-4 h-4 text-[#5D5A4E]" />
              </button>
            </div>
            {/* Block count */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-[#5D5A4E]/60" />
              <span className="text-xs text-[#5D5A4E]/60 font-medium">
                {blocks.length} {t.blocksCount}
              </span>
            </div>
          </div>

          {/* Right: Block actions (when selected) */}
          <div className="flex items-center gap-1">
            {selectedBlock && (
              <>
                <button
                  onClick={() => openEditor(selectedBlock.id)}
                  disabled={selectedBlock.locked}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Éditer (Entrée)"
                >
                  <Edit3 className="w-4 h-4 text-[#5D5A4E]" />
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                  onClick={() => toggleLock(selectedBlock.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={selectedBlock.locked ? t.unlock : t.lock}
                >
                  {selectedBlock.locked ? (
                    <Lock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-[#5D5A4E]" />
                  )}
                </button>
                <button
                  onClick={() => toggleVisibility(selectedBlock.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={selectedBlock.visible === false ? t.show : t.hide}
                >
                  {selectedBlock.visible === false ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#5D5A4E]" />
                  )}
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                  onClick={() => duplicateBlock(selectedBlock.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`${t.duplicate} (Ctrl+D)`}
                >
                  <Copy className="w-4 h-4 text-[#5D5A4E]" />
                </button>
                <button
                  onClick={() => bringForward(selectedBlock.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`${t.bringForward} (Ctrl+])`}
                >
                  <ArrowUp className="w-4 h-4 text-[#5D5A4E]" />
                </button>
                <button
                  onClick={() => sendBackward(selectedBlock.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`${t.sendBackward} (Ctrl+[)`}
                >
                  <ArrowDown className="w-4 h-4 text-[#5D5A4E]" />
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                  onClick={() => {
                    removeBlock(selectedBlock.id)
                    setSelectedBlockId(null)
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </>
            )}

            {/* Grid snap toggle */}
            <label className="flex items-center gap-2 px-3 py-1 text-xs text-[#5D5A4E]/60 cursor-pointer">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="w-3 h-3 rounded"
              />
              {t.gridSnap}
            </label>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto bg-[#F5F5F5]"
        onClick={() => setSelectedBlockId(null)}
      >
        <div
          className="relative bg-white"
          style={{
            width: '100%',
            minHeight: canvasHeight,
            backgroundImage: snapToGrid
              ? `linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                 linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`
              : undefined,
            backgroundSize: snapToGrid ? `${config.gridSize}px ${config.gridSize}px` : undefined
          }}
        >
          {/* Empty state */}
          {blocks.length === 0 && !readOnly && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-sm">{t.emptyCanvas}</p>
            </div>
          )}

          {/* Blocks */}
          {blocks.map(block => (
            <Rnd
              key={block.id}
              size={{
                width: block.position.width,
                height: block.position.height === 'auto' ? 'auto' : block.position.height
              }}
              position={{ x: block.position.x, y: block.position.y }}
              onDragStop={(e, d) => handleDragStop(block.id, d.x, d.y)}
              onResizeStop={(e, direction, ref, delta, position) => {
                handleResizeStop(
                  block.id,
                  parseInt(ref.style.width),
                  ref.style.height === 'auto' ? 'auto' as any : parseInt(ref.style.height),
                  position.x,
                  position.y
                )
              }}
              disableDragging={readOnly || block.locked}
              enableResizing={!readOnly && !block.locked}
              bounds="parent"
              minWidth={100}
              minHeight={50}
              dragGrid={snapToGrid ? [config.gridSize, config.gridSize] : undefined}
              resizeGrid={snapToGrid ? [config.gridSize, config.gridSize] : undefined}
              style={{
                zIndex: block.position.zIndex,
                opacity: block.visible === false ? 0.4 : 1
              }}
              className={`group ${selectedBlockId === block.id ? 'ring-2 ring-[#A8B5A0] ring-offset-2' : ''} ${editingBlockId === block.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                setSelectedBlockId(block.id)
              }}
              onDoubleClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                if (!readOnly && !block.locked) {
                  openEditor(block.id)
                }
              }}
            >
              {/* Block content */}
              <div
                className={`w-full h-full rounded-lg overflow-hidden transition-shadow ${
                  selectedBlockId === block.id ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                }`}
                style={{
                  backgroundColor: block.style.backgroundColor || (
                    block.style.backgroundPreset === 'sage' ? '#A8B5A0' :
                    block.style.backgroundPreset === 'terracotta' ? '#D4A59A' :
                    block.style.backgroundPreset === 'sky' ? '#C8D8E4' :
                    block.style.backgroundPreset === 'mauve' ? '#B8A9C9' :
                    block.style.backgroundPreset === 'surface' ? '#FFFFFF' :
                    'transparent'
                  ),
                  borderRadius: block.style.borderRadius || 12,
                  padding: block.style.padding || 16,
                  border: block.style.border ? '1px solid #E5E7EB' : undefined,
                  opacity: (block.style.opacity || 100) / 100
                }}
              >
                {/* Drag handle */}
                {!readOnly && !block.locked && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {/* Block preview */}
                <BlockPreview block={block} lang={lang} />
              </div>
            </Rnd>
          ))}
        </div>
      </div>
      </div>

      {/* Editor Sidebar */}
      {editingBlock && !readOnly && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
          {/* Editor Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#A8B5A0]" />
              <span className="font-medium text-[#5D5A4E]">
                {t.blocks[editingBlock.type] || editingBlock.type}
              </span>
            </div>
            <button
              onClick={() => setEditingBlockId(null)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Editor Content */}
          <BlockEditor
            block={editingBlock}
            onUpdate={(dataUpdates) => handleBlockDataUpdate(editingBlock.id, dataUpdates)}
            onClose={() => setEditingBlockId(null)}
            lang={lang}
          />
        </div>
      )}
    </div>
  )
}

export default FreeformCanvas
