import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Petit Îlot - Bientôt disponible',
  description: 'Découvrez bientôt une marketplace unique d\'activités, livres et jeux éducatifs pour enfants de 0 à 6 ans. Éducation par la nature, sans écran.',
  openGraph: {
    title: 'Petit Îlot - Bientôt disponible',
    description: 'Marketplace d\'activités éducatives pour enfants 0-6 ans. Nature, DIY, sans écran.',
    type: 'website',
  },
}

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
