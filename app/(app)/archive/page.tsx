import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/ui/project-ui'
import Link from 'next/link'

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [projectsRes, clientsRes, tasksRes] = await Promise.all([
    supabase.from('projects').select('*, client:clients(*)').eq('user_id', user.id).eq('status', 'done').order('updated_at', { ascending: false }),
    supabase.from('clients').select('*').eq('user_id', user.id),
    supabase.from('tasks').select('id, project_id, done').eq('user_id', user.id),
  ])

  const projects = projectsRes.data || []
  const tasks = tasksRes.data || []

  return (
    <>
      <div className="page-h"><h1>Archive</h1></div>
      {projects.length > 0 ? (
        <div className="grid-view">
          {projects.map(p => (
            <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <ProjectCard
                project={p as any}
                client={p.client as any}
                tasks={tasks.filter(t => t.project_id === p.id) as any}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">No archived projects yet.</div>
      )}
    </>
  )
}
