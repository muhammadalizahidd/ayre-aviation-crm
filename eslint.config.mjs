import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const RAW_COLOR_MESSAGE =
  'Raw color values are not allowed here. Define the color in src/theme/themes.ts and use its token (see docs/theming.md).';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'node_modules/**',
    'next-env.d.ts',
    'src/styles/theme.generated.css',
    'Docs/**',
    'Documentation/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-restricted-syntax': [
        'error',
        { selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]', message: RAW_COLOR_MESSAGE },
        {
          selector: 'Literal[value=/^(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb)\\(/i]',
          message: RAW_COLOR_MESSAGE,
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]',
          message: RAW_COLOR_MESSAGE,
        },
      ],
    },
  },
  {
    // The single place where color values are allowed.
    files: ['src/theme/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['scripts/**', 'tests/**', '**/*.test.ts'],
    rules: { 'no-console': 'off' },
  },
]);
