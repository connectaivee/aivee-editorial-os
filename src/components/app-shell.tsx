'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Linkedin, 
  Library, 
  BarChart3, 
  Settings,
  Newspaper
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/issues', label: 'Issues', icon: FileText },
  { href: '/research-feed', label: 'Research Feed', icon: Search },
  { href: '/linkedin-posts', label: 'LinkedIn', icon: Linkedin },
  { href: '/sources', label: 'Sources', icon: Library },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[var(--line)] bg-[var(--bg-elevated)] backdrop-blur-md">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--bg)]">
              <Newspaper size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Aivee</h1>
              <p className="text-xs text-[var(--text-muted)]">Editorial OS</p>
            </div>
          </Link>
        </div>
        
        <nav className="px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-panel)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Current Issue</p>
            <p className="mt-1 text-sm font-medium">#001</p>
            <p className="text-xs text-[var(--text-secondary)]">In Review</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
