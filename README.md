# Taska

> A tidy home for freelance jobs.

Hierarchy: **Clients → Projects → Tasks**

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth + DB | Supabase (email/password + Google OAuth) |
| Payments | Stripe (£4.99/month, 1-month free trial) |
| Deploy | Vercel |
| Design | Custom CSS — Figtree + JetBrains Mono |

---

## Local setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR/taska.git
cd taska
npm install
cp .env.local.example .env.local
```

### 2. Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial.sql` in the SQL Editor
3. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. **Authentication → URL Configuration** — set:
   - Site URL: `https://yourdomain.com` (or `http://localhost:3000` for local)
   - Redirect URLs: add `https://yourdomain.com/auth/callback`
5. **Authentication → Providers → Google** — enable and paste your Google OAuth credentials:
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`

### 3. Stripe

1. Account at [stripe.com](https://stripe.com)
2. Create a product **Taska Pro** with a **recurring £4.99/month GBP** price
   - Copy the `price_...` ID → `STRIPE_PRICE_PRO_MONTHLY`
   - **Note:** Taska handles the trial logic in-app. The Stripe price itself has NO trial period — users are charged immediately when they click "Add payment method" after the free trial.
3. **Developers → API Keys**:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. **Webhooks** — add endpoint `https://yourdomain.com/api/stripe/webhook`:
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
5. For local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel via GitHub

```bash
git init
git add .
git commit -m "Initial Taska build"
git remote add origin https://github.com/YOUR/taska.git
git push -u origin main
```

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
2. Framework: **Next.js** (auto-detected)
3. Add all env vars from `.env.local`
4. Deploy

After deploy, update Supabase Site URL and Redirect URLs to your Vercel domain.

---

## Key behaviours

**Trial flow**
- Sign up → 30-day free trial starts immediately, no card required
- After trial expires: every page redirects to `/billing` (hard paywall — no dismiss)
- User adds card → charged £4.99 → redirected back to app

**Alert strip**
- Tasks with a due date of today or earlier surface as orange alerts on the Dashboard
- Alerts have no dismiss button — they disappear only when the user opens the project and marks the task done

**Clients → Projects → Tasks**
- Every project must belong to a client (enforced by DB FK constraint + UI)
- Every task must belong to a project (enforced by DB FK constraint)
- Project numbering is auto-sequential: `J-001`, `J-002`, …

---

## Project structure

```
taska/
├── app/
│   ├── (app)/                     Protected app shell (checks auth + plan)
│   │   ├── dashboard/             Live projects grid + alert strip
│   │   ├── projects/[id]/         Project detail — tasks + notes
│   │   ├── clients/               Client list with project accordion
│   │   ├── tasks/                 Cross-project task view
│   │   ├── archive/               Done projects
│   │   └── settings/              Profile + billing management
│   ├── billing/                   Hard paywall page (no shell)
│   ├── auth/
│   │   ├── login/                 Email/password + Google OAuth
│   │   ├── signup/                Sign up (starts trial)
│   │   └── callback/              Supabase OAuth callback
│   └── api/
│       └── stripe/
│           ├── checkout/          Creates Stripe Checkout session
│           ├── portal/            Opens Stripe Billing Portal
│           └── webhook/           Handles subscription events
├── components/
│   ├── layout/app-shell.tsx       Sidebar + shell wrapper
│   └── ui/
│       ├── icons.tsx              SVG icon set (exact design export)
│       ├── project-ui.tsx         StatusPill, Avatar, ProjectCard
│       ├── date-picker.tsx        Inline calendar popover
│       └── create-modal.tsx       New project modal
├── lib/
│   ├── actions.ts                 All server actions (CRUD)
│   ├── stripe.ts                  Stripe client + helpers
│   └── supabase/                  Browser / server / middleware clients
├── types/index.ts                 All TypeScript types + plan helpers
└── supabase/migrations/001.sql    Full DB schema + RLS + trigger
```
