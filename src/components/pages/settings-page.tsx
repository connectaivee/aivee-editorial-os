'use client';

import { Save } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-[var(--text-secondary)]">Configure your Editorial OS</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Brand Settings */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Brand</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Brand Name</label>
              <input 
                type="text" 
                defaultValue="Aivee"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tagline</label>
              <input 
                type="text" 
                defaultValue="Practical insights at the intersection of BIM, standards, and AI"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Editorial Settings */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Editorial</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Default Issue Cadence</label>
              <select className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Minimum Stories per Issue</label>
              <input 
                type="number" 
                defaultValue={3}
                min={1}
                max={10}
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="requireStandards" defaultChecked className="rounded" />
              <label htmlFor="requireStandards" className="text-sm">Require Standards Spotlight section</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="requireAI" defaultChecked className="rounded" />
              <label htmlFor="requireAI" className="text-sm">Require AI-in-AEC Spotlight section</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="requireLinkedIn" defaultChecked className="rounded" />
              <label htmlFor="requireLinkedIn" className="text-sm">Require LinkedIn post before publish</label>
            </div>
          </div>
        </section>

        {/* Scoring Weights */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--bg-panel)] p-6">
          <h2 className="mb-4 text-lg font-medium">Scoring Weights</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Credibility</label>
              <input type="range" min={0} max={100} defaultValue={35} className="w-full" />
              <div className="mt-1 text-xs text-[var(--text-muted)]">35%</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Relevance</label>
              <input type="range" min={0} max={100} defaultValue={30} className="w-full" />
              <div className="mt-1 text-xs text-[var(--text-muted)]">30%</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Novelty</label>
              <input type="range" min={0} max={100} defaultValue={15} className="w-full" />
              <div className="mt-1 text-xs text-[var(--text-muted)]">15%</div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Actionability</label>
              <input type="range" min={0} max={100} defaultValue={20} className="w-full" />
              <div className="mt-1 text-xs text-[var(--text-muted)]">20%</div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] hover:bg-[var(--accent-strong)]">
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
