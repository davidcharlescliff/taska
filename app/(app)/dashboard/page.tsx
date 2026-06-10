import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date()
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [projectsRes, clientsRes, alertsRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, client:clients(*)')
      .eq('user_id', user.id)
      .neq('status', 'done')
      .order('created_at', { ascending: false }),
    supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id),
    // Due alerts: tasks with due <= today, not done
    supabase
      .from('tasks')
      .select('id, title, due, project:projects(id, num, title, status)')
      .eq('user_id', user.id)
      .eq('done', false)
      .lte('due', todayISO)
      .not('due', 'is', null)
      .order('due', { ascending: true }),
  ])

  return (
    <DashboardClient
      projects={projectsRes.data || []}
      clients={clientsRes.data || []}
      alerts={(alertsRes.data || []).map(a => ({
        ...a,
        project: Array.isArray(a.project) ? a.project[0] ?? null : a.project,
      }))}
    />
  )
}
