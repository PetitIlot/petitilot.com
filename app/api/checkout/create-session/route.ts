import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

const CREDIT_PACKS: Record<string, { credits: number; price: number; name: string }> = {
  pack_5: { credits: 5, price: 499, name: '5 crédits' },
  pack_15: { credits: 15, price: 1199, name: '15 crédits' },
  pack_30: { credits: 30, price: 1999, name: '30 crédits' },
  pack_60: { credits: 60, price: 3499, name: '60 crédits' }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { pack_id, lang = 'fr' } = await request.json()

    // Vérifier que le pack existe
    const pack = CREDIT_PACKS[pack_id]
    if (!pack) {
      return NextResponse.json(
        { error: 'Pack invalide' },
        { status: 400 }
      )
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: pack.name,
              description: `Pack de ${pack.credits} crédits Petit Ilot`,
              images: ['https://petit-ilot.com/logo.png'] // À remplacer par ton logo
            },
            unit_amount: pack.price
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/profil/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/profil/credits?canceled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        pack_id: pack_id,
        credits: pack.credits.toString()
      },
      locale: lang === 'es' ? 'es' : lang === 'en' ? 'en' : 'fr'
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}
