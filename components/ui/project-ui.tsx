'use client'
import React from 'react'
import type { Client, Project, Task, ProjectStatus } from '@/types'

export const STATUS_MAP: Record<ProjectStatus, string> = {
  enquiry:  'Enquiry',
  quoted:   'Quoted',
  progress: 'In Progress',
  done:     'Done',
}

export function StatusPill({ status, children }: { status: ProjectStatus; children?: React.ReactNode }) {
  return (
    <span className="st-pill" data-status={status}>
      <span className="dot" />
      {children || STATUS_MAP[status]}
    </span>
  )
}

export function Avatar({
  client,
  size = 'sm',
  status,
}: {
  client: Client | null | undefined
  size?: 'sm' | 'md' | 'lg'
  status?: ProjectStatus
}) {
  if (!client) return null
  const initials = client.name
    .split(/[\s&]+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const cls = status ? 'av av-st' : `av av-${client.av}`
  const style: React.CSSProperties =
    size === 'lg' ? { width: 56, height: 56, fontSize: 20 } :
    size === 'md' ? { width: 32, height: 32, fontSize: 12 } :
    { width: 18, height: 18, fontSize: 9.5 }

  return (
    <span
      className={cls}
      data-status={status}
      style={{
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </span>
  )
}

export function progressOf(tasks: Task[]) {
  if (!tasks.length) return { done: 0, total: 0, pct: 0 }
  const done = tasks.filter(t => t.done).length
  return { done, total: tasks.length, pct: Math.round((done / tasks.length) * 100) }
}

export function ProjectCard({
  project,
  client,
  tasks,
  onOpen,
}: {
  project: Project
  client: Client | null | undefined
  tasks?: Task[]
  onOpen?: (id: string) => void
}) {
  const p = progressOf(tasks || [])
  return (
    <div
      className="jc"
      data-status={project.status}
      onClick={() => onOpen?.(project.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {client && (
          <span className="client-pill">
            <Avatar client={client} status={project.status} />
            <span className="nm">{client.name}</span>
          </span>
        )}
        <span className="num">{project.num}</span>
      </div>
      <div className="ttl">{project.title}</div>
      <div className="jc-status">
        <StatusPill status={project.status} />
      </div>
      {p.total > 0 && (
        <div className="meta">
          <span className="progress">
            <span className="bar">
              <i style={{ width: p.pct + '%' }} />
            </span>
            <span>{p.done}/{p.total}</span>
          </span>
        </div>
      )}
    </div>
  )
}
