'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { GEMS } from '@/components/ui/button'
import { hexToRgb } from '@/components/filters/gemFilterStyle'

export default function GemStepper({
  steps,
  currentStep,
  onStepClick,
  mini = false,
}: {
  steps: { number: number; label: string }[]
  currentStep: number
  onStepClick: (step: number) => void
  mini?: boolean
}) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const g = GEMS.sage
  const rgb = hexToRgb(isDark ? g.dark : g.light)
  const glowRGB = isDark ? g.glowDark : g.glow

  const circleSize = mini ? 36 : 50
  const fontSize = mini ? 13 : 15
  const iconClass = mini ? 'w-4 h-4' : 'w-5 h-5'
  const r = circleSize / 2

  return (
    <div className="relative flex items-start justify-between" style={{ width: '100%' }}>
      {steps.map((step) => {
        const done = currentStep > step.number
        const active = currentStep === step.number
        const isLit = done || active

        return (
          <div key={step.number} className="flex flex-col items-center relative z-10">
            <div
              onClick={() => done && onStepClick(step.number)}
              style={{
                borderRadius: r,
                padding: 1.5,
                background: isLit
                  ? `linear-gradient(135deg, rgba(${glowRGB},0.80) 0%, rgba(${glowRGB},0.50) 50%, rgba(${glowRGB},0.70) 100%)`
                  : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,205,215,0.45)',
                boxShadow: active
                  ? `0 0 20px rgba(${glowRGB},${isDark ? 0.70 : 0.45}), 0 0 40px rgba(${glowRGB},${isDark ? 0.35 : 0.22}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.18 : 0.50})`
                  : done
                  ? `0 0 14px rgba(${glowRGB},${isDark ? 0.45 : 0.30}), 0 0 28px rgba(${glowRGB},${isDark ? 0.20 : 0.12}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.14 : 0.45})`
                  : `0 1px 3px rgba(0,0,0,${isDark ? 0.15 : 0.04}), inset 0 0.5px 0 rgba(255,255,255,${isDark ? 0.06 : 0.40})`,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                cursor: done ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: circleSize,
                  height: circleSize,
                  borderRadius: r - 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize,
                  fontWeight: 650,
                  letterSpacing: '-0.01em',
                  color: isLit
                    ? (isDark ? g.textDark : g.text)
                    : isDark ? 'rgba(255,255,255,0.30)' : 'rgba(93,90,78,0.40)',
                  background: isLit
                    ? `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.38 : 0.46}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${isDark ? 0.30 : 0.36}) 100%)`
                    : isDark ? 'rgba(30,30,34,0.80)' : 'rgba(255,255,255,0.88)',
                  backdropFilter: isLit ? 'blur(12px) saturate(150%)' : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                {isLit && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: isDark
                        ? 'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                        : 'linear-gradient(170deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.36) 100%)',
                      borderRadius: r - 1.5,
                    }}
                  />
                )}
                {isLit && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '8%',
                      right: '8%',
                      height: '45%',
                      pointerEvents: 'none',
                      background: `linear-gradient(180deg, rgba(255,255,255,${isDark ? 0.10 : 0.28}) 0%, transparent 100%)`,
                      borderRadius: `${r - 1.5}px ${r - 1.5}px 50% 50%`,
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
                  {done ? <Check className={iconClass} /> : step.number}
                </span>
              </div>
            </div>

            {!mini && (
              <span
                className="hidden sm:block mt-2"
                style={{
                  fontSize: 11,
                  fontWeight: active ? 650 : 500,
                  letterSpacing: '0.01em',
                  color: active
                    ? (isDark ? g.textDark : g.text)
                    : done
                    ? (isDark ? 'rgba(255,255,255,0.70)' : '#5D5A4E')
                    : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(93,90,78,0.40)',
                  transition: 'color 0.3s ease',
                }}
              >
                {step.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
