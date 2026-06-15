import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientsClient } from './client'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [clientsRes, projectsRes] = await Promise.all([
    supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
    supabase.from('projects').select('id, num, title, status, client_id').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return <ClientsClient initialClients={clientsRes.data || []} initialProjects={projectsRes.data || []} />
}
