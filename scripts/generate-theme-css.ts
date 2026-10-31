/**
 * Generates src/styles/theme.generated.css from src/theme/themes.ts.
 *
 * Output:
 *   1. CSS variables per theme:   :root[data-theme="ayre"] { --c-surface-card: #FFFFFF; ... }
 *   2. Tailwind v4 mapping:       @theme inline { --color-surface-card: var(--c-surface-card); ... }
 *
 * Run automatically before `dev` and `build`. Never edit the output by hand.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { flattenTheme } from '../src/theme/flatten';
import { DEFAULT_THEME, themes, type ThemeName } from '../src/theme/themes';

const OUTPUT = path.resolve(__dirname, '../src/styles/theme.generated.css');

const themeNames = Object.keys(themes) as ThemeName[];
const reference = flattenTheme(themes[DEFAULT_THEME]);

const blocks = themeNames.map((name) => {
  const tokens = flattenTheme(themes[name]);
  const selector =
    name === DEFAULT_THEME ? `:root,\n:root[data-theme='${name}']` : `:root[data-theme='${name}']`;
  const lines = tokens.map((t) => `  --c-${t.name}: ${t.value};`).join('\n');
  return `${selector} {\n${lines}\n}`;
});

const mapping = reference
  .map((t) =>
    t.group === 'shadow'
      ? `  --shadow-${t.name.replace(/^shadow-/, '')}: var(--c-${t.name});`
      : `  --color-${t.name}: var(--c-${t.name});`,
  )
  .join('\n');

const css = `/* GENERATED FILE. Do not edit. Source: src/theme/themes.ts (run \`pnpm theme:generate\`). */

${blocks.join('\n\n')}

/* Removes the default Tailwind palette so only the semantic tokens below exist. */
@theme {
  --color-*: initial;
  --color-transparent: transparent;
  --color-current: currentcolor;
}

@theme inline {
${mapping}
}
`;

mkdirSync(path.dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, css, 'utf8');
console.log(
  `theme.generated.css written: ${themeNames.length} theme(s), ${reference.length} tokens`,
);
