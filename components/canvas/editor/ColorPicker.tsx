'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const COLOR_PRESETS = [
  { id: 'sage', color: '#7A8B6F', label: 'Sage' },
  { id: 'sage-light', color: '#A8B5A0', label: 'Sage clair' },
  { id: 'mauve', color: '#B8A9C9', label: 'Mauve' },
  { id: 'terracotta', color: '#C9A092', label: 'Terracotta' },
  { id: 'sky', color: '#5AC8FA', label: 'Sky' },
  { id: 'amber', color: '#D4B870', label: 'Ambre' },
  { id: 'white', color: '#FFFFFF', label: 'Blanc' },
  { id: 'surface', color: '#F5F5F7', label: 'Surface' },
  { id: 'dark', color: '#1D1D1F', label: 'Sombre' },
  { id: 'transparent', color: 'transparent', label: 'Aucun' },
]

interface ColorPickerProps {
  label: string
  value: string | undefined
  onChange: (color: string) => void
  allowTransparent?: boolean
}

export function ColorPicker({ label, value, onChange, allowTransparent = true }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [hexInput, setHexInput] = useState(value || '')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const presets = allowTransparent
    ? COLOR_PRESETS
    : COLOR_PRESETS.filter(p => p.id !== 'transparent')

  useEffect(() => {
    setHexInput(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false)
      }
    }
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const displayColor = value === 'transparent' || !value
    ? 'transparent'
    : value

  const getDropdownStyle = (): React.CSSProperties => {
    if (!triggerRef.current) return {}
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = 180
    const openAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight

    return {
      position: 'fixed',
      left: rect.left,
      width: Math.max(200, rect.width + 120),
      zIndex: 9999,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-[var(--foreground-secondary)]">{label}</label>
      <div className="flex items-center gap-2">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-8 h-8 rounded-lg border border-[var(--border-strong)] flex-shrink-0 transition-transform duration-150 hover:scale-105 active:scale-95"
          style={{
            background: displayColor === 'transparent'
              ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 12px 12px'
              : displayColor
          }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={e => {
            setHexInput(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value) || e.target.value === 'transparent') {
              onChange(e.target.value)
            }
          }}
          onBlur={() => {
            if (/^#[0-9a-fA-F]{6}$/.test(hexInput)) {
              onChange(hexInput)
            } else if (hexInput === '' || hexInput === 'transparent') {
              onChange('transparent')
            }
          }}
          placeholder="#7A8B6F"
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)]/40 focus:outline-none focus:border-[var(--sage)] font-mono"
        />
      </div>

      {showPicker && createPortal(
        <div ref={dropdownRef} className="p-3 rounded-xl glass shadow-[var(--elevation-3)]" style={getDropdownStyle()}>
          {/* Native color picker */}
          <div className="mb-3">
            <input
              type="color"
              value={value && value !== 'transparent' ? value : '#7A8B6F'}
              onChange={e => {
                onChange(e.target.value)
                setHexInput(e.target.value)
              }}
              className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
          </div>
          {/* Presets grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onChange(preset.color)
                  setHexInput(preset.color)
                  setShowPicker(false)
                }}
                className="w-7 h-7 rounded-md border transition-all duration-150 hover:scale-110 active:scale-95"
                style={{
                  background: preset.color === 'transparent'
                    ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                    : preset.color,
                  borderColor: value === preset.color
                    ? 'var(--sage)'
                    : 'var(--border)',
                  boxShadow: value === preset.color
                    ? '0 0 0 2px var(--sage), inset 0 0 0 1px rgba(255,255,255,0.5)'
                    : undefined
                }}
                title={preset.label}
              />
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
