'use client'
import { useState, useEffect, useRef, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { Avatar } from '@/components/ui/project-ui'
import { createProject, getClients, createClientRecord } from '@/lib/actions'
import type { Client, ProjectStatus } from '@/types'

const STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: 'enquiry',  label: 'Enquiry' },
  { id: 'quoted',   label: 'Quoted' },
  { id: 'progress', label: 'In Progress' },
  { id: 'done',     label: 'Done' },
]

function ClientCombo({
  clients,
  value,
  onChange,
  onCreateClient,
}: {
  clients: Client[]
  value: string
  onChange: (id: string) => void
  onCreateClient: (name: string) => Promise<Client>
}) {
  const sel = clients.find(c => c.id === value)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hi, setHi] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const matches = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq) return clients
    return clients.filter(c =>
      c.name.toLowerCase().includes(qq) ||
      (c.email || '').toLowerCase().includes(qq)
    )
  }, [clients, q])

  const trimmed = q.trim()
  const exact = clients.some(c => c.name.toLowerCase() === trimmed.toLowerCase())
  const canCreate = trimmed.length > 0 && !exact
  const createIdx = matches.length
  const maxIdx = canCreate ? createIdx : Math.max(0, matches.length - 1)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const choose = (c: Client) => { onChange(c.id); setQ(c.name); setOpen(false) }

  const createAndChoose = async () => {
    if (!canCreate) return
    const c = await onCreateClient(trimmed)
    onChange(c.id); setQ(c.name); setOpen(false)
  }

  const commitHighlighted = () => {
    if (canCreate && hi === createIdx) createAndChoose()
    else if (matches[hi]) choose(matches[hi])
  }

  return (
    <div className="combo" ref={wrapRef}>
      <div className={`combo-input ${open ? 'open' : ''} ${sel ? 'has-value' : ''}`}>
        {sel && !open && <Avatar client={sel} />}
        <Icons.Search size={15} stroke={2} style={{ color: 'var(--ink-3)', flex: '0 0 auto' }} />
        <input
          ref={inputRef}
          value={open ? q : (sel ? sel.name : q)}
          onFocus={() => { setOpen(true); setQ(''); setHi(0) }}
          onChange={e => { setQ(e.target.value); setOpen(true); setHi(0); if (value) onChange('') }}
          placeholder="Search or add a client…"
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, maxIdx)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)) }
            if (e.key === 'Enter') { e.preventDefault(); commitHighlighted() }
            if (e.key === 'Escape') setOpen(false)
          }}
        />
        {sel && (
          <button
            type="button"
            className="combo-clear"
            onMouseDown={e => { e.preventDefault(); onChange(''); setQ(''); inputRef.current?.focus() }}
          >
            <Icons.X size={12} />
          </button>
        )}
      </div>
      {open && (
        <div className="combo-pop">
          <div className="combo-list">
            {matches.map((c, i) => (
              <div
                key={c.id}
                className={`combo-item ${i === hi ? 'hi' : ''} ${c.id === value ? 'sel' : ''}`}
                onMouseEnter={() => setHi(i)}
                onMouseDown={e => { e.preventDefault(); choose(c) }}
              >
                <Avatar client={c} />
                <div className="combo-item-body">
                  <span className="nm">{c.name}</span>
                  <span className="em">{c.email || 'No email yet'}</span>
                </div>
                {c.id === value && <Icons.Check size={14} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />}
              </div>
            ))}
            {matches.length === 0 && !canCreate && (
              <div className="combo-empty">No clients match &ldquo;{q}&rdquo;.</div>
            )}
            {canCreate && (
              <div
                className={`combo-item combo-create ${hi === createIdx ? 'hi' : ''}`}
                onMouseEnter={() => setHi(createIdx)}
                onMouseDown={e => { e.preventDefault(); createAndChoose() }}
              >
                <span className="combo-create-ic"><Icons.Plus size={14} /></span>
                <div className="combo-item-body">
                  <span className="nm">Add &ldquo;{trimmed}&rdquo;</span>
                  <span className="em">Create a new client</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateProjectModal({ onClose, initialClientId }: { onClose: () => void; initialClientId?: string }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState(initialClientId ?? '')
  const [status, setStatus] = useState<ProjectStatus>('enquiry')
  const [clients, setClients] = useState<Client[]>([])
  const [saving, setSaving] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getClients().then(setClients)
    setTimeout(() => titleRef.current?.focus(), 60)
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const handleCreateClient = async (name: string) => {
    const c = await createClientRecord({ name })
    setClients(prev => [...prev, c as Client].sort((a, b) => a.name.localeCompare(b.name)))
    return c as Client
  }

  const save = async () => {
    if (!title.trim()) { titleRef.current?.focus(); return }
    if (!clientId) { return } // client required
    setSaving(true)
    try {
      const project = await createProject({ title: title.trim(), clientId, status })
      onClose()
      startTransition(() => {
        router.push(`/projects/${project.id}`)
        router.refresh()
      })
    } catch {
      setSaving(false)
    }
  }

  // auto-generate next num label for display
  const nextNumLabel = 'J-???'

  return (
    <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog">
        <div className="modal-h">
          <h2>New project</h2>
          <button className="modal-x" onClick={onClose} title="Close">
            <Icons.X size={16} stroke={2} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field-grp">
            <label>Title</label>
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What&apos;s the project?"
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save() }}
            />
          </div>
          <div className="field-grp">
            <label>Client <span style={{ color: 'var(--accent)' }}>*</span></label>
            <ClientCombo
              clients={clients}
              value={clientId}
              onChange={setClientId}
              onCreateClient={handleCreateClient}
            />
          </div>
          <div className="field-grp">
            <label>Status</label>
            <div className="status-picker">
              {STATUSES.map(s => (
                <button
                  key={s.id}
                  data-status={s.id}
                  className={status === s.id ? 'active' : ''}
                  onClick={() => setStatus(s.id)}
                >
                  <span className="dot" />{s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Client required to create a project</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-tall" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-tall" onClick={save} disabled={saving || !clientId}>
              {saving ? 'Creating…' : 'Create project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
