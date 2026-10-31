# Claude Design prompt: Ayre Aviation CRM, login and role-aware dashboard

Paste everything below the line into Claude Design.

---

You are the design lead at a studio known for giving every client a distinct identity that nobody mistakes for anyone else's. This client has rejected templated, AI-looking proposals before. Apply the **frontend-design** discipline throughout: ground every choice in the subject matter, make deliberate opinionated decisions, and critique your own work before showing it. The client's own words below always win over any default.

## 1. The product and the people

**Product:** Ayre Aviation CRM, an internal broker CRM for a private-jet charter brokerage. Brokers manage wealthy customers, enquiries, charter trips, operator quotes, customer proposals, bookings, invoices, and commissions. Avinode (an aircraft marketplace) is an external system the CRM links to. Aircraft search results never appear inside the CRM.

**Audience of the product:** brokers, sales managers, finance staff, and the owner/executive of a charter brokerage. Their customers are ultra-high-net-worth individuals and corporate flight departments. The software must feel like it belongs in that world: quiet confidence, precision, discretion.

**Deliver two screens only:**
1. **Login**, with a plane arrival moment.
2. **One dashboard page** ("Executive Dashboard and My Workspace") that is role-aware for four user types. It is a single page whose composition changes per role. Do not design other pages.

**Mood words from the client:** executive, luxury, minimalistic, professional, natural, genuine, alive, real. It must not look AI-generated or like a generic SaaS template.

## 2. Fixed brand palette (client-approved, do not substitute)

| Role | Name | Hex |
|---|---|---|
| Primary | Midnight Ink | `#101319` |
| Secondary | Vibrant Gold (true, shiny gold) | `#FFD700` |
| Tertiary | Warm Ivory | `#F2EDE6` |
| Home/login field | Jet Black | `#000000` |
| Dark panel | Graphite | `#1F232A` |
| Hover/selected on dark | Gunmetal | `#2E333B` |
| Secondary icons, disabled | Platinum | `#C9CCD1` |
| Cards, tables, forms | Pure White | `#FFFFFF` |
| Borders on light | Sand Line | `#DDD6CB` |
| Secondary text | Steel Grey | `#77797C` |
| Borders on dark | Warm Stone | `#4B4847` |
| Status: success, paid, confirmed | Racing Green | `#3F6B55` |
| Status: pending, expiring | Warning Orange | `#F5A623` |
| Status: overdue, error, cancelled | Oxblood | `#8E2F3A` |

**Where each mode is used**
- **Login:** Jet Black field, Midnight Ink surfaces, gold accents, ivory text.
- **Dashboard and the whole platform:** light. Warm Ivory canvas, Pure White cards, Sand Line borders, Midnight Ink text and sidebar.

**Gold rules (important)**
- Gold is a real, vivid gold and must look like metal, not mustard. Keep it rare so it stays precious.
- Never use gold for small text on ivory or white (unreadable). On light surfaces gold appears only as a button fill with Midnight Ink text, one thin top border on the single most important card, small icons, and accent lines.
- On dark surfaces gold may be text, outline, or fill.
- Gold button hover: flip to a Midnight Ink fill with gold text. Do not invent extra gold shades. No bronze, champagne, or brown-gold anywhere.
- No gradients as decoration. No glow. Flat, confident surfaces. The only permitted subtlety is a very fine line or a faint texture that evokes aircraft instrumentation, used once.

## 3. Screen one: Login with the arrival moment

**Heading text:** "Ayre Aviation CRM".

**Concept:** A black screen. A fine, technical line drawing of a private jet (side profile, business-jet silhouette, drawn as clean SVG strokes in gold) draws itself in and glides to rest as the page loads, then the sign-in panel resolves beside or beneath it. This is the page's single orchestrated motion moment; keep everything else still. Respect `prefers-reduced-motion` (show the final state, no animation).

**Requirements**
- Draw the aircraft as inline SVG (no stock photos, no external images). It must look like a real, well-proportioned business jet (swept wing, T-tail or low-mounted tail, rear engines, row of cabin windows), not a cartoon. Precision over decoration. Consider hairline construction details (centerline, a small altitude/heading annotation) only if they stay quiet.
- Sign-in form: email, password (with show/hide), "Remember this device", primary gold button "Sign in", text link "Forgot your password". Add a role-appropriate secondary line: "Access is by invitation from your administrator."
- States to design: default, field validation error ("Enter a valid email address"), failed sign-in ("That email and password don't match. Try again."), loading state on the button, and a brief transition into the dashboard after success.
- Footer: small, quiet line with the integration status ("Avinode: not connected, demo data") so the demo is never mistaken for live.
- Layout must hold at phone, tablet, and desktop widths.

## 4. Screen two: the dashboard (one page, four roles)

A single page with a left sidebar (Midnight Ink), a top bar, and a main area on Warm Ivory. A **role switcher in the top bar, labeled as demo-only,** lets the client preview the four roles. Switching changes which KPIs, panels, and data appear; layout rhythm stays consistent.

**Sidebar groups (navigation chrome only, other pages are not designed):** Overview (Executive Dashboard, My Workspace), Customer and Sales, Charter Operations, Finance and Payments, Tasks and Automation, Reports and Analytics, Administration. Highlight "Executive Dashboard" as active. Hide groups a role cannot access.

**Top bar:** page title, user scope summary ("Showing: Whole company" / "Your team" / "Your work"), global search, notifications bell with unread count, user avatar menu, the demo role switcher.

**Filter bar (visible, filters apply to every eligible widget; any widget not affected must say so):**
- Date range: Today, 7 days, 30 days, Month to date (default), Quarter to date, Custom
- Comparison period (default: prior equal-length period)
- Broker, Team, Trip status, Currency display
- Right side: "Last refreshed 10:42 AM ET" with a refresh button, and an Export menu (PDF, CSV) shown only to roles allowed to export

**Freshness and honesty (required):**
- A small data-freshness line: CRM data live; Avinode "Not connected"; Paynode "Not connected".
- Mock content carries a clear "Demo data" mark.
- If external sync is stale, show last-known value with a "Sync delayed" tag. Never imply stale data is current.
- Every KPI has a tooltip stating its definition, date basis, timezone, and currency.
- Every KPI and chart is clickable and drills into the owning module with the same filters and a visible back/breadcrumb action (show the interaction affordance; the destination pages are not designed).
- Never put actions on this page that change a booking, a customer payment, or an operator payout. Quick actions only route to the owning module.
- Revenue is shown as **"Invoiced revenue"**, never as plain "Revenue", until the client approves a reporting basis.
- Never add up mixed currencies. Primary currency USD. If a figure includes other currencies, show per-currency lines or a single selected currency.

### 4.1 Executive / Owner view (everything, company-wide)

**KPI cards (8):**
1. New leads (count, created in range)
2. Open opportunities (non-closed at end of range)
3. Confirmed bookings (first confirmed in range)
4. Invoiced revenue (by currency)
5. Gross profit (eligible revenue minus operator costs and approved expenses)
6. Outstanding receivables (open invoice balances)
7. Pending RFQ responses (active RFQs awaiting an operator, with aging)
8. Trips in next 7 days (booked trips departing in the next 7 days)

Each card: value, delta against the comparison period, and a compact visual that fits the metric (not the same sparkline on every card). Vary the treatment so cards do not read as one identical kit.

**Panels:**
- **Invoiced revenue trend:** daily/weekly/monthly toggle; current versus comparison period; one currency at a time.
- **Sales funnel:** Lead, Qualified, Quote sent, Won or Lost, with counts and stage conversion rates.
- **Trip status split:** Draft, Sourcing, Quoting, Confirmed, Completed, Cancelled.
- **Top brokers:** ranked list with a metric selector (confirmed bookings or invoiced revenue).
- **Attention needed:** overdue tasks, stale RFQs, quotes about to expire, unpaid invoices.
- **Recent activity:** audited business events with actor, object, timestamp, link.

### 4.2 Sales Manager view (team scope)

Scope line reads "Your team". Emphasize pipeline health and team workload.
- **KPI cards:** New leads, Open opportunities, Confirmed bookings, Pending RFQ responses, Trips in next 7 days, Gross profit (shown because margin is granted to this manager).
- **Show a locked state** for Invoiced revenue and Outstanding receivables: a quiet card reading "Not included in your access" with a small lock icon. This demonstrates permission-aware design.
- **Panels:** team sales funnel, team leaderboard (top brokers), unassigned leads waiting for assignment (with SLA timer), stalled RFQs to escalate, trip status split, attention needed, recent team activity.
- Routing actions only: "Assign lead", "Open RFQ" lead to the owning module.

### 4.3 Broker view (personal workspace first)

Scope line reads "Your work". This is the "My Workspace" experience: a calm daily queue.
- **Today summary** at the top (overdue, due today, upcoming), in plain language.
- **Small personal KPI strip:** My open opportunities, My confirmed bookings, My pending RFQ responses, My trips in next 7 days, My commission (accrued, shown only if permitted; otherwise the locked state).
- **Panels** (default order: overdue and urgent first, then due today, then upcoming):
  - My Tasks: title, linked record, priority, due date, status; actions complete, defer
  - My Leads and Opportunities: customer, route, stage, estimated value, next action, age
  - Trips Requiring Action: trip reference, route, departure, stage, blockers
  - RFQ and Quote Inbox: operator, trip, response status, reply age, quote expiry, "Open in Avinode" link
  - Upcoming Departures: local departure time, origin to destination, passengers, booking status
  - Notifications and Activity: event, summary, time, read/unread

### 4.4 Finance view (money operations)

Scope line reads "Finance". Emphasize collections, payables, and reconciliation.
- **KPI cards:** Outstanding receivables, Overdue invoices (count and amount), Payments received (range), Operator payables due, Reconciliation exceptions, Commissions awaiting approval, Invoiced revenue, Gross profit.
- **Panels:** receivables ageing (current, 1 to 30, 31 to 60, 60+ days), received versus due over time, operator payable queue with due dates, reconciliation exception queue (provider transaction versus CRM invoice, flagged unverified), commissions awaiting approval, attention needed.
- Note on every provider-derived figure: "Unverified until Paynode is connected."

## 5. Realistic content (use this flavor; label as demo)

- Company: Ayre Aviation. Timezone shown: America/New_York. Currency USD.
- Routes with real airport codes: KTEB to KMIA, KVNY to KLAS, KPBI to MYNN (Nassau), EGLF to LFPB, KHPN to KASE.
- Aircraft categories: Light, Midsize, Super midsize, Heavy, Ultra-long-range. Do not name real operators; invent plausible ones (for example "Meridian Jet Partners", "Harbor Air Charter").
- Customers: invented private clients and family offices (for example "The Hartwell Family Office", "Calder Industries flight department"). No real people.
- Believable numbers: month-to-date invoiced revenue near $1.2M; margin near 14 to 18 percent; 20 to 40 open opportunities; 8 to 12 pending RFQs.
- Trip references like "AYR-2026-0412". Statuses use the palette's status colors.
- Include one overdue item, one quote expiring soon, one stale RFQ, and one locked card so states are visible.

## 6. Design process you must follow

1. **Plan first, briefly:** a compact token system. Color (use the palette above), type (roles), layout (a one-sentence concept plus an ASCII wireframe of each screen), and principles. Then review your own plan against this brief. If any part reads like a default you would produce for any dashboard, revise it and say what you changed and why. Only then build.
2. **Typography carries the personality.** Use one or two families, clearly distinct if two. Choose deliberately; do not default to Inter, Roboto, Arial, Playfair, or Cormorant. Use tabular figures for numbers. Set a real type scale with considered weights and spacing. Keep line lengths under 80 characters.
3. **Spend boldness in one place:** on login it is the plane; on the dashboard it is the single hero treatment (one card or the revenue visual). Keep everything else quiet and disciplined.
4. **Avoid these generated-page tells** (the palette is fixed, but the structure is yours):
   - Identical rounded cards with the same soft grey shadow on everything
   - Gradient washes as decoration
   - A tracked-out ALL-CAPS eyebrow above every heading
   - Meta strings joined by middle dots, "WORD: fragment" labels with spaced em dashes
   - A monospace face for every small label
   - Arrows appended to every link or button
   - Highlighting a single word in a headline with a different color or italic
   - Numbered markers on content that is not a sequence
   - Fade-and-slide-up entrance on every section and hover animation on every card
5. **Vary the form of the data.** Use the visual that fits the metric: a bar-in-bar for funnel conversion, a stacked horizontal bar for trip status, a tight dotted ladder for ageing, a plain figure with a delta for counts. Avoid decoration that carries no information.
6. **Structure is information.** Borders, dividers, and labels must encode something about the content.
7. **Copy:** sentence case, active verbs, plain language. Buttons say exactly what happens ("Assign lead", "Open RFQ", "Export CSV"). Empty states invite action ("No stale RFQs. You're caught up."). Errors state what happened and how to fix it, without apologizing.
8. **Motion:** one orchestrated moment on login. On the dashboard, only motion that answers a user action (opening a filter, switching roles, expanding a panel). Respect reduced motion.
9. **Quality floor:** responsive to mobile, tablet, and desktop; visible keyboard focus; sufficient contrast; screen-reader summaries for charts; tooltips reachable by keyboard.
10. **Critique before delivering:** screenshot and review each screen. Remove one accessory (cut anything decorative). Confirm the gold is vivid, the ivory feels like paper, and nothing looks like a template.

## 7. Deliverables

- Login screen with the plane arrival animation and all listed states
- Dashboard page with the four-role switcher, filter bar, all KPI cards and panels per role, locked-state example, "Sync delayed" example, and drill-down affordances
- A short note listing the design decisions you made and anything you revised after your self-review

Make it feel alive and real: a place where a broker who flies people in $60M aircraft would be comfortable working all day.
