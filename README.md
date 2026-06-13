# Textdrop.uz

> **Paste once. Access anywhere.**  
> Turn any text into a 5-character code. Retrieve it instantly from any device.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/textdrop)

---

## Overview

Textdrop is a minimal, production-ready text sharing tool. Users paste text, receive a short 5-character code, and anyone can retrieve that text on any device using the code. No accounts, no login, no friction.

**Live:** [textdrop.uz](https://textdrop.uz)

---

## Features

- ⚡ Generate unique 5-character codes instantly
- 🔒 No accounts required
- 🌙 Dark mode support
- 📱 Mobile-first responsive design
- 🛡 Rate limiting, XSS protection, input validation
- 🔗 Shareable URLs: `/code/K7M4P`
- ⏱ Codes expire after 30 days
- 📊 View count tracking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Database | PostgreSQL |
| ORM | Prisma |
| Deployment | Vercel |
| Fonts | DM Sans + DM Mono (Google Fonts) |

---

## Project Structure

```
textdrop/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migration.sql          # Raw SQL migration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── create/route.ts     # POST /api/create
│   │   │   ├── retrieve/route.ts   # POST /api/retrieve
│   │   │   └── health/route.ts     # GET /api/health
│   │   ├── code/[code]/
│   │   │   └── page.tsx       # Shareable URL page
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── not-found.tsx      # 404 page
│   │   ├── page.tsx           # Homepage
│   │   ├── robots.ts          # robots.txt
│   │   └── sitemap.ts         # sitemap.xml
│   ├── components/
│   │   ├── CreateSection.tsx  # Text input + code generation UI
│   │   ├── Header.tsx         # Navigation + theme toggle
│   │   ├── RetrieveSection.tsx # Code input + text retrieval UI
│   │   ├── ThemeProvider.tsx  # next-themes wrapper
│   │   └── Toast.tsx          # Toast notifications
│   └── lib/
│       ├── codes.ts           # Code generation utilities
│       ├── prisma.ts          # Prisma client singleton
│       └── rateLimit.ts       # In-memory rate limiter
├── .env.example               # Environment variable template
├── next.config.mjs            # Next.js config + security headers
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Clone and install

```bash
git clone https://github.com/yourusername/textdrop.git
cd textdrop
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/textdrop"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set up database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# OR run migration (production-ready)
npm run db:migrate
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

```prisma
model Text {
  id        String    @id @default(cuid())
  code      String    @unique           // 5-char code e.g. "K7M4P"
  content   String                      // stored text content
  createdAt DateTime  @default(now())
  viewCount Int       @default(0)       // retrieval counter
  expiresAt DateTime?                   // optional expiry (30 days)

  @@index([code])
  @@map("texts")
}
```

---

## API Reference

### `POST /api/create`

Creates a new text entry and returns a unique code.

**Request:**
```json
{ "text": "Your text content here" }
```

**Response (201):**
```json
{ "code": "K7M4P", "createdAt": "2024-01-01T00:00:00.000Z" }
```

**Limits:** 50,000 characters max · 10 requests/minute per IP

---

### `POST /api/retrieve`

Retrieves text by code.

**Request:**
```json
{ "code": "K7M4P" }
```

**Response (200):**
```json
{
  "text": "Your text content here",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "viewCount": 3
}
```

**Errors:**
- `400` — Invalid code format
- `404` — Code not found  
- `410` — Code expired
- `429` — Rate limited

---

### `GET /api/health`

Returns service status.

```json
{
  "status": "ok",
  "service": "textdrop",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": { "status": "connected", "latencyMs": 12 },
  "uptime": 3600
}
```

---

## Deployment: Vercel + Neon PostgreSQL

### Step 1: Create a PostgreSQL database

**Option A: Neon (recommended, serverless)**
1. Go to [neon.tech](https://neon.tech) → Create account
2. Create a new project → copy the connection string

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com) → Create project
2. Settings → Database → copy connection string

**Option C: Railway**
1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the connection URL

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables:
   ```
   DATABASE_URL=postgresql://...your-connection-string...
   NEXT_PUBLIC_APP_URL=https://textdrop.uz
   ```
4. Deploy

### Step 3: Run database migration

After deployment, run via Vercel CLI or locally:

```bash
# With your production DATABASE_URL set:
npx prisma migrate deploy
# or
npx prisma db push
```

### Step 4: Connect your domain

In Vercel → Project Settings → Domains → Add `textdrop.uz`

Update your domain DNS:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

---

## Code System

Codes use a human-friendly character set that avoids confusion:

```
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

**Excluded:** `O` (looks like 0), `0` (looks like O), `I` (looks like 1), `1` (looks like I)

- **Total possible codes:** 32⁵ = **33,554,432**
- **Length:** Always 5 characters
- **Uniqueness:** Guaranteed via database unique constraint + retry logic

---

## Security

- **Rate limiting:** 10 creates/min, 60 retrieves/min per IP
- **Input validation:** Code format validation, max content length
- **Security headers:** X-Frame-Options, CSP, HSTS, X-Content-Type-Options
- **SQL injection:** Protected by Prisma ORM (parameterized queries)
- **XSS:** Output escaped by React; CSP headers enforced
- **No sensitive data logging**

---

## Performance

- Prisma query with indexed `code` column → typically **< 5ms** DB latency
- Total API response time target: **< 200ms**
- Next.js App Router with server-side rendering for direct code URLs
- Static generation for homepage

---

## Production Checklist

- [ ] PostgreSQL database provisioned
- [ ] `DATABASE_URL` set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Prisma migration run on production DB
- [ ] Domain DNS configured
- [ ] SSL certificate active (Vercel handles automatically)
- [ ] Consider Upstash Redis for distributed rate limiting (multi-region)

---

## License

MIT — feel free to deploy your own instance.
