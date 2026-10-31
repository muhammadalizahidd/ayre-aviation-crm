import { describe, expect, it } from 'vitest';
import { flattenTheme } from './flatten';
import { DEFAULT_THEME, resolveThemeName, themes, type ThemeTokens } from './themes';

/** WCAG 2.1 relative luminance for #RRGGBB values. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
};

describe('theme system (single source of truth for color)', () => {
  const reference = flattenTheme(themes[DEFAULT_THEME]);

  it('has no empty token values', () => {
    for (const token of reference) expect(token.value.trim(), token.path).not.toBe('');
  });

  it('generates unique CSS names for every token', () => {
    const names = reference.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('requires every theme to define exactly the same token keys', () => {
    const keys = reference.map((t) => t.path).sort();
    for (const [name, theme] of Object.entries(themes)) {
      expect(
        flattenTheme(theme as ThemeTokens)
          .map((t) => t.path)
          .sort(),
        name,
      ).toEqual(keys);
    }
  });

  it('detects a theme that is missing a token (propagation guard)', () => {
    const broken = structuredClone(themes[DEFAULT_THEME]) as unknown as Record<
      string,
      Record<string, unknown>
    >;
    delete broken.fg?.primary;
    const brokenKeys = flattenTheme(broken as unknown as ThemeTokens).map((t) => t.path);
    expect(brokenKeys).not.toContain('fg.primary');
    expect(brokenKeys.length).toBe(reference.length - 1);
  });

  it('falls back to the default theme for unknown names', () => {
    expect(resolveThemeName('does-not-exist')).toBe(DEFAULT_THEME);
    expect(resolveThemeName(undefined)).toBe(DEFAULT_THEME);
    expect(resolveThemeName('ayre')).toBe('ayre');
  });

  describe('contrast of declared text and surface pairs (WCAG AA)', () => {
    const t = themes[DEFAULT_THEME];
    const pairs: [string, string, string, number][] = [
      ['primary text on card', t.fg.primary, t.surface.card, 4.5],
      ['primary text on canvas', t.fg.primary, t.surface.canvas, 4.5],
      ['secondary text on card', t.fg.secondary, t.surface.card, 4.5],
      ['muted text on card', t.fg.muted, t.surface.card, 4.5],
      ['text on gold button', t.action.primaryText, t.action.primaryBg, 4.5],
      ['gold text on ink (button hover)', t.action.primaryHoverText, t.action.primaryHoverBg, 4.5],
      ['text on sidebar', t.fg.onDark, t.surface.sidebar, 4.5],
      ['muted text on sidebar', t.fg.onDarkMuted, t.surface.sidebar, 4.5],
      ['active nav text on sidebar', t.nav.activeText, t.surface.sidebar, 4.5],
      ['link on card', t.fg.link, t.surface.card, 4.5],
      ['success chip text on card', t.status.success.text, t.surface.card, 4.5],
      ['warning chip text on card', t.status.warning.text, t.surface.card, 4.5],
      ['danger chip text on card', t.status.danger.text, t.surface.card, 4.5],
      ['info chip text on card', t.status.info.text, t.surface.card, 4.5],
      ['special chip text on card', t.status.special.text, t.surface.card, 4.5],
      ['white text on avatar 1', t.fg.onSolid, t.avatar.a1, 3],
      ['white text on avatar 2', t.fg.onSolid, t.avatar.a2, 3],
      ['white text on avatar 3', t.fg.onSolid, t.avatar.a3, 3],
      ['white text on avatar 4', t.fg.onSolid, t.avatar.a4, 3],
      ['white text on avatar 5', t.fg.onSolid, t.avatar.a5, 3],
    ];

    it.each(pairs)('%s', (_label, foreground, background, minimum) => {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(minimum);
    });
  });
});
