'use client';

import Link from 'next/link';
import { ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/db';

const statusColors: Record<string, string> = {
  collecting_signals: 'bg-blue-500/10 text-blue-400',
  shortlisting: 'bg-purple-500/10 text-purple-400',
  drafting: 'bg-yellow-500/10 text-yellow-400',
  in_review: 'bg-orange-500/10 text-orange-400',
  approved: 'bg-green-500/10 text-green-400',
  published: 'bg-emerald-500/10 text-emerald-400',
  archived: 'bg-gray-500/10 text-gray-400',
};

export function IssuesArchivePage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIssues() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('issues').select('*').order('issue_number', { ascending: false });
        if (data) setIssues(data);
      }
      setLoading(false);
    }
    loadIssues();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Issues Archive</h1>
          <p className="text-[var(--text-secondary)]">{issues.length} issues total</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]">
          <Plus size={16} />
          New Issue
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-12 text-center">
          <p className="text-[var(--text-muted)]">No issues yet. Create your first issue!</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--bg-soft)]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Theme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Readiness</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">LinkedIn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-b border-[var(--line)] hover:bg-[var(--bg-soft)]">
                  <td className="px-6 py-4 text-sm font-medium">#{issue.issue_number.toString().padStart(3, '0')}</td>
                  <td className="px-6 py-4 text-sm">{issue.title}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{issue.weekly_angle || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[issue.status] || 'bg-gray-500/10 text-gray-400'}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                        <div 
                          className="h-full rounded-full bg-[var(--accent)]" 
                          style={{ width: `${issue.readiness_score || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{issue.readiness_score || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      issue.linkedin_status === 'published' ? 'bg-green-500/10 text-green-400' :
                      issue.linkedin_status === 'approved' ? 'bg-blue-500/10 text-blue-400' :
                      issue.linkedin_status === 'drafted' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {issue.linkedin_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/issues/${issue.id}`} className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline">
                      Open <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
