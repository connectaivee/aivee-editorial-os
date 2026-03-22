# Aivee Editorial OS - Deployment Guide

## Overview

This guide covers deploying Aivee Editorial OS to Vercel with automatic preview deployments for every branch and pull request.

## Prerequisites

- GitHub account with repository access
- Vercel account
- Supabase project (optional, works with mock data)

## Step 1: Push to GitHub

### If Starting Fresh

```bash
cd aivee-editorial-os
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-org/aivee-editorial-os.git
git push -u origin main
```

### Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (or leave auto)
   - Output Directory: `.next` (or leave auto)
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Click "Deploy"

## Step 2: Verify Deployment

After deployment:
- Check the production URL in Vercel dashboard
- Verify the app loads correctly

## Step 3: Configure Preview Deployments

Vercel automatically creates preview deployments for every branch and PR.

To verify:
1. Create a test branch: `git checkout -b test/preview`
2. Make a small change
3. Push: `git push -u origin test/preview`
4. Vercel will create a preview URL
5. Check the Vercel dashboard for the preview link

## Step 4: Environment Variables Reference

### Required for All Environments

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGciOiJIUz...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_ENV` | Environment name | `production` |
| `NEXT_PUBLIC_APP_URL` | Production URL | Auto-detected |

### Environment-Specific Setup

**Local (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-key
```

**Vercel Preview:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_ENV=preview
```

**Vercel Production:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Branch Strategy

```
main          → Production deployment
feature/*     → Preview deployment
fix/*         → Preview deployment
```

## Rollback Procedure

### Via Vercel Dashboard

1. Go to Vercel dashboard
2. Select the project
3. Go to "Deployments"
4. Find the last working deployment
5. Click "..." → "Promote to Production"

### Via Git

```bash
git revert <bad-commit>
git push origin main
```

## Monitoring

### Vercel Dashboard

- **Deployments**: View all deploys and their status
- **Functions**: Check serverless function logs
- **Analytics**: (Optional) Enable Vercel Analytics

### Checking Deployment Status

Each push shows status in:
- Vercel dashboard
- GitHub commit status
- GitHub PR checks (for pull requests)

## Troubleshooting

### Deployment Failed

1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - Build command errors
   - TypeScript errors

### Preview Not Working

1. Verify branch is pushed to GitHub
2. Check Vercel build logs
3. Ensure `.vercel` directory is not blocking

### Environment Variables Not Loading

1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are added to correct environment (Production, Preview, Development)
3. Redeploy after adding new variables

## CI/CD Best Practices

### GitHub Branch Protection (Optional)

1. Go to GitHub → Repository Settings → Branches
2. Add rule for `main`
3. Require:
   - Pull request reviews
   - Status checks to pass

### Adding Status Checks

Vercel automatically adds deployment status to PRs. For additional checks:

```yaml
# .github/workflows/quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
```

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- Supabase Docs: https://supabase.com/docs
