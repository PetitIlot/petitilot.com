import type { ContentBlocksData, PaywallBlockData, PaywallConfig } from './types'

/**
 * Migration idempotente : convertit un bloc paywall existant
 * en config canvas.paywall et retire le bloc du tableau.
 *
 * Appelée au chargement dans FreeformCanvas et BlockCanvas.
 * Si aucun bloc paywall n'existe, retourne les données inchangées.
 */
export function migratePaywallBlock(data: ContentBlocksData): ContentBlocksData {
  // Si paywall config existe déjà, filtrer les blocs paywall résiduels
  if (data.canvas.paywall?.enabled) {
    const blocks = data.layout.desktop.filter(b => b.type !== 'paywall')
    if (blocks.length === data.layout.desktop.length) return data
    return {
      ...data,
      layout: { ...data.layout, desktop: blocks },
    }
  }

  // Chercher un bloc paywall dans les blocs
  const paywallBlock = data.layout.desktop.find(b => b.type === 'paywall')
  if (!paywallBlock) return data

  const blockData = paywallBlock.data as PaywallBlockData

  // Construire la config paywall depuis les données du bloc
  const paywall: PaywallConfig = {
    enabled: true,
    cutY: paywallBlock.position.y,
    blurIntensity: blockData.blurIntensity ?? 12,
    overlayColor: blockData.overlayColor,
    overlayOpacity: blockData.overlayOpacity ?? 60,
    message: blockData.message ?? 'Contenu premium',
    buttonText: blockData.buttonText ?? 'Débloquer le contenu',
    buttonStyle: blockData.buttonStyle ?? 'gem',
    buttonShape: blockData.buttonShape ?? 'rounded',
    buttonColor: blockData.buttonColor,
    buttonGem: blockData.buttonGem ?? 'gold',
  }

  // Retirer le bloc paywall du tableau
  const blocks = data.layout.desktop.filter(b => b.type !== 'paywall')

  return {
    ...data,
    canvas: { ...data.canvas, paywall },
    layout: { ...data.layout, desktop: blocks },
  }
}
