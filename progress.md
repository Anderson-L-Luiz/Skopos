# Skopos — Progress Tracker

**Career Intelligence Platform** · Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite

---

## ✅ Completed

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

### Feature 1 — Job Aggregation Engine
- [x] Mock scrapers for Indeed, LinkedIn, Glassdoor (`lib/scrapers/jobScraper.ts`)
- [x] 65+ realistic jobs: Google, Stripe, Airbnb, Microsoft, Meta, Netflix, etc.
- [x] Canonical schema: title, company, location, remote, salary range, skills, source, trust score
- [x] Deduplication by company + title
- [x] Source trust score ranking
- [x] `GET /api/jobs` — filterable by search, source, remote, min salary, pagination
- [x] `POST /api/jobs/scrape` — trigger job refresh
- [x] `GET /api/jobs/[id]` — single job detail
- [x] Jobs page UI: filter bar, job cards with company avatars, staggered animations, pagination

### Feature 2 — Smart CV Builder
- [x] CV upload endpoint (`POST /api/cv/upload`) — accepts PDF/DOCX
- [x] Profile enrichment (`POST /api/cv/enrich`) — scrapes LinkedIn, GitHub, Google Scholar URLs
- [x] Mock profile scraper (`lib/scrapers/profileScraper.ts`) — generates enriched data from URLs
- [x] `GET /api/cv` + `PUT /api/cv` — read/update profile
- [x] CV Builder page: edit form (headline, role, years exp, summary), skills manager, social links
- [x] CV Preview tab: displays enriched LinkedIn, GitHub, Scholar data
- [x] CVUploader component: drag-and-drop with upload states

### Feature 3 — Match & Approval Scoring
- [x] Match scoring algorithm (`lib/scoring/matchScorer.ts`)
  - Skill overlap (40%), experience level (30%), location/remote (20%), salary (10%)
- [x] Job categories: **Open** (score ≥ 70), **Within Reach** (40–69), **Stretch** (< 40)
- [x] Gap analysis: strengths list + missing skills per job
- [x] `GET /api/matches` — fetch all scored matches
- [x] `POST /api/matches/score-all` — score all jobs against current profile
- [x] `POST /api/matches/score/[jobId]` — score a single job
- [x] Matches page: SVG score rings, category summary cards, filterable tab bar

### Feature 4 — Personal Brand & PR Advisor
- [x] Brand analyzer (`lib/brand/brandAnalyzer.ts`)
  - Scores: LinkedIn presence, GitHub activity, content frequency, engagement, portfolio quality
- [x] `POST /api/brand/analyze` — run full analysis
- [x] `GET /api/brand/analysis` — fetch last analysis
- [x] Brand score stored on user profile
- [x] Brand page UI: platform cards, animated loading state, full analysis report
- [x] BrandAnalysis component: SVG score ring, gradient breakdown bars, recommendations, content strategy, portfolio suggestions

### Feature 5 — Interview Prep & Career Path
- [x] Interview question bank (`GET /api/interview/questions`) — filterable by category + difficulty
  - Categories: behavioral, technical, company fit, coding
  - Difficulties: easy, medium, hard
- [x] Career path model (`GET /api/career/path`) — trajectory from current → target role
  - Steps with role, timeframe, salary range, required skills, description
- [x] Interview page: question cards with expandable tips, numbered career timeline

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
- [x] Dark mode toggle (localStorage-persisted)
- [x] Responsive layout

---

## 🔄 In Progress / Partially Done

### Job Aggregation
- [ ] **Real scraping** — current scrapers return mock data; integrate real APIs (Indeed Publisher API, LinkedIn Job Search API, Glassdoor API) or Puppeteer-based scrapers
- [ ] **Scheduled scraping** — auto-refresh jobs on a cron schedule (every 6–12 hours)
- [ ] **More sources** — add RemoteOK, HackerNews Jobs, WeWorkRemotely, Greenhouse

### CV Builder
- [ ] **Real PDF parsing** — current upload stores filename only; integrate `pdf-parse` or `mammoth` to extract actual CV text
- [ ] **ATS optimization score** — compare CV content against job descriptions, score keyword density
- [ ] **CV export** — generate a formatted PDF CV from profile data (e.g. with `puppeteer` or `react-pdf`)
- [ ] **Real web enrichment** — current scraper generates mock data; integrate LinkedIn scraping (Proxycurl API) and GitHub API

### Authentication & Accounts
- [ ] **OAuth providers** — add Google, LinkedIn, GitHub sign-in via NextAuth
- [ ] **Password reset** — forgot password flow with email
- [ ] **Email verification** — verify email on registration
- [ ] **Profile avatar upload** — user profile photo

### Match Scoring
- [ ] **AI-powered scoring** — replace heuristic scorer with OpenAI / Claude API for semantic skill matching
- [ ] **Application tracking** — mark jobs as Applied, Interviewing, Offered, Rejected with status updates
- [ ] **Match history** — track how match scores change over time as profile improves

### Brand Advisor
- [ ] **Real social scraping** — integrate Twitter/X API, LinkedIn API, Instagram Basic Display API
- [ ] **GitHub real data** — use GitHub REST API to fetch actual repos, stars, contributions
- [ ] **Content calendar** — generate a weekly content plan with suggested post topics and timing
- [ ] **Competitor benchmarking** — compare brand score vs. industry peers

### Interview Prep
- [ ] **Company intelligence** — fetch real company data (Crunchbase, LinkedIn Company API, news)
- [ ] **Role-specific questions** — generate questions tailored to specific job descriptions
- [ ] **AI mock interview** — conversational practice with Claude API, scoring responses
- [ ] **Answer evaluation** — rate user's answer drafts against STAR methodology

### Career Path
- [ ] **Real market data** — pull salary data from Glassdoor/Levels.fyi API
- [ ] **Skill gap courses** — link missing skills to specific Coursera/Udemy/YouTube resources
- [ ] **Industry trends** — show which skills are growing in demand

### Infrastructure
- [ ] **Migrate to PostgreSQL** — swap SQLite for Postgres for production readiness
- [ ] **File storage** — store uploaded CVs in S3/Cloudflare R2 instead of local filesystem
- [ ] **Rate limiting** — protect API routes from abuse
- [ ] **Error monitoring** — integrate Sentry
- [ ] **Analytics** — page view and feature usage tracking
- [ ] **Email notifications** — notify user when new matching jobs appear
- [ ] **API key management** — let users add their own OpenAI/Anthropic keys

### Deployment
- [ ] **Vercel deployment** — configure `vercel.json`, switch to Postgres, set env vars
- [ ] **Docker setup** — `Dockerfile` + `docker-compose.yml` for self-hosting
- [ ] **CI/CD pipeline** — GitHub Actions for lint, typecheck, build on every PR
- [ ] **Environment configs** — staging vs production env separation

---

## 🐛 Known Issues

- CV upload stores files in `/tmp` (ephemeral) — needs persistent storage (S3)
- Brand analysis is fully mocked — scores are generated, not scraped
- Profile enrichment generates plausible fake data — not real scraping
- No pagination on matches page
- Dark mode not fully tested on all pages
- Job detail page (`/jobs/[id]`) uses basic styling — not yet redesigned

---

## 📐 Architecture

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
│   │   └── interview/
│   ├── api/             # API routes (Next.js Route Handlers)
│   └── page.tsx         # landing page
├── components/
│   ├── layout/          # Sidebar, Header
│   ├── ui/              # Button, Card, Badge, Input, etc.
│   ├── dashboard/       # StatsCard
│   ├── jobs/            # JobCard, JobFilters
│   ├── matches/         # MatchCard
│   ├── cv/              # CVUploader, CVPreview
│   └── brand/           # BrandAnalysis
├── lib/
│   ├── prisma.ts        # Prisma client singleton
│   ├── auth.ts          # NextAuth config
│   ├── scrapers/        # jobScraper, profileScraper
│   ├── scoring/         # matchScorer
│   └── brand/           # brandAnalyzer
├── prisma/
│   ├── schema.prisma    # DB schema
│   ├── seed.ts          # 65-job seed data
│   └── dev.db           # SQLite database
└── types/index.ts       # Shared TypeScript types
```

---

## 🚀 Getting Started

```bash
cd Skopos
npm install
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Demo login: `demo@skopos.dev` / `password123`

---

*Last updated: April 2026*
