import * as React from "react"

/* Gemstone Badge — frozen glass teinté, raccord avec le button system v4 */

const BADGE_GEMS = {
  sage:        { bg: "rgba(157,195,169,0.22)", text: "#3A5E44", border: "rgba(157,195,169,0.30)", darkBg: "rgba(110,232,160,0.14)", darkText: "#B8F5D0", darkBorder: "rgba(110,232,160,0.20)" },
  mauve:       { bg: "rgba(168,146,203,0.22)", text: "#4A3668", border: "rgba(168,146,203,0.30)", darkBg: "rgba(184,138,255,0.14)", darkText: "#D8C4FF", darkBorder: "rgba(184,138,255,0.20)" },
  terracotta:  { bg: "rgba(217,168,124,0.22)", text: "#6B4226", border: "rgba(217,168,124,0.30)", darkBg: "rgba(255,160,96,0.14)",  darkText: "#FFD0A8", darkBorder: "rgba(255,160,96,0.20)" },
  rose:        { bg: "rgba(212,145,158,0.22)", text: "#6E2E3C", border: "rgba(212,145,158,0.30)", darkBg: "rgba(255,122,160,0.14)", darkText: "#FFC0D4", darkBorder: "rgba(255,122,160,0.20)" },
  sky:         { bg: "rgba(124,184,212,0.22)", text: "#1E4D64", border: "rgba(124,184,212,0.30)", darkBg: "rgba(90,200,255,0.14)",  darkText: "#B0E4FF", darkBorder: "rgba(90,200,255,0.20)" },
  amber:       { bg: "rgba(212,184,112,0.22)", text: "#5C4A1A", border: "rgba(212,184,112,0.30)", darkBg: "rgba(255,208,64,0.14)",  darkText: "#FFE8A0", darkBorder: "rgba(255,208,64,0.20)" },
  neutral:     { bg: "rgba(144,152,162,0.18)", text: "#3A3E44", border: "rgba(144,152,162,0.25)", darkBg: "rgba(142,152,164,0.12)", darkText: "#C8CED6", darkBorder: "rgba(142,152,164,0.18)" },
  destructive: { bg: "rgba(204,107,107,0.22)", text: "#5E1A1A", border: "rgba(204,107,107,0.30)", darkBg: "rgba(255,92,92,0.14)",   darkText: "#FFB8B8", darkBorder: "rgba(255,92,92,0.20)" },
  gold:        { bg: "rgba(212,167,69,0.22)",  text: "#5C4210", border: "rgba(212,167,69,0.30)",  darkBg: "rgba(255,208,85,0.14)",  darkText: "#FFF0C8", darkBorder: "rgba(255,208,85,0.20)" },
} as const

type BadgeGem = keyof typeof BADGE_GEMS

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'subtle'
  gem?: BadgeGem
}

function Badge({ className = "", variant = 'default', gem = 'sage', style, ...props }: BadgeProps) {
  const g = BADGE_GEMS[gem] || BADGE_GEMS.sage

  const baseStyles = "inline-flex items-center rounded-[10px] px-3 py-1.5 text-xs font-semibold transition-colors"

  if (variant === 'outline') {
    return (
      <div
        className={`${baseStyles} border border-[var(--border-strong)] text-[var(--foreground)] bg-transparent ${className}`}
        style={style}
        {...props}
      />
    )
  }

  if (variant === 'subtle') {
    return (
      <div
        className={`${baseStyles} bg-[var(--foreground)]/5 text-[var(--foreground-secondary)] ${className}`}
        style={style}
        {...props}
      />
    )
  }

  // Default: frozen glass teinté
  return (
    <div
      className={`${baseStyles} backdrop-blur-sm ${className}`}
      style={{
        background: `var(--badge-bg, ${g.bg})`,
        color: `var(--badge-text, ${g.text})`,
        border: `1px solid var(--badge-border, ${g.border})`,
        ...style,
        // @ts-ignore — CSS custom properties for dark mode handled via className
      }}
      data-gem={gem}
      {...props}
    />
  )
}

export { Badge, BADGE_GEMS }
export type { BadgeGem }
