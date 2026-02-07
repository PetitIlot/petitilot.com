'use client'

import { RessourceWithCreator } from '@/lib/supabase-queries'
import { CarouselBlockData, BlockStyle } from '@/lib/blocks/types'
import GalleryCarousel from '@/components/ui/GalleryCarousel'

interface CarouselBlockProps {
  activity: RessourceWithCreator
  data: CarouselBlockData
  style: BlockStyle
  isEditing?: boolean
}

export default function CarouselBlock({ activity, data, style, isEditing }: CarouselBlockProps) {
  // Combine images_urls et gallery_urls
  const allImages = [
    ...(activity.images_urls || []),
    ...(activity.gallery_urls || [])
  ].filter(Boolean)

  if (allImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-secondary dark:bg-surface-dark rounded-xl">
        <span className="text-foreground-secondary">Aucune image disponible</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <GalleryCarousel
        images={allImages}
        alt={activity.title}
        className="w-full h-full"
        showDots={data.showDots}
        showArrows={data.showArrows}
        autoPlay={data.autoPlay}
        interval={data.interval}
      />
    </div>
  )
}
