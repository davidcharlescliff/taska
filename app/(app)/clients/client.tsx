'use client'
import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { Avatar, StatusPill } from '@/components/ui/project-ui'
import { createClientRecord } from '@/lib/actions'
import { CreateProjectModal } from '@/components/ui/create-modal'
import type { Client } from '@/types'

type ProjectRow = { id: string; num: string; title: string; status: string; client_id: string }
type Filter = 'all' | 'active' | 'quiet'

export function ClientsClient({
  initialClients,
  initialProjects,
}: {
  initialClients: Client[]
  initialProjects: ProjectRow[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showNewClient, setShowNewClient] = useState(false)
  const [newProjectForClient, setNewProjectForClient] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const activeCountById = useMemo(() => {
    const map: Record<string, number> = {}
    clients.forEach(c => { map[c.id] = 0 })
    initialProjects.forEach(p => { if (p.status !== 'done' && map[p.client_id] != null) map[p.client_id]++ })
    return map
  }, [clients, initialProjects])

  const filtered = useMemo(() => {
    let arr = clients
    if (filter === 'active') arr = arr.filter(c => activeCountById[c.id] > 0)
    if (filter === 'quiet') arr = arr.filter(c => activeCountById[c.id] === 0)
    if (q.trim()) {
      const qq = q.toLowerCase()
      arr = arr.filter(c => c.name.toLowerCase().includes(qq) || (c.email || '').toLowerCase().includes(qq))
    }
    return arr
  }, [clients, activeCountById, filter, q])

  const counts = {
    all: clients.length,
    active: clients.filter(c => activeCountById[c.id] > 0).length,
    quiet: clients.filter(c => activeCountById[c.id] === 0).length,
  }

  const saveNewClient = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const c = await createClientRecord({ name: newName, email: newEmail, phone: newPhone })
      setClients(prev => [...prev, c as Client].sort((a, b) => a.name.localeCompare(b.name)))
      setShowNewClient(false)
      setNewName(''); setNewEmail(''); setNewPhone('')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-h">
        <h1>Clients</h1>
        <div className="page-actions">
          <div className="search-tall">
            <Icons.Search size={15} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find a client…" />
            {q && <button className="clear" onClick={() => setQ('')}><Icons.X size={13} /></button>}
          </div>
          <button className="btn btn-primary btn-tall" onClick={() => setShowNewClient(true)}>
            <Icons.Plus size={15} /> New client
          </button>
        </div>
      </div>

      <div className="status-filter">
        {(['all', 'active', 'quiet'] as Filter[]).map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
            <span className="ct">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* New client inline form */}
      {showNewClient && (
        <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) setShowNewClient(false) }}>
          <div className="modal">
            <div className="modal-h">
              <h2>New client</h2>
              <button className="modal-x" onClick={() => setShowNewClient(false)}><Icons.X size={16} stroke={2} /></button>
            </div>
            <div className="modal-body">
              <div className="field-grp">
                <label>Name <span style={{ color: 'var(--accent)' }}>*</span></label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Client or company name" autoFocus />
              </div>
              <div className="field-grp"><label>Email</label><input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@example.com" /></div>
              <div className="field-grp"><label>Phone</label><input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+44…" /></div>
            </div>
            <div className="modal-foot" style={{ justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setShowNewClient(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveNewClient} disabled={saving || !newName.trim()}>
                  {saving ? 'Saving…' : 'Add client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="cli-list">
        {filtered.map(c => {
          const cProjects = initialProjects.filter(p => p.client_id === c.id)
          const activeCt = cProjects.filter(p => p.status !== 'done').length
          const isOpen = openId === c.id
          return (
            <div key={c.id} className={`cli-pill ${isOpen ? 'open' : ''}`}>
              <div className="cli-row" onClick={() => setOpenId(isOpen ? null : c.id)}>
                <Avatar client={c} size="md" />
                <div>
                  <div className="nm">{c.name}</div>
                  {c.email && <div className="meta">{c.email}</div>}
                </div>
                <span className="ct">{activeCt} active</span>
                <span className={`cli-chev ${isOpen ? 'open' : ''}`}><Icons.Arrow size={14} /></span>
              </div>
              {isOpen && (
                <div className="cli-expand">
                  <div className="cli-contact">
                    {c.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icons.Mail size={13} />{c.email}</span>}
                    {c.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icons.Phone size={13} />{c.phone}</span>}
                  </div>
                  <div className="cli-jobs">
                    {cProjects.length === 0 && (
                      <div className="empty" style={{ padding: '16px 0' }}>
                        No projects yet.{' '}
                        <button className="inline-link" onClick={() => setNewProjectForClient(c.id)}>Add one</button>
                      </div>
                    )}
                    {cProjects.map(p => (
                      <div key={p.id} className="cli-job-row" data-status={p.status} onClick={() => router.push(`/projects/${p.id}`)}>
                        <span className="num">{p.num}</span>
                        <span className="ttl">{p.title}</span>
                        <StatusPill status={p.status as any} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="empty">No clients yet.</div>}
      </div>

      {newProjectForClient && (
        <CreateProjectModal
          initialClientId={newProjectForClient}
          onClose={() => { setNewProjectForClient(null); router.refresh() }}
        />
      )}
    </>
  )
}
