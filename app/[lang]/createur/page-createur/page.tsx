'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, CheckCircle2, Eye, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { FreeformCanvas } from '@/components/canvas/FreeformCanvas'
import type { ContentBlocksData } from '@/lib/blocks/types'
import { CREATOR_PAGE_BLOCK_TYPES, DEFAULT_CANVAS_CONFIG, BLOCK_PRESETS, createBlock } from '@/lib/blocks/types'
import type { Language, Creator } from '@/lib/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isCanvasFormat(content: unknown): content is ContentBlocksData {
  return (
    content != null &&
    typeof content === 'object' &&
    'canvas' in (content as object) &&
    'layout' in (content as object)
  )
}

function buildDefaultCanvasData(creator: Creator): ContentBlocksData {
  const profileHeroBlock = createBlock(
    'profile-hero',
    BLOCK_PRESETS['profile-hero'].data!,
    { x: 20, y: 20, width: 760, height: 'auto', zIndex: 10 },
    BLOCK_PRESETS['profile-hero'].style
  )

  const separatorBlock = createBlock(
    'separator',
    BLOCK_PRESETS['separator'].data!,
    { x: 20, y: 280, width: 760, height: 32, zIndex: 1 }
  )

  const resourcesBlock = createBlock(
    'creator-resources',
    BLOCK_PRESETS['creator-resources'].data!,
    { x: 20, y: 340, width: 760, height: 'auto', zIndex: 1 },
    BLOCK_PRESETS['creator-resources'].style
  )

  const textBlock = createBlock(
    'text',
    {
      ...BLOCK_PRESETS['text'].data!,
      content: '<p>Présentez-vous ici… partagez votre vision, votre pédagogie, ce qui vous a amené à créer des ressources pour les 0-6 ans.</p>'
    },
    { x: 20, y: 700, width: 760, height: 'auto', zIndex: 1 }
  )

  return {
    version: 2,
    canvas: { ...DEFAULT_CANVAS_CONFIG, width: 800 },
    layout: { desktop: [profileHeroBlock, separatorBlock, resourcesBlock, textBlock] },
    metadata: {
      lastEditedAt: new Date().toISOString(),
      templateName: 'default-creator'
    }
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CreatorPageEditor({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [creator, setCreator] = useState<Creator | null>(null)
  const [resources, setResources] = useState<Array<{
    id: string; title: string; type: string | null; vignette_url: string | null; price_credits: number | null
  }>>([])
  const [canvasData, setCanvasData] = useState<ContentBlocksData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    params.then(({ lang: l }) => setLang(l as Language))
  }, [params])

  useEffect(() => {
    if (!lang) return

    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/${lang}/connexion`); return }

      const { data: creatorData } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!creatorData) { router.push(`/${lang}/devenir-createur`); return }

      setCreator(creatorData as Creator)

      const { data: resourcesData } = await supabase
        .from('ressources')
        .select('id, title, type, vignette_url, price_credits')
        .eq('creator_id', creatorData.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20)

      setResources((resourcesData ?? []) as typeof resources)

      if (creatorData.page_content) {
        if (isCanvasFormat(creatorData.page_content)) {
          setCanvasData(creatorData.page_content as ContentBlocksData)
        } else {
          setCanvasData(buildDefaultCanvasData(creatorData as Creator))
        }
      } else {
        setCanvasData(buildDefaultCanvasData(creatorData as Creator))
      }

      setIsLoading(false)
    }

    load()
  }, [lang, router])

  const handleCanvasChange = useCallback((data: ContentBlocksData) => {
    setCanvasData(data)
  }, [])

  const handleSave = async () => {
    if (!creator || !canvasData) return
    setIsSaving(true)

    try {
      const supabase = createClient()
      const updated: ContentBlocksData = {
        ...canvasData,
        metadata: { ...canvasData.metadata, lastEditedAt: new Date().toISOString() }
      }
      const { error } = await supabase
        .from('creators')
        .update({ page_content: updated })
        .eq('id', creator.id)

      if (!error) {
        setSavedAt(new Date())
        setTimeout(() => setSavedAt(null), 3000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--sage)' }} />
      </div>
    )
  }

  if (!creator) return null

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
    creatorResources: resources,
  }

  // ── Preview mode — rendu pleine page, bouton "Éditer" dans la barre du header ─
  if (isPreviewMode) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
        {/* Bouton "Éditer" fixé au niveau du header principal (h-12 = 48px) */}
        <div
          className="fixed z-[200] flex items-center pr-4"
          style={{ top: 0, right: 0, height: 48 }}
        >
          <Button gem="mauve" size="sm" onClick={() => setIsPreviewMode(false)}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Éditer
          </Button>
        </div>

        {/* Canvas full-page readOnly — vrai rendu */}
        <div className="flex-1 overflow-hidden">
          <FreeformCanvas
            initialData={canvasData}
            lang={lang}
            readOnly={true}
            formData={formData}
            availableBlockTypes={CREATOR_PAGE_BLOCK_TYPES}
          />
        </div>
      </div>
    )
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Toolbar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 gap-4"
        style={{
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link href={`/${lang}/createur`}>
            <button
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-colors hover:bg-[var(--surface-secondary)]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>
          <div className="w-px h-5" style={{ backgroundColor: 'var(--border)' }} />
          <h1 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            Ma page créateur
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button gem="mauve" variant="outline" size="sm" onClick={() => setIsPreviewMode(true)}>
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Aperçu</span>
          </Button>

          {savedAt && (
            <span
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ color: 'var(--sage)', backgroundColor: 'color-mix(in srgb, var(--sage) 15%, transparent)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sauvegardé
            </span>
          )}

          <Button gem="sage" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              : <Save className="w-3.5 h-3.5 mr-1.5" />
            }
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Canvas éditable */}
      <div className="flex-1 overflow-hidden">
        <FreeformCanvas
          initialData={canvasData}
          onChange={handleCanvasChange}
          lang={lang}
          formData={formData}
          availableBlockTypes={CREATOR_PAGE_BLOCK_TYPES}
        />
      </div>
    </div>
  )
}
