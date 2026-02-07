'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Edit3, RefreshCw } from 'lucide-react'
import { Language } from '@/lib/types'
import { getRessourceWithCreator, RessourceWithCreator } from '@/lib/supabase-queries'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BlockCanvas } from '@/components/blocks'
import { generateDefaultLayout, ContentBlocksData } from '@/lib/blocks'

// ID d'une activité existante pour la démo
const DEMO_ACTIVITY_ID = 'bf052aee-ec41-482e-aa7a-4ac183257952'

export default function DemoBlocksPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('fr')
  const [activity, setActivity] = useState<RessourceWithCreator | null>(null)
  const [blocksData, setBlocksData] = useState<ContentBlocksData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    params.then(({ lang: l }) => {
      setLang(l as Language)
    })
  }, [params])

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true)
      const data = await getRessourceWithCreator(DEMO_ACTIVITY_ID)
      setActivity(data)

      if (data) {
        // v2: Layout par défaut (ne dépend plus des données ressource)
        const defaultLayout = generateDefaultLayout()
        setBlocksData(defaultLayout)
      }

      setIsLoading(false)
    }
    fetchActivity()
  }, [])

  const handleRegenerate = () => {
    if (activity) {
      // v2: Layout par défaut (ne dépend plus des données ressource)
      const newLayout = generateDefaultLayout()
      setBlocksData(newLayout)
      setSelectedBlockId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground dark:text-foreground-dark mb-4">Activité non trouvée</p>
          <Link href={`/${lang}/activites`}>
            <Button variant="outline">Retour aux activités</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface dark:bg-surface-dark border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/activites`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-foreground dark:text-foreground-dark">
                Démo Block Canvas
              </h1>
              <p className="text-sm text-foreground-secondary">
                {activity.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Éditer
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Régénérer
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Box */}
        <div className="mb-8 p-4 bg-sky/10 rounded-xl border border-sky/20">
          <h2 className="font-semibold text-foreground dark:text-foreground-dark mb-2">
            🧱 Système Block-based
          </h2>
          <p className="text-sm text-foreground-secondary mb-3">
            Ce système permet aux créateurs de construire leurs fiches ressources avec des blocs modulaires.
            Chaque bloc peut être positionné, redimensionné et stylisé librement.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-surface dark:bg-surface-dark rounded-md">
              📊 {blocksData?.layout.desktop.length || 0} blocs
            </span>
            <span className="px-2 py-1 bg-surface dark:bg-surface-dark rounded-md">
              🎨 Canvas: {blocksData?.canvas.width}px
            </span>
            <span className="px-2 py-1 bg-surface dark:bg-surface-dark rounded-md">
              📱 Responsive: {blocksData?.layout.mobile ? 'Oui' : 'Auto'}
            </span>
          </div>
        </div>

        {/* Block Details (when editing) */}
        {isEditing && selectedBlockId && (
          <div className="mb-6 p-4 bg-sage/10 rounded-xl border border-sage/20">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-2">
              Bloc sélectionné
            </h3>
            {(() => {
              const block = blocksData?.layout.desktop.find(b => b.id === selectedBlockId)
              if (!block) return <p>Bloc non trouvé</p>
              return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-foreground-secondary">Type:</span>
                    <span className="ml-2 font-medium text-foreground dark:text-foreground-dark">{block.type}</span>
                  </div>
                  <div>
                    <span className="text-foreground-secondary">Position:</span>
                    <span className="ml-2 font-medium text-foreground dark:text-foreground-dark">
                      X: {block.position.x}%, Y: {block.position.y}px
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-secondary">Taille:</span>
                    <span className="ml-2 font-medium text-foreground dark:text-foreground-dark">
                      {block.position.width}% × {block.position.height === 'auto' ? 'auto' : `${block.position.height}px`}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-secondary">Z-Index:</span>
                    <span className="ml-2 font-medium text-foreground dark:text-foreground-dark">{block.position.zIndex}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Canvas */}
        <div
          className="bg-surface dark:bg-surface-dark rounded-2xl shadow-apple overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <div className="p-6">
            <BlockCanvas
              blocksData={blocksData}
              activity={activity}
              lang={lang}
              isEditing={isEditing}
              selectedBlockId={selectedBlockId}
              onBlockSelect={setSelectedBlockId}
            />
          </div>
        </div>

        {/* Blocks List */}
        {isEditing && (
          <div className="mt-8">
            <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-4">
              Liste des blocs
            </h3>
            <div className="space-y-2">
              {blocksData?.layout.desktop.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedBlockId === block.id
                      ? 'bg-sage/20 border border-sage'
                      : 'bg-surface-secondary dark:bg-surface-dark hover:bg-surface dark:hover:bg-surface-dark-hover border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-sage/20 text-sage text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground dark:text-foreground-dark">
                        {block.type}
                      </span>
                    </div>
                    <span className="text-xs text-foreground-secondary">
                      {block.position.width}% × {block.position.height === 'auto' ? 'auto' : `${block.position.height}px`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
