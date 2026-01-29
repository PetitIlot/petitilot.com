# Palette de Couleurs - Petit Ilot

## Mode Clair (Light Mode)

### Backgrounds
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--background` | `#FAFAF8` | Fond de page principal |
| `--surface` | `#FFFFFF` | Cartes, modales, surfaces élevées |
| `--surface-secondary` | `#F5F5F7` | Surfaces secondaires, inputs |

### Textes (Foreground)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--foreground` | `#1D1D1F` | Texte principal, titres |
| `--foreground-secondary` | `#86868B` | Texte secondaire, labels |

### Couleurs de Marque
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--sage` | `#7A8B6F` | Couleur principale (boutons, accents) |
| `--sage-light` | `#A8B5A0` | Variante claire sauge |
| `--terracotta` | `#C9A092` | Couleur secondaire |
| `--terracotta-light` | `#D4A59A` | Variante claire terracotta |
| `--sky` | `#5AC8FA` | Bleu accent |
| `--sky-light` | `#C8D8E4` | Variante claire bleu |

### Bordures
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--border` | `rgba(0, 0, 0, 0.08)` | Bordures subtiles |
| `--border-strong` | `rgba(0, 0, 0, 0.12)` | Bordures plus visibles |

### Glass (Effet verre)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--glass-bg` | `rgba(255, 255, 255, 0.72)` | Fond glass morphism |
| `--glass-border` | `rgba(255, 255, 255, 0.5)` | Bordure glass |

### Icônes (Pastel)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--icon-sage` | `#A8B5A0` | Icônes sauge (succès, nature) |
| `--icon-sky` | `#C8D8E4` | Icônes bleu (info, ressources) |
| `--icon-terracotta` | `#D4A59A` | Icônes terracotta (alertes, créateurs) |
| `--icon-neutral` | `#86868B` | Icônes neutres |

---

## Mode Sombre (Dark Mode)

### Backgrounds
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--background` | `#1E1E1E` | Fond de page principal (gris anthracite) |
| `--surface` | `#2D2D2D` | Cartes, modales, surfaces élevées |
| `--surface-secondary` | `#3D3D3D` | Surfaces secondaires, inputs |

### Textes (Foreground)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--foreground` | `#F5F5F7` | Texte principal, titres |
| `--foreground-secondary` | `#A1A1A6` | Texte secondaire, labels |

### Couleurs de Marque (ajustées)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--sage` | `#8FA382` | Couleur principale (plus claire pour contraste) |
| `--sage-light` | `#A8B5A0` | Variante claire sauge |
| `--terracotta` | `#D4ADA0` | Couleur secondaire (ajustée) |
| `--terracotta-light` | `#E5BEB1` | Variante claire terracotta |

### Bordures
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--border` | `rgba(255, 255, 255, 0.08)` | Bordures subtiles |
| `--border-strong` | `rgba(255, 255, 255, 0.12)` | Bordures plus visibles |

### Glass (Effet verre)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--glass-bg` | `rgba(28, 28, 30, 0.72)` | Fond glass morphism |
| `--glass-border` | `rgba(255, 255, 255, 0.1)` | Bordure glass |

### Icônes (Néon)
| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `--icon-sage` | `#7FFF7F` | Icônes sauge (vert néon) |
| `--icon-sky` | `#5AC8FA` | Icônes bleu (bleu vif) |
| `--icon-terracotta` | `#FF8A80` | Icônes terracotta (rouge/orange néon) |
| `--icon-neutral` | `#A1A1A6` | Icônes neutres |

---

## Classes Tailwind Correspondantes

### Backgrounds
```css
bg-background dark:bg-background-dark
bg-surface dark:bg-surface-dark
bg-surface-secondary dark:bg-surface-dark
```

### Textes
```css
text-foreground dark:text-foreground-dark
text-foreground-secondary dark:text-foreground-dark-secondary
```

### Couleurs de marque
```css
bg-sage hover:bg-sage-light
bg-terracotta hover:bg-terracotta/90
text-sage
text-terracotta
```

### Bordures (via style inline)
```css
style={{ border: '1px solid var(--border)' }}
style={{ borderTop: '1px solid var(--border)' }}
```

### Icônes (via style inline)
```css
style={{ color: 'var(--icon-sage)' }}
style={{ color: 'var(--icon-sky)' }}
style={{ color: 'var(--icon-terracotta)' }}
style={{ color: 'var(--icon-neutral)' }}
```

---

## Aperçu Visuel

### Mode Clair
```
┌─────────────────────────────────────┐
│ Background: #FAFAF8                 │
│ ┌─────────────────────────────────┐ │
│ │ Surface: #FFFFFF                │ │
│ │ Titre: #1D1D1F                  │ │
│ │ Texte: #86868B                  │ │
│ │ Icône Sage: #A8B5A0 (pastel)    │ │
│ │ Icône Sky: #C8D8E4 (pastel)     │ │
│ │ Icône Terra: #D4A59A (pastel)   │ │
│ │ Bordure: rgba(0,0,0,0.08)       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Mode Sombre
```
┌─────────────────────────────────────┐
│ Background: #1E1E1E                 │
│ ┌─────────────────────────────────┐ │
│ │ Surface: #2D2D2D                │ │
│ │ Titre: #F5F5F7                  │ │
│ │ Texte: #A1A1A6                  │ │
│ │ Icône Sage: #7FFF7F (néon)      │ │
│ │ Icône Sky: #5AC8FA (néon)       │ │
│ │ Icône Terra: #FF8A80 (néon)     │ │
│ │ Bordure: rgba(255,255,255,0.08) │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Toasts & Alertes

### Succès
```css
/* Light */
bg-green-50 border-green-200 text-green-700

/* Dark */
bg-green-900/30 border-green-700 text-green-300
```

### Erreur
```css
/* Light */
bg-red-50 border-red-200 text-red-700

/* Dark */
bg-red-900/30 border-red-700 text-red-300
```

### Warning
```css
/* Light */
bg-yellow-50 border-yellow-200 text-yellow-700

/* Dark */
bg-yellow-900/30 border-yellow-700 text-yellow-300
```

---

_Dernière mise à jour : Janvier 2025_
