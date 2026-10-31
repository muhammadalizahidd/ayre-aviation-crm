'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationFor } from '@/bll/navigation/navigation';
import type { Role } from '@/shared/roles';
import { BrandMark, Wordmark } from '@/ui/Brand';
import { Icon } from '@/ui/Icon';

/**
 * Left navigation (DESIGN.md 5.1). Plain ink surface: no photo, no promo, no help box.
 * Only the items the role may use are rendered.
 */
export function Sidebar({
  role,
  collapsed,
  onToggle,
}: {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const items = navigationFor(role);

  return (
    <aside className="sticky top-0 flex h-screen flex-col bg-surface-sidebar px-3 pb-3.5 pt-5 text-fg-on-dark max-[900px]:hidden">
      <div
        className={`flex items-center px-1.5 pb-[22px] ${collapsed ? 'justify-center' : 'justify-between'}`}
      >
        {collapsed ? <BrandMark size={44} /> : <Wordmark variant="sidebar" />}
        {collapsed ? null : (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="text-fg-on-dark opacity-85 hover:opacity-100"
          >
            <Icon name="menu" />
          </button>
        )}
      </div>

      <nav
        aria-label="Main"
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
      >
        {items.map((item) => {
          const active =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <div key={item.id} className="contents">
              {item.dividerBefore ? (
                <hr className="mx-2 my-2.5 border-0 border-t border-line-nav-divider" />
              ) : null}
              <Link
                href={item.href}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={`flex h-[41px] min-w-0 shrink-0 items-center gap-3 rounded-[10px] border px-3 text-sm font-medium ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  active
                    ? 'border-nav-active-border bg-nav-active-bg text-nav-active-text'
                    : 'border-transparent text-nav-text hover:bg-nav-hover-bg'
                }`}
              >
                <Icon name={item.icon} className={active ? 'text-nav-active-icon' : ''} />
                {collapsed ? null : <span className="min-w-0 truncate">{item.label}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className={`flex shrink-0 items-center gap-3 px-3.5 pb-1 pt-3.5 text-sm font-medium ${collapsed ? 'justify-center px-0' : ''}`}
      >
        <Icon name="collapse" className={collapsed ? 'rotate-180' : ''} />
        {collapsed ? (
          <span className="sr-only">Expand sidebar</span>
        ) : (
          <span>Collapse sidebar</span>
        )}
      </button>
    </aside>
  );
}
