// Google Fonts catalog - Top 100+ popular fonts
// Organized by category for easier browsing

export interface GoogleFont {
  id: string
  name: string
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // === SANS-SERIF ===
  { id: 'roboto', name: 'Roboto', category: 'sans-serif' },
  { id: 'open-sans', name: 'Open Sans', category: 'sans-serif' },
  { id: 'lato', name: 'Lato', category: 'sans-serif' },
  { id: 'montserrat', name: 'Montserrat', category: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', category: 'sans-serif' },
  { id: 'inter', name: 'Inter', category: 'sans-serif' },
  { id: 'nunito', name: 'Nunito', category: 'sans-serif' },
  { id: 'nunito-sans', name: 'Nunito Sans', category: 'sans-serif' },
  { id: 'quicksand', name: 'Quicksand', category: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', category: 'sans-serif' },
  { id: 'ubuntu', name: 'Ubuntu', category: 'sans-serif' },
  { id: 'rubik', name: 'Rubik', category: 'sans-serif' },
  { id: 'work-sans', name: 'Work Sans', category: 'sans-serif' },
  { id: 'mulish', name: 'Mulish', category: 'sans-serif' },
  { id: 'josefin-sans', name: 'Josefin Sans', category: 'sans-serif' },
  { id: 'dm-sans', name: 'DM Sans', category: 'sans-serif' },
  { id: 'manrope', name: 'Manrope', category: 'sans-serif' },
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'sans-serif' },
  { id: 'outfit', name: 'Outfit', category: 'sans-serif' },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', category: 'sans-serif' },
  { id: 'karla', name: 'Karla', category: 'sans-serif' },
  { id: 'cabin', name: 'Cabin', category: 'sans-serif' },
  { id: 'barlow', name: 'Barlow', category: 'sans-serif' },
  { id: 'maven-pro', name: 'Maven Pro', category: 'sans-serif' },
  { id: 'comfortaa', name: 'Comfortaa', category: 'sans-serif' },
  { id: 'assistant', name: 'Assistant', category: 'sans-serif' },
  { id: 'lexend', name: 'Lexend', category: 'sans-serif' },
  { id: 'figtree', name: 'Figtree', category: 'sans-serif' },
  { id: 'sora', name: 'Sora', category: 'sans-serif' },
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', category: 'sans-serif' },

  // === SERIF ===
  { id: 'playfair-display', name: 'Playfair Display', category: 'serif' },
  { id: 'merriweather', name: 'Merriweather', category: 'serif' },
  { id: 'lora', name: 'Lora', category: 'serif' },
  { id: 'pt-serif', name: 'PT Serif', category: 'serif' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', category: 'serif' },
  { id: 'cormorant-garamond', name: 'Cormorant Garamond', category: 'serif' },
  { id: 'crimson-text', name: 'Crimson Text', category: 'serif' },
  { id: 'spectral', name: 'Spectral', category: 'serif' },
  { id: 'bitter', name: 'Bitter', category: 'serif' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'serif' },
  { id: 'dm-serif-display', name: 'DM Serif Display', category: 'serif' },
  { id: 'source-serif-pro', name: 'Source Serif Pro', category: 'serif' },
  { id: 'noto-serif', name: 'Noto Serif', category: 'serif' },
  { id: 'vollkorn', name: 'Vollkorn', category: 'serif' },
  { id: 'zilla-slab', name: 'Zilla Slab', category: 'serif' },
  { id: 'frank-ruhl-libre', name: 'Frank Ruhl Libre', category: 'serif' },
  { id: 'cardo', name: 'Cardo', category: 'serif' },
  { id: 'alice', name: 'Alice', category: 'serif' },

  // === DISPLAY ===
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'display' },
  { id: 'anton', name: 'Anton', category: 'display' },
  { id: 'righteous', name: 'Righteous', category: 'display' },
  { id: 'titan-one', name: 'Titan One', category: 'display' },
  { id: 'fredoka-one', name: 'Fredoka One', category: 'display' },
  { id: 'alfa-slab-one', name: 'Alfa Slab One', category: 'display' },
  { id: 'bowlby-one-sc', name: 'Bowlby One SC', category: 'display' },
  { id: 'abril-fatface', name: 'Abril Fatface', category: 'display' },
  { id: 'bangers', name: 'Bangers', category: 'display' },
  { id: 'lobster', name: 'Lobster', category: 'display' },
  { id: 'concert-one', name: 'Concert One', category: 'display' },
  { id: 'russo-one', name: 'Russo One', category: 'display' },
  { id: 'bungee', name: 'Bungee', category: 'display' },
  { id: 'archivo-black', name: 'Archivo Black', category: 'display' },
  { id: 'passion-one', name: 'Passion One', category: 'display' },
  { id: 'luckiest-guy', name: 'Luckiest Guy', category: 'display' },
  { id: 'modak', name: 'Modak', category: 'display' },
  { id: 'baloo-2', name: 'Baloo 2', category: 'display' },
  { id: 'lilita-one', name: 'Lilita One', category: 'display' },

  // === HANDWRITING ===
  { id: 'dancing-script', name: 'Dancing Script', category: 'handwriting' },
  { id: 'pacifico', name: 'Pacifico', category: 'handwriting' },
  { id: 'caveat', name: 'Caveat', category: 'handwriting' },
  { id: 'satisfy', name: 'Satisfy', category: 'handwriting' },
  { id: 'great-vibes', name: 'Great Vibes', category: 'handwriting' },
  { id: 'kalam', name: 'Kalam', category: 'handwriting' },
  { id: 'indie-flower', name: 'Indie Flower', category: 'handwriting' },
  { id: 'sacramento', name: 'Sacramento', category: 'handwriting' },
  { id: 'courgette', name: 'Courgette', category: 'handwriting' },
  { id: 'cookie', name: 'Cookie', category: 'handwriting' },
  { id: 'shadows-into-light', name: 'Shadows Into Light', category: 'handwriting' },
  { id: 'patrick-hand', name: 'Patrick Hand', category: 'handwriting' },
  { id: 'architects-daughter', name: 'Architects Daughter', category: 'handwriting' },
  { id: 'permanent-marker', name: 'Permanent Marker', category: 'handwriting' },
  { id: 'amatic-sc', name: 'Amatic SC', category: 'handwriting' },
  { id: 'mali', name: 'Mali', category: 'handwriting' },
  { id: 'gloria-hallelujah', name: 'Gloria Hallelujah', category: 'handwriting' },
  { id: 'covered-by-your-grace', name: 'Covered By Your Grace', category: 'handwriting' },
  { id: 'handlee', name: 'Handlee', category: 'handwriting' },
  { id: 'nothing-you-could-do', name: 'Nothing You Could Do', category: 'handwriting' },

  // === MONOSPACE ===
  { id: 'fira-code', name: 'Fira Code', category: 'monospace' },
  { id: 'source-code-pro', name: 'Source Code Pro', category: 'monospace' },
  { id: 'roboto-mono', name: 'Roboto Mono', category: 'monospace' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', category: 'monospace' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', category: 'monospace' },
  { id: 'space-mono', name: 'Space Mono', category: 'monospace' },
  { id: 'ubuntu-mono', name: 'Ubuntu Mono', category: 'monospace' },
  { id: 'inconsolata', name: 'Inconsolata', category: 'monospace' },
  { id: 'cousine', name: 'Cousine', category: 'monospace' },
  { id: 'dm-mono', name: 'DM Mono', category: 'monospace' },
]

// System fonts (no loading needed)
export const SYSTEM_FONTS = [
  { id: 'default', name: 'Par défaut', category: 'system' as const },
  { id: 'system-serif', name: 'Serif (système)', category: 'system' as const },
  { id: 'system-mono', name: 'Mono (système)', category: 'system' as const },
]

// All fonts combined
export const ALL_FONTS = [...SYSTEM_FONTS, ...GOOGLE_FONTS]

// Category labels for UI
export const CATEGORY_LABELS: Record<string, string> = {
  'system': 'Système',
  'sans-serif': 'Sans Serif',
  'serif': 'Serif',
  'display': 'Display',
  'handwriting': 'Manuscrit',
  'monospace': 'Monospace'
}

// Convert font ID to Google Fonts URL format
export function fontIdToGoogleName(id: string): string {
  // Convert kebab-case to Title Case with + for spaces
  return id.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('+')
}

// Get CSS font-family value for a font ID
export function getFontFamily(id: string): string {
  if (id === 'default') return 'inherit'
  if (id === 'system-serif') return 'Georgia, "Times New Roman", serif'
  if (id === 'system-mono') return 'ui-monospace, "SF Mono", Menlo, Monaco, monospace'

  const font = GOOGLE_FONTS.find(f => f.id === id)
  if (!font) return 'inherit'

  const fallback = font.category === 'serif' ? 'serif'
    : font.category === 'monospace' ? 'monospace'
    : font.category === 'handwriting' ? 'cursive'
    : 'sans-serif'

  return `"${font.name}", ${fallback}`
}

// Track loaded fonts to avoid duplicate loads
const loadedFonts = new Set<string>()

// Load a Google Font dynamically
export function loadGoogleFont(fontId: string): void {
  // Skip system fonts
  if (fontId === 'default' || fontId.startsWith('system-')) return

  // Skip if already loaded
  if (loadedFonts.has(fontId)) return

  const font = GOOGLE_FONTS.find(f => f.id === fontId)
  if (!font) return

  // Mark as loaded
  loadedFonts.add(fontId)

  // Create link element
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${fontIdToGoogleName(fontId)}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

// Preload multiple fonts at once (for preview)
export function preloadFonts(fontIds: string[]): void {
  fontIds.forEach(loadGoogleFont)
}
