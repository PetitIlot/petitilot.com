'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Rnd } from 'react-rnd'
import {
  Plus, Undo2, Redo2, Trash2, Lock, Unlock, Eye, EyeOff,
  Type, Image, Video, List, ShoppingCart, Lightbulb, Minus,
  GripVertical, User, Images, X, Edit3, Copy, ArrowUp, ArrowDown,
  Layers, Film, Grid, HelpCircle, Package, Download, PlayCircle, KeyRound, LayoutGrid,
  UserCircle, BookOpen, Star, Share2
} from 'lucide-react'
import type { Language } from '@/lib/types'
import type {
  ContentBlock, BlockType, ContentBlocksData, CanvasConfig, PaywallConfig,
  BlockPosition, BlockStyle, TitleBlockData
} from '@/lib/blocks/types'
import { Button, GEMS } from '@/components/ui/button'
import { BLOCK_PRESETS, DEFAULT_CANVAS_CONFIG, createBlock, CREATOR_PAGE_BLOCK_TYPES } from '@/lib/blocks/types'
import { migratePaywallBlock } from '@/lib/blocks/migratePaywallBlock'
import { useCanvasHistory } from './useCanvasHistory'
import { BlockPreview, GemButtonPreview } from './BlockPreview'
import { BlockEditor, PaywallEditor } from './BlockEditor'
import { BlockStyleWrapper } from './BlockStyleWrapper'
import ScalableBlockWrapper from './ScalableBlockWrapper'
import type { GemColor } from '@/lib/blocks/types'

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
      separator: 'Séparateur',
      creator: 'Créateur',
      'image-grid': 'Grille images',
      faq: 'FAQ',
      material: 'Matériel',
      download: 'Téléchargement',
      paywall: 'Rideau payant',
      'activity-cards': 'Carrousel activités',
      'profile-hero': 'Profil héro',
      'creator-resources': 'Mes ressources',
      'creator-featured': 'Ressource vedette',
      'social-widget': 'Réseau social',
    },
    blockCategories: {
      content: 'Contenu',
      media: 'Média',
      monetisation: 'Monétisation',
      profile: 'Profil',
      resources: 'Ressources',
      socials: 'Réseaux',
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
      separator: 'Separator',
      creator: 'Creator',
      'image-grid': 'Image Grid',
      faq: 'FAQ',
      material: 'Material',
      download: 'Download',
      paywall: 'Paywall',
      'activity-cards': 'Activity carousel',
      'profile-hero': 'Profile hero',
      'creator-resources': 'My resources',
      'creator-featured': 'Featured resource',
      'social-widget': 'Social media',
    },
    blockCategories: {
      content: 'Content',
      media: 'Media',
      monetisation: 'Monetisation',
      profile: 'Profile',
      resources: 'Resources',
      socials: 'Social',
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
      separator: 'Separador',
      creator: 'Creador',
      'image-grid': 'Cuadrícula',
      faq: 'FAQ',
      material: 'Material',
      download: 'Descarga',
      paywall: 'Paywall',
      'activity-cards': 'Carrusel',
      'profile-hero': 'Perfil héroe',
      'creator-resources': 'Mis recursos',
      'creator-featured': 'Recurso destacado',
      'social-widget': 'Red social',
    },
    blockCategories: {
      content: 'Contenido',
      media: 'Medios',
      monetisation: 'Monetización',
      profile: 'Perfil',
      resources: 'Recursos',
      socials: 'Redes',
    },
    emptyCanvas: 'Haz clic en + para agregar tu primer bloque',
    gridSnap: 'Ajustar a cuadrícula',
    blocksCount: 'bloques'
  }
}

const BLOCK_ICONS: Partial<Record<BlockType, React.ReactNode>> = {
  title: <Type className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  carousel: <Images className="w-4 h-4" />,
  'carousel-video': <Film className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  list: <List className="w-4 h-4" />,
  'list-links': <List className="w-4 h-4" />,
  purchase: <ShoppingCart className="w-4 h-4" />,
  separator: <Minus className="w-4 h-4" />,
  creator: <User className="w-4 h-4" />,
  'image-grid': <Grid className="w-4 h-4" />,
  faq: <HelpCircle className="w-4 h-4" />,
  material: <Package className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  'activity-cards': <LayoutGrid className="w-4 h-4" />,
  // paywall: maintenant géré comme overlay canvas-level, pas comme bloc
  'profile-hero': <UserCircle className="w-4 h-4" />,
  'creator-resources': <LayoutGrid className="w-4 h-4" />,
  'creator-featured': <Star className="w-4 h-4" />,
  'social-widget': <Share2 className="w-4 h-4" />,
}

// ============================================
// ADD BLOCK DROPDOWN — Portal-based to escape overflow-hidden
// ============================================
function AddBlockDropdown({
  btnRef,
  onAdd,
  onClose,
  t,
  paywallActive,
  onTogglePaywall,
  availableBlockTypes,
}: {
  btnRef: React.RefObject<HTMLDivElement | null>
  onAdd: (type: BlockType) => void
  onClose: () => void
  t: typeof translations['fr']
  paywallActive?: boolean
  onTogglePaywall?: () => void
  availableBlockTypes?: BlockType[]
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // Position the dropdown below the button
  useEffect(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left })
    }
  }, [btnRef])

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose, btnRef])

  return (
    <div
      ref={menuRef}
      className="fixed w-60 rounded-2xl py-2 overflow-hidden max-h-[70vh] overflow-y-auto"
      style={{
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--elevation-3)',
      }}
    >
      {availableBlockTypes ? (
        // ── Mode pages créateur : catégories spécialisées ──────────────────
        <>
          {/* Profil */}
          {availableBlockTypes.some(t => ['profile-hero'].includes(t)) && (
            <>
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.profile}</span>
              </div>
              {(['profile-hero'] as BlockType[]).filter(x => availableBlockTypes.includes(x)).map(type => (
                <button key={type} onClick={() => onAdd(type)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors">
                  <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
                  <span>{t.blocks[type as keyof typeof t.blocks]}</span>
                </button>
              ))}
            </>
          )}
          {/* Ressources */}
          {availableBlockTypes.some(t => ['creator-resources', 'creator-featured'].includes(t)) && (
            <>
              <div className="mx-3 my-1 border-t border-[var(--border)]" />
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.resources}</span>
              </div>
              {(['creator-resources', 'creator-featured'] as BlockType[]).filter(x => availableBlockTypes.includes(x)).map(type => (
                <button key={type} onClick={() => onAdd(type)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors">
                  <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
                  <span>{t.blocks[type as keyof typeof t.blocks]}</span>
                </button>
              ))}
            </>
          )}
          {/* Réseaux sociaux */}
          {availableBlockTypes.includes('social-widget') && (
            <>
              <div className="mx-3 my-1 border-t border-[var(--border)]" />
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.socials}</span>
              </div>
              <button onClick={() => onAdd('social-widget')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors">
                <span className="text-[var(--sage)]">{BLOCK_ICONS['social-widget']}</span>
                <span>{t.blocks['social-widget']}</span>
              </button>
            </>
          )}
          {/* Contenu générique */}
          {availableBlockTypes.some(bt => ['text', 'list', 'list-links', 'faq'].includes(bt)) && (
            <>
              <div className="mx-3 my-1 border-t border-[var(--border)]" />
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.content}</span>
              </div>
              {(['text', 'list', 'list-links', 'faq'] as BlockType[]).filter(x => availableBlockTypes.includes(x)).map(type => (
                <button key={type} onClick={() => onAdd(type)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors">
                  <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
                  <span>{t.blocks[type as keyof typeof t.blocks]}</span>
                </button>
              ))}
            </>
          )}
          {/* Médias génériques */}
          {availableBlockTypes.some(bt => ['image', 'carousel', 'image-grid', 'video', 'separator'].includes(bt)) && (
            <>
              <div className="mx-3 my-1 border-t border-[var(--border)]" />
              <div className="px-4 pt-2 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.media}</span>
              </div>
              {(['image', 'carousel', 'image-grid', 'video', 'separator'] as BlockType[]).filter(x => availableBlockTypes.includes(x)).map(type => (
                <button key={type} onClick={() => onAdd(type)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors">
                  <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
                  <span>{t.blocks[type as keyof typeof t.blocks]}</span>
                </button>
              ))}
            </>
          )}
        </>
      ) : (
        // ── Mode ressources : catégories standard ──────────────────────────
        <>
          {/* ── Contenu ── */}
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.content}</span>
          </div>
          {(['title', 'text', 'list', 'list-links', 'material', 'creator', 'faq'] as BlockType[]).map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
              <span>{t.blocks[type as keyof typeof t.blocks]}</span>
            </button>
          ))}

          {/* ── Média ── */}
          <div className="mx-3 my-1 border-t border-[var(--border)]" />
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.media}</span>
          </div>
          {(['image', 'carousel', 'image-grid', 'video', 'carousel-video', 'activity-cards'] as BlockType[]).map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
              <span>{t.blocks[type as keyof typeof t.blocks]}</span>
            </button>
          ))}

          {/* ── Monétisation ── */}
          <div className="mx-3 my-1 border-t border-[var(--border)]" />
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{t.blockCategories.monetisation}</span>
          </div>
          {(['purchase', 'download'] as BlockType[]).map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <span className="text-[var(--sage)]">{BLOCK_ICONS[type]}</span>
              <span>{t.blocks[type as keyof typeof t.blocks]}</span>
            </button>
          ))}
          {/* Rideau payant — toggle canvas-level */}
          <button
            onClick={() => { onTogglePaywall?.(); onClose() }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <span className="text-[var(--sage)]"><KeyRound className="w-4 h-4" /></span>
            <span className="flex-1 text-left">{t.blocks.paywall}</span>
            {paywallActive && (
              <span className="w-2 h-2 rounded-full bg-[var(--sage)]" />
            )}
          </button>
        </>
      )}
    </div>
  )
}

interface FormDataForCanvas {
  title?: string
  type?: string | null
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  duration_max?: number | null
  duration_prep?: number | null
  intensity?: string | null
  difficulte?: string | null
  autonomie?: boolean | null
  themes?: string[] | null
  competences?: string[] | null
  categories?: string[] | null
  ressourceId?: string
  vignette_url?: string | null
  price_credits?: number | null
  creator?: {
    id?: string
    slug?: string
    display_name?: string
    avatar_url?: string | null
    bio?: string | null
    instagram_handle?: string | null
    youtube_handle?: string | null
    tiktok_handle?: string | null
    facebook_url?: string | null
    pinterest_handle?: string | null
    website_url?: string | null
    total_resources?: number
    followers_count?: number
    themes?: string[] | null
  } | null
  materiel_json?: Array<{ item: string; url?: string | null; recup?: boolean }> | null
  // Données spécifiques pages créateur
  creatorResources?: Array<{
    id: string
    title: string
    type?: string | null
    vignette_url?: string | null
    price_credits?: number | null
  }> | null
}

interface FreeformCanvasProps {
  initialData?: ContentBlocksData | null
  onChange?: (data: ContentBlocksData) => void
  lang: Language
  readOnly?: boolean
  formData?: FormDataForCanvas
  availableBlockTypes?: BlockType[]
}

export function FreeformCanvas({
  initialData,
  onChange,
  lang,
  readOnly = false,
  formData: externalFormData,
  availableBlockTypes,
}: FreeformCanvasProps) {
  const t = translations[lang]
  const canvasRef = useRef<HTMLDivElement>(null)

  // Migrate paywall block → canvas config if needed
  const migratedData = initialData ? migratePaywallBlock(initialData) : null

  // Canvas config
  const [config, setConfig] = useState<CanvasConfig>(
    migratedData?.canvas || DEFAULT_CANVAS_CONFIG
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
    updateBlockData,
    updateBlockStyle,
    undo,
    redo,
    resetHistory
  } = useCanvasHistory(migratedData?.layout?.desktop || [])

  // UI State — selectedElement can be a block id or 'paywall'
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null) // 'paywall' or null
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(config.snapToGrid)
  const [isInteracting, setIsInteracting] = useState(false)
  const [liveScale, setLiveScale] = useState<number | null>(null)
  const [isScaleMode, setIsScaleMode] = useState(false) // True pendant drag/resize
  const isScaleKeyHeldRef = useRef(false) // S held = scale mode resize
  const scaleStartRef = useRef<{ blockId: string; startW: number; startH: number; origScale: number } | null>(null)
  const addBtnRef = useRef<HTMLDivElement>(null)

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

  // Auto-ouvrir l'éditeur quand un bloc est sélectionné (et pas verrouillé)
  useEffect(() => {
    if (selectedBlockId && !readOnly) {
      const block = blocks.find(b => b.id === selectedBlockId)
      if (block && !block.locked) {
        setEditingBlockId(selectedBlockId)
      }
    }
  }, [selectedBlockId, blocks, readOnly])

  // Track last output to prevent unnecessary onChange calls
  const lastOutputRef = useRef<string | null>(null)

  // Notify parent of changes (only when blocks or config actually change, not on initial render)
  useEffect(() => {
    if (!onChange || !initializedRef.current) return

    const outputStr = JSON.stringify({ blocks, config })

    // Skip if nothing changed
    if (outputStr === lastOutputRef.current) return
    lastOutputRef.current = outputStr

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
      // S key: enable scale-mode resize
      if ((e.key === 's' || e.key === 'S') && isInteracting) {
        e.preventDefault()
        isScaleKeyHeldRef.current = true
        setIsScaleMode(true)
        setIsScaleMode(true)
        setIsScaleMode(true)
        return
      }
      if (e.key === 's' || e.key === 'S') {
        isScaleKeyHeldRef.current = true
        setIsScaleMode(true)
        setIsScaleMode(true)
        setIsScaleMode(true)
      }
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
        // Ne pas supprimer si on est dans un input, textarea, contenteditable (Tiptap), ou l'éditeur sidebar
        const isEditable = target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('[contenteditable="true"]') ||
          target.closest('.ProseMirror') ||
          target.closest('[role="textbox"]')
        if (!isEditable) {
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

    // Track S key for scale-mode resize
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        isScaleKeyHeldRef.current = false
        setIsScaleMode(false)
        setIsScaleMode(false)
        setIsScaleMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [readOnly, undo, redo, selectedBlockId, editingBlockId, removeBlock, blocks, addBlock, updateBlock])

  // Add block handler (paywall is now handled separately via togglePaywall)
  const handleAddBlock = useCallback((type: BlockType) => {
    if (type === 'paywall') return // Handled via togglePaywall

    const preset = BLOCK_PRESETS[type]
    const positionOverrides: Partial<typeof preset.position> = {
      ...preset.position,
      x: 50,
      y: blocks.length * 30 + 50,
      zIndex: blocks.length + 1
    }

    const newBlock = createBlock(
      type,
      preset.data!,
      positionOverrides,
      preset.style
    )
    addBlock(newBlock, `Ajout bloc ${type}`)
    setSelectedBlockId(newBlock.id)
    setShowAddMenu(false)
  }, [blocks, addBlock])

  // Toggle paywall overlay
  const togglePaywall = useCallback(() => {
    if (config.paywall?.enabled) {
      // If already active, select it for editing
      setSelectedElement('paywall')
      setSelectedBlockId(null)
    } else {
      // Enable paywall at a reasonable Y position
      const defaultY = Math.max(
        ...blocks.map(b => b.position.y + (typeof b.position.height === 'number' ? b.position.height : 100)),
        300
      )
      setConfig(c => ({
        ...c,
        paywall: {
          enabled: true,
          cutY: defaultY,
          blurIntensity: 12,
          overlayOpacity: 60,
          message: 'Contenu premium',
          buttonText: 'Débloquer le contenu',
          buttonStyle: 'gem',
          buttonShape: 'rounded',
          buttonGem: 'gold',
        }
      }))
      setSelectedElement('paywall')
      setSelectedBlockId(null)
    }
  }, [config.paywall, blocks])

  // Remove paywall
  const removePaywall = useCallback(() => {
    setConfig(c => ({ ...c, paywall: null }))
    setSelectedElement(null)
  }, [])

  // Snap to grid helper
  const snapValue = useCallback((value: number): number => {
    if (!snapToGrid) return value
    return Math.round(value / config.gridSize) * config.gridSize
  }, [snapToGrid, config.gridSize])

  // Handle interaction start (drag or resize)
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true)
  }, [])

  // Handle resize start — capture initial dimensions for scale mode
  const handleResizeStart = useCallback((blockId: string) => {
    setIsInteracting(true)
    const block = blocks.find(b => b.id === blockId)
    if (block) {
      scaleStartRef.current = {
        blockId,
        startW: block.position.width,
        startH: typeof block.position.height === 'number' ? block.position.height : 0,
        origScale: block.position.scale || 1,
      }
    }
  }, [blocks])

  // Handle resize in real-time — for scale mode preview
  const handleResize = useCallback((id: string, width: number, height: number | 'auto') => {
    const start = scaleStartRef.current
    if (!isScaleKeyHeldRef.current || !start || start.blockId !== id || start.startW <= 0) {
      return
    }

    // Calculate scale in real-time for preview
    const scaleX = width / start.startW
    const scaleY = start.startH > 0 && typeof height === 'number' ? height / start.startH : scaleX
    const newScale = Math.max(0.2, Math.min(3, start.origScale * Math.min(scaleX, scaleY)))
    const roundedScale = Math.round(newScale * 100) / 100

    // Update live scale for visual feedback
    setLiveScale(roundedScale)
  }, [])

  // Handle block drag — manual clamping with padding support
  const handleDragStop = useCallback((id: string, x: number, y: number) => {
    const block = blocks.find(b => b.id === id)
    const blockWidth = block ? block.position.width : 100
    const canvasWidth = canvasRef.current?.scrollWidth || config.width
    const ph = config.paddingHorizontal || 0
    const pt = config.paddingTop || 0
    const clampedX = Math.max(ph, Math.min(x, canvasWidth - blockWidth - ph))
    const clampedY = Math.max(pt, y)
    moveBlock(id, snapValue(clampedX), snapValue(clampedY))
    setTimeout(() => setIsInteracting(false), 50)
  }, [blocks, moveBlock, snapValue, config.width, config.paddingHorizontal, config.paddingTop])

  // Handle block resize
  const handleResizeStop = useCallback((
    id: string,
    width: number,
    height: number | 'auto',
    x: number,
    y: number
  ) => {
    const block = blocks.find(b => b.id === id)!
    const start = scaleStartRef.current

    // Scale mode: S was held during resize
    if (isScaleKeyHeldRef.current && start && start.blockId === id && start.startW > 0) {
      // Compute scale ratio from the drag delta
      const scaleX = width / start.startW
      const scaleY = start.startH > 0 && typeof height === 'number' ? height / start.startH : scaleX
      const newScale = Math.max(0.2, Math.min(3, start.origScale * Math.min(scaleX, scaleY)))

      // Round to 2 decimals for cleanliness
      const roundedScale = Math.round(newScale * 100) / 100

      // Calculate new dimensions that match the scaled content size
      // This ensures the block size matches what the user sees after scaling
      const scaleRatio = roundedScale / start.origScale
      const finalWidth = Math.round(start.startW * scaleRatio)
      const finalHeight = start.startH > 0 
        ? Math.round(start.startH * scaleRatio)
        : block.position.height

      updateBlock(id, {
        position: {
          ...block.position,
          // Keep the position
          x: snapValue(block.position.x),
          y: snapValue(block.position.y),
          // Update dimensions to match scaled content size
          width: finalWidth,
          height: finalHeight,
          scale: roundedScale === 1 ? undefined : roundedScale,
        }
      }, 'Scale block')
    } else {
      // Normal resize: change width/height as usual
      updateBlock(id, {
        position: {
          ...block.position,
          x: snapValue(x),
          y: snapValue(y),
          width: snapValue(width),
          height: height
        }
      }, 'Resize block')
    }

    scaleStartRef.current = null
    setLiveScale(null) /* Clear live scale preview */
    setTimeout(() => setIsInteracting(false), 50)
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

  // Handle block data update from editor (merge inside functional update to avoid stale closure)
  const handleBlockDataUpdate = useCallback((id: string, dataUpdates: Record<string, unknown>) => {
    updateBlockData(id, dataUpdates)
  }, [updateBlockData])

  // Handle block style update from editor (merge inside functional update to avoid stale closure)
  const handleBlockStyleUpdate = useCallback((id: string, styleUpdates: Partial<BlockStyle>) => {
    updateBlockStyle(id, styleUpdates)
  }, [updateBlockStyle])

  // Handle detaching an element from a title block into a separate block
  const handleDetachElement = useCallback((blockId: string, elementName: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block || block.type !== 'title') return

    const data = block.data as TitleBlockData
    const elements = data.elements || { showTitle: true, showSocial: true, showTags: true, showShare: false }

    // Map element name to key
    const keyMap: Record<string, keyof typeof elements> = {
      title: 'showTitle',
      social: 'showSocial',
      tags: 'showTags',
      share: 'showShare',
    }
    const key = keyMap[elementName]
    if (!key || !elements[key]) return // Unknown or already hidden

    // Create new block with only this element visible
    const newElements = { showTitle: false, showSocial: false, showTags: false, showShare: false }
    newElements[key as keyof typeof newElements] = true

    const newBlock = createBlock('title', {
      ...data,
      elements: newElements,
    } as TitleBlockData, {
      x: block.position.x + 20,
      y: block.position.y + (typeof block.position.height === 'number' ? block.position.height : 200) + 20,
      width: block.position.width,
      height: 'auto',
      zIndex: Math.max(...blocks.map(b => b.position.zIndex)) + 1,
    }, block.style)

    // Update original block to hide the detached element
    const updatedElements = { ...elements }
    updatedElements[key as keyof typeof updatedElements] = false

    // Batch: update original + add new
    const newBlocks = blocks.map(b =>
      b.id === blockId
        ? { ...b, data: { ...b.data, elements: updatedElements } as typeof b.data }
        : b
    )
    newBlocks.push(newBlock)
    setBlocks(newBlocks, `Detach ${elementName}`)
  }, [blocks, setBlocks])

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

  // Paywall drag state
  const [isDraggingPaywall, setIsDraggingPaywall] = useState(false)
  const paywallDragRef = useRef<{ startY: number; startCutY: number } | null>(null)

  const handlePaywallDragStart = useCallback((e: React.PointerEvent) => {
    if (!config.paywall?.enabled) return
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingPaywall(true)
    paywallDragRef.current = {
      startY: e.clientY,
      startCutY: config.paywall.cutY,
    }
      ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [config.paywall])

  const handlePaywallDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingPaywall || !paywallDragRef.current || !canvasRef.current) return
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const scrollTop = canvasRef.current.scrollTop
    const deltaY = e.clientY - paywallDragRef.current.startY
    let newCutY = paywallDragRef.current.startCutY + deltaY
    // Snap to grid
    if (snapToGrid) {
      newCutY = Math.round(newCutY / config.gridSize) * config.gridSize
    }
    newCutY = Math.max(50, newCutY)
    setConfig(c => ({
      ...c,
      paywall: c.paywall ? { ...c.paywall, cutY: newCutY } : null,
    }))
  }, [isDraggingPaywall, snapToGrid, config.gridSize])

  const handlePaywallDragEnd = useCallback((e: React.PointerEvent) => {
    setIsDraggingPaywall(false)
    paywallDragRef.current = null
      ; (e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Selected block
  const selectedBlock = blocks.find(b => b.id === selectedBlockId)
  const editingBlock = blocks.find(b => b.id === editingBlockId)
  const isPaywallSelected = selectedElement === 'paywall'
  const canvasInnerRef = useRef<HTMLDivElement>(null)

  // Canvas height calculation (for the editor grid background)
  const canvasHeight = Math.max(
    600,
    ...blocks.map(b => b.position.y + (typeof b.position.height === 'number' ? b.position.height : 200) + 50)
  )

  // Measure real canvas extent after blocks render and persist it in config.height
  useEffect(() => {
    const el = canvasInnerRef.current
    if (!el || blocks.length === 0) return

    const measure = () => {
      let maxBottom = 0
      el.querySelectorAll<HTMLElement>(':scope > [class*="react-draggable"]').forEach(child => {
        const bottom = child.offsetTop + child.offsetHeight
        if (bottom > maxBottom) maxBottom = bottom
      })
      const measured = maxBottom > 0 ? maxBottom + 60 : 0
      if (measured > 0) {
        setConfig(prev => {
          if (prev.height === measured) return prev
          return { ...prev, height: measured }
        })
      }
    }

    // Measure after a short delay so auto-height blocks have time to render
    const timer = setTimeout(measure, 200)

    // Also re-measure when child sizes change (images loading, auto-height, etc.)
    const observer = new ResizeObserver(measure)
    el.querySelectorAll<HTMLElement>(':scope > [class*="react-draggable"]').forEach(child => {
      observer.observe(child)
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [blocks])

  return (
    <div className="flex h-full">
      {/* Main canvas area */}
      <div className="flex flex-col flex-1">
        {/* Toolbar — Glass design */}
        {!readOnly && (
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b" style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            borderColor: 'var(--glass-border)',
          }}>
            {/* Left: Add block */}
            <div ref={addBtnRef}>
              <Button
                onClick={() => setShowAddMenu(!showAddMenu)}
                gem="sage"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                {t.addBlock}
              </Button>

              {/* Add menu dropdown — rendered as portal to escape overflow-hidden ancestors */}
              {showAddMenu && createPortal(
                <AddBlockDropdown
                  btnRef={addBtnRef}
                  onAdd={handleAddBlock}
                  onClose={() => setShowAddMenu(false)}
                  t={t}
                  paywallActive={!!config.paywall?.enabled}
                  onTogglePaywall={togglePaywall}
                  availableBlockTypes={availableBlockTypes}
                />,
                document.body
              )}
            </div>

            {/* Center: Undo/Redo + Block count */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 rounded-xl p-0.5" style={{ backgroundColor: 'var(--surface-secondary)' }}>
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 rounded-lg hover:bg-[var(--surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={`${t.undo} (Ctrl+Z)`}
                >
                  <Undo2 className="w-4 h-4 text-[var(--foreground)]" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 rounded-lg hover:bg-[var(--surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={`${t.redo} (Ctrl+Shift+Z)`}
                >
                  <Redo2 className="w-4 h-4 text-[var(--foreground)]" />
                </button>
              </div>
              {/* Block count */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
                <Layers className="w-3.5 h-3.5 text-[var(--foreground-secondary)]" />
                <span className="text-xs text-[var(--foreground-secondary)] font-medium">
                  {blocks.length} {t.blocksCount}
                </span>
              </div>
              {/* Scale indicator - shows when in scale mode */}
              {(isScaleMode || liveScale !== null) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--sage)]/20 border border-[var(--sage)]/30">
                  <span className="text-xs text-[var(--sage)] font-medium">
                    Scale: {Math.round((liveScale || 1) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Right: Block actions (when selected) or Paywall actions */}
            <div className="flex items-center gap-0.5">
              {/* Paywall toolbar */}
              {isPaywallSelected && config.paywall?.enabled && (
                <>
                  <div className="flex items-center gap-1.5 px-2 text-xs text-[var(--foreground-secondary)]">
                    <KeyRound className="w-3.5 h-3.5 text-[var(--sage)]" />
                    <span className="font-medium">{t.blocks.paywall}</span>
                  </div>
                  <div className="w-px h-5 bg-[var(--border)] mx-0.5" />
                  <button
                    onClick={removePaywall}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}

              {/* Block toolbar */}
              {selectedBlock && !isPaywallSelected && (
                <>
                  <button
                    onClick={() => openEditor(selectedBlock.id)}
                    disabled={selectedBlock.locked}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Éditer (Entrée)"
                  >
                    <Edit3 className="w-4 h-4 text-[var(--foreground)]" />
                  </button>
                  <div className="w-px h-5 bg-[var(--border)] mx-0.5" />
                  <button
                    onClick={() => toggleLock(selectedBlock.id)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    title={selectedBlock.locked ? t.unlock : t.lock}
                  >
                    {selectedBlock.locked ? (
                      <Lock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Unlock className="w-4 h-4 text-[var(--foreground)]" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleVisibility(selectedBlock.id)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    title={selectedBlock.visible === false ? t.show : t.hide}
                  >
                    {selectedBlock.visible === false ? (
                      <EyeOff className="w-4 h-4 text-[var(--foreground-secondary)]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[var(--foreground)]" />
                    )}
                  </button>
                  <div className="w-px h-5 bg-[var(--border)] mx-0.5" />
                  <button
                    onClick={() => duplicateBlock(selectedBlock.id)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    title={`${t.duplicate} (Ctrl+D)`}
                  >
                    <Copy className="w-4 h-4 text-[var(--foreground)]" />
                  </button>
                  <button
                    onClick={() => bringForward(selectedBlock.id)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    title={`${t.bringForward} (Ctrl+])`}
                  >
                    <ArrowUp className="w-4 h-4 text-[var(--foreground)]" />
                  </button>
                  <button
                    onClick={() => sendBackward(selectedBlock.id)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    title={`${t.sendBackward} (Ctrl+[)`}
                  >
                    <ArrowDown className="w-4 h-4 text-[var(--foreground)]" />
                  </button>
                  <div className="w-px h-5 bg-[var(--border)] mx-0.5" />
                  <button
                    onClick={() => {
                      removeBlock(selectedBlock.id)
                      setSelectedBlockId(null)
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}

              {/* Grid snap toggle */}
              <label className="flex items-center gap-2 px-3 py-1 text-xs text-[var(--foreground-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="w-3 h-3 rounded accent-[var(--sage)]"
                />
                {t.gridSnap}
              </label>

              {/* Canvas padding controls */}
              <div className="flex items-center gap-1.5 px-2 text-xs text-[var(--foreground-secondary)]">
                <span>Marges</span>
                <input
                  type="number"
                  min={0}
                  max={400}
                  step={8}
                  value={config.paddingHorizontal || 0}
                  onChange={(e) => setConfig(c => ({ ...c, paddingHorizontal: parseInt(e.target.value) || 0 }))}
                  className="w-12 px-1 py-0.5 rounded text-center bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] text-xs"
                  title="Marge horizontale (px)"
                />
                <span>H</span>
                <input
                  type="number"
                  min={0}
                  max={400}
                  step={8}
                  value={config.paddingTop || 0}
                  onChange={(e) => setConfig(c => ({ ...c, paddingTop: parseInt(e.target.value) || 0 }))}
                  className="w-12 px-1 py-0.5 rounded text-center bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] text-xs"
                  title="Marge haute (px)"
                />
                <span>V</span>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-auto"
          style={{
            backgroundColor: readOnly ? 'var(--background)' : 'var(--surface-secondary)',
            paddingRight: (editingBlock || isPaywallSelected) && !isInteracting ? '320px' : undefined,
          }}
          onClick={() => { setSelectedBlockId(null); setSelectedElement(null) }}
        >
          <div
            ref={canvasInnerRef}
            className="relative"
            style={{
              width: '100%',
              minHeight: canvasHeight,
              backgroundColor: readOnly ? 'var(--background)' : 'var(--surface)',
              backgroundImage: snapToGrid && !readOnly
                ? `linear-gradient(to right, var(--border) 1px, transparent 1px),
                 linear-gradient(to bottom, var(--border) 1px, transparent 1px)`
                : undefined,
              backgroundSize: snapToGrid && !readOnly ? `${config.gridSize}px ${config.gridSize}px` : undefined
            }}
          >
            {/* Margin guides */}
            {(config.paddingHorizontal || config.paddingTop) && !readOnly ? (
              <>
                {config.paddingHorizontal ? (
                  <>
                    <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 0, width: config.paddingHorizontal, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--sage) 6px, var(--sage) 8px)', opacity: 0.8 }} />
                    <div className="absolute top-0 bottom-0 pointer-events-none" style={{ right: 0, width: config.paddingHorizontal, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--sage) 6px, var(--sage) 8px)', opacity: 0.8 }} />
                  </>
                ) : null}
                {config.paddingTop ? (
                  <div className="absolute left-0 right-0 pointer-events-none" style={{ top: 0, height: config.paddingTop, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, var(--sage) 6px, var(--sage) 8px)', opacity: 0.8 }} />
                ) : null}
              </>
            ) : null}

            {/* Empty state */}
            {blocks.length === 0 && !readOnly && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[var(--foreground-secondary)] text-sm">{t.emptyCanvas}</p>
              </div>
            )}

            {/* Blocks — filter out residual paywall blocks */}
            {blocks.filter(b => b.type !== 'paywall').map(block => (
              <Rnd
                key={block.id}
                size={{
                  width: block.position.width,
                  height: block.position.height === 'auto' ? 'auto' : block.position.height
                }}
                position={{ x: block.position.x, y: block.position.y }}
                onDragStart={handleInteractionStart}
                onDragStop={(e, d) => handleDragStop(block.id, d.x, d.y)}
                onResizeStart={() => handleResizeStart(block.id)}
                onResize={(e, direction, ref, delta, position) => {
                  handleResize(block.id, parseInt(ref.style.width), ref.style.height === 'auto' ? ('auto' as const) : parseInt(ref.style.height))
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  handleResizeStop(
                    block.id,
                    parseInt(ref.style.width),
                    ref.style.height === 'auto' ? ('auto' as const) : parseInt(ref.style.height),
                    position.x,
                    position.y
                  )
                }}
                disableDragging={readOnly || block.locked}
                enableResizing={!readOnly && !block.locked}
                minWidth={100}
                minHeight={50}
                dragGrid={snapToGrid ? [config.gridSize, config.gridSize] : undefined}
                resizeGrid={snapToGrid ? [config.gridSize, config.gridSize] : undefined}
                style={{
                  zIndex: block.position.zIndex,
                  opacity: block.visible === false ? 0.4 : 1,
                  outline: selectedBlockId === block.id
                    ? '2px solid #A8B5A0'
                    : editingBlockId === block.id && !isInteracting
                      ? '2px solid #3B82F6'
                      : 'none',
                  outlineOffset: '2px',
                  cursor: isScaleMode ? 'nwse-resize' : undefined,
                  boxShadow: isScaleMode ? '0 0 0 4px rgba(168, 181, 160, 0.5)' : undefined,
                }}
                className="group"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setSelectedBlockId(block.id)
                  setSelectedElement(null)
                }}
                onDoubleClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  if (!readOnly && !block.locked) {
                    openEditor(block.id)
                  }
                }}
              >
                {/* Block content — v3 style rendering via shared wrapper */}
                <BlockStyleWrapper
                  style={block.style}
                  className="w-full h-full transition-shadow"
                  extraStyle={
                    !block.style.shadow || block.style.shadow === 'none'
                      ? (selectedBlockId === block.id ? { boxShadow: 'var(--elevation-1)' } : undefined)
                      : undefined
                  }
                >
                  {/* Drag handle */}
                  {!readOnly && !block.locked && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" style={{ zIndex: 10 }}>
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                  )}

                  {/* Block preview — scale applied if set via Tab+resize */}
                  <ScalableBlockWrapper scale={block.position.scale}>
                    <BlockPreview block={block} lang={lang} formData={externalFormData} />
                  </ScalableBlockWrapper>
                </BlockStyleWrapper>
              </Rnd>
            ))}

            {/* ══════════════════════════════════════════
                PAYWALL OVERLAY — canvas-level curtain
               ══════════════════════════════════════════ */}
            {config.paywall?.enabled && (() => {
              const pw = config.paywall!
              const blurPx = pw.blurIntensity ?? 12
              const opacity = (pw.overlayOpacity ?? 60) / 100
              const gemKey = (pw.buttonGem || 'gold') as GemColor
              const transitionHeight = 40 // px for gradient transition zone

              return (
                <>
                  {/* Gradient transition zone (above cutY) */}
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      top: pw.cutY - transitionHeight,
                      height: transitionHeight,
                      zIndex: 100,
                      background: `linear-gradient(180deg, transparent 0%, ${pw.overlayColor || 'rgba(255,255,255,0.6)'} 100%)`,
                      opacity,
                      backdropFilter: `blur(${blurPx * 0.3}px)`,
                      WebkitBackdropFilter: `blur(${blurPx * 0.3}px)`,
                    }}
                  />

                  {/* Main paywall overlay */}
                  <div
                    className="absolute left-0 right-0 bottom-0"
                    style={{
                      top: pw.cutY,
                      zIndex: 100,
                      backdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                      WebkitBackdropFilter: `blur(${blurPx}px) saturate(1.2)`,
                      background: pw.overlayColor || 'rgba(255,255,255,0.6)',
                      opacity,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!readOnly) {
                        setSelectedElement('paywall')
                        setSelectedBlockId(null)
                      }
                    }}
                  />

                  {/* Paywall content (Lock + message + button) — always opaque */}
                  <div
                    className="absolute left-0 right-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
                    style={{
                      top: pw.cutY + 40,
                      zIndex: 101,
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 pointer-events-none">
                      <Lock className="w-6 h-6 text-[var(--foreground-secondary)]" />
                    </div>
                    {pw.message && (
                      <p className="text-sm font-medium text-[var(--foreground)] pointer-events-none">{pw.message}</p>
                    )}
                    <div className="pointer-events-auto">
                      <GemButtonPreview
                        text={pw.buttonText || 'Débloquer le contenu'}
                        style={pw.buttonStyle}
                        shape={pw.buttonShape}
                        color={pw.buttonColor}
                        gem={pw.buttonGem}
                        icon={<Lock className="w-3 h-3" />}
                      />
                    </div>
                  </div>

                  {/* Draggable handle at cutY — editor only */}
                  {!readOnly && (
                    <div
                      className={`absolute left-0 right-0 flex items-center justify-center cursor-row-resize group/handle ${isPaywallSelected ? 'ring-2 ring-[#A8B5A0]' : ''}`}
                      style={{
                        top: pw.cutY - 4,
                        height: 8,
                        zIndex: 102,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedElement('paywall')
                        setSelectedBlockId(null)
                      }}
                      onPointerDown={handlePaywallDragStart}
                      onPointerMove={handlePaywallDragMove}
                      onPointerUp={handlePaywallDragEnd}
                    >
                      {/* Visual line */}
                      <div
                        className="absolute left-0 right-0 transition-colors"
                        style={{
                          top: '50%',
                          height: 2,
                          transform: 'translateY(-50%)',
                          backgroundColor: isPaywallSelected || isDraggingPaywall ? 'var(--sage)' : 'var(--border-strong)',
                        }}
                      />
                      {/* Grip handle center */}
                      <div
                        className="relative z-10 flex items-center gap-0.5 px-3 py-0.5 rounded-full transition-colors"
                        style={{
                          backgroundColor: isPaywallSelected || isDraggingPaywall ? 'var(--sage)' : 'var(--surface-secondary)',
                          border: `1px solid ${isPaywallSelected || isDraggingPaywall ? 'var(--sage)' : 'var(--border-strong)'}`,
                        }}
                      >
                        <GripVertical className="w-3 h-3 rotate-90" style={{ color: isPaywallSelected || isDraggingPaywall ? 'white' : 'var(--foreground-secondary)' }} />
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Editor Sidebar — Glass design */}
      {/* Paywall editor sidebar */}
      {isPaywallSelected && config.paywall?.enabled && !readOnly && (
        <div
          className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto w-80"
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderLeft: '1px solid var(--glass-border)',
            boxShadow: 'var(--elevation-3)',
          }}
        >
          <PaywallEditor
            paywall={config.paywall}
            onUpdate={(updates) => setConfig(c => ({
              ...c,
              paywall: c.paywall ? { ...c.paywall, ...updates } : null,
            }))}
            onClose={() => setSelectedElement(null)}
            onDelete={removePaywall}
            lang={lang}
          />
        </div>
      )}

      {/* Block editor sidebar */}
      {editingBlock && !readOnly && !isPaywallSelected && (
        <div
          className={`fixed right-0 top-0 bottom-0 z-50 overflow-y-auto transition-all duration-200 ease-out ${isInteracting ? 'w-12 opacity-50' : 'w-80 opacity-100'
            }`}
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderLeft: '1px solid var(--glass-border)',
            boxShadow: 'var(--elevation-3)',
          }}
        >
          {/* Editor Content - Hidden during interaction */}
          <div className={`transition-opacity duration-200 ${isInteracting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <BlockEditor
              block={editingBlock}
              onUpdate={(dataUpdates) => handleBlockDataUpdate(editingBlock.id, dataUpdates)}
              onUpdateStyle={(styleUpdates) => handleBlockStyleUpdate(editingBlock.id, styleUpdates)}
              onClose={() => {
                setEditingBlockId(null)
                setSelectedBlockId(null)
              }}
              lang={lang}
              formData={externalFormData}
              onDetachElement={editingBlock.type === 'title' ? (elemName) => handleDetachElement(editingBlock.id, elemName) : undefined}
            />
          </div>

          {/* Indicator during interaction */}
          {isInteracting && (
            <div className="flex items-center justify-center h-20">
              <GripVertical className="w-5 h-5 text-[var(--foreground-secondary)] animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FreeformCanvas
