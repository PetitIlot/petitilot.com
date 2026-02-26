/**
 * Lazy migration for TitleBlockData v2.1 → v4
 * Called at render time in TitlePreview and TitleEditor.
 * If `data.elements` is absent, fills in v4 defaults.
 */

import type { TitleBlockData } from './types'

const DEFAULT_ELEMENTS = { showTitle: true, showSocial: true, showTags: true, showShare: true }

const DEFAULT_SOCIAL: TitleBlockData['social'] = {
  variant: 'classic',
  style: 'gem',
}

const DEFAULT_TAGS: TitleBlockData['tags'] = {
  variant: 'classic',
  alignment: 'left',
  style: 'gem',
  shape: 'pill',
  themeColor: 'sky',
  competenceColor: 'rose',
}

const DEFAULT_SHARE: TitleBlockData['share'] = {
  variant: 'classic',
  style: 'gem',
  shape: 'square',
  text: 'Partager',
  gem: 'sage',
}

export function migrateTitleBlock(data: TitleBlockData): TitleBlockData {
  // Already migrated — ensure share config exists (added after initial v4)
  if (data.elements) {
    return data.share ? data : { ...data, share: DEFAULT_SHARE }
  }

  return {
    ...data,
    elements: DEFAULT_ELEMENTS,
    social: data.social || DEFAULT_SOCIAL,
    share: data.share || DEFAULT_SHARE,
    tags: data.tags || {
      variant: 'classic' as const,
      alignment: (data.alignment || 'left') as 'left' | 'center' | 'right',
      style: 'gem' as const,
      shape: 'pill' as const,
      themeColor: 'sky' as const,
      competenceColor: 'rose' as const,
    },
  }
}
