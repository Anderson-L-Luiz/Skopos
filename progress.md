# Skopos — Progress Tracker

**Career Intelligence Platform** · Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite

---

## Completed

### Infrastructure & Setup
- [x] Next.js 14 App Router project with TypeScript
- [x] Tailwind CSS with custom design system (shadows, gradients, animations)
- [x] Prisma ORM with SQLite database (`prisma/dev.db`)
- [x] NextAuth.js authentication with Credentials provider
- [x] Database schema: `User`, `Profile`, `Job`, `JobMatch`, `Application`, `Session`
- [x] Database seeded with 65 realistic jobs across Indeed, LinkedIn, Glassdoor
- [x] Demo account: `demo@skopos.dev` / `password123`
- [x] Protected app layout (auth guard, redirect to login)
- [x] `.env` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [x] `.env.example` template for easy setup
- [x] API rate limiting (in-memory, per-IP) on auth, scraping, scoring, and analysis routes
- [x] Docker setup — `Dockerfile` (multi-stage) + `docker-compose.yml` for self-hosting
- [x] CI/CD pipeline — GitHub Actions for lint, typecheck, and build on every push/PR
- [x] `.dockerignore` for optimized Docker builds

### Feature 1 — Job Aggregation Engine
- [x] Mock scrapers for Indeed, LinkedIn, Glassdoor (`lib/scrapers/jobScraper.ts`)
- [x] 65+ realistic jobs: Google, Stripe, Airbnb, Microsoft, Meta, Netflix, etc.
- [x] Canonical schema: title, company, location, remote, salary range, skills, source, trust score
- [x] Deduplication by company + title
- [x] Source trust score ranking
- [x] `GET /api/jobs` — filterable by search, source, remote, min salary, pagination
- [x] `POST /api/jobs/scrape` — trigger job refresh (rate limited: 5 req/min)
- [x] `GET /api/jobs/[id]` — single job detail
- [x] Jobs page UI: filter bar, job cards with company avatars, staggered animations, pagination
- [x] Redesigned job detail page: company avatar, gradient accents, trust score, polished layout

### Feature 2 — Smart CV Builder
- [x] CV upload endpoint (`POST /api/cv/upload`) — accepts PDF/DOCX with real text extraction
- [x] Real PDF parsing using pdf-parse for text extraction
- [x] Real DOCX parsing using mammoth for text extraction
- [x] Profile enrichment (`POST /api/cv/enrich`) — scrapes LinkedIn, GitHub, Google Scholar URLs
- [x] Real GitHub API integration — fetches repos, stars, languages, contributions from public API
- [x] Mock LinkedIn/Scholar scrapers with fallback data
- [x] `GET /api/cv` + `PUT /api/cv` — read/update profile
- [x] ATS Optimization Score (`POST /api/cv/ats-score`) — keyword matching, section analysis, formatting checks
- [x] CV Export (`GET /api/cv/export`) — generates professional HTML CV for print/PDF
- [x] CV Builder page: edit form, skills manager, social links, ATS scoring tab, export button
- [x] CV Preview tab: displays enriched LinkedIn, GitHub, Scholar data
- [x] CVUploader component: drag-and-drop with upload states, raw text preview

### Feature 3 — Match & Approval Scoring
- [x] Match scoring algorithm (`lib/scoring/matchScorer.ts`)
  - Skill overlap (40%), experience level (30%), location/remote (20%), salary (10%)
- [x] Job categories: **Open** (score >= 70), **Within Reach** (40–69), **Stretch** (< 40)
- [x] Gap analysis: strengths list + missing skills per job
- [x] `GET /api/matches` — fetch all scored matches
- [x] `POST /api/matches/score-all` — score all jobs against current profile (rate limited: 5 req/min)
- [x] `POST /api/matches/score/[jobId]` — score a single job
- [x] Matches page: SVG score rings, category summary cards, filterable tab bar, **pagination (18/page)**

### Feature 4 — Personal Brand & PR Advisor
- [x] Brand analyzer (`lib/brand/brandAnalyzer.ts`)
  - Scores: LinkedIn presence, GitHub activity, content frequency, engagement, portfolio quality
- [x] `POST /api/brand/analyze` — run full analysis (rate limited: 10 req/min)
- [x] `GET /api/brand/analysis` — fetch last analysis
- [x] Brand score stored on user profile
- [x] Brand page UI: platform cards, animated loading state, full analysis report
- [x] BrandAnalysis component: SVG score ring, gradient breakdown bars, recommendations, content strategy, portfolio suggestions
- [x] Content Calendar (`GET /api/brand/calendar`) — 4-week personalized content plan
- [x] ContentCalendar component: weekly view, platform-coded items, hashtags, posting times

### Feature 5 — Interview Prep & Career Path
- [x] Interview question bank (`GET /api/interview/questions`) — filterable by category + difficulty
  - Categories: behavioral, technical, company fit, coding
  - Difficulties: easy, medium, hard
- [x] Role-specific interview questions — generate tailored questions from job descriptions and required skills
- [x] Career path model (`GET /api/career/path`) — trajectory from current to target role
  - Steps with role, timeframe, salary range, required skills, description
- [x] Skill gap course recommendations (`GET /api/career/courses`) — maps 30+ tech skills to Coursera, Udemy, YouTube, freeCodeCamp courses with real URLs
- [x] Interview page: question cards with expandable tips, job selector dropdown, numbered career timeline
- [x] Courses tab: skill-grouped recommendations with platform badges, free/paid indicators, estimated hours

### Feature 6 — Application Tracking
- [x] Application CRUD API (`GET/POST /api/applications`, `PUT/DELETE /api/applications/[id]`)
- [x] Application statuses: saved, applied, interviewing, offered, rejected
- [x] Kanban-style Applications page with status columns and count badges
- [x] Inline status changes and notes editing
- [x] TrackApplicationButton component (default + compact variants)
- [x] Integrated into job cards and job detail page
- [x] Applications added to sidebar navigation

### Dashboard
- [x] `GET /api/dashboard/stats` — total jobs, matches, applications, brand score, match breakdown
- [x] Welcome banner with gradient
- [x] Stats cards (jobs, matches, applications, brand score)
- [x] Donut chart — match category breakdown (Recharts)
- [x] Radial gauge — brand score (Recharts)
- [x] Quick action grid — all 5 tools
- [x] Activity feed

### UI / UX Design System
- [x] Custom CSS variables, shadow scale, gradient utilities
- [x] Staggered entry animations (`animate-slide-up`, `stagger-1..5`)
- [x] Split-screen auth pages (login + register)
- [x] Redesigned sidebar: icon containers, sub-descriptions, user profile section
- [x] Header: notification dropdown, subtitle, action slot
- [x] Polished component library: Button, Card, Badge, Input, Tabs, Progress, Select, Textarea, Separator
- [x] Dark mode toggle (localStorage-persisted) with full dark mode support across all components
- [x] Responsive layout
- [x] Dark mode fixes: sidebar, cards, and all pages use CSS variable-based theming

---

## Remaining / Future Work

### Job Aggregation
- [ ] **Real scraping** — integrate real APIs (Indeed Publisher API, LinkedIn Job Search API, Glassdoor API) or Puppeteer-based scrapers
- [ ] **Scheduled scraping** — auto-refresh jobs on a cron schedule (every 6–12 hours)
- [ ] **More sources** — add RemoteOK, HackerNews Jobs, WeWorkRemotely, Greenhouse

### CV Builder
- [ ] **Real web enrichment** — integrate LinkedIn scraping (Proxycurl API) and Google Scholar API
- [ ] **CV template selection** — multiple CV templates/themes for export

### Authentication & Accounts
- [ ] **OAuth providers** — add Google, LinkedIn, GitHub sign-in via NextAuth
- [ ] **Password reset** — forgot password flow with email
- [ ] **Email verification** — verify email on registration
- [ ] **Profile avatar upload** — user profile photo

### Match Scoring
- [ ] **AI-powered scoring** — replace heuristic scorer with OpenAI / Claude API for semantic skill matching
- [ ] **Match history** — track how match scores change over time as profile improves

### Brand Advisor
- [ ] **Real social scraping** — integrate Twitter/X API, LinkedIn API, Instagram Basic Display API
- [ ] **Competitor benchmarking** — compare brand score vs. industry peers

### Interview Prep
- [ ] **Company intelligence** — fetch real company data (Crunchbase, LinkedIn Company API, news)
- [ ] **AI mock interview** — conversational practice with Claude API, scoring responses
- [ ] **Answer evaluation** — rate user's answer drafts against STAR methodology

### Career Path
- [ ] **Real market data** — pull salary data from Glassdoor/Levels.fyi API
- [ ] **Industry trends** — show which skills are growing in demand

### Infrastructure
- [ ] **Migrate to PostgreSQL** — swap SQLite for Postgres for production readiness
- [ ] **File storage** — store uploaded CVs in S3/Cloudflare R2 instead of local filesystem
- [ ] **Error monitoring** — integrate Sentry
- [ ] **Analytics** — page view and feature usage tracking
- [ ] **Email notifications** — notify user when new matching jobs appear
- [ ] **API key management** — let users add their own OpenAI/Anthropic keys

### Deployment
- [ ] **Vercel deployment** — configure `vercel.json`, switch to Postgres, set env vars
- [ ] **Environment configs** — staging vs production env separation

---

## Architecture

```
Skopos/
├── app/
│   ├── (auth)/          # login, register — no sidebar
│   ├── (app)/           # protected pages with sidebar
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── cv/
│   │   ├── matches/
│   │   ├── brand/
│   │   ├── interview/
│   │   └── applications/
│   ├── api/             # API routes (Next.js Route Handlers)
│   │   ├── auth/        # login, register
│   │   ├── jobs/        # CRUD, scrape
│   │   ├── cv/          # upload, enrich, ats-score, export
│   │   ├── matches/     # score-all, score/[id]
│   │   ├── brand/       # analyze, calendar
│   │   ├── career/      # path, courses
│   │   ├── interview/   # questions
│   │   ├── applications/# CRUD
│   │   └── dashboard/   # stats
│   └── page.tsx         # landing page
├── components/
│   ├── layout/          # Sidebar, Header
│   ├── ui/              # Button, Card, Badge, Input, etc.
│   ├── dashboard/       # StatsCard
│   ├── jobs/            # JobCard, JobFilters
│   ├── matches/         # MatchCard
│   ├── cv/              # CVUploader, CVPreview
│   ├── brand/           # BrandAnalysis, ContentCalendar
│   └── applications/    # TrackApplicationButton
├── lib/
│   ├── prisma.ts        # Prisma client singleton
│   ├── auth.ts          # NextAuth config
│   ├── rateLimit.ts     # In-memory rate limiter
│   ├── middleware/       # withRateLimit helper
│   ├── scrapers/        # jobScraper, profileScraper (GitHub real API)
│   ├── scoring/         # matchScorer, atsScorer
│   ├── brand/           # brandAnalyzer, contentCalendar
│   └── career/          # courseRecommender
├── prisma/
│   ├── schema.prisma    # DB schema
│   ├── seed.ts          # 65-job seed data
│   └── dev.db           # SQLite database
├── types/index.ts       # Shared TypeScript types
├── Dockerfile           # Multi-stage production build
├── docker-compose.yml   # Self-hosting config
├── .github/workflows/   # CI/CD pipeline
└── .env.example         # Environment template
```

---

## Getting Started

```bash
cd Skopos
npm install
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
npm run dev
```

### Docker

```bash
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000)
Demo login: `demo@skopos.dev` / `password123`

---

*Last updated: April 2026*
