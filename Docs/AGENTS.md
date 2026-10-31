# AGENTS.md: rulebook for AI agents and developers

Project: **Ayre Aviation CRM** (charter-broker CRM). This file tells any AI coding agent, and any human developer, how to work in this repository. Read it fully before doing anything. Follow it exactly.

File map (all paths relative to the repository root)

| File | Purpose |
|---|---|
| `Docs/Ayre_Aviation_Broker_CRM_PRD_Frontend_Meeting_Updated.md` | **The PRD.** Sections 1 to 13 are the original requirements baseline (unchanged). Sections 14 to 20 are the frontend-meeting addendum (30 decisions, 12 required flows, button matrix, demo fixtures, reconciliation, QA checklist, AI instructions) |
| `Docs/DESIGN.md` | Design system: colors, type, layout, shell, components, navigation, page templates, anti-clutter rules |
| `Docs/ayre-crm-login-and-dashboard.html` | Approved visual prototype of the login and the four-role dashboard (reference only; not production code) |
| `Docs/login-hero.jpg` | Login photo (login screen only) |
| `Documentation/Ayre_Aviation_00_*.docx` to `_17_*.docx` | The 18 source specifications the PRD consolidates |
| `Docs/AGENTS.md` (this file) | How to work |

How to read this file

- Keywords follow RFC 2119: **MUST**, **MUST NOT**, **SHOULD**, **MAY**.
- Every rule has an ID (for example `SEC-04`). Cite IDs in reviews and reports.
- If two rules conflict, the higher item in the precedence list (section 1) wins. If still unclear, **stop and ask**. Do not guess.

---

## 0. Quick start (the 10 rules that matter most)

1. **The PRD is the contract.** Build exactly what it says, including the meeting addendum (PRD sections 14 to 20). Nothing more, nothing less (sections 1A and 2).
2. **Design follows `Docs/DESIGN.md`.** No extra tabs, headings, menu items or colors. Where the PRD overrides it, the PRD wins (section 1A.4).
3. **Current phase = navigable frontend prototype on local JSON mocks.** Never claim a backend, integration or payment works when it is mocked (section 1A). Code is still scalable, secure, documented and production-quality.
4. **Review your own work** before declaring it done, then **remove everything no longer needed** (section 13).
5. **Never invent.** No made-up requirements, fields, endpoints, IDs, links or data. Ask.
6. **Secrets never touch the browser, logs, source code or git.**
7. **Authorization is enforced on the server, on every request, per record.**
8. **Money is decimal plus currency. Time is UTC plus an explicit time zone.**
9. **Small, reversible changes.** Do not touch unrelated files. Do not commit or push unless asked.
10. **Be honest in reports.** If tests fail or something was skipped, say so.

---

## 1. Sources of truth and precedence

Highest wins:

| # | Source | Location | Governs |
|---|---|---|---|
| 1 | Direct instruction from the user in the current conversation | chat | Everything, subject to safety rules |
| 2 | **PRD** | `Docs/Ayre_Aviation_Broker_CRM_PRD_Frontend_Meeting_Updated.md` | What to build, scope, acceptance criteria. Inside the PRD, sections 14 to 20 supplement sections 1 to 13 **for the frontend prototype only**; section 18 says how to reconcile them |
| 3 | Functional specifications (18 `.docx`) | `Documentation/Ayre_Aviation_00_*.docx` to `_17_*.docx` | Module behavior, fields, rules, APIs, acceptance tests (the PRD consolidates them) |
| 4 | Design system | `Docs/DESIGN.md` and prototype `Docs/ayre-crm-login-and-dashboard.html` | All UI, layout, color, copy, navigation |
| 5 | This file | `AGENTS.md` | How to work: quality, security, process |

Rules:

- **SRC-01** The agent MUST read the PRD before starting any task and again before declaring it done.
- **SRC-02** If the PRD is missing, outdated or silent, the agent MUST ask. It MUST NOT fill the gap by assumption.
- **SRC-03** If the PRD contradicts a specification, the PRD wins, and the agent MUST flag the contradiction in its report.
- **SRC-04** Code, comments and commits MUST NOT claim a capability the PRD does not define.
- **SRC-05** Never use outside memory about "how CRMs usually work" to add behavior. Only what is written counts.
- **SRC-06** The PRD says the meeting notes are **not signed-off production policy**. Implement meeting decisions as frontend demonstrations only (section 1A).
- **SRC-07** Do not edit the PRD text. If a reconciled PRD is wanted, the user will ask for it.

---

## 1A. Current delivery phase and PRD decision labels (read this before coding)

### 1A.1 What is being built now

- **Phase:** a **navigable frontend prototype across all 17 modules**, using **local JSON fixtures and mock service adapters** (PRD 15.1). Backend, database, and real Avinode and Paynode integrations come later.
- **Nothing is removed.** The meeting decisions add to the 17-module screen inventory; they do not drop any module (PRD 15.1).
- **Honesty is a requirement.** Every mocked area shows `DEMO DATA`, `MOCK MODE` or `NOT CONNECTED` where it applies. Simulated actions update in-memory demo state and show a confirmation. Reload persistence is optional and, if added, is labelled simulated (PRD 15.1).
- **Frontend code is still production-quality.** The prototype is structured so a real API can replace the mocks without rewriting screens (rules FE-15 to FE-18).

### 1A.2 PRD decision labels (use them in code comments, tests and reports)

| Label | Meaning for the agent |
|---|---|
| `[MEETING-AGREED-FE]` | Implement its frontend demonstration or UI treatment now. Not evidence of production sign-off |
| `[MEETING-DIRECTION]` | Agreed direction; field list, wording or thresholds still open. Build the direction and mark details `[UI-SUGGESTION]` |
| `[DEFERRED-BE]` | Backend or business logic not decided. Keep a placeholder or demo state only; do not manufacture behavior |
| `[PENDING-PROVIDER]` | Avinode or Paynode legality, documentation or access not verified. Do not build it as real |
| `[UNRESOLVED]` | The meeting did not answer. Do not describe it as settled; leave an explicit product-decision note |
| `[SPEC-BASELINE]` | The original PRD sections 1 to 13 stay authoritative |
| `[UI-SUGGESTION]` | Illustrative control or wording, not approved. Must not silently become mandatory |

Source labels used in PRD sections 1 to 13: `[Spec]`, `[Proposed]`, `[Conditional / Unverified]`, `[Needs decision]`, `[Interpretation]`.

### 1A.3 The 30 meeting decisions (MTG-01 to MTG-30) in one view

Cite these IDs in code comments, tests, commits and reports. Full text: PRD 14.2.

| IDs | Frontend rule (status) |
|---|---|
| MTG-01, 02, 03 | A lead can be created without a full itinerary. **Email is required** in the lead form. **Qualify is a separate action** that checks flight details. The exact checklist is unresolved, so label any checklist "proposed" (AGREED-FE, UNRESOLVED) |
| MTG-04 | Duplicate detection and merge are **deferred**. A mock customer picker may exist but is visibly demo (DEFERRED-BE) |
| MTG-05, 06 | Trip **segments** use a repeater with **+ Add Segment**, order preserved. Lead-to-trip copying and schema are not decided (AGREED-FE, DIRECTION) |
| MTG-07, 08 | After an RFQ, a date change or cancel shows a warning: "Operator change/cancellation charges may apply". **No amount, no auto-fee, no fake Avinode update** (DIRECTION, DEFERRED-BE) |
| MTG-09 | Trip Details uses **multiple tabs**. Final tab names are unresolved, so record the chosen map as "proposed" for supervisor review (AGREED-FE, UNRESOLVED) |
| MTG-10, 11 | No live in-CRM aircraft search. Show approved-link handoff or a mock disconnected state. Show a clear **connection failure** state with a labelled mock retry (PENDING-PROVIDER, AGREED-FE) |
| MTG-12 | RFQ reminder timing is deferred. Show awaiting or overdue demo states without inventing intervals (DEFERRED-BE) |
| MTG-13, 14, 15 | Show **all** operator quotes. Keep **expired** quotes in history with an Expired badge. **Disable Select Quote** on expired rows, with a reason (AGREED-FE) |
| MTG-16, 17, 18, 19 | Proposals need **manager approval** before sending. The broker submits; the manager approves or rejects. A **sent proposal is read-only**. A revision is a **new linked proposal** (AGREED-FE) |
| MTG-20 | Only the **manager** can mark an operator Preferred or Blocked. Brokers see it read-only (AGREED-FE) |
| MTG-21, 22, 23 | Customer acceptance sets the trip to **Booked in the CRM flow**, but the UI must say operator confirmation is **pending** and may take **1 to 2 business days or the operator's timeframe**. Never promise instant confirmation (AGREED-FE) |
| MTG-24, 25 | Role dashboards: executive = broad overview, manager = team, broker = limited. Booking documents are scoped by role; the client sees only relevant flight and price information. **No customer portal** (DIRECTION, UNRESOLVED) |
| MTG-26 | Communications has separate **Operator Messages** and **Customer Messages** tabs, never one merged inbox (AGREED-FE) |
| MTG-27, 28 | The invoice and deposit step begins at customer acceptance (simulated). Partial payment and refund are deferred (AGREED-FE, DEFERRED-BE) |
| MTG-29 | The dashboard shows **both Invoiced Amount and Collected Amount**, each with currency, as separate figures (AGREED-FE) |
| MTG-30 | Commissions, automated follow-ups, duplicate-trip prevention and similar backend logic are deferred. Keep non-functional placeholders (DEFERRED-BE) |

### 1A.4 Where the PRD overrides `Docs/DESIGN.md` (the PRD wins)

| Topic | DESIGN.md says | PRD says, so do this |
|---|---|---|
| Disabled controls | "Hide, do not disable" | Hide what a **role** cannot use. But **business-rule states are shown disabled with a reason**: Select Quote on an expired quote (MTG-15), deferred or mock actions (PRD 15.1), and manager-only actions viewed read-only by brokers (FE-FLOW-09) |
| Revenue KPI | One "Invoiced Revenue" card | Dashboard and finance reports show **Invoiced Amount and Collected Amount** as two distinct figures (MTG-29). Add the Collected figure; never merge them |
| Mock honesty | "Demo data" label | Use the PRD wording: `DEMO DATA`, `MOCK MODE`, `NOT CONNECTED`, and `MOCK AVINODE DATA` when rendering mock Avinode quotes |
| Trip tabs | Spec 00 list of 10 | Still `[UNRESOLVED]`. Keep the DESIGN.md list as a **clearly proposed** arrangement and record it for supervisor review |
| Trip status chart | Six buckets | The mapping is `[UNRESOLVED]`. Do not equate "Customer Accepted" with "Confirmed" for a production confirmed-bookings KPI |
| Roles | Executive, Sales Manager, Broker, Finance | The PRD fixture and flows use Broker (Ali), Sales Manager (Sara) and Executive. Finance exists in PRD 3.2. Keep all four. Use "Sales Manager" (PRD conflict C1 notes "Broker manager" naming) |
| Access phrases | "Executive sees everything" | Must **not** grant blanket sensitive identity or finance access (FE-FLOW-09) |

### 1A.5 The demo story (keep fixtures consistent)

Customer **Ahmed**, broker **Ali**, manager **Sara**, fictional operator **SkyJet**, trip `TRP-1001`, route DXB to LHR then LHR to LBG. The story: enquiry, qualification, trip, Avinode handoff (mock, not connected), RFQ with two quotes (one valid, one expired), manager-approved proposal ($55,000), acceptance, CRM Booked with pending operator confirmation, invoice and deposit mock ($55,000 invoiced, $20,000 collected), separate invoiced and collected views. Use the JSON in PRD section 17 as the starting fixture. Its demo-only field names (`selectable`, `editable`, `managerApproval`, `crmFlow`, `operatorFinalConfirmation`, `flightDetailsConfirmedForDemo`, `operatorConfirmationText`) are **not** backend names.

### 1A.6 Required flows and QA

- The 12 flows in PRD 15.2 (`FE-FLOW-01` to `FE-FLOW-12`) are acceptance scenarios. Each needs an automated or scripted test that names its ID.
- The button and action matrix in PRD 16.1 defines what each action does and what it must **never claim**. Follow it exactly.
- The sign-off checklist in PRD section 19 must pass before handing the prototype over. Reference its items in the final report.
- Follow the PRD's instructions for AI assistants (PRD section 20): read sections 1 to 13 **and** 14 to 19, do not summarize away Modules 07 to 17, implement approved frontend decisions first, label assumptions, and never treat meeting notes as signed-off production policy.

---

## 2. PRD adherence protocol

- **PRD-01 Trace every change.** Each task starts by listing the PRD (or spec) requirement IDs it implements: legacy IDs (`CUS-004`, `LEAD-006`, `TRP-08`, `RFQ-03`, `FR-07-02`, `AC-01`), meeting decisions (`MTG-15`) and flows (`FE-FLOW-06`). The same IDs go in the commit message and the pull request.
- **PRD-02 No scope creep.** Do not add features, screens, endpoints, columns, filters, settings, flags or "nice to haves" that the PRD does not list.
- **PRD-03 No scope shrink.** Do not silently drop a requirement. If something cannot be done, say which requirement and why.
- **PRD-04 Acceptance criteria are tests.** Every acceptance criterion in the PRD or spec MUST map to at least one automated test (section 12).
- **PRD-05 Unknowns are questions.** Open decisions listed in the specs (for example revenue basis, trip status taxonomy) MUST be asked, not decided. Use the default in section 3 only until the PRD says otherwise, and mark it clearly in code with a link to the decision.
- **PRD-06 Keep a traceability table** in each module README: requirement ID, file or endpoint, test name.
- **PRD-07 Read the whole PRD.** Sections 1 to 13 and 14 to 20, every task. The PRD is long; use its section index to find the part that governs the task, then re-check section 18 (reconciliation) and the labels in 1A.2.
- **PRD-08 Never upgrade a label.** A `[DEFERRED-BE]`, `[UNRESOLVED]` or `[PENDING-PROVIDER]` item is not made real by building its UI. The UI says so.
- **PRD-09 Tag your own choices.** Any detail the PRD does not specify is tagged `[UI-SUGGESTION]` in a code comment and listed in the report. It must not be treated as a confirmed requirement or made mandatory.
- **PRD-10 Open decisions stay open.** The not-finalized list (PRD 14.3: lead qualification checklist, lead-to-trip copying, tab names, status mapping, role and field visibility, operator confirmation process, penalties, proposal pricing, Avinode rights, payment details, commissions and follow-ups) is never decided silently.

---

## 3. Project context (what the agent must know)

**Product.** A broker CRM that owns customer, pipeline, trip, proposal, booking, finance and commission data. **Avinode** (aircraft marketplace) and **Paynode** (optional payments) are external systems. The CRM is never "just a front for Avinode".

**17 modules** (IDs fixed forever): 01 Executive Dashboard and Workspace, 02 Customers and Contacts, 03 Leads, Opportunities and Pipeline, 04 Charter Trips, 05 Aircraft Sourcing, 06 RFQ Management, 07 Quotations and Customer Proposals, 08 Booking Management, 09 Operator Management, 10 Communications and Activity History, 11 Payments and Invoices, 12 Finance and Trip Profitability, 13 Broker Commissions, 14 Tasks and Follow-ups, 15 Workflow Automation and AI, 16 Reports and Analytics, 17 Administration and Integrations.

**System of record.**

| Data | Owner |
|---|---|
| Customers, opportunities, assignments, proposals, bookings, commissions, roles, audit | The CRM |
| Avinode trip ID, RFQs, seller quotes, marketplace messages | Avinode (cached read-only copies in the CRM, clearly timestamped) |
| Payment transaction and settlement state | Payment provider (the CRM keeps a reconciled view) |

**Architecture direction (from the specs).** Modular monolith, separated by feature domain, with stable APIs and event contracts. No microservices early. Proposed stack: ASP.NET Core Web API, SQL Server or PostgreSQL, a background job processor, a secrets vault, React/Next.js or Blazor. **The stack choice is an open decision**: the agent MUST follow what the PRD states and MUST ask if it is not decided. Do not pick a framework alone.

**Hard external constraints (non-negotiable).**

- **EXT-01** Avinode buyer path: `POST /trips` (with `externalTripId`), then open the returned `searchInAvinode` deep link. Aircraft results and RFQs live in the Avinode web UI.
- **EXT-02** The Avinode B2C `POST /searches` endpoint MUST NOT be used. The CRM never shows marketplace aircraft results.
- **EXT-03** Never construct Avinode URLs. Use only deep links returned by Avinode, and validate the host against an allowlist.
- **EXT-04** Seller-side actions (for example submitting a quote) MUST NOT be implemented. This is a buyer-side CRM.
- **EXT-05** Paynode capabilities are conditional. Do not claim charge, refund or payout integration until sandbox access and the API contract are validated. Until then, a manual, provider-neutral ledger is used and provider-derived records are marked unverified.
- **EXT-06** Integration state is one of: `NotConfigured`, `Mock`, `Connected`, `Degraded`, `Error`. The UI shows it honestly. Mock data is labelled "Demo data".
- **EXT-07** Each external operation sits behind an interface with a mock adapter and a real adapter, controlled by a feature flag. Default OFF until sandbox scopes are approved.

**Known specification conflicts.** The PRD lists eleven (C1 to C11, PRD 10.1) and its section 18 gives the frontend-phase reading. The agent MUST NOT silently pick a winner. Where the PRD is silent, use the interim default below, tag it `[UI-SUGGESTION]` and flag it:

| Conflict | Interim default until the PRD decides |
|---|---|
| Trip status lists differ across docs 01, 04, 05, 06 | Use the 11 statuses of spec 04 internally; the dashboard groups them into six buckets (Draft, Sourcing, Quoting, Confirmed, Completed, Cancelled). Keep the mapping in one config file |
| Trip detail tabs: 10 in spec 00, 8 in spec 04 (PRD C5, still `[UNRESOLVED]`) | Use spec 00's list from `Docs/DESIGN.md` section 11 as a **clearly proposed** arrangement and record it for supervisor review |
| Who reports the Avinode trip outcome (spec 04 vs spec 08) | One service owns it (trip module); the booking module calls it. Never two code paths |
| Webhook endpoint is described in specs 03, 04, 06 | One endpoint, owned by Administration and Integrations (17), dispatching to modules |
| Route style `/api/...` vs `/api/v1/...` | Always `/api/v1/...` |
| Revenue basis (invoiced, paid, recognized) | Show **Invoiced Amount** and **Collected Amount** as two separate figures (MTG-29). Never label either plain "Revenue" |

---

## 4. Engineering principles

- **ENG-01 Production-ready by default.** Every change is written to ship. No prototype shortcuts, no "fix later", no hard-coded values, no disabled tests.
- **ENG-02 Correctness before cleverness.** Prefer the simplest design that meets the requirement (KISS). Do not build for imagined futures (YAGNI).
- **ENG-03 SOLID.** Single responsibility per class or module; open for extension, closed for modification; substitutable implementations; small focused interfaces; depend on abstractions.
- **ENG-04 DRY with judgment.** Remove duplicated knowledge, not coincidental similarity. Three similar lines are fine; a duplicated business rule is not.
- **ENG-05 Separation of concerns.** UI, application logic, domain rules, persistence and integrations live in separate layers.
- **ENG-06 Composition over inheritance.** Use inheritance only for true is-a relationships.
- **ENG-07 Fail fast and loud.** Validate at the boundary; reject bad input immediately with a clear error. Never swallow exceptions.
- **ENG-08 Make illegal states unrepresentable.** Use enums, value objects and explicit state machines instead of free strings and boolean flags.
- **ENG-09 Prefer immutability and pure functions** for calculations (money, commissions, margins, aggregates).
- **ENG-10 Explicit over implicit.** No hidden global state, no magic strings or numbers (use named constants or config), no side effects in getters.
- **ENG-11 Small units.** Functions do one thing, ideally under 40 lines and low cyclomatic complexity (target 10 or less). Files stay focused. Split when a file grows past about 400 lines.
- **ENG-12 Names carry meaning.** Names state what a thing is or does in domain language (`BookingConfirmedAtUtc`, not `date2`). Use the vocabulary of the PRD and `DESIGN.md` section 12. One name per concept across the whole codebase.
- **ENG-13 Consistency beats preference.** Match the existing style of the file, project and language. Use the repository formatter and linter; never reformat unrelated code.
- **ENG-14 No dead weight.** No commented-out code, unused code, unused imports, unused files, unused dependencies, debug prints or `TODO` without a ticket reference (section 13).

---

## 5. Architecture rules

- **ARC-01 Modular monolith by feature.** One folder or project per module (for example `Customers`, `Trips`, `Rfqs`). A module owns its data and exposes a narrow public API.
- **ARC-02 Layering inside a module.** `Presentation` (API controllers, UI) -> `Application` (use cases, commands, queries, validators, DTOs) -> `Domain` (entities, value objects, domain services, events) -> `Infrastructure` (database, integrations, queues). Dependencies point inward only. The domain depends on nothing.
- **ARC-03 No cross-module table access.** A module reads another module's data only through that module's public interface or published events. Never join another module's tables.
- **ARC-04 Integration adapters.** Avinode, Paynode, email and SMS sit behind interfaces in Infrastructure. Business code never calls an HTTP client directly.
- **ARC-05 Events for decoupling.** Cross-module reactions use domain or integration events (for example `BookingConfirmed`, `QuoteReceived`), delivered via an outbox for reliability.
- **ARC-06 Async by default for slow work.** Webhooks, imports, exports, reports and syncs run in background jobs. The request returns quickly.
- **ARC-07 Idempotent commands.** Every command that creates something externally, charges money, or can be retried takes an idempotency key and is safe to run twice.
- **ARC-08 Configuration, not code.** Environment-specific values come from configuration. Stages, thresholds and mappings live in reference data or config, not scattered `if` statements.
- **ARC-09 Feature flags** gate unfinished or conditional capabilities (Avinode, Paynode, AI). Flags default OFF in production.
- **ARC-10 Decisions are recorded.** Any non-obvious architectural choice gets a short Architecture Decision Record in `docs/adr/` (context, decision, consequences).

---

## 6. Scalability rules

- **SCL-01 Stateless services.** No session or user state in process memory. Use the database or a shared cache so any instance can serve any request.
- **SCL-02 Every list endpoint paginates on the server** (cursor or keyset for large sets), with a hard maximum page size. No unbounded queries.
- **SCL-03 Index for access patterns.** Every query used on a list screen has a supporting index. Verify with the query plan for anything non-trivial.
- **SCL-04 No N+1 queries.** Batch or join. Review generated SQL for list and detail endpoints.
- **SCL-05 Keep transactions short** and scope them to one aggregate where possible. No external calls inside a database transaction.
- **SCL-06 Cache deliberately.** Cache read-heavy, slow-changing data with explicit expiry and invalidation on the relevant event. Never cache per-user authorized data in a shared key.
- **SCL-07 Dashboards read from read models or aggregates**, not from heavy live joins. They are rebuildable from source records. Targets from the specs: dashboard p95 at or under 3 seconds on a production-like dataset; indexed directory query under 1 second.
- **SCL-08 Backpressure and limits.** Rate limit public and webhook endpoints. Apply timeouts, bounded retries with exponential backoff and jitter, and dead-letter queues. Use circuit breakers for external calls.
- **SCL-09 Design for horizontal scale.** Safe concurrent processing (optimistic concurrency, unique constraints, idempotent consumers). No reliance on a single instance or local disk.
- **SCL-10 Data growth plan.** For tables that grow without bound (audit, activity, integration inbox), define partitioning or retention and archival from the start.

---

## 7. Security rules

Baseline: OWASP Top 10 and the OWASP API Security Top 10 (2023). Treat every item as a requirement, not advice.

**Phase note.** In the frontend prototype phase there is no server. Server-side rules (authentication, authorization per record, audit, webhooks) are **design constraints to preserve**: model permissions as keys, route all data through an API client abstraction, never put secrets in the bundle. The UI MUST NOT claim any of them is enforced, and mock permissions are labelled as not backend security (PRD FE-FLOW-09). When the backend phase starts, every rule below applies in full.

### 7.1 Identity and access

- **SEC-01 Authenticate everything** except health checks and explicitly public routes. Use the identity approach in the PRD (OIDC or JWT). Support MFA enforcement for admins.
- **SEC-02 Authorize on the server, on every request, per record** (prevents Broken Object Level Authorization). A valid login proves nothing about access to a specific customer, trip, invoice or file. Check role **and** ownership, team or organization scope.
- **SEC-03 Also authorize at property and function level.** Finance fields (margin, cost, commission) need explicit permissions. Never return fields the caller may not see; omit them.
- **SEC-04 Hide what a role cannot use.** If a role cannot use a thing, the UI does not render it and the API refuses it. This is different from a **business-rule state** (for example an expired quote, a mock or deferred action), which PRD 15.1 and MTG-15 require to be shown disabled with a short reason (section 1A.4).
- **SEC-05 Least privilege** for users, services, database accounts and API tokens.
- **SEC-06 Use consistent permission keys** (for example `dashboard.view`, `dashboard.finance.view`, `dashboard.export`, `workspace.team.view`). Add new keys to one central list.
- **SEC-07 Return 404 or 403 per policy** for records outside scope, without revealing whether the record exists when that matters.

### 7.2 Input, output and data handling

- **SEC-08 Validate all input on the server**: type, length, range, format, allowed values. Allowlist, do not blocklist. Client-side validation is for usability only.
- **SEC-09 Parameterized queries or an ORM only.** Never build SQL, shell commands or paths from user input.
- **SEC-10 Encode output** to prevent cross-site scripting. Never render untrusted HTML. Set a Content Security Policy.
- **SEC-11 CSRF protection** for cookie-based sessions. Prefer same-site cookies and anti-forgery tokens.
- **SEC-12 CSV and spreadsheet export injection**: escape cells that start with `=`, `+`, `-`, `@`, tab or carriage return.
- **SEC-13 File uploads**: size and type limits, content-type verification, virus scan, random storage names, private storage, authorized downloads, no execution from upload paths.
- **SEC-14 Mass assignment**: bind to explicit DTOs, never directly to entities.
- **SEC-15 Prevent SSRF**: when following a URL supplied by an external system (for example an Avinode `href`), allow only expected HTTPS hosts and resource types.
- **SEC-16 Sensitive data**: minimize collection; encrypt in transit (TLS) and at rest; mask in logs and UI; set retention. Never store raw card numbers or CVV. Passenger identity data needs explicit permission.
- **SEC-17 Never log secrets, tokens, passwords, full card data, or unnecessary personal data.** Redact PII in telemetry.

### 7.3 Secrets and configuration

- **SEC-18 No secrets in source, git history, frontend bundles, logs, error messages or tickets.** Use a secrets vault or environment variables injected at runtime. Support rotation. Separate sandbox and production credentials.
- **SEC-19 No hard-coded credentials, keys or connection strings,** not even in tests (use fake values).
- **SEC-20 API tokens for Avinode and Paynode are server-side only.** The browser never calls those APIs.

### 7.4 Integrity and operations

- **SEC-21 Webhooks**: authenticate per the provider's requirements, store the raw event and event identity durably, acknowledge quickly, process asynchronously and idempotently, tolerate duplicates and out-of-order delivery.
- **SEC-22 Audit** every create, update, delete, merge, export, approval, role change, integration action and failed authorization. Record actor, action, before and after, time (UTC), correlation ID. Audit records are append-only.
- **SEC-23 Security headers and transport**: HTTPS only (HSTS), secure cookies, restrictive CORS (named origins), `X-Content-Type-Options`, frame protection.
- **SEC-24 Rate limit and throttle** authentication, search, export and webhook endpoints. Lock out brute force.
- **SEC-25 Dependencies**: pin versions, scan for known vulnerabilities in CI, update promptly, remove unused packages. New dependencies need justification (section 14).
- **SEC-26 Error responses never leak internals** (stack traces, SQL, file paths, secrets). Log details server-side with a correlation ID; return a safe message.
- **SEC-27 Unsafe consumption of APIs**: treat data from Avinode and Paynode as untrusted. Validate shape, size and values before storing or displaying.
- **SEC-28 Inventory your endpoints.** Keep the OpenAPI document current. Remove or protect old or debug endpoints.
- **SEC-29 Security tests**: automated permission tests for every endpoint (allowed role, denied role, other team's record), plus injection and upload tests where relevant.

---

## 8. Domain data rules (CRM-specific, easy to get wrong)

- **DOM-01 Money.** Use fixed-point decimal types (`decimal` or `NUMERIC`), never floating point. Store amount and ISO 4217 currency together. Never add or compare amounts in different currencies without an explicit, dated FX rate whose source is shown. Do not total mixed currencies silently.
- **DOM-02 Rounding.** Define one rounding policy (mode and scale) in one place. Use it everywhere.
- **DOM-03 Time.** Store timestamps in UTC. Preserve airport-local date and time with the IANA time zone ID for departures and arrivals. Compare legs using timezone-aware conversions, never naive local times. Report buckets use the selected reporting time zone.
- **DOM-04 Identifiers.** Every record has a stable internal ID (UUID). External IDs (Avinode, Paynode) are stored separately with provider and a unique constraint on (provider, external ID). Never use email as a primary key.
- **DOM-05 State machines.** Lead status, opportunity stage, trip status, RFQ status, booking status, invoice status and commission status are **separate** state machines. Define allowed transitions in one place, record every transition (from, to, actor, time, reason), and test illegal transitions.
- **DOM-06 Do not infer outcomes.** An operator response is not an accepted quote. A webhook is not accounting truth. "Payment recorded", "payment initiated" and "funds settled" are different states.
- **DOM-07 Never overwrite external snapshots.** Store the external quote or RFQ as received, with source timestamp and last-synced time. CRM-owned fields are separate.
- **DOM-08 Never silently overwrite local data** with external data (notes, customer details). Show a conflict and let a user choose.
- **DOM-09 No destructive deletes** of customers, trips, invoices or audit. Archive or void, retain history, forbid cascading deletes.
- **DOM-10 Optimistic concurrency** on every editable aggregate (`RowVersion` or ETag). A stale write returns a conflict error; it never overwrites.
- **DOM-11 Duplicates.** Detect candidate duplicates on normalized email, phone and name. Never auto-merge. Merges are manager-approved, transactional, audited and reversible by metadata.
- **DOM-12 Normalization.** Store phones in E.164 and keep the original; compare emails case-insensitively.
- **DOM-13 Quote and proposal immutability.** Once a proposal version is sent, it is immutable. Changes create a new version.
- **DOM-14 Commission and pricing rules are versioned.** Snapshot the rule used when a booking closes.
- **DOM-15 Reporting definitions** (booked, invoiced, collected, settled) are central, named and documented. Metrics count unique IDs to avoid double counting.

---

## 9. API design rules

- **API-01 Routes are versioned and resource-oriented**: `/api/v1/customers`, `/api/v1/trips/{id}/rfqs`, and so on. Use nouns, plural names, standard HTTP verbs and status codes.
- **API-02 DTOs only.** Request and response shapes are explicit types, separate from entities.
- **API-03 Errors use RFC 7807 Problem Details** with a stable machine-readable `code`, human `title` and `detail`, field errors, and `correlationId`.
- **API-04 Pagination, filtering and sorting** use one consistent, documented convention across all list endpoints, with a maximum page size.
- **API-05 Idempotency keys** (header) for create-style and external-effect commands.
- **API-06 Concurrency tokens** (ETag or version) on updates.
- **API-07 Correlation IDs** accepted and propagated on every request, logged and returned.
- **API-08 OpenAPI** is generated from code, kept current, with examples. The typed client for the frontend is generated from it; hand-written duplicates of API types are not allowed.
- **API-09 Backward compatibility.** Do not break a released contract. Add fields; deprecate before removing; bump the version for breaking changes.
- **API-10 Internal routes are not Avinode routes.** Never name or document an internal route as if it were an Avinode or Paynode endpoint.
- **API-11 Cancellation tokens** are accepted and honored on all async operations.

---

## 10. Database rules

- **DB-01 Migrations only.** All schema changes are versioned, reviewed, repeatable migrations. Never edit the database by hand. Never edit an applied migration.
- **DB-02 Migrations are safe**: backward compatible with the running app (expand, then migrate, then contract), reversible where possible, tested on realistic data, with no long locks on large tables.
- **DB-03 Constraints in the database**: primary keys, foreign keys, unique constraints, not-null, check constraints. Do not rely on app code alone.
- **DB-04 Index deliberately**: for foreign keys, filters and sorts in use. Remove unused indexes.
- **DB-05 Naming** is consistent (singular or plural, one convention throughout) and documented.
- **DB-06 No business logic in triggers or stored procedures** unless the PRD requires it.
- **DB-07 Seed and fixture data** are separate from production data, clearly marked, and never contain real personal data.
- **DB-08 Multi-tenancy or organization scoping** applies to every query (a mandatory filter, enforced centrally, not by each developer remembering).
- **DB-09 Backups and restore** are tested. Retention and deletion policies are implemented as code.

---

## 11. Frontend rules

- **FE-01 `Docs/DESIGN.md` is binding.** Colors, fonts, spacing, components, navigation, page templates and the anti-clutter rules are not optional.
- **FE-02 Design tokens live in one place** (CSS variables or a theme file). No hard-coded hex values, font names or spacing numbers in components.
- **FE-03 Build from components.** Reuse the shared components (KPI card, table, chip, tabs, buttons, filters row). Do not copy and tweak markup. A new component needs a reason and an entry in the component catalog.
- **FE-04 No extra tabs, headings, menu items, cards, buttons or filters** beyond what the PRD, the specs and `Docs/DESIGN.md` define. Do not add "coming soon" UI. The only placeholders allowed are the labelled mock, disabled or unavailable states the PRD asks for (PRD 15.1, 16.1).
- **FE-05 Permissions drive rendering.** The UI asks the data layer what the user may see and renders only that. It does not hide things with CSS. In the prototype, the "API" is the mock adapter and the role comes from the demo role switcher.
- **FE-06 Data comes only from the API.** Never call Avinode or Paynode from the browser. Never keep secrets, tokens or personal data in `localStorage`, source or bundles.
- **FE-07 Handle every state**: loading (skeletons), empty (one sentence plus an action), error (what happened and what to do), permission-denied at route level, partial sync failure.
- **FE-08 Forms**: server-side validation is authoritative; show field-level errors; warn on unsaved changes; handle concurrency conflicts.
- **FE-09 Accessibility** to WCAG 2.1 AA: keyboard operable, visible focus, labels, contrast, `aria` for charts and custom controls, reduced motion respected.
- **FE-10 Responsive** from desktop down to phone, per the breakpoints in `DESIGN.md`.
- **FE-11 Performance**: code-split by route, lazy-load heavy charts, memoize expensive renders, virtualize very long lists, avoid unnecessary re-renders and requests.
- **FE-12 Type safety**: strict TypeScript (or the chosen language's strictest mode); no `any` without a justified comment; API types generated from OpenAPI.
- **FE-13 Copy**: sentence case, plain language, labels from `DESIGN.md` section 12. Strings live in one place so they can be changed or translated.
- **FE-14 Demo content** is labelled `DEMO DATA` or `MOCK MODE` and lives in fixtures, never mixed with real data paths.
- **FE-15 One data layer.** Screens never read JSON or call `fetch` directly. They use a typed service interface (for example `CustomersService`, `TripsService`) with a **mock adapter** (JSON fixtures, in-memory state) and a future **HTTP adapter**. Switching is configuration, not a rewrite.
- **FE-16 Fixtures** live in one folder, are typed, use only fictional data (Ahmed, Ali, Sara, SkyJet), and follow the shapes in PRD section 17. Demo-only fields are named and documented as such (PRD 17 cautions).
- **FE-17 Simulated actions** update in-memory state, show a confirmation, and use the wording of the PRD 16.1 matrix. Loading states that discourage double clicks are fine but are never described as idempotency.
- **FE-18 Role simulation.** Roles come from one demo role provider. Role checks use permission keys (section 7.1), not scattered role-name comparisons, so the real permission model can replace it.

---

## 12. Testing rules

- **TST-01 Tests ship with the code.** A change without tests is incomplete. Bug fixes start with a failing test that reproduces the bug.
- **TST-02 Test pyramid**: many fast unit tests (domain rules, calculations, validators, state machines); fewer integration tests (database, API, adapters with mocks); a small set of end-to-end tests for core journeys.
- **TST-03 Every acceptance criterion** in the PRD or spec has a test that names the requirement ID.
- **TST-04 Mandatory test classes**: permission and scope tests (allowed, denied, other team's data); concurrency conflict tests; idempotency and duplicate-webhook tests; time zone and date-boundary tests; money rounding and multi-currency tests; illegal state transition tests; pagination and filter tests.
- **TST-05 Deterministic.** No dependence on real time, randomness, network, or test order. Inject clocks and ID generators. Use fakes for Avinode and Paynode; contract-test adapters against recorded sandbox samples.
- **TST-06 Readable tests**: arrange, act, assert; one behavior per test; names state the behavior ("rejects a stale write"). Use builders for test data.
- **TST-07 Coverage is a floor, not a goal.** Aim for at least 80 percent on domain and application code, with critical paths (money, permissions, state changes, integrations) fully covered. Never write assertion-free tests to raise the number.
- **TST-08 No flaky tests.** Fix or remove. Never skip or disable a test to get green; fix the cause.
- **TST-09 Performance checks** for list, dashboard and import paths against a production-like dataset.
- **TST-10 Manual UAT script** for each module, tied to the acceptance criteria.

---

## 13. Self-review and cleanup protocol (mandatory after every change)

Before declaring work done, the agent MUST perform all steps and report the result.

**Step 1: Re-read the requirement.** Re-open the PRD and spec items from the task. Confirm each is implemented and nothing extra was added.

**Step 2: Review the diff as a hostile reviewer.** Read every changed line. Look for:

- correctness bugs, off-by-one, null handling, rounding, time zone errors
- missing authorization or scope checks
- missing validation, error handling, logging, audit
- race conditions, missing idempotency, missing concurrency tokens
- performance traps (N+1, unbounded queries, blocking calls)
- security issues (section 7), leaked secrets
- unclear names, long functions, duplicated logic
- UI deviations from `DESIGN.md`

**Step 3: Remove everything not needed.** Delete, do not comment out:

- unused code, functions, classes, variables, parameters
- unused imports and `using` statements
- unused files, assets, fixtures and styles
- unused dependencies and configuration keys
- debug output (`console.log`, `Console.WriteLine`, prints), temporary flags and scratch files
- commented-out code and stale comments
- experimental branches of logic that did not ship

**Step 4: Run the automated gates.** Format, lint, type-check, build, unit tests, integration tests, security and dependency scan. All MUST pass. Report real results; never claim a run that did not happen.

**Step 5: Verify behavior.** Run the app or the tests that exercise the change. For UI, view it at desktop and a narrow width and check all states.

**Step 6: Update documentation** (section 14) and the traceability table.

**Step 7: Write the report** (section 17).

If any step fails, fix it and repeat from Step 2. Do not report partial work as finished.

---

## 14. Documentation rules

Code must be easy to understand, change and scale. Document **why**, not what.

- **DOC-01 Self-explanatory code first.** Clear names and small functions reduce the need for comments.
- **DOC-02 Comments explain intent and constraints**: the business rule, the spec ID, the reason for a non-obvious choice, the external API quirk. Not the obvious.
- **DOC-03 Public APIs and exported symbols are documented** (XML docs, JSDoc or TSDoc): purpose, parameters, return value, errors, side effects, an example where helpful.
- **DOC-04 Each module has a `README.md`**: purpose, requirement IDs covered, public interface, data it owns, events published and consumed, integration points, how to run its tests, and the traceability table.
- **DOC-05 Repository `README.md`**: what the system is, prerequisites, setup, run, test, build, environments, configuration (names and meaning of every setting, never values), troubleshooting.
- **DOC-06 ADRs** for architectural decisions (`docs/adr/NNNN-title.md`).
- **DOC-07 OpenAPI** is the API reference; examples included.
- **DOC-08 `CHANGELOG.md`** follows Keep a Changelog and Semantic Versioning.
- **DOC-09 Runbooks** for operations: webhook backlog, failed sync, replay, secret rotation, restore from backup.
- **DOC-10 Keep docs next to code and in the same change.** Outdated docs are bugs; delete docs that no longer apply.
- **DOC-11 `TODO` and `FIXME`** are allowed only with a ticket or requirement reference and an owner. Otherwise do not write them.
- **DOC-12 Dependency justification.** A new library needs: why it is needed, why existing code cannot do it, its license, maintenance health, and a security check. Prefer the standard library and existing dependencies.

---

## 15. Observability and reliability

- **OPS-01 Structured logging** (JSON) with level, timestamp (UTC), correlation ID, module, and user ID (not personal data). Log decisions and failures, not noise.
- **OPS-02 Log levels used correctly**: `Error` for failures needing action, `Warning` for recoverable anomalies, `Information` for business events, `Debug` off in production.
- **OPS-03 Metrics and tracing**: request latency and errors, queue depth and age, webhook backlog and duplicates, external API latency and 4xx/5xx, job failures. Alert on sustained problems.
- **OPS-04 Health endpoints** (liveness and readiness) that check real dependencies.
- **OPS-05 Resilience**: timeouts on every external call; retries with exponential backoff and jitter only for safe, idempotent operations; circuit breakers; dead-letter queues with safe replay; graceful shutdown that drains work.
- **OPS-06 Degrade gracefully.** If Avinode or Paynode is down, internal records stay usable, manual workflows work, and unsynchronized records are clearly labelled.
- **OPS-07 Environments** are separated: local mock, development with fixtures, sandbox integration, staging or UAT, production. No production data in lower environments.
- **OPS-08 Twelve-factor habits**: one codebase, explicit dependencies, config in the environment, backing services as attached resources, strict build/release/run separation, stateless processes, logs to stdout, dev and production kept close.
- **OPS-09 Data protection**: backups, tested restores, encryption at rest, secret rotation procedures.

---

## 16. Source control and change management

- **GIT-01 The agent MUST NOT commit, push, merge or rewrite history unless the user asks.** When asked, follow the rules below.
- **GIT-02 Branches**: short-lived, named `type/short-description` (for example `feat/customer-merge`). Never commit directly to `main`.
- **GIT-03 Commits** follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, `security:`), with the requirement IDs in the body. Small, focused, buildable commits.
- **GIT-04 Pull requests** include: what and why, requirement IDs, screenshots for UI, test evidence, migration notes, risks and rollback. One concern per PR.
- **GIT-05 Never commit** secrets, `.env` files with values, credentials, large binaries, generated artifacts, personal data, or build output.
- **GIT-06 No force-push** to shared branches. No `--no-verify`. If a hook fails, fix the cause.
- **GIT-07 Releases** use Semantic Versioning and tags. Database migrations are part of the release notes.
- **GIT-08 Code review** is required. The author does not approve their own PR. A security-sensitive change (authentication, authorization, money, integrations) needs a second reviewer.

---

## 17. Agent behavior and reporting

### 17.1 How the agent works

- **AGT-01 Understand first.** Read the PRD, the spec, `DESIGN.md` and the surrounding code before writing anything.
- **AGT-02 Plan before building.** State the requirement IDs, the files to be created or changed, the approach, and the tests. For UI, state the page template (A to D in `DESIGN.md`) and map each card or column to a spec field.
- **AGT-03 Ask when unclear.** Missing requirement, ambiguous rule, conflicting documents, or an open decision: stop and ask. Offer a recommended default. Do not guess.
- **AGT-04 Never fabricate.** No invented endpoints, fields, IDs, URLs, statuses, test results, benchmarks or data. If an Avinode or Paynode capability is not documented and approved, do not use it.
- **AGT-05 Small steps.** Prefer small, reviewable, reversible changes. Do not mix refactors with features.
- **AGT-06 Stay in scope.** Do not modify unrelated files, rename things, reformat, upgrade dependencies or "improve" code that the task does not cover. Mention opportunities in the report instead.
- **AGT-07 Prefer existing code.** Search for and reuse existing components, utilities and patterns before creating new ones.
- **AGT-08 Be careful with destructive actions.** Deleting data, dropping tables, rewriting history, changing credentials or running migrations on shared environments requires explicit user confirmation.
- **AGT-09 Protect secrets and personal data.** Never print, paste, log or commit them. Use fake data in examples and tests.
- **AGT-10 Verify, do not assume.** Run builds and tests. Check that files, functions and flags you reference actually exist.
- **AGT-11 Be honest.** If something failed, was skipped, or is unverified, say so plainly. Do not present a guess as a fact.
- **AGT-12 Leave the repository clean**: no scratch files, no stray logs, no half-finished edits.

### 17.2 Report format (end of every task)

```
Task: <one line>
Requirements covered: <IDs from the PRD/specs>
Template / modules touched: <list>
Changes: <files and what changed, brief>
Tests: <added/updated, with results: passed / failed / not run, and why>
Self-review: <issues found and fixed; items removed as unused>
Security: <checks performed; any open risk>
Docs updated: <README / ADR / OpenAPI / CHANGELOG>
Deviations from the PRD or DESIGN.md: <none, or list with reason>
Open questions / assumptions: <list>
```

---

## 18. Anti-patterns (never do these)

- Building anything not in the PRD, or "improving" the design.
- Presenting mock data, a simulated action or a deferred feature as real (a sent email, a payment, an Avinode sync, a server-enforced approval).
- Promising instant operator confirmation, or a fixed confirmation time, anywhere in the UI.
- Making an illustrative `[UI-SUGGESTION]` field mandatory, or describing it as a confirmed requirement.
- Adding navigation items, tabs, headings, cards, filters or buttons that are not specified.
- Showing locked or "no access" placeholders for something a role cannot use (omit it). Business-rule disabled states with a reason are allowed and required where the PRD says so.
- Checking permissions only in the UI.
- Returning entities directly from the API; binding requests to entities.
- Floating-point money; summing mixed currencies; naive local times.
- Hard-coded secrets, URLs, thresholds, or colors.
- Calling Avinode or Paynode from the browser, or using undocumented or B2C endpoints.
- Constructing Avinode links by hand.
- Treating a webhook or an operator response as a final business fact.
- Catch-all `catch` blocks that hide errors; logging and rethrowing the same error repeatedly.
- Silent data overwrites; hard deletes of business records; auto-merging duplicates.
- Unbounded queries; N+1 queries; external calls inside database transactions.
- Copy-pasted components; duplicated business rules; giant files and functions.
- Commented-out code, dead code, leftover debug output, unused dependencies.
- Disabling or skipping failing tests; asserting nothing.
- Declaring "done" without running the build and tests.
- Committing or pushing without being asked.

---

## 19. Definition of done

A task is done only when all are true:

- [ ] Every requirement ID in scope (legacy IDs, `MTG-xx`, `FE-FLOW-xx`) is implemented exactly as the PRD states; nothing extra was added
- [ ] Mock and deferred behavior is labelled (`DEMO DATA`, `MOCK MODE`, `NOT CONNECTED`) and never claimed as real
- [ ] The relevant items of the PRD section 19 sign-off checklist pass
- [ ] UI matches `Docs/DESIGN.md` (shell, tokens, components, navigation, copy, anti-clutter rules)
- [ ] Authorization and scope are enforced on the server for every endpoint touched
- [ ] Inputs validated; errors use Problem Details; sensitive data protected; no secrets exposed
- [ ] Money, time, identifiers and state machines follow section 8
- [ ] Loading, empty, error and permission states exist (UI) and are tested
- [ ] Tests added and passing, including permission, concurrency, idempotency and time zone cases where relevant
- [ ] Format, lint, type-check, build and security scan pass
- [ ] Self-review (section 13) completed; unused code, files, dependencies and debug output removed
- [ ] Documentation, OpenAPI, traceability table and CHANGELOG updated
- [ ] Performance and scalability checks done for any list, dashboard, import or integration path
- [ ] The report in section 17.2 is written and honest

---

## 20. References

These are the practices this file draws on. Verify details against the primary source when implementing.

- OWASP API Security Top 10 (2023): https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP Top 10 (web application risks): https://owasp.org/www-project-top-ten/
- The Twelve-Factor App: https://12factor.net/
- Conventional Commits: https://www.conventionalcommits.org/
- Semantic Versioning: https://semver.org/
- Keep a Changelog: https://keepachangelog.com/
- RFC 7807 Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc7807
- RFC 2119 (requirement keywords): https://www.rfc-editor.org/rfc/rfc2119
- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- Architecture Decision Records: https://adr.github.io/
- Avinode developer portal (integration rules, as cited in the specifications; links not re-verified by the PRD): https://developer.avinodegroup.com/

Project documents this file depends on: the PRD, the specifications, the design system and the prototype listed in the file map at the top of this file.
