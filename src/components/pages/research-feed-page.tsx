'use client';

import { Search, Filter, CheckCircle2, Clock, X, Bookmark, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/db';

const dispositionColors: Record<string, string> = {
  use_this_week: 'bg-green-500/10 text-green-400 border-green-500/30',
  save_for_later: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  ignore: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export function ResearchFeedPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('stories').select('*').order('detected_date', { ascending: false });
        if (data) setStories(data);
      }
      setLoading(false);
    }
    loadStories();
  }, []);

  const handleDisposition = async (storyId: string, disposition: string) => {
    if (!supabase) return;
    await supabase.from('stories').update({ disposition }).eq('id', storyId);
    setStories(stories.map(s => s.id === storyId ? { ...s, disposition } : s));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Research Feed</h1>
        <p className="text-[var(--text-secondary)]">{stories.length} signals detected this week</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search signals..." 
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-panel)] py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--bg-panel)] px-4 py-2 text-sm">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Story Cards */}
      <div className="space-y-4">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onDisposition={handleDisposition} />
        ))}
      </div>
    </div>
  );
}

function StoryCard({ story, onDisposition }: { story: any; onDisposition: (id: string, d: string) => void }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--accent)]">{story.source_name}</span>
            <span className="text-xs text-[var(--text-muted)]">•</span>
            <span className="text-xs text-[var(--text-muted)]">{story.published_date}</span>
            <span className="rounded-full bg-[var(--bg-soft)] px-2 py-0.5 text-xs">{story.category}</span>
          </div>
          <h3 className="mb-2 text-lg font-medium">{story.title}</h3>
          <p className="mb-3 text-sm text-[var(--text-secondary)]">{story.summary}</p>
          <div className="mb-3">
            <p className="text-sm"><span className="font-medium">Why it matters:</span> {story.why_it_matters}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {story.tags?.map((tag: string) => (
              <span key={tag} className="rounded-full bg-[var(--bg-soft)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="ml-6 flex flex-col items-end gap-4">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <ScoreBadge label="Credibility" score={story.credibility_score} />
            <ScoreBadge label="Relevance" score={story.relevance_score} />
            <ScoreBadge label="Novelty" score={story.novelty_score} />
            <ScoreBadge label="Action" score={story.actionability_score} />
          </div>
          
          {/* Overall */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-[var(--accent)]">{Number(story.overall_score || 0).toFixed(1)}</div>
            <div className="text-xs text-[var(--text-muted)]">Overall</div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${dispositionColors[story.disposition] || dispositionColors.save_for_later}`}>
            {story.disposition?.replace('_', ' ') || 'save for later'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onDisposition(story.id, 'use_this_week')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              story.disposition === 'use_this_week' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}
          >
            <CheckCircle2 size={14} />
            Use This Week
          </button>
          <button 
            onClick={() => onDisposition(story.id, 'save_for_later')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              story.disposition === 'save_for_later' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-[var(--line)]'
            }`}
          >
            <Bookmark size={14} />
            Save for Later
          </button>
          <button 
            onClick={() => onDisposition(story.id, 'ignore')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              story.disposition === 'ignore' 
                ? 'bg-gray-500/20 text-gray-400' 
                : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-[var(--line)]'
            }`}
          >
            <X size={14} />
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color = score >= 7 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="rounded-lg bg-[var(--bg-soft)] p-2">
      <div className={`text-lg font-semibold ${color}`}>{score}</div>
      <div className="text-[10px] text-[var(--text-muted)]">{label}</div>
    </div>
  );
}
