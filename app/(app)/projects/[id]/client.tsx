'use client'
import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { StatusPill, Avatar } from '@/components/ui/project-ui'
import { DatePicker } from '@/components/ui/date-picker'
import { updateProject, archiveProject, deleteProject, createTask, updateTask, deleteTask } from '@/lib/actions'
import type { Task, ProjectStatus } from '@/types'

const STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: 'enquiry', label: 'Enquiry' },
  { id: 'quoted', label: 'Quoted' },
  { id: 'progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dueLabel(iso: string | null | undefined): { text: string; tone: 'soon' | 'late' | 'set' } | null {
  if (!iso) return null
  const today = isoToday()
  const d = new Date(iso + 'T00:00:00')
  const fmt = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  if (iso === today) return { text: 'Today', tone: 'soon' }
  if (iso < today) return { text: fmt, tone: 'late' }
  return { text: fmt, tone: 'set' }
}

function StatusDropdown({ value, onChange }: { value: ProjectStatus; onChange: (s: ProjectStatus) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-sm"
        style={{ height: 45, padding: '0 16px 0 12px', gap: 8 }}
        onClick={() => setOpen(o => !o)}
      >
        <StatusPill status={value} />
        <Icons.Arrow size={12} style={{ marginLeft: 2, transform: 'rotate(90deg)' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 51,
            background: 'var(--bg-card)', border: '1px solid var(--line)',
            borderRadius: 'var(--r-2)', boxShadow: 'var(--shadow-pop)',
            padding: 6, minWidth: 180,
          }}>
            {STATUSES.map(s => (
              <div
                key={s.id}
                onClick={() => { onChange(s.id); setOpen(false) }}
                style={{ padding: '6px 8px', borderRadius: 6, cursor: 'default', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-soft)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <StatusPill status={s.id} />
                {value === s.id && <Icons.Check size={14} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function KebabMenu({ onArchive, onDelete }: { onArchive: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="icon-btn" style={{ width: 36, height: 45 }} onClick={() => setOpen(o => !o)}>
        <Icons.Kebab size={16} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setOpen(false)} />
          <div className="kebab-menu">
            <div
              className="kebab-item"
              onClick={() => { setOpen(false); onArchive() }}
            >
              <Icons.Archive size={14} />
              <span>Archive</span>
            </div>
            <div
              className="kebab-item"
              data-danger="true"
              onClick={() => { setOpen(false); onDelete() }}
            >
              <Icons.X size={14} />
              <span>Delete project</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function TaskRow({
  task,
  projectId,
  onOptimisticUpdate,
}: {
  task: Task
  projectId: string
  onOptimisticUpdate: (id: string, patch: Partial<Task>) => void
}) {
  const [, startTransition] = useTransition()
  const [editingDate, setEditingDate] = useState(false)
  const due = dueLabel(task.due)

  const toggle = () => {
    onOptimisticUpdate(task.id, { done: !task.done })
    startTransition(async () => { await updateTask(task.id, { done: !task.done }) })
  }

  const handleTextBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    const v = e.currentTarget.innerText.trim()
    if (!v) {
      startTransition(async () => { await deleteTask(task.id, projectId) })
    } else if (v !== task.title) {
      onOptimisticUpdate(task.id, { title: v })
      startTransition(async () => { await updateTask(task.id, { title: v }) })
    }
  }

  const clearDue = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOptimisticUpdate(task.id, { due: null })
    startTransition(async () => { await updateTask(task.id, { due: null }) })
  }

  const setDue = (iso: string) => {
    onOptimisticUpdate(task.id, { due: iso || null })
    startTransition(async () => { await updateTask(task.id, { due: iso || null }) })
    setEditingDate(false)
  }

  return (
    <div className={`task-item task-row ${task.done ? 'done' : ''} ${due ? `has-due tone-${due.tone}` : ''}`}>
      <span className="task-check" onClick={toggle}>
        {task.done && <Icons.Check size={12} stroke={3} />}
      </span>
      <span
        className="task-text"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTextBlur}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
      >
        {task.title}
      </span>

      {due && !editingDate && (
        <span className="task-due" onClick={() => setEditingDate(true)}>
          <Icons.Bell size={11} />
          <span className="task-due-text">{due.text}</span>
          <button className="task-due-clear" onClick={clearDue} title="Clear date">
            <Icons.X size={10} />
          </button>
        </span>
      )}

      {!due && !editingDate && (
        <button className="task-due-add" onClick={() => setEditingDate(true)} title="Set a date">
          <Icons.Bell size={12} />
        </button>
      )}

      {editingDate && (
        <span className="task-due-pop">
          <DatePicker
            value={task.due || ''}
            onChange={setDue}
            onClose={() => setEditingDate(false)}
          />
        </span>
      )}
    </div>
  )
}

function TaskBlock({ tasks, projectId, onUpdate }: {
  tasks: Task[]
  projectId: string
  onUpdate: (id: string, patch: Partial<Task>) => void
}) {
  const [draft, setDraft] = useState('')
  const [, startTransition] = useTransition()

  const commit = () => {
    const v = draft.trim()
    if (!v) return
    setDraft('')
    startTransition(async () => {
      await createTask({ projectId, title: v })
    })
  }

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (a.due && b.due) return a.due < b.due ? -1 : 1
    if (a.due) return -1
    if (b.due) return 1
    return a.sort_order - b.sort_order
  })

  return (
    <div className="task-list">
      <div className="task-item task-draft">
        <Icons.Plus size={13} stroke={2} style={{ color: 'var(--ink)', flex: '0 0 auto' }} />
        <input
          className="task-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            if (e.key === 'Escape') setDraft('')
          }}
          placeholder="Add a task"
        />
      </div>
      {sorted.map(t => (
        <TaskRow key={t.id} task={t} projectId={projectId} onOptimisticUpdate={onUpdate} />
      ))}
    </div>
  )
}

function NotesBlock({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || ''
    }
  }, [value])
  return (
    <div
      className="notes"
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder="Jot anything down"
      onBlur={e => onChange(e.currentTarget.innerText)}
    />
  )
}

type ProjectWithClient = {
  id: string; num: string; title: string; status: ProjectStatus;
  notes: string | null; due: string | null; client_id: string;
  client: { id: string; name: string; email: string | null; phone: string | null; av: number; user_id: string; created_at: string; updated_at: string } | null
  user_id: string; created_at: string; updated_at: string;
}

export function ProjectDetailClient({
  project: initialProject,
  initialTasks,
  clients,
}: {
  project: ProjectWithClient
  initialTasks: Task[]
  clients: unknown[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [project, setProject] = useState(initialProject)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refresh tasks when server revalidates
  useEffect(() => { setTasks(initialTasks) }, [initialTasks])

  const saveProject = useCallback((patch: Record<string, unknown>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      startTransition(async () => { await updateProject(project.id, patch) })
    }, 600)
  }, [project.id])

  const patch = (p: Partial<typeof project>) => {
    setProject(prev => ({ ...prev, ...p }))
    saveProject(p as Record<string, unknown>)
  }

  const handleTaskUpdate = (id: string, taskPatch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskPatch } : t))
  }

  const handleArchive = async () => {
    if (!confirm(`Archive ${project.num} — ${project.title}? It will move to the Archive section.`)) return
    await archiveProject(project.id)
  }

  const handleDelete = () => setConfirmDelete(true)

  const confirmDoDelete = async () => {
    setConfirmDelete(false)
    await deleteProject(project.id)
  }

  return (
    <>
    <div className="jd">
      <div className="page-h">
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={e => patch({ title: e.currentTarget.innerText.trim() })}
        >
          {project.title}
        </h1>
        <div className="page-actions">
          <StatusDropdown
            value={project.status}
            onChange={s => patch({ status: s })}
          />
          <KebabMenu onArchive={handleArchive} onDelete={handleDelete} />
        </div>
      </div>

      <div className="status-filter">
        {project.client && (
          <span className="client-chip">
            <Avatar client={project.client as any} status={project.status} size="sm" />
            {project.client.name}
          </span>
        )}
        <span className="client-pill">
          <span className="nm">{project.num}</span>
        </span>
      </div>

      <div className="jd-tasks">
        <TaskBlock
          tasks={tasks}
          projectId={project.id}
          onUpdate={handleTaskUpdate}
        />
      </div>

      <div className="jd-notes">
        <h3 className="section-label">Notes</h3>
        <div className="section">
          <NotesBlock
            value={project.notes || ''}
            onChange={notes => patch({ notes })}
          />
        </div>
      </div>
    </div>

    {confirmDelete && (
      <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) setConfirmDelete(false) }}>
        <div className="modal" style={{ maxWidth: 380 }}>
          <div className="modal-body" style={{ paddingBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Delete project?</h2>
            <p style={{ margin: '0 4px 8px', fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>
              {project.num} — {project.title}
            </p>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--ink-3)' }}>
              This project will be permanently deleted and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDoDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
