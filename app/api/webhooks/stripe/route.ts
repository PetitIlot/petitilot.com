import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

// Client Supabase avec service role pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const packId = session.metadata?.pack_id
    const credits = parseInt(session.metadata?.credits || '0')

    if (!userId || !credits) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ received: true })
    }

    try {
      // Utiliser la nouvelle fonction RPC qui gère :
      // - Ajout des crédits payants avec valeur unitaire
      // - Création des credit_units pour le tracking FIFO
      // - Vérification et ajout du bonus gratuit si applicable
      // - Logging des transactions
      const { data: result, error: rpcError } = await supabaseAdmin.rpc('add_stripe_credits', {
        p_user_id: userId,
        p_pack_id: packId,
        p_credits: credits,
        p_price_cents: session.amount_total || 0,
        p_stripe_payment_intent_id: session.payment_intent as string
      })

      if (rpcError) {
        console.error('Error crediting user:', rpcError)
        throw rpcError
      }

      const { paid_credits_added, bonus_credits_added, unit_value_cents } = result || {}

      console.log(`Successfully credited user ${userId}:`)
      console.log(`  - ${paid_credits_added} paid credits (${unit_value_cents} cents/unit)`)
      if (bonus_credits_added > 0) {
        console.log(`  - ${bonus_credits_added} bonus free credits`)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      // On retourne quand même 200 pour éviter les retries Stripe
      // mais on log l'erreur pour investigation
    }
  }

  return NextResponse.json({ received: true })
}

// Désactiver le body parser par défaut pour les webhooks
export const config = {
  api: {
    bodyParser: false
  }
}
