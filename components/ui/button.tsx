'use client'

import * as React from "react"

/* ═══════════════════════════════════════════════════════════
   GEMSTONE BUTTON SYSTEM v4 — Full Frozen Glass
   Bordures argentées · Teinte gemme · Capillarité lumineuse
   ═══════════════════════════════════════════════════════════ */

const GEMS = {
  sage:        { light: "#9DC3A9", deep: "#7EA891", text: "#3A5E44", glow: "140,195,160", dark: "#6EE8A0", glowDark: "110,232,160", textDark: "#B8F5D0" },
  mauve:       { light: "#A892CB", deep: "#8E78B2", text: "#4A3668", glow: "152,128,192", dark: "#B88AFF", glowDark: "184,138,255", textDark: "#D8C4FF" },
  terracotta:  { light: "#D9A87C", deep: "#C48E62", text: "#6B4226", glow: "200,155,105", dark: "#FFA060", glowDark: "255,160,96",  textDark: "#FFD0A8" },
  rose:        { light: "#D4919E", deep: "#C07A88", text: "#6E2E3C", glow: "200,130,145", dark: "#FF7AA0", glowDark: "255,122,160", textDark: "#FFC0D4" },
  sky:         { light: "#7CB8D4", deep: "#5FA0BE", text: "#1E4D64", glow: "100,168,200", dark: "#5AC8FF", glowDark: "90,200,255",  textDark: "#B0E4FF" },
  amber:       { light: "#D4B870", deep: "#C0A254", text: "#5C4A1A", glow: "192,168,80",  dark: "#FFD040", glowDark: "255,208,64",  textDark: "#FFE8A0" },
  neutral:     { light: "#9098A2", deep: "#7A828C", text: "#3A3E44", glow: "130,140,152", dark: "#8E98A4", glowDark: "142,152,164", textDark: "#C8CED6" },
  destructive: { light: "#CC6B6B", deep: "#B55555", text: "#5E1A1A", glow: "195,95,95",   dark: "#FF5C5C", glowDark: "255,92,92",   textDark: "#FFB8B8" },
  gold:        { light: "#D4A745", deep: "#B8922E", text: "#5C4210", glow: "212,167,69",  dark: "#FFD055", glowDark: "255,208,85",  textDark: "#FFF0C8" },
} as const

type GemColor = keyof typeof GEMS

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline'
  gem?: GemColor
  size?: 'default' | 'sm' | 'lg' | 'icon'
  pill?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = 'default', gem = 'sage', size = 'default', pill = false, children, disabled, style: _externalStyle, ...restProps }, ref) => {
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const btnRef = React.useRef<HTMLButtonElement | null>(null)
    const [mouse, setMouse] = React.useState({ x: 50, y: 50, px: 0, py: 0, inside: false })
    const [isDark, setIsDark] = React.useState(false)

    React.useEffect(() => {
      const check = () => {
        setIsDark(document.documentElement.classList.contains('dark'))
      }
      check()
      const obs = new MutationObserver(check)
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => { obs.disconnect() }
    }, [])

    const handleMove = React.useCallback((e: React.MouseEvent) => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setMouse({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
        px: e.clientX - r.left,
        py: e.clientY - r.top,
        inside: true,
      })
    }, [])

    const handleLeave = React.useCallback(() => {
      setMouse(m => ({ ...m, inside: false }))
    }, [])

    const setRefs = React.useCallback((node: HTMLButtonElement | null) => {
      btnRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }, [ref])

    const g = GEMS[gem] || GEMS.sage
    const dark = isDark
    const glowRGB = dark ? g.glowDark : g.glow
    const rgb = hexToRgb(dark ? g.dark : g.light)
    const textColor = dark ? g.textDark : g.text

    const sizes = {
      sm:      { h: 34, px: 14, fs: 13, r: 11, rInner: 9,  iconSize: 14, border: 1.5, glowR: 90 },
      default: { h: 42, px: 20, fs: 14, r: 14, rInner: 12, iconSize: 16, border: 1.5, glowR: 110 },
      lg:      { h: 50, px: 28, fs: 15, r: 16, rInner: 14, iconSize: 18, border: 2,   glowR: 130 },
      icon:    { h: 38, px: 0,  fs: 14, r: 12, rInner: 10, iconSize: 16, border: 1.5, glowR: 90 },
    }
    const _s = sizes[size] || sizes.default
    const s = pill ? { ..._s, r: 9999, rInner: 9999 } : _s

    const isGhost = variant === 'ghost'
    const isOutline = variant === 'outline'
    const isSolid = variant === 'default'
    const hoverOn = mouse.inside && !disabled

    // ── Ghost: simple, pas de wrapper double-couche
    if (isGhost) {
      return (
        <button
          ref={setRefs}
          disabled={disabled}
          className={`inline-flex items-center justify-center font-semibold transition-all duration-200
            hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] rounded-[10px]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]
            ${size === 'sm' ? 'h-[34px] px-3.5 text-[13px]' : size === 'lg' ? 'h-[50px] px-7 text-[15px]' : size === 'icon' ? 'h-9 w-9' : 'h-[42px] px-5 text-[14px]'}
            ${className}`}
          {...restProps}
        >
          {children}
        </button>
      )
    }

    // ── Bordure argentée givrée
    const silverBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(200,205,215,0.55)"

    // ── Wrapper background : jet concentré + capillarité ambiante
    const wrapperBg = hoverOn
      ? [
          `radial-gradient(ellipse ${s.glowR * 0.7}px ${s.glowR * 0.5}px at ${mouse.px}px ${mouse.py}px, rgba(${glowRGB},1) 0%, rgba(${glowRGB},0.85) 40%, transparent 100%)`,
          `radial-gradient(ellipse ${s.glowR * 1.5}px ${s.glowR * 1.1}px at ${mouse.px}px ${mouse.py}px, rgba(${glowRGB},${dark ? 0.55 : 0.45}) 0%, rgba(${glowRGB},${dark ? 0.15 : 0.10}) 60%, transparent 100%)`,
          `linear-gradient(135deg, rgba(${glowRGB},${dark ? 0.22 : 0.16}) 0%, rgba(${glowRGB},${dark ? 0.10 : 0.06}) 50%, rgba(${glowRGB},${dark ? 0.18 : 0.12}) 100%)`,
        ].join(", ")
      : silverBorder

    // ── Inner : verre givré teinté
    const tintAlpha = dark ? 0.20 : 0.28
    const frostAlpha = dark ? 0.05 : 0.42
    const innerBg = isOutline
      ? (dark ? "rgba(30,30,34,0.80)" : "rgba(255,255,255,0.85)")
      : `linear-gradient(170deg, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.06}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha}) 50%, rgba(${rgb.r},${rgb.g},${rgb.b},${tintAlpha + 0.04}) 100%)`

    return (
      <div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
        style={{
          display: "inline-flex",
          borderRadius: s.r,
          padding: s.border,
          background: wrapperBg,
          transition: "background 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.4 : 1,
          boxShadow: hoverOn
            ? [
                `0 0 ${s.glowR * 0.25}px rgba(${glowRGB},${dark ? 0.65 : 0.50})`,
                `0 0 ${s.glowR * 0.6}px rgba(${glowRGB},${dark ? 0.35 : 0.25})`,
                `0 2px 8px rgba(0,0,0,${dark ? 0.25 : 0.06})`,
                `inset 0 0 ${s.glowR * 0.15}px rgba(${glowRGB},${dark ? 0.50 : 0.35})`,
                `inset 0 0.5px 0 rgba(255,255,255,${dark ? 0.15 : 0.55})`,
              ].join(", ")
            : [
                `0 2px 8px rgba(0,0,0,${dark ? 0.25 : 0.06})`,
                `0 1px 2px rgba(0,0,0,${dark ? 0.15 : 0.03})`,
                `inset 0 0.5px 0 rgba(255,255,255,${dark ? 0.06 : 0.50})`,
              ].join(", "),
        }}
      >
        <button
          ref={setRefs}
          disabled={disabled}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: size === 'icon' ? s.h : "100%",
            height: s.h,
            padding: size === 'icon' ? 0 : `0 ${s.px}px`,
            fontSize: s.fs,
            fontWeight: 650,
            letterSpacing: "-0.01em",
            color: isOutline ? (dark ? g.dark : g.deep) : textColor,
            background: innerBg,
            backdropFilter: isOutline ? "none" : "blur(12px) saturate(140%)",
            WebkitBackdropFilter: isOutline ? "none" : "blur(12px) saturate(140%)",
            border: isOutline ? `1px solid ${dark ? "rgba(255,255,255,0.10)" : `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`}` : "none",
            borderRadius: s.rInner,
            cursor: disabled ? "default" : "pointer",
            overflow: "hidden",
            transition: "background 0.3s ease, color 0.3s ease",
            WebkitFontSmoothing: "antialiased",
          }}
          {...restProps}
        >
          {/* Frost overlay */}
          {isSolid && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: dark
                  ? "linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)"
                  : `linear-gradient(170deg, rgba(255,255,255,${frostAlpha + 0.12}) 0%, rgba(255,255,255,${frostAlpha}) 45%, rgba(255,255,255,${frostAlpha + 0.05}) 100%)`,
                borderRadius: s.rInner,
              }}
            />
          )}
          {/* Shine — jet coloré concentré */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: hoverOn ? 1 : 0,
              transition: "opacity 0.35s ease",
              background: isOutline
                ? `radial-gradient(circle ${s.glowR * 0.5}px at ${mouse.x}% ${mouse.y}%, rgba(${glowRGB},0.22) 0%, rgba(${glowRGB},0.06) 50%, transparent 100%)`
                : `radial-gradient(circle ${s.glowR * 0.45}px at ${mouse.x}% ${mouse.y}%, rgba(${glowRGB},${dark ? 0.55 : 0.65}) 0%, rgba(${glowRGB},${dark ? 0.18 : 0.25}) 50%, transparent 100%)`,
            }}
          />
          {/* Reflet top — éclat de verre poli */}
          {isSolid && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: "6%",
                right: "6%",
                height: "45%",
                pointerEvents: "none",
                background: `linear-gradient(180deg, rgba(255,255,255,${dark ? 0.10 : 0.30}) 0%, rgba(255,255,255,${dark ? 0.02 : 0.06}) 50%, transparent 100%)`,
                borderRadius: `${s.rInner}px ${s.rInner}px 50% 50%`,
              }}
            />
          )}
          {/* Content */}
          <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            {children}
          </span>
        </button>
      </div>
    )
  }
)
Button.displayName = "Button"

export { Button, GEMS }
export type { GemColor }
