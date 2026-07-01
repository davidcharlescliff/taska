'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1500)
  }

  if (done) {
    return (
      <div className="auth-wrap" data-theme="light">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <img src="/taska-logo.svg" alt="Taska" className="auth-wordmark" />
          <h1 style={{ marginBottom: 12 }}>Password updated</h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            Taking you to your dashboard…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-wrap" data-theme="light">
      <div className="auth-box">
        <img src="/taska-logo.svg" alt="Taska" className="auth-wordmark" />
        <h1>Set a new password</h1>
        <p className="sub">Choose a new password for your account.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="field-grp">
            <label>New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8+ characters" minLength={8} required />
          </div>
          <div className="field-grp">
            <label>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="8+ characters" minLength={8} required />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: 46, fontSize: 15, width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
