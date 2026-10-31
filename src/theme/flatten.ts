import type { ThemeTokens } from './themes';

export interface FlatToken {
  /** Dot path inside the theme, for example `status.danger.text`. */
  path: string;
  /** Kebab-case name used for CSS, for example `status-danger-text`. */
  name: string;
  value: string;
  /** First path segment, for example `status`. */
  group: string;
}

const toKebab = (segment: string): string =>
  segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Flattens a nested theme into an ordered list of tokens. Pure; shared by the generator and the tests. */
export function flattenTheme(theme: ThemeTokens): FlatToken[] {
  const out: FlatToken[] = [];
  const walk = (node: object, trail: string[]): void => {
    for (const [key, value] of Object.entries(node)) {
      const next = [...trail, key];
      if (typeof value === 'string') {
        out.push({
          path: next.join('.'),
          name: next.map(toKebab).join('-'),
          value,
          group: next[0] ?? '',
        });
      } else {
        walk(value as object, next);
      }
    }
  };
  walk(theme, []);
  return out;
}
