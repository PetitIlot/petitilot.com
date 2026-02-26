'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface SparklineChartProps {
  data: number[]
  color: string
  height?: number
}

export function SparklineChart({ data, color, height = 48 }: SparklineChartProps) {
  const chartData = data.map((v, i) => ({ i, v }))
  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, '')}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
