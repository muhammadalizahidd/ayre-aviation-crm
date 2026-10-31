import { z } from 'zod';
import { ROLES } from '../roles';

/**
 * Dashboard contract. Data files describe WHAT to show using tone names (never colors),
 * so the visual theme stays entirely in src/theme/themes.ts.
 */

export const toneSchema = z.enum([
  'success',
  'warning',
  'danger',
  'info',
  'special',
  'neutral',
  'dark',
]);
export const accentSchema = z.enum(['gold', 'red', 'green', 'blue', 'amber', 'purple']);
export const barToneSchema = z.enum([
  'ink',
  'info',
  'warning',
  'success',
  'danger',
  'neutral',
  'gold',
]);
export const tripToneSchema = z.enum([
  'draft',
  'sourcing',
  'quoting',
  'confirmed',
  'completed',
  'cancelled',
]);
export const iconSchema = z.enum([
  'users',
  'target',
  'cal',
  'dollar',
  'check',
  'trend',
  'wallet',
  'clock',
  'plane',
  'alert',
  'doc',
  'bldg',
  'pct',
  'tasks',
  'user',
]);

export const kpiVisualSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('spark'), points: z.array(z.number()).min(2) }),
  z.object({
    kind: z.literal('segments'),
    segments: z.array(z.object({ weight: z.number().positive(), tone: toneSchema })).min(1),
  }),
  z.object({
    kind: z.literal('days'),
    values: z.array(z.number()).length(7),
    labels: z.array(z.string()).length(7),
    todayIndex: z.number().int().min(0).max(6),
  }),
]);

export const kpiSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: iconSchema,
  tone: accentSchema,
  value: z.string(),
  delta: z.string(),
  /** Arrow shown beside the delta. Independent from `deltaTone`, which says whether the change is good. */
  direction: z.enum(['up', 'down', 'flat', 'none']),
  deltaTone: z.enum(['success', 'danger', 'neutral']),
  /** Text after the delta. `undefined` is replaced by "vs prior period" in the BLL. */
  note: z.string().optional(),
  /** Tooltip text: definition of the metric. */
  definition: z.string(),
  /** Drill-down target (owning module). */
  href: z.string().startsWith('/'),
  visual: kpiVisualSchema,
});

const leadingSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('icon'), icon: iconSchema, tone: accentSchema }),
  z.object({ kind: z.literal('checkbox') }),
  z.object({ kind: z.literal('avatar'), name: z.string(), index: z.number().int() }),
  z.object({ kind: z.literal('dot'), tone: z.enum(['gold', 'neutral']) }),
  z.object({ kind: z.literal('none') }),
]);

const trailingSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('chip'), text: z.string(), tone: toneSchema }),
  z.object({ kind: z.literal('time'), text: z.string() }),
]);

const chipSchema = z.object({ text: z.string(), tone: toneSchema });

const panelBase = {
  span: z.enum(['c3', 'c4', 'c6', 'c8', 'c12']),
  title: z.string(),
  subtitle: z.string().optional(),
  viewAll: z.boolean().optional(),
  /** Takes the full row on narrower desktops, so a trio of c4 cards never leaves an orphan. */
  wide: z.boolean().optional(),
};

export const listPanelSchema = z.object({
  kind: z.literal('list'),
  ...panelBase,
  items: z.array(
    z.object({
      leading: leadingSchema,
      title: z.string(),
      subtitle: z.string().optional(),
      trailing: trailingSchema.optional(),
    }),
  ),
});

const cellSchema = z.union([
  z.string(),
  chipSchema,
  z.object({ name: z.string(), index: z.number().int() }),
  z.object({ text: z.string(), good: z.boolean() }),
]);

export const tablePanelSchema = z.object({
  kind: z.literal('table'),
  ...panelBase,
  columns: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      cell: z.enum(['text', 'person', 'chip', 'number', 'conversion']),
      align: z.enum(['right']).optional(),
    }),
  ),
  rows: z.array(
    z.object({
      cells: z.record(z.string(), cellSchema),
      sort: z.record(z.string(), z.number()).optional(),
    }),
  ),
  rankColumn: z.string().optional(),
  sortOptions: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
  defaultSort: z.string().optional(),
});

export const barsPanelSchema = z.object({
  kind: z.literal('bars'),
  ...panelBase,
  rows: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      max: z.number().positive(),
      tone: barToneSchema,
      right: z.string(),
      rightSecondary: z.string().nullable().optional(),
    }),
  ),
  footnote: z.string().optional(),
});

export const segmentsPanelSchema = z.object({
  kind: z.literal('segments'),
  ...panelBase,
  items: z.array(z.object({ label: z.string(), count: z.number(), tone: tripToneSchema })),
});

export const groupedBarsPanelSchema = z.object({
  kind: z.literal('groupedBars'),
  ...panelBase,
  unit: z.string(),
  series: z.array(z.object({ label: z.string(), tone: z.enum(['received', 'due']) })).length(2),
  groups: z.array(z.object({ label: z.string(), values: z.array(z.number()).length(2) })),
});

export const trendPanelSchema = z.object({
  kind: z.literal('trend'),
  ...panelBase,
  /** ISO date of day 1; labels such as "Oct 8" are derived from it. */
  periodStart: z.string(),
  defaultMetric: z.string(),
  defaultGranularity: z.enum(['daily', 'weekly', 'monthly']),
  metrics: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      format: z.enum(['money', 'count']),
      /** Cumulative value for each of the 30 days of the period. */
      current: z.array(z.number()).length(30),
      prior: z.array(z.number()).length(30),
    }),
  ),
});

export const panelSchema = z.discriminatedUnion('kind', [
  listPanelSchema,
  tablePanelSchema,
  barsPanelSchema,
  segmentsPanelSchema,
  groupedBarsPanelSchema,
  trendPanelSchema,
]);

export const dashboardSchema = z.object({
  role: z.enum(ROLES),
  /** Honesty labels shown on every dashboard (filled by the backend from the database meta). */
  meta: z.object({ dataNotice: z.string(), refreshedLabel: z.string() }).optional(),
  pageTitle: z.string(),
  subtitle: z.string(),
  filters: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      icon: z.literal('calendar').optional(),
      options: z.array(z.string()).min(1),
    }),
  ),
  exportAllowed: z.boolean(),
  banner: z
    .object({
      kind: z.literal('today'),
      greeting: z.string(),
      stats: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          tone: z.enum(['danger', 'gold', 'plain']),
        }),
      ),
    })
    .optional(),
  kpis: z.array(kpiSchema).min(1),
  panels: z.array(panelSchema),
});

export type Tone = z.infer<typeof toneSchema>;
export type AccentTone = z.infer<typeof accentSchema>;
export type BarTone = z.infer<typeof barToneSchema>;
export type TripTone = z.infer<typeof tripToneSchema>;
export type IconName = z.infer<typeof iconSchema>;
export type Kpi = z.infer<typeof kpiSchema>;
export type Panel = z.infer<typeof panelSchema>;
export type ListPanel = z.infer<typeof listPanelSchema>;
export type TablePanel = z.infer<typeof tablePanelSchema>;
export type BarsPanel = z.infer<typeof barsPanelSchema>;
export type SegmentsPanel = z.infer<typeof segmentsPanelSchema>;
export type GroupedBarsPanel = z.infer<typeof groupedBarsPanelSchema>;
export type TrendPanel = z.infer<typeof trendPanelSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
