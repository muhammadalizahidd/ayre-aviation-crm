/**
 * Layer rules for the four-layer architecture (see docs/adr/0001-layers.md).
 *
 *   UI  ->  BLL  ->  api-client  ->  backend  ->  database
 *
 * A violation fails `pnpm check:layers` and therefore `pnpm verify`.
 */
module.exports = {
  forbidden: [
    {
      name: 'ui-must-not-reach-backend-or-database',
      comment: 'UI talks to the business logic layer only.',
      severity: 'error',
      from: { path: '^src/(app|features|ui)/' },
      to: { path: '^src/(backend|database)/' },
    },
    {
      name: 'bll-must-not-use-ui-or-framework-or-lower-layers',
      comment: 'Business logic is plain TypeScript. It may use the API client contract only.',
      severity: 'error',
      from: { path: '^src/bll/' },
      to: { path: '^src/(app|features|ui|theme|backend|database)/' },
    },
    {
      name: 'bll-must-not-import-react-or-next',
      severity: 'error',
      from: { path: '^src/bll/' },
      to: { path: '^node_modules/(react|react-dom|next)(/|$)' },
    },
    {
      name: 'api-client-must-only-use-backend-and-shared',
      severity: 'error',
      from: { path: '^src/api-client/' },
      to: { path: '^src/(app|features|ui|theme|bll|database)/' },
    },
    {
      name: 'backend-must-only-use-database-and-shared',
      severity: 'error',
      from: { path: '^src/backend/' },
      to: { path: '^src/(app|features|ui|theme|bll|api-client)/' },
    },
    {
      name: 'database-must-only-use-shared',
      severity: 'error',
      from: { path: '^src/database/' },
      to: { path: '^src/(app|features|ui|theme|bll|api-client|backend)/' },
    },
    {
      name: 'shared-is-a-leaf',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/(app|features|ui|theme|bll|api-client|backend|database)/' },
    },
    {
      name: 'theme-is-ui-only',
      comment: 'Color values are consumed by the UI through generated CSS, never by logic layers.',
      severity: 'error',
      from: { path: '^src/(bll|api-client|backend|database|shared)/' },
      to: { path: '^src/theme/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    exclude: { path: '\\.test\\.ts$' },
  },
};
