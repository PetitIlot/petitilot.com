'use client'

import { SeparatorBlockData, BlockStyle } from '@/lib/blocks/types'

interface SeparatorBlockProps {
  data: SeparatorBlockData
  style: BlockStyle
}

export default function SeparatorBlock({ data, style }: SeparatorBlockProps) {
  const color = data.color || 'var(--border)'

  switch (data.style) {
    case 'line':
      return (
        <div
          className="w-full"
          style={{
            height: data.thickness,
            backgroundColor: color
          }}
        />
      )

    case 'dots':
      return (
        <div className="w-full flex justify-center items-center gap-2 py-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: data.thickness * 4,
                height: data.thickness * 4,
                backgroundColor: color
              }}
            />
          ))}
        </div>
      )

    case 'wave':
      return (
        <div className="w-full py-2">
          <svg
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: data.thickness * 10 }}
          >
            <path
              d="M0,5 Q25,0 50,5 T100,5"
              fill="none"
              stroke={color}
              strokeWidth={data.thickness}
            />
          </svg>
        </div>
      )

    case 'space':
    default:
      return <div style={{ height: data.thickness * 16 }} />
  }
}
