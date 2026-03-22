# Aivee Editorial OS - Setup Guide

## Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)
- Git
- GitHub account
- Vercel account (for deployment)
- Supabase account (for database)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/aivee-editorial-os.git
cd aivee-editorial-os
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

- For local development without Supabase: leave as-is (uses mock data)
- For Supabase: add your project URL and anon key

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Cloud Development with Codespaces

### 1. Open in GitHub

Navigate to the repository on GitHub

### 2. Create Codespace

Click "Code" → "Create codespace"

### 3. Wait for Setup

The dev container will:
- Install Node.js 20
- Install GitHub CLI
- Run `npm install`
- Forward port 3000

### 4. Access the App

Click the notification or visit the forwarded URL (usually `https://PORT-random.vscode.dev`)

## Connecting Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `aivee-editorial-os`
   - Database Password: (save this!)
   - Region: closest to you

### 2. Run Database Schema

1. In Supabase dashboard, go to "SQL Editor"
2. Copy the contents of `SUPABASE_SCHEMA.sql`
3. Paste and run

### 3. Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configure Environment

For local development, add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For Vercel, add these in the Vercel dashboard under Environment Variables.

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Node Version Issues

Use nvm to switch Node versions:
```bash
nvm install 20
nvm use 20
```

### Build Errors

Clear the build cache:
```bash
rm -rf .next
npm run build
```

### Supabase Connection Issues

1. Verify your URL and key are correct
2. Check Supabase dashboard for service status
3. Ensure IP allowlist isn't blocking you

### Reset Database

Run the schema again in Supabase SQL Editor to reset all tables.
