'use client';

import { useRouter } from 'next/navigation';
import { deltaNote, type KpiSpan } from '@/bll/dashboard/dashboardService';
import type { Kpi } from '@/shared/schemas/dashboard';
import { DayBars, SegmentedBar, Sparkline } from './charts';
import { Icon } from './Icon';
import { accentIconClasses, deltaClasses } from './tones';
import { useToast } from './Toast';

const ARROW = { up: 'up', down: 'down', flat: 'flat' } as const;

/**
 * KPI card (DESIGN.md 6.2): icon circle, label, value, delta with arrow, and a visual that fits the metric.
 * The whole card drills down to the owning module. The tooltip holds the metric definition.
 */
export function KpiCard({ kpi, span }: { kpi: Kpi; span: KpiSpan }) {
  const router = useRouter();
  const toast = useToast();
  const accent = accentIconClasses[kpi.tone];
  const note = deltaNote(kpi);
  const arrow = kpi.direction === 'none' ? null : ARROW[kpi.direction];

  const open = () => {
    toast.show(`Opens ${kpi.label} with the same filters`);
    router.push(kpi.href);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      title={kpi.definition}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      className={`kpi span-${span} relative flex min-h-[132px] min-w-0 cursor-pointer items-start gap-3.5 rounded-[14px] border border-line-default bg-surface-card p-5 shadow-card transition-shadow hover:shadow-card-hover`}
    >
      <div
        className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full min-[1701px]:h-12 min-[1701px]:w-12 ${accent.circle}`}
      >
        <Icon name={kpi.icon} size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-fg-secondary">{kpi.label}</div>
        <div className="tabular my-1.5 text-[clamp(22px,1.75vw,31px)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {kpi.value}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[12.5px] text-fg-muted">
          {arrow ? (
            <Icon
              name={arrow}
              size={14}
              strokeWidth={2.4}
              className={deltaClasses[kpi.deltaTone]}
            />
          ) : null}
          <span className={`tabular font-semibold ${deltaClasses[kpi.deltaTone]}`}>
            {kpi.delta}
          </span>
          {note ? <span>{note}</span> : null}
        </div>
      </div>
      <Icon name="chev" size={16} className="absolute right-3.5 top-4 text-fg-muted" />
      <div className="kpi-vis">
        {kpi.visual.kind === 'spark' ? (
          <Sparkline points={kpi.visual.points} tone={kpi.tone} />
        ) : null}
        {kpi.visual.kind === 'segments' ? (
          <SegmentedBar segments={kpi.visual.segments} className="mt-3" />
        ) : null}
        {kpi.visual.kind === 'days' ? (
          <DayBars
            values={kpi.visual.values}
            labels={kpi.visual.labels}
            todayIndex={kpi.visual.todayIndex}
          />
        ) : null}
      </div>
    </div>
  );
}
