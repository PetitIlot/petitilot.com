'use client'

import { AlignLeft, AlignCenter, AlignRight, Unlink } from 'lucide-react'
import type { TitleBlockData } from '@/lib/blocks/types'
import { migrateTitleBlock } from '@/lib/blocks/migrateTitleBlock'
import {
  EditorSection, ColorPicker, SliderControl, SelectControl, ToggleControl, FontPicker
} from '../editor'

interface TitleEditorProps {
  data: TitleBlockData
  update: (field: string, value: unknown) => void
  onDetachElement?: (elementName: string) => void
}

export function TitleEditor({ data: rawData, update, onDetachElement }: TitleEditorProps) {
  const data = migrateTitleBlock(rawData)
  const elements = data.elements || { showTitle: true, showSocial: true, showTags: true, showShare: false }
  const social = data.social || { variant: 'classic' as const, style: 'gem' as const }
  const tags = data.tags || { variant: 'classic' as const, alignment: 'left' as const, style: 'gem' as const, shape: 'pill' as const, themeColor: 'sky' as const, competenceColor: 'rose' as const }
  const share = data.share || { variant: 'classic' as const, style: 'gem' as const, shape: 'square' as const, text: 'Partager', gem: 'sage' as const }
  const titleBorder = data.titleBorder || { enabled: false }

  // Count visible elements for detach button logic
  const visibleCount = [elements.showTitle, elements.showSocial, elements.showTags, elements.showShare ?? false].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* === Sous-section Titre === */}
      <EditorSection title="Titre" defaultOpen={true}>
        <div className="space-y-3">
          <SliderControl
            label="Taille du titre"
            value={data.titleSize || 32}
            min={16} max={72} unit="px"
            onChange={v => update('titleSize', v)}
          />
          <FontPicker
            label="Police"
            value={data.fontFamily || 'default'}
            onChange={v => update('fontFamily', v)}
          />
          <SelectControl
            label="Alignement"
            value={data.alignment || 'left'}
            variant="buttons"
            options={[
              { value: 'left', label: 'G', icon: <AlignLeft className="w-3.5 h-3.5" /> },
              { value: 'center', label: 'C', icon: <AlignCenter className="w-3.5 h-3.5" /> },
              { value: 'right', label: 'D', icon: <AlignRight className="w-3.5 h-3.5" /> },
            ]}
            onChange={v => update('alignment', v)}
          />
          <ColorPicker
            label="Couleur titre"
            value={data.titleColor}
            onChange={v => update('titleColor', v)}
          />

          {/* Title text stroke (outline) */}
          <ToggleControl
            label="Contour du texte"
            checked={titleBorder.enabled}
            onChange={v => update('titleBorder', { ...titleBorder, enabled: v })}
          />
          {titleBorder.enabled && (
            <div className="space-y-3 ml-2">
              <ColorPicker
                label="Couleur"
                value={titleBorder.color}
                onChange={v => update('titleBorder', { ...titleBorder, color: v })}
              />
              <SliderControl
                label="Épaisseur"
                value={titleBorder.width || 1}
                min={1} max={4} unit="px"
                onChange={v => update('titleBorder', { ...titleBorder, width: v })}
              />
              <SelectControl
                label="Animation"
                value={titleBorder.animation || 'none'}
                options={[
                  { value: 'none', label: 'Aucune' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'glow', label: 'Lueur' },
                  { value: 'shimmer', label: 'Reflet' },
                ]}
                onChange={v => update('titleBorder', { ...titleBorder, animation: v })}
              />
            </div>
          )}
        </div>
      </EditorSection>

      {/* === Sous-section Social === */}
      <EditorSection title="Social" defaultOpen={false}>
        <div className="space-y-3">
          <SelectControl
            label="Variante"
            value={social.variant}
            variant="buttons"
            options={[
              { value: 'classic', label: 'Classique' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={v => update('social', { ...social, variant: v })}
          />
          <SelectControl
            label="Style"
            value={social.style}
            variant="buttons"
            options={[
              { value: 'gem', label: 'Gem' },
              { value: 'gem-outline', label: 'Outline' },
              { value: 'classic', label: 'Classique' },
            ]}
            onChange={v => update('social', { ...social, style: v })}
          />
          <SelectControl
            label="Forme"
            value={social.shape || 'square'}
            variant="buttons"
            options={[
              { value: 'square', label: 'Carré' },
              { value: 'round', label: 'Rond' },
            ]}
            onChange={v => update('social', { ...social, shape: v })}
          />
          {social.style === 'classic' && (
            <ColorPicker
              label="Couleur"
              value={social.classicColor}
              onChange={v => update('social', { ...social, classicColor: v })}
            />
          )}
        </div>
      </EditorSection>

      {/* === Sous-section Tags & Badges === */}
      <EditorSection title="Tags & Badges" defaultOpen={false}>
        <div className="space-y-3">
          <SelectControl
            label="Variante"
            value={tags.variant}
            variant="buttons"
            options={[
              { value: 'classic', label: 'Classique' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={v => update('tags', { ...tags, variant: v })}
          />
          <SelectControl
            label="Alignement"
            value={tags.alignment}
            variant="buttons"
            options={[
              { value: 'left', label: 'G', icon: <AlignLeft className="w-3.5 h-3.5" /> },
              { value: 'center', label: 'C', icon: <AlignCenter className="w-3.5 h-3.5" /> },
              { value: 'right', label: 'D', icon: <AlignRight className="w-3.5 h-3.5" /> },
            ]}
            onChange={v => update('tags', { ...tags, alignment: v })}
          />
          <SelectControl
            label="Style"
            value={tags.style}
            variant="buttons"
            options={[
              { value: 'gem', label: 'Gem' },
              { value: 'gem-outline', label: 'Outline' },
              { value: 'classic', label: 'Classique' },
            ]}
            onChange={v => update('tags', { ...tags, style: v })}
          />
          <SelectControl
            label="Forme"
            value={tags.shape}
            variant="buttons"
            options={[
              { value: 'pill', label: 'Pillule' },
              { value: 'square', label: 'Carré' },
            ]}
            onChange={v => update('tags', { ...tags, shape: v })}
          />
        </div>
      </EditorSection>

      {/* === Sous-section Partager === */}
      <EditorSection title="Partager" defaultOpen={false}>
        <div className="space-y-3">
          <SelectControl
            label="Variante"
            value={share.variant}
            variant="buttons"
            options={[
              { value: 'classic', label: 'Classique' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={v => update('share', { ...share, variant: v })}
          />
          <SelectControl
            label="Style"
            value={share.style}
            variant="buttons"
            options={[
              { value: 'gem', label: 'Gem' },
              { value: 'gem-outline', label: 'Outline' },
              { value: 'classic', label: 'Classique' },
            ]}
            onChange={v => update('share', { ...share, style: v })}
          />
          <SelectControl
            label="Forme"
            value={share.shape}
            variant="buttons"
            options={[
              { value: 'square', label: 'Carré' },
              { value: 'round', label: 'Rond' },
            ]}
            onChange={v => update('share', { ...share, shape: v })}
          />
          {share.variant === 'classic' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[var(--foreground-secondary)] uppercase tracking-wide font-medium">Texte du bouton</label>
              <input
                type="text"
                value={share.text || 'Partager'}
                onChange={e => update('share', { ...share, text: e.target.value })}
                maxLength={30}
                className="w-full px-2.5 py-1.5 text-xs bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] outline-none focus:border-[var(--sage)]"
                placeholder="Partager"
              />
            </div>
          )}
          {(share.style === 'gem' || share.style === 'gem-outline') && (
            <SelectControl
              label="Couleur"
              value={share.gem || 'sage'}
              options={[
                { value: 'sage', label: 'Sauge' },
                { value: 'mauve', label: 'Mauve' },
                { value: 'rose', label: 'Rose' },
                { value: 'sky', label: 'Ciel' },
                { value: 'amber', label: 'Ambre' },
                { value: 'terracotta', label: 'Terre' },
              ]}
              onChange={v => update('share', { ...share, gem: v })}
            />
          )}
          {share.style === 'classic' && (
            <ColorPicker
              label="Couleur"
              value={share.classicColor}
              onChange={v => update('share', { ...share, classicColor: v })}
            />
          )}
        </div>
      </EditorSection>

      {/* === Sous-section Éléments (visibilité + détachement) === */}
      <EditorSection title="Éléments" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <ToggleControl
              label="Titre"
              checked={elements.showTitle}
              onChange={v => update('elements', { ...elements, showTitle: v })}
            />
            {visibleCount >= 2 && elements.showTitle && onDetachElement && (
              <button
                type="button"
                onClick={() => onDetachElement('title')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
                title="Détacher en bloc séparé"
              >
                <Unlink className="w-3 h-3" /> Détacher
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ToggleControl
              label="Social"
              checked={elements.showSocial}
              onChange={v => update('elements', { ...elements, showSocial: v })}
            />
            {visibleCount >= 2 && elements.showSocial && onDetachElement && (
              <button
                type="button"
                onClick={() => onDetachElement('social')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
                title="Détacher en bloc séparé"
              >
                <Unlink className="w-3 h-3" /> Détacher
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ToggleControl
              label="Tags"
              checked={elements.showTags}
              onChange={v => update('elements', { ...elements, showTags: v })}
            />
            {visibleCount >= 2 && elements.showTags && onDetachElement && (
              <button
                type="button"
                onClick={() => onDetachElement('tags')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
                title="Détacher en bloc séparé"
              >
                <Unlink className="w-3 h-3" /> Détacher
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <ToggleControl
              label="Partager"
              checked={elements.showShare ?? false}
              onChange={v => update('elements', { ...elements, showShare: v })}
            />
            {visibleCount >= 2 && (elements.showShare ?? false) && onDetachElement && (
              <button
                type="button"
                onClick={() => onDetachElement('share')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-secondary)] transition-colors"
                title="Détacher en bloc séparé"
              >
                <Unlink className="w-3 h-3" /> Détacher
              </button>
            )}
          </div>
        </div>
      </EditorSection>
    </div>
  )
}
