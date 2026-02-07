'use client'

import { useState } from 'react'
import { ContentBlock, BlockStyle, BlockType } from '@/lib/blocks/types'
import { Settings, Palette, Move, Type, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlockPropertiesPanelProps {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
}

const presetColors = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'Surface', value: 'surface' },
  { name: 'Sage', value: 'sage' },
  { name: 'Terracotta', value: 'terracotta' },
  { name: 'Sky', value: 'sky' },
  { name: 'Mauve', value: 'mauve' },
]

const shadowOptions = [
  { name: 'Aucune', value: 'none' },
  { name: 'Petite', value: 'sm' },
  { name: 'Moyenne', value: 'md' },
  { name: 'Grande', value: 'lg' },
  { name: 'Apple', value: 'apple' },
]

export default function BlockPropertiesPanel({ block, onUpdate }: BlockPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'position' | 'data'>('style')

  const updateStyle = (updates: Partial<BlockStyle>) => {
    onUpdate({
      style: { ...block.style, ...updates }
    })
  }

  const updatePosition = (updates: Partial<typeof block.position>) => {
    onUpdate({
      position: { ...block.position, ...updates }
    })
  }

  const updateData = (updates: Partial<typeof block.data>) => {
    onUpdate({
      data: { ...block.data, ...updates }
    })
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-foreground dark:text-foreground-dark flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Propriétés du bloc
        </h3>
        <p className="text-xs text-foreground-secondary mt-1">
          Type: {block.type}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: 'style', icon: Palette, label: 'Style' },
          { id: 'position', icon: Move, label: 'Position' },
          { id: 'data', icon: Type, label: 'Données' },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium
                ${activeTab === tab.id
                  ? 'text-sage border-b-2 border-sage'
                  : 'text-foreground-secondary hover:text-foreground'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {/* Style Tab */}
        {activeTab === 'style' && (
          <>
            {/* Background */}
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-2">
                Couleur de fond
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateStyle({ backgroundPreset: color.value as any })}
                    className={`
                      h-8 rounded-lg text-xs font-medium
                      ${block.style.backgroundPreset === color.value
                        ? 'ring-2 ring-sage ring-offset-1'
                        : ''
                      }
                    `}
                    style={{
                      backgroundColor:
                        color.value === 'transparent' ? 'transparent' :
                        color.value === 'surface' ? 'var(--surface)' :
                        color.value === 'sage' ? 'rgba(122, 139, 111, 0.2)' :
                        color.value === 'terracotta' ? 'rgba(212, 165, 154, 0.2)' :
                        color.value === 'sky' ? 'rgba(90, 200, 250, 0.2)' :
                        'rgba(204, 166, 200, 0.2)',
                      border: color.value === 'transparent' ? '1px dashed var(--border)' : 'none'
                    }}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-2">
                Arrondi: {block.style.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="32"
                value={block.style.borderRadius || 0}
                onChange={(e) => updateStyle({ borderRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Padding */}
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-2">
                Padding: {block.style.padding}px
              </label>
              <input
                type="range"
                min="0"
                max="48"
                value={block.style.padding || 0}
                onChange={(e) => updateStyle({ padding: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Shadow */}
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-2">
                Ombre
              </label>
              <select
                value={block.style.shadow || 'none'}
                onChange={(e) => updateStyle({ shadow: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
              >
                {shadowOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Border */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground-secondary">
                Bordure visible
              </span>
              <button
                onClick={() => updateStyle({ border: !block.style.border })}
                className={`
                  w-10 h-6 rounded-full transition-colors
                  ${block.style.border ? 'bg-sage' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    block w-4 h-4 rounded-full bg-white shadow-sm transition-transform
                    ${block.style.border ? 'translate-x-5' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-2">
                Opacité: {block.style.opacity ?? 100}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={block.style.opacity ?? 100}
                onChange={(e) => updateStyle({ opacity: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Position Tab */}
        {activeTab === 'position' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Position X (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={block.position.x}
                  onChange={(e) => updatePosition({ x: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Position Y (px)
                </label>
                <input
                  type="number"
                  min="0"
                  value={block.position.y}
                  onChange={(e) => updatePosition({ y: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Largeur (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={block.position.width}
                  onChange={(e) => updatePosition({ width: parseInt(e.target.value) || 100 })}
                  className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-secondary mb-1">
                  Hauteur
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="50"
                    value={block.position.height === 'auto' ? '' : block.position.height}
                    placeholder="auto"
                    onChange={(e) => updatePosition({
                      height: e.target.value ? parseInt(e.target.value) : 'auto'
                    })}
                    className="flex-1 p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
                  />
                  <button
                    onClick={() => updatePosition({ height: 'auto' })}
                    className={`px-2 py-1 rounded text-xs ${
                      block.position.height === 'auto'
                        ? 'bg-sage text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-secondary mb-1">
                Z-Index (ordre d'empilement)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={block.position.zIndex}
                onChange={(e) => updatePosition({ zIndex: parseInt(e.target.value) || 1 })}
                className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
              />
            </div>
          </>
        )}

        {/* Data Tab - Specific to block type */}
        {activeTab === 'data' && (
          <BlockDataEditor block={block} onUpdate={updateData} />
        )}
      </div>
    </div>
  )
}

// Composant pour éditer les données spécifiques de chaque type de bloc
function BlockDataEditor({
  block,
  onUpdate
}: {
  block: ContentBlock
  onUpdate: (updates: any) => void
}) {
  const data = block.data as any

  switch (block.type) {
    case 'title':
      return (
        <div className="space-y-3">
          <Toggle
            label="Afficher les badges"
            checked={data.showBadges}
            onChange={(v) => onUpdate({ showBadges: v })}
          />
          <Toggle
            label="Afficher les thèmes"
            checked={data.showThemes}
            onChange={(v) => onUpdate({ showThemes: v })}
          />
          <Toggle
            label="Afficher les compétences"
            checked={data.showCompetences}
            onChange={(v) => onUpdate({ showCompetences: v })}
          />
          <Select
            label="Taille du titre"
            value={data.titleSize}
            options={[
              { value: 'sm', label: 'Petit' },
              { value: 'md', label: 'Moyen' },
              { value: 'lg', label: 'Grand' },
              { value: 'xl', label: 'Très grand' },
            ]}
            onChange={(v) => onUpdate({ titleSize: v })}
          />
          <Select
            label="Alignement"
            value={data.alignment}
            options={[
              { value: 'left', label: 'Gauche' },
              { value: 'center', label: 'Centre' },
              { value: 'right', label: 'Droite' },
            ]}
            onChange={(v) => onUpdate({ alignment: v })}
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-3">
          <NumberInput
            label="Index de l'image (0 = principale)"
            value={data.imageIndex}
            min={0}
            onChange={(v) => onUpdate({ imageIndex: v })}
          />
          <Select
            label="Ajustement"
            value={data.objectFit}
            options={[
              { value: 'cover', label: 'Couvrir' },
              { value: 'contain', label: 'Contenir' },
              { value: 'fill', label: 'Remplir' },
            ]}
            onChange={(v) => onUpdate({ objectFit: v })}
          />
          <Toggle
            label="Overlay sombre"
            checked={data.showOverlay}
            onChange={(v) => onUpdate({ showOverlay: v })}
          />
        </div>
      )

    case 'text':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground-secondary mb-1">
              Contenu (vide = utilise description)
            </label>
            <textarea
              value={data.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Laissez vide pour utiliser la description de l'activité"
              className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm resize-none h-24"
            />
          </div>
          <Select
            label="Taille"
            value={data.fontSize}
            options={[
              { value: 'sm', label: 'Petit' },
              { value: 'md', label: 'Moyen' },
              { value: 'lg', label: 'Grand' },
            ]}
            onChange={(v) => onUpdate({ fontSize: v })}
          />
          <Select
            label="Alignement"
            value={data.alignment}
            options={[
              { value: 'left', label: 'Gauche' },
              { value: 'center', label: 'Centre' },
              { value: 'right', label: 'Droite' },
              { value: 'justify', label: 'Justifié' },
            ]}
            onChange={(v) => onUpdate({ alignment: v })}
          />
        </div>
      )

    case 'list':
      return (
        <div className="space-y-3">
          <TextInput
            label="Titre de la liste"
            value={data.title || ''}
            placeholder="ex: Matériel nécessaire"
            onChange={(v) => onUpdate({ title: v })}
          />
          <Toggle
            label="Afficher badge recyclage"
            checked={data.showRecupBadge}
            onChange={(v) => onUpdate({ showRecupBadge: v })}
          />
          <Select
            label="Style de puces"
            value={data.bulletStyle}
            options={[
              { value: 'dot', label: '● Point' },
              { value: 'check', label: '✓ Coche' },
              { value: 'number', label: '1. Numéro' },
              { value: 'dash', label: '— Tiret' },
            ]}
            onChange={(v) => onUpdate({ bulletStyle: v })}
          />
          <Select
            label="Colonnes"
            value={String(data.columns)}
            options={[
              { value: '1', label: '1 colonne' },
              { value: '2', label: '2 colonnes' },
              { value: '3', label: '3 colonnes' },
            ]}
            onChange={(v) => onUpdate({ columns: parseInt(v) })}
          />
        </div>
      )

    case 'creator':
      return (
        <div className="space-y-3">
          <Select
            label="Variante"
            value={data.variant}
            options={[
              { value: 'full', label: 'Complet' },
              { value: 'compact', label: 'Compact' },
              { value: 'minimal', label: 'Minimal' },
            ]}
            onChange={(v) => onUpdate({ variant: v })}
          />
          <Toggle
            label="Bouton suivre"
            checked={data.showFollowButton}
            onChange={(v) => onUpdate({ showFollowButton: v })}
          />
          <Toggle
            label="Afficher stats"
            checked={data.showStats}
            onChange={(v) => onUpdate({ showStats: v })}
          />
        </div>
      )

    case 'tip':
      return (
        <div className="space-y-3">
          <Select
            label="Icône"
            value={data.icon}
            options={[
              { value: 'lightbulb', label: '💡 Ampoule' },
              { value: 'star', label: '⭐ Étoile' },
              { value: 'heart', label: '❤️ Cœur' },
              { value: 'info', label: 'ℹ️ Info' },
              { value: 'warning', label: '⚠️ Attention' },
            ]}
            onChange={(v) => onUpdate({ icon: v })}
          />
          <Select
            label="Couleur d'accent"
            value={data.accentColor}
            options={[
              { value: 'sage', label: 'Sage (vert)' },
              { value: 'terracotta', label: 'Terracotta' },
              { value: 'sky', label: 'Sky (bleu)' },
              { value: 'mauve', label: 'Mauve' },
            ]}
            onChange={(v) => onUpdate({ accentColor: v })}
          />
        </div>
      )

    default:
      return (
        <p className="text-sm text-foreground-secondary italic">
          Pas de données configurables pour ce type de bloc.
        </p>
      )
  }
}

// Composants d'UI réutilisables
function Toggle({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-foreground-secondary">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`
          w-10 h-6 rounded-full transition-colors
          ${checked ? 'bg-sage' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            block w-4 h-4 rounded-full bg-white shadow-sm transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground-secondary mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextInput({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground-secondary mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
      />
    </div>
  )
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground-secondary mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full p-2 rounded-lg border border-border bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark text-sm"
      />
    </div>
  )
}
