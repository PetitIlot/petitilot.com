'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Language, Creator, Ressource, PageBlock } from '@/lib/types'
import type { ContentBlocksData } from '@/lib/blocks/types'
import { FreeformCanvas } from '@/components/canvas/FreeformCanvas'
import { CREATOR_PAGE_BLOCK_TYPES } from '@/lib/blocks/types'

// ─── Legacy block renderer (backward compat) ─────────────────────────────────

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

function LegacyBlockRenderer({ block, creator, lang }: { block: PageBlock; creator: Creator; lang: Language }) {
  const c = block.content as Record<string, string>

  switch (block.type) {
    case 'hero': {
      const bgClass = c.bgColor === 'sage'
        ? 'bg-sage/10'
        : c.bgColor === 'mauve'
        ? 'bg-mauve/10'
        : 'bg-surface-secondary'
      return (
        <div className={`p-8 rounded-2xl text-center ${bgClass}`}>
          {creator.avatar_url && (
            <img src={creator.avatar_url} alt={creator.display_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/30" />
          )}
          <h2 className="font-quicksand text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {c.title || creator.display_name}
          </h2>
          {c.subtitle && <p className="text-lg" style={{ color: 'var(--foreground-secondary)' }}>{c.subtitle}</p>}
          {creator.themes && creator.themes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {creator.themes.map(theme => (
                <span key={theme} className="px-3 py-1 rounded-full text-sm bg-sage/20 text-sage font-medium">{theme}</span>
              ))}
            </div>
          )}
        </div>
      )
    }
    case 'bio':
      return <p className="leading-relaxed whitespace-pre-wrap text-base" style={{ color: 'var(--foreground)' }}>{c.text}</p>
    case 'text':
      return (
        <div>
          {c.title && <h3 className="font-quicksand text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>{c.title}</h3>}
          <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--foreground-secondary)' }}>{c.text}</p>
        </div>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-sage pl-5 py-2 my-2">
          <p className="text-xl italic mb-2" style={{ color: 'var(--foreground)' }}>"{c.text}"</p>
          {c.author && <cite className="text-sm not-italic" style={{ color: 'var(--foreground-secondary)' }}>— {c.author}</cite>}
        </blockquote>
      )
    case 'image':
      return c.url ? (
        <div>
          <div className="rounded-2xl overflow-hidden">
            <img src={c.url} alt={c.alt || ''} className="w-full max-h-96 object-cover" />
          </div>
          {c.caption && <p className="text-xs text-center mt-2" style={{ color: 'var(--foreground-secondary)' }}>{c.caption}</p>}
        </div>
      ) : null
    case 'divider':
      return <hr className="my-2" style={{ borderColor: 'var(--border)' }} />
    case 'socials': {
      const links = [
        creator.instagram_handle && c.showInstagram !== 'false'
          ? { label: 'Instagram', icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, href: `https://instagram.com/${creator.instagram_handle!.replace('@', '')}`, handle: creator.instagram_handle }
          : null,
        creator.youtube_handle && c.showYoutube !== 'false'
          ? { label: 'YouTube', icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: `https://youtube.com/@${creator.youtube_handle!.replace('@', '')}`, handle: creator.youtube_handle }
          : null,
        creator.tiktok_handle && c.showTiktok !== 'false'
          ? { label: 'TikTok', icon: TikTokIcon, href: `https://tiktok.com/@${creator.tiktok_handle!.replace('@', '')}`, handle: creator.tiktok_handle }
          : null,
        creator.website_url && c.showWebsite !== 'false'
          ? { label: 'Site web', icon: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, href: creator.website_url!.startsWith('http') ? creator.website_url! : `https://${creator.website_url}`, handle: creator.website_url }
          : null,
      ].filter(Boolean)
      if (links.length === 0) return null
      return (
        <div className="flex flex-wrap gap-3">
          {links.map((link, idx) => {
            const Icon = link!.icon
            return (
              <a key={idx} href={link!.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm hover:bg-sage hover:text-white transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <Icon className="w-4 h-4" />
                <span>{link!.handle}</span>
              </a>
            )
          })}
        </div>
      )
    }
    case 'cta': {
      const href = c.link || `/${lang}/createurs/${creator.slug}`
      const isPrimary = !c.style || c.style === 'primary'
      return (
        <div className="py-4 flex justify-center">
          <Link href={href}>
            <Button gem={isPrimary ? 'sage' : 'neutral'} variant={isPrimary ? 'default' : 'outline'}>
              {c.text || 'Voir mes ressources'}
            </Button>
          </Link>
        </div>
      )
    }
    default:
      return null
  }
}

// ─── Default legacy template ──────────────────────────────────────────────────

function buildDefaultBlocks(creator: Creator): PageBlock[] {
  const id = () => Math.random().toString(36).slice(2, 9)
  const blocks: PageBlock[] = []
  blocks.push({ id: id(), type: 'hero', content: { title: creator.display_name, subtitle: creator.bio || 'Ressources éducatives pour les 0-6 ans', bgColor: 'sage' } })
  if (creator.bio) blocks.push({ id: id(), type: 'bio', content: { text: creator.bio } })
  const hasSocials = creator.instagram_handle || creator.youtube_handle || creator.tiktok_handle || creator.website_url
  if (hasSocials) blocks.push({ id: id(), type: 'socials', content: { showInstagram: 'true', showYoutube: 'true', showTiktok: 'true', showWebsite: 'true' } })
  blocks.push({ id: id(), type: 'cta', content: { text: 'Voir mes ressources', link: '', style: 'primary' } })
  return blocks
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const translations = {
  fr: { back: 'Retour', notFound: 'Créateur non trouvé' },
  en: { back: 'Back', notFound: 'Creator not found' },
  es: { back: 'Volver', notFound: 'Creador no encontrado' },
}

function isCanvasFormat(content: unknown): content is ContentBlocksData {
  return content != null && typeof content === 'object' && 'canvas' in (content as object) && 'layout' in (content as object)
}

export default function CreatorPublicPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [slug, setSlug] = useState('')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Ressource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l, slug: s }) => { setLang(l as Language); setSlug(s) })
  }, [params])

  const t = translations[lang]

  useEffect(() => {
    if (!slug) return
    const fetchCreator = async () => {
      const supabase = createClient()
      const { data: creatorData, error } = await supabase
        .from('creators')
        .select('*')
        .eq('slug', slug)
        .eq('is_approved', true)
        .single()

      if (error || !creatorData) { setIsLoading(false); return }
      setCreator(creatorData as Creator)

      const { data: resourcesData } = await supabase
        .from('ressources')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20)

      setResources((resourcesData || []) as Ressource[])
      setIsLoading(false)
    }
    fetchCreator()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--foreground)' }}>{t.notFound}</p>
          <Button variant="outline" onClick={() => router.back()} style={{ border: '1px solid var(--border)' }}>{t.back}</Button>
        </div>
      </div>
    )
  }

  const pageContent = creator.page_content

  // ── New canvas format — readOnly FreeformCanvas ─────────────────────────────
  if (isCanvasFormat(pageContent)) {
    const formData = {
      creator: {
        id: creator.id,
        slug: creator.slug,
        display_name: creator.display_name,
        avatar_url: creator.avatar_url,
        bio: creator.bio,
        instagram_handle: creator.instagram_handle,
        youtube_handle: creator.youtube_handle,
        tiktok_handle: creator.tiktok_handle,
        website_url: creator.website_url,
        total_resources: resources.length,
        followers_count: 0,
        themes: creator.themes,
      },
      creatorResources: resources.map(r => ({
        id: r.id!,
        title: r.title,
        type: r.type,
        vignette_url: r.vignette_url,
        price_credits: r.price_credits,
      })),
    }

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
        {/* Slim back header */}
        <div
          className="sticky top-0 z-50 flex items-center px-4 py-2.5"
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-colors hover:bg-[var(--surface-secondary)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
        </div>

        {/* Canvas — readOnly, same visual as the editor */}
        <motion.div className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FreeformCanvas
            initialData={pageContent as ContentBlocksData}
            lang={lang}
            readOnly={true}
            formData={formData}
            availableBlockTypes={CREATOR_PAGE_BLOCK_TYPES}
          />
        </motion.div>
      </div>
    )
  }

  // ── Legacy format (backward compat) ─────────────────────────────────────────
  const legacyBlocks: PageBlock[] =
    Array.isArray(pageContent) && pageContent.length > 0
      ? (pageContent as PageBlock[])
      : buildDefaultBlocks(creator)

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="outline" gem="neutral" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t.back}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl shadow-elevation-1 overflow-hidden mb-8 p-6 md:p-8 space-y-6"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
        >
          {legacyBlocks.map(block => (
            <LegacyBlockRenderer key={block.id} block={block} creator={creator} lang={lang} />
          ))}
        </motion.div>

        {/* Resources grid (legacy view) */}
        {resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl shadow-elevation-1 overflow-hidden p-6 md:p-8"
            style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <h2 className="font-quicksand text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              Mes ressources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(resource => (
                <Link key={resource.id} href={`/${lang}/activites/${resource.id}`} className="block">
                  <div className="flex gap-4 p-4 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all"
                    style={{ border: '1px solid var(--border)' }}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                      {resource.vignette_url
                        ? <img src={resource.vignette_url} alt={resource.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>{resource.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
