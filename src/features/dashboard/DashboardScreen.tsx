'use client';

import { useEffect, useState } from 'react';
import { loadDashboard } from '@/bll/dashboard/dashboardService';
import { useAuth } from '@/features/auth/AuthProvider';
import { PageHeader } from '@/features/shell/PageHeader';
import { ApiError } from '@/shared/problem';
import type { Dashboard } from '@/shared/schemas/dashboard';
import { PrimaryButton } from '@/ui/primitives';
import { DashboardView } from './DashboardView';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; dashboard: Dashboard };

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="animate-pulse">
      <div className="mb-5 h-[42px] w-2/3 rounded-[10px] bg-surface-soft" />
      <div className="dash-grid mb-[18px]">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="span-k4 h-[132px] rounded-[14px] border border-line-default bg-surface-card"
          />
        ))}
      </div>
      <div className="dash-grid">
        <div className="span-c6 h-[360px] rounded-[14px] border border-line-default bg-surface-card" />
        <div className="span-c3 h-[360px] rounded-[14px] border border-line-default bg-surface-card" />
        <div className="span-c3 h-[360px] rounded-[14px] border border-line-default bg-surface-card" />
      </div>
    </div>
  );
}

/** Loads the signed-in user's dashboard and handles loading, error and ready states. */
export function DashboardScreen() {
  const { state } = useAuth();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const token = state.status === 'authenticated' ? state.session.token : undefined;

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    loadDashboard(token)
      .then((dashboard) => {
        if (!cancelled) setLoad({ status: 'ready', dashboard });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoad({
          status: 'error',
          message:
            error instanceof ApiError ? error.problem.title : 'The dashboard could not be loaded.',
        });
      });
    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  const retry = () => {
    setLoad({ status: 'loading' });
    setAttempt((count) => count + 1);
  };

  if (load.status === 'loading') {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Loading your dashboard..." />
        <Skeleton />
      </>
    );
  }

  if (load.status === 'error') {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Something went wrong." />
        <div role="alert" className="rounded-[14px] border border-line-default bg-surface-card p-6">
          <p className="mb-4 font-semibold">{load.message}</p>
          <PrimaryButton onClick={retry}>Try again</PrimaryButton>
        </div>
      </>
    );
  }

  const { dashboard } = load;
  return (
    <>
      <PageHeader
        title={dashboard.pageTitle}
        subtitle={dashboard.subtitle}
        refreshedLabel={dashboard.meta?.refreshedLabel}
      />
      <DashboardView dashboard={dashboard} />
    </>
  );
}
