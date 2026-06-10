'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { CreateProjectModal } from '@/components/ui/create-modal'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Icons.Layers },
  { href: '/clients',   label: 'Clients',   icon: Icons.Users },
  { href: '/tasks',     label: 'Tasks',     icon: Icons.CheckSq },
  { href: '/archive',   label: 'Archive',   icon: Icons.Archive },
]

function initials(name: string) {
  return name.split(/[\s&]+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function Sidebar({
  profile,
  liveCt,
  openTaskCt,
  archiveCt,
  onNewProject,
}: {
  profile: Profile
  liveCt: number
  openTaskCt: number
  archiveCt: number
  onNewProject: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  const counts: Record<string, number | null> = {
    '/dashboard': liveCt,
    '/clients': null,
    '/tasks': openTaskCt,
    '/archive': archiveCt,
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const ini = initials(profile.full_name || profile.email)
  const avatarUrl = profile.avatar_url

  return (
    <aside className="sidebar">
      {/* Profile */}
      <div className="sb-profile-wrap sb-profile-top">
        {menuOpen && (
          <>
            <div className="sb-menu-scrim" onClick={() => setMenuOpen(false)} />
            <div className="sb-menu sb-menu-down" role="menu">
              <div className="sb-menu-item" onClick={() => { setMenuOpen(false); router.push('/settings') }}>
                <span className="ic"><Icons.Settings size={18} stroke={2} /></span>
                <span>Settings</span>
              </div>
              <div className="sb-menu-sep" />
              <div className="sb-menu-item" data-danger="true" onClick={signOut}>
                <span className="ic"><Icons.External size={18} stroke={2} /></span>
                <span>Sign out</span>
              </div>
            </div>
          </>
        )}
        <div
          className={`sb-foot sb-foot-top ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="" className="sb-avatar" style={{ objectFit: 'cover' }} />
            : <span className="sb-avatar">{ini}</span>
          }
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{profile.full_name || 'You'}</span>
          </div>
          <span className="sb-foot-chev" style={{ color: 'var(--ink-3)' }}>
            <Icons.Kebab size={16} />
          </span>
        </div>
      </div>

      {/* Nav */}
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        const ct = counts[item.href]
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href} className={`sb-item ${active ? 'active' : ''}`}>
            <span className="ic"><Icon size={18} stroke={2} /></span>
            <span>{item.label}</span>
            {ct != null && <span className="count">{ct}</span>}
          </Link>
        )
      })}

      <div className="sb-spacer" />

      <div className="sb-brand-bottom">
        <span className="wordmark">Taska</span>
        <span className="strap">a tidy home for freelance jobs</span>
      </div>
    </aside>
  )
}

export function AppShell({
  profile,
  liveCt,
  openTaskCt,
  archiveCt,
  children,
}: {
  profile: Profile
  liveCt: number
  openTaskCt: number
  archiveCt: number
  children: React.ReactNode
}) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="app">
      <Sidebar
        profile={profile}
        liveCt={liveCt}
        openTaskCt={openTaskCt}
        archiveCt={archiveCt}
        onNewProject={() => setShowCreate(true)}
      />
      <div className="main">
        <div className="content">
          {children}
        </div>
      </div>

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}
