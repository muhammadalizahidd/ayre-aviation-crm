# Ayre Aviation CRM (frontend prototype)

A Next.js prototype of the Ayre Aviation charter-broker CRM.

> **Everything in this app is mocked.** All people, companies, figures and sign-ins are fictional demo data read from one JSON file. There is no real backend, no real authentication, and **no live Avinode or Paynode connection**. The UI says so on every page (`DEMO DATA`, `MOCK MODE`, `NOT CONNECTED`).

This release contains the **login** and the **four role dashboards**. The other modules are listed in the menu but open a clear "built in a later phase" page.

| Role            | Dashboard           |
| --------------- | ------------------- |
| Executive       | Executive Dashboard |
| Sales Manager   | Team Dashboard      |
| Broker          | My Workspace        |
| Finance Manager | Finance Dashboard   |

Demo usernames: `executive`, `sales.manager`, `broker`, `finance.manager`. Passwords are in `src/database/data/mock-db.json` under `users` (demo only; anyone who can read that file can read them).

## Run it

Requires Node 22 and pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and sign in.

| Command                     | What it does                                       |
| --------------------------- | -------------------------------------------------- |
| `pnpm dev`                  | Development server (generates the theme CSS first) |
| `pnpm build` / `pnpm start` | Production build and server                        |
| `pnpm test`                 | Unit and contract tests (Vitest)                   |
| `pnpm lint`                 | ESLint                                             |
| `pnpm typecheck`            | TypeScript, strict                                 |
| `pnpm check:layers`         | Fails if a layer imports one it must not           |
| `pnpm check:colors`         | Fails if a raw color appears outside `src/theme/`  |
| `pnpm verify`               | Everything above plus a production build           |

## Deploy to Vercel

1. Push this repository to GitHub (the mock data file is part of the repo).
2. In Vercel, **Add New Project**, import the repository. The framework is detected as Next.js; keep the defaults.
3. Optional environment variables (see `.env.example`): `NEXT_PUBLIC_THEME`, `NEXT_PUBLIC_MOCK_LATENCY_MS`.
4. Deploy. The deployed site reads the same `src/database/data/mock-db.json` that is in GitHub. Editing that file and pushing redeploys with the new data.

No server, database or secret is needed.

## Architecture: four separated layers

```
UI  (src/app, src/features, src/ui)
 -> Business logic (src/bll)              rules, workflows, permissions, KPI math
 -> API client (src/api-client)           the only door to data; swap point for a real server
 -> Backend (src/backend)                 endpoint-style handlers, authorization, errors (mocked)
 -> Database (src/database)               repositories over src/database/data/mock-db.json
```

Shared types and schemas live in `src/shared`. The theme lives in `src/theme`. Layer rules are enforced by `pnpm check:layers` (see `docs/adr/0001-layers.md`).

To use a real backend later: replace `src/backend` and `src/database`, and change the transport in `src/api-client/index.ts` to `fetch`. The UI and the business logic layer do not change.

## One place for colors

Every color value is defined in **`src/theme/themes.ts`** and nowhere else. Components use semantic names (`bg-surface-card`, `text-status-danger-text`). To restyle the platform, edit that file or add a theme and set `NEXT_PUBLIC_THEME`. See `docs/theming.md`.

## The mock data file

`src/database/data/mock-db.json` holds users and the four dashboards. It is validated against zod schemas when loaded, so a bad edit fails loudly. It carries only tone names, never colors. Keep every record fictional.

## Documents

- PRD: `Docs/Ayre_Aviation_Broker_CRM_PRD_Frontend_Meeting_Updated.md`
- Design system: `Docs/DESIGN.md`
- Rules for developers and AI agents: `Docs/AGENTS.md` (also `AGENTS.md` at the root)
- Delivery plan: `Docs/IMPLEMENTATION_PLAN.md`
- Source specifications: `Documentation/`
