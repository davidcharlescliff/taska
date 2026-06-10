import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TasksPageClient } from './client'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [projectsRes, tasksRes, clientsRes] = await Promise.all([
    supabase.from('projects').select('id, num, title, status, client_id').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').eq('user_id', user.id).order('sort_order'),
    supabase.from('clients').select('*').eq('user_id', user.id),
  ])

  return (
    <TasksPageClient
      projects={projectsRes.data || []}
      tasks={tasksRes.data || []}
      clients={clientsRes.data || []}
    />
  )
}
