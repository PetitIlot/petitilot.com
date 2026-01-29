import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url || !url.includes('instagram.com')) {
    return NextResponse.json({ error: 'URL Instagram invalide' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    })

    const html = await response.text()

    // Extraire og:image depuis les meta tags
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/)

    if (ogImageMatch && ogImageMatch[1]) {
      // Décoder les entités HTML (&amp; -> &)
      const thumbnail = ogImageMatch[1].replace(/&amp;/g, '&')
      return NextResponse.json({ thumbnail })
    }

    return NextResponse.json({ error: 'Thumbnail non trouvée' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}
