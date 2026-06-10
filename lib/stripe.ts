import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const PLAN = {
  name: 'Taska Pro',
  price: 4.99,
  currency: 'gbp',
  trialDays: 30,
  features: [
    'Unlimited clients & projects',
    'Task management with due dates',
    'Dashboard due-date alerts',
    'Archive completed projects',
  ],
}

export async function getOrCreateCustomer(userId: string, email: string, name?: string | null) {
  const existing = await stripe.customers.search({
    query: `metadata['supabase_uid']:'${userId}'`,
    limit: 1,
  })
  if (existing.data.length > 0) return existing.data[0]
  return stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { supabase_uid: userId },
  })
}
