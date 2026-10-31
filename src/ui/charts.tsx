import { useId } from 'react';
import type { AccentTone } from '@/shared/schemas/dashboard';
import type { TrendView } from '@/bll/dashboard/dashboardService';
import { formatAxisValue } from '@/bll/dashboard/dashboardService';
import { accentIconClasses, solidFillClasses } from './tones';
import type { Tone } from '@/shared/schemas/dashboard';

/**
 * Hand-built SVG charts. Every color is a theme token (CSS variable or token class).
 * No chart library: fewer dependencies and full control over the theme.
 */

/** Small trend line with a soft fill, used inside KPI cards. */
export function Sparkline({ points, tone }: { points: readonly number[]; tone: AccentTone }) {
  const gradientId = useId();
  const w = 120;
  const h = 50;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map(
    (p, i) => [(i * w) / (points.length - 1), h - 5 - ((p - min) / range) * (h - 14)] as const,
  );
  const line = coords
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join('');
  const color = accentIconClasses[tone].gradientVar;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: color }} stopOpacity=".28" />
          <stop offset="1" style={{ stopColor: color }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line}L${w} ${h}L0 ${h}Z`} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        className={accentIconClasses[tone].stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Horizontal status bar split by weight. */
export function SegmentedBar({
  segments,
  height = 8,
  className = '',
}: {
  segments: readonly { weight: number; tone: Tone; title?: string }[];
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 overflow-hidden rounded-[5px] ${className}`}
      style={{ height }}
      role="presentation"
    >
      {segments.map((segment, i) => (
        <i
          key={i}
          className={`block ${solidFillClasses[segment.tone]}`}
          style={{ flex: segment.weight }}
          title={segment.title}
        />
      ))}
    </div>
  );
}

/** Seven bars for the next seven days. The first bar (today) uses the highlight token. */
export function DayBars({
  values,
  labels,
  todayIndex,
}: {
  values: readonly number[];
  labels: readonly string[];
  todayIndex: number;
}) {
  return (
    <div className="flex h-full items-end gap-1" aria-hidden="true">
      {values.map((value, i) => (
        <div key={i} className="flex-1 text-center text-[10px] text-fg-muted">
          <b
            className={`mb-0.5 block rounded-t-[3px] ${i === todayIndex ? 'bg-chart-day-bar-today' : 'bg-chart-day-bar'}`}
            style={{ height: Math.max(3, value * 10) }}
          />
          {labels[i]}
        </div>
      ))}
    </div>
  );
}

/** Cumulative line and area chart: current period (solid gold) against prior period (dashed). */
export function LineAreaChart({ view }: { view: TrendView }) {
  const gradientId = useId();
  const W = 640;
  const H = 250;
  const L = 52;
  const R = 14;
  const T = 12;
  const B = 28;
  const count = view.current.length;
  const x = (i: number) => L + ((W - L - R) * i) / (count - 1 || 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / view.axisMax);
  const path = (series: readonly number[]) =>
    series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const everyLabel = count > 8 ? 5 : 1;
  const showMarkers = count <= 8;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={view.summary}
      className="block h-auto w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--c-chart-current)' }} stopOpacity=".28" />
          <stop offset="1" style={{ stopColor: 'var(--c-chart-current)' }} stopOpacity=".02" />
        </linearGradient>
      </defs>
      {view.ticks.map((tick) => (
        <g key={tick}>
          <line x1={L} x2={W - R} y1={y(tick)} y2={y(tick)} className="stroke-chart-grid" />
          <text x={L - 10} y={y(tick) + 4} textAnchor="end" className="fill-chart-axis text-[11px]">
            {formatAxisValue(tick, view.format)}
          </text>
        </g>
      ))}
      <path
        d={`${path(view.current)}L${x(count - 1)} ${y(0)}L${x(0)} ${y(0)}Z`}
        fill={`url(#${gradientId})`}
      />
      <path
        d={path(view.prior)}
        fill="none"
        className="stroke-chart-prior"
        strokeWidth={1.8}
        strokeDasharray="5 5"
      />
      <path
        d={path(view.current)}
        fill="none"
        className="stroke-chart-current"
        strokeWidth={2.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showMarkers
        ? view.current.map((v, i) => (
            <circle
              key={`c${i}`}
              cx={x(i)}
              cy={y(v)}
              r={4.5}
              className="fill-chart-marker-fill stroke-chart-current"
              strokeWidth={2.2}
            />
          ))
        : null}
      {showMarkers
        ? view.prior.map((v, i) => (
            <circle
              key={`p${i}`}
              cx={x(i)}
              cy={y(v)}
              r={3.5}
              className="fill-chart-marker-fill stroke-chart-prior-marker"
              strokeWidth={1.8}
            />
          ))
        : null}
      {view.labels.map((label, i) =>
        i % everyLabel === 0 || i === count - 1 ? (
          <text
            key={label}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            className="fill-chart-axis text-[11px]"
          >
            {label}
          </text>
        ) : null,
      )}
    </svg>
  );
}

/** Two bars per group (for example collected and due by week). */
export function GroupedBarsChart({
  groups,
  series,
  unit,
}: {
  groups: readonly { label: string; values: readonly number[] }[];
  series: readonly { label: string; tone: 'received' | 'due' }[];
  unit: string;
}) {
  const W = 560;
  const H = 220;
  const L = 44;
  const B = 28;
  const T = 8;
  const max = 300;
  const fills = { received: 'fill-chart-received', due: 'fill-chart-due' } as const;
  const summary = `${series.map((s) => s.label).join(' and ')} by week, ${unit}: ${groups
    .map((g) => `${g.label} ${g.values.join(' and ')}`)
    .join('; ')}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="block h-auto w-full">
      {[0, 100, 200, 300].map((tick) => {
        const yy = T + (H - T - B) * (1 - tick / max);
        return (
          <g key={tick}>
            <line x1={L} x2={W} y1={yy} y2={yy} className="stroke-chart-grid" />
            <text
              x={L - 8}
              y={yy + 4}
              textAnchor="end"
              className="fill-chart-axis text-[11px]"
            >{`$${tick}K`}</text>
          </g>
        );
      })}
      {groups.map((group, gi) => {
        const gx = L + 16 + gi * ((W - L - 16) / groups.length);
        return (
          <g key={group.label}>
            {group.values.map((value, vi) => {
              const h = ((H - T - B) * value) / max;
              const tone = series[vi]?.tone ?? 'received';
              return (
                <rect
                  key={vi}
                  x={gx + vi * 26}
                  y={H - B - h}
                  width={22}
                  height={h}
                  rx={4}
                  className={fills[tone]}
                />
              );
            })}
            <text x={gx + 24} y={H - 8} textAnchor="middle" className="fill-chart-axis text-[11px]">
              {group.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
