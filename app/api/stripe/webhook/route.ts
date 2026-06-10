import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import type Stripe from 'stripe'

function adminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = adminSupabase()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const userId = session.metadata?.user_id
      if (userId && session.subscription) {
        await db.from('profiles').update({
          plan: 'pro',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const { data: profile } = await db.from('profiles').select('id').eq('stripe_customer_id', sub.customer as string).single()
      if (profile) {
        const active = sub.status === 'active' || sub.status === 'trialing'
        await db.from('profiles').update({
          plan: active ? 'pro' : 'expired',
          stripe_subscription_id: active ? sub.id : null,
        }).eq('id', profile.id)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: profile } = await db.from('profiles').select('id').eq('stripe_customer_id', sub.customer as string).single()
      if (profile) {
        await db.from('profiles').update({ plan: 'expired', stripe_subscription_id: null }).eq('id', profile.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
