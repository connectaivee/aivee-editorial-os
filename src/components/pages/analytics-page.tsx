'use client';

import { TrendingUp, TrendingDown, Minus, FileText, Linkedin, Users, Eye } from 'lucide-react';

const metrics = [
  { label: 'Total Issues Published', value: '1', change: '+1', trend: 'up', icon: FileText },
  { label: 'Avg Readiness Score', value: '72%', change: '+12%', trend: 'up', icon: TrendingUp },
  { label: 'LinkedIn Posts', value: '1', change: '+1', trend: 'up', icon: Linkedin },
  { label: 'Total Subscribers', value: '0', change: '0', trend: 'neutral', icon: Users, placeholder: true },
  { label: 'Total Views', value: '0', change: '0', trend: 'neutral', icon: Eye, placeholder: true },
];

const topicDistribution = [
  { topic: 'Industry Intelligence', count: 1, percentage: 100 },
  { topic: 'BIM Authority', count: 0, percentage: 0 },
  { topic: 'Standards Authority', count: 0, percentage: 0 },
  { topic: 'AI Authority', count: 0, percentage: 0 },
];

export function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-[var(--text-secondary)]">Track newsletter performance</p>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">{metric.label}</span>
              <metric.icon size={16} className="text-[var(--text-muted)]" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold">{metric.value}</span>
              {!metric.placeholder && (
                <span className={`flex items-center text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-[var(--text-muted)]'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={12} /> : 
                   metric.trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
                  {metric.change}
                </span>
              )}
            </div>
            {metric.placeholder && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">Coming soon</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Topic Distribution */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Topic Distribution</h2>
          <div className="space-y-4">
            {topicDistribution.map((topic) => (
              <div key={topic.topic}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{topic.topic}</span>
                  <span className="font-medium">{topic.count} issue{topic.count !== 1 ? 's' : ''}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-soft)]">
                  <div 
                    className="h-full rounded-full bg-[var(--accent)]" 
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Top Performing Issues</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-[var(--bg-soft)] p-3">
              <div>
                <p className="text-sm font-medium">#001 The Platform Consolidation Wave</p>
                <p className="text-xs text-[var(--text-muted)]">Industry Intelligence</p>
              </div>
              <span className="text-sm font-medium text-[var(--accent)]">72% ready</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--text-muted)]">More analytics coming as issues are published</p>
        </div>
      </div>
    </div>
  );
}
