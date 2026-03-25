'use client';

import { Copy, Edit, Send, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/db';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-500/10 text-gray-400',
  drafted: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-blue-500/10 text-blue-400',
  scheduled: 'bg-purple-500/10 text-purple-400',
  published: 'bg-green-500/10 text-green-400',
};

export function LinkedInPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        const [postsRes, issuesRes] = await Promise.all([
          supabase.from('linkedin_posts').select('*'),
          supabase.from('issues').select('*').order('issue_number', { ascending: false })
        ]);
        if (postsRes.data) setPosts(postsRes.data);
        if (issuesRes.data) setIssues(issuesRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePublish = async (postId: string, issueId: string) => {
    if (!supabase) return;
    await supabase.from('linkedin_posts').update({ status: 'published' }).eq('id', postId);
    await supabase.from('issues').update({ linkedin_status: 'published' }).eq('id', issueId);
    setPosts(posts.map(p => p.id === postId ? { ...p, status: 'published' } : p));
    alert('LinkedIn post published!');
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  // If no posts in DB, show issue-linked posts
  const displayItems = posts.length > 0 ? posts : issues.map(issue => ({
    id: issue.id,
    issue_id: issue.id,
    issue_number: issue.issue_number,
    issue_title: issue.title,
    status: issue.linkedin_status || 'not_started',
    main_post: 'Draft post content here...',
    hashtags: '#BIM #AEC #ConstructionTech'
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">LinkedIn Posts</h1>
        <p className="text-[var(--text-secondary)]">Manage weekly promotional content</p>
      </div>

      {displayItems.length === 0 ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-12 text-center">
          <p className="text-[var(--text-muted)]">No LinkedIn posts yet. Create an issue first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    #{item.issue_number} - {item.title || item.issue_title}
                  </h3>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[item.status] || statusColors.not_started}`}>
                    {(item.status || 'not_started').replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {(item.status || 'not_started') === 'drafted' && (
                    <button 
                      onClick={() => handlePublish(item.id, item.issue_id)}
                      className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]"
                    >
                      <Send size={14} />
                      Publish
                    </button>
                  )}
                  {(item.status || 'not_started') === 'published' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                      <CheckCircle2 size={14} />
                      Published
                    </span>
                  )}
                </div>
              </div>

              {/* Main Post */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[var(--text-muted)]">Main Post</h4>
                  <button className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline">
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <div className="rounded-lg bg-[var(--bg-soft)] p-4 text-sm whitespace-pre-wrap">
{item.main_post || `🚨 The BIM platform consolidation is happening faster than expected.

Autodesk just folded Construction Cloud into Forma. Tekla added AI without rewriting everything.

What does this mean for you?

1. If you're on Autodesk → you're now on Forma. Start learning it.
2. If you're on Tekla → AI is coming incrementally.
3. If you do international work → emerging markets are skipping legacy workflows.

🔗 Subscribe to Aivee Weekly for practical BIM and AI insights.`}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hashtags</h4>
                <div className="rounded-lg bg-[var(--bg-soft)] p-3 text-sm text-[var(--text-secondary)]">
                  {item.hashtags || '#BIM #AEC #ConstructionTech #DigitalTransformation'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
