'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import type { PublicUser } from '@/shared/schemas/user';
import { Icon } from '@/ui/Icon';
import { useToast } from '@/ui/Toast';

/**
 * Top bar (DESIGN.md 5.2): search, notifications, user. Nothing else lives here:
 * no page title, no filters, no tabs.
 */
export function Topbar({ user }: { user: PublicUser }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3.5 border-b border-line-default bg-surface-card px-8 py-3 max-[900px]:px-4">
      <label className="flex h-[50px] w-full max-w-[420px] items-center gap-2.5 rounded-xl border border-line-default bg-surface-canvas px-3.5 text-fg-muted">
        <Icon name="search" size={18} />
        <input
          type="search"
          placeholder="Search customers, trips, operators..."
          aria-label="Search"
          onKeyDown={(event) => {
            if (event.key === 'Enter') toast.show('Search is not available in demo mode');
          }}
          className="min-w-0 flex-1 bg-transparent text-fg-primary outline-none placeholder:text-fg-muted"
        />
      </label>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        onClick={() => toast.show('Notifications are shown on your dashboard in demo mode')}
        className="grid h-[46px] w-[46px] place-items-center text-fg-primary"
      >
        <Icon name="bell" size={22} />
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex items-center gap-3 pl-1"
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-line-gold-outline bg-brand-ink text-[13px] font-semibold text-brand-gold-on-dark"
            aria-hidden="true"
          >
            {user.initials}
          </span>
          <span className="text-left max-[600px]:hidden">
            <b className="block text-sm font-semibold leading-tight">{user.displayName}</b>
            <small className="text-xs text-fg-muted">{user.title}</small>
          </span>
          <Icon name="chevd" size={18} />
        </button>
        {menuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl border border-line-default bg-surface-card p-1.5 shadow-floating"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium hover:bg-surface-soft"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
