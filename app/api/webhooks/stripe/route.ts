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
      // 1. Créditer l'utilisateur
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          credits_balance: supabaseAdmin.rpc('increment_credits', {
            user_id: userId,
            amount: credits
          })
        })
        .eq('id', userId)

      // Alternative : utiliser la fonction RPC directement
      const { data: newBalance, error: rpcError } = await supabaseAdmin.rpc('increment_credits', {
        user_id: userId,
        amount: credits
      })

      if (rpcError) {
        console.error('Error crediting user:', rpcError)
        throw rpcError
      }

      // 2. Enregistrer la transaction
      const { error: txError } = await supabaseAdmin
        .from('credits_transactions')
        .insert({
          user_id: userId,
          type: 'purchase',
          credits_amount: credits,
          price_eur_cents: session.amount_total,
          stripe_payment_intent_id: session.payment_intent as string,
          description: `Achat ${packId}`
        })

      if (txError) {
        console.error('Error recording transaction:', txError)
      }

      console.log(`Successfully credited ${credits} credits to user ${userId}. New balance: ${newBalance}`)
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
