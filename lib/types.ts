export type RessourceType = 'activite' | 'motricite' | 'alimentation'
export type Language = 'fr' | 'en' | 'es'
export type Difficulte = 'beginner' | 'advanced' | 'expert'

export interface MaterielItem {
  item: string
  url?: string | null
  recup?: boolean
}

export interface Ressource {
  id: string
  group_id: string
  lang: Language
  type: RessourceType
  title: string
  vignette_url: string | null
  age_min: number | null
  age_max: number | null
  themes: string[] | null
  categories: string[] | null
  competences: string[] | null
  difficulte: Difficulte | null
  autonomie: boolean | null
  duration: number | null
  duration_max: number | null
  duration_prep: number | null
  intensity: string | null        // 'leger' | 'moyen' | 'intense'
  is_premium: boolean
  accept_free_credits: boolean
  materiel_json: MaterielItem[] | null
  price_credits?: number | null
  content_blocks?: unknown | null  // Block-based layout (ContentBlocksData)
  created_at?: string
  updated_at?: string
}

// Nouveaux types (marketplace multi-créateurs)
export type UserRole = 'buyer' | 'creator' | 'admin'
export type ResourceStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'offline'
export type ResourceDifficulty = 'easy' | 'medium' | 'hard'
export type UrlStatus = 'ok' | 'dead' | 'pending'

export interface Profile {
  id: string
  email: string
  role: UserRole
  credits_balance: number // Total (rétrocompatibilité)
  free_credits_balance: number // Crédits gratuits (vert)
  paid_credits_balance: number // Crédits payants (or)
  created_at?: string
  updated_at?: string
}

export interface Creator {
  id?: string
  user_id: string
  slug: string
  display_name: string
  bio: string | null
  philosophy: string | null       // deprecated — kept for legacy data
  themes: string[] | null         // tags/thèmes éducatifs (remplace philosophy)
  avatar_url: string | null
  instagram_handle: string | null
  youtube_handle: string | null
  tiktok_handle: string | null
  website_url: string | null
  commission_rate: number
  payout_email: string | null
  stripe_account_id: string | null
  is_approved: boolean
  approval_date: string | null
  is_featured: boolean
  total_resources: number
  total_sales_credits: number
  total_earnings_cents: number
  page_content: PageBlock[] | null  // canvas de la page publique
  created_at: string
  updated_at: string
}

export interface PageBlock {
  id: string
  type: 'hero' | 'bio' | 'text' | 'image' | 'gallery' | 'quote' | 'divider' | 'socials' | 'cta'
  content: Record<string, unknown>
}

export interface Resource {
  id: string
  creator_id: string
  slug: string
  title_fr: string
  title_en: string | null
  description_fr: string
  description_en: string | null
  price_credits: number
  age_min_months: number | null
  age_max_months: number | null
  duration_minutes: number | null
  difficulty: ResourceDifficulty | null
  categories: string[]
  materials: string[]
  keywords: string[]
  preview_image_url: string | null
  additional_images_urls: string[]
  resource_file_url: string
  meta_description: string | null
  url_last_checked: string | null
  url_status: UrlStatus
  status: ResourceStatus
  rejection_reason: string | null
  published_at: string | null
  views_count: number
  purchases_count: number
  rating_avg: number | null
  reviews_count: number
  created_at: string
  updated_at: string
  // Relations (optionnel, dépend de la query)
  creator?: Creator
}

export interface ResourceWithCreator extends Resource {
  creator: Creator
}

// Types pour favoris (existants)
export interface Favorite {
  id: string
  user_id: string
  ressource_id: string
  created_at?: string
}

export interface Rating {
  id: string
  user_id: string
  ressource_id: string
  rating: number
  created_at?: string
}

// Types pour follows (abonnements créateurs)
export interface Follow {
  id: string
  user_id: string
  creator_id: string
  created_at: string
}

// Types pour recherches sauvegardées (alertes)
export interface SavedSearch {
  id: string
  user_id: string
  name: string
  filters: Record<string, unknown> // FilterState sérialisé
  is_active: boolean
  last_checked_at: string | null
  created_at: string
}

// Types pour notifications
export type NotificationType = 'new_content' | 'search_match' | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string | null
  ressource_id: string | null
  creator_id: string | null
  saved_search_id: string | null
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
  // Relations optionnelles (dépend de la query)
  ressource?: Ressource
  creator?: Creator
  saved_search?: SavedSearch
}

// Types pour achats
export interface Purchase {
  id: string
  buyer_id: string
  ressource_id: string
  credits_spent: number
  free_credits_spent: number
  paid_credits_spent: number
  paid_value_eur_cents: number
  creator_earning_eur_cents: number
  purchased_at: string
}

// Types Crédits V2
export type CreditType = 'free' | 'paid' | 'mixed'
export type TransactionType = 'purchase' | 'spent' | 'refund' | 'bonus' | 'sale_earning' | 'promo_code' | 'registration_bonus' | 'purchase_bonus' | 'admin_grant'

export interface CreditsTransaction {
  id: string
  user_id: string
  type: TransactionType
  credits_amount: number
  credit_type: CreditType | null
  free_amount: number
  paid_amount: number
  unit_value_cents: number | null
  price_eur_cents: number | null
  stripe_payment_intent_id: string | null
  promo_code_id: string | null
  related_purchase_id: string | null
  related_ressource_id: string | null
  description: string | null
  created_at: string
}

export interface CreditUnit {
  id: string
  user_id: string
  credit_type: 'free' | 'paid'
  quantity: number
  unit_value_cents: number
  source: 'stripe_pack' | 'promo_code' | 'registration' | 'admin_grant' | 'purchase_bonus'
  source_ref: string | null
  acquired_at: string
}

export interface PromoCode {
  id: string
  code: string
  free_credits: number
  max_uses: number | null
  current_uses: number
  allow_multiple_per_user: boolean
  expires_at: string | null
  created_by: string | null
  is_active: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export interface PromoCodeRedemption {
  id: string
  promo_code_id: string
  user_id: string
  credits_granted: number
  redeemed_at: string
}

export interface PurchaseBonus {
  id: string
  pack_id: string
  pack_name: string | null
  pack_credits: number
  pack_price_cents: number
  bonus_free_credits: number
  is_active: boolean
}

export interface AppConfig {
  key: string
  value: Record<string, unknown>
  description: string | null
  updated_at: string
}

export interface RegistrationBonusConfig {
  enabled: boolean
  free_credits: number
}

export interface CreditBreakdown {
  free_balance: number
  paid_balance: number
  total_balance: number
  paid_total_value_cents: number
  paid_avg_unit_value_cents: number
}

// Credit packs pour Stripe
export interface CreditPack {
  id: string
  name: string
  credits: number
  price_cents: number
  unit_value_cents: number
  bonus_free_credits: number
}

// ==========================================
// BUNDLES / PACKS
// ==========================================

/** Item simplifié d'un bundle (référence à une ressource) */
export interface BundleItem {
  id: string
  title: string
  vignette_url: string | null
  price_credits?: number
}

/** Bundle/Pack de ressources */
export interface Bundle {
  id: string
  creator_id: string
  slug: string
  title: string
  description: string | null
  vignette_url: string | null
  /** Liste des ressources incluses dans le pack */
  items: BundleItem[]
  /** IDs des ressources (pour les queries) */
  ressource_ids: string[]
  /** Prix du pack en crédits */
  price_credits: number
  /** Prix total si acheté séparément (calculé ou override) */
  original_price_credits: number | null
  age_min: number | null
  age_max: number | null
  themes: string[] | null
  categories: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  // Relations
  creator?: Creator
}

export interface BundleWithCreator extends Bundle {
  creator: Creator
}

// Helpers
export function getLocalizedTitle(resource: Resource, lang: Language): string {
  if (lang === 'en' && resource.title_en) return resource.title_en
  return resource.title_fr
}

export function getLocalizedDescription(resource: Resource, lang: Language): string {
  if (lang === 'en' && resource.description_en) return resource.description_en
  return resource.description_fr
}

export function formatAgeRange(minMonths: number | null, maxMonths: number | null, lang: Language): string {
  if (minMonths === null && maxMonths === null) return ''

  const formatAge = (months: number) => {
    if (months < 12) return `${months} mois`
    const years = Math.floor(months / 12)
    return lang === 'fr' ? `${years} an${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`
  }

  if (minMonths !== null && maxMonths !== null) {
    return `${formatAge(minMonths)} - ${formatAge(maxMonths)}`
  }
  if (minMonths !== null) return `${formatAge(minMonths)}+`
  if (maxMonths !== null) return `0 - ${formatAge(maxMonths)}`
  return ''
}

export function formatCreditsPrice(credits: number): string {
  return `${credits} crédit${credits > 1 ? 's' : ''}`
}
