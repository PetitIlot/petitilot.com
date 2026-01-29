/**
 * Helper pour gérer les images Cloudinary
 */

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Génère l'URL Cloudinary optimisée pour une image
 * @param publicId - ID public de l'image sur Cloudinary (ex: "hero-home", "activities/yoga-enfants")
 * @param options - Options de transformation
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale'
  }
): string {
  if (!cloudName) {
    // En développement, si Cloudinary n'est pas configuré, utiliser les images locales
    return `/images/${publicId}`
  }

  const { width, height, quality = 80, format = 'auto', crop = 'fill' } = options || {}

  // Construction de la transformation
  const transformations: string[] = []

  if (width || height) {
    const dimensions = [
      width && `w_${width}`,
      height && `h_${height}`,
      `c_${crop}`
    ].filter(Boolean).join(',')
    transformations.push(dimensions)
  }

  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)

  const transformationString = transformations.join('/')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`
}

/**
 * URL pour le hero de la page d'accueil
 */
export function getHeroImageUrl(): string {
  return getCloudinaryUrl('petit-ilot/hero-home', {
    width: 1920,
    height: 1080,
    quality: 85,
    format: 'webp'
  })
}

/**
 * URL optimisée pour une carte d'activité
 */
export function getActivityImageUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 800,
    height: 600,
    quality: 80,
    format: 'webp',
    crop: 'fill'
  })
}

/**
 * URL optimisée pour une couverture de livre
 */
export function getBookCoverUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 400,
    height: 600,
    quality: 80,
    format: 'webp',
    crop: 'fill'
  })
}
