'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Tone } from '@/shared/schemas/dashboard';
import { Icon } from './Icon';
import { avatarClassFor, chipClasses } from './tones';

/** Standard card: white surface, hairline border, 14px radius, theme shadow (DESIGN.md 4.2). */
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={`min-w-0 rounded-[14px] border border-line-default bg-surface-card p-5 shadow-card ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
      <div>
        <h3 className="text-[17px] font-bold tracking-tight">{title}</h3>
        {subtitle ? <div className="mt-0.5 text-xs text-fg-muted">{subtitle}</div> : null}
      </div>
      {actions}
    </div>
  );
}

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-[7px] px-[11px] py-[3px] text-xs font-medium ${chipClasses[tone]}`}
    >
      {children}
    </span>
  );
}

/** Initials avatar. The color cycles by index through the avatar tokens. */
export function Avatar({ name, index, size = 30 }: { name: string; index: number; size?: number }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full text-[11px] font-semibold text-fg-on-solid ${avatarClassFor(index)}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: 'download';
}

/** The single gold primary action of a view. Hover flips to ink with gold text (DESIGN.md 6.1). */
export function PrimaryButton({ icon, children, className = '', ...rest }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-[42px] items-center gap-2.5 rounded-[10px] border border-action-primary-border bg-action-primary-bg px-5 font-semibold text-action-primary-text transition-colors hover:border-action-primary-hover-bg hover:bg-action-primary-hover-bg hover:text-action-primary-hover-text disabled:cursor-progress disabled:opacity-80 ${className}`}
      {...rest}
    >
      {icon ? <Icon name={icon} size={17} /> : null}
      {children}
    </button>
  );
}

/** Link-style button used for "View all". */
export function ViewAllLink({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line-link-outline px-2.5 py-1 text-[12.5px] font-medium text-fg-link hover:bg-action-link-hover-bg"
    >
      View all
      <Icon name="arrow" size={13} strokeWidth={2} />
    </button>
  );
}

/** Segmented control. Active tab uses the primary action colors. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      className="flex gap-0.5 rounded-[10px] bg-surface-soft p-[3px]"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium ${
              active
                ? 'bg-action-primary-bg font-semibold text-action-primary-text'
                : 'text-fg-secondary hover:bg-surface-card'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Compact select used inside cards (34px). */
export function MiniSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { id: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[34px] appearance-none rounded-[9px] border border-line-default bg-surface-card pl-3 pr-8 text-[13px] font-medium"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevd" size={14} className="pointer-events-none absolute right-2.5 top-[10px]" />
    </div>
  );
}

/** Status line under the page title: DEMO DATA, MOCK MODE, NOT CONNECTED... (PRD 15.1). */
export function StatusLine({
  items,
}: {
  items: readonly { id: string; label: string; level: 'ok' | 'warn' | 'plain' }[];
}) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
      {items.map((item) => (
        <li key={item.id} className="inline-flex items-center gap-1.5">
          {item.level !== 'plain' ? (
            <span
              aria-hidden="true"
              className={`h-[7px] w-[7px] rounded-full ${item.level === 'ok' ? 'bg-status-success-solid' : 'bg-status-warning-solid'}`}
            />
          ) : null}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-[1.5px] ${
        checked
          ? 'border-action-primary-border bg-action-primary-bg text-action-primary-text'
          : 'border-line-checkbox bg-surface-card'
      }`}
    >
      {checked ? <Icon name="check" size={13} strokeWidth={2.6} /> : null}
    </button>
  );
}
