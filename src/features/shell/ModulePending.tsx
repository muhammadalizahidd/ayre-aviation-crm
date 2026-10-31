'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { canOpen, MODULE_ROUTES } from '@/bll/navigation/navigation';
import { useAuth } from '@/features/auth/AuthProvider';
import { Card } from '@/ui/primitives';
import { PageHeader } from './PageHeader';

/**
 * Honest placeholder for a module whose screens are not built yet.
 * It is an explicit "unavailable" state (PRD 15.1), not a feature. Unknown routes and routes
 * the role may not open get a clear message instead of a blank page.
 */
export function ModulePending() {
  const pathname = usePathname();
  const { state } = useAuth();
  if (state.status !== 'authenticated') return null;

  const role = state.session.user.role;
  const moduleRoute = MODULE_ROUTES.find((route) => pathname.startsWith(route.href));

  if (!moduleRoute) {
    return (
      <>
        <PageHeader title="Page not found" subtitle="That page does not exist." />
        <Card>
          <Link href="/dashboard" className="font-medium text-fg-link underline">
            Go to your dashboard
          </Link>
        </Card>
      </>
    );
  }

  if (!canOpen(role, pathname)) {
    return (
      <>
        <PageHeader title="Not available" subtitle="This area is not part of your role." />
        <Card>
          <Link href="/dashboard" className="font-medium text-fg-link underline">
            Go to your dashboard
          </Link>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={moduleRoute.label}
        subtitle="This module is built in a later phase of the prototype."
      />
      <Card>
        <p className="max-w-[60ch] text-fg-secondary">
          The {moduleRoute.label} screens are not part of this release. The login and the four role
          dashboards are. Module {moduleRoute.modules.join(' and ')} of the PRD will follow the page
          templates in the design system.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block font-medium text-fg-link underline">
          Back to your dashboard
        </Link>
      </Card>
    </>
  );
}
