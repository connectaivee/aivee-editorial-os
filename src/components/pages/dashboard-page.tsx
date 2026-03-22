'use client';

import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Linkedin, 
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { editorialData } from '@/lib/mock-data';

const currentIssue = editorialData.issues.find(i => i.status !== 'archived');
const shortlistedStories = editorialData.stories.filter(s => s.disposition === 'use_this_week');
const openReviewItems = editorialData.reviewItems.filter(r => r.status !== 'resolved');
const checklist = editorialData.checklist.filter(c => c.issue_id === currentIssue?.id);

const pipelineSteps = [
  { id: 'signals', label: 'Signals Gathered', status: 'completed' },
  { id: 'shortlist', label: 'Stories Shortlisted', status: 'completed' },
  { id: 'theme', label: 'Theme Selected', status: 'completed' },
  { id: 'draft', label: 'Draft Generated', status: 'completed' },
  { id: 'review', label: 'In Review', status: 'current' },
  { id: 'published', label: 'Published', status: 'pending' },
];

export function DashboardPage() {
  const completedChecklist = checklist.filter(c => c.is_complete).length;
  const totalChecklist = checklist.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Week of March 23, 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-6 gap-4">
        <KpiCard 
          label="Current Issue" 
          value="#001" 
          icon={FileText}
          status="in_review"
        />
        <KpiCard 
          label="Signals Collected" 
          value="12" 
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
          value="Drafted" 
          icon={Linkedin}
        />
        <KpiCard 
          label="Publish Status" 
          value="Review" 
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
            <Link href="/issues/issue-001" className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3 text-sm hover:bg-[var(--line)]">
              <span>Review Current Issue</span>
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
        </div>

        {/* Review Queue */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Review Queue</h2>
          {openReviewItems.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">All items reviewed</p>
          ) : (
            <div className="space-y-3">
              {openReviewItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 rounded-lg bg-[var(--bg-soft)] p-3">
                  <AlertCircle size={16} className={item.priority === 'critical' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs ${
                    item.priority === 'critical' 
                      ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
                      : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publish Readiness */}
      <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <h2 className="mb-4 text-lg font-medium">Publish Readiness Checklist</h2>
        <div className="grid grid-cols-7 gap-4">
          {checklist.map(item => (
            <div key={item.id} className="text-center">
              <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
                item.is_complete ? 'bg-[var(--success)]/10' : 'bg-[var(--bg-soft)]'
              }`}>
                {item.is_complete ? (
                  <CheckCircle2 size={16} className="text-[var(--success)]" />
                ) : (
                  <Clock size={16} className="text-[var(--text-muted)]" />
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{item.item_label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            {completedChecklist}/{totalChecklist} complete
          </span>
          <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]">
            Mark Approved
          </button>
        </div>
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
