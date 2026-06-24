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

  if (status === 'past_due' || status === 'expired') {
    const isPastDue = status === 'past_due'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16, minHeight: '70vh', maxWidth: 480, margin: '0 auto' }}>
        <Icons.AlertTriangle size={48} style={{ color: 'var(--red, #e53)' }} />
        {message && (
          <p style={{ fontSize: 20, fontWeight: 600 }}>
            {isPastDue ? message : (
              <>Your free trial has ended.<br />Subscribe to continue using Taska.</>
            )}
          </p>
        )}
        {isPastDue ? (
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

  if (status === 'pro') {
    return (
      <div className="page-h" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16, maxWidth: 480 }}>
        <h1>Billing</h1>
        <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>You&apos;re on Taska Pro — £4.99/month.</p>

        <button className="btn" onClick={handlePortal} disabled={loading}>
          <Icons.CreditCard size={14} />
          {loading ? 'Loading…' : 'Manage billing'}
        </button>
      </div>
    )
  }

  return (
    <div className="page-h" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16, maxWidth: 480 }}>
      <h1>Billing</h1>
      {message && <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>{message}</p>}

      <button className="btn btn-primary" onClick={handleUpgrade} disabled={loading}>
        <Icons.Star size={14} />
        {loading ? 'Loading…' : 'Subscribe — £4.99/month'}
      </button>
    </div>
  )
}
