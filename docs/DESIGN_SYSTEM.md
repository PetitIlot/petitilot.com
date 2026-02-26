# Design System - Petit Ilot

## Philosophie design

**Référentiel ultime : Apple**
- Sobriété élégante et intemporelle
- Interface intuitive et prévisible
- Espaces généreux (breathing room)
- Animations subtiles et fluides
- Hiérarchie visuelle claire
- Typographie lisible et harmonieuse

**Principes Petit Ilot** :
- **Minimalisme fonctionnel** : Chaque élément a une raison d'être
- **Nature & douceur** : Évoque le calme, l'authenticité
- **Mobile-first** : Expérience fluide sur tous écrans
- **Accessible** : Contraste WCAG AA, navigation clavier, screen readers
- **Évolutif** : Design system scalable (tokens, composants réutilisables)

---

## Palette de couleurs

### Mode clair (Light Mode - défaut)

**Base** :
```css
--background: #FFFFFF          /* Blanc pur */
--surface: #F8F9FA             /* Gris très clair (cards, sections) */
--surface-elevated: #FFFFFF    /* Blanc (hover cards, modals) */
```

**Texte** :
```css
--text-primary: #1A1A1A        /* Presque noir (titres, body) */
--text-secondary: #6B7280      /* Gris moyen (métadonnées, captions) */
--text-tertiary: #9CA3AF       /* Gris clair (placeholders, disabled) */
```

**Accent Sauge (touche nature)** :
```css
--accent-sauge: #8FA98C        /* Sauge principal */
--accent-sauge-light: #B8CAAE  /* Sauge clair (hover, backgrounds) */
--accent-sauge-dark: #6B8668   /* Sauge foncé (active states) */
```

**Fonctionnels** :
```css
--success: #10B981             /* Vert (confirmation, validation) */
--warning: #F59E0B             /* Orange (alertes) */
--error: #EF4444               /* Rouge (erreurs) */
--info: #3B82F6                /* Bleu (informations) */
```

**Bordures & Séparations** :
```css
--border: #E5E7EB              /* Gris très clair */
--border-hover: #D1D5DB        /* Gris clair (hover) */
```

### Mode sombre (Dark Mode)

**Base** :
```css
--background: #0A0A0A          /* Presque noir (Apple-like) */
--surface: #1C1C1E             /* Gris très foncé (cards) */
--surface-elevated: #2C2C2E    /* Gris foncé (modals, hover) */
```

**Texte** :
```css
--text-primary: #FAFAFA        /* Blanc cassé (titres, body) */
--text-secondary: #A1A1AA      /* Gris clair (métadonnées) */
--text-tertiary: #71717A       /* Gris moyen (placeholders) */
```

**Accent Mauve (touche mystique)** :
```css
--accent-mauve: #B39DDB        /* Mauve principal */
--accent-mauve-light: #D1C4E9  /* Mauve clair (hover) */
--accent-mauve-dark: #9575CD   /* Mauve foncé (active) */
```

**Fonctionnels (adaptés dark)** :
```css
--success: #34D399             /* Vert plus lumineux */
--warning: #FBBF24             /* Orange plus lumineux */
--error: #F87171               /* Rouge plus lumineux */
--info: #60A5FA                /* Bleu plus lumineux */
```

**Bordures & Séparations** :
```css
--border: #27272A              /* Gris très foncé */
--border-hover: #3F3F46        /* Gris foncé (hover) */
```

---

## Typographie

**Système de fontes** :
```css
/* Titre & Interface (Apple-inspired) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Chiffres & données */
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;

/* Optionnel : Titres éditoriaux */
--font-display: 'Cabinet Grotesk', 'Inter', sans-serif;
```

**Échelle typographique (fluid, responsive)** :
```css
/* Titres */
--text-5xl: clamp(2.5rem, 5vw, 4rem);      /* 40-64px - Hero */
--text-4xl: clamp(2rem, 4vw, 3rem);        /* 32-48px - H1 */
--text-3xl: clamp(1.5rem, 3vw, 2.25rem);   /* 24-36px - H2 */
--text-2xl: clamp(1.25rem, 2vw, 1.875rem); /* 20-30px - H3 */
--text-xl: 1.25rem;                        /* 20px - H4 */
--text-lg: 1.125rem;                       /* 18px - H5 */

/* Corps */
--text-base: 1rem;                         /* 16px - Body */
--text-sm: 0.875rem;                       /* 14px - Captions */
--text-xs: 0.75rem;                        /* 12px - Labels, tags */
```

**Poids (weights)** :
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;  /* Interface, boutons */
--font-semibold: 600; /* Titres secondaires */
--font-bold: 700;    /* Titres principaux */
```

**Line height** :
```css
--leading-tight: 1.2;   /* Titres */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.75; /* Textes longs, lecture */
```

---

## Espacements (Apple-inspired scale)

**Système 4px base** :
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Usage** :
- Padding composants : `space-4` à `space-6`
- Marges sections : `space-12` à `space-20`
- Espaces hero : `space-16` à `space-24`

---

## Border radius

```css
--radius-sm: 0.375rem;   /* 6px - Badges, tags */
--radius-md: 0.5rem;     /* 8px - Boutons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Modals, large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Cercles, pills */
```

**Apple touch** : Préférer `radius-xl` (16px) pour cards principales

---

## Ombres (élévations)

**Light mode** :
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

**Dark mode** :
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
             0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5),
             0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6),
             0 10px 10px -5px rgba(0, 0, 0, 0.5);
```

**Usage** :
- Cards statiques : `shadow-sm`
- Cards hover : `shadow-md`
- Modals, dropdowns : `shadow-lg`
- Popovers, tooltips : `shadow-xl`

---

## Animations & Transitions

**Timing functions (Apple easing)** :
```css
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);     /* Smooth standard */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);        /* Entrées */
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);           /* Sorties */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bounce subtil */
```

**Durées** :
```css
--duration-fast: 150ms;    /* Hovers, petits changements */
--duration-normal: 250ms;  /* Transitions standard */
--duration-slow: 350ms;    /* Animations complexes */
--duration-slower: 500ms;  /* Modals, overlays */
```

**Micro-interactions** :
- Hover bouton : `scale(1.02)` + `shadow-md`
- Active bouton : `scale(0.98)`
- Card hover : `translateY(-2px)` + `shadow-lg`
- Modal entrée : `scale(0.95)` → `scale(1)` + `opacity 0 → 1`

---

## Composants UI clés

### Header (transparent avec backdrop blur)

```tsx
<header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <nav className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Logo className="h-8 w-8" />
        <span className="font-semibold text-lg">Petit Ilot</span>
      </Link>

      {/* Navigation desktop */}
      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/ressources">Ressources</NavLink>
        <NavLink href="/createurs">Créateurs</NavLink>
        <NavLink href="/livres">Livres</NavLink>
        <NavLink href="/jeux">Jeux</NavLink>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button variant="ghost" size="sm" href="/acheter-credits">
          <CreditCard className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{credits} crédits</span>
        </Button>
        <UserMenu />
        <MobileMenuButton />
      </div>
    </nav>
  </div>
</header>
```

**Styles glassmorphism** :
```css
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.bg-white\/80 {
  background-color: rgba(255, 255, 255, 0.8);
}

.dark .bg-black\/80 {
  background-color: rgba(10, 10, 10, 0.8);
}

main {
  padding-top: 4rem; /* Compense hauteur header fixe */
}
```

### Footer (transparent)

```tsx
<footer className="backdrop-blur-xl bg-white/60 dark:bg-black/60 border-t border-border mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* 4 colonnes : À propos, Ressources, Légal, Social */}
    </div>
    <div className="mt-8 pt-8 border-t border-border text-center text-sm text-tertiary">
      <p>© 2025 Petit Ilot. Fait avec nature à Montréal.</p>
    </div>
  </div>
</footer>
```

### Menu mobile (slide-in)

```tsx
<Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <DialogContent className="fixed inset-0 z-50 backdrop-blur-2xl bg-white/90 dark:bg-black/90">
    {/* Header + Navigation + Footer menu */}
  </DialogContent>
</Dialog>
```

**Animation** :
```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Modals / Popovers (glassmorphism)

```tsx
<Dialog>
  {/* Overlay transparent */}
  <DialogOverlay className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20 dark:bg-black/40" />

  {/* Content */}
  <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                            w-full max-w-lg backdrop-blur-2xl bg-white/95 dark:bg-black/95
                            rounded-2xl shadow-2xl border border-border p-6">
    {children}
  </DialogContent>
</Dialog>
```

### Toggle Dark Mode

```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-10 h-10 rounded-full
                 bg-surface hover:bg-surface-elevated transition-colors"
      aria-label="Changer le thème"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </button>
  );
}
```

### Boutons (variants Apple-inspired)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-dark active:scale-98 shadow-sm hover:shadow-md",
        secondary: "bg-surface text-primary hover:bg-surface-elevated active:scale-98",
        outline: "border border-border bg-transparent hover:bg-surface active:scale-98",
        ghost: "bg-transparent hover:bg-surface active:scale-98",
        destructive: "bg-error text-white hover:bg-error/90 active:scale-98",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

### Cards (variations)

**Card standard** :
```tsx
<div className="group relative bg-surface rounded-xl p-6 border border-border
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  {children}
</div>
```

**Card glassmorphism** :
```tsx
<div className="backdrop-blur-xl bg-white/60 dark:bg-black/60 rounded-2xl p-8
                border border-border/50 shadow-xl">
  {children}
</div>
```

**Card avec image** :
```tsx
<div className="group overflow-hidden rounded-xl bg-surface border border-border
                hover:shadow-xl transition-all duration-300">
  <div className="aspect-video overflow-hidden">
    <Image
      src={image}
      alt={title}
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
    />
  </div>
  <div className="p-4">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-secondary mt-2">{description}</p>
  </div>
</div>
```

---

## Responsive breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm - Small tablets */ }
@media (min-width: 768px)  { /* md - Tablets */ }
@media (min-width: 1024px) { /* lg - Laptops */ }
@media (min-width: 1280px) { /* xl - Desktops */ }
@media (min-width: 1536px) { /* 2xl - Large screens */ }
```

**Conteneur max-width** :
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenu centré avec padding responsive */}
</div>
```

---

## Accessibilité (WCAG AA)

**Contraste couleurs** :
- Texte principal : ratio 4.5:1 minimum
- Texte large (18px+) : ratio 3:1 minimum
- Éléments interactifs : indicateurs focus visibles

**Navigation clavier** :
- Tous éléments interactifs : `tabindex` approprié
- Focus visible : `focus-visible:ring-2 ring-accent`
- Skip links : "Aller au contenu principal"

**Screen readers** :
- Tous liens/boutons : labels descriptifs
- Images : `alt` pertinents (jamais vides sauf décoratif)
- Form inputs : `<label>` associés
- ARIA labels : `aria-label`, `aria-describedby` si contexte manque

---

## Setup next-themes

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## CSS variables globals.css

```css
:root {
  /* Light mode variables */
  --background: #FFFFFF;
  --text-primary: #1A1A1A;
  --accent: #8FA98C; /* Sauge */
  /* ... autres variables light */
}

.dark {
  /* Dark mode variables */
  --background: #0A0A0A;
  --text-primary: #FAFAFA;
  --accent: #B39DDB; /* Mauve */
  /* ... autres variables dark */
}

@layer base {
  body {
    @apply bg-background text-text-primary transition-colors duration-300;
  }
}
```

---

## Gemstone Button System (Frozen Glass)

Style visuel « verre givré teinté » appliqué à tous les filtres et tags actifs.
Implémentation : `components/filters/gemFilterStyle.ts` (helpers `gemPillStyle`, `gemSegmentStyle`).
Palette définie dans `components/ui/button.tsx` → export `GEMS`.

### Palette GEMS (light / dark / text / glow)

| Gem | Light | Dark | Text (light) | Text (dark) | Glow RGB | Usage |
|-----|-------|------|-------------|-------------|----------|-------|
| `sage` | `#7A8B6F` | `#8FA98C` | `#4A5D3E` | `#C8E6C0` | `110,139,100` | Nature, défaut, autonomie |
| `mauve` | `#A892CB` | `#B39DDB` | `#6B4F8A` | `#DCC8F0` | `168,146,203` | Prix, PDF, gratuit/payant |
| `terracotta` | `#C4836A` | `#D4A088` | `#7A3E28` | `#F0C8B8` | `196,131,106` | Cuisine, temps de prépa |
| `rose` | `#D4A0A0` | `#E8B4B8` | `#8B4A50` | `#F8D0D4` | `212,160,160` | Sensoriel, intensité, compétences |
| `sky` | `#7BA7C4` | `#90B8D4` | `#3A6B8C` | `#C0DCF0` | `123,167,196` | Motricité, durée, thèmes, imprimables |
| `amber` | `#D4B870` | `#E0C880` | `#7A6420` | `#F0E0A8` | `212,184,112` | DIY, difficulté, matériaux |
| `neutral` | `#8A8A8A` | `#A0A0A0` | `#4A4A4A` | `#D0D0D0` | `138,138,138` | Toutes, âge, rituels, créateur |
| `destructive` | `#D46A6A` | `#E88080` | `#8B2020` | `#FFC0C0` | `212,106,106` | Suppression, tout effacer |

### Attribution des couleurs par filtre

| Filtre | Gem | Contexte |
|--------|-----|----------|
| **Catégories** | Chaque catégorie a sa propre gem (voir `lib/constants/filters.ts` → champ `gem`) | Pills + tags actifs |
| Sensoriel | `rose` | Catégorie |
| Motricité fine | `mauve` | Catégorie |
| Motricité globale | `sky` | Catégorie |
| Arts plastiques | `terracotta` | Catégorie |
| Nature & plein air | `sage` | Catégorie |
| DIY & récup | `amber` | Catégorie |
| Cuisine | `terracotta` | Catégorie |
| Jeux symboliques | `mauve` | Catégorie |
| Rituels & routines | `neutral` | Catégorie |
| Imprimables | `sky` | Catégorie |
| **Bouton "Toutes"** | `neutral` | Pill catégorie (état actif quand aucune catégorie) |
| **Thèmes** | `sky` | TagFilter + tags actifs |
| **Compétences** | `rose` | TagFilter + tags actifs |
| **Matériaux** | `amber` | TagFilter + tags actifs |
| **Mode matériel** | `sage` | Segmenté (Contient / J'ai ce matériel) + tag actif |
| **Âge** | `neutral` | Presets pill + tag actif |
| **Durée** | `sky` | Presets pill + tag actif |
| **Temps de prépa** | `terracotta` | Presets pill + tag actif |
| **Difficulté** | `amber` | Segmenté 3 options + tag actif |
| **Intensité** | `rose` | Segmenté 3 options + tag actif |
| **Autonomie** | `sage` | Segmenté 3 options + tag actif |
| **Gratuit / Payant** | `mauve` | Segmenté + tag actif |
| **Prix (range)** | `mauve` | Inputs + tag actif |
| **PDF téléchargeable** | `mauve` | Pill + tag actif |
| **Créateur** | `neutral` | Tag actif |

### Ajout d'un nouveau filtre

1. Choisir une gem dans la palette ci-dessus (rester cohérent avec les groupes existants)
2. Créer le composant avec `gemPillStyle(gem, isSelected, isDark)` ou `gemSegmentStyle(gem, isSelected, isDark)`
3. Dans `ActiveFilters.tsx`, ajouter le badge avec `gem: 'chosen_gem'`
4. Si c'est un TagFilter, passer `gem="chosen_gem"` en prop

### Helpers disponibles

```typescript
import { gemPillStyle, gemSegmentStyle } from '@/components/filters/gemFilterStyle'

// Bouton pill (arrondi, tags, presets)
const s = gemPillStyle('sky', isSelected, isDark)
// → { wrapper, inner, frost, shine } — styles inline

// Bouton segmenté (toggle 2-3 options)
const s = gemSegmentStyle('amber', isSelected, isDark)
// → style plat { color, background, boxShadow }
```

---

## Checklist implémentation

**Phase 1 (immédiat)** :
- [ ] Définir CSS variables (light + dark) dans `globals.css`
- [ ] Configurer Tailwind avec tokens custom
- [ ] Setup `next-themes` pour dark mode
- [ ] Créer composants base : Button, Card, Input, Select
- [ ] Header transparent avec backdrop blur
- [ ] Footer transparent
- [ ] Mobile menu slide-in

**Phase 2 (sprint 2-3)** :
- [ ] Modal/Dialog glassmorphism
- [ ] Toasts/Notifications
- [ ] Badges, Tags
- [ ] Skeleton loaders
- [ ] Empty states
- [ ] Error states

**Phase 3 (polish)** :
- [ ] Micro-animations (framer-motion)
- [ ] Page transitions
- [ ] Loading spinners custom
- [ ] Illustrations SVG custom (optionnel)

---

_Dernière mise à jour : Janvier 2025_
