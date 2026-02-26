import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'

const locales = ['fr', 'en', 'es']

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!locales.includes(lang)) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">{children}</main>
      <Footer lang={lang} />
    </div>
  )
}
