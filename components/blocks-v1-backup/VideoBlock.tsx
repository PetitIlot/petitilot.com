'use client'

import { VideoBlockData, BlockStyle } from '@/lib/blocks/types'
import { RessourceWithCreator } from '@/lib/supabase-queries'
import { Play } from 'lucide-react'

interface VideoBlockProps {
  activity: RessourceWithCreator
  data: VideoBlockData
  style: BlockStyle
  isEditing?: boolean
}

// Détecte la plateforme à partir de l'URL
function detectPlatform(url: string): 'instagram' | 'youtube' | 'tiktok' | 'unknown' {
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  return 'unknown'
}

// Convertit l'URL en URL d'embed
function getEmbedUrl(url: string, platform: string): string {
  switch (platform) {
    case 'instagram':
      return `${url.replace(/\/$/, '')}/embed`
    case 'youtube':
      // Convertir youtube.com/watch?v=ID en youtube.com/embed/ID
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
      return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url
    case 'tiktok':
      // TikTok embed est plus complexe, on garde l'URL directe
      return url
    default:
      return url
  }
}

const aspectRatios = {
  '16:9': 'aspect-video',      // 16/9 = 1.78
  '9:16': 'aspect-[9/16]',     // 9/16 = 0.56 (vertical)
  '1:1': 'aspect-square',       // 1/1 = 1
  '4:5': 'aspect-[4/5]'        // 4/5 = 0.8
}

export default function VideoBlock({ activity, data, style, isEditing }: VideoBlockProps) {
  const videoUrl = activity.video_url

  if (!videoUrl && !isEditing) {
    return null
  }

  if (!videoUrl) {
    return (
      <div className={`w-full ${aspectRatios[data.aspectRatio]} bg-surface-secondary dark:bg-surface-dark rounded-xl flex items-center justify-center`}>
        <div className="text-center text-foreground-secondary">
          <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucune vidéo</p>
        </div>
      </div>
    )
  }

  const platform = data.platform === 'auto' ? detectPlatform(videoUrl) : data.platform
  const embedUrl = getEmbedUrl(videoUrl, platform)

  // Dimensions spécifiques selon la plateforme
  const getIframeDimensions = () => {
    switch (platform) {
      case 'instagram':
        return { width: 400, height: 500 }
      case 'youtube':
        return { width: '100%', height: '100%' }
      case 'tiktok':
        return { width: 325, height: 576 }
      default:
        return { width: '100%', height: '100%' }
    }
  }

  const dimensions = getIframeDimensions()

  return (
    <div className={`w-full flex justify-center ${aspectRatios[data.aspectRatio]}`}>
      <iframe
        src={embedUrl}
        className="rounded-xl border-0"
        width={dimensions.width}
        height={dimensions.height}
        allowFullScreen
        scrolling="no"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}
