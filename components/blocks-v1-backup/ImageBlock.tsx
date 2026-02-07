'use client'

import { RessourceWithCreator } from '@/lib/supabase-queries'
import { ImageBlockData, BlockStyle } from '@/lib/blocks/types'
import { getActivityImageUrl } from '@/lib/cloudinary'

interface ImageBlockProps {
  activity: RessourceWithCreator
  data: ImageBlockData
  style: BlockStyle
  isEditing?: boolean
}

export default function ImageBlock({ activity, data, style, isEditing }: ImageBlockProps) {
  const images = activity.images_urls || []
  const imageSource = images[data.imageIndex] || images[0]

  const imageUrl = imageSource
    ? (imageSource.startsWith('http') ? imageSource : getActivityImageUrl(imageSource))
    : 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800'

  return (
    <div className="relative w-full h-full overflow-hidden rounded-inherit">
      <img
        src={imageUrl}
        alt={activity.title}
        className="w-full h-full"
        style={{ objectFit: data.objectFit }}
      />

      {data.showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      )}

      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            Image {data.imageIndex + 1}
          </span>
        </div>
      )}
    </div>
  )
}
