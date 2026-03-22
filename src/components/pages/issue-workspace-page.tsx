'use client';

import { useState } from 'react';
import { 
  FileText, Search, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, Star, Link as LinkIcon, Sparkles, Eye, Edit
} from 'lucide-react';
import { editorialData } from '@/lib/mock-data';
import { Issue } from '@/lib/types';

type TabType = 'overview' | 'draft' | 'sources' | 'promotion';

export function IssueWorkspacePage({ issueId }: { issueId: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const issue = editorialData.issues.find(i => i.id === issueId) || editorialData.issues[0];
  const stories = editorialData.stories.filter(s => s.issue_id === issueId);
  const shortlistedStories = stories.filter(s => s.disposition === 'use_this_week');
  const linkedinPost = editorialData.linkedinPosts.find(p => p.issue_id === issueId);
  const reviewItems = editorialData.reviewItems.filter(r => r.issue_id === issueId);
  const checklist = editorialData.checklist.filter(c => c.issue_id === issueId);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'draft', label: 'Draft' },
    { id: 'sources', label: 'Sources' },
    { id: 'promotion', label: 'Promotion' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="border-b border-[var(--line)] bg-[var(--bg-panel)] px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">Issue</span>
              <span className="text-2xl font-semibold">#{issue.issue_number.toString().padStart(3, '0')}</span>
              <StatusBadge status={issue.status} />
            </div>
            <h1 className="mt-1 text-xl">{issue.title}</h1>
            {issue.subtitle && <p className="text-[var(--text-secondary)]">{issue.subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm hover:bg-[var(--line)]">
              <Eye size={16} />
              Preview
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]">
              <CheckCircle2 size={16} />
              Mark Approved
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-[var(--line)]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <OverviewTab issue={issue} stories={shortlistedStories} reviewItems={reviewItems} checklist={checklist} />
        )}
        {activeTab === 'draft' && (
          <DraftTab issue={issue} stories={shortlistedStories} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab stories={stories} />
        )}
        {activeTab === 'promotion' && (
          <PromotionTab post={linkedinPost} />
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    collecting_signals: 'bg-blue-500/10 text-blue-400',
    shortlisting: 'bg-purple-500/10 text-purple-400',
    drafting: 'bg-yellow-500/10 text-yellow-400',
    in_review: 'bg-orange-500/10 text-orange-400',
    approved: 'bg-green-500/10 text-green-400',
    published: 'bg-emerald-500/10 text-emerald-400',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] || 'bg-gray-500/10 text-gray-400'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function OverviewTab({ issue, stories, reviewItems, checklist }: { 
  issue: Issue; 
  stories: any[]; 
  reviewItems: any[];
  checklist: any[];
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Issue Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Weekly Angle</p>
              <p className="mt-1 font-medium">{issue.weekly_angle || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Content Pillar</p>
              <p className="mt-1 font-medium capitalize">{issue.content_pillar?.replace('_', ' ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Readiness Score</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--accent)]">{issue.readiness_score || 0}%</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">LinkedIn Status</p>
              <p className="mt-1 font-medium capitalize">{issue.linkedin_status?.replace('_', ' ') || '—'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Selected Stories ({stories.length})</h3>
          <div className="space-y-3">
            {stories.map((story, idx) => (
              <div key={story.id} className="flex items-center gap-3 rounded-lg bg-[var(--bg-soft)] p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-medium text-[var(--accent)]">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{story.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{story.source_name}</p>
                </div>
                <span className="text-sm font-medium text-[var(--accent)]">{story.overall_score?.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Review Queue</h3>
          {reviewItems.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No pending reviews</p>
          ) : (
            <div className="space-y-3">
              {reviewItems.map(item => (
                <div key={item.id} className="flex items-start gap-2 rounded-lg bg-[var(--bg-soft)] p-3">
                  <AlertCircle size={14} className={item.priority === 'critical' ? 'text-red-400 mt-0.5' : 'text-yellow-400 mt-0.5'} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Checklist</h3>
          <div className="space-y-2">
            {checklist.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                {item.is_complete ? (
                  <CheckCircle2 size={16} className="text-green-400" />
                ) : (
                  <Clock size={16} className="text-[var(--text-muted)]" />
                )}
                <span className={`text-sm ${item.is_complete ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                  {item.item_label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DraftTab({ issue, stories }: { issue: Issue; stories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium">Newsletter Draft</h3>
          <button className="flex items-center gap-2 rounded-lg bg-[var(--bg-soft)] px-3 py-1.5 text-sm hover:bg-[var(--line)]">
            <Sparkles size={14} />
            Regenerate with AI
          </button>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-2xl font-semibold">{issue.title}</h1>
          {issue.subtitle && <p className="text-lg text-[var(--text-secondary)] mb-6">{issue.subtitle}</p>}
          
          <p className="text-[var(--text-secondary)] mb-8">
            This week: {issue.weekly_angle || 'Major developments in the AEC, BIM, and AI space.'}
          </p>

          {stories.slice(0, 3).map((story, idx) => (
            <div key={story.id} className="mb-8">
              <h2 className="text-lg font-semibold mb-2">{idx + 1}. {story.title}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-2">Source: {story.source_name}</p>
              <p className="text-[var(--text-secondary)] mb-2">{story.summary}</p>
              <p className="text-[var(--text-primary)]"><span className="font-medium">Why it matters:</span> {story.why_it_matters}</p>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <h2 className="text-lg font-semibold mb-2">Standards Spotlight</h2>
            <p className="text-[var(--text-secondary)]">ISO 19650 and the "Golden Thread" — keeping information connected from design through construction to operations.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <h2 className="text-lg font-semibold mb-2">AI-in-AEC Spotlight</h2>
            <p className="text-[var(--text-secondary)]">Spacemaker / Autodesk Urban Design AI — generative AI for site layout optimization and massing studies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourcesTab({ stories }: { stories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <h3 className="mb-4 text-lg font-medium">Sources Used</h3>
        <div className="space-y-3">
          {stories.map(story => (
            <div key={story.id} className="flex items-center gap-4 rounded-lg bg-[var(--bg-soft)] p-4">
              <LinkIcon size={16} className="text-[var(--text-muted)]" />
              <div className="flex-1">
                <p className="font-medium">{story.source_name}</p>
                <a href={story.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline">
                  {story.source_url}
                </a>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{story.published_date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PromotionTab({ post }: { post: any }) {
  if (!post) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <p className="text-[var(--text-muted)]">No LinkedIn post generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">LinkedIn Post</h3>
          <button className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--bg)]">
            <Edit size={14} />
            Edit
          </button>
        </div>
        
        <div className="rounded-lg bg-[var(--bg-soft)] p-4 whitespace-pre-wrap text-sm">{post.main_post}</div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">Hook Variants</p>
            <div className="space-y-2">
              {[post.hook_variant_1, post.hook_variant_2, post.hook_variant_3].map((hook, i) => (
                <div key={i} className="rounded bg-[var(--bg-soft)] p-2 text-xs">{hook}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">CTA Variants</p>
            <div className="space-y-2">
              {[post.cta_variant_1, post.cta_variant_2].map((cta, i) => (
                <div key={i} className="rounded bg-[var(--bg-soft)] p-2 text-xs">{cta}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">Hashtags</p>
            <div className="rounded bg-[var(--bg-soft)] p-2 text-xs text-[var(--text-secondary)]">{post.hashtags}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
