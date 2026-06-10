-- ── Taska schema v2: Clients → Projects → Tasks ─────────────────────

-- Profiles
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text not null,
  full_name              text,
  avatar_url             text,
  stripe_customer_id     text unique,
  stripe_subscription_id text,
  -- plan: trial | pro | expired
  plan                   text not null default 'trial' check (plan in ('trial','pro','expired')),
  trial_ends_at          timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Clients
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  email      text,
  phone      text,
  av         int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects (was "jobs") — must belong to a client
create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  client_id  uuid not null references public.clients(id) on delete cascade,
  num        text not null,          -- e.g. J-024
  title      text not null,
  status     text not null default 'enquiry'
             check (status in ('enquiry','quoted','progress','done')),
  notes      text default '',
  due        date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tasks — must belong to a project
create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title      text not null,
  done       boolean not null default false,
  due        date,                   -- when set, surfaces as dashboard alert
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.clients  enable row level security;
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;

-- Profiles
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Clients
create policy "own clients select" on public.clients for select using (auth.uid() = user_id);
create policy "own clients insert" on public.clients for insert with check (auth.uid() = user_id);
create policy "own clients update" on public.clients for update using (auth.uid() = user_id);
create policy "own clients delete" on public.clients for delete using (auth.uid() = user_id);

-- Projects
create policy "own projects select" on public.projects for select using (auth.uid() = user_id);
create policy "own projects insert" on public.projects for insert with check (auth.uid() = user_id);
create policy "own projects update" on public.projects for update using (auth.uid() = user_id);
create policy "own projects delete" on public.projects for delete using (auth.uid() = user_id);

-- Tasks
create policy "own tasks select" on public.tasks for select using (auth.uid() = user_id);
create policy "own tasks insert" on public.tasks for insert with check (auth.uid() = user_id);
create policy "own tasks update" on public.tasks for update using (auth.uid() = user_id);
create policy "own tasks delete" on public.tasks for delete using (auth.uid() = user_id);

-- ── Auto-create profile on signup ────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, plan, trial_ends_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'trial',
    now() + interval '30 days'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Indexes ──────────────────────────────────────────────────────────

create index if not exists projects_user_idx    on public.projects(user_id);
create index if not exists projects_client_idx  on public.projects(client_id);
create index if not exists projects_status_idx  on public.projects(status);
create index if not exists tasks_project_idx    on public.tasks(project_id);
create index if not exists tasks_user_idx       on public.tasks(user_id);
create index if not exists tasks_due_idx        on public.tasks(due) where done = false;
create index if not exists clients_user_idx     on public.clients(user_id);
create index if not exists profiles_stripe_idx  on public.profiles(stripe_customer_id);

-- ── Supabase Auth: enable Google OAuth ───────────────────────────────
-- Enable Google in: Supabase Dashboard → Authentication → Providers → Google
-- Add your Google OAuth Client ID and Secret.
-- Set authorised redirect URI in Google Console:
--   https://<your-project>.supabase.co/auth/v1/callback
