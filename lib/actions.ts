'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ProjectStatus } from '@/types'

function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

// ── Projects ──────────────────────────────────────────────────

export async function createProject(data: {
  title: string
  clientId: string
  status: ProjectStatus
}) {
  const { supabase, user } = await getUser()

  // Auto-number
  const { data: existing } = await supabase
    .from('projects')
    .select('num')
    .eq('user_id', user.id)

  const nums = (existing || [])
    .map(p => parseInt((p.num || '').replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  const num = 'J-' + String(max + 1).padStart(3, '0')

  const { data: project, error } = await supabase.from('projects').insert({
    user_id: user.id,
    client_id: data.clientId,
    num,
    title: data.title,
    status: data.status,
    notes: '',
  }).select().single()

  if (error) throw error
  revalidatePath('/dashboard')
  return project
}

export async function updateProject(id: string, patch: Record<string, unknown>) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('projects')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
  revalidatePath(`/projects/${id}`)
}

export async function archiveProject(id: string) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('projects')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
  revalidatePath('/archive')
  redirect('/archive')
}

export async function deleteProject(id: string) {
  const { supabase, user } = await getUser()
  await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ── Tasks ─────────────────────────────────────────────────────

export async function createTask(data: {
  projectId: string
  title: string
  due?: string | null
}) {
  const { supabase, user } = await getUser()

  // Get max sort_order for this project
  const { data: existing } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('project_id', data.projectId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const sort_order = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { data: task, error } = await supabase.from('tasks').insert({
    user_id: user.id,
    project_id: data.projectId,
    title: data.title,
    done: false,
    due: data.due || null,
    sort_order,
  }).select().single()

  if (error) throw error
  revalidatePath(`/projects/${data.projectId}`)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
  return task
}

export async function updateTask(id: string, patch: Record<string, unknown>) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('tasks')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
  revalidatePath('/tasks')
}

export async function deleteTask(id: string, projectId: string) {
  const { supabase, user } = await getUser()
  await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

// ── Clients ───────────────────────────────────────────────────

export async function createClientRecord(data: {
  name: string
  email?: string
  phone?: string
}) {
  const { supabase, user } = await getUser()

  const { data: existing } = await supabase
    .from('clients')
    .select('av')
    .eq('user_id', user.id)

  const av = ((existing?.length || 0) % 6) + 1

  const { data: client, error } = await supabase.from('clients').insert({
    user_id: user.id,
    name: data.name.trim(),
    email: data.email || null,
    phone: data.phone || null,
    av,
  }).select().single()

  if (error) throw error
  revalidatePath('/clients')
  revalidatePath('/dashboard')
  return client
}

export async function updateClient(id: string, patch: Record<string, unknown>) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('clients')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/clients')
}

// ── Profile ───────────────────────────────────────────────────

export async function updateAvatarUrl(url: string | null) {
  const { supabase, user } = await getUser()
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: url, updated_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error) throw error
  revalidatePath('/settings')
  revalidatePath('/dashboard')
}

// ── Data fetch helpers ─────────────────────────────────────────

export async function getProjects() {
  const { supabase, user } = await getUser()
  const { data } = await supabase
    .from('projects')
    .select('*, client:clients(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getClients() {
  const { supabase, user } = await getUser()
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('name')
  return data || []
}

export async function getDueAlerts() {
  const { supabase, user } = await getUser()
  const today = isoDate()
  const { data } = await supabase
    .from('tasks')
    .select('id, title, due, project:projects(id, num, title, status)')
    .eq('user_id', user.id)
    .eq('done', false)
    .lte('due', today)
    .not('due', 'is', null)
    .order('due', { ascending: true })
  return (data || []) as unknown as Array<{
    id: string; title: string; due: string;
    project: { id: string; num: string; title: string; status: string }
  }>
}
