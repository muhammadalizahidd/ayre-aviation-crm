import { apiClient } from '@/api-client';
import type { Dashboard, Kpi, TablePanel, TrendPanel } from '@/shared/schemas/dashboard';

/** Loads the dashboard of the signed-in user. The backend decides which dashboard that is. */
export const loadDashboard = (token: string): Promise<Dashboard> => apiClient.getDashboard(token);

// ---------- KPI layout ----------

/** Column span classes for a KPI row. Rows are always even: no orphan card (DESIGN.md 4.3). */
export type KpiSpan = 'k3' | 'k4' | 'k6';

export function kpiSpans(count: number): KpiSpan[] {
  const fill = (span: KpiSpan, n: number): KpiSpan[] => Array.from({ length: n }, () => span);
  if (count <= 0) return [];
  if (count === 1) return ['k6'];
  if (count === 2) return fill('k6', 2);
  if (count === 5) return [...fill('k3', 3), ...fill('k6', 2)];
  if (count === 7) return [...fill('k4', 4), ...fill('k3', 3)];
  if (count % 4 === 0) return fill('k4', count);
  if (count % 3 === 0) return fill('k3', count);
  return fill('k4', count);
}

export const DEFAULT_DELTA_NOTE = 'vs prior period';

/** Text that follows the delta. `note: ""` means "show nothing"; a missing note means the default. */
export const deltaNote = (kpi: Kpi): string =>
  kpi.note === undefined ? DEFAULT_DELTA_NOTE : kpi.note;

// ---------- Trend chart ----------

export type Granularity = 'daily' | 'weekly' | 'monthly';

const GRANULARITY_INDEXES: Record<Granularity, readonly number[]> = {
  daily: Array.from({ length: 30 }, (_, i) => i),
  weekly: [0, 4, 9, 14, 19, 24, 29],
  monthly: [9, 19, 29],
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Oct 8" for day index 7 of a period starting on 2026-10-01. Pure date math, no time zone surprises. */
export function dayLabel(periodStart: string, dayIndex: number): string {
  const [year, month, day] = periodStart.split('-').map(Number) as [number, number, number];
  const date = new Date(Date.UTC(year, month - 1, day + dayIndex));
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

export interface TrendView {
  labels: string[];
  current: number[];
  prior: number[];
  format: 'money' | 'count';
  /** Y axis ceiling and the four step values (plus zero). */
  axisMax: number;
  ticks: number[];
  summary: string;
}

/** Rounds up to a "nice" step so the axis has four equal intervals. */
export function niceAxis(maxValue: number): { axisMax: number; ticks: number[] } {
  const raw = (maxValue * 1.1) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw || 1));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? magnitude * 10;
  return { axisMax: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
}

export function formatMoney(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/** Short axis labels such as $500K or $1.5M. */
export function formatAxisValue(value: number, format: 'money' | 'count'): string {
  if (format === 'count') return String(Math.round(value));
  if (value === 0) return '$0';
  if (value >= 1_000_000) return `$${+(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export function buildTrendView(
  panel: TrendPanel,
  metricId: string,
  granularity: Granularity,
): TrendView {
  const metric = panel.metrics.find((m) => m.id === metricId) ?? panel.metrics[0];
  if (!metric) throw new Error('Trend panel has no metrics');
  const indexes = GRANULARITY_INDEXES[granularity];
  const current = indexes.map((i) => metric.current[i] ?? 0);
  const prior = indexes.map((i) => metric.prior[i] ?? 0);
  const { axisMax, ticks } = niceAxis(Math.max(...current, ...prior));
  const total = metric.current[29] ?? 0;
  const priorTotal = metric.prior[29] ?? 0;
  const show = (n: number) => (metric.format === 'money' ? formatMoney(n) : String(n));
  return {
    labels: indexes.map((i) => dayLabel(panel.periodStart, i)),
    current,
    prior,
    format: metric.format,
    axisMax,
    ticks,
    summary: `${metric.label}, cumulative for the period: ${show(total)} against ${show(priorTotal)} in the prior period`,
  };
}

// ---------- Table ranking ----------

/** Sorts rows by the chosen sort key (highest first) without mutating the panel. */
export function sortTableRows(panel: TablePanel, sortId: string | undefined): TablePanel['rows'] {
  if (!sortId) return panel.rows;
  return [...panel.rows].sort((a, b) => (b.sort?.[sortId] ?? 0) - (a.sort?.[sortId] ?? 0));
}
