import { describe, expect, it } from 'vitest';
import type { Kpi, TablePanel, TrendPanel } from '@/shared/schemas/dashboard';
import {
  buildTrendView,
  dayLabel,
  deltaNote,
  formatAxisValue,
  kpiSpans,
  niceAxis,
  sortTableRows,
} from './dashboardService';

describe('kpiSpans (rows are always even)', () => {
  const rows = (count: number) => {
    const widths = { k3: 4, k4: 3, k6: 6 } as const;
    let total = 0;
    return kpiSpans(count).reduce<number[]>((acc, span) => {
      total += widths[span];
      if (total === 12) {
        acc.push(12);
        total = 0;
      }
      return acc;
    }, []);
  };

  it.each([
    [3, ['k3', 'k3', 'k3']],
    [4, ['k4', 'k4', 'k4', 'k4']],
    [5, ['k3', 'k3', 'k3', 'k6', 'k6']],
    [6, ['k3', 'k3', 'k3', 'k3', 'k3', 'k3']],
  ])('lays out %i cards', (count, expected) => {
    expect(kpiSpans(count)).toEqual(expected);
  });

  it('fills complete rows for 8 cards (4 + 4) and 9 cards (3 + 3 + 3)', () => {
    expect(rows(8)).toEqual([12, 12]);
    expect(rows(9)).toEqual([12, 12, 12]);
    expect(rows(7)).toEqual([12, 12]);
  });

  it('returns nothing for zero cards', () => {
    expect(kpiSpans(0)).toEqual([]);
  });
});

describe('deltaNote', () => {
  const base: Kpi = {
    id: 'x',
    label: 'x',
    icon: 'users',
    tone: 'gold',
    value: '1',
    delta: '+1',
    direction: 'up',
    deltaTone: 'success',
    definition: 'd',
    href: '/x',
    visual: { kind: 'spark', points: [1, 2] },
  };
  it('defaults to "vs prior period"', () => expect(deltaNote(base)).toBe('vs prior period'));
  it('shows nothing when the note is an empty string', () =>
    expect(deltaNote({ ...base, note: '' })).toBe(''));
  it('uses a custom note', () => expect(deltaNote({ ...base, note: 'in total' })).toBe('in total'));
});

describe('trend helpers', () => {
  const panel: TrendPanel = {
    kind: 'trend',
    span: 'c6',
    title: 'T',
    periodStart: '2026-10-01',
    defaultMetric: 'a',
    defaultGranularity: 'weekly',
    metrics: [
      {
        id: 'a',
        label: 'Invoiced',
        format: 'money',
        current: Array.from({ length: 30 }, (_, i) => (i + 1) * 40000),
        prior: Array.from({ length: 30 }, (_, i) => (i + 1) * 36000),
      },
      {
        id: 'b',
        label: 'Bookings',
        format: 'count',
        current: Array.from({ length: 30 }, (_, i) => Math.round((i + 1) / 2)),
        prior: Array.from({ length: 30 }, (_, i) => Math.round((i + 1) / 3)),
      },
    ],
  };

  it('labels days without time zone drift', () => {
    expect(dayLabel('2026-10-01', 0)).toBe('Oct 1');
    expect(dayLabel('2026-10-01', 29)).toBe('Oct 30');
    expect(dayLabel('2026-10-01', 31)).toBe('Nov 1');
  });

  it('samples 7 points weekly, 30 daily and 3 monthly', () => {
    expect(buildTrendView(panel, 'a', 'weekly').current).toHaveLength(7);
    expect(buildTrendView(panel, 'a', 'daily').current).toHaveLength(30);
    expect(buildTrendView(panel, 'a', 'monthly').current).toHaveLength(3);
  });

  it('puts the axis ceiling above the largest value with four equal steps', () => {
    const view = buildTrendView(panel, 'a', 'weekly');
    expect(view.axisMax).toBeGreaterThanOrEqual(Math.max(...view.current, ...view.prior));
    expect(view.ticks).toHaveLength(5);
    const steps = view.ticks.slice(1).map((t, i) => t - (view.ticks[i] ?? 0));
    expect(new Set(steps).size).toBe(1);
  });

  it('falls back to the first metric for an unknown id and describes totals for screen readers', () => {
    const view = buildTrendView(panel, 'missing', 'weekly');
    expect(view.summary).toContain('Invoiced');
    expect(view.summary).toContain('$1,200,000');
  });

  it('formats axis values compactly', () => {
    expect(formatAxisValue(0, 'money')).toBe('$0');
    expect(formatAxisValue(500_000, 'money')).toBe('$500K');
    expect(formatAxisValue(1_500_000, 'money')).toBe('$1.5M');
    expect(formatAxisValue(19, 'count')).toBe('19');
  });

  it('computes a nice axis', () => {
    const { axisMax, ticks } = niceAxis(1_214_600);
    expect(ticks[0]).toBe(0);
    expect(axisMax).toBeGreaterThan(1_214_600);
  });
});

describe('sortTableRows', () => {
  const table: TablePanel = {
    kind: 'table',
    span: 'c4',
    title: 'T',
    columns: [],
    rankColumn: 'rank',
    rows: [
      { cells: {}, sort: { revenue: 10, bookings: 9 } },
      { cells: {}, sort: { revenue: 30, bookings: 1 } },
      { cells: {}, sort: { revenue: 20, bookings: 5 } },
    ],
  };
  it('sorts highest first by the chosen key without mutating the panel', () => {
    expect(sortTableRows(table, 'revenue').map((r) => r.sort?.revenue)).toEqual([30, 20, 10]);
    expect(sortTableRows(table, 'bookings').map((r) => r.sort?.bookings)).toEqual([9, 5, 1]);
    expect(table.rows.map((r) => r.sort?.revenue)).toEqual([10, 30, 20]);
  });
  it('keeps the original order when no sort key is given', () => {
    expect(sortTableRows(table, undefined)).toBe(table.rows);
  });
});
