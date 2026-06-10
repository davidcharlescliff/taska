'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { planStatus } from '@/types'
import { updateAvatarUrl } from '@/lib/actions'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

function AvatarUpload({ profile }: { profile: Profile }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(profile.avatar_url)
  const [error, setError] = useState<string | null>(null)

  const ini = (profile.full_name || profile.email || '?')
    .split(/[\s&]+/).map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please pick an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return }
    setError(null)
    setUploading(true)

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${profile.id}/avatar.${ext}`

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

      // Bust cache by appending a timestamp so the browser reloads the new image
      const busted = `${publicUrl}?t=${Date.now()}`
      await updateAvatarUrl(busted)
      setPreview(busted)
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
      setPreview(profile.avatar_url)
    } finally {
      setUploading(false)
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleRemove = async () => {
    setUploading(true)
    setError(null)
    try {
      await updateAvatarUrl(null)
      setPreview(null)
      router.refresh()
    } catch {
      setError('Could not remove photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div className="avatar-upload-wrap">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <button
          className="avatar-upload-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload photo"
        >
          {preview ? (
            <img src={preview} alt="Profile" className="avatar-img" />
          ) : (
            <span className="sb-avatar">{ini}</span>
          )}
        </button>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{profile.full_name || 'Your name'}</div>
        <div style={{ color: 'var(--ink-3)', fontSize: 13, marginBottom: 6 }}>{profile.email}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : preview ? 'Change photo' : 'Upload photo'}
          </button>
          {preview && (
            <button className="btn" style={{ fontSize: 12, padding: '4px 10px', color: 'var(--ink-3)' }} onClick={handleRemove} disabled={uploading}>
              Remove
            </button>
          )}
        </div>
        {error && <div style={{ fontSize: 12, color: 'var(--red, #e53)', marginTop: 4 }}>{error}</div>}
      </div>
    </div>
  )
}

export function SettingsClient({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const status = planStatus(profile)

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
    <>
      <div className="page-h"><h1>Settings</h1></div>

      <div>
        {/* Profile */}
        <div className="settings-section">
          <h2>Profile</h2>
          <AvatarUpload profile={profile} />
        </div>

        {/* Plan */}
        <div className="settings-section">
          <h2>Plan &amp; Billing</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span className="plan-tag">
              <Icons.Star size={12} />
              {status === 'pro' ? 'Pro' : status === 'trial' ? 'Free trial' : 'Expired'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              {status === 'pro' && 'Taska Pro — £4.99/month'}
              {status === 'trial' && profile.trial_ends_at && `Trial ends ${new Date(profile.trial_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {status === 'expired' && 'Your trial has ended.'}
            </span>
          </div>
          {status === 'pro' ? (
            <button className="btn" onClick={handlePortal} disabled={loading}>
              <Icons.CreditCard size={14} />
              {loading ? 'Loading…' : 'Manage billing'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleUpgrade} disabled={loading}>
              <Icons.Star size={14} />
              {loading ? 'Loading…' : 'Upgrade — £4.99/month'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
