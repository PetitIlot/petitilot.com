'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Search, ChevronDown } from 'lucide-react'
import { ALL_FONTS, CATEGORY_LABELS, getFontFamily, loadGoogleFont } from '@/lib/googleFonts'

interface FontPickerProps {
  label: string
  value: string
  onChange: (fontId: string) => void
}

export function FontPicker({ label, value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const categories = useMemo(() => {
    const cats = ['all', ...Object.keys(CATEGORY_LABELS)]
    return cats
  }, [])

  const filteredFonts = useMemo(() => {
    return ALL_FONTS.filter(f => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || f.category === category
      return matchSearch && matchCat
    }).slice(0, 50)
  }, [search, category])

  const currentFont = ALL_FONTS.find(f => f.id === value)
  const displayName = currentFont?.name || 'System'

  // Compute fixed position from trigger button
  const getDropdownStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = 320
    const openAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight

    return {
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-[var(--foreground-secondary)]">{label}</label>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between h-8 px-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-xs text-[var(--foreground)] hover:border-[var(--sage)] transition-colors"
        style={{ fontFamily: getFontFamily(value) }}
      >
        <span className="truncate">{displayName}</span>
        <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-50" />
      </button>

      {open && createPortal(
        <div ref={dropdownRef} className="rounded-xl glass shadow-[var(--elevation-3)] overflow-hidden" style={getDropdownStyle()}>
          {/* Search */}
          <div className="p-2 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--foreground-secondary)]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-7 pl-7 pr-2 text-xs rounded-md bg-[var(--surface-secondary)] border-0 text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]/40 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-0.5 px-2 py-1.5 border-b border-[var(--border)] overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-[var(--sage)] text-white'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--surface-secondary)]'
                }`}
              >
                {cat === 'all' ? 'Toutes' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {/* Font list */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredFonts.map(font => {
              loadGoogleFont(font.id)
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => {
                    onChange(font.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--surface-secondary)] transition-colors ${
                    font.id === value ? 'bg-[var(--sage)]/10 text-[var(--sage)]' : 'text-[var(--foreground)]'
                  }`}
                  style={{ fontFamily: getFontFamily(font.id) }}
                >
                  {font.name}
                </button>
              )
            })}
            {filteredFonts.length === 0 && (
              <p className="px-3 py-4 text-xs text-[var(--foreground-secondary)] text-center">
                Aucune police trouvée
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
