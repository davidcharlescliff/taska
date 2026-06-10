import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectDetailClient } from './client'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [projectRes, tasksRes, clientsRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, client:clients(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('*')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  if (!projectRes.data) notFound()

  return (
    <ProjectDetailClient
      project={projectRes.data}
      initialTasks={tasksRes.data || []}
      clients={clientsRes.data || []}
    />
  )
}
