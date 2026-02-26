'use client'

import { useState, useRef, useCallback } from 'react'
import { Copy, Check, Download, X, Mail } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  ressourceId: string
  title: string
  ageMin?: number | null
  ageMax?: number | null
  duration?: number | null
}

// SVG paths for platform icons
const PLATFORM_ICONS = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (let n = 0; n < words.length; n++) {
    const testLine = line + (line ? ' ' : '') + words[n]
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = words[n]
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, currentY)
  return currentY
}

export function ShareModal({ isOpen, onClose, ressourceId, title, ageMin, ageMax, duration }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/fr/activites/${ressourceId}`
    : `/fr/activites/${ressourceId}`

  const shareText = `✨ ${title} — une activité pour les enfants sur Petit Ilot 🌿`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl })
      } catch {
        // user cancelled
      }
    }
  }

  const platforms = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      icon: PLATFORM_ICONS.whatsapp,
    },
    {
      name: 'Pinterest',
      color: '#E60023',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`,
      icon: PLATFORM_ICONS.pinterest,
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: PLATFORM_ICONS.facebook,
    },
    {
      name: 'X / Twitter',
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: PLATFORM_ICONS.twitter,
    },
    {
      name: 'Email',
      color: '#555',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Découvre cette ressource sur Petit Ilot :\n\n${title}\n\n${shareUrl}`)}`,
      icon: <Mail className="w-6 h-6" />,
    },
  ]

  const generateAndDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080
    const H = 1080
    canvas.width = W
    canvas.height = H

    // --- Background gradient ---
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#96A88B')
    grad.addColorStop(0.5, '#7A8B6F')
    grad.addColorStop(1, '#5C6B52')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // --- Decorative circles ---
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.beginPath()
    ctx.arc(W * 0.88, H * 0.12, 320, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.beginPath()
    ctx.arc(W * 0.08, H * 0.88, 380, 0, Math.PI * 2)
    ctx.fill()

    // --- Glassy inner card ---
    ctx.fillStyle = 'rgba(255,255,255,0.11)'
    fillRoundRect(ctx, 70, 70, W - 140, H - 140, 64)

    // --- Brand name ---
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font = `bold 54px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.fillText('petit ilot', W / 2, 200)

    // --- Tagline ---
    ctx.font = `32px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.58)'
    ctx.fillText('ressources éducatives 0–6 ans', W / 2, 255)

    // --- Separator ---
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(190, 310)
    ctx.lineTo(W - 190, 310)
    ctx.stroke()

    // --- Title (large, wrapped) ---
    ctx.font = `bold 82px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
    ctx.fillStyle = 'white'
    const titleEndY = wrapText(ctx, title, W / 2, 460, W - 280, 105)

    // --- Age / Duration badges (if available) ---
    let badgesY = Math.max(titleEndY + 80, 700)
    if (ageMin != null || duration != null) {
      ctx.font = `30px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.70)'
      const parts: string[] = []
      if (ageMin != null) {
        const maxStr = ageMax != null ? `–${ageMax} ans` : '+ ans'
        parts.push(`👶 ${ageMin}${maxStr}`)
      }
      if (duration != null) parts.push(`🕒 ${duration} min`)
      if (parts.length > 0) ctx.fillText(parts.join('   '), W / 2, badgesY)
      badgesY += 60
    }

    // --- Bottom separator ---
    const sep2Y = Math.max(badgesY + 20, 840)
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(190, sep2Y)
    ctx.lineTo(W - 190, sep2Y)
    ctx.stroke()

    // --- URL ---
    ctx.font = `34px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.58)'
    ctx.fillText('petit-ilot.com', W / 2, H - 110)

    // --- Download ---
    const link = document.createElement('a')
    link.download = `petit-ilot-${ressourceId}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [title, ageMin, ageMax, duration, ressourceId])

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--surface)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Partager</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--surface-secondary)] transition-colors text-[var(--foreground-secondary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Native share (mobile) */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--sage)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Partager via…
            </button>
          )}

          {/* Platform grid */}
          <div className="grid grid-cols-5 gap-2">
            {platforms.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-105"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </div>
                <span className="text-[9px] text-[var(--foreground-secondary)] text-center leading-tight">{p.name}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 px-3 py-2 bg-[var(--surface-secondary)] rounded-xl text-xs text-[var(--foreground-secondary)] truncate">
              {shareUrl}
            </div>
            <button
              onClick={copyLink}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 transition-all"
              style={{ background: copied ? '#34C759' : 'var(--sage)' }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>

          {/* Download card */}
          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-[11px] text-[var(--foreground-secondary)] mb-2.5 uppercase tracking-wide font-medium">
              Carte 1:1 — Instagram / Pinterest
            </p>
            <button
              onClick={generateAndDownload}
              className="w-full py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium flex items-center justify-center gap-2 text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger la carte
            </button>
          </div>
        </div>

        {/* Hidden canvas for card generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
