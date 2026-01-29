// Types existants (catalogue legacy)
export type RessourceType = 'activite' | 'motricite' | 'alimentation' | 'livre' | 'jeu'
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
  age_min: number | null
  age_max: number | null
  themes: string[] | null
  categories: string[] | null
  competences: string[] | null
  difficulte: Difficulte | null
  autonomie: boolean | null
  duration: number | null
  duration_max: number | null
  auteur: string | null
  editeur: string | null
  annee: number | null
  illustrateur: string | null
  isbn: string | null
  collection: string | null
  nb_joueurs_min: number | null
  nb_joueurs_max: number | null
  title: string
  subtitle: string | null
  description: string | null
  astuces: string | null
  materiel: string | null
  vignette_url: string | null
  images_urls: string[] | null
  gallery_urls: string[] | null
  video_url: string | null
  pdf_url: string | null
  is_premium: boolean
  materiel_json: MaterielItem[] | null
  price_credits?: number | null
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
  credits_balance: number
  created_at?: string
  updated_at?: string
}

export interface Creator {
  id?: string
  user_id: string
  slug: string
  display_name: string
  bio: string | null
  philosophy: string | null
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
  created_at: string
  updated_at: string
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

// Types pour achats (futur Sprint 3)
export interface Purchase {
  id: string
  buyer_id: string
  resource_id: string
  credits_spent: number
  price_eur: number | null
  purchased_at: string
  download_url: string | null
  download_count: number
  last_download_at: string | null
}

export interface CreditsTransaction {
  id: string
  user_id: string
  type: 'purchase' | 'spent' | 'refund' | 'bonus'
  credits_amount: number
  price_eur: number | null
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  related_purchase_id: string | null
  description: string | null
  created_at: string
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
