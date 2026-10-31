import type { AccentTone, BarTone, Tone, TripTone } from '@/shared/schemas/dashboard';

/**
 * Maps data tone names to Tailwind classes built from theme tokens.
 * Class names are written out in full so Tailwind can detect them.
 * No color values here: the classes resolve to the single theme source.
 */

export const chipClasses: Record<Tone, string> = {
  success: 'bg-status-success-tint text-status-success-text',
  warning: 'bg-status-warning-tint text-status-warning-text',
  danger: 'bg-status-danger-tint text-status-danger-text',
  info: 'bg-status-info-tint text-status-info-text',
  special: 'bg-status-special-tint text-status-special-text',
  neutral: 'bg-status-neutral-tint text-status-neutral-text',
  dark: 'bg-brand-ink text-brand-gold-on-dark',
};

export const deltaClasses = {
  success: 'text-status-success-text',
  danger: 'text-status-danger-text',
  neutral: 'text-fg-muted',
} as const;

export const accentIconClasses: Record<
  AccentTone,
  { circle: string; stroke: string; gradientVar: string }
> = {
  gold: {
    circle: 'bg-accent-gold-tint text-accent-gold-icon',
    stroke: 'stroke-accent-gold-line',
    gradientVar: 'var(--c-accent-gold-line)',
  },
  red: {
    circle: 'bg-accent-red-tint text-accent-red-icon',
    stroke: 'stroke-accent-red-line',
    gradientVar: 'var(--c-accent-red-line)',
  },
  green: {
    circle: 'bg-accent-green-tint text-accent-green-icon',
    stroke: 'stroke-accent-green-line',
    gradientVar: 'var(--c-accent-green-line)',
  },
  blue: {
    circle: 'bg-accent-blue-tint text-accent-blue-icon',
    stroke: 'stroke-accent-blue-line',
    gradientVar: 'var(--c-accent-blue-line)',
  },
  amber: {
    circle: 'bg-accent-amber-tint text-accent-amber-icon',
    stroke: 'stroke-accent-amber-line',
    gradientVar: 'var(--c-accent-amber-line)',
  },
  purple: {
    circle: 'bg-accent-purple-tint text-accent-purple-icon',
    stroke: 'stroke-accent-purple-line',
    gradientVar: 'var(--c-accent-purple-line)',
  },
};

/** Solid fills used by segmented bars, ageing and funnel bars. */
export const solidFillClasses: Record<Tone | 'ink' | 'gold', string> = {
  success: 'bg-status-success-solid',
  warning: 'bg-status-warning-solid',
  danger: 'bg-status-danger-solid',
  info: 'bg-status-info-solid',
  special: 'bg-status-special-solid',
  neutral: 'bg-status-neutral-solid',
  dark: 'bg-brand-ink',
  ink: 'bg-brand-ink',
  gold: 'bg-brand-gold-deep',
};

export const barFillClasses: Record<BarTone, string> = {
  ink: solidFillClasses.ink,
  info: solidFillClasses.info,
  warning: solidFillClasses.warning,
  success: solidFillClasses.success,
  danger: solidFillClasses.danger,
  neutral: solidFillClasses.neutral,
  gold: solidFillClasses.gold,
};

export const tripFillClasses: Record<TripTone, { fill: string; dot: string }> = {
  draft: { fill: 'bg-trip-draft', dot: 'bg-trip-draft' },
  sourcing: { fill: 'bg-trip-sourcing', dot: 'bg-trip-sourcing' },
  quoting: { fill: 'bg-trip-quoting', dot: 'bg-trip-quoting' },
  confirmed: { fill: 'bg-trip-confirmed', dot: 'bg-trip-confirmed' },
  completed: { fill: 'bg-trip-completed', dot: 'bg-trip-completed' },
  cancelled: { fill: 'bg-trip-cancelled', dot: 'bg-trip-cancelled' },
};

export const avatarClasses = [
  'bg-avatar-a1',
  'bg-avatar-a2',
  'bg-avatar-a3',
  'bg-avatar-a4',
  'bg-avatar-a5',
] as const;

export const avatarClassFor = (index: number): string =>
  avatarClasses[Math.abs(index) % avatarClasses.length] ?? avatarClasses[0];
