'use client'

import { useState, useEffect } from 'react'

export interface ChartColors {
  sage: string
  terracotta: string
  sky: string
  mauve: string
  rose: string
  amber: string
  neutral: string
  foreground: string
  foregroundSecondary: string
  palette: string[]
  isDark: boolean
}

const LIGHT: ChartColors = {
  sage: '#10B981', // Emerald
  terracotta: '#F43F5E', // Rose
  sky: '#0EA5E9', // Sky blue
  mauve: '#8B5CF6', // Violet
  rose: '#EC4899', // Pink
  amber: '#F59E0B', // Amber
  neutral: '#64748B', // Slate
  foreground: '#0F172A', // Slate 900
  foregroundSecondary: '#64748B', // Slate 500
  palette: ['#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#F43F5E'],
  isDark: false,
}

const DARK: ChartColors = {
  sage: '#34D399', // Emerald 400
  terracotta: '#FB7185', // Rose 400
  sky: '#38BDF8', // Sky 400
  mauve: '#A78BFA', // Violet 400
  rose: '#F472B6', // Pink 400
  amber: '#FBBF24', // Amber 400
  neutral: '#94A3B8', // Slate 400
  foreground: '#F8FAFC', // Slate 50
  foregroundSecondary: '#94A3B8', // Slate 400
  palette: ['#A78BFA', '#38BDF8', '#34D399', '#FBBF24', '#F472B6', '#FB7185'],
  isDark: true,
}

export function useChartColors(): ChartColors {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains('dark'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return dark ? DARK : LIGHT
}

export function glassTooltipStyle(dark: boolean): React.CSSProperties {
  return {
    backgroundColor: dark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    border: dark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: dark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
    color: dark ? '#F8FAFC' : '#0F172A',
    fontSize: '13px',
    padding: '10px 14px',
    fontWeight: 500,
  }
}
