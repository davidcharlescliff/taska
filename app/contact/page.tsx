'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact-page" data-theme="light">
      <div className="contact-grid">
        <div className="contact-form-col">
          <img src="/taska-logo.svg" alt="Taska" className="auth-wordmark" />
          <h1>Get in touch</h1>
          <p className="sub">We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you shortly.</p>

          {status === 'sent' ? (
            <div className="contact-success">
              <p>Thanks for reaching out! We&apos;ll be in touch soon.</p>
              <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 12 }}>Back to home</Link>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="auth-error">Something went wrong. Please try again.</div>
              )}
              <div className="field-grp">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field-grp">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field-grp">
                <label>Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ height: 46, fontSize: 15, width: '100%', justifyContent: 'center' }}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
