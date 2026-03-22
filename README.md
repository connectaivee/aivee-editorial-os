# Aivee Editorial OS

Mission control dashboard for managing a weekly newsletter focused on AEC, BIM, ISO 19650, and AI.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **UI Components:** Lucide React icons
- **Backend:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Development:** GitHub, VS Code, GitHub Codespaces

## Features

- **Dashboard** — KPI cards, issue pipeline, story shortlist, review queue
- **Issues Archive** — Full history of newsletter issues
- **Issue Workspace** — Overview, Draft, Sources, Promotion tabs
- **Research Feed** — Signal collection with credibility/relevance scoring
- **LinkedIn Posts** — Post drafting with hook variants
- **Sources Library** — Trusted sources tracking with trust tiers
- **Analytics** — Performance metrics
- **Settings** — Brand, editorial, and scoring configuration

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Supabase (Optional)

By default, the app uses mock data. To connect to a real Supabase backend:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in `SUPABASE_SCHEMA.sql` in the Supabase SQL Editor
3. Add your Supabase URL and keys to `.env.local`
4. Restart the dev server

### GitHub Codespaces

The project includes dev container configuration for cloud development:

1. Open this repo in GitHub
2. Click "Code" → "Create codespace"
3. Wait for setup to complete
4. The app will be available at the forwarded port

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Every branch/PR will get a preview deployment. Main branch deploys to production.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) | No (for admin ops) |
| `NEXT_PUBLIC_APP_ENV` | Environment: development, preview, production | Auto |
| `NEXT_PUBLIC_APP_URL` | App URL for canonical links | Auto |

## Project Structure

```
aivee-editorial-os/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── issues/       # Issues archive & workspace
│   │   ├── research-feed/
│   │   ├── linkedin-posts/
│   │   ├── sources/
│   │   ├── analytics/
│   │   └── settings/
│   ├── components/       # React components
│   │   ├── pages/        # Page-level components
│   │   └── app-shell.tsx # Main layout
│   └── lib/              # Utilities, types, data
│       ├── types.ts      # TypeScript interfaces
│       ├── mock-data.ts  # Development data
│       └── db.ts         # Database client
├── SUPABASE_SCHEMA.sql   # Database schema
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Workflow

### Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Push to GitHub: `git push -u origin feature/my-feature`
4. Vercel creates a preview deployment
5. Review at the preview URL
6. Merge to main when approved

### Weekly Newsletter Flow

1. **Monday** — Alison (researcher) scans sources
2. **Thursday** — Research delivered to Salah
3. **Friday–Saturday** — Salah drafts newsletter + LinkedIn post
4. **Sunday** — Review-ready deliverables
5. **Review** — Mr Vee approves → Publish

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

This is an internal tool for Aivee. For questions, reach out to the team.

## License

Proprietary — Aivee
