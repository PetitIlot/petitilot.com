'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { useState } from 'react'
import { useChartColors, glassTooltipStyle } from './chartTheme'

interface DayData {
  date: string
  value: number
}

function CustomTooltip({ active, payload, label, isDark, textColor }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  isDark: boolean
  textColor: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={glassTooltipStyle(isDark)}>
      <p className="font-medium mb-1 opacity-80">{label}</p>
      <p style={{ color: textColor }} className="font-bold text-lg">
        {payload[0].value.toFixed(2)} €
      </p>
    </div>
  )
}

export function RevenueBarChart({ data }: { data: DayData[] }) {
  const colors = useChartColors()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="4 4" stroke={colors.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: colors.foregroundSecondary, fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: colors.foregroundSecondary, fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
          tickMargin={12}
        />
        <Tooltip content={<CustomTooltip isDark={colors.isDark} textColor={colors.sage} />} cursor={{ fill: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
          onMouseEnter={(_, index) => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={colors.sage}
              opacity={hovered === null || hovered === index ? 1 : 0.6}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
