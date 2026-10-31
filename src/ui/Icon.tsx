import type { SVGProps } from 'react';

/** Line icons, 24px grid, stroke 1.6, round caps (DESIGN.md 6.8). Colors come from `currentColor`. */
const PATHS = {
  home: 'M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z',
  users:
    'M9 11.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM3 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M17 11.4a2.4 2.4 0 100-4.8 2.4 2.4 0 000 4.8zM16.5 14.6c2.8.2 4.5 1.9 4.5 4.4',
  funnel: 'M4 5h16l-6 7.5V19l-4 2v-8.5z',
  plane: 'M21 4L3 11l6 2.5L11.5 20 21 4zM9 13.5l5-4',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  cal: 'M5.5 5h13a2 2 0 012 2v11.5a2 2 0 01-2 2h-13a2 2 0 01-2-2V7a2 2 0 012-2zM3.5 10h17M8 3v4M16 3v4M9 15l2.2 2.2L15.5 13',
  bldg: 'M5.5 3.5h13a1.5 1.5 0 011.5 1.5v14a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19V5a1.5 1.5 0 011.5-1.5zM8 8h2M14 8h2M8 12h2M14 12h2M10 20.5v-4h4v4',
  msg: 'M4 5h16v11H9l-5 4z',
  wallet:
    'M5.5 6.5h13a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17V9a2.5 2.5 0 012.5-2.5zM3 10h18M16 14.5h2',
  pct: 'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM9 15l6-6M9.5 9.5h.01M14.5 14.5h.01',
  tasks: 'M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zM8 12l3 3 5-6',
  bolt: 'M13 2L5 14h6l-1 8 8-12h-6z',
  bars: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  gear: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1',
  target:
    'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM12 11a1 1 0 100 2 1 1 0 000-2z',
  dollar:
    'M12 3v18M16.5 7.5C15.5 6 14 5.5 12 5.5c-2.5 0-4 1.2-4 3s1.5 2.7 4 3.2 4 1.2 4 3.2-1.5 3-4 3c-2 0-3.5-.7-4.5-2',
  trend: 'M3 17l6-6 4 4 8-9M15 6h6v6',
  clock: 'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 7.5V12l3 2',
  alert: 'M12 3.5L2.5 20h19zM12 10v4.5M12 17.5h.01',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  check: 'M5 12l4 4 10-10',
  up: 'M12 19V5M5 12l7-7 7 7',
  down: 'M12 5v14M5 12l7 7 7-7',
  flat: 'M5 12h14',
  chev: 'M9 6l6 6-6 6',
  chevd: 'M6 9l6 6 6-6',
  calendar:
    'M5.5 5h13a2 2 0 012 2v11.5a2 2 0 01-2 2h-13a2 2 0 01-2-2V7a2 2 0 012-2zM3.5 10h17M8 3v4M16 3v4',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5',
  bell: 'M6 9a6 6 0 1112 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9zM10 20a2 2 0 004 0',
  menu: 'M4 7h16M4 12h10M4 17h16',
  collapse: 'M11 7l-5 5 5 5M18 7l-5 5 5 5',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
} as const;

export type IconKey = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconKey;
  size?: number;
}

/** Decorative by default (aria-hidden). Pass `aria-label` on the parent button for icon-only controls. */
export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ''}`}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
