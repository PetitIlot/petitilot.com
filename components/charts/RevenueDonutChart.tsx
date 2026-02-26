'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import { useChartColors, glassTooltipStyle } from './chartTheme'

export interface DonutSlice {
  name: string
  value: number
  color: string
}

interface RevenueDonutChartProps {
  data: DonutSlice[]
  unit?: string
  onSelect?: (name: string) => void
}

function CustomTooltip({ active, payload, isDark, unit }: {
  active?: boolean
  payload?: Array<{ payload: DonutSlice }>
  isDark: boolean
  unit: string
}) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={glassTooltipStyle(isDark)}>
      <p className="font-medium mb-1 opacity-80 max-w-[140px] truncate">{d.name}</p>
      <p style={{ color: d.color }} className="font-bold text-lg">
        {d.value.toFixed(unit === '€' ? 2 : 0)} {unit}
      </p>
    </div>
  )
}

export function RevenueDonutChart({ data, unit = '€', onSelect }: RevenueDonutChartProps) {
  const colors = useChartColors()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
            animationDuration={800}
            stroke="none"
            onMouseEnter={(_, index) => setHovered(data[index].name)}
            onMouseLeave={() => setHovered(null)}
            onClick={(d) => onSelect?.(d.name)}
            style={{ cursor: onSelect ? 'pointer' : 'default', outline: 'none' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                opacity={hovered === null || hovered === entry.name ? 1 : 0.4}
                style={{ transition: 'opacity 0.2s ease', outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip isDark={colors.isDark} unit={unit} />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend pills */}
      <div className="flex flex-col gap-1.5 mt-2">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-2 cursor-pointer group px-2 py-1 -mx-2 rounded-lg hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors"
            onClick={() => onSelect?.(entry.name)}
            onMouseEnter={() => setHovered(entry.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-foreground-secondary dark:text-foreground-dark-secondary truncate group-hover:text-foreground dark:group-hover:text-foreground-dark transition-colors">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-foreground dark:text-foreground-dark flex-shrink-0 tabular-nums">
              {entry.value.toFixed(unit === '€' ? 2 : 0)}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
