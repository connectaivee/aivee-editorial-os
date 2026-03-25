'use client';

import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Linkedin, 
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/db';

const pipelineSteps = [
  { id: 'signals', label: 'Signals Gathered', status: 'completed' },
  { id: 'shortlist', label: 'Stories Shortlisted', status: 'completed' },
  { id: 'theme', label: 'Theme Selected', status: 'completed' },
  { id: 'draft', label: 'Draft Generated', status: 'completed' },
  { id: 'review', label: 'In Review', status: 'current' },
  { id: 'published', label: 'Published', status: 'pending' },
];

export function DashboardPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        const [issuesRes, storiesRes] = await Promise.all([
          supabase.from('issues').select('*').neq('status', 'archived').order('created_at', { ascending: false }).limit(1),
          supabase.from('stories').select('*').eq('disposition', 'use_this_week')
        ]);
        if (issuesRes.data) setIssues(issuesRes.data);
        if (storiesRes.data) setStories(storiesRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  const currentIssue = issues[0];
  const shortlistedStories = stories;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Week of March 25, 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-6 gap-4">
        <KpiCard 
          label="Current Issue" 
          value={currentIssue ? `#${currentIssue.issue_number}` : '—'} 
          icon={FileText}
          status={currentIssue?.status || 'none'}
        />
        <KpiCard 
          label="Signals Collected" 
          value={stories.length.toString()} 
          icon={Search}
        />
        <KpiCard 
          label="Shortlisted" 
          value={shortlistedStories.length.toString()} 
          icon={CheckCircle2}
        />
        <KpiCard 
          label="Readiness" 
          value={`${currentIssue?.readiness_score || 0}%`} 
          icon={TrendingUp}
        />
        <KpiCard 
          label="LinkedIn Status" 
          value={currentIssue?.linkedin_status?.replace('_', ' ') || '—'} 
          icon={Linkedin}
        />
        <KpiCard 
          label="Publish Status" 
          value={currentIssue?.status?.replace('_', ' ') || '—'} 
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="col-span-2 rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Weekly Issue Pipeline</h2>
          <div className="flex items-center gap-2">
            {pipelineSteps.map((step, idx) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.status === 'completed' 
                    ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]'
                    : step.status === 'current'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--line)] text-[var(--text-muted)]'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <span className="text-sm font-medium">{idx + 1}</span>
                  )}
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${
                    step.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--line)]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            {pipelineSteps.map(step => (
              <span key={step.id} className="text-xs text-[var(--text-muted)]">{step.label}</span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/issues" className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3 text-sm hover:bg-[var(--line)]">
              <span>View All Issues</span>
              <ChevronRight size={16} />
            </Link>
            <Link href="/research-feed" className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3 text-sm hover:bg-[var(--line)]">
              <span>View Research Feed</span>
              <ChevronRight size={16} />
            </Link>
            <Link href="/linkedin-posts" className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3 text-sm hover:bg-[var(--line)]">
              <span>Edit LinkedIn Post</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Story Shortlist */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Story Shortlist</h2>
          {shortlistedStories.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No shortlisted stories yet.</p>
          ) : (
            <div className="space-y-3">
              {shortlistedStories.slice(0, 5).map((story, idx) => (
                <div key={story.id} className="flex items-start gap-3 rounded-lg bg-[var(--bg-soft)] p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-medium text-[var(--accent)]">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{story.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{story.source_name}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                    story.overall_score && story.overall_score >= 7
                      ? 'bg-[var(--success)]/10 text-[var(--success)]'
                      : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                  }`}>
                    {story.overall_score?.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Queue */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Review Queue</h2>
          <p className="text-sm text-[var(--text-muted)]">All items reviewed</p>
        </div>
      </div>

      {/* Publish Readiness */}
      <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <h2 className="mb-4 text-lg font-medium">Publish Readiness Checklist</h2>
        <p className="text-sm text-[var(--text-muted)]">Connect Supabase to enable checklist tracking.</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, status }: { 
  label: string; 
  value: string; 
  icon: React.ElementType;
  status?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
        <Icon size={16} className="text-[var(--text-muted)]" />
      </div>
      <p className="text-xl font-semibold">{value}</p>
      {status && (
        <span className={`text-xs ${
          status === 'in_review' ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'
        }`}>
          {status}
        </span>
      )}
    </div>
  );
}
