# CLAUDE.md - Guide Petit Ilot

## Projet

**Petit Ilot** : Marketplace de ressources éducatives 0-6 ans (nature, DIY, sans écran).
MVP multi-créateurs, commission 90/10, système de crédits.

**Stack** : Next.js 15 (App Router) · TypeScript · Tailwind · Supabase · Stripe · Vercel

**Design** : Apple-inspired, sobre, dark/light mode (Sauge #7A8B6F / Mauve)

---

## Workflow

```
PLANIFIER → DÉVELOPPER (npm run dev) → TESTER (localhost:3000) → DOCUMENTER (PROGRESS.md) → DÉPLOYER (git push) → VALIDER (prod)
```

**Commits** : `feat:` `fix:` `ui:` `refactor:` `docs:` `chore:`

**Mode maintenance** : `middleware.ts` → `MAINTENANCE_MODE = true` → redirige vers `/coming-soon`
- Code secret dans `NEXT_PUBLIC_SITE_ACCESS_CODE` (Vercel env vars)

---

## Principes de code

1. **Simple > Clever** : Fonctions courtes, nommage explicite, KISS > DRY
2. **Pas d'over-engineering** : Pas de classes/patterns inutiles, dépendances légères
3. **Claude = Mentor** : Expliquer le POURQUOI, pas juste le comment

---

## Conventions

**Naming** : Composants `PascalCase` · Fonctions `camelCase` · Constantes `UPPER_SNAKE`

**Structure** :
```
/app/[lang]/...     Pages (i18n fr/en/es)
/app/api/...        Routes API
/components/        UI, cards, forms
/lib/               Supabase, Stripe, utils, hooks
```

**Erreurs** : API = try/catch + Zod · Server = notFound() · Client = états error/loading

---

## Commandes

```bash
npm run dev              # Dev local
npm run build            # Build prod
npx tsc --noEmit         # Type check
git push origin main     # Déploie sur Vercel
```

---

## Services

| Service | Dashboard |
|---------|-----------|
| Supabase | supabase.com/dashboard |
| Vercel | vercel.com |
| Stripe | dashboard.stripe.com |
| GitHub | github.com |

---

## Documentation

- `PROGRESS.md` - Journal de dev (mettre à jour après chaque session)
- `docs/ARCHITECTURE.md` - Schéma BDD, RLS
- `docs/DESIGN_SYSTEM.md` - Charte graphique
- `docs/FEATURES_SPECS.md` - Specs fonctionnelles

---

_Màj : 29 janvier 2025_
