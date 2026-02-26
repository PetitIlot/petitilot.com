/**
 * Helper pour gérer les images Cloudinary
 * - getCloudinaryUrl: génère des URLs optimisées
 * - uploadToCloudinary: unsigned upload pour les créateurs
 */

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload un fichier vers Cloudinary (unsigned upload via preset)
 * @param file - Fichier à uploader
 * @param folder - Dossier Cloudinary (ex: "petit-ilot/resources")
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'petit-ilot/resources'
): Promise<CloudinaryUploadResult> {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary non configuré. Vérifiez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || 'Erreur upload Cloudinary')
  }

  return response.json()
}

/**
 * Vérifie si Cloudinary est configuré pour l'upload
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && uploadPreset)
}

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
