import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LegalPageProps {
  children: ReactNode
  currentPage: 'privacy' | 'terms' | 'cookies'
}

const links = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cookies', label: 'Cookie Notice' },
]

export default function LegalPage({ children, currentPage }: LegalPageProps) {
  return (
    <div className="legal-root">
      <header className="legal-header">
        <Link href="/">
          <Image src="/taska-logo.svg" alt="Taska" width={90} height={23} priority />
        </Link>
      </header>

      <main className="legal-main">
        <div className="legal-content">
          {children}
        </div>
      </main>

      <footer className="legal-footer">
        {links
          .filter(l => !l.href.includes(currentPage))
          .map(l => (
            <Link key={l.href} href={l.href} className="legal-footer-link">
              {l.label}
            </Link>
          ))}
      </footer>

      <style>{`
        .legal-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }
        .legal-header {
          padding: 36px 24px 0;
          display: flex;
          justify-content: center;
        }
        .legal-main {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 48px 24px 72px;
        }
        .legal-content {
          width: 100%;
          max-width: 660px;
        }
        .legal-content h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .legal-content > p:first-of-type {
          color: var(--ink-3);
          font-size: 14px;
          margin: 0 0 40px;
        }
        .legal-content h2 {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          margin: 36px 0 10px;
          letter-spacing: -0.01em;
        }
        .legal-content p {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 0 0 12px;
        }
        .legal-content ul, .legal-content ol {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 0 0 12px;
          padding-left: 20px;
        }
        .legal-content li {
          margin-bottom: 4px;
        }
        .legal-content strong {
          font-weight: 600;
          color: var(--ink);
        }
        .legal-content hr {
          border: none;
          border-top: 1px solid var(--line);
          margin: 32px 0;
        }
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin: 0 0 16px;
        }
        .legal-content th {
          text-align: left;
          font-weight: 600;
          color: var(--ink);
          padding: 8px 12px;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
        }
        .legal-content td {
          padding: 10px 12px;
          color: var(--ink-2);
          border-bottom: 1px solid var(--line-soft);
          vertical-align: top;
        }
        .legal-content a {
          color: var(--accent-ink);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .legal-footer {
          border-top: 1px solid var(--line);
          padding: 24px;
          display: flex;
          justify-content: center;
          gap: 28px;
        }
        .legal-footer-link {
          color: var(--ink-3);
          font-size: 13px;
          text-decoration: none;
        }
        .legal-footer-link:hover {
          color: var(--ink-2);
        }
      `}</style>
    </div>
  )
}
