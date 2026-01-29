'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import ImageLightbox from './ImageLightbox'

interface GalleryCarouselProps {
  images: string[]
  alt?: string
  className?: string
}

export default function GalleryCarousel({
  images,
  alt = 'Image',
  className = 'w-48'
}: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageRatio, setImageRatio] = useState<'portrait' | 'landscape' | 'square'>('portrait')

  // Détecter le ratio de l'image actuelle
  useEffect(() => {
    if (!images || images.length === 0) return

    const img = new Image()
    img.onload = () => {
      const ratio = img.width / img.height
      if (ratio > 1.1) {
        setImageRatio('landscape')
      } else if (ratio < 0.9) {
        setImageRatio('portrait')
      } else {
        setImageRatio('square')
      }
    }
    img.src = images[currentIndex]
  }, [images, currentIndex])

  if (!images || images.length === 0) return null

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* Image cliquable */}
      <button
        onClick={() => setLightboxOpen(true)}
        className={`relative ${aspectClasses[imageRatio]} w-full rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300`}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
            <ZoomIn className="w-6 h-6 text-[#5D5A4E]" />
          </div>
        </div>
      </button>

      {/* Navigation - flèches et dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={prevImage}
            className="w-8 h-8 bg-white hover:bg-[#F5E6D3] rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#5D5A4E]" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[#A8B5A0] scale-110'
                    : 'bg-[#5D5A4E]/20 hover:bg-[#5D5A4E]/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextImage}
            className="w-8 h-8 bg-white hover:bg-[#F5E6D3] rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#5D5A4E]" />
          </button>
        </div>
      )}

      {/* Indicateur nombre de photos */}
      {images.length > 1 && (
        <p className="mt-2 text-center text-sm text-[#5D5A4E]/60">
          {images.length} photos
        </p>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={alt}
      />
    </div>
  )
}
