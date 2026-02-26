/**
 * useCanvasHistory - Hook pour gérer l'historique du canvas (Undo/Redo)
 */

import { useState, useCallback, useRef } from 'react'
import type { ContentBlock, CanvasHistory, CanvasHistoryEntry } from '@/lib/blocks/types'

const MAX_HISTORY_ENTRIES = 50

interface UseCanvasHistoryReturn {
  // State
  blocks: ContentBlock[]
  canUndo: boolean
  canRedo: boolean

  // Actions
  setBlocks: (blocks: ContentBlock[], action?: string) => void
  updateBlock: (id: string, updates: Partial<ContentBlock>, action?: string) => void
  updateBlockData: (id: string, dataUpdates: Record<string, unknown>, action?: string) => void
  updateBlockStyle: (id: string, styleUpdates: Partial<ContentBlock['style']>, action?: string) => void
  addBlock: (block: ContentBlock, action?: string) => void
  removeBlock: (id: string, action?: string) => void
  moveBlock: (id: string, x: number, y: number) => void
  resizeBlock: (id: string, width: number, height: number | 'auto') => void
  undo: () => void
  redo: () => void
  resetHistory: (initialBlocks?: ContentBlock[]) => void
}

export function useCanvasHistory(initialBlocks: ContentBlock[] = []): UseCanvasHistoryReturn {
  // Current blocks state
  const [blocks, setBlocksState] = useState<ContentBlock[]>(initialBlocks)

  // History state
  const [history, setHistory] = useState<CanvasHistory>({
    entries: initialBlocks.length > 0
      ? [{ blocks: JSON.parse(JSON.stringify(initialBlocks)), timestamp: Date.now(), action: 'Initial' }]
      : [],
    currentIndex: initialBlocks.length > 0 ? 0 : -1,
    maxEntries: MAX_HISTORY_ENTRIES
  })

  // Ref pour éviter les doublons lors de drag/resize rapides
  const lastActionRef = useRef<{ action: string; timestamp: number } | null>(null)

  // Ajouter une entrée à l'historique
  const pushToHistory = useCallback((newBlocks: ContentBlock[], action: string) => {
    // Debounce: éviter les entrées trop rapides pour la même action
    const now = Date.now()
    if (
      lastActionRef.current &&
      lastActionRef.current.action === action &&
      now - lastActionRef.current.timestamp < 300
    ) {
      // Mettre à jour la dernière entrée au lieu d'en ajouter une nouvelle
      setHistory(prev => {
        const entries = [...prev.entries]
        if (entries[prev.currentIndex]) {
          entries[prev.currentIndex] = {
            blocks: JSON.parse(JSON.stringify(newBlocks)),
            timestamp: now,
            action
          }
        }
        return { ...prev, entries }
      })
      return
    }

    lastActionRef.current = { action, timestamp: now }

    setHistory(prev => {
      // Supprimer les entrées après l'index actuel (invalide le redo)
      const entries = prev.entries.slice(0, prev.currentIndex + 1)

      // Ajouter la nouvelle entrée
      const newEntry: CanvasHistoryEntry = {
        blocks: JSON.parse(JSON.stringify(newBlocks)),
        timestamp: now,
        action
      }
      entries.push(newEntry)

      // Limiter le nombre d'entrées
      if (entries.length > prev.maxEntries) {
        entries.shift()
      }

      return {
        entries,
        currentIndex: entries.length - 1,
        maxEntries: prev.maxEntries
      }
    })
  }, [])

  // Set blocks avec historique
  const setBlocks = useCallback((newBlocks: ContentBlock[], action = 'Update') => {
    setBlocksState(newBlocks)
    pushToHistory(newBlocks, action)
  }, [pushToHistory])

  // Update un bloc spécifique
  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>, action = 'Update block') => {
    setBlocksState(prev => {
      const newBlocks = prev.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
      pushToHistory(newBlocks, action)
      return newBlocks
    })
  }, [pushToHistory])

  // Update block data (merges inside functional update to avoid stale closure)
  const updateBlockData = useCallback((id: string, dataUpdates: Record<string, unknown>, action = 'Edit block') => {
    setBlocksState(prev => {
      const newBlocks = prev.map(block =>
        block.id === id
          ? { ...block, data: { ...block.data, ...dataUpdates } as ContentBlock['data'] }
          : block
      )
      pushToHistory(newBlocks, action)
      return newBlocks
    })
  }, [pushToHistory])

  // Update block style (merges inside functional update to avoid stale closure)
  const updateBlockStyle = useCallback((id: string, styleUpdates: Partial<ContentBlock['style']>, action = 'Style block') => {
    setBlocksState(prev => {
      const newBlocks = prev.map(block =>
        block.id === id
          ? { ...block, style: { ...block.style, ...styleUpdates } }
          : block
      )
      pushToHistory(newBlocks, action)
      return newBlocks
    })
  }, [pushToHistory])

  // Ajouter un bloc
  const addBlock = useCallback((block: ContentBlock, action = 'Add block') => {
    setBlocksState(prev => {
      const newBlocks = [...prev, block]
      pushToHistory(newBlocks, action)
      return newBlocks
    })
  }, [pushToHistory])

  // Supprimer un bloc
  const removeBlock = useCallback((id: string, action = 'Remove block') => {
    setBlocksState(prev => {
      const newBlocks = prev.filter(block => block.id !== id)
      pushToHistory(newBlocks, action)
      return newBlocks
    })
  }, [pushToHistory])

  // Déplacer un bloc (optimisé pour drag)
  const moveBlock = useCallback((id: string, x: number, y: number) => {
    setBlocksState(prev => {
      const newBlocks = prev.map(block =>
        block.id === id
          ? { ...block, position: { ...block.position, x, y } }
          : block
      )
      pushToHistory(newBlocks, 'Move block')
      return newBlocks
    })
  }, [pushToHistory])

  // Redimensionner un bloc
  const resizeBlock = useCallback((id: string, width: number, height: number | 'auto') => {
    setBlocksState(prev => {
      const newBlocks = prev.map(block =>
        block.id === id
          ? { ...block, position: { ...block.position, width, height } }
          : block
      )
      pushToHistory(newBlocks, 'Resize block')
      return newBlocks
    })
  }, [pushToHistory])

  // Undo
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex <= 0) return prev

      const newIndex = prev.currentIndex - 1
      const entry = prev.entries[newIndex]

      if (entry) {
        setBlocksState(JSON.parse(JSON.stringify(entry.blocks)))
      }

      return { ...prev, currentIndex: newIndex }
    })
  }, [])

  // Redo
  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex >= prev.entries.length - 1) return prev

      const newIndex = prev.currentIndex + 1
      const entry = prev.entries[newIndex]

      if (entry) {
        setBlocksState(JSON.parse(JSON.stringify(entry.blocks)))
      }

      return { ...prev, currentIndex: newIndex }
    })
  }, [])

  // Reset history
  const resetHistory = useCallback((newInitialBlocks: ContentBlock[] = []) => {
    setBlocksState(newInitialBlocks)
    setHistory({
      entries: newInitialBlocks.length > 0
        ? [{ blocks: JSON.parse(JSON.stringify(newInitialBlocks)), timestamp: Date.now(), action: 'Reset' }]
        : [],
      currentIndex: newInitialBlocks.length > 0 ? 0 : -1,
      maxEntries: MAX_HISTORY_ENTRIES
    })
    lastActionRef.current = null
  }, [])

  return {
    blocks,
    canUndo: history.currentIndex > 0,
    canRedo: history.currentIndex < history.entries.length - 1,
    setBlocks,
    updateBlock,
    updateBlockData,
    updateBlockStyle,
    addBlock,
    removeBlock,
    moveBlock,
    resizeBlock,
    undo,
    redo,
    resetHistory
  }
}
