'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Search, CheckCircle2, Clock, AlertCircle, 
  ChevronRight, Star, Link as LinkIcon, Sparkles, Eye, Edit, Loader2, Plus, Save, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/db';

type TabType = 'overview' | 'draft' | 'sources' | 'promotion';

export function IssueWorkspacePage({ issueId }: { issueId: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [issue, setIssue] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [linkedinPost, setLinkedinPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Edit states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        const [issueRes, storiesRes, sourcesRes, postRes] = await Promise.all([
          supabase.from('issues').select('*').eq('id', issueId).single(),
          supabase.from('stories').select('*').eq('issue_id', issueId),
          supabase.from('sources').select('*'),
          supabase.from('linkedin_posts').select('*').eq('issue_id', issueId).maybeSingle()
        ]);
        if (issueRes.data) {
          setIssue(issueRes.data);
          setEditData(issueRes.data);
        }
        if (storiesRes.data) setStories(storiesRes.data);
        if (sourcesRes.data) setSources(sourcesRes.data);
        if (postRes.data) setLinkedinPost(postRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, [issueId]);

  const handleSave = async () => {
    if (!supabase || !issue) return;
    setSaving(true);
    await supabase.from('issues').update(editData).eq('id', issue.id);
    setIssue({ ...issue, ...editData });
    setEditingTitle(false);
    setSaving(false);
    alert('Changes saved!');
  };

  const handleApprove = async () => {
    if (!supabase || !issue) return;
    await supabase.from('issues').update({ status: 'approved', linkedin_status: 'drafted' }).eq('id', issue.id);
    setIssue({ ...issue, status: 'approved', linkedin_status: 'drafted' });
    alert('Issue approved! LinkedIn post status set to drafted.');
  };

  const handlePublish = async () => {
    if (!supabase || !issue) return;
    await supabase.from('issues').update({ status: 'published', linkedin_status: 'published' }).eq('id', issue.id);
    setIssue({ ...issue, status: 'published', linkedin_status: 'published' });
    alert('Issue published!');
  };

  const handleReject = async () => {
    if (!supabase || !issue) return;
    await supabase.from('issues').update({ status: 'drafting' }).eq('id', issue.id);
    setIssue({ ...issue, status: 'drafting' });
    alert('Issue sent back to drafting.');
  };

  const handlePublishLinkedIn = async () => {
    if (!supabase || !issue) return;
    await supabase.from('issues').update({ linkedin_status: 'published' }).eq('id', issue.id);
    await supabase.from('linkedin_posts').upsert({ 
      issue_id: issue.id, 
      status: 'published',
      main_post: linkedinPost?.main_post || getDefaultPost(),
      hashtags: linkedinPost?.hashtags || '#BIM #AEC #ConstructionTech'
    });
    setIssue({ ...issue, linkedin_status: 'published' });
    alert('LinkedIn post published!');
  };

  const handleGeneratePost = async () => {
    if (!supabase || !issue) return;
    const defaultPost = getDefaultPost();
    await supabase.from('linkedin_posts').upsert({ 
      issue_id: issue.id, 
      status: 'drafted',
      main_post: defaultPost,
      hook_variant_1: 'The platform consolidation wave is here',
      hook_variant_2: 'Autodesk just made a huge move',
      hook_variant_3: 'What Kazakhstan going digital means for your BIM practice',
      cta_variant_1: 'Subscribe to Aivee Weekly',
      cta_variant_2: 'Read the full issue',
      hashtags: '#BIM #AEC #ConstructionTech #DigitalTransformation'
    });
    await supabase.from('issues').update({ linkedin_status: 'drafted' }).eq('id', issue.id);
    setLinkedinPost({ main_post: defaultPost, status: 'drafted' });
    setIssue({ ...issue, linkedin_status: 'drafted' });
    alert('LinkedIn post generated!');
  };

  function getDefaultPost() {
    return `🚨 The BIM platform consolidation is happening faster than expected.

Autodesk just folded Construction Cloud into Forma. Tekla added AI without rewriting everything. Kazakhstan went digital in one move.

What does this mean for you?

1. If you're on Autodesk → you're now on Forma. Start learning it.
2. If you're on Tekla → AI is coming incrementally, not as a revolution.
3. If you do international work → emerging markets are skipping legacy workflows.

The next 12 months will sort out who's adapted and who hasn't.

🔗 Subscribe to Aivee Weekly for practical BIM and AI insights delivered every Sunday.`;
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-[var(--text-muted)]">Issue not found</p>
      </div>
    );
  }

  const shortlistedStories = stories.filter(s => s.disposition === 'use_this_week');

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
            {/* Status-based buttons */}
            {issue.status === 'drafting' && (
              <button 
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]"
              >
                <CheckCircle2 size={16} />
                Submit for Review
              </button>
            )}
            {issue.status === 'in_review' && (
              <>
                <button 
                  onClick={handleReject}
                  className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm hover:bg-[var(--line)]"
                >
                  <X size={16} />
                  Reject
                </button>
                <button 
                  onClick={handleApprove}
                  className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]"
                >
                  <CheckCircle2 size={16} />
                  Mark Approved
                </button>
              </>
            )}
            {issue.status === 'approved' && (
              <button 
                onClick={handlePublish}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                <FileText size={16} />
                Publish Issue
              </button>
            )}
            {issue.status === 'published' && (
              <span className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                <CheckCircle2 size={16} />
                Published
              </span>
            )}
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
          <OverviewTab 
            issue={issue} 
            stories={shortlistedStories} 
            onEdit={() => setEditingTitle(true)}
            editData={editData}
            setEditData={setEditData}
            editing={editingTitle}
            onSave={handleSave}
            onCancel={() => setEditingTitle(false)}
            saving={saving}
          />
        )}
        {activeTab === 'draft' && (
          <DraftTab issue={issue} stories={shortlistedStories} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab stories={stories} sources={sources} />
        )}
        {activeTab === 'promotion' && (
          <PromotionTab 
            issue={issue} 
            post={linkedinPost}
            onGenerate={handleGeneratePost}
            onPublish={handlePublishLinkedIn}
          />
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

function OverviewTab({ issue, stories, onEdit, editData, setEditData, editing, onSave, onCancel, saving }: any) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Issue Details</h3>
            {!editing && (
              <button onClick={onEdit} className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline">
                <Edit size={14} /> Edit
              </button>
            )}
          </div>
          
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Title</label>
                <input 
                  type="text" 
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={editData.subtitle || ''}
                  onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Weekly Angle</label>
                <input 
                  type="text" 
                  value={editData.weekly_angle || ''}
                  onChange={(e) => setEditData({ ...editData, weekly_angle: e.target.value })}
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onSave} 
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={onCancel}
                  className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">Title</p>
                <p className="mt-1 font-medium">{issue.title}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Subtitle</p>
                <p className="mt-1 font-medium">{issue.subtitle || '—'}</p>
              </div>
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
          )}
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Selected Stories ({stories.length})</h3>
          {stories.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No stories selected yet. Go to Research Feed to select stories.</p>
          ) : (
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
                  <span className="text-sm font-medium text-[var(--accent)]">{Number(story.overall_score || 0).toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h3 className="mb-4 text-lg font-medium">Status Timeline</h3>
          <div className="space-y-2">
            <TimelineStep label="Collecting Signals" completed />
            <TimelineStep label="Shortlisting" completed />
            <TimelineStep label="Drafting" completed={issue.status !== 'collecting_signals' && issue.status !== 'shortlisting'} />
            <TimelineStep label="In Review" active={issue.status === 'in_review'} completed={issue.status === 'approved' || issue.status === 'published'} />
            <TimelineStep label="Approved" completed={issue.status === 'approved' || issue.status === 'published'} />
            <TimelineStep label="Published" completed={issue.status === 'published'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ label, completed, active }: { label: string; completed?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${completed ? 'bg-green-400' : active ? 'bg-[var(--accent)]' : 'bg-[var(--line)]'}`} />
      <span className={`text-sm ${completed || active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
    </div>
  );
}

function DraftTab({ issue, stories }: { issue: any; stories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Newsletter Draft</h3>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-2xl font-semibold">{issue.title}</h1>
          {issue.subtitle && <p className="text-lg text-[var(--text-secondary)] mb-6">{issue.subtitle}</p>}
          
          <p className="text-[var(--text-secondary)] mb-8">
            This week: {issue.weekly_angle || 'Major developments in the AEC, BIM, and AI space.'}
          </p>

          {stories.length > 0 ? (
            stories.slice(0, 3).map((story, idx) => (
              <div key={story.id} className="mb-8">
                <h2 className="text-lg font-semibold mb-2">{idx + 1}. {story.title}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-2">Source: {story.source_name}</p>
                <p className="text-[var(--text-secondary)] mb-2">{story.summary}</p>
                <p className="text-[var(--text-primary)]"><span className="font-medium">Why it matters:</span> {story.why_it_matters}</p>
              </div>
            ))
          ) : (
            <p className="text-[var(--text-muted)]">No stories selected. Go to Research Feed to select stories for this issue.</p>
          )}

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

function SourcesTab({ stories, sources }: { stories: any[]; sources: any[] }) {
  const storySources = stories.map(s => s.source_name).filter(Boolean);
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <h3 className="mb-4 text-lg font-medium">Sources Used ({storySources.length})</h3>
        {storySources.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No sources yet.</p>
        ) : (
          <div className="space-y-3">
            {[...new Set(storySources)].map((name, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-lg bg-[var(--bg-soft)] p-4">
                <LinkIcon size={16} className="text-[var(--text-muted)]" />
                <div className="flex-1">
                  <p className="font-medium">{name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <h3 className="mb-4 text-lg font-medium">All Trusted Sources</h3>
        <div className="space-y-2">
          {sources.slice(0, 10).map((source: any) => (
            <div key={source.id} className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs ${source.trust_tier === 'Tier 1' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {source.trust_tier}
                </span>
                <span className="text-sm">{source.name}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{source.times_used} uses</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PromotionTab({ issue, post, onGenerate, onPublish }: { issue: any; post: any; onGenerate: () => void; onPublish: () => void }) {
  const linkedinStatus = issue.linkedin_status || 'not_started';
  const mainPost = post?.main_post || `🚨 The BIM platform consolidation is happening faster than expected.

Autodesk just folded Construction Cloud into Forma. Tekla added AI without rewriting everything.

What does this mean for you?

1. If you're on Autodesk → you're now on Forma.
2. If you're on Tekla → AI is coming incrementally.
3. If you do international work → emerging markets are skipping legacy workflows.

The next 12 months will sort out who's adapted and who hasn't.

🔗 Subscribe to Aivee Weekly for practical BIM and AI insights.`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">LinkedIn Post</h3>
          <div className="flex items-center gap-2">
            {linkedinStatus === 'not_started' && (
              <button 
                onClick={onGenerate}
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]"
              >
                <Sparkles size={16} />
                Generate Post
              </button>
            )}
            {linkedinStatus === 'drafted' && (
              <button 
                onClick={onPublish}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                <ChevronRight size={16} />
                Publish
              </button>
            )}
            {linkedinStatus === 'published' && (
              <span className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                <CheckCircle2 size={16} />
                Published
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-[var(--bg-soft)] p-4 text-sm whitespace-pre-wrap">
          {mainPost}
        </div>
        
        <div className="mt-4 pt-4 border-t border-[var(--line)]">
          <p className="text-xs text-[var(--text-muted)]">
            Hashtags: {post?.hashtags || '#BIM #AEC #ConstructionTech #DigitalTransformation'}
          </p>
        </div>
      </div>
    </div>
  );
}
