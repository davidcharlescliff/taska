import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { canUseApp } from '@/types'

// Hard paywall for core app features — expired/past_due users are sent to
// /billing to resolve their subscription. /settings and /billing themselves
// live outside this group so they stay reachable.
export default async function GatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  if (!canUseApp(profile)) {
    redirect('/billing')
  }

  return <>{children}</>
}
