'use client'
import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { Avatar, StatusPill } from '@/components/ui/project-ui'
import { updateTask } from '@/lib/actions'
import type { Task } from '@/types'

type ProjectRow = { id: string; num: string; title: string; status: string; client_id: string }
type ClientRow = { id: string; name: string; email: string | null; phone: string | null; av: number; user_id: string; created_at: string; updated_at: string }
type Filter = 'open' | 'today' | 'week' | 'done' | 'all'

function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isoWeek() {
  const d = new Date(Date.now() + 7 * 86_400_000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function TasksPageClient({
  projects,
  tasks: initialTasks,
  clients,
}: {
  projects: ProjectRow[]
  tasks: Task[]
  clients: ClientRow[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<Filter>('open')

  const today = isoToday()
  const weekEnd = isoWeek()

  const groups = useMemo(() => {
    const activeProjects = filter === 'all' || filter === 'done'
      ? projects
      : projects.filter(p => p.status !== 'done')

    return activeProjects
      .map(proj => {
        let projTasks = tasks.filter(t => t.project_id === proj.id)
        if (filter === 'open') projTasks = projTasks.filter(t => !t.done)
        else if (filter === 'done') projTasks = projTasks.filter(t => t.done)
        else if (filter === 'today') projTasks = projTasks.filter(t => !t.done && t.due && t.due <= today)
        else if (filter === 'week') projTasks = projTasks.filter(t => !t.done && t.due && t.due >= today && t.due <= weekEnd)
        return { proj, tasks: projTasks }
      })
      .filter(g => g.tasks.length > 0)
  }, [tasks, projects, filter, today, weekEnd])

  const counts = {
    open: tasks.filter(t => !t.done).length,
    today: tasks.filter(t => !t.done && t.due && t.due <= today).length,
    week: tasks.filter(t => !t.done && t.due && t.due >= today && t.due <= weekEnd).length,
    done: tasks.filter(t => t.done).length,
    all: tasks.length,
  }

  const toggle = (task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))
    startTransition(async () => { await updateTask(task.id, { done: !task.done }) })
  }

  const dueLabel = (iso: string | null | undefined) => {
    if (!iso) return null
    const d = new Date(iso + 'T00:00:00')
    const fmt = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    if (iso === today) return { text: 'Today', tone: 'soon' }
    if (iso < today) return { text: fmt, tone: 'late' }
    return { text: fmt, tone: 'set' }
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'open', label: 'Open' },
    { id: 'today', label: 'Today & past' },
    { id: 'week', label: 'Due this week' },
    { id: 'done', label: 'Done' },
    { id: 'all', label: 'All' },
  ]

  return (
    <>
      <div className="page-h"><h1>Tasks</h1></div>

      <div className="status-filter">
        {FILTERS.map(f => (
          <button key={f.id} className={filter === f.id ? 'active' : ''} onClick={() => setFilter(f.id)}>
            <span>{f.label}</span>
            <span className="ct">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="empty">
          {filter === 'open' && 'No open tasks. Quietly impressive.'}
          {filter === 'today' && 'Nothing pressing right now.'}
          {filter === 'week' && 'Nothing landing this week.'}
          {filter === 'done' && 'Nothing wrapped up yet.'}
          {filter === 'all' && 'No tasks anywhere.'}
        </div>
      )}

      <div className="todos-stream">
        {groups.map(({ proj, tasks: projTasks }) => {
          const client = clients.find(c => c.id === proj.client_id)
          return (
            <div key={proj.id} className="todos-group">
              <div className="todos-gh">
                <span className="num">{proj.num}</span>
                <span className="ttl">{proj.title}</span>
                {client && (
                  <span className="client-pill" style={{ marginLeft: 4 }}>
                    <Avatar client={client as any} status={proj.status as any} />
                    <span className="nm">{client.name}</span>
                  </span>
                )}
                <StatusPill status={proj.status as any} />
                <button className="goto-job" onClick={() => router.push(`/projects/${proj.id}`)}>
                  go to project <Icons.Arrow size={12} />
                </button>
              </div>
              <div className="task-list">
                {projTasks.map(t => {
                  const due = dueLabel(t.due)
                  return (
                    <div key={t.id} className={`task-item ${t.done ? 'done' : ''} ${due ? `has-due tone-${due.tone}` : ''}`}>
                      <span className="task-check" onClick={() => toggle(t)}>
                        {t.done && <Icons.Check size={12} stroke={3} />}
                      </span>
                      <span className="task-text">{t.title}</span>
                      {due && (
                        <span className="task-due">
                          <Icons.Bell size={11} />
                          <span className="task-due-text">{due.text}</span>
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
