export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ─── Database row types ───────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'trial' | 'pro' | 'expired'
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  av: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  client_id: string
  num: string           // e.g. J-024
  title: string
  status: ProjectStatus
  notes: string | null
  due: string | null    // ISO date
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id: string
  title: string
  done: boolean
  due: string | null    // ISO date — when set, surfaces as dashboard alert
  sort_order: number
  created_at: string
  updated_at: string
}

// ─── Domain types ─────────────────────────────────────────────

export type ProjectStatus = 'enquiry' | 'quoted' | 'progress' | 'done'

export interface ProjectWithClient extends Project {
  client: Client
}

export interface ProjectWithTasks extends Project {
  tasks: Task[]
}

export interface ProjectFull extends Project {
  client: Client
  tasks: Task[]
}

// Task shown on the dashboard alert strip — due today or past, not done
export interface DueAlert {
  task_id: string
  task_title: string
  task_due: string
  project_id: string
  project_num: string
  project_title: string
  project_status: ProjectStatus
}

// ─── Stripe / plan helpers ────────────────────────────────────

export type PlanStatus = 'trial' | 'pro' | 'expired'

export function planStatus(profile: Profile): PlanStatus {
  if (profile.plan === 'pro') return 'pro'
  if (profile.plan === 'trial' && profile.trial_ends_at) {
    const ends = new Date(profile.trial_ends_at)
    if (ends > new Date()) return 'trial'
    return 'expired'
  }
  return 'expired'
}

export function canUseApp(profile: Profile): boolean {
  return planStatus(profile) !== 'expired'
}
