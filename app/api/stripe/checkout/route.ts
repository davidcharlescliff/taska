import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, getOrCreateCustomer } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const customer = await getOrCreateCustomer(user.id, user.email!, profile?.full_name)

  // Store customer ID
  if (!profile?.stripe_customer_id) {
    await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_PRO_MONTHLY!, quantity: 1 }],
    success_url: `${appUrl}/settings?success=1`,
    cancel_url: `${appUrl}/billing`,
    metadata: { user_id: user.id },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
