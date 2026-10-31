'use client';

import { kpiSpans } from '@/bll/dashboard/dashboardService';
import type { Dashboard } from '@/shared/schemas/dashboard';
import { Icon } from '@/ui/Icon';
import { PrimaryButton } from '@/ui/primitives';
import { KpiCard } from '@/ui/KpiCard';
import { useToast } from '@/ui/Toast';
import { PanelView } from './panels';

const BANNER_STAT_CLASS = {
  danger: 'text-fg-danger-on-dark',
  gold: 'text-brand-gold',
  plain: 'text-fg-on-dark',
} as const;

/** Filters row (DESIGN.md 5.4). In demo mode the selections are illustrative and do not change the data. */
function FiltersRow({ dashboard }: { dashboard: Dashboard }) {
  const toast = useToast();
  return (
    <section aria-label="Filters" className="mb-5 flex flex-wrap items-end gap-3">
      {dashboard.filters.map((filter) => (
        <div key={filter.id}>
          <label
            htmlFor={`filter-${filter.id}`}
            className="mb-1.5 block text-[12.5px] text-fg-secondary"
          >
            {filter.label}
          </label>
          <div className="relative">
            {filter.icon === 'calendar' ? (
              <Icon
                name="calendar"
                size={17}
                className="pointer-events-none absolute left-3 top-3"
              />
            ) : null}
            <select
              id={`filter-${filter.id}`}
              defaultValue={filter.options[0]}
              onChange={() => toast.show('Filters are illustrative in demo mode')}
              className={`h-[42px] min-w-[112px] appearance-none rounded-[10px] border border-line-default bg-surface-card pr-8 text-[13px] font-medium shadow-card ${
                filter.icon === 'calendar' ? 'min-w-[196px] pl-9' : 'pl-3'
              }`}
            >
              {filter.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Icon
              name="chevd"
              size={16}
              className="pointer-events-none absolute right-2.5 top-[13px]"
            />
          </div>
        </div>
      ))}
      <div className="flex-1" />
      {dashboard.exportAllowed ? (
        <PrimaryButton
          icon="download"
          onClick={() =>
            toast.show('Export is audited and respects your access. Demo: no file is created')
          }
        >
          Export
        </PrimaryButton>
      ) : null}
    </section>
  );
}

/** Renders a role dashboard from data. Contains no role-specific logic: the data decides what appears. */
export function DashboardView({ dashboard }: { dashboard: Dashboard }) {
  const spans = kpiSpans(dashboard.kpis.length);

  return (
    <>
      <FiltersRow dashboard={dashboard} />

      {dashboard.banner ? (
        <section className="mb-[18px] flex flex-wrap items-center gap-6 rounded-[14px] bg-surface-inverse px-[22px] py-[18px] text-fg-on-dark">
          <h2 className="mr-auto font-serif text-[22px] font-semibold">
            {dashboard.banner.greeting}
          </h2>
          {dashboard.banner.stats.map((stat) => (
            <div key={stat.label}>
              <b
                className={`tabular block text-[26px] font-semibold leading-none ${BANNER_STAT_CLASS[stat.tone]}`}
              >
                {stat.value}
              </b>
              <span className="text-xs text-fg-on-dark-muted">{stat.label}</span>
            </div>
          ))}
        </section>
      ) : null}

      <div className="dash-grid mb-[18px]">
        {dashboard.kpis.map((kpi, index) => (
          <KpiCard key={kpi.id} kpi={kpi} span={spans[index] ?? 'k4'} />
        ))}
      </div>

      <div className="dash-grid panel-grid">
        {dashboard.panels.map((panel, index) => (
          <PanelView key={`${panel.kind}-${index}`} panel={panel} />
        ))}
      </div>
    </>
  );
}
