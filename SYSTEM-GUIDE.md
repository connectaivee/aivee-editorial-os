# Aivee Editorial OS - Complete System Guide

## Overview

Aivee Editorial OS is a mission control dashboard for managing a weekly newsletter focused on AEC, BIM, ISO 19650 standards, and AI. It consists of:

- **Web App** (Next.js) - The dashboard interface
- **GitHub** - Code storage and version control
- **Vercel** - Hosting and automatic deployments
- **Supabase** - Database and backend

---

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Vercel    │────▶│  Supabase  │
│  (Browser)  │     │  (Hosting)  │     │ (Database)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │            ┌──────┴──────┐
       │            │             │
       ▼            ▼             ▼
   GitHub      Production     Preview
  (Code)       Deployments   Deployments
```

---

## Components

### 1. Web App (Next.js)

**URL:** https://aivee-editorial-os.vercel.app

**Pages:**
- `/` - Dashboard with KPIs, pipeline, story shortlist
- `/issues` - Issues archive
- `/issues/[id]` - Issue workspace (4 tabs)
- `/research-feed` - Research signals with scoring
- `/linkedin-posts` - LinkedIn post management
- `/sources` - Trusted sources library
- `/analytics` - Performance metrics
- `/settings` - Configuration

### 2. GitHub Repository

**URL:** https://github.com/connectaivee/aivee-editorial-os

**Branches:**
- `main` - Production code
- `feature/*` - New features (get preview deployments)
- `fix/*` - Bug fixes (get preview deployments)

### 3. Vercel

**URL:** https://vercel.com/aivee/aivee-editorial-os

**What it does:**
- Hosts the live app
- Creates preview deployments for every branch
- Manages environment variables

### 4. Supabase

**Project:** tskwlehawblitpttzixz

**What it does:**
- Stores all data (issues, stories, sources, etc.)
- Provides API for the app to read/write data

---

## How Data Flows

### Current State (Mock Data)

The app currently uses mock data stored in the code. This works offline but changes don't persist.

```
App Code → Mock Data (in src/lib/mock-data.ts) → Dashboard
```

### Connected State (Supabase)

When env vars are set, the app connects to Supabase:

```
App Code → Supabase API → Database Tables → Dashboard
```

---

## Weekly Workflow

### 1. Research (Alison)

1. Alison scans sources across AEC, BIM, standards, AI
2. Creates research signals in the Research Feed
3. Each signal gets scored: Credibility, Relevance, Novelty, Actionability

### 2. Story Selection

1. Review signals in `/research-feed`
2. Shortlist 3-5 stories for the week
3. Mark disposition: "Use This Week" / "Save for Later" / "Ignore"

### 3. Drafting (Salah)

1. Create or open issue at `/issues`
2. Fill in sections:
   - Opening note
   - Development stories (3-5)
   - Standards Spotlight
   - AI-in-AEC Spotlight
   - "What to Watch"
   - CTA
3. Generate LinkedIn post with hook variants

### 4. Review (Mr Vee)

1. Review issue at `/issues/[id]`
2. Check review queue items
3. Verify checklist completeness
4. Mark as "Approved"

### 5. Publish

1. Publish newsletter
2. Publish LinkedIn post
3. Issue status → "Published"

---

## Deployment Guide

### How Code Gets to Production

```
1. Developer makes changes locally
   │
   ▼
2. git add . && git commit -m "changes"
   │
   ▼
3. git push origin main
   │
   ▼
4. Vercel detects new commit
   │
   ▼
5. Vercel builds and deploys
   │
   ▼
6. Live at https://aivee-editorial-os.vercel.app
```

### How Preview Deployments Work

```
1. git checkout -b feature/new-feature
2. Make changes
3. git push -u origin feature/new-feature
   │
   ▼
4. Vercel creates preview URL
   │
   ▼
5. Review at preview URL
   │
   ▼
6. Merge to main → Production deploys
```

---

## Environment Variables

### Local Development (.env.local)

```
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://tskwlehawblitpttzixz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel (Production)

Same variables are set in Vercel dashboard for production.

---

## Troubleshooting

### App Shows Mock Data

**Cause:** Supabase env vars not set in Vercel

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://tskwlehawblitpttzixz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Redeploy

### Database Empty

**Cause:** First time setup - no data in Supabase

**Fix:** Data needs to be added through the app or directly in Supabase

### Preview Not Working

**Cause:** Branch not pushed to GitHub

**Fix:** Ensure branch is pushed: `git push -u origin feature/name`

---

## Tech Stack Details

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Code | GitHub |

---

## Quick Reference

| Action | Command/Link |
|--------|--------------|
| Live App | https://aivee-editorial-os.vercel.app |
| GitHub | https://github.com/connectaivee/aivee-editorial-os |
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/aivee/aivee-editorial-os |

---

## Need Help?

1. **App issues** - Check Vercel deployment logs
2. **Database issues** - Check Supabase SQL Editor
3. **Code issues** - Check GitHub commits

---

*Last updated: March 2026*
