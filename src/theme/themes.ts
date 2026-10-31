/**
 * THE SINGLE SOURCE OF TRUTH FOR COLOR.
 *
 * Every color value on the platform is defined in this file and nowhere else.
 * Components refer to semantic token names (for example `status-danger-text`),
 * never to color values. To restyle the platform, edit the values below, or add a
 * new theme object and select it with NEXT_PUBLIC_THEME.
 *
 * How the values reach the UI:
 *   themes.ts  ->  scripts/generate-theme-css.ts  ->  src/styles/theme.generated.css
 *   (CSS variables per theme + the Tailwind `@theme` mapping that makes utilities
 *   such as `bg-surface-card` and `text-status-danger-text` available)
 *
 * Rules (enforced by `pnpm check:colors`, ESLint and the tests):
 *   - No hex, rgb(), hsl() or named-color literals outside this folder.
 *   - Every theme must define exactly the same token keys.
 *   - Token names describe purpose, not appearance (no "gold" or "red" in component code).
 *
 * The values below come from Docs/DESIGN.md section 2.
 */

const ayre = {
  /** Brand identity colors (used by the logo mark and a few accents). */
  brand: {
    ink: '#101319',
    gold: '#FFD700',
    goldDeep: '#D9A521',
    goldOnDark: '#E8C25A',
    goldMark: '#E8B93F',
    black: '#000000',
  },

  /** Backgrounds. */
  surface: {
    canvas: '#FAF8F5',
    card: '#FFFFFF',
    soft: '#F6F3EE',
    sidebar: '#101319',
    inverse: '#101319',
    loginHero: '#000000',
    loginPanel: '#101319',
    loginField: '#1F232A',
  },

  /** Text and icon (foreground) colors. */
  fg: {
    primary: '#16181D',
    secondary: '#2A2D33',
    muted: '#6B6F76',
    onGold: '#0B0B0B',
    onDark: '#F3F1EC',
    onDarkMuted: '#D4D6DA',
    onDarkSubtle: '#77797C',
    onSolid: '#FFFFFF',
    link: '#2563EB',
    dangerOnDark: '#F87171',
    dangerOnDarkStrong: '#FECACA',
  },

  /** Borders, dividers and rings. */
  line: {
    default: '#EFEAE2',
    onDark: '#4B4847',
    focus: '#FFD700',
    goldOutline: '#B8892D',
    checkbox: '#CFC9BE',
    navDivider: 'rgba(255, 255, 255, 0.14)',
    linkOutline: '#BFD3F8',
  },

  /** Buttons and interactive controls. */
  action: {
    primaryBg: '#FFD700',
    primaryText: '#0B0B0B',
    primaryBorder: '#C9A400',
    primaryHoverBg: '#101319',
    primaryHoverText: '#FFD700',
    linkHoverBg: '#EEF4FF',
  },

  /** Sidebar navigation states. */
  nav: {
    text: '#F3F1EC',
    hoverBg: 'rgba(255, 255, 255, 0.09)',
    activeBg: 'rgba(217, 165, 33, 0.2)',
    activeBorder: '#B8892D',
    activeText: '#F0CC6B',
    activeIcon: '#F0B93B',
  },

  /** Status meaning. `solid` = strong fill or line, `tint` = chip background, `text` = chip text. */
  status: {
    success: { solid: '#16A34A', tint: 'rgba(22, 163, 74, 0.13)', text: '#15803D' },
    warning: { solid: '#F59E0B', tint: 'rgba(245, 158, 11, 0.17)', text: '#B45309' },
    danger: { solid: '#EF4444', tint: 'rgba(239, 68, 68, 0.12)', text: '#DC2626' },
    info: { solid: '#2563EB', tint: 'rgba(37, 99, 235, 0.12)', text: '#1D4ED8' },
    special: { solid: '#7C3AED', tint: 'rgba(124, 58, 237, 0.12)', text: '#6D28D9' },
    neutral: { solid: '#4B4847', tint: '#F6F3EE', text: '#4B4847' },
  },

  /** KPI icon circles and sparklines: `tint` circle, `icon` glyph, `line` chart stroke. */
  accent: {
    gold: { tint: 'rgba(217, 165, 33, 0.16)', icon: '#C4901A', line: '#D9A521' },
    red: { tint: 'rgba(239, 68, 68, 0.12)', icon: '#DC2626', line: '#EF4444' },
    green: { tint: 'rgba(22, 163, 74, 0.13)', icon: '#16A34A', line: '#16A34A' },
    blue: { tint: 'rgba(37, 99, 235, 0.12)', icon: '#2563EB', line: '#2563EB' },
    amber: { tint: 'rgba(245, 158, 11, 0.16)', icon: '#D97706', line: '#F59E0B' },
    purple: { tint: 'rgba(124, 58, 237, 0.12)', icon: '#7C3AED', line: '#7C3AED' },
  },

  /** Chart-specific colors. */
  chart: {
    current: '#D9A521',
    prior: '#B7B9BD',
    priorMarker: '#9A9DA3',
    markerFill: '#FFFFFF',
    grid: '#EFEAE2',
    axis: '#6B6F76',
    received: '#16A34A',
    due: '#D9A521',
    dayBar: '#1F2937',
    dayBarToday: '#D9A521',
  },

  /** Trip status bar segments. */
  trip: {
    draft: '#C9CCD1',
    sourcing: '#2563EB',
    quoting: '#F59E0B',
    confirmed: '#D9A521',
    completed: '#16A34A',
    cancelled: '#EF4444',
  },

  /** Initials avatars (white text). */
  avatar: {
    a1: '#3B82F6',
    a2: '#7C3AED',
    a3: '#6366F1',
    a4: '#0D9488',
    a5: '#D97706',
  },

  /** Photo scrims on the login screen (all black at different strengths). */
  scrim: {
    solid: '#000000',
    heavy: 'rgba(0, 0, 0, 0.78)',
    medium: 'rgba(0, 0, 0, 0.25)',
    clear: 'rgba(0, 0, 0, 0)',
    sideStrong: 'rgba(0, 0, 0, 0.7)',
    sideSoft: 'rgba(0, 0, 0, 0.2)',
  },

  /** Shadows (complete CSS box-shadow values, so a theme can change depth and tint together). */
  shadow: {
    card: '0 1px 2px rgba(30, 20, 5, 0.04), 0 8px 24px rgba(30, 20, 5, 0.04)',
    cardHover: '0 1px 2px rgba(30, 20, 5, 0.05), 0 10px 28px rgba(30, 20, 5, 0.1)',
    floating: '0 10px 30px rgba(0, 0, 0, 0.25)',
  },
} as const;

type Widen<T> = { -readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** The exact shape every theme must provide. Adding a token here forces all themes to define it. */
export type ThemeTokens = Widen<typeof ayre>;

/** All available themes. Add a new theme here; it must satisfy `ThemeTokens`. */
export const themes = {
  ayre,
} satisfies Record<string, ThemeTokens>;

export type ThemeName = keyof typeof themes;

export const DEFAULT_THEME: ThemeName = 'ayre';

/** Resolves a theme name from configuration, falling back to the default for unknown values. */
export function resolveThemeName(value: string | undefined): ThemeName {
  return value !== undefined && value in themes ? (value as ThemeName) : DEFAULT_THEME;
}
