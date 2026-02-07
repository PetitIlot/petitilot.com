# Journal de Développement Petit Ilot

> Dernière mise à jour : 30 janvier 2025 - Phase 4 Crédits v2 complétée

---

## ROADMAP (Janvier 2025+)

### Phase 1 : Stabilisation & Nettoyage ✅ COMPLÉTÉ

| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 1.1 | Fix redirection OAuth Google | ✅ OK | Gestion erreurs callback + affichage page connexion |
| 1.2 | Page Profil : masquer jeux/livres | ✅ OK | Commenté comme Header/Footer |
| 1.3 | Page Profil : centre de notifications | ✅ OK | Card alertes → lien /profil/alertes |
| 1.4 | Page Profil : bouton créateur conditionnel | ✅ OK | Approuvé/En attente/Devenir créateur |
| 1.5 | Fix sauvegarde filtres/alertes | ✅ OK | Auth check + buildFilterUrl 18 filtres + AgeSlider multi-sélection |
| 1.6 | Refonte page "À propos" | ✅ OK | Hero, mission, valeurs, équipe, CTAs terracotta/mauve |

### Phase 2 : Nouvelles Fiches Activités

| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 2.1 | Template fiche "Recette" | ⬜ TODO | Champs spécifiques cuisine |
| 2.2 | Template fiche "Sport/Motricité" | ⬜ TODO | Intensité, espace requis |
| 2.3 | Autres catégories selon besoins | ⬜ TODO | Art, DIY, Éveil... |

### Phase 3 : Refonte Wizard Créateur

| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 3.1 | Pré-étape : choix type de fiche | ⬜ TODO | Conditionne les champs suivants |
| 3.2 | Upload PDF via Dropbox → Supabase Storage | ⬜ TODO | Meilleur paywall, maintenance liens |
| 3.3 | Preview fiche complète avant validation | ⬜ TODO | Voir rendu final |

### Phase 4 : Système Crédits v2 ✅ COMPLÉTÉ

| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 4.1 | Crédits gratuits vs payants | ✅ OK | Double balance (free/paid) |
| 4.2 | Valeur dynamique des crédits | ✅ OK | unit_value_cents dans credit_units |
| 4.3 | Calcul reversement créateur | ✅ OK | 90% valeur EUR (FIFO) |
| 4.4 | Admin codes promo | ✅ OK | CRUD complet + rédemption |
| 4.5 | Admin grant crédits | ✅ OK | Attribution manuelle free/paid |
| 4.6 | Bonus inscription | ✅ OK | 5 crédits gratuits (configurable) |
| 4.7 | Bonus achat | ✅ OK | Configurable par pack |
| 4.8 | Mise à jour wizard | ⬜ TODO | Option créateur accept/reject crédits gratuits |

### Phase 5 : Console Admin

| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 5.1 | Approuver/rejeter demandes créateur | ⬜ TODO | Workflow validation |
| 5.2 | Approuver/rejeter/modifier fiches | ⬜ TODO | Modération contenu |
| 5.3 | Dashboard stats | ⬜ TODO | KPIs, graphiques |
| 5.4 | Admin codes promo/grant crédits/Bonus inscription/Bonus achat

---

## État Actuel

Site en mode "Coming Soon" sur petitilot.com. Code secret dans env var `NEXT_PUBLIC_SITE_ACCESS_CODE`.
Sprints 1-3 complétés. Phase 4 Crédits v2 complétée. Migrations SQL prêtes à exécuter.

### Dernière Session - Phase 4 Crédits v2
- **Date** : 30 janvier 2025
- **Objectif** : Implémenter le système de crédits à deux types (gratuits/payants) avec outils admin
- **Complété** :

**Architecture Base de Données** :
- Table `profiles` : ajout `free_credits_balance`, `paid_credits_balance`
- Trigger `update_total_credits_balance` : maintient rétrocompatibilité `credits_balance = free + paid`
- Table `credit_units` : tracking valeur unitaire (unit_value_cents, source, acquired_at)
- Table `promo_codes` : codes promo avec max_uses, allow_multiple_per_user, expiration
- Table `promo_code_redemptions` : historique utilisation codes
- Table `purchase_bonuses` : config bonus gratuits par pack Stripe
- Table `app_config` : config bonus inscription (enabled, free_credits)
- Extension `credits_transactions` : credit_type, unit_value_cents, promo_code_id
- Extension `purchases` : free_credits_used, paid_credits_used, total_eur_value_cents

**Fonctions RPC PostgreSQL** :
- `purchase_ressource_v2(user_id, ressource_id)` : achat avec FIFO (gratuits d'abord, puis payants par date)
- `apply_promo_code(user_id, code)` : rédemption code promo avec validations
- `admin_grant_credits(target_user_id, credit_type, amount, reason, admin_user_id)` : attribution manuelle
- `grant_registration_bonus(user_id)` : bonus inscription (appelé via trigger + auth callback)
- `add_stripe_credits(user_id, pack_id, credits, price_cents)` : webhook Stripe avec bonus auto
- `get_credit_breakdown(user_id)` : retourne free_credits, paid_credits, total, recent_transactions

**APIs créées** :
- `POST /api/credits/redeem-promo` : applique un code promo
- `GET /api/credits/balance` : retourne breakdown complet des crédits
- `GET/POST /api/admin/promo-codes` : liste et création codes promo
- `PATCH/DELETE /api/admin/promo-codes/[id]` : modification/suppression
- `POST /api/admin/credits/grant` : attribution manuelle crédits
- `GET/PATCH /api/admin/config` : config app (registration_bonus)
- `GET/PATCH /api/admin/config/purchase-bonuses` : config bonus par pack

**Modifications APIs existantes** :
- Webhook Stripe : utilise `add_stripe_credits` RPC, gère bonus achat automatique
- Auth callback : appelle `grant_registration_bonus` pour nouveaux users OAuth

**Pages Admin créées** :
- `/admin/credits` : hub avec stats (codes actifs, redemptions, crédits distribués)
- `/admin/credits/promo-codes` : CRUD codes promo (tableau, modal création, toggle actif, suppression)
- `/admin/credits/grant` : recherche user par email, affiche balances, form attribution free/paid
- `/admin/credits/settings` : toggle/montant bonus inscription + bonus par pack Stripe

**Frontend utilisateur** :
- Page `/profil/credits` refonte : double balance (cards vert/or), formulaire code promo, historique enrichi avec badges type crédit
- `PurchaseButton` : affiche répartition FIFO avant achat ("3 gratuits + 2 payants")

**Logique FIFO** :
1. Les crédits gratuits sont dépensés en premier
2. Les crédits payants sont consommés par date d'acquisition (FIFO)
3. La valeur EUR pour le créateur = somme des unit_value_cents des crédits payants consommés
4. Crédits gratuits = 0€ pour le créateur

**Décisions clés** :
- Bonus inscription : 5 crédits gratuits (configurable via admin)
- Rémunération créateur sur crédits gratuits : 0€
- Codes promo : option `allow_multiple_per_user` configurable à la création
- Backward compatibility : `credits_balance` maintenu via trigger

**Fichiers créés** :
- `supabase/migrations/010_credits_v2_schema.sql` - Schéma tables et triggers
- `supabase/migrations/011_credits_v2_functions.sql` - Fonctions RPC
- `supabase/migrations/012_registration_bonus_trigger.sql` - Trigger bonus inscription
- `app/api/credits/redeem-promo/route.ts`
- `app/api/credits/balance/route.ts`
- `app/api/admin/promo-codes/route.ts`
- `app/api/admin/promo-codes/[id]/route.ts`
- `app/api/admin/credits/grant/route.ts`
- `app/api/admin/config/route.ts`
- `app/api/admin/config/purchase-bonuses/route.ts`
- `app/[lang]/admin/credits/page.tsx`
- `app/[lang]/admin/credits/promo-codes/page.tsx`
- `app/[lang]/admin/credits/grant/page.tsx`
- `app/[lang]/admin/credits/settings/page.tsx`

**Fichiers modifiés** :
- `lib/types.ts` - Types CreditType, PromoCode, PurchaseBonus, CreditBreakdown, etc.
- `app/api/webhooks/stripe/route.ts` - Utilise add_stripe_credits RPC
- `app/auth/callback/route.ts` - Appelle grant_registration_bonus
- `app/[lang]/profil/credits/page.tsx` - Refonte complète double balance
- `components/PurchaseButton.tsx` - Affichage répartition FIFO

**Prochaines étapes** :
1. Exécuter les 3 migrations SQL dans Supabase
2. Tester le flow complet (Stripe test → bonus → achat ressource → répartition)
3. Phase 4.8 : Option wizard créateur pour accepter/rejeter crédits gratuits

---

### Session Précédente - Phase 1 Stabilisation
- **Date** : 30 janvier 2025
- **Objectif** : Stabiliser le site avant Sprint 4 (Stripe)
- **Complété** :

**1.1 Fix OAuth Google** :
- Gestion erreur callback si utilisateur refuse ou erreur session
- Redirection vers `/connexion?error=oauth_cancelled` ou `session_failed`
- Affichage message d'erreur traduit FR/EN/ES sur page connexion

**1.2 Masquer Jeux/Livres dans Profil** :
- Stats cards commentées
- Onglets commentés (reste Activités + Newsletter)
- Pattern `{/* MASQUÉ TEMPORAIREMENT */}` cohérent

**1.3 Centre notifications** :
- Card "Alertes & Notifications" avec icône Bell
- Lien vers `/profil/alertes`
- Traductions FR/EN/ES

**1.4 Bouton créateur conditionnel** :
- Query `is_approved` depuis table `creators`
- 3 états : "Gérer mes ressources" (approuvé) / "En attente d'approbation" / "Devenir créateur"

**1.5 Fix sauvegarde filtres/alertes** :
- `buildFilterUrl()` complété avec les 18 filtres
- Vérification auth avant ouverture modal (redirect si non connecté)
- Props `isLoggedIn` et `onLoginRequired` passées au FilterPanel
- `AgeSlider` refait : sélection multiple de tranches adjacentes (range)
- Inline styles pour garantir les couleurs des tags

**1.6 Refonte page "À propos"** :
- Hero avec gradient + stats
- Section mission avec image
- 4 cards valeurs (Nature, Authenticité, Moins mais mieux, Sans écran)
- Section équipe + créateurs
- CTA contact avec gradient terracotta
- Animations Framer Motion (whileInView)

**Bonus - Page Contact** :
- Fix CTAs blanc sur blanc → inline styles
- Icône créateur terracotta, icône partenaire mauve
- Bouton "Envoyer" avec fond sage

**Fichiers modifiés** :
- `app/auth/callback/route.ts` - Gestion erreurs OAuth
- `app/[lang]/connexion/page.tsx` - Affichage erreurs
- `app/[lang]/profil/page.tsx` - Masquage jeux/livres, card alertes, bouton créateur
- `app/[lang]/profil/alertes/page.tsx` - buildFilterUrl complète
- `app/[lang]/activites/page.tsx` - Auth check + props FilterPanel
- `app/[lang]/a-propos/page.tsx` - Refonte complète
- `app/[lang]/contact/page.tsx` - Fix couleurs CTAs
- `components/filters/AgeSlider.tsx` - Multi-sélection + inline styles
- `components/ui/button.tsx` - Fix outline variant light mode

**Commit** : `e40c8b9` - feat: Phase 1 stabilisation - OAuth, profil, filtres, UI

- **Prochaine priorité** : Tests prod, puis Sprint 4 - Intégration Stripe

---

### Session Précédente - Page Coming Soon + Déploiement Vercel
- **Date** : 29 janvier 2025
- **Objectif** : Créer une page d'accueil temporaire professionnelle et déployer sur Vercel
- **Complété** :
  - **Page Coming Soon** : Design Apple-inspired avec gradient animé, glassmorphism, dark mode
  - **Contenu** : Badge "Bientôt disponible", hero avec highlight "nature", formulaire email, 6 catégories (Motricité fine, Recettes, DIY, Art & Créativité, Éveil cognitif, Musique)
  - **Liens sociaux** : Instagram/Facebook @petitilot, contact@petitilot.ca
  - **Mode maintenance** : Middleware redirige `/` vers `/coming-soon`
  - **Code secret** : Variable `NEXT_PUBLIC_SITE_ACCESS_CODE` pour accéder au site complet (cookie `site_access=granted`)
  - **Déploiement Vercel** : Site live sur petitilot.vercel.app
  - **DNS configuré** : petitilot.com pointe vers Vercel (A record 76.76.21.21, CNAME www → cname.vercel-dns.com)
  - **Traductions FR/EN/ES** : Sélecteur de langue dans le header, localStorage pour persistence
  - **Animations CSS** : Blob gradient animé (keyframes dans globals.css)

**Fichiers créés** :
- `app/coming-soon/page.tsx` - Page temporaire complète avec traductions

**Fichiers modifiés** :
- `middleware.ts` - Ajout mode maintenance (`MAINTENANCE_MODE = true`)
- `app/globals.css` - Ajout animation blob

**Configuration Vercel** :
- Variables d'environnement ajoutées via dashboard
- Domaine petitilot.com configuré avec SSL automatique

**Corrections TypeScript pour build** :
- Interface `RessourceWithCreator` - suppression propriété dupliquée
- API Stripe - version mise à jour vers '2025-12-15.clover'
- Ajout `@types/react-dom`
- Wrapping Suspense pour `useSearchParams` dans plusieurs pages
- Fix typing framer-motion pour `ease`

**URLs de production** :
- https://petitilot.com
- https://www.petitilot.com
- https://petitilot.vercel.app

- **Prochaine priorité** : Tests de production, puis continuer Sprint 4 - Intégration Stripe

---

### Session Précédente - Système d'Alertes et Notifications
- **Date** : 27 janvier 2025
- **Objectif** : Permettre aux utilisateurs de sauvegarder des recherches et recevoir des notifications
- **Complété** :
  - **Tables Supabase** : `follows`, `saved_searches`, `notifications` avec RLS
  - **Triggers PostgreSQL** : Notification auto quand créateur suivi publie + webhook pg_net pour matching alertes
  - **Types TypeScript** : `Follow`, `SavedSearch`, `Notification`, `NotificationType`
  - **API Routes** : CRUD complet pour `/api/notifications/*` et `/api/alerts/*`
  - **Webhook** : `/api/webhooks/check-alerts` pour matching temps réel ressource→alertes
  - **Hook useNotifications** : Polling compteur, mark read, delete
  - **Composants** : `NotificationBell` (dropdown Header), `NotificationItem`, `SaveSearchButton`, `SaveSearchModal`
  - **Page /profil/alertes** : Gestion centralisée alertes + créateurs suivis + notifications

**Architecture notifications** :
| Type | Déclencheur | Mécanisme |
|------|-------------|-----------|
| Créateur suivi publie | INSERT ressource | Trigger SQL direct |
| Ressource correspond à alerte | INSERT ressource | Trigger → pg_net → API webhook → matching TypeScript |

**Fichiers créés** :
- `lib/types.ts` - Types Follow, SavedSearch, Notification
- `lib/hooks/useNotifications.ts` - Hook client notifications
- `app/api/notifications/route.ts` - GET liste
- `app/api/notifications/[id]/route.ts` - PATCH/DELETE
- `app/api/notifications/unread-count/route.ts` - GET compteur
- `app/api/notifications/mark-all-read/route.ts` - POST
- `app/api/alerts/route.ts` - GET/POST
- `app/api/alerts/[id]/route.ts` - PATCH/DELETE
- `app/api/webhooks/check-alerts/route.ts` - POST (temps réel)
- `components/notifications/NotificationBell.tsx` - Cloche Header
- `components/notifications/NotificationItem.tsx` - Item notification
- `components/filters/SaveSearchButton.tsx` - Bouton sauvegarder
- `components/filters/SaveSearchModal.tsx` - Modal création alerte
- `app/[lang]/profil/alertes/page.tsx` - Page gestion

**Fichiers modifiés** :
- `components/Header.tsx` - Ajout NotificationBell
- `components/filters/FilterPanel.tsx` - Ajout SaveSearchButton

**Variables d'environnement ajoutées** :
- `WEBHOOK_SECRET` - Secret pour sécuriser le webhook

- **Prochaine priorité** : Tests visuels, puis Sprint 4 - Intégration Stripe

---

### Session Précédente - Système de Filtrage Avancé
- **Date** : 27 janvier 2025
- **Objectif** : Créer un système de tri/recherche ultra puissant avec UI discrète et rétractable
- **Complété** :
  - **Architecture hybride** : Filtres serveur (avec index BDD) + filtres client (arrays sans index)
  - **Constants centralisées** : `lib/constants/filters.ts` avec 10 catégories, 35 thèmes, 27 compétences, 90+ matériaux
  - **Hook useFilters** : État complet, URL sync bidirectionnelle, séparation server/client filters
  - **Hook useFilteredResources** : Filtrage client-side en mémoire (themes, competences, materials)
  - **Query Supabase** : `getFilteredRessources()` avec filtres serveur optimisés
  - **Composants UI** : 11 composants de filtres modulaires
  - **FilterPanel** : Sheet rétractable avec sections pliables
  - **ActiveFilters** : Badges cliquables avec suppression individuelle
  - **Page activités** : Refonte complète avec intégration filtres

**Filtres implémentés** :
| Filtre | Côté | UI |
|--------|------|-----|
| Catégories | Serveur | Boutons multi-select |
| Âge | Serveur | Double slider + presets |
| Thèmes | Client | Tags autocomplete groupés |
| Compétences | Client | Tags autocomplete groupés |
| Matériel | Client | Tags + mode "J'ai ce matériel" |
| Durée | Serveur | Boutons presets |
| Préparation | Serveur | Boutons presets (Aucune/<5min/5-15min/15-30min) |
| Difficulté | Serveur | 3 boutons |
| Intensité | Client | 3 boutons (Léger/Modéré/Intense) |
| Autonomie | Serveur | Toggle 3 états |
| Gratuit/Payant | Serveur | Toggle |
| PDF téléchargeable | Serveur | Toggle |
| Prix min/max | Serveur | Range inputs |
| Tri | Serveur | Dropdown |

**Fichiers créés** :
- `lib/constants/filters.ts` - Constantes centralisées
- `lib/hooks/useFilters.ts` - Hook état + URL sync
- `lib/hooks/useFilteredResources.ts` - Filtrage client
- `components/filters/FilterSection.tsx` - Section pliable
- `components/filters/CategoryFilter.tsx` - Boutons catégories
- `components/filters/AgeSlider.tsx` - Double slider âge
- `components/filters/DurationFilter.tsx` - Presets durée
- `components/filters/DifficultyFilter.tsx` - Boutons difficulté
- `components/filters/IntensityFilter.tsx` - Boutons intensité (léger/modéré/intense)
- `components/filters/PrepTimeFilter.tsx` - Presets temps de préparation
- `components/filters/AutonomyToggle.tsx` - Toggle autonomie
- `components/filters/TagFilter.tsx` - Tags avec recherche
- `components/filters/MaterialFilter.tsx` - Matériel + mode match
- `components/filters/PriceFilter.tsx` - Filtres prix
- `components/filters/FilterPanel.tsx` - Panneau complet
- `components/filters/ActiveFilters.tsx` - Badges actifs
- `components/filters/index.ts` - Export centralisé

**Fichiers modifiés** :
- `lib/supabase-queries.ts` - Ajout `getFilteredRessources()`
- `app/[lang]/activites/page.tsx` - Refonte avec filtres

**Format URL** :
```
/fr/activites?cat=sensoriel,art&age_min=12&age_max=48&themes=Automne&diff=beginner&free=1&sort=popular
```

- **Prochaine priorité** : Tests visuels, puis Sprint 4 - Intégration Stripe

---

### Session Précédente - Refonte Apple-Proof
- **Date** : 21 janvier 2025
- **Objectif** : Transformer l'esthétique du site comme si Apple avait acquis Petit Ilot
- **Complété** :
  - **Design System** : Nouvelle palette (sage profond #7A8B6F, terracotta doux, fond blanc cassé #FAFAF8)
  - **Typographie** : Migration Quicksand/Lato → Inter (SF Pro-like)
  - **Tokens Tailwind** : Border-radius Apple (12/16/20px), shadows, spacing généreux
  - **Header** : Glass morphism, navigation épurée, scroll detection
  - **Footer** : Redesign minimaliste 3 colonnes
  - **Cards** : Ratio 16/10, borders subtiles, hover spring physics
  - **HeroSection** : Gradient lumineux, pills glass, animations séquentielles
  - **ResourcesSection** : Icônes dans carrés arrondis, espacement doublé
  - **Dark Mode** : Toggle fonctionnel, palette dark complète (true black)
  - **Animations** : Keyframes fadeIn, scaleIn, slideIn avec timing Apple

**Fichiers modifiés** :
- `tailwind.config.ts` - Palette, tokens, dark mode
- `app/globals.css` - Variables CSS, glass class, animations
- `app/layout.tsx` - Police Inter
- `components/Header.tsx` - Glass morphism + ThemeToggle
- `components/Footer.tsx` - Design Apple
- `components/ui/button.tsx` - Variants Apple
- `components/ui/badge.tsx` - Variants Apple
- `components/cards/*.tsx` - Nouvelle esthétique
- `components/home/*.tsx` - Espacement, couleurs
- `components/ThemeToggle.tsx` - Nouveau composant
- `app/[lang]/page.tsx` - Classes mises à jour

**Note** : Quelques erreurs TypeScript pré-existantes sur d'autres pages (admin, activites detail) - non bloquantes en dev.

- **Prochaine priorité** : Tests visuels, puis Sprint 4 - Intégration Stripe

---

## AUDIT COMPLET - 19 janvier 2025

### 1. Structure actuelle du projet

```
PI-site/
├── app/
│   ├── [lang]/                    # i18n routing (fr/en/es)
│   │   ├── page.tsx               # Homepage
│   │   ├── activites/             # Catalogue + détail activités
│   │   ├── livres/                # Catalogue + détail livres
│   │   ├── jeux/                  # Catalogue + détail jeux
│   │   ├── connexion/             # Login/signup
│   │   ├── profil/                # Espace utilisateur (favoris)
│   │   ├── a-propos/              # Page statique
│   │   └── contact/               # Page statique
│   ├── api/
│   │   └── instagram-thumbnail/   # 1 seule API route
│   └── auth/
│       └── callback/              # OAuth callback
├── components/
│   ├── ui/                        # Button, Badge, Input, Sheet
│   ├── cards/                     # ActivityCard, BookCard, GameCard
│   ├── home/                      # HeroSection, ActivitiesGrid
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts                # Client simple
│   ├── supabase-client.ts         # Client browser SSR
│   ├── supabase-server.ts         # Client server SSR
│   ├── supabase-queries.ts        # Requêtes ressources
│   ├── auth.ts                    # Gestion profil
│   ├── bookmarks.ts               # Favoris
│   ├── unlocks.ts                 # Déverrouillages (non implémenté)
│   ├── cloudinary.ts              # Helper images
│   └── types.ts                   # Types TS
└── middleware.ts                  # i18n redirect uniquement
```

### 2. Schéma BDD actuel vs cible

#### Tables EXISTANTES (dans Supabase)

| Table | Colonnes clés | Utilisation |
|-------|--------------|-------------|
| `ressources` | id, group_id, lang, type, title, description, age_min/max, themes[], competences[], difficulte, is_premium, materiel_json, images_urls, pdf_url | Catalogue unifié |
| `profiles` | id, email, lang, newsletter_subscribed, credits (existe mais non utilisé) | Utilisateurs |
| `bookmarks` | id, user_id, ressource_id | Favoris |
| `unlocks` | id, user_id, ressource_id, unlock_method | Prévu mais non utilisé |

#### Tables MANQUANTES (à créer)

| Table | Priorité | Sprint |
|-------|----------|--------|
| `creators` | HAUTE | Sprint 1 |
| `resources` (nouvelle structure) | HAUTE | Sprint 1 |
| `purchases` | HAUTE | Sprint 3 |
| `credits_transactions` | HAUTE | Sprint 3 |
| `url_health_checks` | MOYENNE | Sprint 5 |
| `books` (nouvelle structure) | MOYENNE | Sprint 6 |
| `toys_games` | MOYENNE | Sprint 6 |
| `creator_affiliate_links` | BASSE | Sprint 6 |
| `affiliate_clicks` | BASSE | Sprint 6 |
| `reviews` | BASSE | Post-MVP |
| `creator_payouts` | BASSE | Post-MVP |

### 3. Authentification actuelle

| Fonctionnalité | État | Notes |
|----------------|------|-------|
| Login email/password | ✅ OK | Supabase Auth |
| Login Google OAuth | ✅ OK | Configuré |
| Callback OAuth | ✅ OK | `/auth/callback` |
| Session côté client | ✅ OK | `supabase-client.ts` |
| Session côté serveur | ✅ OK | `supabase-server.ts` |
| Système de rôles | ❌ MANQUANT | Pas de champ `role` |
| Protection routes | ❌ MANQUANT | Middleware i18n seulement |
| RLS policies | ❌ MANQUANT | Non configurées |

### 4. Fonctionnalités existantes

| Feature | État | Qualité |
|---------|------|---------|
| Homepage avec hero | ✅ OK | Bonne |
| Catalogue activités | ✅ OK | Bonne |
| Catalogue livres | ✅ OK | Bonne |
| Catalogue jeux | ✅ OK | Bonne |
| Pages détail | ✅ OK | Bonne |
| Système favoris | ✅ OK | Fonctionnel |
| i18n (fr/en/es) | ✅ OK | Complet |
| Page profil utilisateur | ✅ OK | Basique |
| Responsive mobile | ✅ OK | Bonne |
| Animations Framer Motion | ✅ OK | Bonne |

### 5. Fonctionnalités MANQUANTES

| Feature | Priorité | Dépendances |
|---------|----------|-------------|
| Système de rôles (buyer/creator/admin) | CRITIQUE | profiles.role |
| RLS Policies | CRITIQUE | Rôles |
| Middleware protection routes | CRITIQUE | Rôles |
| Dashboard créateur | CRITIQUE | Rôles + creators table |
| Formulaire création ressource | CRITIQUE | Dashboard créateur |
| Système de crédits | CRITIQUE | credits_transactions |
| Intégration Stripe | CRITIQUE | Système crédits |
| Flow achat ressource | CRITIQUE | Stripe + crédits |
| Dashboard acheteur (achats) | HAUTE | purchases table |
| Dashboard admin | HAUTE | Rôles admin |
| Monitoring URLs | MOYENNE | url_health_checks |
| Dark mode | MOYENNE | next-themes |
| Glassmorphism UI | BASSE | Design system |

### 6. Écarts majeurs identifiés

#### A. Architecture BDD
- **Écart** : Table `ressources` unifiée vs specs avec tables séparées `resources`, `books`, `toys_games`
- **Recommandation** : Migration progressive, garder `ressources` pour contenu existant, créer `resources` pour nouveau contenu créateurs

#### B. Système de rôles
- **Écart** : Aucun système de rôles implémenté
- **Impact** : Bloque toute la logique multi-créateurs
- **Priorité** : CRITIQUE - Sprint 1

#### C. Monétisation
- **Écart** : Champ `credits` existe dans profiles mais non utilisé, aucune intégration Stripe
- **Impact** : Pas de revenus possibles
- **Priorité** : CRITIQUE - Sprint 3

#### D. Dashboards
- **Écart** : Seul un espace "favoris" existe, pas de dashboards créateur/admin
- **Impact** : Impossible de gérer la marketplace
- **Priorité** : CRITIQUE - Sprints 2-5

---

## PLAN D'ACTION

### Sprint 1 (Semaine 1-2) : Fondations Multi-Créateurs ✅ COMPLÉTÉ

**Objectif** : Poser les bases du système multi-créateurs

**Tâches** :
1. [x] Ajouter colonne `role` à `profiles` ('buyer'|'creator'|'admin')
2. [x] Créer table `creators` (slug, bio, philosophy, commission_rate, is_approved...)
3. [x] Créer table `resources` (nouvelle structure marketplace)
4. [x] Implémenter RLS policies sur profiles, creators, resources
5. [x] Modifier middleware.ts pour protection routes `/createur/*` et `/admin/*`
6. [x] Créer composant `<ProtectedRoute role="..." />`
7. [x] Créer hook `useUser` pour accès user/profile/role
8. [x] Créer RPC functions `increment_credits`, `decrement_credits`, `get_user_role`
9. [x] Créer page `/createur` (dashboard créateur)
10. [x] Créer page `/admin` (dashboard admin)
11. [x] Créer page `/devenir-createur` (candidature)

**Livrables** :
- ✅ Système de rôles fonctionnel
- ✅ Routes protégées par middleware
- ✅ Tables prêtes (à exécuter dans Supabase)
- ✅ Dashboards créateur et admin

**Fichiers créés/modifiés** :
- `supabase/migrations/001_sprint1_roles_creators.sql` - Migration SQL
- `lib/types.ts` - Types mis à jour
- `lib/hooks/useUser.ts` - Hook utilisateur
- `middleware.ts` - Protection routes
- `components/ProtectedRoute.tsx` - Composant protection
- `app/[lang]/createur/page.tsx` - Dashboard créateur
- `app/[lang]/admin/page.tsx` - Dashboard admin
- `app/[lang]/devenir-createur/page.tsx` - Page candidature

### Sprint 2 (Semaine 3-4) : Parcours Créateur MVP ✅ COMPLÉTÉ

**Objectif** : Permettre aux créateurs de soumettre des ressources

**Tâches** :
1. [x] Colonnes marketplace ajoutées à table `ressources` existante (creator_id, price_credits, status, etc.)
2. [x] Formulaire création ressource wizard 5 étapes
3. [x] Upload preview images (composant prêt, bucket à créer)
4. [ ] Validation URL ressource externe (optionnel)
5. [x] Dashboard créateur : liste ressources + stats basiques
6. [x] Page admin review : file pending + actions (approuver/rejeter)

**Fichiers créés** :
- `supabase/migrations/002_add_marketplace_to_ressources.sql`
- `components/creator/ResourceWizard.tsx`
- `components/creator/wizard/StepBasicInfo.tsx`
- `components/creator/wizard/StepPedagogy.tsx`
- `components/creator/wizard/StepCategories.tsx`
- `components/creator/wizard/StepMedia.tsx`
- `components/creator/wizard/StepReview.tsx`
- `app/[lang]/createur/ressources/page.tsx`
- `app/[lang]/createur/ressources/nouvelle/page.tsx`
- `app/[lang]/admin/ressources/page.tsx`

### Sprint 3 (Semaine 5-6) : Système Achat/Crédits ✅ COMPLÉTÉ

**Objectif** : Permettre l'achat de ressources avec crédits

**Tâches** :
1. [x] Créer table `purchases`
2. [x] Créer table `credits_transactions`
3. [x] Fonction RPC `purchase_ressource` (achat atomique avec répartition créateur 90%)
4. [x] Fonction RPC `has_purchased_ressource`
5. [x] Fonction RPC `get_user_purchases`
6. [x] API `/api/purchase`
7. [x] Page `/profil/achats` (mes achats)
8. [x] Composant `PurchaseButton` intelligent

**Fichiers créés** :
- `supabase/migrations/003_purchases_credits.sql`
- `app/api/purchase/route.ts`
- `app/[lang]/profil/achats/page.tsx`
- `components/PurchaseButton.tsx`

### Sprint 4 (Semaine 7-8) : Intégration Stripe

**Objectif** : Permettre l'achat de crédits via Stripe

**Tâches** :
1. [ ] Page `/profil/credits` avec packs à acheter
2. [ ] Route API `/api/checkout/create-session`
3. [ ] Route API `/api/webhooks/stripe`
4. [ ] Page succès/échec paiement
5. [ ] Historique transactions

**Livrables** :
- Utilisateurs peuvent acheter des crédits via Stripe

### Sprint 5 (Semaine 9-10) : Admin & Monitoring

**Objectif** : Outils admin et monitoring automatique

**Tâches** :
1. [ ] Créer table `url_health_checks`
2. [ ] Cron job monitoring URLs
3. [ ] Email alerte créateur si lien mort
4. [ ] Auto-offline si dead > 48h
5. [ ] Dashboard admin : KPIs, graphiques
6. [ ] Gestion créateurs : liste, approuver, suspendre

**Livrables** :
- Monitoring automatique des URLs
- Dashboard admin complet

### Sprint 6 (Semaine 11-12) : Polish & Bibliothèques

**Objectif** : Finalisation et features secondaires

**Tâches** :
1. [ ] Dark mode avec next-themes
2. [ ] Glassmorphism Header/Footer
3. [ ] Refactor tables books/toys_games (optionnel)
4. [ ] SEO : metadata, sitemap, schema.org
5. [ ] Performance : Lighthouse > 90
6. [ ] Tests manuels E2E

**Livrables** :
- MVP prêt pour beta privée

---

## Métriques Prototype (Audit)

| Métrique | Valeur |
|----------|--------|
| Fichiers app/*.tsx | 14 |
| Composants | 17 |
| Routes API | 1 |
| Libs utilitaires | 9 |
| Tables Supabase | 4 (ressources, profiles, bookmarks, unlocks) |
| Tables manquantes | 9 |
| Fonctionnalités OK | 10 |
| Fonctionnalités manquantes | 13 |

---

## Décisions techniques

### Garder du prototype
- Structure routing `[lang]/` (i18n fonctionnel)
- Composants UI (Button, Badge, Cards)
- Header/Footer (adapter pour glassmorphism)
- Supabase clients (SSR bien configuré)
- Système favoris (bookmarks)
- Animations Framer Motion

### À refactorer
- Table `ressources` → créer `resources` séparée pour créateurs
- Middleware → ajouter protection routes par rôle
- Types → aligner avec nouveau schéma BDD

### À créer from scratch
- Tables : creators, purchases, credits_transactions, url_health_checks
- Pages : dashboards créateur/acheteur/admin
- Intégration Stripe complète
- RLS policies
- Cron monitoring

---

## Index Rapide

**Besoin de retrouver quelque chose ?**

- **Schéma BDD cible** → docs/ARCHITECTURE.md
- **Design system** → docs/DESIGN_SYSTEM.md
- **Specs fonctionnelles** → docs/FEATURES_SPECS.md
- **Conventions code** → CLAUDE.md

**Fichiers clés actuels** :
- Auth : `lib/auth.ts`, `lib/supabase-server.ts`, `app/auth/callback`
- Catalogue : `lib/supabase-queries.ts`, `app/[lang]/activites/*`
- Types : `lib/types.ts`
- Middleware : `middleware.ts` (i18n seulement)

---

_Ce document est mis à jour après chaque session de développement._
