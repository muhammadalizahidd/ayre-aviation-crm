# Implementation plan: Ayre Aviation CRM (Next.js frontend on mock data)

Status: **proposed, waiting for approval.** Nothing in this plan has been built yet.

Governing documents (read in this order): the PRD (`Docs/Ayre_Aviation_Broker_CRM_PRD_Frontend_Meeting_Updated.md`), the 18 specifications (`Documentation/*.docx`), `Docs/DESIGN.md`, `Docs/AGENTS.md`. The prototype `Docs/ayre-crm-login-and-dashboard.html` is the visual reference.

Contents

1. Goal and scope
2. Decisions and assumptions to confirm
3. Architecture: four separated layers
4. Technology choices
5. Repository structure
6. Single source of truth for colors (theme system)
7. Mock database (JSON) and the "this is mocked" rule
8. Users, roles and demo credentials
9. Routes and module map (all 17 modules)
10. Phased delivery plan (tasks, outputs, acceptance)
11. Required flows and where they land
12. Testing and quality gates
13. Documentation deliverables
14. Risks and mitigations
15. Definition of done and final handover

---

## 1. Goal and scope

**Build** a Next.js application that is a navigable, honest prototype of the Ayre Aviation CRM across all 17 modules (PRD 15.1). It looks exactly like the approved prototype and `DESIGN.md`. All data is local JSON and is labelled as mock everywhere it matters.

**Four layers, strictly separated** (user requirement):

| # | Layer | Role in this phase |
|---|---|---|
| 1 | **UI** | Pages, layouts, components. Renders state and sends user intent. No business rules |
| 2 | **Business logic layer (BLL)** | Rules, workflows, state machines, validation, permissions, KPI calculations, view-model shaping |
| 3 | **Backend** | An API facade with the shape of the future real API: endpoint-style handlers, DTOs, authorization, error mapping, simulated latency and failures. Mocked now |
| 4 | **Database** | JSON files that stand in for the database, behind repository interfaces |

**In scope now:** UI, BLL, mocked backend, JSON database, theme system, mock authentication for four users, all 17 modules as navigable screens, the 12 required flows (`FE-FLOW-01` to `12`), the PRD section 19 QA checklist.

**Out of scope now:** a real server, a real database, real authentication, real Avinode or Paynode calls, email or SMS sending, real payments, a customer portal, a second visible theme (the engine is built; one theme ships).

**Rules carried from AGENTS.md:** no feature, tab, heading or nav item that the PRD, specs or `DESIGN.md` do not define; mock and deferred behavior is never presented as real; everything the PRD marks `[DEFERRED-BE]`, `[UNRESOLVED]` or `[PENDING-PROVIDER]` stays visibly mock.

---

## 2. Decisions and assumptions to confirm

I will proceed with the **default** shown unless you say otherwise. Items marked **Blocks Phase 0** need an answer before scaffolding.

| # | Question | Default I will use | Blocks |
|---|---|---|---|
| D1 | Package manager and runtime | **pnpm** (installed: 10.24) on **Node 22** (installed: 22.16). Latest stable Next.js at setup, with exact versions pinned | Phase 0 |
| D2 | App location | Single Next.js app at the **repository root**; `Docs/` and `Documentation/` stay as they are. Layers are folders enforced by lint rules (section 5). Extracting a layer into its own package later stays easy | Phase 0 |
| D3 | Where the BLL lives | **Client-side, in the Next app**, between UI and backend. When the real backend arrives, its server stays authoritative and rules are not trusted from the client. Any rule that must be enforced server-side is flagged `server-authoritative` in the code | No |
| D4 | The future real backend | Open (PRD proposes ASP.NET Core; a Next.js server is also possible). The mock backend is written as endpoint-shaped handlers over typed DTOs so either can replace it | No |
| D5 | Login identifier | **Username** (you asked for usernames), not email. The prototype used email; the label and validation change | No |
| D6 | Role name "Finance Manager" | Used as the display label. PRD calls the role "Finance". Permission key stays `finance` | No |
| D7 | Persisting demo changes across reload | **In-memory plus `sessionStorage`**, labelled "simulated" (PRD 15.1 allows this). A reset happens on sign-out | No |
| D8 | Styling | **Tailwind CSS v4** driven only by semantic tokens (section 6), plus accessible primitives written in-house. No UI kit with its own colors | No |
| D9 | Charts | **Custom SVG components** (as in the prototype), no chart library. Fewer dependencies, full token control | No |
| D10 | Delivery milestones | M1 = theme + login + shell + 4 dashboards; M2 = all other modules; M3 = flows, QA, hardening. Each ends with a runnable build and a demo | No |
| D11 | Sub-pages inside a module (for example Leads, Opportunities, Pipeline) | A **page-level tab strip** using the screen lists in the specs. Tagged `[UI-SUGGESTION]` and recorded in `DESIGN.md` for supervisor review | No |
| D12 | DESIGN.md updates required by the PRD | Applied in Phase 0 (Collected Amount, disabled business-rule states, `Docs/` paths, Username login) so design and PRD agree | No |

---

## 3. Architecture: four separated layers

```
 UI  (src/app, src/features, src/ui)
  │   renders, collects input, calls hooks
  ▼
 BLL (src/bll)              rules, workflows, permissions, KPI math, view-models
  │   calls typed API client only
  ▼
 Backend (src/backend)      endpoint-style handlers, authz, DTOs, errors, latency/failure simulation
  │   calls repositories only
  ▼
 Database (src/database)    repository interfaces + JSON adapters over src/database/data/*.json
```

**Dependency rules (enforced automatically in CI):**

- UI may import BLL and `ui` primitives. UI may **not** import `backend` or `database`.
- BLL may import the API client contract and shared types. BLL may **not** import React, Next, `backend` internals or `database`.
- Backend may import `database` repositories and shared types. Backend may **not** import UI or BLL.
- Database may import nothing from the layers above.
- `src/shared` (types, DTOs, zod schemas, constants) is importable by all layers. `src/theme` is importable by UI only.
- Enforced with `dependency-cruiser` (and ESLint boundaries as a second net). A failing rule fails the build.

**The swap seam.** UI and BLL talk to the backend through one typed **API client** (`src/api-client`). In mock mode the client calls the in-process backend handlers; in a real deployment it calls HTTP endpoints. Replacing `src/backend` and `src/database` with a real server touches no UI and no BLL code. The API client is generated from or checked against the shared DTO schemas so the contract cannot drift.

**What each layer owns (examples):**

| Layer | Owns | Examples from the PRD |
|---|---|---|
| UI | Layout, tokens, a11y, states (loading, empty, error) | KPI card, table, tabs, proposal timeline component, "Operator confirmation pending" banner |
| BLL | Rules that shape what the user may do and see | Email required on a lead (MTG-03); Qualify only after checklist passes (MTG-02); expired quotes unselectable (MTG-15); proposal state machine Draft, Pending manager approval, Approved, Sent, Accepted, Rejected (MTG-16 to 19); acceptance sets trip Booked and shows pending operator confirmation (MTG-21 to 23); permission keys to capabilities; KPI definitions and delta calculation; invoiced vs collected (MTG-29) |
| Backend (mock) | The API surface and server-side checks | `GET /api/v1/dashboard/summary`, `POST /api/v1/leads`, `POST /api/v1/proposals/{id}/submit-for-approval`; role and scope filtering; Problem Details errors; simulated Avinode "connection failed"; correlation IDs |
| Database (JSON) | Records and seed data | `customers.json`, `trips.json`, `quotes.json`, `users.json` |

**Authority note.** Because there is no real server, the mock backend does the authorization filtering so the UI cannot see data outside a user's scope. The UI and the PRD both state clearly that this is **simulated and not security** (FE-FLOW-09).

---

## 4. Technology choices

| Area | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), React, TypeScript **strict** | Required by you; App Router gives layouts for the shell |
| Styling | Tailwind CSS v4 with semantic color tokens only; default Tailwind palette removed | Utility speed with one color source |
| Fonts | `next/font` self-hosting **Inter** and **Playfair Display** | Matches DESIGN.md; no runtime Google request; faster and private |
| Validation and types | **Zod** schemas for DTOs and JSON fixtures | One schema yields the TypeScript type and the runtime check; fixtures are validated at startup in dev and in tests |
| Async state | **TanStack Query** over the API client | Caching, loading and error states; mirrors a real API |
| Forms | React Hook Form with Zod resolver | Field-level errors; consistent validation |
| Icons | Hand-written SVG icon set (as the prototype) | No dependency, no filled icons, token colors via `currentColor` |
| Testing | **Vitest** + React Testing Library (unit, component), **Playwright** (end-to-end, visual, a11y with axe) | Section 12 |
| Quality | ESLint (strict), Prettier, `dependency-cruiser`, a raw-color checker script, `tsc --noEmit` | Layer and color rules enforced automatically |
| Dates and money | `date-fns-tz` (or Temporal polyfill) and integer-minor-unit or decimal helper in the BLL | DOM-01 and DOM-03: no float money, UTC plus explicit time zones |
| CI | One script `pnpm verify` runs format check, lint, layer check, color check, typecheck, unit tests, build, e2e | Same command locally and in CI |

Dependencies are justified one by one (AGENTS.md DOC-12) in `docs/adr/0002-dependencies.md`.

---

## 5. Repository structure

```
/
├─ Docs/                       PRD, DESIGN.md, AGENTS.md, prototype, this plan (existing)
├─ Documentation/              18 source specifications (existing)
├─ docs/adr/                   architecture decision records (new)
├─ public/                     login-hero.jpg, favicon
├─ scripts/                    generate-theme-css.ts, check-no-raw-colors.ts, validate-fixtures.ts
├─ src/
│  ├─ app/                     [UI] Next routes: (auth)/login, (app)/layout (shell), one folder per module
│  ├─ features/                [UI] module screens, one folder per module (customers, leads, trips, ...)
│  ├─ ui/                      [UI] design-system components (Button, Card, KpiCard, Tabs, Table, charts, shell)
│  ├─ theme/                   SINGLE SOURCE OF TRUTH for color: themes.ts, tokens.ts, ThemeProvider
│  ├─ bll/                     [BLL] per-module services, rules, state machines, permissions, kpi, view-models
│  ├─ api-client/              typed client; mock transport now, HTTP transport later
│  ├─ backend/                 [Backend] endpoint-style handlers, authz, error mapping, latency/failure simulation
│  ├─ database/                [Database] repository interfaces and JSON adapters
│  │  └─ data/                 *.json demo data (every file carries a DEMO DATA notice)
│  ├─ shared/                  DTOs, zod schemas, enums, constants, permission keys, formatting helpers
│  └─ styles/                  globals.css, theme.generated.css (generated, not hand-edited)
├─ tests/                      e2e and visual tests
├─ .dependency-cruiser.cjs     layer rules
├─ eslint.config.mjs  tailwind/postcss config  tsconfig.json  package.json
├─ AGENTS.md → points to Docs/AGENTS.md (or copied to the root so tools find it)
└─ README.md
```

---

## 6. Single source of truth for colors (theme system)

**Requirement:** every color on the platform is defined in **one place**. Changing the theme, or adding a second theme, is a color-only change that propagates everywhere.

### 6.1 Design

1. **One file defines every color value:** `src/theme/themes.ts`. It exports named themes (now: `ayre`), each an object of **semantic tokens**. No color value exists anywhere else.
2. **Tokens are semantic, not literal.** Components say `surface.card` or `status.danger.text`, never "gold" or `#FFD700`. This is what makes a theme swap safe.
3. **A generator** (`scripts/generate-theme-css.ts`, run on `predev` and `prebuild`) reads `themes.ts` and writes `src/styles/theme.generated.css`:
   - CSS variables for every token inside `:root[data-theme="<name>"] { --c-surface-card: ...; }`
   - the Tailwind v4 `@theme inline` mapping so utilities such as `bg-surface-card` and `text-status-danger` resolve to those variables.
4. **Tailwind default colors are disabled.** Only semantic utilities exist, so `bg-red-500` or `text-[#fff]` cannot be used.
5. **Runtime switching:** `ThemeProvider` sets `data-theme` on `<html>` (default from config). No flash: the attribute is set server-side. **No theme switcher UI ships** (DESIGN.md forbids unspecified UI); the engine is ready and switching is a config value or a dev query flag.
6. **Charts and SVG** use `currentColor` or `var(--c-...)` through token-named classes. No hex in SVG markup. Series colors are tokens (`chart.series.1` to `n`).
7. **Photos and scrims:** the login scrim colors are tokens too (`login.scrim`).

### 6.2 Token set (values from DESIGN.md section 2; this table is the contract for `themes.ts`)

| Group | Tokens | Initial `ayre` values |
|---|---|---|
| Brand | `brand.ink` `brand.gold` `brand.goldDeep` `brand.goldOnDark` | `#101319`, `#FFD700`, `#D9A521`, `#E8C25A` |
| Surface | `surface.canvas` `surface.card` `surface.soft` `surface.sidebar` `surface.loginHero` `surface.loginPanel` `surface.loginField` | `#FAF8F5`, `#FFFFFF`, `#F6F3EE`, `#101319`, `#000000`, `#101319`, `#1F232A` |
| Text | `text.primary` `text.secondary` `text.muted` `text.onGold` `text.onDark` `text.onDarkMuted` `text.link` | `#16181D`, `#2A2D33`, `#6B6F76`, `#0B0B0B`, `#F3F1EC`, `#D4D6DA`, `#2563EB` |
| Border | `border.default` `border.onDark` `border.focus` `border.goldOutline` | `#EFEAE2`, `#4B4847`, `#FFD700`, `#B8892D` |
| Action | `action.primary.bg` `action.primary.text` `action.primary.border` `action.primary.hoverBg` `action.primary.hoverText` | `#FFD700`, `#0B0B0B`, `#C9A400`, `#101319`, `#FFD700` |
| Nav | `nav.activeBg` `nav.activeBorder` `nav.activeText` `nav.activeIcon` `nav.hoverBg` | `rgba(217,165,33,.20)`, `#B8892D`, `#F0CC6B`, `#F0B93B`, `rgba(255,255,255,.09)` |
| Status (each with `solid`, `tint`, `text`) | `status.success` `status.warning` `status.danger` `status.info` `status.special` | `#16A34A / rgba(22,163,74,.13) / #15803D`, `#F59E0B / rgba(245,158,11,.17) / #B45309`, `#EF4444 / rgba(239,68,68,.12) / #DC2626`, `#2563EB / rgba(37,99,235,.12) / #1D4ED8`, `#7C3AED / rgba(124,58,237,.12) / #6D28D9` |
| Chart | `chart.current` `chart.prior` `chart.grid` `chart.axis` `chart.area` `chart.series.1..n` | `#D9A521`, `#B7B9BD`, `#EFEAE2`, `#6B6F76`, goldDeep at 28% to 2%, plus the status and funnel colors |
| Avatar | `avatar.1..5` | `#3B82F6 #7C3AED #6366F1 #0D9488 #D97706` |
| Tripstatus | `tripStatus.draft/sourcing/quoting/confirmed/completed/cancelled` | per DESIGN.md 2.4 |

(Exact list is finalized from the prototype in Phase 1; any color found in the prototype that is not in this table becomes a named token, never a literal.)

### 6.3 Enforcement (so it stays a single source)

| Check | Tool | Fails the build when |
|---|---|---|
| No raw colors outside `src/theme/` | ESLint `no-restricted-syntax` for hex, `rgb(`, `hsl(` string literals; Stylelint `color-no-hex`; `scripts/check-no-raw-colors.ts` scanning `.ts`, `.tsx`, `.css`, `.svg`, `.json` | any literal found outside the theme folder |
| No default Tailwind palette or arbitrary color values | Tailwind config and ESLint class rule | `bg-red-500`, `text-[#abc]` appears |
| Theme completeness | Vitest | any theme lacks a token another theme has |
| Contrast | Vitest (WCAG calculator on declared text/surface pairs) | a declared pair is below 4.5:1 (3:1 for large text and UI) |
| Propagation proof | Playwright: load app with a **test-only** second theme and assert computed colors change on the shell, a card, a chip and a chart | any surface keeps the old color |

**Acceptance:** replacing every value in `themes.ts` (using the test theme) changes the whole platform with no other file edited.

---

## 7. Mock database (JSON) and the "this is mocked" rule

### 7.1 The rule

- Every JSON file starts with a metadata block:
  `"_meta": { "demo": true, "dataNotice": "DEMO DATA - Local JSON only; no live Avinode or Paynode connection", "schemaVersion": 1 }`
- The UI shows a persistent, unobtrusive **`DEMO DATA`** marker in the page header status line on every page, plus `MOCK MODE` and `NOT CONNECTED` on integration areas, and `MOCK AVINODE DATA` on mock operator quotes (PRD 15.1 and FE-FLOW-06).
- The README, the login screen footer and `src/database/data/README.md` state that all data is fictional and mocked.
- No real names, emails, phones, passports, tokens or company data. Fictional cast only: customer **Ahmed**, broker **Ali**, manager **Sara**, operator **SkyJet** (PRD 17), plus a small fictional supporting cast.

### 7.2 Files (each validated by a zod schema at load in dev and in tests)

`users.json` (auth plus profiles), `roles.json` (roles and permission keys), `customers.json`, `contacts.json`, `leads.json`, `opportunities.json`, `pipeline-stages.json`, `trips.json` (with segments), `sourcing.json`, `rfqs.json`, `operator-quotes.json`, `proposals.json`, `bookings.json`, `operators.json`, `messages-operator.json`, `messages-customer.json`, `invoices.json`, `payments.json`, `trip-finance.json`, `commission-plans.json`, `commissions.json`, `tasks.json`, `automations.json`, `notifications.json`, `activity.json`, `integrations.json` (Avinode and Paynode states, webhook log), `audit.json`, `reports.json` (pre-computed series), `dashboard.json` (KPI seeds per role).

The seed follows the PRD section 17 fixture and adds enough rows for realistic lists, filters, empty states and error states (including one expired quote, one overdue invoice, one stale RFQ, one failed Avinode connection scenario).

### 7.3 Repositories

`src/database` exposes interfaces (`CustomerRepository`, `TripRepository`, ...) with JSON implementations that load the files into an in-memory store, support list, filter, sort, paginate and update, and write back to `sessionStorage` only (D7). Swapping in a real database means a new implementation of the same interfaces.

---

## 8. Users, roles and demo credentials

### 8.1 The four users

| Display role | Permission key | Demo person | Username (proposed) | Scope |
|---|---|---|---|---|
| Executive | `executive` | Executive Demo (PRD cast) | `executive` | Whole company, read-mostly, finance figures only as permitted |
| Sales Manager | `sales_manager` | Sara | `sales.manager` | Own team, approvals, operator Preferred or Blocked |
| Broker | `broker` | Ali | `broker` | Own work only |
| Finance Manager | `finance` | Fictional finance lead | `finance.manager` | Payments, receivables, payables, reconciliation, commission approvals |

Each user also has a team, a display name, an initials avatar and a landing page name (Executive Dashboard, Team Dashboard, My Workspace, Finance Dashboard).

### 8.2 How sign-in works (mock)

- `users.json` holds username, demo password and profile. The mock backend `POST /api/v1/auth/login` checks the pair and returns a session token and the user's permission keys.
- Wrong pair returns a Problem Details error and the UI shows "That username and password don't match. Try again." Empty fields show field-level errors.
- The session is kept in `sessionStorage`; a route guard redirects unauthenticated users to `/login`. Sign-out clears it and resets demo state.
- The sign-in screen footer reads: "Demo environment. All data is mocked. Avinode and Paynode are not connected."

### 8.3 Security honesty

Credentials in a client-bundled JSON are **readable by anyone** who opens the app. They are demo-only, must never be reused anywhere, and are removed when real authentication exists. The UI never claims this is secure authentication. Passwords are generated as strong random values (not guessable) and recorded only in the mock JSON.

### 8.4 Delivery of credentials

**At the end of the build** I give you a table of the four usernames and their passwords. I will not put them in this plan; they are generated when `users.json` is created.

---

## 9. Routes and module map (all 17 modules)

Navigation is the 14 items from `DESIGN.md` section 9. Sub-pages use a page-level tab strip (D11). Templates A to D are the page templates in `DESIGN.md` section 11.

| Nav item | Module(s) | Routes | Template | Key screens and PRD hooks |
|---|---|---|---|---|
| (auth) | 17 | `/login` | custom | Photo login, validation states, demo notice |
| Dashboard | 01 | `/dashboard` | custom | Four role dashboards; Invoiced and Collected Amount (MTG-29); drill-downs; tooltips |
| Customers | 02 | `/customers`, `/customers/new`, `/customers/[id]` | A, C, B | Directory, profile tabs, mock customer picker, duplicate review shown as **demo only** (MTG-04), CSV import mock |
| Leads & Opportunities | 03 | `/sales/leads`, `/sales/leads/new`, `/sales/leads/[id]`, `/sales/opportunities`, `/sales/opportunities/[id]`, `/sales/pipeline`, `/sales/analytics` | A, C, B, D | Lead form (email required, itinerary optional), Qualify action, convert to opportunity, Kanban (FE-FLOW-01) |
| Charter Trips | 04, 05 | `/trips`, `/trips/new`, `/trips/[id]`, `/trips/sourcing` | A, C, B | `+ Add Segment`, Trip Details tabs (proposed map), change or cancel warning, sourcing tab and worklist, Avinode connection failure state (FE-FLOW-02 to 05) |
| RFQs & Quotes | 06, 07 | `/rfqs`, `/rfqs/[id]`, `/quotes`, `/proposals`, `/proposals/[id]`, `/proposals/new` | A, B, C | RFQ list, all operator quotes, expired badge and disabled Select Quote, proposal builder, manager approval queue, read-only sent proposals, revisions (FE-FLOW-06 and 07) |
| Bookings | 08 | `/bookings`, `/bookings/[id]` | A, B | Acceptance sets Booked, pending operator confirmation message, operations checklist, role-scoped documents (FE-FLOW-08, 09) |
| Operators | 09 | `/operators`, `/operators/[id]` | A, B | Profile, compliance expiry, performance, manager-only Preferred or Blocked (MTG-20) |
| Communications | 10 | `/communications` | tabs | Operator Messages, Customer Messages, Templates (MTG-26, FE-FLOW-10) |
| Finance & Payments | 11, 12 | `/finance` | tabs | Payments overview, customer payments, operator payments, invoices, reconciliation, trip finance, profitability, expenses, adjustments; invoice and deposit step after acceptance (FE-FLOW-11) |
| Broker Commissions | 13 | `/commissions` | tabs | Plans, trip commission, payout queue, statement; clearly illustrative (MTG-30) |
| Tasks & Follow-ups | 14 | `/tasks`, `/tasks/[id]` | A, B | My tasks, team queue, follow-up calendar |
| Automation | 15 | `/automation` | tabs | Rules, execution history, AI assistant, notification center; all simulated and labelled |
| Reports & Analytics | 16 | `/reports` | D | Overview, sales and pipeline, charter performance, finance (invoiced vs collected), exports |
| Administration | 17 | `/admin` | tabs | Users and roles, Avinode connection, Paynode configuration, webhook monitoring, audit and settings; all `NOT CONNECTED` or mock |

Role visibility per nav item and per tab follows `DESIGN.md` sections 8 and 9 and is encoded once in the BLL permission map.

---

## 10. Phased delivery plan

Effort: S (hours), M (about a day), L (several days), XL (a week or more). Every phase ends with `pnpm verify` green, a self-review (AGENTS.md section 13) and a short report.

### Phase 0: Foundations and documentation alignment (M)

**Tasks**

1. Scaffold Next.js (App Router, TypeScript strict) with pnpm; pin versions; add `.nvmrc`, `.editorconfig`, `.gitignore`, `.env.example`.
2. Add ESLint, Prettier, Vitest, RTL, Playwright (+ axe), Zod, TanStack Query, React Hook Form, `date-fns-tz`.
3. Create the folder skeleton from section 5 with a README in each layer folder stating its rules.
4. Configure `dependency-cruiser` layer rules and wire `pnpm verify`.
5. Update `Docs/DESIGN.md` for the PRD overrides (Collected Amount, disabled business-rule states, `Docs/` paths, Username login, sub-page tab strips tagged `[UI-SUGGESTION]`). Keep AGENTS.md path references correct; copy or link it to the repo root.
6. Write ADRs: 0001 layering, 0002 dependencies, 0003 theme single source, 0004 mock data and auth.

**Acceptance:** empty app builds; `pnpm verify` passes; a deliberate layer violation (UI importing `database`) fails the check; docs agree with the PRD.

### Phase 1: Theme system, the single source of truth (M)

**Tasks**

1. Extract every color from the prototype and DESIGN.md into the token set (section 6.2).
2. Implement `themes.ts`, `tokens.ts`, the generator, `theme.generated.css`, Tailwind v4 `@theme` mapping and `ThemeProvider` (SSR `data-theme`).
3. Disable the default Tailwind palette; add ESLint, Stylelint and script checks (section 6.3).
4. Fonts via `next/font` (Inter 400 to 700, Playfair Display 500 to 700).
5. Tests: completeness, contrast, no-raw-color, and the Playwright propagation test with a test-only theme.

**Acceptance:** one file holds all colors; swapping the test theme recolors a sample page fully; the raw-color check fails if a hex is added anywhere else.

### Phase 2: Design-system components and app shell (L)

**Tasks**

1. Build in `src/ui`: Button (primary, secondary, link, icon), Card, KpiCard (sparkline, segmented, day-bars variants), Tabs, Chip, Table, Select and Filters row, ListItem, Checkbox, Avatar, Toast, Banner (`DemoBanner`), EmptyState, ErrorState, Skeleton, PageHeader with status line, Breadcrumb, Icon set.
2. Charts: LineAreaChart (markers, prior dashed), GroupedBars, FunnelBars, SegmentedBar, AgeingBars, DayBars, Sparkline. Each with an `aria-label` summary.
3. Shell: Sidebar (expanded and collapsed, role-filtered items, no picture), Topbar (search, bell, user pill), responsive behavior from `DESIGN.md` 4.4.
4. Component tests (render, a11y, keyboard) and visual snapshots at desktop and 900px.

**Acceptance:** side-by-side with the prototype the shell, cards, chips and charts match; zero raw colors; axe shows no violations on the component pages.

### Phase 3: Database, backend and BLL core (L)

**Tasks**

1. Define zod schemas and DTOs in `src/shared`.
2. Create the JSON files with the `_meta` notice and seed data (section 7.2); validate on load.
3. Implement repositories and the in-memory store with `sessionStorage` persistence.
4. Implement mock backend handlers: auth, dashboard summary and series, current user and permissions; common middleware: authorization by permission keys and scope, Problem Details errors, correlation IDs, configurable latency, injectable failure (for the Avinode "connection failed" case).
5. Implement the API client and TanStack Query hooks.
6. BLL core: permission map to capabilities, KPI definitions (with tooltip text), delta and currency formatting (decimal-safe), trip-status grouping config (flagged `[UNRESOLVED]`), demo-state reset.

**Acceptance:** unit tests for rules and calculations; handler tests prove a broker cannot read another team's records; fixtures validate; layer checks pass.

### Phase 4: Authentication and role-based shell (M)

**Tasks**

1. Add `users.json` with four users and generated demo passwords; login handler; session; route guard; sign-out.
2. Build `/login` from the prototype: photo hero, Playfair title, form, all states (empty, invalid, wrong credentials, loading). Footer notice that data is mocked.
3. Wire role-filtered sidebar and top bar user pill; landing page per role.
4. Remove the prototype's floating "Preview as" bar (not shipped).

**Acceptance:** each of the four users can sign in and sees only their menu; wrong password shows the defined error; unauthenticated access redirects to `/login`.

### Phase 5: The four dashboards (L)

**Tasks**

1. Port the Executive, Sales Manager, Broker and Finance dashboards from the prototype into `features/dashboard` using the Phase 2 components.
2. Data from the mock backend only; every KPI has a definition tooltip and a drill-down link to its owning module with identical filters (routes may initially be the module list pages from Phase 6).
3. Add the **Collected Amount** card next to **Invoiced Amount** (MTG-29); keep currency labels and `DEMO DATA`.
4. Filters row per role; Export button only where allowed (shows the audited-export toast).
5. Loading, empty, error and partial-sync states; "Sync delayed" example.

**Acceptance:** visual match with the prototype at 1920, 1440 and 1280 wide; KPI rows even (4+4, 3+3, 3+2); a Sales Manager never sees revenue or receivables; Playwright run for all four logins.

### Phase 6: Module screens, in dependency order (XL, split into sub-milestones)

Build order follows spec 00 section 15, adapted for the demo story. Each module delivers its screens using Templates A to D, its mock data, its BLL rules and its tests, plus a module README with a traceability table.

| Sub-milestone | Modules | Screens delivered |
|---|---|---|
| 6A Admin and customers | 17, 02 | Admin tabs (mock integration states), customer directory, create, profile tabs, duplicate review (demo), import (mock) |
| 6B Sales | 03 | Leads list, lead form, lead detail, Qualify, opportunities, pipeline Kanban, analytics |
| 6C Trips and sourcing | 04, 05 | Trips list, create with `+ Add Segment`, Trip Details tabs, change or cancel warning, sourcing tab and worklist, connection-failure state |
| 6D RFQs, quotes, proposals | 06, 07, 09 | RFQ list and detail, response inbox, quote inbox and comparison, proposal builder, approval queue, revisions, operator directory and profile |
| 6E Bookings and communications | 08, 10 | Bookings list and detail, acceptance flow, operations checklist, documents, split message tabs, templates |
| 6F Money | 11, 12, 13 | Invoices, payments, reconciliation, trip finance, profitability, commission screens (illustrative) |
| 6G Work management and insight | 14, 15, 16 | Tasks and calendar, automation (simulated), reports and exports |

**Acceptance (per sub-milestone):** every screen listed exists, uses only mapped fields, handles loading, empty and error states, respects role visibility, and carries the correct mock labels; unit and e2e tests pass; module README and traceability table complete.

### Phase 7: End-to-end flows (L)

Implement and script `FE-FLOW-01` to `FE-FLOW-12` as Playwright journeys (section 11), using the PRD 16.1 button matrix to assert what each action does and what the UI never claims.

**Acceptance:** all 12 flows pass in CI; the demo story (Ahmed, Ali, Sara, SkyJet) runs from enquiry to separate invoiced and collected views without a broken link.

### Phase 8: Hardening, QA and handover (M)

**Tasks**

1. Run the PRD section 19 checklist item by item and record evidence.
2. Accessibility audit (axe plus keyboard walkthrough), responsive review down to 900px and a phone layout, performance pass (route code-splitting, lazy charts).
3. Self-review per AGENTS.md section 13: remove unused code, files, dependencies and debug output; re-run all gates.
4. Finalize README, module READMEs, ADRs, CHANGELOG, `src/database/data/README.md`.
5. Produce the report and the **credentials table**.

**Acceptance:** `pnpm verify` green; PRD section 19 fully checked; no raw colors; no layer violations; credentials delivered.

---

## 11. Required flows and where they land

| Flow | Summary | Phase |
|---|---|---|
| FE-FLOW-01 | New lead (email required, no itinerary needed) then Qualify then Opportunity | 6B, 7 |
| FE-FLOW-02 | Multiple trip segments with `+ Add Segment` | 6C, 7 |
| FE-FLOW-03 | Change or cancel after an RFQ: warning only, no fabricated fee | 6C, 7 |
| FE-FLOW-04 | Trip Details tabs (proposed map recorded for review) | 6C, 7 |
| FE-FLOW-05 | Avinode boundary and connection failure UI, no fake results or links | 6C, 7 |
| FE-FLOW-06 | RFQ and quote list with expired quote visible and unselectable | 6D, 7 |
| FE-FLOW-07 | Proposal approval by manager, read-only when sent, revision as new proposal | 6D, 7 |
| FE-FLOW-08 | Acceptance sets CRM Booked and shows pending operator confirmation (1 to 2 business days wording) | 6E, 7 |
| FE-FLOW-09 | Role-based surfaces and document scoping, manager-only Preferred or Blocked | 5, 6D, 6E, 7 |
| FE-FLOW-10 | Operator Messages and Customer Messages in separate tabs | 6E, 7 |
| FE-FLOW-11 | Invoice and deposit step after acceptance; $55,000 invoiced vs $20,000 collected | 5, 6F, 7 |
| FE-FLOW-12 | Deferred logic stays labelled mock (dedupe, commissions, reminders, penalties, providers) | all, checked in 8 |

---

## 12. Testing and quality gates

| Level | Tooling | What it covers |
|---|---|---|
| Unit | Vitest | BLL rules, state machines (proposal, lead, trip, quote), KPI math, money and time helpers, permission map, theme completeness and contrast |
| Contract | Vitest + Zod | Every JSON file matches its schema; every handler returns its DTO; API client matches DTOs |
| Component | RTL + axe | UI components: states, keyboard, a11y |
| Authorization (simulated) | Vitest | For every handler: allowed role, denied role, other team's record |
| End to end | Playwright | The 12 flows, four-role login, route guards, responsive checkpoints |
| Visual | Playwright snapshots | Login and the four dashboards at 1920, 1440, 1280, 900 |
| Static | ESLint, Prettier, `tsc`, dependency-cruiser, raw-color check | Layers, colors, types, style |

Mandatory test classes from AGENTS.md section 12 apply (permission, concurrency where simulated, time zone and date boundary for trip legs, money rounding, illegal state transitions, pagination and filters). Every test that proves a PRD item names its ID (`MTG-15`, `FE-FLOW-06`, `AC-02`).

Gate command: `pnpm verify` (format check, lint, layers, colors, typecheck, unit and component tests, build, e2e).

---

## 13. Documentation deliverables

- Root `README.md`: what this is (a **mocked frontend prototype**), prerequisites, setup, run, test, build, structure, how to swap in a real backend, how to change the theme.
- `README.md` in each layer folder and each module folder with its PRD traceability table.
- `docs/adr/` 0001 to 0004 and any later decisions.
- `src/database/data/README.md`: file list, the fictional cast, the DEMO DATA rule.
- `docs/theming.md`: how to add or edit a theme in `themes.ts` (the only place).
- `CHANGELOG.md`.

---

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| PRD gaps (unresolved decisions) tempt invented behavior | Wrong features, rework | Label `[UI-SUGGESTION]`, list in each report, never make them mandatory (AGENTS.md PRD-09, PRD-10) |
| Scope size: 17 modules plus 12 flows | Delay | Milestones M1 to M3; modules built from shared templates and components; sub-milestones 6A to 6G each demoable |
| Layer rules erode over time | Tangled code | `dependency-cruiser` in CI and a deliberate-violation test |
| Colors leak into components | Theme change is not one place | Lint, Stylelint, script check, propagation e2e test |
| Mock rules mistaken for real enforcement | Misleading the supervisor or client | `DEMO DATA` and `MOCK MODE` labels, clear copy, PRD wording for every simulated action |
| Credentials in a bundled JSON | Misuse | Demo-only, strong random values, never reused, removed with real auth; stated in README and login footer |
| BLL duplicates logic the real backend must own | Drift later | Mark server-authoritative rules in code; contract tests; ADR 0001 explains the future split |
| Fonts and assets need network | Visual drift offline | `next/font` self-hosting; images in `public/` |
| Large JSON fixtures slow startup | Slow dev | Lazy-load per module; schema validation only in dev and tests |

---

## 15. Definition of done and final handover

Done means everything in `AGENTS.md` section 19, plus:

- [ ] The app runs with `pnpm dev` and builds with `pnpm build`.
- [ ] Four layers exist as folders with enforced dependency rules; no violation.
- [ ] **All colors live only in `src/theme/themes.ts`**; the propagation test passes.
- [ ] All 17 modules are navigable; role visibility matches `DESIGN.md`.
- [ ] All data is JSON, validated, and labelled as mocked everywhere required.
- [ ] The 12 flows pass; PRD section 19 checklist complete.
- [ ] Docs and ADRs written; unused code and dependencies removed.
- [ ] **Credentials for the four users delivered to you** (Executive, Sales Manager, Broker, Finance Manager) in the final report.
