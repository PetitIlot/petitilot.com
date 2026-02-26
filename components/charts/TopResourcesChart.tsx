'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { useChartColors, glassTooltipStyle } from './chartTheme'
import { useState } from 'react'

interface ResourceBarItem {
  name: string
  value: number
  id: string
}

interface TopResourcesChartProps {
  data: ResourceBarItem[]
  color: string
  unit?: string
  onSelect?: (id: string) => void
  formatValue?: (v: number) => string
}

function CustomTooltip({ active, payload, isDark, formatValue, unit, textColor }: {
  active?: boolean
  payload?: Array<{ payload: ResourceBarItem; value: number }>
  isDark: boolean
  formatValue: (v: number) => string
  unit: string
  textColor: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={glassTooltipStyle(isDark)}>
      <p className="font-medium mb-1 opacity-80 max-w-[160px] truncate">{payload[0].payload.name}</p>
      <p style={{ color: textColor }} className="font-bold text-lg">{formatValue(payload[0].value)} {unit}</p>
    </div>
  )
}

export function TopResourcesChart({
  data, color, unit = '', onSelect, formatValue = (v) => v.toLocaleString(),
}: TopResourcesChartProps) {
  const colors = useChartColors()
  const [hovered, setHovered] = useState<string | null>(null)

  if (data.length === 0) {
    return (
      <p className="text-xs text-center text-foreground-secondary dark:text-foreground-dark-secondary py-6 italic">
        Aucune donnée
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 48, 80)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 11, fill: colors.foregroundSecondary, fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 17) + '…' : v}
        />
        <Tooltip
          content={
            <CustomTooltip
              isDark={colors.isDark}
              formatValue={formatValue}
              unit={unit}
              textColor={color}
            />
          }
          cursor={{ fill: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          animationDuration={1000}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseEnter={(d: any) => setHovered(d?.id ?? null)}
          onMouseLeave={() => setHovered(null)}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(d: any) => onSelect?.(d?.id)}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          barSize={24}
        >
          {data.map((entry) => (
            <Cell
              key={entry.id}
              fill={color}
              opacity={hovered === null || hovered === entry.id ? 1 : 0.6}
              style={{ transition: 'opacity 0.2s ease' }}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => formatValue(Number(v))}
            style={{ fontSize: 12, fill: colors.foregroundSecondary, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
