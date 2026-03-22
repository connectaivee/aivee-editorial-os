'use client';

import { Copy, Edit, Send, CheckCircle2, Clock } from 'lucide-react';
import { editorialData } from '@/lib/mock-data';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-500/10 text-gray-400',
  drafted: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-blue-500/10 text-blue-400',
  scheduled: 'bg-purple-500/10 text-purple-400',
  published: 'bg-green-500/10 text-green-400',
};

export function LinkedInPostsPage() {
  const posts = editorialData.linkedinPosts;
  const issues = editorialData.issues;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">LinkedIn Posts</h1>
        <p className="text-[var(--text-secondary)]">Manage weekly promotional content</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => {
          const issue = issues.find(i => i.id === post.issue_id);
          return (
            <div key={post.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Issue #{issue?.issue_number || '—'} - {issue?.title}</h3>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[post.status]}`}>
                    {post.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-lg bg-[var(--bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--line)]">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]">
                    <Send size={14} />
                    Publish
                  </button>
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
                <div className="rounded-lg bg-[var(--bg-soft)] p-4 text-sm whitespace-pre-wrap">{post.main_post}</div>
              </div>

              {/* Hook Variants */}
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hook Variant 1</h4>
                  <div className="rounded-lg bg-[var(--bg-soft)] p-3 text-sm">{post.hook_variant_1}</div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hook Variant 2</h4>
                  <div className="rounded-lg bg-[var(--bg-soft)] p-3 text-sm">{post.hook_variant_2}</div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hook Variant 3</h4>
                  <div className="rounded-lg bg-[var(--bg-soft)] p-3 text-sm">{post.hook_variant_3}</div>
                </div>
              </div>

              {/* CTA & Hashtags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">CTA Variants</h4>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-[var(--bg-soft)] p-2 text-sm">{post.cta_variant_1}</div>
                    <div className="rounded-lg bg-[var(--bg-soft)] p-2 text-sm">{post.cta_variant_2}</div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--text-muted)]">Hashtags</h4>
                  <div className="rounded-lg bg-[var(--bg-soft)] p-3 text-sm text-[var(--text-secondary)]">{post.hashtags}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
