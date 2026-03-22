'use client';

import { Plus, Search, ExternalLink } from 'lucide-react';
import { editorialData } from '@/lib/mock-data';

const tierColors: Record<string, string> = {
  'Tier 1': 'bg-green-500/10 text-green-400',
  'Tier 2': 'bg-blue-500/10 text-blue-400',
  'Tier 3': 'bg-gray-500/10 text-gray-400',
};

const typeIcons: Record<string, string> = {
  official_vendor: '🏢',
  standards_body: '📋',
  industry_publication: '📰',
  consultancy: '💼',
  thought_leader: '👤',
  research_source: '🔬',
};

export function SourcesLibraryPage() {
  const sources = editorialData.sources;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sources Library</h1>
          <p className="text-[var(--text-secondary)]">{sources.length} trusted sources</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]">
          <Plus size={16} />
          Add Source
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input 
          type="text" 
          placeholder="Search sources..." 
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-panel)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Sources Table */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--bg-soft)]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Trust Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Times Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Avg Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} className="border-b border-[var(--line)] hover:bg-[var(--bg-soft)]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeIcons[source.source_type] || '📁'}</span>
                    <span className="font-medium">{source.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {source.source_type.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{source.category}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tierColors[source.trust_tier]}`}>
                    {source.trust_tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{source.times_used}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={source.average_quality_score && source.average_quality_score >= 8 ? 'text-green-400' : 'text-yellow-400'}>
                    {source.average_quality_score?.toFixed(1) || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {source.website_url && (
                    <a href={source.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline">
                      Visit <ExternalLink size={12} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
