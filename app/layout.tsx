import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taska — a tidy home for freelance jobs',
  description: 'Client, project and task management for freelancers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
