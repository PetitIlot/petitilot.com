'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus } from 'lucide-react'
import type { Language } from '@/lib/types'
import type { ActivityCardsBlockData, ActivityCardsPresetType, ActivityCardStyle, ActivityCardsLayout } from '@/lib/blocks/types'
import { EditorSection, SelectControl, SliderControl, ToggleControl } from './editor'
import type { RessourceWithCreator } from '@/lib/supabase-queries'
import { supabase } from '@/lib/supabase'

interface ActivityCardsEditorProps {
  data: ActivityCardsBlockData
  update: (field: string, value: unknown) => void
  lang: Language
}

const LAYOUT_OPTIONS: { value: ActivityCardsLayout; label: string; description: string }[] = [
  { value: 'scroll-wide', label: 'Large', description: 'Cartes larges en défilement' },
  { value: 'scroll-compact', label: 'Compact', description: 'Défilement dense, cartes étroites' },
  { value: 'spotlight', label: 'Spotlight', description: 'Carte active mise en avant' },
  { value: 'vertical-stack', label: 'Liste', description: 'Empilage vertical' },
]

const CARD_STYLE_OPTIONS: { value: ActivityCardStyle; label: string; description: string }[] = [
  { value: 'landscape-large', label: 'Paysage L', description: 'Portrait large avec infos' },
  { value: 'landscape-small', label: 'Paysage S', description: 'Immersif avec overlay' },
  { value: 'classic', label: 'Classique', description: 'Carte verticale standard' },
]

const PRESET_OPTIONS: { value: ActivityCardsPresetType; label: string }[] = [
  { value: 'same-type', label: 'Même type' },
  { value: 'same-theme', label: 'Même thème' },
  { value: 'same-competence', label: 'Même compétence' },
  { value: 'random-all', label: 'Aléatoire' },
  { value: 'most-viewed', label: 'Plus vus' },
  { value: 'top-rated', label: 'Mieux notés' },
  { value: 'most-purchased', label: 'Plus achetés' },
]

// ============================================
// Manual resource search
// ============================================
function ManualResourcePicker({
  selectedIds,
  onAdd,
  onRemove,
  lang,
}: {
  selectedIds: string[]
  onAdd: (id: string, title: string) => void
  onRemove: (id: string) => void
  lang: Language
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RessourceWithCreator[]>([])
  const [selectedTitles, setSelectedTitles] = useState<Record<string, string>>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setResults([])
        return
      }
      const { data } = await supabase
        .from('ressources')
        .select('id, title, type, lang, vignette_url, creator:creators!creator_id(id, slug, display_name, avatar_url)')
        .eq('lang', lang)
        .ilike('title', `%${term}%`)
        .limit(8)
      setResults((data || []) as unknown as RessourceWithCreator[])
    },
    [lang]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  const handleAdd = useCallback((resource: RessourceWithCreator) => {
    if (!selectedIds.includes(resource.id)) {
      setSelectedTitles(prev => ({ ...prev, [resource.id]: resource.title }))
      onAdd(resource.id, resource.title)
    }
  }, [selectedIds, onAdd])

  return (
    <div className="space-y-3">
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Rechercher une ressource..."
        className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--sage)]"
      />

      {/* Search results */}
      {results.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-[var(--border)]">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => handleAdd(r)}
              disabled={selectedIds.includes(r.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors disabled:opacity-40 border-b border-[var(--border)] last:border-0"
            >
              <span className="truncate flex-1 text-left">{r.title}</span>
              {!selectedIds.includes(r.id) && (
                <Plus className="w-3.5 h-3.5 text-[var(--sage)] ml-2 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected list */}
      {selectedIds.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Sélectionnées ({selectedIds.length})
          </p>
          {selectedIds.map(id => (
            <div key={id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] text-xs">
              <span className="truncate flex-1 text-[var(--foreground)]">
                {selectedTitles[id] || id}
              </span>
              <button
                onClick={() => onRemove(id)}
                className="ml-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Main editor
// ============================================
export default function ActivityCardsEditor({
  data,
  update,
  lang,
}: ActivityCardsEditorProps) {
  const hasTitle = (data.title ?? '') !== ''

  return (
    <>
      {/* ── Affichage ── */}
      <EditorSection title="Affichage" defaultOpen={true}>
        <div className="space-y-3">
          <SelectControl
            label="Disposition"
            value={data.layout}
            options={LAYOUT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            onChange={v => update('layout', v)}
          />

          <SelectControl
            label="Style de carte"
            value={data.cardStyle}
            options={CARD_STYLE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
            onChange={v => update('cardStyle', v)}
          />

          <SliderControl
            label="Nombre de cartes"
            value={data.limit}
            min={2}
            max={12}
            step={1}
            onChange={v => update('limit', v)}
          />

          <ToggleControl
            label="Titre de section"
            checked={hasTitle}
            onChange={v => update('title', v ? 'À découvrir aussi' : '')}
          />
          {hasTitle && (
            <input
              type="text"
              value={data.title || ''}
              onChange={e => update('title', e.target.value)}
              placeholder="Titre de section..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--sage)]"
            />
          )}
        </div>
      </EditorSection>

      {/* ── Sources ── */}
      <EditorSection title="Sources" defaultOpen={false}>
        <div className="space-y-3">
          <SelectControl
            label="Sélection"
            value={data.selectionMode}
            variant="buttons"
            options={[
              { value: 'preset', label: 'Automatique' },
              { value: 'manual', label: 'Manuel' },
            ]}
            onChange={v => update('selectionMode', v)}
          />

          {data.selectionMode === 'preset' && (
            <SelectControl
              label="Critère"
              value={data.preset || 'random-all'}
              options={PRESET_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
              onChange={v => update('preset', v as ActivityCardsPresetType)}
            />
          )}

          {data.selectionMode === 'manual' && (
            <ManualResourcePicker
              selectedIds={data.manualIds || []}
              lang={lang}
              onAdd={(id) => {
                const ids = [...(data.manualIds || []), id]
                update('manualIds', ids)
              }}
              onRemove={(id) => {
                update('manualIds', (data.manualIds || []).filter(i => i !== id))
              }}
            />
          )}
        </div>
      </EditorSection>

      {/* ── Navigation ── */}
      <EditorSection title="Navigation" defaultOpen={false}>
        <div className="space-y-3">
          {data.layout !== 'vertical-stack' && (
            <ToggleControl
              label="Flèches de navigation"
              checked={data.showArrows}
              onChange={v => update('showArrows', v)}
            />
          )}

          {data.layout === 'spotlight' && (
            <ToggleControl
              label="Points de position"
              checked={data.showDots}
              onChange={v => update('showDots', v)}
            />
          )}

          {data.layout === 'vertical-stack' && (
            <p className="text-[11px] text-[var(--foreground-secondary)] italic">
              La liste verticale n'a pas de navigation.
            </p>
          )}
        </div>
      </EditorSection>
    </>
  )
}
