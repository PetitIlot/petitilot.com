# Architecture Backend - Petit Ilot

## Vue d'ensemble

- **Base de données** : PostgreSQL via Supabase
- **Auth** : Supabase Auth (email/password)
- **Storage** : Supabase Storage (images preview)
- **Paiements** : Stripe Checkout + Webhooks
- **Hébergement** : Vercel
- **Cron jobs** : Vercel Cron

---

## Schéma de base de données

### Tables principales

```sql
-- PROFILES (extension auth.users Supabase)
profiles {
  id UUID PK (FK auth.users)
  role TEXT ('buyer'|'creator'|'admin')
  display_name TEXT
  avatar_url TEXT
  credits_balance INTEGER DEFAULT 0
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- CREATORS (profil créateur étendu)
creators {
  id UUID PK (FK profiles.id)
  slug TEXT UNIQUE NOT NULL
  bio TEXT
  philosophy TEXT
  instagram_handle TEXT
  website_url TEXT
  commission_rate NUMERIC(4,2) DEFAULT 90.00
  payout_email TEXT
  stripe_account_id TEXT
  is_approved BOOLEAN DEFAULT FALSE
  approval_date TIMESTAMPTZ
  total_sales_credits INTEGER DEFAULT 0
  total_earnings_eur NUMERIC(10,2) DEFAULT 0
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- RESOURCES (ressources vendues)
resources {
  id UUID PK
  creator_id UUID FK (creators.id) NOT NULL
  slug TEXT UNIQUE NOT NULL

  -- Contenu multi-langue
  title_fr TEXT NOT NULL
  title_en TEXT
  description_fr TEXT NOT NULL
  description_en TEXT
  locale TEXT DEFAULT 'fr'

  -- Pricing
  price_credits INTEGER NOT NULL CHECK > 0

  -- Métadonnées pédagogiques
  age_min_months INTEGER (0-72)
  age_max_months INTEGER
  duration_minutes INTEGER
  difficulty TEXT ('easy'|'medium'|'hard')

  -- Catégorisation (arrays PostgreSQL)
  categories TEXT[]
  materials TEXT[]

  -- Médias
  preview_image_url TEXT NOT NULL
  additional_images_urls TEXT[]
  resource_file_url TEXT NOT NULL

  -- SEO
  meta_description TEXT
  keywords TEXT[]

  -- Santé technique
  url_last_checked TIMESTAMPTZ
  url_status TEXT ('ok'|'dead'|'pending') DEFAULT 'pending'
  is_published BOOLEAN DEFAULT FALSE

  -- Stats
  views_count INTEGER DEFAULT 0
  purchases_count INTEGER DEFAULT 0
  rating_avg NUMERIC(3,2)
  reviews_count INTEGER DEFAULT 0

  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- PURCHASES (achats ressources)
purchases {
  id UUID PK
  buyer_id UUID FK (profiles.id) NOT NULL
  resource_id UUID FK (resources.id) NOT NULL
  credits_spent INTEGER NOT NULL
  price_eur NUMERIC(10,2)
  purchased_at TIMESTAMPTZ
  download_url TEXT
  download_count INTEGER DEFAULT 0
  last_download_at TIMESTAMPTZ
  UNIQUE(buyer_id, resource_id)
}

-- CREDITS_TRANSACTIONS (achats et dépenses crédits)
credits_transactions {
  id UUID PK
  user_id UUID FK (profiles.id) NOT NULL
  type TEXT ('purchase'|'spent'|'refund'|'bonus') NOT NULL
  credits_amount INTEGER NOT NULL
  price_eur NUMERIC(10,2)
  stripe_payment_intent_id TEXT
  stripe_charge_id TEXT
  related_purchase_id UUID FK (purchases.id)
  description TEXT
  created_at TIMESTAMPTZ
}

-- URL_HEALTH_CHECKS (monitoring liens créateurs)
url_health_checks {
  id UUID PK
  resource_id UUID FK (resources.id) NOT NULL
  checked_at TIMESTAMPTZ
  status_code INTEGER
  response_time_ms INTEGER
  is_accessible BOOLEAN
  error_message TEXT
}

-- REVIEWS (futur - phase 2)
reviews {
  id UUID PK
  purchase_id UUID FK (purchases.id) UNIQUE NOT NULL
  rating INTEGER CHECK 1-5
  comment TEXT
  is_published BOOLEAN DEFAULT TRUE
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- CREATOR_PAYOUTS (futur - automatisation)
creator_payouts {
  id UUID PK
  creator_id UUID FK (creators.id) NOT NULL
  period_start DATE
  period_end DATE
  total_credits_sold INTEGER
  total_eur NUMERIC(10,2)
  commission_eur NUMERIC(10,2)
  net_payout_eur NUMERIC(10,2)
  stripe_transfer_id TEXT
  status TEXT ('pending'|'processing'|'paid'|'failed')
  paid_at TIMESTAMPTZ
  created_at TIMESTAMPTZ
}
```

### Tables Bibliothèques (Livres & Jeux)

```sql
-- BOOKS (livres recommandés)
books {
  id UUID PK
  slug TEXT UNIQUE NOT NULL

  -- Infos livre
  title TEXT NOT NULL
  author TEXT NOT NULL
  illustrator TEXT
  publisher TEXT
  year_published INTEGER
  isbn TEXT

  -- Média
  cover_image_url TEXT NOT NULL
  additional_images_urls TEXT[]

  -- Recommandation Petit Ilot
  why_we_recommend TEXT NOT NULL -- Markdown
  our_take TEXT -- Citation courte
  age_min_months INTEGER
  age_max_months INTEGER

  -- Catégorisation
  categories TEXT[] -- ['nature', 'emotions', 'diversity']
  themes TEXT[]     -- ['friendship', 'seasons', 'animals']
  tags TEXT[]       -- SEO + filtres

  -- Liens affiliés
  default_affiliate_link TEXT
  default_affiliate_provider TEXT -- 'amazon', 'bookshop', etc.
  affiliate_disclaimer TEXT

  -- Stats
  views_count INTEGER DEFAULT 0
  clicks_count INTEGER DEFAULT 0
  rating_avg NUMERIC(3,2)
  reviews_count INTEGER DEFAULT 0

  -- Meta
  is_published BOOLEAN DEFAULT TRUE
  featured BOOLEAN DEFAULT FALSE
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- TOYS_GAMES (jeux recommandés)
toys_games {
  id UUID PK
  slug TEXT UNIQUE NOT NULL

  title TEXT NOT NULL
  brand TEXT
  manufacturer TEXT

  cover_image_url TEXT NOT NULL
  additional_images_urls TEXT[]

  why_we_recommend TEXT NOT NULL
  our_take TEXT
  age_min_months INTEGER
  age_max_months INTEGER

  categories TEXT[] -- ['outdoor', 'construction', 'sensory']
  materials TEXT[]  -- ['wood', 'fabric', 'recycled']
  tags TEXT[]

  default_affiliate_link TEXT
  default_affiliate_provider TEXT
  affiliate_disclaimer TEXT

  views_count INTEGER DEFAULT 0
  clicks_count INTEGER DEFAULT 0
  rating_avg NUMERIC(3,2)
  reviews_count INTEGER DEFAULT 0

  is_published BOOLEAN DEFAULT TRUE
  featured BOOLEAN DEFAULT FALSE
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
}

-- CREATOR_AFFILIATE_LINKS (liens affiliés créateurs)
creator_affiliate_links {
  id UUID PK
  creator_id UUID FK (creators.id) NOT NULL
  item_type TEXT CHECK ('book'|'toy') NOT NULL
  item_id UUID NOT NULL
  affiliate_link TEXT NOT NULL
  affiliate_provider TEXT
  clicks_count INTEGER DEFAULT 0
  created_at TIMESTAMPTZ
  updated_at TIMESTAMPTZ
  UNIQUE(creator_id, item_type, item_id)
}

-- AFFILIATE_CLICKS (tracking affiliation)
affiliate_clicks {
  id UUID PK
  user_id UUID FK (profiles.id) -- Nullable (anonyme OK)
  item_type TEXT CHECK ('book'|'toy') NOT NULL
  item_id UUID NOT NULL
  beneficiary_type TEXT CHECK ('petitilot'|'creator') NOT NULL
  creator_id UUID FK (creators.id)
  affiliate_link TEXT NOT NULL
  clicked_at TIMESTAMPTZ
  referrer TEXT
  user_agent TEXT
}
```

### Indexes de performance

```sql
CREATE INDEX idx_resources_creator ON resources(creator_id);
CREATE INDEX idx_resources_published ON resources(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_resources_categories ON resources USING GIN(categories);
CREATE INDEX idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX idx_purchases_resource ON purchases(resource_id);
CREATE INDEX idx_credits_user ON credits_transactions(user_id);
CREATE INDEX idx_books_published ON books(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_books_featured ON books(featured) WHERE featured = TRUE;
CREATE INDEX idx_books_categories ON books USING GIN(categories);
CREATE INDEX idx_creator_affiliate_links_creator ON creator_affiliate_links(creator_id);
CREATE INDEX idx_affiliate_clicks_item ON affiliate_clicks(item_type, item_id);
```

---

## RLS Policies (Row Level Security)

```sql
-- PROFILES : Lecture publique, modification self uniquement
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- CREATORS : Lecture publique (approved), modification self ou admin
CREATE POLICY "Approved creators viewable by everyone" ON creators
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Creators can update own profile" ON creators
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any creator" ON creators
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- RESOURCES : Lecture publique (published), CRUD par créateur propriétaire
CREATE POLICY "Published resources viewable by everyone" ON resources
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view own resources" ON resources
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert own resources" ON resources
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own resources" ON resources
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Admins can view all resources" ON resources
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PURCHASES : Lecture par acheteur uniquement
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Users can insert own purchases" ON purchases
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- UNLOCKS : Déblocages ressources - accès propriétaire uniquement
CREATE POLICY "unlocks_select_own" ON unlocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "unlocks_insert_own" ON unlocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SAVED_SEARCHES : Alertes utilisateur - accès propriétaire uniquement
CREATE POLICY "saved_searches_select_own" ON saved_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_searches_insert_own" ON saved_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_searches_update_own" ON saved_searches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "saved_searches_delete_own" ON saved_searches
  FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS : Notifications utilisateur - accès propriétaire uniquement
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);
```

---

## Intégration Stripe

### Système de crédits

| Pack | Prix (€) | Crédits | Prix/crédit | Réduction |
|------|----------|---------|-------------|-----------|
| Découverte | 10 | 10 | 1,00€ | - |
| Populaire | 25 | 30 | 0,83€ | 17% |
| Passionné | 50 | 70 | 0,71€ | 29% |
| Communauté | 100 | 150 | 0,67€ | 33% |

**Ressources** : 1-10 crédits selon complexité

### Checkout Session (achats crédits)

```typescript
// Endpoint: /api/checkout/create-session
// Body: { packId: 'popular' | 'discovery' | 'passionate' | 'community' }

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: { name: 'Pack Populaire - 30 crédits' },
      unit_amount: 2500, // 25€ en centimes
    },
    quantity: 1,
  }],
  success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/acheter-credits?canceled=true`,
  metadata: {
    userId: user.id,
    credits: 30,
    packId: 'popular',
  },
});
```

### Webhook (post-paiement)

```typescript
// Endpoint: /api/webhooks/stripe
// Event: checkout.session.completed

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const { userId, credits } = session.metadata;

  // 1. Créer transaction credits_transactions
  await supabase.from('credits_transactions').insert({
    user_id: userId,
    type: 'purchase',
    credits_amount: credits,
    price_eur: session.amount_total / 100,
    stripe_payment_intent_id: session.payment_intent,
  });

  // 2. Incrémenter solde profiles.credits_balance
  await supabase.rpc('increment_credits', { user_id: userId, amount: credits });
}
```

### Stripe Connect (futur)

- Phase MVP : Paiements manuels mensuels (SEPA/PayPal)
- Phase 2 : Stripe Connect Express accounts
- Automatisation reversements tous les 15 du mois si solde > 50€

---

## Supabase Storage

### Upload preview images

```typescript
// Bucket: 'resource-previews' (public read)
// Path: {creator_id}/{resource_id}/{filename}

const { data, error } = await supabase.storage
  .from('resource-previews')
  .upload(`${creatorId}/${resourceId}/main.jpg`, file, {
    cacheControl: '3600',
    upsert: true,
  });

const publicUrl = supabase.storage
  .from('resource-previews')
  .getPublicUrl(data.path).data.publicUrl;
```

**Sécurité** :
- Upload limité aux créateurs authentifiés (RLS policies)
- Taille max : 5MB par image
- Formats autorisés : JPG, PNG, WebP

---

## Monitoring URLs (Vercel Cron)

### Cron job quotidien

```typescript
// Endpoint: /api/cron/check-urls (protégé par CRON_SECRET)
// Schedule: Tous les jours à 3h UTC

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: resources } = await supabase
    .from('resources')
    .select('id, resource_file_url, creator_id')
    .eq('is_published', true);

  for (const resource of resources) {
    try {
      const response = await fetch(resource.resource_file_url, { method: 'HEAD', timeout: 5000 });

      await supabase.from('url_health_checks').insert({
        resource_id: resource.id,
        status_code: response.status,
        is_accessible: response.ok,
      });

      if (!response.ok) {
        await supabase.from('resources').update({
          url_status: 'dead',
          url_last_checked: new Date().toISOString(),
        }).eq('id', resource.id);

        await sendEmailAlert(resource.creator_id, resource.id);
      } else {
        await supabase.from('resources').update({
          url_status: 'ok',
          url_last_checked: new Date().toISOString(),
        }).eq('id', resource.id);
      }
    } catch (error) {
      await supabase.from('url_health_checks').insert({
        resource_id: resource.id,
        is_accessible: false,
        error_message: error.message,
      });
    }
  }

  return Response.json({ checked: resources.length });
}
```

### Configuration Vercel

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/check-urls",
    "schedule": "0 3 * * *"
  }]
}
```

---

## Logique liens affiliés

### Flow utilisateur

1. **Par défaut** : Bénéficiaire = Petit Ilot
   - Lien : `item.default_affiliate_link`
   - Tracking : `INSERT affiliate_clicks (beneficiary_type = 'petitilot')`

2. **Soutenir un créateur** :
   - Vérification lien créateur existe → sinon fallback Petit Ilot
   - Tracking : `INSERT affiliate_clicks (beneficiary_type = 'creator', creator_id = X)`

### Server Action tracking

```typescript
// app/livres/[slug]/actions.ts
'use server';

export async function trackAffiliateClick({
  itemType,
  itemId,
  beneficiaryType,
  creatorId,
  userId,
}: {
  itemType: 'book' | 'toy';
  itemId: string;
  beneficiaryType: 'petitilot' | 'creator';
  creatorId?: string;
  userId?: string;
}) {
  let affiliateLink: string;

  if (beneficiaryType === 'creator' && creatorId) {
    const { data: creatorLink } = await supabase
      .from('creator_affiliate_links')
      .select('affiliate_link')
      .eq('creator_id', creatorId)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .single();

    if (creatorLink) {
      affiliateLink = creatorLink.affiliate_link;
    } else {
      // Fallback
      const { data: item } = await supabase
        .from(itemType === 'book' ? 'books' : 'toys_games')
        .select('default_affiliate_link')
        .eq('id', itemId)
        .single();
      affiliateLink = item.default_affiliate_link;
      beneficiaryType = 'petitilot';
    }
  } else {
    const { data: item } = await supabase
      .from(itemType === 'book' ? 'books' : 'toys_games')
      .select('default_affiliate_link')
      .eq('id', itemId)
      .single();
    affiliateLink = item.default_affiliate_link;
  }

  await supabase.from('affiliate_clicks').insert({
    user_id: userId || null,
    item_type: itemType,
    item_id: itemId,
    beneficiary_type: beneficiaryType,
    creator_id: beneficiaryType === 'creator' ? creatorId : null,
    affiliate_link: affiliateLink,
  });

  return { affiliateLink };
}
```

---

## Notes sécurité

1. **Toujours valider côté serveur** : Ne jamais faire confiance aux inputs client
2. **RLS policies strictes** : Empêcher lecture/modification non autorisée
3. **Secrets environnement** : Jamais commit .env, utiliser Vercel Environment Variables
4. **Stripe webhook signature** : Toujours vérifier `stripe.webhooks.constructEvent`
5. **CRON endpoint** : Protéger par secret (header Authorization)

## Notes performance

1. **Images** : Toujours utiliser `next/image` avec `priority` pour hero
2. **Database queries** : Utiliser `select` spécifique (éviter `SELECT *`)
3. **Indexes** : Créer sur colonnes filtrées/triées
4. **Edge Functions** : Préférer pour logique backend simple
5. **Caching** : Headers `Cache-Control` sur assets statiques

---

_Dernière mise à jour : Janvier 2025_
