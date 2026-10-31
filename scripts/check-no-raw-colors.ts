/**
 * Fails when a raw color value appears anywhere except src/theme/ (the single source of truth).
 * Checks .ts, .tsx, .css, .svg, .json and .mjs files under src/ and scripts/.
 * The generated theme CSS is excluded because it is produced from src/theme/themes.ts.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['src'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.svg', '.json', '.mjs']);
const ALLOWED = [
  path.join('src', 'theme') + path.sep,
  path.join('src', 'styles', 'theme.generated.css'),
];

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNCTIONAL = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb)\(/gi;

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(full))) yield full;
  }
}

const findings: string[] = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const relative = path.relative(ROOT, file);
    if (ALLOWED.some((allowed) => relative.startsWith(allowed) || relative === allowed)) continue;
    if (relative.endsWith('.test.ts')) continue;

    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((line, index) => {
        const hits = [...(line.match(HEX) ?? []), ...(line.match(FUNCTIONAL) ?? [])];
        if (hits.length > 0) findings.push(`${relative}:${index + 1}  ${hits.join(', ')}`);
      });
  }
}

if (findings.length > 0) {
  console.error(
    'Raw colors found outside src/theme/:\n' + findings.map((f) => `  ${f}`).join('\n'),
  );
  console.error('\nDefine the color in src/theme/themes.ts and use its token instead.');
  process.exit(1);
}
console.log('check:colors OK. No raw colors outside src/theme/.');
