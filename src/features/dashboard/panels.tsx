'use client';

import { useMemo, useState } from 'react';
import { buildTrendView, sortTableRows, type Granularity } from '@/bll/dashboard/dashboardService';
import type {
  BarsPanel,
  GroupedBarsPanel,
  ListPanel,
  Panel,
  SegmentsPanel,
  TablePanel,
  TrendPanel,
} from '@/shared/schemas/dashboard';
import { GroupedBarsChart, LineAreaChart } from '@/ui/charts';
import { Icon } from '@/ui/Icon';
import {
  Avatar,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  MiniSelect,
  Tabs,
  ViewAllLink,
} from '@/ui/primitives';
import { accentIconClasses, barFillClasses, tripFillClasses } from '@/ui/tones';
import { useToast } from '@/ui/Toast';

const SPAN_CLASS = {
  c3: 'span-c3',
  c4: 'span-c4',
  c6: 'span-c6',
  c8: 'span-c8',
  c12: 'span-c12',
} as const;

/** Grid classes for a panel: its span, plus the full-row rule below 1560px when the data asks for it. */
const spanOf = (panel: { span: keyof typeof SPAN_CLASS; wide?: boolean }): string =>
  `${SPAN_CLASS[panel.span]}${panel.wide ? ' span-wide' : ''}`;

function useViewAll() {
  const toast = useToast();
  return () => toast.show('Opens the full list in the owning module');
}

// ---------- list ----------

function ListPanelView({ panel }: { panel: ListPanel }) {
  const viewAll = useViewAll();
  const [done, setDone] = useState<ReadonlySet<number>>(new Set());
  const toggle = (index: number) =>
    setDone((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Card className={spanOf(panel)}>
      <CardHeader
        title={panel.title}
        subtitle={panel.subtitle}
        actions={panel.viewAll ? <ViewAllLink onClick={viewAll} /> : undefined}
      />
      <ul>
        {panel.items.map((item, index) => {
          const checked = done.has(index);
          return (
            <li
              key={index}
              className="flex items-center gap-3 border-b border-line-default py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              {item.leading.kind === 'icon' ? (
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${accentIconClasses[item.leading.tone].circle}`}
                >
                  <Icon name={item.leading.icon} size={19} />
                </span>
              ) : null}
              {item.leading.kind === 'checkbox' ? (
                <Checkbox
                  checked={checked}
                  onChange={() => toggle(index)}
                  label={`Complete: ${item.title}`}
                />
              ) : null}
              {item.leading.kind === 'avatar' ? (
                <Avatar name={item.leading.name} index={item.leading.index} size={36} />
              ) : null}
              {item.leading.kind === 'dot' ? (
                <span
                  aria-hidden="true"
                  className={`h-[9px] w-[9px] shrink-0 rounded-full ${item.leading.tone === 'gold' ? 'bg-brand-gold-deep' : 'bg-line-default'}`}
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <div
                  className={`text-[13.5px] font-semibold ${checked ? 'text-fg-muted line-through' : ''}`}
                >
                  {item.title}
                </div>
                {item.subtitle ? (
                  <div className="text-[12.5px] text-fg-muted">{item.subtitle}</div>
                ) : null}
              </div>
              {item.trailing?.kind === 'chip' ? (
                <Chip tone={item.trailing.tone}>{item.trailing.text}</Chip>
              ) : null}
              {item.trailing?.kind === 'time' ? (
                <span className="self-start whitespace-nowrap pt-0.5 text-[11.5px] text-fg-muted">
                  {item.trailing.text}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// ---------- table ----------

function TablePanelView({ panel }: { panel: TablePanel }) {
  const viewAll = useViewAll();
  const [sortId, setSortId] = useState(panel.defaultSort);
  const rows = useMemo(() => sortTableRows(panel, sortId), [panel, sortId]);
  const title = panel.sortOptions
    ? `${panel.title} by ${panel.sortOptions.find((o) => o.id === sortId)?.label.toLowerCase() ?? ''}`
    : panel.title;

  const actions = panel.sortOptions ? (
    <MiniSelect
      label="Rank by"
      value={sortId ?? ''}
      onChange={setSortId}
      options={panel.sortOptions}
    />
  ) : panel.viewAll ? (
    <ViewAllLink onClick={viewAll} />
  ) : undefined;

  return (
    <Card className={spanOf(panel)}>
      <CardHeader title={title} subtitle={panel.subtitle} actions={actions} />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-soft">
              {panel.columns.map((column, i) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`whitespace-nowrap px-2 py-[9px] text-[12.5px] font-medium text-fg-secondary ${
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${i === 0 ? 'rounded-l-lg' : ''} ${i === panel.columns.length - 1 ? 'rounded-r-lg' : ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-line-default last:border-b-0">
                {panel.columns.map((column) => {
                  const value =
                    column.key === panel.rankColumn ? String(rowIndex + 1) : row.cells[column.key];
                  return (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-2 py-[11px] ${column.align === 'right' ? 'tabular text-right' : ''}`}
                    >
                      <Cell kind={column.cell} value={value} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Cell({ kind, value }: { kind: TablePanel['columns'][number]['cell']; value: unknown }) {
  if (kind === 'chip' && typeof value === 'object' && value !== null && 'tone' in value) {
    const chip = value as { text: string; tone: Parameters<typeof Chip>[0]['tone'] };
    return <Chip tone={chip.tone}>{chip.text}</Chip>;
  }
  if (kind === 'person' && typeof value === 'object' && value !== null && 'name' in value) {
    const person = value as { name: string; index: number };
    return (
      <span className="inline-flex items-center gap-2.5">
        <Avatar name={person.name} index={person.index} />
        {person.name}
      </span>
    );
  }
  if (kind === 'conversion' && typeof value === 'object' && value !== null && 'good' in value) {
    const conversion = value as { text: string; good: boolean };
    return (
      <span className="tabular">
        {conversion.text}{' '}
        <span
          className={
            conversion.good
              ? 'font-semibold text-status-success-text'
              : 'font-semibold text-fg-muted'
          }
        >
          {conversion.good ? '↑' : '–'}
        </span>
      </span>
    );
  }
  return <>{typeof value === 'string' ? value : ''}</>;
}

// ---------- bars (funnel, ageing) ----------

function BarsPanelView({ panel }: { panel: BarsPanel }) {
  const viewAll = useViewAll();
  return (
    <Card className={spanOf(panel)}>
      <CardHeader
        title={panel.title}
        subtitle={panel.subtitle}
        actions={panel.viewAll ? <ViewAllLink onClick={viewAll} /> : undefined}
      />
      <ul className="grid gap-2.5">
        {panel.rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[100px_1fr_96px] items-center gap-2.5 text-[13px] max-[520px]:grid-cols-[78px_1fr_80px]"
          >
            <span>{row.label}</span>
            <div
              className="h-[22px] overflow-hidden rounded-[5px] bg-surface-soft"
              role="presentation"
            >
              <i
                className={`block h-full rounded-[5px] ${barFillClasses[row.tone]}`}
                style={{ width: `${(row.value / row.max) * 100}%` }}
              />
            </div>
            <span className="tabular text-right">
              <b>{row.right}</b>
              {row.rightSecondary ? (
                <span className="ml-1 text-fg-muted">{row.rightSecondary}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {panel.footnote ? <p className="mt-3 text-xs text-fg-muted">{panel.footnote}</p> : null}
    </Card>
  );
}

// ---------- segments (trip status) ----------

function SegmentsPanelView({ panel }: { panel: SegmentsPanel }) {
  const viewAll = useViewAll();
  return (
    <Card className={spanOf(panel)}>
      <CardHeader
        title={panel.title}
        subtitle={panel.subtitle}
        actions={panel.viewAll ? <ViewAllLink onClick={viewAll} /> : undefined}
      />
      <div className="mt-1.5 flex h-4 gap-0.5 overflow-hidden rounded-md" role="presentation">
        {panel.items.map((item) => (
          <i
            key={item.label}
            className={`block ${tripFillClasses[item.tone].fill}`}
            style={{ flex: item.count }}
            title={`${item.label}: ${item.count}`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-fg-secondary">
        {panel.items.map((item) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            <i
              className={`inline-block h-[9px] w-[9px] rounded-sm ${tripFillClasses[item.tone].dot}`}
              aria-hidden="true"
            />
            {item.label} <b className="tabular">{item.count}</b>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------- grouped bars ----------

function GroupedBarsPanelView({ panel }: { panel: GroupedBarsPanel }) {
  const fillClass = { received: 'bg-chart-received', due: 'bg-chart-due' } as const;
  return (
    <Card className={spanOf(panel)}>
      <CardHeader title={panel.title} subtitle={panel.subtitle} />
      <div className="mb-1.5 flex items-center justify-end gap-4 text-xs text-fg-muted">
        {panel.series.map((series) => (
          <span key={series.label} className="inline-flex items-center gap-1.5">
            <i
              className={`inline-block h-[9px] w-[9px] rounded-full ${fillClass[series.tone]}`}
              aria-hidden="true"
            />
            {series.label}
          </span>
        ))}
      </div>
      <GroupedBarsChart groups={panel.groups} series={panel.series} unit={panel.unit} />
    </Card>
  );
}

// ---------- trend ----------

const GRANULARITY_OPTIONS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'daily', label: 'Daily' },
  { id: 'monthly', label: 'Monthly' },
] as const;

function TrendPanelView({ panel }: { panel: TrendPanel }) {
  const [metricId, setMetricId] = useState(panel.defaultMetric);
  const [granularity, setGranularity] = useState<Granularity>(panel.defaultGranularity);
  const view = useMemo(
    () => buildTrendView(panel, metricId, granularity),
    [panel, metricId, granularity],
  );

  return (
    <Card className={spanOf(panel)}>
      <CardHeader
        title={panel.title}
        subtitle={panel.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Tabs
              label="Metric"
              value={metricId}
              onChange={setMetricId}
              options={panel.metrics.map((m) => ({ id: m.id, label: m.label }))}
            />
            <MiniSelect
              label="Granularity"
              value={granularity}
              onChange={(v) => setGranularity(v as Granularity)}
              options={GRANULARITY_OPTIONS}
            />
          </div>
        }
      />
      <div className="mb-1.5 flex items-center justify-end gap-4 text-xs text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <i
            className="inline-block h-[9px] w-[9px] rounded-full bg-chart-current"
            aria-hidden="true"
          />
          Current period
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i
            className="inline-block w-3.5 border-t-2 border-dashed border-chart-prior"
            aria-hidden="true"
          />
          Prior period
        </span>
      </div>
      <LineAreaChart view={view} />
    </Card>
  );
}

// ---------- dispatcher ----------

export function PanelView({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case 'list':
      return <ListPanelView panel={panel} />;
    case 'table':
      return <TablePanelView panel={panel} />;
    case 'bars':
      return <BarsPanelView panel={panel} />;
    case 'segments':
      return <SegmentsPanelView panel={panel} />;
    case 'groupedBars':
      return <GroupedBarsPanelView panel={panel} />;
    case 'trend':
      return <TrendPanelView panel={panel} />;
  }
}
