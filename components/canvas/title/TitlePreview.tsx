'use client'

import { useEffect, useState } from 'react'
import type { TitleBlockData } from '@/lib/blocks/types'
import { migrateTitleBlock } from '@/lib/blocks/migrateTitleBlock'
import { getFontFamily, loadGoogleFont } from '@/lib/googleFonts'
import { TitleTagsPreview } from './TitleTagsPreview'
import { TitleSocialPreview } from './TitleSocialPreview'
import { TitleShareButton } from './TitleShareButton'
import { getBorderAnimationClass, getBorderAnimationVars } from '@/lib/blocks/borderAnimations'

interface FormDataForTitle {
  title?: string
  type?: string | null
  age_min?: number | null
  age_max?: number | null
  duration?: number | null
  duration_max?: number | null
  duration_prep?: number | null
  intensity?: string | null
  difficulte?: string | null
  autonomie?: boolean | null
  themes?: string[] | null
  competences?: string[] | null
  categories?: string[] | null
  ressourceId?: string
}

interface TitlePreviewProps {
  data: TitleBlockData
  formData?: FormDataForTitle
}

export function TitlePreview({ data: rawData, formData }: TitlePreviewProps) {
  const data = migrateTitleBlock(rawData)

  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const titleSize = typeof data.titleSize === 'number' ? data.titleSize : 32
  const alignment = data.alignment || 'left'
  const fontId = data.fontFamily || 'default'

  useEffect(() => {
    if (fontId) loadGoogleFont(fontId)
  }, [fontId])

  const title = formData?.title || 'Titre de la ressource'
  const elements = data.elements || { showTitle: true, showSocial: true, showTags: true, showShare: false }

  // Border animation
  const animClass = data.borderAnimation?.type && data.borderAnimation.type !== 'none'
    ? getBorderAnimationClass(data.borderAnimation.type)
    : ''
  const animVars = data.borderAnimation?.type && data.borderAnimation.type !== 'none'
    ? getBorderAnimationVars(data.borderAnimation)
    : undefined

  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    position: 'relative',
    ...animVars,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: `${titleSize}px`,
    fontFamily: getFontFamily(fontId),
    color: data.titleColor || 'var(--foreground)',
  }

  // Title text stroke (outline around letters)
  const titleBorder = data.titleBorder
  let titleStrokeClass = ''
  if (titleBorder?.enabled) {
    titleStyle.WebkitTextStroke = `${titleBorder.width || 1}px ${titleBorder.color || 'var(--sage)'}`
    // Animated stroke effects
    if (titleBorder.animation && titleBorder.animation !== 'none') {
      titleStrokeClass = `text-stroke-${titleBorder.animation}`
      ;(titleStyle as Record<string, unknown>)['--stroke-color'] = titleBorder.color || 'var(--sage)'
    }
  }

  // Element styles (for detached elements)
  const applyElementStyle = (elemStyle?: typeof data.titleElementStyle): React.CSSProperties | undefined => {
    if (!elemStyle) return undefined
    return {
      backgroundColor: elemStyle.backgroundColor,
      border: elemStyle.borderColor ? `1px solid ${elemStyle.borderColor}` : undefined,
      borderRadius: elemStyle.borderRadius,
      padding: elemStyle.padding,
    }
  }

  const alignClass = alignment === 'center' ? 'items-center' : alignment === 'right' ? 'items-end' : 'items-start'

  return (
    <div style={containerStyle} className={animClass}>
      <div className={`flex flex-col gap-2 ${alignClass}`}>
        {/* Title element */}
        {elements.showTitle && (
          <div style={applyElementStyle(data.titleElementStyle)}>
            <div className={`font-bold ${titleStrokeClass}`} style={titleStyle}>
              {title}
            </div>
          </div>
        )}

        {/* Social element */}
        {elements.showSocial && (
          <div style={applyElementStyle(data.socialElementStyle)} className="mt-1">
            <TitleSocialPreview
              data={data}
              ressourceId={formData?.ressourceId}
              isDark={isDark}
            />
          </div>
        )}

        {/* Tags element */}
        {elements.showTags && (
          <div style={applyElementStyle(data.tagsElementStyle)} className="mt-1">
            <TitleTagsPreview data={data} formData={formData} isDark={isDark} />
          </div>
        )}

        {/* Share element */}
        {(elements.showShare ?? false) && (
          <div style={applyElementStyle(data.shareElementStyle)} className="mt-1">
            <TitleShareButton
              data={data}
              ressourceId={formData?.ressourceId}
              isDark={isDark}
              formData={formData}
            />
          </div>
        )}
      </div>
    </div>
  )
}
