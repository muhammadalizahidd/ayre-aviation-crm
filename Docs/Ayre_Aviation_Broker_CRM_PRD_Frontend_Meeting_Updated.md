---
title: "Ayre Aviation Broker CRM — Product Requirements Document"
document_type: "PRD with appended meeting decisions"
version_note: "Original PRD unchanged in substance; frontend meeting addendum appended"
source_baseline: "18 specifications (Document 00 and Modules 01–17)"
current_delivery_phase: "Frontend prototype using local JSON/mock data"
meeting_summary_origin: "Notes supplied by project team; formal sign-off not evidenced"
meeting_date: "Not specified in meeting summary"
source_change_policy: "Do not rewrite original PRD sections 1–13"
decision_priority: "For frontend prototype decisions only: section 14 onward supplements, and where applicable updates, older open questions; backend source constraints remain"
---

> **AI / development reading instruction:** The complete original PRD is preserved below as Sections 1–13, converted from the uploaded Word file into Markdown without editorial rewriting. **Sections 14–20 are additions from the supplied team-meeting summary.** For the current **frontend-only JSON prototype**, follow a clearly stated meeting decision where it addresses an older unresolved UI point; retain the original specifications for long-term architecture. Do **not** interpret an unapproved integration, deferred backend rule, or illustrative UI control as production-ready behavior. If there is a conflict, inspect **Section 18 (reconciliation)** rather than silently choosing one statement.

<!-- ORIGINAL-PRD-CONTENT-START: source converted mechanically from uploaded DOCX -->

# Ayre Aviation Broker CRM — Product Requirements Document

Oct 31, 2026 · @Arslan Zafar

## 1. Document control and conventions

This PRD consolidates the 18 Ayre Aviation specifications (Documents 00–17, prepared for Ayre Aviation; 00, 01 and 05 name SYSTEMSPHERES as author) into one product requirements baseline. It adds no new functionality; every requirement cites its source as doc §section or its requirement ID.

| Item             | Value                                                                                                                                                                                                                   |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Product          | Ayre Aviation — Charter Broker CRM                                                                                                                                                                                      |
| Source documents | 00 Master Architecture; 01–17 module specifications                                                                                                                                                                     |
| Source status    | All are drafts or proposals: 00 and 01 v0.1; 03, 05, 06 v1.0; 02 and 04 unversioned; 00–06 dated 30 Oct 2026; 07–17 carry no version or date. 00 is "subject to stakeholder and API access validation" (00 doc control) |
| Detail level     | 00–06 are detailed. 07–17 use one shared template with generic requirements, data model and APIs; field-level requirements must be confirmed (07–17 §12)                                                                |
| Companion        | UI Field Mapping document (Document B)                                                                                                                                                                                  |

**Labels used in this PRD**

- **\[Spec\]** stated in a source document.

- **\[Proposed\]** a design the source suggests but marks as proposed or illustrative (for example all internal API routes, 00 §11).

- **\[Conditional / Unverified\]** depends on Avinode or Paynode access that is not yet confirmed.

- **\[Needs decision\]** the sources leave it open, or disagree.

- **\[Interpretation\]** the author's reading, to be validated with the supervisor.

Requirement IDs are kept as written in the sources (CUS-, LEAD-, OPP-, PIPE-, ACT-, SYNC-, TRP-, AS-, RFQ-, FR-07-01 … FR-17-06). Where 07–17 give no IDs beyond FR-xx-yy, this PRD uses those.

## 2. Product overview and goals

Ayre Aviation needs one broker-centric CRM that owns its customer, sales, trip, booking, finance and commission data, while using Avinode as an external marketplace for aircraft sourcing and RFQs and treating Paynode only as a potential payment provider (00 §1). Neither Avinode nor Paynode is the CRM.

**Delivery approach \[Spec\]:** first a navigable frontend prototype across all 17 modules with an explicit mock integration layer; then the backend; then verified Avinode/Paynode capabilities (00 §1, §11).

**Objectives (00 §2)**

1.  Reduce duplicate trip entry between CRM and Avinode and keep a traceable cross-system trip reference.

2.  Let brokers work from a trip-centric workspace and see RFQ/quote changes without reconciling several screens.

3.  Track customer payments, operator costs, profit and broker commissions with source/provider attribution.

4.  Give managers pipeline, conversion, booking and financial visibility under role-based access.

5.  Support gradual API rollout without presenting mock or unsupported integrations as live.

**Success measures / quality gates (00 §13)**

- A user can traverse all 17 module areas and complete a simulated charter workflow without broken navigation.

- A trip has consistent links to customer, opportunity, RFQs, quotes, booking, invoice, payments and tasks.

- The frontend never asserts aircraft results come from an unauthorized B2B search API.

- An Avinode sandbox test shows trip creation, deep-link handoff, webhook ingestion, RFQ/quote retrieval and cancellation/outcome reporting before production is marked ready.

- Integration failure is visible and recoverable without losing CRM records.

- Credentials are server-side only; financial actions and key status changes are audited.

## 3. Actors, roles and permissions

The system has three kinds of actor: business parties outside the CRM, internal user roles inside it, and one non-human integration service. Final role names and visibility rules are a High-priority open decision (00 §14).

### 3.1 Business parties and external systems

| Party / system                         | What it is                                                                                                | Uses the CRM?                                    | Source                 |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------|------------------------|
| Customer (e.g. Ahmed)                  | Individual or organization buying charter; contacts include decision maker, passenger, assistant, billing | No (customer portal is a possible future phase)  | 02 §3, CUS-003; 00 §14 |
| Charter broker company (Ayre Aviation) | Owns the CRM and its data                                                                                 | Yes, via staff roles                             | 00 §1                  |
| Aircraft operator (e.g. SkyJet)        | Responds to RFQs in Avinode; has a CRM operator profile                                                   | No. Operator-side RFQ responding is out of scope | 00 §3.2; 09 §6         |
| Avinode                                | External marketplace / workflow system                                                                    | System-to-system integration                     | 00 §1, §7              |
| Paynode                                | Potential payment provider                                                                                | Only if API scope is approved                    | 00 §8; 11 §9           |

### 3.2 Internal roles

| Role (00 §2 name)     | Other names in sources              | Core responsibilities                                                                                                                                                                                        | Main modules (interpretation)      |
|-----------------------|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| Broker                | —                                   | Customers, enquiries, trips, quotes, communications, follow-up, proposals (00 §2)                                                                                                                            | 02, 03, 04, 05, 06, 07, 08, 10, 14 |
| Broker manager        | Sales Manager (01–04, 06, 07–17 §4) | Assign leads; approve exceptional discounts/margins; review pipeline and team metrics (00 §2); merge duplicates (02 §2); reassign trips/RFQs and approve exceptional changes or cancellations (04 §2, 06 §2) | 01, 02, 03, 04, 06, 07, 16         |
| Finance               | Finance / Viewer (06 §2)            | Invoices, receivables, operator payables, reconciliation, commission approvals (00 §2)                                                                                                                       | 11, 12, 13, 01                     |
| Administrator         | System Admin (01 §2)                | Identity, roles, integration credentials, notifications, audit, configuration (00 §2); no implicit full financial visibility (01 §2)                                                                         | 17 + settings in other modules     |
| Executive / read-only | Executive / Owner (01 §2)           | Dashboard, sales and profitability reporting under assigned permissions (00 §2)                                                                                                                              | 01, 16                             |

**Additional roles outside the 00 §2 list \[Needs decision\]**

- **Operations** — reads customer travel preferences for linked trips; sensitive identity documents need explicit permission (02 §2); manages execution milestones after handoff with no unauthorized price changes (04 §2).

- **Operations Manager** — appears jointly as "Sales Manager / Operations Manager" in 07–17 §4.

- **Integration service** — non-human; receives webhooks and retrieves approved Avinode leads, no interactive access (03 §2).

### 3.3 Permission rules \[Spec\]

- Every list, detail, file, metric and export endpoint enforces authorization server-side; hiding a UI element is not sufficient (01 §2, 02 §2).

- Row-level scope by owner and team; managers see only their organizational scope; brokers see team data only if explicitly granted (01 §2, CUS-005, 03 §2).

- Finance values may require extra permissions (00 §10); managers see margins only if granted (01 §2) \[Needs decision 01 §13\].

- Consistent permission keys, e.g. dashboard.view, dashboard.finance.view, dashboard.export, workspace.team.view (01 §2).

- Merge, archive, export, assignment, stage changes, financial actions and privileged admin actions are audited (02 §2, §11; 03 §11; 00 §13).

- MFA enforcement is configured in Users & Roles (17 §3).

- Generic for 07–17: Administrator configures module permissions with no silent alteration of posted financial records; Executive is read-only within scope (07–17 §4).

## 4. Scope and system-of-record boundaries

The CRM is the system of record for its own business data; Avinode and the payment provider remain authoritative for their own objects, which the CRM caches or reconciles (00 §3.3).

### 4.1 In scope (00 §3.1)

Customer CRM; sales pipeline; charter trips; Avinode sourcing handoff; buyer RFQ and quotation retrieval; internal booking lifecycle; operator records; communications; finance and commission tracking; automation; dashboards; administrative controls.

### 4.2 Out of scope until separately approved (00 §3.2)

- Flight operations dispatch; aircraft schedule / FMS ownership.

- Operator-side RFQ responding (including Avinode seller-side submitQuote, 06 §9).

- A full accounting ledger.

- Client-facing marketplace search results via the restricted B2B search endpoint; Avinode B2C POST /searches is not permitted (00 §7, 05 §1).

- Unapproved Paynode payment actions; implementing a payment processor (07–17 §1).

- Marketplace scraping or replacing operator aircraft systems (07–17 §1); harvesting an airport database (05 §2).

- Trip Board posting defaults OFF unless requested (05 §13) \[Needs decision\].

### 4.3 System of record (00 §3.3)

| Domain                                                        | Authoritative record                    | CRM behaviour                                                                      |
|---------------------------------------------------------------|-----------------------------------------|------------------------------------------------------------------------------------|
| Customers, opportunities, assignments                         | Custom CRM                              | Full CRUD within permissions                                                       |
| Internal trip status, customer proposal, booking, commissions | Custom CRM                              | Own state machines                                                                 |
| Avinode trip ID, RFQs, seller quotes, marketplace messages    | Avinode                                 | Cached/reference data with sync timestamps; source fields read-only (06 §6, 07 §6) |
| Payment transaction and settlement state                      | Payment provider / Paynode if available | CRM keeps ledger and reconciled view (00 §8)                                       |
| User roles, approvals, audit records                          | Custom CRM                              | —                                                                                  |

### 4.4 Module ownership classification (00 §4)

| ID  | Module                                | Classification                                      |
|-----|---------------------------------------|-----------------------------------------------------|
| 01  | Executive Dashboard & Workspace       | Custom                                              |
| 02  | Customer & Contact Management         | Custom                                              |
| 03  | Leads, Opportunities & Sales Pipeline | Hybrid                                              |
| 04  | Charter Trip Management               | Hybrid                                              |
| 05  | Aircraft Sourcing                     | Avinode handoff                                     |
| 06  | RFQ Management                        | Avinode                                             |
| 07  | Quotation & Customer Proposals        | Hybrid                                              |
| 08  | Booking Management                    | Hybrid                                              |
| 09  | Operator Management                   | Hybrid                                              |
| 10  | Communications & Activity History     | Hybrid                                              |
| 11  | Payments & Invoices                   | Paynode + custom                                    |
| 12  | Finance & Trip Profitability          | Custom                                              |
| 13  | Broker Commissions                    | Custom                                              |
| 14  | Tasks & Follow-ups                    | Custom                                              |
| 15  | Workflow Automation & AI              | Custom + events                                     |
| 16  | Reports & Analytics                   | Hybrid                                              |
| 17  | Administration & Integrations         | Hybrid (17 doc control: "Custom + Avinode/Paynode") |

### 4.5 Navigation (00 §5)

Sidebar groups: Overview; Customer & Sales; Charter Operations; Finance & Payments; Tasks & Automation; Reports & Analytics; Administration. These are navigation groups, not modules. Only Module 01 states its placement (Overview → Executive Dashboard; My Workspace). Placement of other modules is \[Needs decision\].

Trip Details is the primary cross-module workspace; each tab links to its owning module rather than duplicating rules and records (00 §5). Tab list differs between sources (see §10).

## 5. Module requirements

Each module lists purpose, users, screens, requirements, rules, integration and dependencies. Internal API routes are all \[Proposed\] (00 §11, 01 §7, 02 §8). Screen-level fields are in Document B.

### 5.1 Module 01 — Executive Dashboard & Workspace (Custom)

- **Purpose:** role-aware, read-oriented summary over CRM-owned aggregates; My Workspace gives each broker a daily queue (01 §1). No editing records from charts, no Avinode search, no payment execution.

- **Users:** System Admin, Executive/Owner, Sales Manager, Broker, Finance (01 §2).

- **Screens:** Executive Dashboard; My Workspace; Dashboard Configuration (admin); Shared Drill-down View (01 §3).

- **Requirements:** global filters (Today, 7 d, 30 d, MTD, QTD, custom; comparison period; broker; team; trip status; optional currency), default MTD, saved per user (01 §4.1). Eight KPIs with defined formulas: New leads, Open opportunities, Confirmed bookings, Charter revenue, Gross profit, Outstanding receivables, Pending RFQ responses, Trips in next 7 days (01 §4.2). Panels: revenue trend, sales funnel, trip status split, top brokers, attention needed, recent activity (01 §4.3). Every KPI drills down with identical filters; tooltips show definition, date basis, timezone, currency, freshness (01 §4.4). Workspace panels and default order overdue → today → upcoming (01 §5).

- **Rules:** never change booking, payment or payout from quick actions (01 §5); show "Sync delayed" for stale external data; revenue labelled "Invoiced Revenue" until basis is approved \[Needs decision, 01 §4.2\]; no naive mixed-currency sums (AC-06); no external API calls from widgets (01 §9).

- **Dependencies:** reads 02, 03, 04, 06, 07, 08, 11, 12, 13, 14, 17.

- **Acceptance:** AC-01 … AC-10 (01 §11).

### 5.2 Module 02 — Customer & Contact Management (Custom)

- **Purpose:** central source of truth for customers, contacts, relationships, preferences (02 §1).

- **Users:** Broker, Sales Manager, Operations, Finance, Administrator (02 §2).

- **Screens:** Customer Directory; Customer Create/Edit; Customer Profile (tabs Overview, Contacts, Preferences, Trips, Opportunities, Activities, Documents, Audit); Contact Directory & Profile; Relationships; Preferences; Duplicate Review & Merge; Import/Export (02 §3).

- **Requirements:** CUS-001 … CUS-015 (individual/organization records, many contacts per organization and vice versa, contact roles, multiple normalized methods, owner/team, tags/tier/channel/marketing permission, search with preserved state, related trips/opportunities read-only, notes and history, attachments with virus scan, archive without destructive delete, duplicate detection and reviewed merge, CSV import/export, Avinode ClientLeads staging, consent and data-quality gaps).

- **Workflows:** manual create with duplicate prompt (02 §5.1); Avinode ClientLead → staging → match → hand off to 03 (02 §5.2) \[Conditional\]; manager merge and archive (02 §5.3).

- **Rules:** type required; full name (individual) or legal/display name (organization); email is not a key; E.164 phones; case-insensitive email matching; no destructive auto-merge; minimise sensitive data (02 §6).

- **Dependencies:** 17, 03, 04, 10, shared documents service (02 §14). **Acceptance:** AC-01 … AC-09 (02 §13).

### 5.3 Module 03 — Leads, Opportunities & Sales Pipeline (Hybrid)

- **Purpose:** receive, qualify, assign and convert enquiries into opportunities and trips; CRM owns pipeline (03 §1).

- **Users:** Broker, Sales Manager, Administrator, Executive, Integration service (03 §2).

- **Screens:** Leads /sales/leads; Lead detail; Opportunities; Opportunity detail; Sales Pipeline (Kanban); Sales Analytics (03 §3).

- **Requirements:** LEAD-001 (manual create: name or organization + one contact method + source), LEAD-002 (itinerary capture), LEAD-003 (dedupe, never silent merge), LEAD-004 (assign, priority, SLA), LEAD-005 (qualify/disqualify with reason), LEAD-006 (convert, preserving history), OPP-001 … 003 (manage, stage history, won needs booking link or approved reason, lost needs reason), PIPE-001, ACT-001, SYNC-001 (03 §4).

- **Rules:** lead status, opportunity stage and trip status are separate state machines (03 §5); weighted value = estimated revenue × probability / 100; probability override needs permission; owner required before active qualification; unique (Tenant, Provider, ExternalLeadId) (03 §6).

- **Integration \[Conditional\]:** ClientLeads webhook → GET /leads/{leadId}; POST /leads only for an approved end-client app; deep links viewInAvinode / searchInAvinode (03 §9).

- **Dependencies:** 02, 04, 14, 17. **Acceptance:** 03 §13 checklist.

### 5.4 Module 04 — Charter Trip Management (Hybrid)

- **Purpose:** single authoritative CRM trip per enquiry or booking, with itinerary, requirements, lifecycle and links (04 §1).

- **Users:** Broker, Sales Manager, Operations, Finance, Administrator (04 §2).

- **Screens:** Trips List; Create/Edit Trip; Trip Details; Sourcing Action; Cancellation/Outcome; Activity & Audit (04 §4).

- **Requirements:** TRP-01 … TRP-12 (draft from customer/lead/opportunity with trip number; multi-leg itinerary with timezone; passenger requirements; list/filter incl. Avinode sync state; detail tabs; audited amendments with warnings when RFQs exist; link RFQs/quotes; cancel with reason and Avinode cancel; outcome with winning operator; timeline and notifications; manual trips; never overwrite local data).

- **Rules:** origin ≠ destination; timezone-aware chronology; passengers \> 0; at most one active Avinode trip per CRM trip; idempotent integration commands (04 §7). Booked requires customer acceptance; Completed requires post-flight closeout; Cancelled terminal unless privileged reopen (04 §5).

- **Integration:** POST /trips, PUT /trips/{id}/cancel, PUT /trips/{id}/outcome, webhooks (04 §10) \[Conditional on access\].

### 5.5 Module 05 — Aircraft Sourcing (Avinode handoff)

- **Purpose:** prepare sourcing from a CRM trip, create/update the Avinode trip, open searchInAvinode; never show in-CRM marketplace results (05 §1).

- **Users:** Broker, Broker manager, Administrator, Finance (read) (05 §3).

- **Screens:** Trip → Aircraft Sourcing tab; Sourcing Worklist; Search Launch Confirmation; Sourcing Activity Timeline; Admin → Integration Health (05 §4).

- **Requirements:** AS-01 … AS-12 (prefill from 04; refine criteria; validate legs; airport search control; local draft "not sent to Avinode"; create/update Avinode trip with externalTripId; open returned deep link; authorization guidance; status tracking; RFQ rollups only from synced data; restrict when cancelled/locked; audit without tokens).

- **Rules:** CRM-generated immutable externalTripId; no duplicate external trips on double-click/timeout; separate "synced to Avinode" vs "broker completed search"; only Avinode-returned links (05 §7).

- **Integration:** POST /trips, PUT /trips/{id}, GET /trips/{id}, GET /airports/search, deep links (05 §10). Feature flag OFF until sandbox approved (05 §11).

### 5.6 Module 06 — RFQ Management (Avinode)

- **Purpose:** broker workspace for RFQs, operator responses and quotes; Avinode is authoritative (06 §1).

- **Users:** Broker, Sales Manager, Administrator, Finance/Viewer (06 §2).

- **Screens:** RFQ Overview; RFQ Detail; Response Inbox; RFQ Activity; RFQ Administration (06 §3).

- **Requirements:** RFQ-01 … RFQ-10 (filter; detail with lifts; one CRM trip per RFQ with exception queue; quotes and declines; unread/acknowledge; approved links only; pass quote to 07; cancellations; deduplicated alerts; freshness indicators).

- **Rules:** normalized statuses separate from source status; never mark accepted because an operator responded; don't infer missing amounts or dates; source fields read-only (06 §6).

- **Integration:** TripRequestSellerResponse → GET /tripmsgs/{messageId} → GET /quotes/{id}; POST /rfqs conditional only; no seller submitQuote (06 §9).

### 5.7 Modules 07–17 — shared template \[Proposed\]

Every module 07–17 uses the same structure. Unless a module says otherwise, these apply to all of them:

- **Each FR** shall provide searchable records, permissions, server-side validation, change tracking, contextual navigation, clear state/ownership/timestamps, actionable errors, and the CRM reference plus any authorized external link. **Acceptance per FR:** authorized users create/view/update; unauthorized changes rejected; field-level errors; updates visible in timeline (07–17 §2).

- **Screens** include pagination, search, sort, loading/empty/error states and role-based actions; breadcrumbs, context headers, status chips, keyboard navigation, desktop-first responsive layout, accessible confirmation dialogs (§3).

- **Generic workflow:** open record/queue → select or create → validate fields, privileges, uniqueness → transactional save + audit → enqueue outbound or process inbound integration → refresh and show next actions/failures (§5).

- **Generic rules:** UTC storage, account timezone display, tenant ownership on every query, optimistic concurrency, retain external IDs and payload metadata, test status transitions (§6).

- **Generic APIs:** GET/POST /api/v1/\<resource\>, GET/PUT /api/v1/\<resource\>/{id}, GET /api/v1/\<resource\>/{id}/history; JWT/OIDC, policy authorization, Problem Details, correlation IDs, idempotency keys for sensitive writes (§8).

- **Generic acceptance:** AC-xx-01 … AC-xx-09 (create/retrieve; reject invalid fields and impossible transitions; access checks for read/write/export; stale write rejected; audit; filters/pagination/badges; disconnected provider; duplicate webhook; end-to-end links) (§11).

- **Open per module:** field-level requirements, state diagram and transition permissions, approval thresholds, financial calculations, Avinode permissions, Paynode scope, messaging provider, role visibility (§12).

### 5.8 Module 07 — Quotation & Customer Proposals (Hybrid)

- **FRs:** FR-07-01 operator quote inbox and comparison; 07-02 proposal editor with version control; 07-03 markup, fees, currency and tax configuration; 07-04 approval and distribution; 07-05 customer acceptance/decline and revision tracking; 07-06 quote expiry, exceptions and audit.

- **Screens:** Quote Inbox; Quote Comparison; Proposal Builder (branded PDF preview); Proposal Detail (07 §3).

- **Rules:** RFQ/quote data from approved buyer workflow; proposals and markups CRM-owned; never overwrite external quotes; store snapshot + sync timestamp (07 §6).

- **API:** /api/v1/quotes-proposals.

### 5.9 Module 08 — Booking Management (Hybrid)

- **FRs:** FR-08-01 convert accepted proposal into booking; 08-02 confirmation, deposits, status; 08-03 itinerary changes and operational checklists; 08-04 contracts, manifests, documents; 08-05 record trip outcome in Avinode; 08-06 cancellation and status history.

- **Screens:** Bookings; Booking Details (trip, provider, customer confirmation, finance, documents); Operations Checklist; Change & Cancellation.

- **Rules:** booking is internal; no Avinode reservation/fulfilment API assumed; outcome reported after business outcome is known; cancel endpoint only for linked external trips (08 §6). **API:** /api/v1/bookings.

### 5.10 Module 09 — Operator Management (Hybrid)

- **FRs:** FR-09-01 directory with profiles and contacts; 09-02 compliance document/insurance expiry; 09-03 quote and trip history; 09-04 preferred/blocked labels; 09-05 cost and response performance; 09-06 notes, ratings, audit.

- **Screens:** Operators; Operator Profile; Performance; Compliance.

- **Rules:** operator identity from Avinode RFQ/quote records when permitted; CRM owns preferences and compliance; no claim to the full Avinode operator directory and no scraping (09 §6). **API:** /api/v1/operators.

### 5.11 Module 10 — Communications & Activity History (Hybrid)

- **FRs:** FR-10-01 trip and RFQ message timeline; 10-02 email history and templates; 10-03 operator message read/reply or deep link; 10-04 customer communication and notes timeline; 10-05 attachments and visibility; 10-06 delivery states and audit.

- **Screens:** Communication Inbox; Trip Messages; Customer Timeline; Templates.

- **Rules:** Avinode messages via approved trip messaging APIs or deep link; email/SMS are separate integrations, not Avinode; no duplicate display on webhook replay (10 §6). **API:** /api/v1/communications.

### 5.12 Module 11 — Payments & Invoices (Paynode-dependent + Custom)

- **FRs:** FR-11-01 invoice issue and adjustment; 11-02 deposits, balances, due dates; 11-03 payment request and reference tracking; 11-04 receipts, refunds, partial payments; 11-05 operator payables and settlements; 11-06 reconciliation and exception queue.

- **Screens:** Payment Dashboard; Customer Payments; Operator Payments; Invoices (Draft, issued, partially paid, paid, void); Reconciliation.

- **Rules:** Paynode optional and separately approved; never store PAN or CVV; separate recorded, initiated and settled; provider webhooks alone are not accounting truth; until approved, provider-neutral ledger with imported records marked unverified (11 §6, §9). Required reference fields per 00 §8. **API:** /api/v1/payments.

### 5.13 Module 12 — Finance & Trip Profitability (Custom)

- **FRs:** FR-12-01 revenue and agreed price; 12-02 operator quotation and actual cost; 12-03 fees, taxes, FX, expenses; 12-04 gross profit and contribution margin; 12-05 budget vs actual; 12-06 period close, adjustments, approvals.

- **Screens:** Trip Finance; Profitability Overview; Expense Entries; Finance Adjustments.

- **Rules:** accounting is CRM-owned; decimal + ISO currency with booked FX rate and basis; ledger entries instead of editing posted amounts (12 §6). Gross profit = eligible revenue − operator costs − approved trip expenses (01 §4.2). **API:** /api/v1/finance.

### 5.14 Module 13 — Broker Commissions (Custom)

- **FRs:** FR-13-01 plans and effective dates; 13-02 per-trip calculation and preview; 13-03 splits and overrides; 13-04 eligibility based on booking and collected revenue; 13-05 approval, accrued, payable, paid; 13-06 disputes and adjustments.

- **Screens:** Commission Plans (thresholds, flat/percentage rates, dates); Trip Commission; Payout Queue; Broker Statement.

- **Rules:** versioned rules with snapshot on booking close; no payout before eligibility; Avinode does not calculate commission (13 §6). **API:** /api/v1/commissions.

### 5.15 Module 14 — Tasks & Follow-ups (Custom)

- **FRs:** FR-14-01 personal/team queues; 14-02 tasks linked to lead, customer, trip, RFQ, payment; 14-03 due dates, priorities, assignment, reminders; 14-04 recurring follow-ups; 14-05 completion, reassignment, escalation; 14-06 timeline and search.

- **Screens:** My Tasks; Team Queue; Task Detail; Follow-up Calendar.

- **Rules:** every task references a CRM object or free-standing context; organization timezone + UTC; RFQ events may create tasks via automation (14 §6). **API:** /api/v1/tasks.

### 5.16 Module 15 — Workflow Automation & AI (Custom + events)

- **FRs:** FR-15-01 rule builder; 15-02 RFQ response and quote-expiry alerts; 15-03 lead assignment and follow-up sequences; 15-04 payment overdue reminders and escalation; 15-05 AI quote summaries and email drafts; 15-06 approval and execution history, dry-run, disable.

- **Screens:** Automation Rules; Execution History; AI Assistant; Notification Center.

- **Rules:** Avinode webhooks trigger rules after idempotent ingestion; humans approve outbound AI content and financial/booking changes; rate limits, retries, dead letter, loop prevention (15 §6). **API:** /api/v1/automations.

### 5.17 Module 16 — Reports & Analytics (Hybrid)

- **FRs:** FR-16-01 sales funnel and conversion; 16-02 booking volume by route, operator, broker, month; 16-03 RFQ turnaround and operator response; 16-04 revenue, margin, payments; 16-05 commission and productivity; 16-06 exports, saved filters, scheduled delivery, access control.

- **Screens:** Analytics Overview; Sales & Pipeline; Charter Performance; Finance Reports; Exports (CSV/XLSX/PDF with audit).

- **Rules:** values from normalized CRM records; show sync latency and exclude incomplete external data transparently; distinguish booked, invoiced, collected and settled (16 §6). **API:** /api/v1/reports.

### 5.18 Module 17 — Administration & Integrations (Hybrid)

- **FRs:** FR-17-01 user invitation, roles, organization permissions; 17-02 team, broker, branch admin; 17-03 Avinode connection and status; 17-04 Paynode configuration; 17-05 webhook endpoint, subscriptions, replay; 17-06 settings, audit logs, feature flags, retention.

- **Screens:** Users & Roles (grants, assignments, disable, MFA); Avinode Connection (credential status, environment, permissions, last sync); Webhook Monitoring (received, processed, duplicate, failed, replay); Paynode Configuration (connection status, enabled capabilities); Audit & Settings (currency, timezone, retention, immutable changes).

- **Rules:** approved Avinode connection and permissions; credentials in vault, never client-side; sandbox separated from production with controlled rotation; Paynode conditional on contracted scope (17 §6). **API:** /api/v1/admin.

## 6. Workflows and scenarios

The main journey follows 00 §12; each step is taken by a person unless marked as system processing. No booking, payment or Avinode marketplace action happens automatically.

### 6.1 Main customer-to-completion workflow

1.  **Enquiry** — lead arrives by manual entry, website form, approved Avinode ClientLeads event or import (03 §5 step 1). Module 03.

2.  **Customer check** — normalized email/phone duplicate check; select existing or continue with justification (02 §5.1, LEAD-003). Module 02.

3.  **Lead capture** — lead created in New status with audit (LEAD-001/002). Module 03.

4.  **Assign, qualify, convert** — assignment policy or manager; broker confirms itinerary, budget, timeline; Qualified lead converts into opportunity linked to the 02 customer (03 §5 steps 3–5). Module 03.

5.  **Create trip** — draft trip with trip number from customer/opportunity (TRP-01). Module 04.

6.  **Itinerary and requirements** — legs with local time and timezone; passengers and requests (TRP-02/03). Module 04.

7.  **Sourcing** — validate, save draft, confirm, backend calls Avinode POST /trips with externalTripId and sourcing flag; store Avinode trip ID and deep links (05 §6) \[Conditional\].

8.  **Search and RFQs in Avinode** — broker opens searchInAvinode and sends RFQs in Avinode Web UI (00 §12 step 3). An API success does not prove RFQs were sent (05 §7).

9.  **Operator response** — operators quote or decline in Avinode (outside CRM).

10. **Synchronization (system)** — webhook stored and acknowledged; worker fetches GET /tripmsgs/{messageId}, GET /quotes/{id}, GET /rfqs/{id}; upsert and link to trip (06 §5).

11. **Proposal** — compare quotes, add markup/fees/tax, version, approve where required, send (FR-07-01–04). Module 07.

12. **Customer decision** — acceptance/decline recorded with revision tracking (FR-07-05).

13. **Booking** — accepted proposal converted to booking; trip Booked; opportunity Won; outcome reported to Avinode when known (00 §12 step 6; FR-08-01, FR-08-05; OPP-003). Who confirms is \[Needs decision\].

14. **Operations and communications** — checklist, documents, messages; post-flight closeout → Completed (FR-08-03/04, 10, 04 §5).

15. **Invoices and payments** — invoice, collections, operator payable, reconciliation (11). Paynode \[Conditional\].

16. **Profitability and commission** — trip margin and commission per approved rules (12, 13).

17. **Tasks, automation, dashboards, reports** — derived from CRM records and synchronized external data (00 §12 step 8; 01, 14, 15, 16).

### 6.2 Supporting workflows

- Duplicate merge and archive (02 §5.3); CSV import with preview and error report (CUS-013).

- Trip amendment, cancellation and outcome (04 §6.2).

- RFQ cancellation or changes synchronize to local status with history (06 §5 step 7).

- Manual / internal-only trip when Avinode is unavailable (TRP-11).

### 6.3 Alternative and exception scenarios

| Scenario                     | Defined behaviour                                                                                                                         | Source                                  | Status                                                  |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|---------------------------------------------------------|
| Customer already exists      | Duplicate prompt; link existing customer on conversion                                                                                    | 02 §5.1; 03 §5                          | Spec                                                    |
| Incomplete enquiry           | Lead needs name/org + one contact method + source; itinerary optional; qualification fields configurable; invalid leg data blocks Avinode | LEAD-001/002/005; 05 AT-02              | Spec; mandatory fields need decision                    |
| Customer cannot be contacted | SLA due-time, tasks, follow-up sequences exist; no closing rule                                                                           | LEAD-004; 14; 15                        | Needs decision                                          |
| Lead disqualified            | Disqualified with reason; Lost needs reason and optional retention follow-up                                                              | LEAD-005; OPP-003; 03 §5 step 8         | Spec                                                    |
| Duplicate customer/lead      | Suggest, never auto-merge; manager-reviewed transactional merge with audit; unique provider + external ID                                 | 02 §5.3, CUS-012; 03 §6                 | Spec                                                    |
| Departure date changes       | Audited edit; warn when RFQs exist; approved amendment workflow; PUT /trips/{id} only if permitted; post-booking changes in 08            | TRP-06; 05 §7; FR-08-03                 | Spec; edit rights need decision (04 §13)                |
| Invalid itinerary            | Field-level errors; no external call; no data loss                                                                                        | 04 §7, §12; 05 AT-02                    | Spec                                                    |
| No operator responds         | Overdue alerts; Attention Needed; manager escalation                                                                                      | RFQ-09; 01 §4.3; 06 §2                  | Overdue definition and next step need decision (06 §12) |
| Operator declines            | Decline recorded; RFQ partially responded/declined; other responses kept                                                                  | RFQ-04; 06 §6                           | Spec                                                    |
| Quote expires                | Expiry tracked; alert only with valid source expiry                                                                                       | FR-07-06; 15; 01 AC-05                  | Effect on proposals needs decision                      |
| Customer rejects proposal    | Decline + revision; or opportunity/trip Lost with reason                                                                                  | FR-07-05; OPP-003; 04 §5                | Spec; revision limits need decision                     |
| Customer cancels booking     | Mandatory reason and confirmation; manager approval per policy; Avinode cancel; Pending Sync / Sync Failed; terminal                      | FR-08-06; TRP-08; 04 §2, §5             | Fees, refunds, commission impact need decision          |
| Avinode disconnected         | Manual workflow; last-known data with "Sync delayed"; drafts kept; admin status                                                           | 00 §10; TRP-11; 01 §5; 05 AT-07; 06 §11 | Spec                                                    |
| Webhook delivered twice      | Idempotent handling; no duplicates or status regression                                                                                   | 00 §7; 02 AC-06; 06 §11                 | Spec                                                    |
| Payment outstanding          | Overdue view; reminders and escalation; receivables KPI; commission waits for eligibility                                                 | 11 §3; 15; 01 §4.2; 13 §6               | Escalation steps need decision                          |
| Access to restricted records | Server-side denial; forbidden or not found per policy                                                                                     | 01 AC-02; 02 AC-04; 05 AT-06            | 403 vs 404 needs decision                               |

## 7. Integration boundaries

The CRM integrates with Avinode only through the documented buyer-side workflow, and with Paynode only after its account and API scope are confirmed. Both are \[Conditional\] until Ayre's membership, sandbox and permissions are confirmed (00 §14, Critical).

### 7.1 Avinode operations referenced in the sources

| Operation                                                                              | Purpose                                                    | Owning module | Status                             | Source                |
|----------------------------------------------------------------------------------------|------------------------------------------------------------|---------------|------------------------------------|-----------------------|
| POST /trips (externalTripId, segments, sourcing)                                       | Create sourcing trip                                       | 04 / 05       | Documented; access unconfirmed     | 00 §7; 04 §10; 05 §10 |
| PUT /trips/{id}                                                                        | Send itinerary changes when permitted                      | 05            | Documented; permission to confirm  | 05 §10                |
| GET /trips/{id}                                                                        | Reconcile mapping and state                                | 05            | Documented                         | 05 §10                |
| searchInAvinode / viewInAvinode deep links                                             | Open Avinode UI; results stay in Avinode                   | 05, 03, 06    | Documented                         | 00 §7; 05 §10         |
| GET /airports/search                                                                   | Airport lookup inside trip workflow; no harvesting         | 05            | Documented                         | 05 §10                |
| GET /rfqs/{id}, GET /quotes/{id}                                                       | Read RFQ and quote after webhook                           | 06, 07        | Documented                         | 00 §7; 06 §9          |
| GET /tripmsgs/{messageId}                                                              | Read seller response / trip message                        | 06, 10        | Documented                         | 00 §7; 06 §9          |
| PUT /trips/{id}/cancel, PUT /trips/{id}/outcome                                        | Cancellation and outcome                                   | 04, 08        | Documented                         | 00 §7; 04 §10         |
| Webhooks: TripRequestSellerResponse, TripRequestMine, TripChatFromSeller, TripChatMine | Change notifications                                       | 06, 10, 04    | Documented                         | 00 §7                 |
| POST /webhooks/settings                                                                | Subscribe to events                                        | 17            | Documented; permission needed      | 03 §9; 04 §10         |
| ClientLeads webhook + GET /leads/{leadId}                                              | Import end-client leads                                    | 03, 02        | Conditional on approved connection | 03 §9, §14            |
| POST /leads                                                                            | Create end-client lead for an approved end-client app only | 03            | Conditional                        | 03 §9                 |
| POST /rfqs                                                                             | Direct RFQ creation                                        | 06            | Do not assume approved             | 06 §1, §9             |
| B2C POST /searches                                                                     | Aircraft search results                                    | —             | Not permitted for B2B CRM          | 00 §7; 05 §1          |
| Seller submitQuote                                                                     | Operator-side quoting                                      | —             | Not to be implemented              | 06 §9                 |
| General customer/contact CRUD sync                                                     | —                                                          | —             | No verified API; do not promise    | 02 §9                 |

### 7.2 Avinode guardrails \[Spec\]

- Keep operator-side and buyer-side endpoints distinct; validate permission scope (00 §7).

- Tokens and product headers server-side in a vault; never in frontend, source code or logs (00 §7; 05 §11; 17 §6).

- Webhook receiver authenticates, persists raw payload and event identity, enqueues, and returns HTTP 200 promptly (00 §7, §10; 04 §11).

- Follow provided href only to allowlisted Avinode hosts (SSRF protection) (03 §11; 06 §10).

- Idempotent handlers; tolerate duplicate and out-of-order events; retry 429/5xx with exponential backoff and jitter; dead-letter with authorized replay (03 §11; 06 §10).

- Show last successful sync timestamp and error states; fallback manual workflow (00 §7, §10).

- Integration states Not configured / Mock / Connected / Degraded / Error (00 §11). Feature flag OFF until sandbox approved; mock mode visibly labelled (05 §11, AT-10).

- Sandbox acceptance must demonstrate trip creation, deep-link handoff, webhook ingestion, RFQ/quote retrieval and cancellation/outcome before production (00 §13).

### 7.3 Paynode and payments boundary

- Paynode may support card/bank-transfer workflows, but each operation must be confirmed with Avinode/Paynode; no charge, refund or payout is "integrated" until sandbox access and API contract are validated (00 §8) \[Unverified\].

- Build the CRM ledger, receivables, operator payables, invoice statuses, profitability and reconciliation independently (00 §8).

- Required reference fields: CRM invoice ID; trip ID; customer/operator ID; provider transaction ID; currency; amount; gross/net; processing fee; payment status; payment date; source timestamp; reconciliation status; audit metadata (00 §8).

- Never store PAN/CVV; separate recorded, initiated and settled; provider webhooks are not accounting truth (11 §6).

### 7.4 Other external systems

Outbound email provider (00 §6); customer email/SMS are separate integrations, not Avinode APIs (10 §6). The provider, existing accounting and email systems are \[Needs decision\] (00 §14; 07–17 §12).

## 8. Data model, dependencies and status models

Every record has a stable internal ID and external Avinode/Paynode IDs stored separately (00 §10). Tables for 02–06 are specified; 07–17 give only a generic Record/History/ExternalResourceLink/Attachment pattern to be normalized in implementation (07–17 §7).

### 8.1 Core entities (00 §9 and module models)

| Entity               | Key fields / links                                                                                                                                                                                                                                                                            | Owner       | Source              |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|---------------------|
| Customer / Contact   | CustomerId, Type, DisplayName, LegalName, Tier, Status, OwnerUserId, TeamId, Source, RowVersion; Contacts; CustomerContacts (role, IsPrimary, ActiveFrom/To); ContactMethods (NormalizedValue)                                                                                                | 02          | 00 §9; 02 §7        |
| Lead / Opportunity   | Lead (Source, ExternalSourceId, Status, Priority, OwnerUserId, CustomerId?, ConvertedOpportunityId?); LeadItinerary; LeadQualification; Opportunity (StageId, EstimatedRevenue, Currency, Probability, ExpectedCloseUtc, OutcomeReason, LinkedTripId); PipelineStage; OpportunityStageHistory | 03          | 03 §7               |
| Trip                 | CharterTrips (TripNumber, CustomerId, OpportunityId?, OwnerUserId, Status, Source, PaxCount); TripSegments; TripRequirements; TripExternalLinks; TripStatusHistory; TripAttachments                                                                                                           | 04          | 04 §8               |
| Sourcing             | TripSourcing (CriteriaJson, Version); AvinodeTripMapping (ExternalTripId, AvinodeTripId, SearchDeepLink, ViewDeepLink); SourcingAttempt (IdempotencyKey); SourcingActivity                                                                                                                    | 05          | 05 §9               |
| RFQ / Operator quote | Rfq (ExternalRfqId, OperatorId, SourceStatus, NormalizedStatus, LastSyncedAt); RfqLift; RfqResponse; RfqQuoteLink (ExternalQuoteId, Currency, Amount?); RfqActivity                                                                                                                           | 06          | 06 §7               |
| Proposal / Booking   | ProposalId, TripId, Version, SellPrice; BookingId, AcceptedOn, Status                                                                                                                                                                                                                         | 07, 08      | 00 §9               |
| Invoice / Payment    | InvoiceId, TripId, DueDate, Balance; PaymentId, ProviderRef, Amount, Status + 00 §8 reference fields                                                                                                                                                                                          | 11          | 00 §8–9             |
| Commission / Task    | CommissionId, BrokerId, TripId, Rule, Amount; TaskId, OwnerId, DueAt                                                                                                                                                                                                                          | 13, 14      | 00 §9               |
| Integration / Audit  | IntegrationInbox / IntegrationEventInbox (Provider, event key/fingerprint, ReceivedAt, ProcessingState, Attempts); ExternalReferences (Provider + ExternalId unique); Audit (Actor, Action, Before/After, CorrelationId)                                                                      | 17 + owners | 00 §9; 02 §7; 06 §7 |
| Dashboard            | DashboardSavedFilter; ReportingKpiSnapshot (rebuildable cache); WorkspaceActivity; IntegrationSyncState; DashboardThresholdSetting                                                                                                                                                            | 01          | 01 §8               |

Key relationships (derived from the foreign keys above): Customer 1→n Opportunity; Opportunity 0..1→ Trip; Trip 1→n Segments, RFQs, Proposal versions; accepted Proposal → Booking; Trip → Invoices → Payments; Trip → Commission; CRM Trip 1→ at most one active Avinode trip (04 §7).

### 8.2 Module dependencies

| Module | Depends on / feeds                                                         | Source              |
|--------|----------------------------------------------------------------------------|---------------------|
| 01     | Reads 02, 03, 04, 06, 07, 08, 11, 12, 13, 14, 17                           | 01 doc control      |
| 02     | 17, 03, 04, 10, documents service                                          | 02 §14              |
| 03     | 02, 04, 14, 17                                                             | 03 §14              |
| 04     | 02, 03 supply IDs; 05–10 own linked records; 11–13 finance                 | 04 §12              |
| 05     | Depends 02, 03, 04; related 06, 07, 09, 10                                 | 05 doc control, §13 |
| 06     | 02, 04, 05; integrates 07, 09, 10, 15                                      | 06 §11              |
| 07–17  | "Customer CRM; Leads; Trips; RFQs; Finance; Admin (as relevant)" (generic) | 07–17 doc control   |

Implementation order (00 §15): 17 and 02 → 03 → 04 → 05 → 06 → 07 → 09 → 08 → 10 → 11–13 → 14–15 → 01/16.

### 8.3 Status models (separate per record)

| Record                                  | Statuses                                                                                                                               | Source                       |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| Lead                                    | New; Qualified / Disqualified (reason)                                                                                                 | 03 §5, LEAD-005              |
| Opportunity                             | Contacted → Qualified → Sourcing → Quoted → Negotiation → Won / Lost (configurable)                                                    | 03 §5                        |
| Trip (suggested)                        | Draft → Qualified → Sourcing → Quotes Received → Proposal Sent → Customer Accepted → Booked → In Progress → Completed; Lost; Cancelled | 04 §5                        |
| Sourcing                                | draft, ready, syncing, launched, RFQs pending, quoted, cancelled, integration error                                                    | AS-09                        |
| RFQ (normalized)                        | Draft/Unknown, Sent, Awaiting Response, Partially Responded, Quoted, Declined, Canceled, Closed                                        | 06 §6                        |
| Invoice                                 | Draft, Issued, Partially paid, Paid, Void                                                                                              | 11 §3                        |
| Payment                                 | recorded, initiated, settled (separate)                                                                                                | 11 §6                        |
| Commission                              | approval, accrued, payable, paid                                                                                                       | 13 §1                        |
| Proposal, Booking, Operator, Task, Rule | Not specified — "finalize state diagram"                                                                                               | 07–17 §12 \[Needs decision\] |
| Integration                             | Not configured / Mock / Connected / Degraded / Error; Synced / Pending / Failed / Requires Review; Pending Sync / Sync Failed          | 00 §11; 03 §11; 04 §5        |

### 8.4 Indexes and uniqueness constraints

These constraints enforce the no-duplicate rules in §6.3 (e.g. the same webhook twice must not create two records).

| Module | Indexes / unique constraints                                                                                                              | Concurrency                           | Source   |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|----------|
| 02     | (OwnerUserId, Status); customer name search; normalized contact method; (CustomerId, CreatedAt) for notes; unique (Provider, ExternalId)  | RowVersion / ETag                     | 02 §7    |
| 03     | Tenant + status + owner; opportunity stage + expected close; unique (TenantId, Provider, ExternalLeadId); inbox event fingerprint         | —                                     | 03 §7    |
| 04     | TripNumber unique; CustomerId / Status / OwnerUserId + date; unique (Provider, ExternalTripId) where populated; unique (TripId, Sequence) | RowVersion                            | 04 §8    |
| 05     | Unique TripId and ExternalTripId; foreign key to M04 trip                                                                                 | Version on TripSourcing               | 05 §9    |
| 06     | Unique provider + external IDs (ExternalRfqId per integration)                                                                            | Optimistic concurrency on local edits | 06 §7    |
| 07–17  | Foreign keys, compound organization indexes, unique external IDs, retention policies                                                      | RowVersion                            | 07–17 §7 |

## 9. Non-functional requirements and acceptance criteria

Non-functional targets are mostly qualitative; the only numeric targets are dashboard p95 ≤ 3 s and indexed directory queries under 1 s, both still to be benchmarked (01 §10, 02 §11).

### 9.1 Non-functional requirements

| Area               | Requirement                                                                                                                                                                         | Source                            |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| Architecture       | Modular monolith by feature domain; Next.js/React or Blazor; ASP.NET Core Web API; SQL Server or PostgreSQL; background jobs; secure credential store; central logging \[Proposed\] | 00 §6                             |
| API conventions    | /api/v1 versioning, correlation IDs, standard errors (RFC 7807 Problem Details), optimistic concurrency, idempotency keys for chargeable/outbound commands                          | 00 §11; 02 §8                     |
| Lists              | Search, filter, sort, pagination, loading/empty/error states, exports where applicable                                                                                              | 00 §10                            |
| Writes             | Validate input, actionable errors, server-side audit metadata                                                                                                                       | 00 §10                            |
| Time               | UTC storage; explicit timezones for departure/arrival; preserve airport-local date/time                                                                                             | 00 §10; 04 §7                     |
| Money              | Decimal precision, ISO currency, FX provenance; never sum mixed currencies directly                                                                                                 | 00 §10; 01 §8; 12 §6              |
| Security           | RBAC + row-level scope server-side; least privilege; secrets in vault with rotation; rate limiting; encryption in transit and at rest; PII masked in logs and telemetry; MFA        | 00 §6, §10; 01 §10; 02 §11; 17 §3 |
| Files              | Virus scan, size limits, ACLs, retention                                                                                                                                            | CUS-010                           |
| Performance        | Dashboard p95 ≤ 3 s typical scope (to be benchmarked); customer directory under 1 s at planned load (load test before committing SLO); 07–17: instrument before setting SLA         | 01 §10; 02 §11; 07–17 §10         |
| Reliability        | Webhook receive fast after durable persistence; retries, dead-letter, replay; reconciliation jobs; fallback manual workflow                                                         | 00 §10; 04 §11                    |
| Observability      | Structured audit, logs, metrics; alert on sustained outages, provider 4xx/5xx, queue delay, duplicate events                                                                        | 00 §6; 04 §11                     |
| Accessibility / UX | Keyboard navigation, visible focus, screen-reader chart summaries, responsive mobile/tablet/desktop (01); desktop-first responsive (07–17 §3)                                       | 01 §10; 02 §10                    |
| Environments       | Local mock → dev fixtures → Avinode sandbox → staging/UAT → production after provider go-live review                                                                                | 00 §11                            |
| Data protection    | Retention/deletion policy, consent preferences, export reason/audit, view logging where policy requires                                                                             | 02 §6; CUS-015                    |

### 9.2 Acceptance criteria (traceable)

| Area   | Criteria                                                                                                                                                                                                                                                                                                 | Source    |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| System | Six quality gates in §2                                                                                                                                                                                                                                                                                  | 00 §13    |
| 01     | AC-01 filters; AC-02 no cross-broker access via URL; AC-03 drill-down reconciles; AC-04 all states; AC-05 expiry alert only with valid expiry; AC-06 currency/basis labels; AC-07 workspace order; AC-08 "Not connected" and DEMO labels; AC-09 audited export; AC-10 tests for aggregates and timezones | 01 §11    |
| 02     | AC-01 create; AC-02 two contacts; AC-03 normalized search; AC-04 forbidden; AC-05 merge; AC-06 lead event twice; AC-07 import errors; AC-08 archived linked trip; AC-09 concurrency                                                                                                                      | 02 §13    |
| 03     | Create/qualify/convert without loss; no auto-merge; assignment rights; stage history; won/lost fields with immutable audit; webhook twice; retrieval failure visible; currency on metrics; responsive; production permissions verified                                                                   | 03 §13    |
| 04     | Multi-leg with timezone; clear errors; create Avinode trip once; RFQ webhook no duplicates; cancel/outcome with retry states; role scope and audit; manual flow works                                                                                                                                    | 04 §12    |
| 05     | AT-01 … AT-10                                                                                                                                                                                                                                                                                            | 05 §12    |
| 06     | New RFQ synced; multiple responses; duplicate webhook; cancelled RFQ; integration down; permission; manual resync; quote selection                                                                                                                                                                       | 06 §11    |
| 07–17  | AC-xx-01 … AC-xx-09 (generic)                                                                                                                                                                                                                                                                            | 07–17 §11 |

Definition of done is stated only in 02 §14: signed-off screens and fields; migrations and API contract merged; RBAC and audit validated; tests and fixtures; Avinode features behind configuration toggle; UAT criteria passed.

### 9.3 Architecture layers (00 §6) \[Proposed\]

| Layer                    | Responsibilities                                                                                  |
|--------------------------|---------------------------------------------------------------------------------------------------|
| Presentation             | Role-aware navigation, search/filter, tables, forms, validations, draft flows, integration states |
| Application / API        | Authentication, authorization, business services, approval workflows, DTOs, idempotent commands   |
| Domain & persistence     | Customer, opportunity, trip, quote, booking, invoice, payment, commission aggregates              |
| Integration adapters     | Avinode REST / deep links / webhooks; Paynode connector if approved; outbound email provider      |
| Async processing         | Webhook inbox, normalization, retries, alerts, scheduled follow-up jobs                           |
| Observability & security | Structured audit, logs/metrics, secrets management, least privilege, rate limiting                |

Data flow: CRM UI → CRM API → domain/database; CRM API → Avinode adapter → Avinode; Avinode webhooks → secure inbox → job worker → CRM projections; payment provider → payment adapter → reconciliation view (00 §6).

## 10. Conflicts and unresolved decisions

Eleven inconsistencies between source documents were found and are left unresolved here; the open decisions below come from the sources' own open-question lists.

### 10.1 Inconsistencies between source documents

| \#  | Topic                       | Conflict                                                                                                                                                                                   | Sources                              |
|-----|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| C1  | Role names                  | "Broker manager" (00 §2, 05 §3) vs "Sales Manager" (01–04, 06, 07–17); "Administrator" vs "System Admin"; "Executive / read-only" vs "Executive / Owner"                                   | 00 §2; 01 §2                         |
| C2  | Extra roles                 | Operations, Operations Manager, Finance/Viewer, Integration service not in the 00 §2 list                                                                                                  | 02 §2; 03 §2; 04 §2; 06 §2; 07–17 §4 |
| C3  | Sales stages                | 01 funnel Lead → Qualified → Quote Sent → Won/Lost vs 03 Contacted → Qualified → Sourcing → Quoted → Negotiation → Won/Lost                                                                | 01 §4.3; 03 §5                       |
| C4  | Trip statuses               | 01 chart Draft/Sourcing/Quoting/Confirmed/Completed/Cancelled vs 04 eleven-state model                                                                                                     | 01 §4.3; 04 §5                       |
| C5  | Trip Details tabs           | 00: Overview, Itinerary, Sourcing, RFQs, Quotes, Booking, Payments, Documents, Messages, Activity. 04: Overview, Itinerary, Sourcing & RFQs, Quotes, Booking, Documents, Activity, Finance | 00 §5; TRP-05; 04 §4                 |
| C6  | Avinode trip creation owner | POST /api/trips/{id}/avinode/create (04) vs POST /api/trips/{tripId}/sourcing/prepare-avinode (05, which claims the mapping)                                                               | 04 §9; 05 §8, §13                    |
| C7  | Route prefixes              | /api/v1/... (00, 01, 02, 07–17) vs /api/... (03, 04, 05, 06)                                                                                                                               | 00 §11; 03 §8; 04 §9                 |
| C8  | Module 17 classification    | "Hybrid" vs "Custom + Avinode/Paynode"                                                                                                                                                     | 00 §4; 17 doc control                |
| C9  | Responsive priority         | Mobile/tablet/desktop breakpoints (01) vs desktop-first (07–17)                                                                                                                            | 01 §10; 07–17 §3                     |
| C10 | Detail level                | 07–17 are template text; fields, states and entities are not specified                                                                                                                     | 07–17 §2, §7, §12                    |
| C11 | Booking creation            | "Customer approval creates booking record" (00 §12) vs "Convert accepted proposal into booking" as a user action (FR-08-01); confirmation owner open                                       | 00 §12, §14; 04 §13                  |

### 10.2 Open decisions

| Priority | Decision                                                                                                                                                                                                                                                                   | Source                                 |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| Critical | Avinode membership, API product, sandbox, buyer-side permissions, production approval; ClientLeads availability; whether CRM creates or only downloads end-client leads; allowed RFQ create/update operations; webhook subscription rights; Trip Board; empty-leg workflow | 00 §14; 02 §14; 03 §14; 05 §13; 06 §12 |
| Critical | Paynode account/API scope; whether payment status and settlement can be fetched; which payment events and attributes are permitted                                                                                                                                         | 00 §14; 01 §13; 11 §9                  |
| High     | Final roles and visibility; whether managers see margins, finance values, commissions                                                                                                                                                                                      | 00 §14; 01 §13                         |
| High     | Trip status taxonomy; booking confirmation responsibility; who records outcome; lost/cancel reason categories; who edits itinerary after RFQs                                                                                                                              | 00 §14; 04 §13                         |
| High     | Accounting and email systems, invoice ownership, payment currencies; revenue basis (invoiced, collected, recognized); reporting currency, FX policy, business timezone                                                                                                     | 00 §14; 01 §4.2, §13                   |
| High     | Pipeline stages, owner rules, SLA targets, lead sources and priorities; RFQ overdue/SLA and close criteria                                                                                                                                                                 | 03 §14; 06 §12                         |
| High     | Field-level requirements, state diagrams and transition permissions for 07–17; approval thresholds; markup/tax calculations; commission rules; customer messaging provider                                                                                                 | 07–17 §12                              |
| Medium   | Customer data: company vs person, mandatory fields, tiers, default owner, retention/privacy, export approval, passenger preference editing                                                                                                                                 | 02 §14                                 |
| Medium   | React/Next.js vs Blazor; database; deployment                                                                                                                                                                                                                              | 00 §14                                 |
| Medium   | Customer portal and e-signature as future phases                                                                                                                                                                                                                           | 00 §14                                 |
| Medium   | Dashboard KPIs, branding, mobile priority, export formats                                                                                                                                                                                                                  | 01 §13                                 |
| —        | Scenario gaps: uncontactable customer, no operator response follow-up, expired quote effect, revision limits, cancellation fees/refunds/commission, payment escalation, 403 vs 404                                                                                         | §6.3                                   |

### 10.3 Sources

Ayre Aviation Broker CRM specifications 00–17 (Version 0.1/1.0 drafts, 30 October 2026, SYSTEMSPHERES). Avinode references cited by the sources: [Developer Portal](https://developer.avinodegroup.com/), [Search in Avinode from your system](https://developer.avinodegroup.com/docs/search-in-avinode-from-your-system), [Webhooks](https://developer.avinodegroup.com/docs/avinode-webhooks), [API basics](https://developer.avinodegroup.com/docs/api-basics). Also cited in 00 §16: \[A2\] Avinode Workflow API Use Cases (developer.avinodegroup.com/docs/avinode-workflow-use-cases) and \[A3\] Create an RFQ, buyer/permission caveat (developer.avinodegroup.com/reference/createrfq_1). These links were not re-verified for this PRD.

## 11. Delivery plan

This section restates the build order and checklists that the specs themselves give. Nothing here is a new estimate or date.

### 11.1 Module build order (00 §15)

| Step | Modules                              | What it delivers                                                                     |
|------|--------------------------------------|--------------------------------------------------------------------------------------|
| 1    | 17 Administration and 02 Customers   | Users, roles, permissions, settings and the customer record everything else links to |
| 2    | 03 Leads & Opportunities             | Lead capture, qualification and the sales pipeline                                   |
| 3    | 04 Trips                             | The trip request and its Avinode trip link                                           |
| 4    | 05 Aircraft Sourcing                 | Prepare and launch the broker into Avinode                                           |
| 5    | 06 RFQs                              | RFQ tracking from Avinode webhooks                                                   |
| 6    | 07 Quotes & Proposals                | Operator quote vs customer proposal                                                  |
| 7    | 09 Operators                         | Operator directory                                                                   |
| 8    | 08 Bookings                          | Booking record after acceptance                                                      |
| 9    | 10 Communications                    | Messages and notes                                                                   |
| 10   | 11–13 Payments, Finance, Commissions | Money records \[Paynode unverified\]                                                 |
| 11   | 14–15 Tasks, Automation              | Follow-ups and rules                                                                 |
| 12   | 01 Dashboard and 16 Reports          | Read-only views over the data above                                                  |

### 11.2 Dashboard work packages (01 §12)

| Priority | Work package                  |
|----------|-------------------------------|
| P0       | Design system and layouts     |
| P0       | Mock data contracts           |
| P0       | Dashboard APIs                |
| P0       | Workspace APIs                |
| P0       | Role-based QA                 |
| P1       | Integration-derived data      |
| P1       | Export and configuration      |
| P1       | Performance and accessibility |

### 11.3 Leads & Opportunities sequence (03 §12)

1.  Stage reference data, permissions and migrations.

2.  Lead capture and lead detail UI, with customer lookup from 02.

3.  Opportunity list, Kanban board and stage transitions.

4.  Timeline, assignments and reminders.

5.  ClientLeads inbox \[Conditional on Avinode approval\].

6.  Connect to 04 Trips.

7.  Tests and UAT.

### 11.4 Module checklists

| Module       | Checklist items (as written in the spec)                                                                                                            | Source    |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| 02 Customers | Frontend screens; backend APIs; data model and migrations; integration links; quality and tests                                                     | 02 §12    |
| 05 Sourcing  | DTOs and validators; Avinode connector with mock and sandbox adapters; UI screens; mapping, retries and idempotency; tests; sandbox end-to-end test | 05 §14    |
| 06 RFQs      | List and detail endpoints; entities with unique external IDs; sandbox mapping; webhook testing; UI states; confirmations from Avinode and Ayre      | 06 §12    |
| 07–17        | Each spec says field detail must be confirmed before build (§12 of each)                                                                            | 07–17 §12 |

## 12. Glossary

Plain-language meaning of terms used in this PRD.

| Term                    | Meaning                                                                          |
|-------------------------|----------------------------------------------------------------------------------|
| Lead                    | A first enquiry, e.g. Ahmed asks for a Dubai→London flight. Not yet qualified.   |
| Opportunity             | A qualified lead that sales is actively working toward a sale.                   |
| Trip                    | The CRM record of the journey requested (route, dates, passengers).              |
| RFQ (Request for Quote) | A request the broker sends to operators through Avinode asking for a price.      |
| Operator quote          | The price an operator (e.g. SkyJet) returns in Avinode. Owned by Avinode.        |
| Proposal                | The price Ayre offers the customer (operator quote + markup). Owned by the CRM.  |
| Booking                 | The confirmed sale after the customer accepts a proposal.                        |
| Commission              | The broker's earnings calculated from a booking.                                 |
| System of record        | The one system whose copy of a piece of data is the official one (00 §3.3).      |
| Webhook                 | A message Avinode sends to the CRM automatically when something changes.         |
| Deep link               | A URL that opens Avinode directly on the right trip (searchInAvinode).           |
| Idempotent              | Processing the same message twice gives the same result as once (no duplicates). |
| Dead-letter             | A holding place for messages that failed all retries, for manual review.         |
| RBAC                    | Role-based access control: what a user can do depends on their role.             |
| Row-level scope         | Limits which records a user sees (e.g. only their own customers).                |
| UTC                     | Universal time; all timestamps are stored in UTC and shown in local time.        |
| ISO 4217                | Three-letter currency codes, e.g. USD, AED, GBP.                                 |
| PAN / CVV               | Card number and security code. The CRM must never store them.                    |
| Sandbox                 | Avinode's test environment, used before going live.                              |
| \[Proposed\]            | Suggested by the spec, not yet approved.                                         |
| \[Conditional\]         | Depends on an approval (e.g. from Avinode) that is not yet given.                |
| \[Unverified\]          | Not confirmed with the provider (e.g. Paynode).                                  |
| \[Confirm\]             | A business decision is needed before build.                                      |

## 13. Source coverage matrix

Every numbered section of all 18 specs, and where it is covered. "UI" means the UI Field Mapping document.

| Doc             | Sections → where covered                                                                                                                                                          |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 00 Master       | §1→2 · §2→2, 3 · §3→4 · §4→4.4 · §5→4.5, UI 2 · §6→9.1, 9.3 · §7→7 · §8→7.3 · §9→8.1 · §10→9.1 · §11→9.1 · §12→6.1 · §13→2, 9.2 · §14→10.2 · §15→8.2, 11.1 · §16→10.3             |
| 01 Dashboard    | §1→5.1 · §2→3.2–3.3 · §3→5.1, UI 2–3 · §4→5.1, UI 3.1–3.3 · §5→UI 3.4 · §6→4.3, 8 · §7, §7.1→UI 12 · §8→8.1, 9.1 · §9→5.1, 7 · §10→9.1 · §11→9.2 · §12→11.2 · §13→10.2 · §14→10.3 |
| 02 Customers    | §1→5.2, 4.3 · §2→3 · §3→UI 4 · §4→5.2 · §5→5.2, 6 · §6→5.2, UI 4.2 · §7→8.1, 8.4 · §8, §8.1→UI 12 · §9→7.1 · §10→UI 1.1, 4 · §11→9.1 · §12→11.4 · §13→9.2 · §14→8.2, 9.2, 10.2    |
| 03 Leads & Opps | §1→5.3 · §2→3 · §3→UI 5 · §4→5.3 · §5→6.1, 8.3 · §6→5.3, UI 5 · §7→8.1, 8.4 · §8→UI 12 · §9→7.1 · §10→10.3 · §11→7.2, 9.1 · §12→11.3 · §13→9.2 · §14→10.2                         |
| 04 Trips        | §1→5.4 · §2→3 · §3→5.4 · §4→UI 6 · §5→8.3 · §6→6 · §7→5.4, UI 6.2 · §8→8.1, 8.4 · §9→UI 12 · §10→7.1 · §11→7.2, 9.1 · §12→9.2, 8.2 · §13→10.2                                     |
| 05 Sourcing     | §1→5.5, 4.2 · §2→4.2 · §3→3 · §4→UI 7.1–7.2 · §5→5.5 · §6→6.1 · §7→5.5 · §8→UI 12 · §9→8.1 · §10→7.1 · §11→7.2 · §12→9.2 · §13→10.2, 8.2 · §14→11.4                               |
| 06 RFQs         | §1→5.6 · §2→3 · §3→UI 7.3–7.4 · §4→5.6 · §5→6.1 · §6→5.6, 8.3 · §7→8.1 · §8→UI 12 · §9→7.1 · §10→7.2 · §11→9.2 · §12→10.2, 11.4                                                   |
| 07–17 (each)    | §1→5.8–5.18, 4.2 · §2→5.8–5.18 · §3→UI 8–10 · §4→3.3 · §5→5.7 · §6→5.8–5.18 · §7→5.7, 8 · §8→UI 12 · §9→7 · §10→9.1 · §11→9.2 · §12→10.2, 11.4, UI 11                             |

Result: no numbered section of any spec is left uncovered. Sections in 07–17 are template text (C10), so their coverage is at the level the spec gives; detail is marked \[Confirm\].


<!-- ORIGINAL-PRD-CONTENT-END: sections 1-13 above; untouched source text -->

---

# 14. Team meeting outcomes — frontend-only addendum (supersedes earlier *open* UI decisions where stated)

## 14.1 Purpose and evidence boundaries

This section records the **30 discussion points supplied by the project team** after the earlier PRD was drafted. It is an **additive meeting record**: Sections 1–13 above have deliberately not been rewritten, deleted, or silently reconciled. This preserves the original specification baseline for comparison and audit.

**The active assignment is a navigable frontend prototype for all 17 modules, with local JSON/mock data.** Real server authorization, database persistence, payments, Avinode synchronization, webhooks, email delivery, deduplication, monetary calculations, and scheduling require later backend work and business/provider decisions. The frontend should nonetheless depict required workflows, role-aware navigation, validation messages, empty states, and realistic failure states, without claiming those capabilities already work in production.

**Decision labels used from this point onward:**

| Label | Meaning for an AI or developer |
|---|---|
| `[MEETING-AGREED-FE]` | Reported as agreed in the meeting; implement its *frontend demonstration or UI treatment* now. Not evidence of production sign-off. |
| `[MEETING-DIRECTION]` | An agreed direction, but the precise field list, wording, thresholds, or design still needs clarification. |
| `[DEFERRED-BE]` | Backend/business logic discussed but **not decided**; keep a placeholder/demo state only where useful, do not manufacture operational behavior. |
| `[PENDING-PROVIDER]` | Avinode/Paynode legality, documentation, permission, or account access has not been verified. |
| `[UNRESOLVED]` | The meeting did **not** answer the question; do not describe it as settled. |
| `[SPEC-BASELINE]` | The earlier PRD/underlying 00–17 source remains authoritative for stated boundaries and longer-term requirements. |
| `[UI-SUGGESTION]` | A useful illustrative control or label proposed in this addendum, **not** directly approved in the meeting. |

**Scope and precedence rule:** Use the meeting's frontend decisions for mock UI behavior, while keeping the original specifications and security/integration restrictions intact. A meeting decision for a demo **must not** imply real Avinode operator confirmation, a completed payment, verified legal approval, or implemented backend enforcement. If the meeting summary lacks a value (e.g., a penalty amount), it remains unknown.

## 14.2 Meeting decision ledger — all 30 issues retained

Each `MTG-xx` entry reflects **one discussion point from the supplied meeting summary**. The frontend implication column is an implementation interpretation, not an additional business decision.

| ID | Meeting topic | Recorded outcome | Status | Frontend consequence / explicit limit | Legacy PRD location |
|---|---|---|---|---|---|
| MTG-01 | Incomplete new-lead flight details | Allow lead creation from basic customer details without a complete itinerary. | `[MEETING-AGREED-FE]` | New Lead form must not require every travel leg/date just to create the lead. | §5.3, §6.3 |
| MTG-02 | When a lead is qualified | Qualify a lead only after required flight details are supplied. | `[MEETING-AGREED-FE]` + `[UNRESOLVED]` | Separate Create Lead from Qualify action; exact required flight-details checklist was **not listed**. | §5.3, §8.3 |
| MTG-03 | Required lead email | Email is required to contact the customer. | `[MEETING-AGREED-FE]` | Mark email required in frontend Lead form; this is stricter than the earlier source's “one contact method” rule, which remains in §5.3. | §5.3, §6.3 |
| MTG-04 | Existing customer / duplicate | Defer because current build uses JSON and lacks backend database. | `[DEFERRED-BE]` | No real duplicate matching/merging. Existing customer lookup may be mocked, visibly as demo, but no claimed resolution. | §5.2, §6.3 |
| MTG-05 | Lead itinerary vs trip structure | Handle trip segments in UI first; review data structure later. | `[MEETING-DIRECTION]` / `[DEFERRED-BE]` | Build segment controls; do not claim database schema or lead-to-trip copying is approved. | §8.1, §10.2 |
| MTG-06 | Multiple segments for one trip | Use plus/add control to add extra trip segments. | `[MEETING-AGREED-FE]` | Dynamic repeatable leg rows, preserving order. | §5.4, §8.1 |
| MTG-07 | Date change after RFQ | Treat as a change/possible penalty issue, depending on operator rules and future backend. | `[MEETING-DIRECTION]` / `[DEFERRED-BE]` | Display change warning; do not auto-issue a fee or pretend to update Avinode. | §6.3, §5.4 |
| MTG-08 | Reschedule/cancel penalty | Penalty depends on operator policy; client may bear it if operator charges. | `[DEFERRED-BE]` | Explain “Operator change/cancellation charges may apply”; amount and approval require confirmation. | §6.3, §5.9 |
| MTG-09 | Trip Details layout | Use multiple tabs instead of one crowded tab. | `[MEETING-AGREED-FE]` + `[UNRESOLVED]` | Tabbed Trip Details required; final exact tab names/combined vs separate layout not explicitly chosen. | §4.5, §10.1 C5 |
| MTG-10 | Aircraft search inside CRM | Check Avinode documentation and show only legally permitted functionality. | `[PENDING-PROVIDER]` | Do not build alleged live in-CRM marketplace results; show approved-link handoff/mock disconnected states. | §4.2, §5.5, §7 |
| MTG-11 | Avinode connection fails | Show connection-failure/error state. | `[MEETING-AGREED-FE]` | Visible error badge, helpful explanation, mock retry/return; no fake success. | §5.5, §7.2 |
| MTG-12 | Unanswered RFQ reminders | Deferred to backend/business-rule discussion. | `[DEFERRED-BE]` | Present awaiting-response/overdue demo where available; no invented reminder intervals. | §5.6, §6.3 |
| MTG-13 | Multiple quotes from one operator | Display all operator quotations. | `[MEETING-AGREED-FE]` | RFQ/Quote Inbox supports multiple rows/cards, retains earlier entries. | §5.6, §5.8 |
| MTG-14 | Expired quotes visibility | Keep expired quotations in history, visibly tagged Expired. | `[MEETING-AGREED-FE]` | History and quote lists retain expired rows. | §5.8, §6.3 |
| MTG-15 | Expired quote selection | Expired quotations **cannot be selected**. | `[MEETING-AGREED-FE]` | Disable quote-select action for expired rows; explain why. | §5.8, §6.3 |
| MTG-16 | Whether proposal approval required | Manager approval is required for proposals. | `[MEETING-AGREED-FE]` | Proposal submission flow includes mandatory approval step in demo. | §5.8, §10.2 |
| MTG-17 | Proposal approver | Submit proposal to manager for approval first. | `[MEETING-AGREED-FE]` | Broker request approval; manager approves/rejects; mock UI tracks state. | §3.2, §5.8 |
| MTG-18 | Editing sent proposal | Do not edit a proposal already sent. | `[MEETING-AGREED-FE]` | Sent proposal view is read-only; prevent direct overwrite in UI. | §5.8 |
| MTG-19 | Proposal revisions | Send a **new proposal** rather than editing the sent proposal. | `[MEETING-AGREED-FE]` | “Create New Proposal / Revision” flow; preserve old sent item in history. Exact storage/version relationship remains a later design detail. | §5.8 |
| MTG-20 | Preferred / blocked operator | Manager controls preferred/blocked operator markings. | `[MEETING-AGREED-FE]` | Manager-only visible/editable demo action; broker sees label read-only. | §5.10, §3.3 |
| MTG-21 | Acceptance → booked | Customer acceptance marks trip **Booked in the CRM flow**. | `[MEETING-AGREED-FE]` | Simulate `Booked` on acceptance, while **not** asserting final operator confirmation. | §5.9, §6.1, §8.3 |
| MTG-22 | Operator confirmation timing | Tell customer confirmation may take **1–2 business days or the operator's actual timeframe**. | `[MEETING-AGREED-FE]` | Show non-guaranteed information; do not promise a fixed SLA. | §5.9, §10.2 |
| MTG-23 | Wording before final confirmation | Say the request was received and is being processed; no promise of instant final booking. | `[MEETING-AGREED-FE]` | Provide explicit pending operator-confirmation message beside CRM Booked indicator. | §5.9, §6.1 |
| MTG-24 | Different dashboard statuses / role visibility | Meeting clarified **executive = broad overview**, **manager = team**, **broker = limited access**. | `[MEETING-DIRECTION]` + `[UNRESOLVED]` | Role-specific mock dashboards. **This did not resolve the detailed-to-summary trip-status mapping**; sensitive-field access remains restricted by original specification. | §3.3, §5.1, §10.1 C4 |
| MTG-25 | Booking-document access | Manager broad access; broker role-based; client sees only relevant flight/price information. | `[MEETING-DIRECTION]` | Mock scoped document tabs. No customer login/portal was approved; a client-facing summary preview is not a portal. Sensitive-document/finance permissions still need review. | §3.3, §5.9 |
| MTG-26 | Operator vs customer messages | Separate into tabs; do not merge into one inbox. | `[MEETING-AGREED-FE]` | Distinct `Operator Messages` and `Customer Messages` tabs within the relevant communications UI. | §5.11, §4.5 |
| MTG-27 | Invoice and deposit timing | Invoice/deposit **flow starts when customer accepts proposal**. | `[MEETING-AGREED-FE]` | Simulate invoice/deposit next-action at acceptance; no automatic real charge, amount, or payment instruction specified. | §5.12, §6.1 |
| MTG-28 | Partial payment / refund | Deferred to stakeholders and backend. | `[DEFERRED-BE]` | Screens may show illustrative states, but do not implement refund/settlement logic or claim verification. | §5.12, §7.3 |
| MTG-29 | Dashboard revenue | Show **both invoiced amount and collected amount**. | `[MEETING-AGREED-FE]` | Two distinct financial metrics (invoiced vs collected), with currency and demo labels; preserve source warning against summing incompatible currencies. | §5.1, §5.17 |
| MTG-30 | Commissions / follow-ups / duplicate-trip prevention and other backend logic | Deferred to later backend and business-rule discussions. | `[DEFERRED-BE]` | Keep nonfunctional prototype placeholders where useful; don't infer calculations, scheduler behavior, or reliable API idempotency from mocked clicks. | §5.14–5.16, §6.3, §7, §8.4 |

## 14.3 Decisions that were **not** finalized by this meeting

The meeting did **not** fully approve: (a) the exact mandatory flight fields that qualify a lead; (b) lead-to-trip copying and persistent data structure; (c) final names/groups for Trip Details tabs; (d) normalized Trip Status → Executive Dashboard Trip Status mapping; (e) all role/field-level visibility, including executive access to sensitive finance or identity documents; (f) exact operator-confirmation process and whether any distinct production Booking status is needed; (g) operator penalty amounts or policy details; (h) proposal price/markup/tax calculation; (i) Avinode API rights and legally permitted search; (j) payment/deposit amounts, verification, refund and partial-payment processing; (k) commissions, automated follow-ups, duplicate handling, or backend workflow rules. These must remain labeled **to confirm**, not fabricated as meeting decisions.

# 15. Frontend-first implementation requirements derived from the meeting

## 15.1 What the team is building **now**

- A **navigable frontend prototype across all 17 modules**, implementing the pre-existing screen inventory from the original PRD and its companion UI mapping. This meeting adds decisions; it **does not remove any existing module**.
- Use **local JSON fixtures / mock service adapters** for page content and simulated actions. All data and integrations must be visibly labeled `DEMO DATA` / `MOCK MODE` / `NOT CONNECTED` where appropriate.
- Supported UI interactions may update **in-memory demo state** and show a confirmation banner; persistence across browser reloads is optional and should not be described as real database persistence. If reload persistence is implemented in the demo, mark it simulated.
- Prototype work can cover screens related to future backend features, but those controls should have explicit mock/disabled/unavailable states rather than claiming business rules have been settled.
- Keep the module ownership and external-system boundaries defined in §§3–7 above: operator RFQs/marketplace quotes remain Avinode-owned; CRM customer proposals/bookings remain CRM-owned; Paynode is unverified.

## 15.2 Required frontend flows now — scenario acceptance conditions

### FE-FLOW-01 — New Lead → Qualified → Opportunity (M02/M03)

**Scenario:** Ahmed contacts Ali for a Dubai → London charter but cannot specify his departure date yet.

1. Ali opens the New Lead screen; enters **email** and other information specified by the original lead form. Email is required for the **meeting-approved frontend lead form**. Name/organization and enquiry source remain required by the legacy spec.
2. Ali can click **Save Lead** even though itinerary date or certain flight details are missing; the UI shows lead status `New` in mock data.
3. The separate **Qualify** action checks for the required flight details. The exact field checklist is **to confirm**; in the demo, clearly label any illustrative checklist as proposed/mock instead of claiming Ayre approved those fields.
4. Once the demo's documented checklist passes, Ali can simulate qualification/conversion to Opportunity. Do not imply a backend database or completed duplicate-check process.

**Acceptance evidence:** Lead can be created without a complete itinerary but **not without the email** under meeting-approved frontend treatment. The UI distinguishes Save Lead from Qualify. `New` and `Qualified` are not the same action.

### FE-FLOW-02 — Multiple Trip Segments (M04)

**Scenario:** Ahmed wants Dubai → London, then London → Paris.

1. Ali opens Create/Edit Trip and sees a first leg row.
2. Clicking **+ Add Segment** adds a second row with its own airports, travel date/time, and other existing-source leg fields; keep the leg order visible.
3. Each row can be reviewed and edited before the mock trip is saved.
4. Explain that LeadItinerary contains early enquiry travel details, while TripSegments contains **individual legs of the created trip**. Any automatic data-copying or database linkage beyond the source is **deferred**.

**Acceptance evidence:** Two legs are visible on the same trip, not two unrelated trips; no claim of finalized backend schema.

### FE-FLOW-03 — Change/Cancel after an RFQ (M04/M05/M08)

**Scenario:** Ali sent an RFQ; Ahmed wants to change the departure date.

1. The frontend warns that operator quotes may need revisiting and **operator charges may apply**.
2. It must **not** automatically calculate a penalty, issue a charge, alter Avinode, or state a final operator penalty rule.
3. Simulated change screens should show a pending decision or informational prompt without portraying unverified external action as completed.

**Acceptance evidence:** Clearly understandable warning; no fabricated penalty amount or success from Avinode.

### FE-FLOW-04 — Trip Details tabs (M04 and cross-module workspace)

**Scenario:** Ali opens trip `TRP-1001` to review itinerary, sourcing, RFQs, quotes, booking, finance, documents, and messages.

1. Show **multiple readable tabs** rather than one dense screen.
2. Every tab has an understandable label and navigation; links are to module-appropriate content.
3. Since Document 00 and M04 offer **different tab lists**, the final names and separation must remain marked `[UNRESOLVED]`; select one **clearly proposed prototype arrangement** if needed but do not describe it as approved by the meeting.

**Acceptance evidence:** Tabbed layout works; chosen tab map is recorded for supervisor review.

### FE-FLOW-05 — Avinode boundary + failure UI (M05/M06/M17)

**Scenario:** Ali attempts aircraft sourcing from the trip.

1. Show Avinode launch/context and connection state, **not** an invented live Avinode aircraft-results database inside CRM.
2. If disconnected, show `Not connected` / `Connection failed`, what was preserved, and a safe mock retry/help action. Avoid showing a successful source sync unless the mock is explicitly labeled.
3. Any actual `searchInAvinode` URL requires an authorized, real provider response in a later integration phase; do **not** fabricate the URL.

**Acceptance evidence:** Clear failure state; no alleged real marketplace results, token exposure, or live access.

### FE-FLOW-06 — RFQ and quote list including expiry (M06/M07)

**Scenario:** SkyJet sends two mock quotations, one valid and one expired.

1. Both quotations appear in the quotation list/history, each with a visible source, currency, and status in fixture data.
2. The expired row receives an `Expired` badge and stays in history.
3. The **Select Quote** control is **disabled** for expired quotes; show a short explanation such as “This quote has expired and cannot be selected.”
4. Display all quotes from the operator, not just the latest one. A quote response must **not** automatically count as accepted or booked.

**Acceptance evidence:** User can inspect expired quotation but cannot choose it for a new proposal.

### FE-FLOW-07 — Proposal approval and revision (M07)

**Scenario:** Ali chooses a valid SkyJet quote, builds a proposal, and wants to send it to Ahmed.

1. Ali prepares an editable **draft**. Before sending, the demo requires **manager approval**; show `Submit for Manager Approval`.
2. Sara (Manager role) can open a mock approval queue and approve or reject the proposal. The **exact pricing/discount thresholds** were not defined; the meeting's frontend decision is approval for proposals.
3. Only after approval does the demo allow the **Send Proposal** action. Sending is simulated and must not claim an email actually left the system.
4. When a proposal is `Sent`, keep it **read-only**. To revise, start a **new proposal** linked in the demo to the previous one, preserving the original in history.
5. The precise versioning/data-model representation of the new proposal is deferred; do not overwrite the sent record in the UI model.

**Acceptance evidence:** Broker cannot skip manager approval; manager UI exposes an approval step; sent proposal is immutable in the prototype; revision creates another identifiable item.

### FE-FLOW-08 — Acceptance → CRM Booked, but no instant operator promise (M07/M08/M04)

**Scenario:** Ahmed accepts Ali's approved, sent $55,000 proposal.

1. For the **agreed frontend CRM flow**, acceptance sets the displayed **trip status** to `Booked` and links a simulated booking record.
2. At the same time, **the user-facing/customer-facing communication must not say that SkyJet has finally confirmed the aircraft**. The meeting says customer confirmation may take **1–2 business days or the actual timeframe provided by the operator**.
3. Keep these concepts distinct in the UI: `Booked (CRM workflow)` versus `Operator confirmation: being processed / awaiting confirmation` **[UI-SUGGESTION for exact wording]**. This is not approval of a new backend status enum.
4. Suggested customer-facing text, for review: **“We have received your acceptance and are processing the booking. Final operator confirmation will follow based on the operator's timeline; this may take 1–2 business days or the timeframe communicated by the operator.”** Do not guarantee a specific duration.
5. Preserve the fact that original M04 has additional booked-state prerequisites; the final backend/real-world meaning of `Booked` and any required operator checks remain an open **production** design decision.

**Acceptance evidence:** CRM demo reflects `Booked` after customer acceptance **and** shows unconfirmed operator fulfillment honestly. No guaranteed flight/operator confirmation claim.

### FE-FLOW-09 — Role-based surfaces and documents (M01/M02/M08/M09/M17)

**Scenario:** Ali (Broker), Sara (Manager), and an Executive open the same project demo.

1. **Executive** sees a broad company dashboard and navigation appropriate to executive reporting. Meeting phrase “sees everything” must **not** be used to grant blanket sensitive identity/finance access contrary to the original PRD.
2. **Manager** sees team-scoped records and manager approval actions; can set an operator to `Preferred` or `Blocked` in the demo.
3. **Broker** sees limited/assigned records and read-only manager-only actions; a role badge and appropriate disabled/hidden states may demonstrate differences.
4. **Booking documents:** meeting direction gives manager broad document access and broker role-scoped access; client should only be shown relevant flight and price details, not internal documents. A **client-facing preview** is acceptable as demonstration; it does **not** authorize building a real customer portal.
5. Final role naming (Broker Manager vs Sales Manager), finance visibility, and field-level sensitive-document rights remain under approval.

**Acceptance evidence:** Switching demo roles changes visible lists/actions; broker cannot trigger manager-only UI actions; mock permissions are expressly **not** backend security enforcement.

### FE-FLOW-10 — Split communications (M10)

**Scenario:** SkyJet sends an operator message; Ali separately contacts Ahmed about the proposal.

1. Show distinct `Operator Messages` and `Customer Messages` tabs (meeting-approved separation).
2. Operator messages are displayed as external-source mock/reference data, never invented Avinode-sent messages.
3. Customer messages are internal/customer-communication mock records, without claiming actual email/SMS delivery.

**Acceptance evidence:** Messages are visually separated and correctly labeled by their source.

### FE-FLOW-11 — Invoice/deposit after acceptance, with separate revenue cards (M11/M01/M16)

**Scenario:** Ahmed accepts a $55,000 proposal; a demo invoice shows $55,000 invoiced and $20,000 collected.

1. Acceptance reveals or starts the **Invoice / Deposit** frontend step, consistent with the meeting. Any actual invoice issuance, deposit collection, or payment request is **simulated only**.
2. Executive Dashboard / relevant Finance Reports show **both Invoiced Amount and Collected Amount**, not a single unlabeled “revenue” figure.
3. Clearly mark sample amounts `DEMO DATA`, preserve currency (USD), and keep a **remaining amount** display only as a transparent arithmetic illustration, not a claim that payment reconciliation is implemented.
4. Partial-payment processing, refund workflows, deposit percentages, settlement/verification, and actual financial calculations remain **deferred**.

**Acceptance evidence:** $55,000 invoiced versus $20,000 collected are displayed as separate figures, consistently labeled; no live payment status asserted.

### FE-FLOW-12 — Deferred future logic stays recognizable, but not invented (M02/M12–M15/M17)

- Customer duplicate detection, real merge, and persistence: backend deferred.
- Commission formula, split, payout eligibility and approvals: backend/business deferred.
- Unanswered RFQ reminder timing, automated follow-up scheduling, background jobs, and AI outbound delivery: backend/business deferred.
- Reliable duplicate external-trip prevention and webhook replay: backend deferred. A UI loading state can discourage repeated clicks, but **that alone is not idempotency**.
- Operator change/cancellation charges: rule and amount deferred, operator-dependent.
- Paynode and Avinode real operations: provider validation deferred.

**Acceptance evidence:** Appropriate labeled mock states exist; neither UI copy nor generated code asserts the backend is already implemented.

# 16. Screen and component addendum for AI frontend generation

This section **supplements** the original screen inventory (§§4–5 and companion UI Mapping). It does not attempt to invent a complete final field-level model for Modules 07–17.

| Module | Relevant page or UI area | Confirmed meeting-related elements / behavior | Clarification / limitation |
|---|---|---|---|
| **01** Dashboard & Workspace | Executive Dashboard, role-specific summary | Distinct `Invoiced Amount` and `Collected Amount` display; role-scoped overview | Detailed trip-status chart mapping **still unresolved**. Financial detail access still permission-gated. |
| **02** Customers | Customer Directory, customer picker, duplicate review | Mock customer selection for lead/trip context | Real dedupe and merge deferred; JSON demo is not a customer database. |
| **03** Leads & Pipeline | New Lead, Lead Detail, Qualify, Opportunity | Email required in Lead form; incomplete flight information allowed on creation; qualification separated | Exact checklist of required flight fields remains open; other legacy required fields still apply. |
| **04** Trips | Create/Edit Trip, Trip Details, Change/Cancel | `+ Add Segment` repeater; multi-tab Trip Details; change/penalty warning | Final tab inventory and backend itinerary data mapping not decided. |
| **05** Aircraft Sourcing | Sourcing tab, launch, connection status | Avinode handoff/authorization state, clear connection failure | No native live aircraft search-results UI without provider approval. |
| **06** RFQs | RFQ Overview, Detail, Response Inbox | Show all available quote responses, source and status badges | Overdue timing and real synchronization deferred. |
| **07** Quotes & Proposals | Quote Inbox, Comparison, Proposal Builder/Detail | Keep expired quotes visible but unselectable; manager approval before send; sent immutable; new proposal for revision | Price/tax/markup formulas and exact fields remain open. |
| **08** Bookings | Booking Detail, Operations Checklist, confirmation display | On acceptance, show trip `Booked` in CRM demo and communicate final operator confirmation is still in process | Do not claim operator fulfillment confirmed; underlying production booking states await agreement. |
| **09** Operators | Operator Profile / Directory | Manager can mark `Preferred` or `Blocked`; broker sees status | Exact operator compliance and blocking enforcement remain open. |
| **10** Communications | Communication Inbox / Trip Messages | Separate `Operator Messages` and `Customer Messages` tabs | Real Avinode messaging and email/SMS provider not implemented. |
| **11** Payments & Invoices | Invoice / Payment Dashboard | Invoice/deposit UI step begins at acceptance; demo invoiced/collected figures | No payment integration, refund process, settlement, or decided deposit policy. |
| **12** Finance | Trip Finance / Profitability | Retain specified screens and sample money breakdowns | Calculation/adjustment logic is future work. |
| **13** Commissions | Plans, Trip Commission, Queue | Retain demo screens with clear pending/illustrative amounts | Commission formulas and payout rules deferred. |
| **14** Tasks | My Tasks, Team Queue, Calendar | Retain task and reminder UI with fixture records | Automated creation and due-time policy deferred. |
| **15** Automation & AI | Rule Builder, Execution History, AI Assistant | Simulated disabled/dry-run/previews only where clearly labeled | No live scheduler, email send, or AI financial execution. |
| **16** Reports | Analytics Overview, Finance Reports | Invoiced and collected shown distinctly, consistent with M01 | Real aggregations/rates and currency conversion await backend. |
| **17** Admin & Integrations | Users & Roles, Avinode/Paynode Connection, Webhook Monitoring | Role demo presets and `Not Connected` / failure states | No real tokens, provider authentication, credential validation, or subscription setup. |

**Component expectations for all relevant demo screens** `[SPEC-BASELINE]`: clear page heading, contextual trip/customer reference, appropriate search/filters, visible status chips and timestamps, multi-row list and empty states, readable validation messages, keyboard-operable controls, role-aware actions, and transparent `MOCK`/`NOT CONNECTED` labels. Use the companion UI Field Mapping for existing source-specific fields; if it does not define a field, tag the choice `[UI-SUGGESTION]` rather than calling it a confirmed requirement.

## 16.1 Button/action matrix — prevent misleading mock behavior

| UI action | Prototype behavior | Never claim |
|---|---|---|
| `Save Lead` | Add/update a JSON-backed mock lead in demo state if email and stated minimum form conditions pass. | Real CRM database persistence, dedupe, or webhook creation. |
| `Qualify Lead` | Demo transition only after labelled checklist conditions. | Full Ayre-approved checklist is finalized. |
| `+ Add Segment` | Append editable leg row; update visual sequence. | External Avinode trip changed or backend database migrated. |
| `Save Draft` | Retain mock trip draft in demo state; show saved-demo feedback. | Server-side save or verified integration update. |
| `Search in Avinode` | Explain handoff and show mock/connection state; if unconnected, show safe error/disabled action. | Real marketplace results, an invented deep link, or successful RFQ send. |
| `Select Quote` | Enabled for a valid (non-expired) mock quote; disabled for expired quote. | Guaranteed availability or operator confirmation. |
| `Submit for Manager Approval` | Move mock proposal to `Pending Manager Approval`. | A real notification/email delivered unless separately demonstrated as mock. |
| `Approve Proposal` | Manager-role demo approval, with visible result. | A server-enforced approval/audit trail. |
| `Send Proposal` | Only after mock manager approval; label send as demo. | A real customer email was dispatched. |
| `Create New Proposal / Revision` | Create a separate editable demo proposal linked to old sent one. | Sent proposal can be overwritten. |
| `Accept Proposal` | Mark related CRM demo trip `Booked`; create/link demo booking; display pending operator confirmation. | SkyJet/operator instantly confirmed aircraft availability. |
| `Create Invoice / Request Deposit` | Show a mock invoice/deposit workflow after acceptance. | Money collected or actual payment request sent. |
| `Retry Connection` | Re-show mock failure/recovery behavior with explicit simulation label. | Real Avinode recovery or provider connectivity verified. |
| `Preferred / Blocked` | Manager-only mock selector on operator record. | Real Avinode operator was blocked, or regulatory validity verified. |

# 17. Example end-to-end demo data — **illustrative JSON fixtures, not database/API contracts**

This fixture demonstrates consistent cross-module **references** for an AI-generated frontend. It is **not** an Avinode payload, verified schema, real personal information, or finalized status model. A single example can have different stages at different times; the object below depicts a state **after** customer acceptance with historical quote and proposal records retained.

```json
{
  "demoMode": true,
  "dataNotice": "DEMO DATA - Local JSON only; no live Avinode or Paynode connection",
  "users": [
    {"id": "USR-ALI", "name": "Ali", "role": "Broker", "teamId": "TEAM-1"},
    {"id": "USR-SARA", "name": "Sara", "role": "Sales Manager", "teamId": "TEAM-1"},
    {"id": "USR-EXEC", "name": "Executive Demo", "role": "Executive"}
  ],
  "customers": [
    {"id": "CUS-001", "displayName": "Ahmed (Demo Customer)", "email": "ahmed@example.com", "ownerUserId": "USR-ALI"}
  ],
  "leads": [
    {"id": "LEAD-101", "customerId": "CUS-001", "email": "ahmed@example.com", "source": "Phone", "status": "Qualified", "ownerUserId": "USR-ALI", "flightDetailsConfirmedForDemo": true}
  ],
  "opportunities": [
    {"id": "OPP-301", "leadId": "LEAD-101", "customerId": "CUS-001", "ownerUserId": "USR-ALI", "stage": "Won", "tripId": "TRP-1001"}
  ],
  "trips": [
    {"id": "TRP-1001", "customerId": "CUS-001", "opportunityId": "OPP-301", "ownerUserId": "USR-ALI", "status": "Booked", "operatorConfirmationText": "Request received; final operator confirmation is being processed", "segments": [
      {"sequence": 1, "from": "DXB", "to": "LHR", "departureLocal": "2026-11-15T10:00", "timeZone": "Asia/Dubai"},
      {"sequence": 2, "from": "LHR", "to": "LBG", "departureLocal": "2026-11-17T11:00", "timeZone": "Europe/London"}
    ]}
  ],
  "avinodeConnection": {"mode": "MOCK", "status": "NOT_CONNECTED", "externalTripId": null},
  "rfqs": [
    {"id": "RFQ-DEMO-1", "tripId": "TRP-1001", "operatorName": "SkyJet (fictional)", "source": "MOCK_AVINODE", "status": "Quoted"}
  ],
  "operatorQuotes": [
    {"id": "Q-VALID", "rfqId": "RFQ-DEMO-1", "amount": 45000, "currency": "USD", "status": "Valid", "selectable": true},
    {"id": "Q-EXPIRED", "rfqId": "RFQ-DEMO-1", "amount": 47000, "currency": "USD", "status": "Expired", "selectable": false}
  ],
  "proposals": [
    {"id": "PROP-OLD", "tripId": "TRP-1001", "sourceQuoteId": "Q-VALID", "customerPrice": 55000, "currency": "USD", "status": "Sent", "editable": false},
    {"id": "PROP-REVISION", "tripId": "TRP-1001", "revisesProposalId": "PROP-OLD", "customerPrice": 55000, "currency": "USD", "status": "Accepted", "managerApproval": "Approved", "editable": false}
  ],
  "booking": {"id": "BKG-DEMO-1", "tripId": "TRP-1001", "acceptedProposalId": "PROP-REVISION", "crmFlow": "Booked", "operatorFinalConfirmation": "Not yet confirmed"},
  "invoice": {"id": "INV-DEMO-1", "bookingId": "BKG-DEMO-1", "invoicedAmount": 55000, "collectedAmount": 20000, "currency": "USD", "paymentSource": "DEMO_ONLY"}
}
```

**Fixture cautions:** `flightDetailsConfirmedForDemo`, `operatorConfirmationText`, `selectable`, `editable`, `managerApproval`, `crmFlow`, and `operatorFinalConfirmation` are **demonstration fields**, not confirmed backend names. The second segment's actual timezone and local scheduling must ultimately be validated against airport-specific rules. The fixture represents fictional records and **does not demonstrate real source synchronization**. If rendering an Avinode “Quote” UI, visibly display `MOCK AVINODE DATA`.

# 18. Reconciliation notes — read this before an AI resolves apparent contradictions

The original PRD is intentionally preserved unchanged. These are **precise frontend-phase interpretations** of older statements, not silent edits to the specifications.

| Original PRD reference | What the original text says | Meeting update / accurate reading for this frontend phase |
|---|---|---|
| §5.3 and §6.3 | Manually creating lead needs name/organization, one contact method, and source. | **MTG-03** adds **required email in frontend Lead form**. Keep other requirements. Do not claim this changes approved future API validation without decision. |
| §5.3 and §6.3 | Itinerary optional for initial lead; qualification uses configurable checklist. | **MTG-01/02**: save incomplete lead, qualify after required flight details. Exact list not provided; do not silently require full trip/source-ready itinerary on initial lead creation. |
| §5.2 and §6.3 | Duplicate candidate detection, reviewed merge, historical preservation. | **MTG-04** defers **working dedupe in JSON frontend phase**. Don't delete the longer-term original requirement or claim it is canceled. |
| §8.1 and §10.2 | LeadItinerary and TripSegments are separate record structures. | **MTG-05/06**: first build UI segment repeater. Schema and copying behavior remain open. |
| §4.5 / §10.1 C5 | Two proposed Trip Details tab lists differ. | **MTG-09** chooses multiple tabs, **not** a final list/merge pattern. This conflict still requires a product design decision. |
| §4.2 / §5.5 / §7 | Avinode marketplace search must stay in approved buyer flow. | **MTG-10** says verify documentation and permitted use. Nothing here authorizes direct B2B aircraft search in the CRM. |
| §5.8 / §6.3 | Quote expiry tracked, but post-expiry proposal rule needs decision. | **MTG-14/15** settles **frontend behavior**: expired visible in history, not selectable. |
| §5.8 | Proposal approval where required; revision/version tracking. | **MTG-16–19**: manager approval is mandatory before send in demo; sent proposal immutable; revision is a new proposal entry. Exact backend representation awaits design. |
| §5.9 / §6.1 and glossary | Customer acceptance creates/converts booking, original text says “no booking happens automatically”, and original M04 requires booking prerequisites. | **MTG-21–23**: frontend simulates acceptance → CRM trip `Booked`, **while explicitly telling the customer operator confirmation is pending** and may take 1–2 business days or actual timeframe. Backend preconditions and final confirmation semantics **not settled**. |
| §5.1 / §8.3 / §10.1 C4 | Executive Dashboard simplified trip statuses differ from M04 lifecycle. | **MTG-24 addressed visibility by role, not mapping**. Trip-status chart grouping is still open. Do not equate `Customer Accepted` with `Confirmed` for a production confirmed-bookings KPI. |
| §3.3 | Executive read-only within assigned scope; sensitive finance data permission-gated, managers team-scoped. | **MTG-24/25** supports broad executive demo overview, team-manager scope, limited broker scope. “Executive sees everything” must not override sensitive-data controls absent explicit authorization. |
| §5.11 | Communication Inbox and Trip Messages described. | **MTG-26**: UI must have separate operator/customer message tabs. |
| §5.12 / §6.1 | Invoice and payments after booking in the journey; Paynode conditional. | **MTG-27**: invoice/deposit **frontend step begins on acceptance**; real invoice issuance/payment/deposit timing and processing are not implemented. |
| §5.1, §5.17 | “Invoiced Revenue” label pending agreed basis; reports distinguish booked/invoiced/collected/settled. | **MTG-29**: expose **two distinct** figures: invoiced and collected, each with currency; do not substitute collected amount for invoiced revenue. |
| §5.14–15, §7, §8.4 | Detailed commission, reminders, webhook replay and idempotency are longer-term requirements. | **MTG-30**: real business rules/backend processing deferred. Retain in baseline as future development, not active implementation. |

**Important:** “Trip status mapping resolved” is **not** a meeting decision. Neither are “customer portal approved,” “Avinode live search permitted,” “penalty fees fixed,” “commission percentages defined,” or “refund policy set.”

# 19. Frontend QA and sign-off checklist

Before handing the frontend to the supervisor, demonstrate these verifiable outcomes using **only test/demo data**:

- [ ] **17-module coverage:** navigation works for Modules 01–17; empty/data/error screens are not broken.
- [ ] **Mock honesty:** persistent `DEMO DATA` or `MOCK MODE` indication; disconnected Avinode/Paynode screens not presented as live.
- [ ] **New lead:** email required; missing itinerary date does not block New Lead; Qualify is a separate action with clearly described criteria/pending decisions.
- [ ] **Trip UI:** + Add Segment produces at least two ordered legs; no claim that schema or Avinode trip was updated.
- [ ] **Trip Details:** multiple tabs exist; exact chosen tab names are marked as proposed pending approval.
- [ ] **Date amendment warning:** operator penalties may apply; no amount fabricated, no fake remote cancellation.
- [ ] **Connection error:** Avinode failed/not connected state readable, retaining mock trip context.
- [ ] **RFQ list:** multiple operator quotes remain visible; source/currency/last-update labels present where fixture supplies them.
- [ ] **Expiry:** expired quote remains in history but Select Quote is disabled with reason.
- [ ] **Manager approvals:** broker submits proposal for manager approval; manager can approve/reject in the demo; no send until approved.
- [ ] **Proposal revisions:** sent proposals read-only; revised proposal is a new linked record.
- [ ] **Operator preference:** manager controls Preferred/Blocked; broker cannot edit that UI field.
- [ ] **CRM booked vs real confirmation:** acceptance marks trip Booked in mock CRM, **while** customer-facing information explicitly says final operator confirmation is pending and timeframe is not guaranteed.
- [ ] **Role views:** executive broad dashboard, manager team, broker limited; protected finance/doc fields not casually exposed.
- [ ] **Document privacy:** manager/broker distinction illustrated; no unapproved customer portal or passport exposure.
- [ ] **Communications:** Operator Messages and Customer Messages are distinct tabs.
- [ ] **Invoice flow:** invoice/deposit UI step visible after acceptance; not presented as actual payment request sent.
- [ ] **Financial cards:** separate invoiced and collected amounts, currencies labeled, no mixed-currency summing.
- [ ] **Deferred backend features:** deduplication, commissions, timed follow-up, partial payments/refunds, external trip idempotency visibly nonproduction where shown.
- [ ] **Supervisor review:** unresolved tab layout, role access, qualification checklist, pricing/tax methods, status mapping, and final operator-confirmation process remain on the decision register.

# 20. Instructions for AI assistants using this PRD

Treat this file as **(1) full original requirements baseline, plus (2) a later frontend-only meeting decision addendum**. It is *not* a record of an implemented production system.

1. **Read the entire original §§1–13 and meeting §§14–19.** Do not summarize away Modules 07–17 because their specifications are more generic.
2. **Do not modify the original text** unless explicitly asked to create a newly reconciled PRD; the current file preserves it for traceability.
3. **Implement currently approved frontend decisions first** (MTG-01–30 where marked agreed). Use clear JSON mock data and client-side UI interaction to demonstrate them.
4. **Do not implement backend-dependent promises** as actual working features. An in-memory simulated action or disabled control is acceptable if clearly labeled, but it must not be described as secure persistence, payment settlement, external sync, or verified authorization.
5. **Label assumptions explicitly**: `[UI-SUGGESTION]`, `[DEFERRED-BE]`, `[UNRESOLVED]`, `[PENDING-PROVIDER]`.
6. **Preserve the authority boundary**: Avinode marketplace RFQs/operator quotes are external authoritative records; internal proposals, bookings, and customers belong to the CRM. Do not invent live marketplace/search APIs or payment operations.
7. **When generating UI**, use the original screen inventory and companion UI Field Mapping document, then apply the meeting overrides in §§15–16. A field listed only as an illustrative suggestion must not silently become mandatory.
8. **Where source and meeting appear inconsistent**, use §18; if still unclear, leave an explicit product-decision note rather than guessing.
9. **Do not treat meeting notes as signed-off production policy**: they were provided as a meeting summary, and their formal approval state is not established.
10. **Use the demo story consistently**: Ahmed (customer), Ali (broker), Sara (manager), SkyJet (fictional operator); demonstrate enquiry → qualification → trip → Avinode handoff → RFQ/quotes → approved proposal → acceptance/CRM booking → honest operator-confirmation message → invoice/deposit mock → separated invoiced/collected views.

**End of additive meeting update.**
