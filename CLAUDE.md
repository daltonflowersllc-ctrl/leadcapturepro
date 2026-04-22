# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint via next lint
npm run db:generate  # Generate Drizzle migration SQL (rarely needed)
npm run db:push      # Push schema changes directly to Supabase (preferred)
```

No test suite exists in this project.

## Architecture Overview

LeadCapture Pro is a **Next.js 14 App Router** SaaS that captures missed calls for home-service contractors. The core flow: missed call → Twilio webhook → AI-generated SMS with form link → customer fills form → lead saved + owner notified.

### Data Layer

**Supabase is the only database client used at runtime.** Drizzle ORM (`lib/db/schema.ts`) is used purely for schema definition and migrations via `db:push` — it is **not** used for queries. All runtime queries go through `supabaseAdmin` from `lib/supabase-admin.ts`.

```
lib/supabase-admin.ts   → createClient with service role key (bypasses RLS)
lib/db/schema.ts        → Drizzle schema (reference + migration source only)
lib/db/index.ts         → Drizzle client (only used if running migrations)
```

**Critical**: Supabase returns column names as snake_case (matching the actual DB column names, e.g. `caller_name`, `user_id`). The `Lead` interface in `DashboardClient.tsx` uses camelCase — keep this in mind when writing API routes that transform DB rows.

DB connection uses Supabase's **Transaction Pooler** (port 6543), not the direct connection. The `DATABASE_URL` must use the pooler URL with `pgbouncer=true`.

### Authentication

Custom JWT auth — **no NextAuth/Clerk/etc.**

- Token stored in `auth-token` httpOnly cookie (30-day expiry)
- `lib/auth.ts` exports `generateToken`, `verifyToken`, `hashPassword`, `comparePassword`, `generateId`
- Middleware (`middleware.ts`) only checks cookie existence — it runs on Edge Runtime and cannot verify JWTs (Node.js APIs unavailable). Full JWT verification happens inside each API route or Server Component.
- API routes accept the token via cookie **or** `Authorization: Bearer <token>` header.

Protected routes (middleware matcher): `/dashboard/:path*`, `/api/dashboard/:path*`, `/settings/:path*`.

### API Route Conventions

Every API route must export:
```ts
export const dynamic = 'force-dynamic';
```

Routes that use Twilio, Stripe, bcrypt, or other Node.js-only packages must also export:
```ts
export const runtime = 'nodejs';
```

Standard auth check pattern used across all protected routes:
```ts
const cookieToken = request.cookies.get('auth-token')?.value;
const bearerToken = request.headers.get('Authorization')?.slice(7);
const token = cookieToken || bearerToken;
const payload = verifyToken(token);
```

### Tier System

Three tiers: `starter`, `pro`, `elite`. Gates are defined in `lib/limits.ts`:

| Limit | starter | pro | elite |
|-------|---------|-----|-------|
| SMS/month | 100 | 500 | 99,999 |
| Phone numbers | 1 | 3 | 5 |
| Team members | 1 | 2 | 99 |
| AI features | ❌ | ✅ | ✅ |
| Zapier webhooks | ❌ | ✅ | ✅ |

Use `checkAiAccess(tier)` and `checkZapierAccess(tier)` from `lib/limits.ts`. AI-gated features include: lead scoring (Groq), AI-generated SMS, voicemail transcription, call scripts.

Subscription statuses: `trial`, `active`, `canceled`, `past_due`.

### External Services

| Service | Purpose | Key files |
|---------|---------|-----------|
| **Twilio** | Incoming calls + SMS sending | `app/api/webhooks/twilio/route.ts` |
| **Stripe** | Subscriptions + billing portal | `app/api/webhooks/stripe/route.ts`, `lib/stripe.ts` |
| **Groq** (`llama3-8b-8192`) | Lead scoring, SMS generation, call scripts | `lib/ai.ts` |
| **Groq** (`whisper-large-v3`) | Voicemail transcription | `lib/ai.ts` |
| **Resend** | Transactional email | `lib/email.ts` |
| **web-push** | PWA push notifications | `app/api/leads/submit/route.ts` |

### Lead Lifecycle

1. **Missed call** → `POST /api/webhooks/twilio` → creates `calls` record → sends SMS with form link (`/lead?userId=...&callId=...&token=...`)
2. **Form submission** → `POST /api/leads/submit` → AI scores lead → inserts `leads` record → notifies owner via SMS + email + push + Zapier webhook
3. **Lead management** → Dashboard at `/dashboard/leads` with full CRM table, or `/dashboard` card grid
4. **Status updates** → `PATCH /api/leads/[id]/status`; notes → `PATCH /api/leads/[id]/notes`; delete → `DELETE /api/leads/[id]`

### leads.form_data JSONB Shape

The `form_data` column on leads stores extra fields:
```ts
{
  aiScore: 'hot' | 'warm' | 'cold',  // string, not 1-10 number
  aiEmoji: string,
  aiReason: string,
  aiConfidence: string,
  transcription?: string,             // voicemail transcript
  serviceType?: string,
  budget?: string,
  description?: string,
  callbackTime?: string,
  source?: string,                    // 'Missed Call' | 'Voicemail' | 'SMS Reply'
  smsSentAt?: string,                 // ISO timestamp
  repliedAt?: string,                 // ISO timestamp
}
```

### Dashboard Client Architecture

`app/dashboard/DashboardClient.tsx` is the main client component shared between:
- `/dashboard` — main card-grid view
- `/dashboard/leads` — Lead Inbox CRM table view

It uses `usePathname()` to switch between views. Leads are fetched from `GET /api/dashboard/leads` (not `/api/leads`).

The component manages a single shared `leads` state array used by both views, along with `handleStatusChange`, `handleNotesChange`, and `handleDelete` callbacks that update state optimistically.

### Signup Flow

On signup (`POST /api/auth/signup`):
1. Create user in Supabase
2. Provision a Twilio number in the user's area code (or any US number as fallback) — non-fatal
3. Send welcome email — non-fatal
4. Create Stripe checkout session for the selected plan — non-fatal
5. Set `auth-token` cookie and return `checkoutUrl` for client redirect

### Environment Variables

See `.env.example` for all required variables. Key ones:
- `DATABASE_URL` — must use Supabase Transaction Pooler (port 6543)
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — for `supabaseAdmin`
- `JWT_SECRET` — for token signing
- `STRIPE_WEBHOOK_SECRET` — verified on every Stripe webhook
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` — generate with `npx web-push generate-vapid-keys`
- `GROQ_API_KEY` — for all AI features
