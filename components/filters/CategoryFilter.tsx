'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants/filters'
import { GEMS } from '@/components/ui/button'
import type { GemColor } from '@/components/ui/button'
import { FilterIcon } from '@/lib/constants/resourceIcons'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

interface CategoryFilterProps {
  selected: string[]
  onToggle: (value: string) => void
  lang: Language
}

/**
 * Boutons gemstone pour sélectionner les types d'activité
 */
export default function CategoryFilter({ selected, onToggle, lang }: CategoryFilterProps) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => {
        const isSelected = selected.includes(cat.value)
        const gem = (cat.gem as GemColor) || 'sage'
        const g = GEMS[gem]
        const rgb = hexToRgb(isDark ? g.dark : g.light)
        const glowRGB = isDark ? g.glowDark : g.glow

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onToggle(cat.value)}
            className="transition-all duration-300 active:scale-[0.97]"
            style={{
              borderRadius: 20,
              padding: 1.5,
              background: isSelected
                ? `linear-gradient(135deg, rgba(${glowRGB},0.65) 0%, rgba(${glowRGB},0.35) 50%, rgba(${glowRGB},0.55) 100%)`
                : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)'),
              boxShadow: isSelected
                ? `0 0 12px rgba(${glowRGB},${isDark ? 0.4 : 0.25}), 0 1px 4px rgba(0,0,0,${isDark ? 0.2 : 0.06}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.12 : 0.4})`
                : `0 1px 3px rgba(0,0,0,${isDark ? 0.15 : 0.04}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.4})`,
            }}
          >
            <div
              className="flex items-center gap-1.5"
              style={{
                position: 'relative',
                padding: '6px 12px',
                borderRadius: 18.5,
                fontSize: 13,
                fontWeight: 650,
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                color: isSelected
                  ? (isDark ? g.textDark : g.text)
                  : (isDark ? '#C8CED6' : '#5D5A4E'),
                background: isSelected
                  ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.26 : 0.34}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.20 : 0.26}) 100%)`
                  : (isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)'),
                backdropFilter: isSelected ? 'blur(10px) saturate(130%)' : 'none',
                WebkitBackdropFilter: isSelected ? 'blur(10px) saturate(130%)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Frost overlay */}
              {isSelected && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: isDark
                      ? 'linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                      : 'linear-gradient(170deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.36) 100%)',
                    borderRadius: 18.5,
                  }}
                />
              )}
              {/* Glass shine */}
              {isSelected && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '8%',
                    right: '8%',
                    height: '45%',
                    pointerEvents: 'none',
                    background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.08 : 0.25}) 0%, transparent 100%)`,
                    borderRadius: '18.5px 18.5px 50% 50%',
                  }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 2 }}><FilterIcon value={cat.value} size={16} /></span>
              <span style={{ position: 'relative', zIndex: 2 }}>{cat.label[lang]}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
