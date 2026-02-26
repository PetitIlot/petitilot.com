import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Header from '@/components/Header'
import './globals.css'

const inter = localFont({
  src: [
    {
      path: '../public/fonts/inter-latin.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/inter-latin-ext.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Petit Îlot',
  description: 'Ressources éducatives 0-6 ans (No-screen / No-sugar)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
