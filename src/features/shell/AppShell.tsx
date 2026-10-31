'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * Frame of every signed-in page: sidebar, top bar, page area (DESIGN.md section 5).
 * Redirects to /login when there is no session. The check is a prototype convenience,
 * not security: the mock backend also refuses calls without a valid token.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { state } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (state.status === 'anonymous') router.replace('/login');
  }, [state.status, router]);

  if (state.status !== 'authenticated') {
    return <div className="min-h-screen bg-surface-canvas" aria-busy="true" />;
  }

  const { user } = state.session;
  return (
    <div
      className={`grid min-h-screen max-[900px]:grid-cols-1 ${
        collapsed ? 'grid-cols-[78px_minmax(0,1fr)]' : 'grid-cols-[226px_minmax(0,1fr)]'
      }`}
    >
      <Sidebar
        role={user.role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="min-w-0">
        <Topbar user={user} />
        <main className="px-8 pb-16 pt-7 max-[900px]:px-4 max-[900px]:pt-5">{children}</main>
      </div>
    </div>
  );
}
