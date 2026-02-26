'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useChartColors, glassTooltipStyle } from './chartTheme'

interface DayData {
  date: string
  value: number
}

interface SalesLineChartProps {
  data: DayData[]
  label?: string
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
        {payload[0].value} vente{payload[0].value > 1 ? 's' : ''}
      </p>
    </div>
  )
}

export function SalesLineChart({ data, label = 'Ventes' }: SalesLineChartProps) {
  const colors = useChartColors()
  const gradId = 'sales-area-grad'

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.terracotta} stopOpacity={0.3} />
            <stop offset="100%" stopColor={colors.terracotta} stopOpacity={0.0} />
          </linearGradient>
        </defs>
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
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip isDark={colors.isDark} textColor={colors.terracotta} />} />
        <Area
          type="monotone"
          dataKey="value"
          name={label}
          stroke={colors.terracotta}
          strokeWidth={3}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 5, fill: colors.foreground, stroke: colors.terracotta, strokeWidth: 3 }}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
