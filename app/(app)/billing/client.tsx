'use client'
import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { planStatus, PLAN_MESSAGES } from '@/types'
import type { Profile } from '@/types'

export function BillingClient({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const status = planStatus(profile)
  const message = PLAN_MESSAGES[status]

  const handlePortal = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <div className="page-h" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16, maxWidth: 480 }}>
      <h1>Billing</h1>
      {message && <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>{message}</p>}

      {status === 'past_due' ? (
        <button className="btn btn-primary" onClick={handlePortal} disabled={loading}>
          <Icons.CreditCard size={14} />
          {loading ? 'Loading…' : 'Update payment details'}
        </button>
      ) : (
        <button className="btn btn-primary" onClick={handleUpgrade} disabled={loading}>
          <Icons.Star size={14} />
          {loading ? 'Loading…' : 'Subscribe — £4.99/month'}
        </button>
      )}
    </div>
  )
}
