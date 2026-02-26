'use client'

import { useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { gemPillStyle } from './gemFilterStyle'

interface AgeSliderProps {
  ageMin: number | null
  ageMax: number | null
  onChange: (ageMin: number | null, ageMax: number | null) => void
  lang: Language
}

const AGE_PRESETS = [
  { label: { fr: '0-1 an', en: '0-1 year', es: '0-1 año' }, min: 0, max: 12 },
  { label: { fr: '1-2 ans', en: '1-2 years', es: '1-2 años' }, min: 12, max: 24 },
  { label: { fr: '2-3 ans', en: '2-3 years', es: '2-3 años' }, min: 24, max: 36 },
  { label: { fr: '3-4 ans', en: '3-4 years', es: '3-4 años' }, min: 36, max: 48 },
  { label: { fr: '4-5 ans', en: '4-5 years', es: '4-5 años' }, min: 48, max: 60 },
  { label: { fr: '5-6 ans', en: '5-6 years', es: '5-6 años' }, min: 60, max: 72 },
]

export default function AgeSlider({ ageMin, ageMax, onChange, lang }: AgeSliderProps) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const isPresetInRange = (presetMin: number, presetMax: number): boolean => {
    if (ageMin === null || ageMax === null) return false
    return presetMin >= ageMin && presetMax <= ageMax
  }

  const togglePreset = (presetMin: number, presetMax: number) => {
    if (ageMin === null || ageMax === null) {
      onChange(presetMin, presetMax)
      return
    }
    const isInRange = isPresetInRange(presetMin, presetMax)
    if (isInRange) {
      if (ageMin === presetMin && ageMax === presetMax) onChange(null, null)
      else if (presetMin === ageMin) onChange(presetMax, ageMax)
      else if (presetMax === ageMax) onChange(ageMin, presetMin)
      else onChange(ageMin, presetMin)
    } else {
      onChange(Math.min(ageMin, presetMin), Math.max(ageMax, presetMax))
    }
  }

  const isAllActive = ageMin === null && ageMax === null
  const GEM = 'neutral' as const

  const getRangeLabel = (): string | null => {
    if (ageMin === null || ageMax === null) return null
    const minY = Math.floor(ageMin / 12), maxY = Math.ceil(ageMax / 12)
    if (lang === 'fr') return `${minY}-${maxY} ans`
    if (lang === 'es') return `${minY}-${maxY} años`
    return `${minY}-${maxY} years`
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(() => {
          const s = gemPillStyle(GEM, isAllActive, isDark)
          return (
            <button type="button" onClick={() => onChange(null, null)} className="transition-all duration-300 active:scale-[0.97]" style={s.wrapper}>
              <div className="flex items-center gap-1.5" style={{ ...s.inner, padding: '6px 12px' }}>
                {isAllActive && <span aria-hidden style={s.frost} />}
                {isAllActive && <span aria-hidden style={s.shine} />}
                <span style={{ position: 'relative', zIndex: 2 }}>{lang === 'fr' ? 'Tous' : lang === 'es' ? 'Todos' : 'All'}</span>
              </div>
            </button>
          )
        })()}
        {AGE_PRESETS.map((preset, idx) => {
          const isActive = isPresetInRange(preset.min, preset.max)
          const s = gemPillStyle(GEM, isActive, isDark)
          return (
            <button key={idx} type="button" onClick={() => togglePreset(preset.min, preset.max)} className="transition-all duration-300 active:scale-[0.97]" style={s.wrapper}>
              <div className="flex items-center gap-1.5" style={{ ...s.inner, padding: '6px 12px' }}>
                {isActive && <span aria-hidden style={s.frost} />}
                {isActive && <span aria-hidden style={s.shine} />}
                <span style={{ position: 'relative', zIndex: 2 }}>{preset.label[lang]}</span>
              </div>
            </button>
          )
        })}
      </div>
      {!isAllActive && (
        <p className="text-xs text-sage font-medium">
          {lang === 'fr' ? 'Plage : ' : lang === 'es' ? 'Rango: ' : 'Range: '}{getRangeLabel()}
        </p>
      )}
    </div>
  )
}
