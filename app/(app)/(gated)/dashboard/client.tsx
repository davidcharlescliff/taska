'use client'
import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { StatusPill, Avatar, ProjectCard, progressOf } from '@/components/ui/project-ui'
import { updateProject } from '@/lib/actions'
import { CreateProjectModal } from '@/components/ui/create-modal'
import type { ProjectStatus } from '@/types'

type ProjectRow = {
  id: string; num: string; title: string; status: string;
  client_id: string; notes: string | null; due: string | null;
  created_at: string; updated_at: string; user_id: string;
  client: { id: string; name: string; email: string | null; phone: string | null; av: number; user_id: string; created_at: string; updated_at: string } | null
}

type AlertRow = {
  id: string; title: string; due: string;
  project: { id: string; num: string; title: string; status: string } | null
}

const STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: 'enquiry', label: 'Enquiry' },
  { id: 'quoted', label: 'Quoted' },
  { id: 'progress', label: 'In Progress' },
]

// Alert strip — persists until task is marked done; no dismiss button
function AlertStrip({ alerts, onOpenProject }: { alerts: AlertRow[]; onOpenProject: (id: string) => void }) {
  if (!alerts.length) return null
  return (
    <div className="dash-alerts">
      <div className="dash-alerts-list">
        {alerts.map(a => {
          const d = new Date(a.due + 'T00:00:00')
          const fmt = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
          return (
            <div
              key={a.id}
              className="alert-item"
              onClick={() => a.project && onOpenProject(a.project.id)}
              title="Open project to mark complete"
            >
              <Icons.Bell size={14} />
              <div className="alert-body">
                <span className="dt">{fmt}</span>
                <span className="what">{a.title}</span>
              </div>
              {a.project && <span className="proj-num">{a.project.num}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DashboardClient({
  projects,
  clients,
  alerts,
}: {
  projects: ProjectRow[]
  clients: unknown[]
  alerts: AlertRow[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [q, setQ] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => {
    let arr = filter === 'all' ? projects : projects.filter(p => p.status === filter)
    if (q.trim()) {
      const qq = q.toLowerCase()
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(qq) ||
        p.num.toLowerCase().includes(qq) ||
        (p.notes || '').toLowerCase().includes(qq) ||
        p.client?.name.toLowerCase().includes(qq)
      )
    }
    // sort: progress > quoted > enquiry
    const order: ProjectStatus[] = ['progress', 'quoted', 'enquiry', 'done']
    return [...arr].sort((a, b) => order.indexOf(a.status as ProjectStatus) - order.indexOf(b.status as ProjectStatus))
  }, [projects, filter, q])

  const openProject = (id: string) => router.push(`/projects/${id}`)

  return (
    <>
      <AlertStrip alerts={alerts} onOpenProject={openProject} />

      <div className="page-h">
        <h1>Dashboard</h1>
        <div className="page-actions">
          <div className="search-tall">
            <Icons.Search size={15} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search projects, clients, notes…"
            />
            {q && (
              <button className="clear" onClick={() => setQ('')}>
                <Icons.X size={13} />
              </button>
            )}
          </div>
          <button className="btn btn-primary btn-tall" onClick={() => setShowCreate(true)}>
            <Icons.Plus size={15} />
            New Job
          </button>
        </div>
      </div>

      {/* Status filter */}
      <div className="status-filter">
        {[{ id: 'all' as const, label: 'All' }, ...STATUSES].map(s => {
          const ct = s.id === 'all'
            ? projects.length
            : projects.filter(p => p.status === s.id).length
          return (
            <button
              key={s.id}
              className={filter === s.id ? 'active' : ''}
              data-status={s.id === 'all' ? undefined : s.id}
              onClick={() => setFilter(s.id)}
            >
              {s.id !== 'all' && <span className="dot" />}
              <span>{s.label}</span>
              <span className="ct">{ct}</span>
            </button>
          )
        })}
      </div>

      <div className="grid-view">
        {filtered.map(p => (
          <ProjectCard
            key={p.id}
            project={p as any}
            client={p.client as any}
            onOpen={openProject}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          {q ? 'No projects match.' : 'No active projects — create one to get started.'}
        </div>
      )}

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} />
      )}
    </>
  )
}
