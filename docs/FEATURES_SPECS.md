# Spécifications Fonctionnelles - Petit Ilot

## Modèle économique

### Commission
- **90% créateur / 10% Petit Ilot** (modèle par défaut)
- Hébergement fichiers : créateur héberge (Google Drive, Dropbox, etc.)
- Hébergement preview images : Supabase Storage

### Système de crédits

| Pack | Prix (€) | Crédits | Prix/crédit | Réduction |
|------|----------|---------|-------------|-----------|
| Découverte | 10 | 10 | 1,00€ | - |
| Populaire | 25 | 30 | 0,83€ | 17% |
| Passionné | 50 | 70 | 0,71€ | 29% |
| Communauté | 100 | 150 | 0,67€ | 33% |

**Ressources** : 1-10 crédits selon complexité

### Monitoring URLs automatique
- Cron job quotidien (Vercel Cron)
- Test HTTP HEAD sur `resource_file_url`
- Si lien mort > 48h : `is_published = FALSE` automatiquement
- Email alerte créateur immédiat

---

## Catégorisation & Taxonomie

### Categories (array, multi-select)
- `sensory` - Sensoriel (messy play, textures, bacs sensoriels)
- `fine-motor` - Motricité fine (pince, transvasement, découpage)
- `gross-motor` - Motricité globale (parcours, équilibre)
- `nature-outdoor` - Nature & outdoor (jardinage, land art)
- `creativity-arts` - Créativité & arts (peinture, collage, modelage)
- `diy-recycling` - DIY & récup (fabrication jouets, upcycling)
- `cooking` - Cuisine pédagogique (recettes enfants)
- `imaginative-play` - Jeux symboliques (petits mondes, scénarios)
- `routines` - Rituels & routines (autonomie, gestion émotions)
- `printables` - Supports imprimables (cartes, jeux à imprimer)

### Materials (array, tags filtres)
- `zero-material` - Sans matériel
- `household` - Matériel maison (objets quotidien)
- `natural` - Matériel nature (feuilles, cailloux, branches)
- `budget-friendly` - Petit budget (<5€)
- `investment` - Investissement (matériel spécifique à acheter)

### Difficulty
- `easy` - Facile (5-10 min, préparation minimale)
- `medium` - Moyen (20-30 min, préparation modérée)
- `hard` - Difficile (1h+, préparation/matériel important)

### Âge
Stocké en mois : `age_min_months` / `age_max_months` (0-72 mois = 0-6 ans)

Affichage frontend :
- 0-12 mois : "Bébé"
- 12-24 mois : "Petit marcheur"
- 2-3 ans : "Jeune enfant"
- 3-4 ans : "Préscolaire"
- 4-6 ans : "Maternelle"

---

## Parcours utilisateurs

### Acheteur (Parent)

**Flow d'achat** :
1. Navigation/recherche → Fiche ressource
2. Clic "Acheter X crédits"
3. Si `credits_balance < price_credits` → Redirect Stripe Checkout
4. Après paiement Stripe → Webhook update `credits_balance`
5. Clic "Acheter ressource" → Dépense crédits
6. Création entry `purchases` + décrémentation `credits_balance`
7. Accès download via dashboard "Mes ressources"

**Pages clés** :
- `/` - Homepage (hero + preview ressources)
- `/ressources` - Catalogue filtrable
- `/ressources/[slug]` - Fiche ressource détaillée
- `/acheter-credits` - Packs crédits + Stripe
- `/dashboard` - Mes crédits + Mes ressources

### Créateur

**Flow création ressource** :
1. Login → Dashboard créateur
2. "Nouvelle ressource" → Formulaire multi-étapes
   - Étape 1 : Infos générales (titres, descriptions, prix)
   - Étape 2 : Pédagogie (âge, durée, difficulté, objectifs)
   - Étape 3 : Catégorisation (categories, materials, keywords)
   - Étape 4 : Médias (upload preview image, URL ressource externe)
   - Étape 5 : Preview + Validation
3. Soumission → Statut `pending_review`
4. Admin review → Statut `published` ou feedback
5. Si publié → Visible catalogue + Dashboard stats temps réel

**Pages clés** :
- `/createur/dashboard` - Stats globales
- `/createur/ressources` - Liste ressources + actions
- `/createur/ressources/nouvelle` - Formulaire création
- `/createur/ressources/[id]/modifier` - Édition ressource
- `/createur/ventes` - Historique ventes détaillé
- `/createur/paiements` - Reversements
- `/createur/profil` - Bio, philo, socials, slug
- `/createur/liens-affilies` - Gestion liens affiliés livres/jeux

### Admin

**Dashboard admin** :
- `/admin/dashboard` - Metrics clés (CA, créateurs actifs, top ressources)
- `/admin/createurs` - Liste + gestion créateurs (approuver, suspendre)
- `/admin/ressources` - File review pending + modération
- `/admin/monitoring` - Santé URLs, erreurs, performance
- `/admin/finance` - Transactions Stripe, paiements créateurs

---

## Fonctionnalités Bibliothèques (Livres & Jeux)

### Vue d'ensemble
Recommandations curées de livres et jeux alignés avec la philosophie Petit Ilot.

**Double valeur** :
1. **Contenu éditorial** : Inspiration pour parents, SEO long-tail
2. **Monétisation douce** : Liens affiliés avec option soutien créateurs

**Structure** :
- `/livres` - Bibliothèque livres recommandés
- `/livres/[slug]` - Fiche détaillée livre
- `/jeux` - Bibliothèque jeux recommandés
- `/jeux/[slug]` - Fiche détaillée jeu

### Modes de visualisation

**Mode Vignette (par défaut)** :
- Grid avec informations riches visibles
- Image, titre, auteur, âge, tags, note, année

**Mode Netflix** :
- Carousels thématiques horizontaux
- Images grandes, infos minimales au hover
- Sections : Nouveautés, Coups de cœur, Par âge, Par thème

### Logique liens affiliés

**Par défaut** : Bénéficiaire = Petit Ilot
- Utilise `item.default_affiliate_link`

**Soutenir un créateur** :
- User sélectionne créateur
- Si lien créateur existe → utilise son lien
- Sinon → fallback Petit Ilot avec message

**Tracking** : Table `affiliate_clicks` avec `beneficiary_type`

---

## Planning Sprints (6 mois)

### Sprint 1 (Semaine 1-2) : Auth & Fondations BDD

**Objectifs** :
- [ ] Schéma BDD complet Supabase (8 tables principales)
- [ ] RLS policies (profiles, creators, resources, purchases)
- [ ] Auth Supabase avec rôles (buyer/creator/admin)
- [ ] Middleware Next.js protection routes `/createur/*` et `/admin/*`
- [ ] Composant `<ProtectedRoute role="creator|admin" />`
- [ ] RPC functions `increment_credits`, `decrement_credits`

### Sprint 2 (Semaine 3-4) : Parcours Créateur MVP

**Objectifs** :
- [ ] Formulaire création ressource (wizard 5 étapes)
- [ ] Upload images preview Supabase Storage
- [ ] Validation URL ressource externe (test HTTP HEAD)
- [ ] Dashboard créateur basique (stats + liste ressources)
- [ ] Admin review (page `/admin/ressources` avec file pending)

### Sprint 3 (Semaine 5-6) : Parcours Acheteur MVP

**Objectifs** :
- [ ] Catalogue ressources avec filtres (catégorie, âge, prix)
- [ ] Fiche ressource `/ressources/[slug]` optimisée SEO
- [ ] Flow achat crédits (Stripe Checkout)
- [ ] Webhook handler `/api/webhooks/stripe`
- [ ] Dashboard acheteur (solde + mes ressources)

### Sprint 4 (Semaine 7-8) : Flow Achat Ressource Complet

**Objectifs** :
- [ ] Bouton "Acheter cette ressource" sur fiche
- [ ] Vérification solde suffisant (client + serveur)
- [ ] Modal "Acheter plus de crédits" si insuffisant
- [ ] Création entry `purchases` + décrémentation `credits_balance`
- [ ] Download ressource depuis dashboard

### Sprint 5 (Semaine 9-10) : Monitoring & Admin Tools

**Objectifs** :
- [ ] Cron job quotidien monitoring URLs
- [ ] Email alerte créateur si lien mort
- [ ] Auto-offline si dead > 48h
- [ ] Dashboard admin metrics (KPIs, graphiques)
- [ ] Gestion créateurs admin (approuver, suspendre)

### Sprint 6 (Semaine 11-12) : Bibliothèques & Polish

**Objectifs** :
- [ ] Pages `/livres` et `/jeux` mode vignette
- [ ] Fiches détaillées + tracking affilié
- [ ] Dashboard créateur : Gestion liens affiliés
- [ ] SEO on-page (metadata, sitemap, schema.org)
- [ ] Performance (Lighthouse > 90)

---

## Features MVP prioritaires détaillées

### Mois 1-2 : Fondations

**Auth & Rôles** :
- Supabase Auth configuré (email/password)
- RLS policies complètes
- Middleware Next.js protection routes
- Composant ProtectedRoute

**Système crédits** :
- Table `credits_transactions` avec triggers
- RPC Supabase atomiques
- Affichage solde dashboard
- Page achats crédits + Stripe

**Ressources (CRUD créateur)** :
- Formulaire création wizard
- Upload image Supabase Storage
- Validation URL ressource
- Preview avant soumission

**Catalogue acheteur** :
- Page listing avec filtres
- Fiche ressource SEO
- Recherche basique (PostgreSQL full-text)
- Flow achat complet

**Admin basique** :
- Dashboard metrics clés
- File review ressources pending
- Actions : Approuver, Demander modifs, Rejeter

### Mois 3-4 : Beta privée

**Onboarding créateur** :
- Formulaire candidature `/devenir-createur`
- Page Guidelines markdown
- Email bienvenue auto
- Invitation groupe privé

**Dashboard créateur amélioré** :
- Stats temps réel (vues, ventes, taux conversion)
- Graphique évolution ventes
- Top 5 ressources performantes
- Solde à reverser + historique

**Catalogue avancé** :
- Filtres multi-critères
- Tri (plus récent, plus populaire, prix)
- Pagination ou infinite scroll
- Search instantanée (Meilisearch optionnel)

**Monitoring URLs** :
- Cron job quotidien
- Table `url_health_checks` + logs
- Email alerte créateur
- Dashboard admin : vue santé globale

### Mois 5-6 : Pre-launch & Lancement

**SEO on-page** :
- Metadata dynamique (title, description, OG tags)
- Sitemap.xml généré
- Robots.txt
- Schema.org structured data
- Images alt tags

**Performance** :
- Next.js Image optimization
- Code splitting
- Lighthouse score > 90
- Vercel Analytics

**Analytics** :
- Google Analytics 4 (events)
- Supabase dashboard
- Funnel achat

**Newsletter** :
- Intégration Brevo ou Mailchimp
- Formulaire inscription (lead magnet)
- Templates email

**Legal** :
- CGV/CGU pages dédiées
- Mentions légales
- Politique confidentialité RGPD
- Bannière cookies

---

## Notes UX

1. **Loading states** : Toujours afficher spinners/skeletons
2. **Error states** : Messages clairs et actionnables
3. **Success feedback** : Toasts/notifications après actions
4. **Responsive** : Mobile-first (60%+ trafic attendu sur mobile)
5. **Accessibility** : Alt texts, labels, contraste, navigation clavier

## Notes SEO

1. **Metadata** : Générer dynamiquement pour chaque page
2. **Sitemap** : Régénérer à chaque nouvelle ressource
3. **Structured data** : Schema.org Product + Offer
4. **URLs** : Slugs SEO-friendly (lowercase, hyphens, keywords)
5. **Performance** : Lighthouse score > 90

---

## Checklist features bibliothèques

**Phase 1 (MVP)** :
- [ ] Schéma BDD `books` + `toys_games` + `creator_affiliate_links`
- [ ] Page `/livres` mode vignette avec filtres
- [ ] Page `/livres/[slug]` fiche + tracking affilié
- [ ] Idem `/jeux`
- [ ] Dashboard créateur : Gestion liens affiliés
- [ ] Logique sélection bénéficiaire

**Phase 2 (Post-lancement)** :
- [ ] Mode Netflix (carousels)
- [ ] Toggle mode vignette ↔ Netflix
- [ ] Suivi créateurs (follow/unfollow)
- [ ] Combobox créateurs avec "Mes suivis"
- [ ] Reviews/ratings

**Phase 3 (Optimisation)** :
- [ ] Dashboard créateur : Stats clics affiliés
- [ ] Analytics admin : Top livres/jeux, revenus affiliés
- [ ] Recommandations personnalisées
- [ ] Wishlist livres/jeux

---

_Dernière mise à jour : Janvier 2025_
