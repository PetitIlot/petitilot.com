'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Check, AlertCircle, Cloud } from 'lucide-react'
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryUrl } from '@/lib/cloudinary'

interface CloudinaryUploaderProps {
  /** Called when upload completes successfully */
  onUpload: (url: string, publicId: string) => void
  /** Called for multiple uploads */
  onUploadMultiple?: (results: Array<{ url: string; publicId: string }>) => void
  /** Allow multiple file selection */
  multiple?: boolean
  /** Cloudinary folder for uploaded assets */
  folder?: string
  /** Max file size in MB (default: 5) */
  maxSizeMB?: number
  /** Accepted file types */
  accept?: string
  /** Compact mode (smaller button) */
  compact?: boolean
}

export function CloudinaryUploader({
  onUpload,
  onUploadMultiple,
  multiple = false,
  folder = 'petit-ilot/resources',
  maxSizeMB = 5,
  accept = 'image/*',
  compact = false,
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isConfigured = isCloudinaryConfigured()

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(files)

    // Validate file sizes
    const oversized = fileArray.find(f => f.size > maxSizeMB * 1024 * 1024)
    if (oversized) {
      setError(`Fichier trop volumineux (max ${maxSizeMB}MB)`)
      return
    }

    // Validate file types
    const invalid = fileArray.find(f => !f.type.startsWith('image/'))
    if (invalid) {
      setError('Seules les images sont acceptées')
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const results: Array<{ url: string; publicId: string }> = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setProgress(Math.round(((i) / fileArray.length) * 100))

        const result = await uploadToCloudinary(file, folder)

        // Use optimized URL
        const optimizedUrl = getCloudinaryUrl(result.public_id, {
          width: 1200,
          quality: 85,
          format: 'auto',
          crop: 'fit',
        })

        results.push({ url: optimizedUrl, publicId: result.public_id })

        // Single upload callback
        if (!multiple) {
          onUpload(optimizedUrl, result.public_id)
        }
      }

      // Multiple upload callback
      if (multiple && onUploadMultiple && results.length > 0) {
        onUploadMultiple(results)
      } else if (results.length === 1) {
        onUpload(results[0].url, results[0].publicId)
      }

      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [folder, maxSizeMB, multiple, onUpload, onUploadMultiple])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <p className="text-[10px] text-amber-800 leading-snug">
          Cloudinary non configuré. Ajoutez <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> dans vos variables d'environnement.
        </p>
      </div>
    )
  }

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={e => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--border-strong)] hover:border-[var(--sage)] transition-colors text-xs text-[var(--foreground-secondary)]"
        >
          {uploading ? (
            <span className="animate-pulse">Upload... {progress}%</span>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloudinary</span>
            </>
          )}
        </button>
        {error && (
          <p className="text-[10px] text-red-500 mt-1">{error}</p>
        )}
      </>
    )
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
          dragOver
            ? 'border-[var(--sage)] bg-[var(--sage)]/5 scale-[1.01]'
            : 'border-[var(--border-strong)] hover:border-[var(--sage)] hover:bg-[var(--surface-secondary)]'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className="flex flex-col items-center justify-center py-5 px-4">
          {uploading ? (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-[var(--sage)] border-t-transparent animate-spin mb-2" />
              <span className="text-xs text-[var(--foreground-secondary)]">
                Upload en cours... {progress}%
              </span>
              {/* Progress bar */}
              <div className="w-full max-w-[200px] h-1 rounded-full bg-[var(--surface-secondary)] mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'var(--sage)' }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{
                background: 'linear-gradient(135deg, var(--sage), #5D6E55)',
              }}>
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-medium text-[var(--foreground)]">
                Glissez ou cliquez pour uploader
              </p>
              <p className="text-[10px] text-[var(--foreground-secondary)] mt-0.5">
                Cloudinary CDN &middot; Max {maxSizeMB}MB &middot; JPG, PNG, WebP
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
          <span className="text-[10px] text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
      )}
    </div>
  )
}
