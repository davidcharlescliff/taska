import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Sidebar counts
  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from('projects').select('id, status').eq('user_id', user.id),
    supabase.from('tasks').select('id, done').eq('user_id', user.id),
  ])

  const projects = projectsRes.data || []
  const tasks = tasksRes.data || []

  const liveCt = projects.filter(p => p.status !== 'done').length
  const archiveCt = projects.filter(p => p.status === 'done').length
  const openTaskCt = tasks.filter(t => !t.done).length

  return (
    <AppShell
      profile={profile}
      liveCt={liveCt}
      openTaskCt={openTaskCt}
      archiveCt={archiveCt}
    >
      {children}
    </AppShell>
  )
}
