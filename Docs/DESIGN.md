# Ayre Aviation CRM: design system and frontend rules

This is the single source of truth for how every screen of the Ayre Aviation CRM looks, behaves and is organized. It was extracted from the approved prototype [ayre-crm-login-and-dashboard.html](ayre-crm-login-and-dashboard.html) and the 18 specifications in `Documentation/`.

**Rule zero:** if a screen, tab, heading, nav item, card, field or color is not defined in this file or in the specifications, it does not get built. When in doubt, build less and ask.

Contents

1. Product and design intent
2. Color system
3. Typography
4. Layout and spacing
5. Application shell (sidebar, top bar, page header)
6. Components
7. Charts and data visuals
8. Roles and what each role sees
9. Navigation and module mapping
10. Dashboard field mapping (every widget to its data)
11. Page templates for all other pages
12. Content and copy rules
13. Integration honesty and states
14. Motion, accessibility and responsive behavior
15. Rules for AI and developers (anti-clutter rules)
16. Pre-merge checklist
17. Open decisions

---

## 1. Product and design intent

- **Product:** Ayre Aviation CRM, an internal charter-broker CRM. Users are brokers, sales managers, finance staff and the owner. Their customers are ultra-high-net-worth individuals and corporate flight departments.
- **Feeling:** executive, luxury, minimal, professional, calm, precise. It must look hand-made for this brand, not like a template or an AI-generated page.
- **Dark and light split:**
  - **Dark:** the login screen and the sidebar.
  - **Light:** everything inside the platform (top bar, page, cards).
- **Gold is precious.** It marks the active state, the primary action and the key data line. It is never used as decoration everywhere.
- **Only mapped fields.** Every number, label and column must trace to a field in the specifications (section 10). The CRM never shows aircraft search results, never fabricates operator availability, never shows Avinode or Paynode data as live when it is not.

---

## 2. Color system

### 2.1 Brand roles

| Role | Name | Hex | Where it is used |
|---|---|---|---|
| **Primary** | Ink | `#101319` | Sidebar, login right panel, dark banner, floating role bar, avatar background, dark chips, dark chart bars, hover fill of gold buttons |
| **Secondary** | Gold | `#FFD700` | Primary buttons (Export, Sign in), active tab pill, task checkbox when checked, unread indicators on login focus ring |
| **Tertiary** | Warm canvas | `#FAF8F5` | Page background behind all cards |
| Surface | White | `#FFFFFF` | Cards, top bar, inputs, dropdowns |

Primary and secondary together form the identity: **ink and gold on warm white**.

### 2.2 Gold family (use exactly these, no other golds)

| Token | Hex | Use |
|---|---|---|
| `--gold` | `#FFD700` | Filled controls (buttons, active tab, checked checkbox). Text on it is always `#0B0B0B` |
| `--gold-d` (deep gold) | `#D9A521` | Chart lines, area fills, data markers, icon tint, today bar in weekly mini-chart, unread dots |
| `--goldtext` | `#E8C25A` | Gold text on dark surfaces only (sidebar logo wordmark, avatar initials) |
| Active nav | fill `rgba(217,165,33,.20)`, border `#B8892D`, text `#F0CC6B`, icon `#F0B93B` | Active sidebar item |
| Avatar ring | `#B8892D` | 2px ring on the user avatar |
| Button border | `#C9A400` | 1px border on gold buttons |

Never use gold as small text on a light background (unreadable). Never use bronze, copper, champagne or brown-gold anywhere. Never create a new gold shade.

### 2.3 Neutrals

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#101319` | Dark surfaces (see above) |
| `--blk` | `#0B0B0B` | Text that sits on gold (button labels, active tab label) |
| `--black` | `#000000` | Login photo area only |
| `--text` | `#16181D` | Body and heading text on light |
| `--muted` | `#6B6F76` | Secondary text, subtitles, timestamps, delta labels, axis text |
| `--soft` | `#F6F3EE` | Table header band, segmented control track, empty bars, neutral chips |
| `--line` | `#EFEAE2` | Card borders, row dividers, chart gridlines |
| `--canvas` | `#FAF8F5` | Page background, topbar search field |
| `--card` | `#FFFFFF` | Card background |
| Dark panel text | `#F3F1EC` / `#D4D6DA` | Menu text and secondary text on ink |
| Login only | `--graphite #1F232A`, `--stone #4B4847`, `--platinum #C9CCD1`, `--steel #77797C`, `--ivory #FBF6F0` | Input fields, borders and text on the dark login panel |

### 2.4 Status and data colors (multi-color is allowed here, nowhere else)

| Meaning | Base | Chip text | Chip fill | Used for |
|---|---|---|---|---|
| Success, paid, confirmed, positive trend | `#16A34A` | `#15803D` | `rgba(22,163,74,.13)` | Confirmed, Booked, Ready, positive deltas, funnel Won |
| Warning, pending, expiring | `#F59E0B` | `#B45309` | `rgba(245,158,11,.17)` | Pending RFQ, Medium priority, Quoting, expiring quotes |
| Danger, overdue, error, negative trend | `#EF4444` | `#DC2626` | `rgba(239,68,68,.12)` | Overdue, Critical, High priority, Declined, negative deltas |
| Info, neutral progress | `#2563EB` | `#1D4ED8` | `rgba(37,99,235,.12)` | In Progress, Sourcing stage, links, funnel Qualified |
| Special, secondary category | `#7C3AED` | `#6D28D9` | `rgba(124,58,237,.12)` | Proposal sent, Sourcing status chip, task icon |

Rules:

- A delta arrow is green when the change is good for the business and red when bad. "Outstanding receivables up" is red. "Open opportunities down" is red. Direction is not the same as meaning.
- Never use color alone to carry meaning. Pair it with a word or an arrow.
- Trip status bar colors: Draft `#C9CCD1`, Sourcing `#2563EB`, Quoting `#F59E0B`, Confirmed `#D9A521`, Completed `#16A34A`, Cancelled `#EF4444`.
- Avatar palette (cycled by row): `#3B82F6`, `#7C3AED`, `#6366F1`, `#0D9488`, `#D97706`, always white initials.
- KPI icon circles use a 12 to 16 percent tint of the metric color with the full color for the icon: gold (leads, revenue, commission), red (open opportunities, receivables), green (bookings, profit, payments), blue (trips, payables), amber (RFQs, exceptions), purple (tasks).

### 2.5 Forbidden color uses

- No gradients as decoration (the only gradients are the soft area fill under chart lines, the photo scrim on login, and the dark layer behind the sign-in heading).
- No neon, glow or colored drop shadows.
- No pure-black surfaces on the dashboard (use ink `#101319`).
- No colors outside this section. If a new status needs a color, reuse the closest meaning above.

---

## 3. Typography

| Role | Family | Weight | Size | Notes |
|---|---|---|---|---|
| Page title (H1) | Playfair Display | 700 | 28px, line-height 1.15 | One per page, sentence case |
| Login title | Playfair Display | 600 | clamp(38px, 5vw, 64px) | Login only |
| Sign-in form title | Playfair Display | 600 | 28px | |
| Sidebar wordmark "AYRE" | Playfair Display | 500 | 18px, letter-spacing .2em | Gold text `#E8C25A` |
| Card title (H3) | Inter | 700 | 17px | |
| KPI value | Inter | 600 | clamp(22px, 1.75vw, 31px), letter-spacing -.02em, tabular numerals | |
| KPI label | Inter | 400 | 14px | |
| Body and table cell | Inter | 400 | 13 to 14px | |
| Table header | Inter | 500 | 12.5px | |
| Delta and secondary text | Inter | 400 to 600 | 12.5px | |
| Chip | Inter | 500 | 12px | |
| Sub-label (under title) | Inter | 400 | 12px, `--muted` | |
| Sidebar item | Inter | 500 | 14px | |

Rules:

- Only these two families: **Playfair Display** (titles, wordmark) and **Inter** (everything else). Load from Google Fonts: Inter 400/500/600/700 and Playfair Display 500/600/700.
- Numbers always use tabular figures (`font-variant-numeric: tabular-nums`).
- Sentence case everywhere. No ALL CAPS labels. No tracked-out eyebrow text above headings.
- Never bold a single word in a headline or color it differently.
- Line length under 80 characters for prose.

---

## 4. Layout and spacing

### 4.1 Frame

```
+-----------+--------------------------------------------------------+
| SIDEBAR   |  TOP BAR  (white, full width, sticky, 1px bottom line) |
| 226px     +--------------------------------------------------------+
| ink       |  PAGE (padding 28px 32px 0)                            |
| sticky    |   Page header (H1, subtitle, status line)              |
| 100vh     |   Filters row                                          |
|           |   Content grid (12 columns, gap 18px)                  |
+-----------+--------------------------------------------------------+
```

- Sidebar 226px (78px when collapsed). Main fills the rest.
- Page background `#FAF8F5`. Bottom padding 96px (room for the demo preview bar).
- Grid: 12 columns, gap 18px.

### 4.2 Cards

- Background white, 1px `#EFEAE2` border, **radius 14px**, padding 18px 20px.
- Shadow: `0 1px 2px rgba(30,20,5,.04), 0 8px 24px rgba(30,20,5,.04)`.
- Card header row: title on the left, optional controls or "View all" on the right, 14px below it.
- One radius for cards (14), 10 for inputs and buttons, 9 for small selects, 8 for table header cells and tab pills, 7 for chips, 50% for avatars and icon circles.

### 4.3 Column spans

| Class | Span | Typical use |
|---|---|---|
| `k4` | 3 of 12 (4 per row) | KPI cards when a role has 8 (or any multiple of 4) |
| `k3` | 4 of 12 (3 per row) | KPI cards when a role has 6 or 3 |
| `k6` | 6 of 12 (2 per row) | KPI cards that fill the rest of an odd row |
| `c3` | 3 | Narrow list cards (Attention needed, Priority actions) |
| `c4` | 4 | Standard card (tables, lists, funnel) |
| `c6` | 6 | Chart card |
| `c8` | 8 | Wide table |
| `c12` | 12 | Full-width card |

KPI rows must be even: 8 cards = 4 + 4, 6 cards = 3 + 3, 5 cards = 3 + 2 (the two on the second row use `k6`). Never leave one orphan card on a row.

### 4.4 Breakpoints

| Viewport | Behavior |
|---|---|
| 1700px and up | KPI card: icon left, text, sparkline at bottom right |
| Under 1700px | KPI card: sparkline moves to a full-width strip under the text |
| Under 1560px | `c4` cards become half width; the last card on the row goes full width |
| Under 1360px | `c3`, `c6`, `c8` stack to full width |
| Under 1100px | KPI cards 2 per row |
| Under 900px | Sidebar hidden; top bar and page padding 16px |
| Under 700px | KPI cards 1 per row |

---

## 5. Application shell

### 5.1 Sidebar (ink `#101319`, no picture, no texture)

- Top: logo mark (gold "A" outline, 44px) + wordmark "AYRE" (gold, Playfair, tracked) and "Aviation" (white, Inter 15px/500). Menu button at the right collapses the sidebar.
- Menu items: height 41px, radius 10px, gap 14px, icon 20px stroke 1.6, text Inter 14px/500 `#F3F1EC`. Hover: `rgba(255,255,255,.09)`.
- **Active item:** gold-tinted fill `rgba(217,165,33,.20)`, 1px `#B8892D` border, gold text and icon. Only one active item.
- One divider line before Administration.
- Bottom: "Collapse sidebar" control. **Nothing else.** No help box, no promo, no upgrade card, no photo.
- Collapsed state: 78px wide, icons centered, labels hidden, tooltip (`title`) shows the name.
- Items a role cannot use are not rendered at all.

### 5.2 Top bar (white, sticky, height about 75px, 1px bottom line `#EFEAE2`)

Contents, left to right, and nothing more:

1. Global search (rounded 12px, `#FAF8F5` fill, search icon, placeholder "Search customers, trips, operators...", shortcut hint "Ctrl K")
2. Flexible space
3. Notification bell (red count badge when there are unread items)
4. User pill: avatar (44px, ink, gold initials, 2px `#B8892D` ring), name (Inter 600), role (muted), small chevron

The top bar never contains the page title, filters, tabs, or page actions.

### 5.3 Page header (below the top bar, inside the page)

- **H1** (Playfair 700, 28px): the name of the page.
- **Subtitle** (Inter, `#2A2D33`): one sentence on what the page is for, under 90 characters.
- **Status line** (12px, `--muted`): small dots and text, exactly these four items on dashboard-type pages: CRM live (green dot), Avinode not connected or connected (amber or green dot), Paynode not connected or connected, Last refreshed time with timezone. Other pages show only the items that apply.
- No breadcrumbs unless the page is a detail page (then one breadcrumb line above the H1).

### 5.4 Filters row

- Labels sit above fields (12.5px). Each filter is a 42px select with a 10px radius.
- Date range always includes a calendar icon.
- A single gold **Export** button sits at the far right, only for roles allowed to export.
- Only filters that actually apply to the widgets on that page are shown. Filters that do not apply are not rendered.

---

## 6. Components

### 6.1 Buttons

| Type | Style |
|---|---|
| Primary (one per view) | Gold `#FFD700` fill, 1px `#C9A400` border, text `#0B0B0B` 600, height 42px, radius 10. Hover: ink fill with gold text |
| Secondary | White fill, 1px `#EFEAE2` border, text `#16181D`, same size. Hover: border `#101319` |
| Link button ("View all") | Text `#2563EB` 12.5px/500, radius 8, optional 1px `#BFD3F8` border, trailing arrow icon 13px. Hover: `#EEF4FF` fill |
| Icon button | 46px square, no fill, icon 22px |
| Destructive | Secondary style with `#DC2626` text; confirm in a dialog |

There is never more than one gold button in a view. Do not add buttons that do not map to an action in the specifications.

### 6.2 KPI card

Layout: icon circle (48px, 42px under 1700px) at the left, then label (14px), value (31px/600), delta line (arrow + colored percentage + "vs prior period"), and a visual (sparkline, segmented bar, or 7-day bars). A small chevron at the top right signals "click to drill down".

- Hover: slightly stronger shadow; clicking opens the owning module with the same filters (section 10).
- `title` attribute holds the metric definition (see section 10).
- The visual must fit the metric: sparkline for trends, segmented bar for status counts, day bars for the next 7 days. Do not use the same visual on every card.

### 6.3 Tabs (segmented control)

Soft track `#F6F3EE`, radius 10, padding 3px. Active tab: gold fill, `#0B0B0B` text, weight 600. Inactive: `#3A3D43` text. Tabs inside a card switch what that card shows. Tabs are not used for site navigation.

### 6.4 Chips (status pills)

Radius 7px, padding 3px 11px, 12px/500. Colors per section 2.4. Dark chip (`#101319` with `#E8C25A` text) is for the neutral label "New".

### 6.5 Tables

- Header row: `#F6F3EE` band with rounded ends, 12.5px/500 text.
- Rows: 11px vertical padding, 1px `#EFEAE2` divider, no zebra stripes, no outer borders.
- Numeric columns right-aligned, tabular numerals. Text columns do not wrap (`nowrap`) in cards; truncate with a title attribute if needed.
- Broker/person rows start with a colored initials avatar (30px).

### 6.6 List items (Attention needed, Recent activity, Priority actions)

- Row: leading element (icon circle 40px, or checkbox), title (13.5px/600) with one muted line under it, trailing chip or timestamp.
- Dividers between rows, none after the last.
- Checkbox: 20px, radius 6, 1.5px `#CFC9BE` border; checked = gold fill with a dark check.

### 6.7 Inputs and selects

- Height 42px, radius 10px, white fill, 1px `#EFEAE2` border, 13px/500 text, custom chevron at the right.
- Mini select inside cards: height 34px, radius 9px.
- Login inputs are on the dark panel: `#1F232A` fill, 1px `#4B4847` border, focus border gold, error border `#EF4444` with message below in `#F87171`.

### 6.8 Icons

Line icons only, 24px viewBox, stroke 1.6, round caps. Sizes: 20px menu, 23px KPI, 19px list circle, 13px inside link buttons. No filled icons, no emoji.

### 6.9 Toast

Ink fill, white text, 1px gold border, radius 10, bottom center. Used only to confirm an action that has no visible result ("Task completed", "Export is audited").

### 6.10 Demo preview bar

The floating "Preview as: Executive | Sales Manager | Broker | Finance" bar exists only for design reviews. **It must not exist in production.** Real role comes from the signed-in user.

---

## 7. Charts and data visuals

| Visual | Spec |
|---|---|
| Line or area trend | Current period: `#D9A521` 2.6px line, 4.5px white-filled markers with gold stroke, area gradient `#D9A521` from 28% to 2% opacity. Prior period: `#B7B9BD` dashed 1.8px, 3.5px markers. Grid lines `#EFEAE2`. Axis text 11px `#6B6F76`. Y axis uses four equal steps with short labels ($500K, $1M, $1.5M) |
| Bars (received vs due) | Received `#16A34A`, due `#D9A521`, 22px wide, 4px corner radius, grouped by week |
| Funnel | Horizontal bars, 22px tall, radius 5: Leads `#101319`, Qualified `#2563EB`, Quote sent `#F59E0B`, Won `#16A34A`. Right column shows count and stage conversion percent |
| Segmented status bar | 8 to 16px tall, 2px gaps, radius 5, with a legend listing counts |
| Ageing bars | One bar per bucket (Current green, 1 to 30 amber, 31 to 60 red, over 60 `#4B4847`) with amount right-aligned |
| KPI sparkline | 2px line in the metric color with a soft gradient fill |
| Day bars (next 7 days) | Seven bars, first bar (today) `#D9A521`, others `#1F2937`, day initial under each |

Rules:

- Every chart has an `aria-label` that states the headline numbers.
- Money axes are single-currency. Never add or mix currencies without a visible FX source.
- Chart legend sits top-right of the chart: filled dot = current period, dashed line = prior period.

---

## 8. Roles and what each role sees

There are four dashboard roles in the prototype. Administrators and Operations have no dashboard in this version.

**Visibility rule:** a card, tab, filter, menu item, chip or column the user cannot access is **not rendered at all**. No lock icons, no greyed-out cards, no "Not included in your access" messages. Enforcement is server-side as well; hiding in the UI is not the control.

| Role | Page name | Scope text | KPIs | Main panels |
|---|---|---|---|---|
| **Executive / Owner** | Executive Dashboard | Whole company | New Leads, Open Opportunities, Confirmed Bookings, Invoiced Revenue, Gross Profit, Outstanding Receivables, Pending RFQ Responses, Trips in Next 7 Days (4 + 4) | Revenue Trend (tabs Revenue, Profit, Bookings, Trips), Attention needed, Priority actions, Top Brokers, Upcoming Trips, Recent Activity |
| **Sales Manager** | Team Dashboard | Own team | New Leads, Open Opportunities, Confirmed Bookings, Gross Profit, Pending RFQ Responses, Trips in Next 7 Days (3 + 3). Invoiced Revenue and Outstanding Receivables are not rendered | Trend (tabs Profit, Bookings, Trips; no Revenue tab), Unassigned leads, Approvals and escalations, Sales funnel, Top Brokers, Trip status, Recent activity, Stalled RFQs |
| **Broker** | My Workspace | Own work | My Open Opportunities, My Confirmed Bookings, My Pending RFQs (3), My Trips in Next 7 Days, My Commission Accrued (2 wide). Commission only if the permission is granted | "Today" banner (overdue, due today, coming up), My tasks, My leads and opportunities, RFQ and quote inbox, Trips requiring action, Notifications, Upcoming departures |
| **Finance** | Finance Dashboard | Money operations | Outstanding Receivables, Overdue Invoices, Payments Received, Operator Payables Due, Reconciliation Exceptions, Commissions Awaiting Approval, Invoiced Revenue, Gross Profit (4 + 4) | Payments received and due, Receivables ageing, Attention needed, Operator payables, Reconciliation exceptions, Commissions awaiting approval |

Filters per role: Executive has all (Date range, Compare with, Broker, Team, Trip status, Currency, Export). Sales Manager drops Broker. Broker has Date range, Compare with, Trip status, Currency and no Export. Finance drops Trip status and Team.

Sidebar menu per role (see section 9): Broker and Finance see fewer items than Executive; Administration is Executive-only here.

---

## 9. Navigation and module mapping

The sidebar contains exactly these items, in this order. **Nothing is added, renamed or reordered without updating this file and the specifications.**

| Order | Menu label | Module (spec) | Roles |
|---|---|---|---|
| 1 | Executive Dashboard (named per role: Executive Dashboard, Team Dashboard, My Workspace, Finance Dashboard) | 01 Executive Dashboard and Workspace | E, M, B, F |
| 2 | Customers | 02 Customer and Contact Management | E, M, B |
| 3 | Leads & Opportunities | 03 Leads, Opportunities and Sales Pipeline | E, M, B |
| 4 | Charter Trips | 04 Charter Trip Management (Aircraft Sourcing, spec 05, is a tab inside a trip) | E, M, B |
| 5 | RFQs & Quotes | 06 RFQ Management and 07 Quotation and Customer Proposals | E, M, B |
| 6 | Bookings | 08 Booking Management | E, M, B, F |
| 7 | Operators | 09 Operator Management | E, M |
| 8 | Communications | 10 Communications and Activity History | E, M, B |
| 9 | Finance & Payments | 11 Payments and Invoices and 12 Finance and Trip Profitability | E, F |
| 10 | Broker Commissions | 13 Broker Commissions | E, F, B (own only) |
| 11 | Tasks & Follow-ups | 14 Tasks and Follow-ups | E, M, B, F |
| 12 | Automation | 15 Workflow Automation and AI | E, M |
| 13 | Reports & Analytics | 16 Reports and Analytics | E, M, F |
| divider | | | |
| 14 | Administration | 17 Administration and Integrations | E only |

Key: E Executive, M Sales Manager, B Broker, F Finance.

**All 17 specified modules are covered by these 14 items.** Sub-areas (sourcing, quotes, trip profitability, integrations) are tabs or sections inside their parent page, not extra menu items.

Not in the menu and not to be added: Command Center, Fleet, Insights/AI Insights, Customize Dashboard, Help or Support box, Settings (it lives inside Administration), a second dashboard, "Notifications" as a page (it is the bell), "Profile" as a page (it is the user pill menu).

---

## 10. Dashboard field mapping

Every KPI and panel maps to a defined source. Source modules are from the specifications. "Click opens" is the drill-down target with the same filters, a visible back action, and no data loss.

### 10.1 KPI cards

| KPI label | Definition (tooltip text) | Source module | Click opens |
|---|---|---|---|
| New Leads | Leads created in the range and visible to you, counted once by lead ID | 03 | Leads filtered by created date |
| Open Opportunities | Opportunities not yet won or lost at the end of the range | 03 | Pipeline with open stages |
| Confirmed Bookings | Bookings first confirmed within the range | 08 | Bookings filtered by confirmed date |
| Invoiced Revenue | Invoiced charter revenue by currency (basis not yet approved, so labelled Invoiced, never "Revenue") | 11, 12 | Finance report |
| Gross Profit | Invoiced revenue minus operator costs and approved trip expenses | 12 | Trip profitability |
| Outstanding Receivables | Open customer invoice balances above zero at the cutoff date | 11 | Customer payments |
| Pending RFQ Responses | Active RFQs still waiting for an operator response, with ageing | 06 | RFQ list, status Awaiting response |
| Trips in Next 7 Days | Booked trips departing in the next 7 days | 04, 08 | Charter trips filtered by departure |
| Overdue Invoices (Finance) | Invoices past due with a balance above zero | 11 | Invoices filtered by overdue |
| Payments Received (Finance) | Customer payments recorded in the range, unverified until Paynode is connected | 11 | Customer payments |
| Operator Payables Due (Finance) | Operator bills not yet settled | 11 | Operator payments |
| Reconciliation Exceptions (Finance) | Provider transactions that do not match a CRM invoice | 11 | Reconciliation queue |
| Commissions Awaiting Approval (Finance) | Commissions accrued and waiting for finance approval | 13 | Payout queue |
| My Commission Accrued (Broker) | Commission earned on confirmed bookings before approval and payment | 13 | Broker statement |

Delta line = percentage change against the selected comparison period. "Prior period" is the default comparison (an equal-length period before the range).

### 10.2 Panels

| Panel | Fields shown | Source |
|---|---|---|
| Revenue Trend | Cumulative value by day or week or month, current vs prior period; tabs Revenue (invoiced), Profit (gross), Bookings (confirmed), Trips | 11, 12, 08, 04 |
| Attention needed | Overdue invoice, quote expiring today (only if the module reports a valid expiry), RFQs waiting more than 2 days, overdue tasks | 11, 06, 07, 14 |
| Priority actions | Task title, due text, priority chip (Critical, High, Medium) | 14 |
| Top Brokers | Rank, broker, bookings, invoiced revenue, conversion percent; selector Invoiced revenue or Confirmed bookings | 03, 08, 11, 16 |
| Upcoming Trips | Date, route (ICAO codes), customer, status (Booked, In Progress, Sourcing, Quoting) | 04 |
| Recent Activity | Audited business event, object, actor if relevant, relative time | 10 and audit |
| Sales funnel | Leads, Qualified, Quote sent, Won (plus lost count) with stage conversion | 03 |
| Trip status | Draft, Sourcing, Quoting, Confirmed, Completed, Cancelled with counts | 04 |
| Unassigned leads | Lead description, detail, SLA time left | 03 |
| Stalled RFQs | Trip, operator, days waiting | 06 |
| My tasks | Title, linked record, due text, priority | 14 |
| My leads and opportunities | Customer, route, stage, value | 03 |
| RFQ and quote inbox | Operator, response status, trip reference, expiry; "Open in Avinode" link only when Avinode supplies one | 06, 07 |
| Trips requiring action | Trip reference, route, blocker | 04, 08 |
| Notifications | Event, time, read/unread | 14, 15 |
| Payments received and due | Weekly received vs due | 11 |
| Receivables ageing | Current, 1 to 30, 31 to 60, over 60 | 11 |
| Operator payables | Operator, trip, due date, amount | 11 |
| Reconciliation exceptions | Provider transaction vs invoice, state (Unverified, Mismatch, Duplicate) | 11 |
| Commissions awaiting approval | Broker, trip, amount | 13 |

### 10.3 Status vocabulary (use these exact words)

- **Trip status (spec 04):** Draft, Qualified, Sourcing, Quotes Received, Proposal Sent, Customer Accepted, Booked, In Progress, Completed, Lost, Cancelled. The dashboard chart groups them as Draft, Sourcing, Quoting, Confirmed, Completed, Cancelled (a mapping to be signed off; see section 17).
- **RFQ status (spec 06):** Draft or Unknown, Sent, Awaiting response, Partially responded, Quoted, Declined, Canceled, Closed.
- **Priority:** Critical, High, Medium (low is not shown on the dashboard).
- **Integration state:** Not configured, Mock, Connected, Degraded, Error.

---

## 11. Page templates for all other pages

Every other page must be built from the same shell (section 5) and one of these four templates. Do not invent a fifth layout.

### Template A: list page (Customers, Leads, Trips, RFQs, Bookings, Operators, Invoices, Tasks, Commissions)

1. Top bar (unchanged)
2. Page header: H1, one-line subtitle, status line only if the page has sync state
3. Filters row: search within list, 3 to 5 filters, saved view select (optional), gold primary action at the right (for example "New customer"). One primary action only
4. One full-width card containing the data table:
   - Header band, sortable columns, server pagination, row click opens detail
   - Optional compact KPI strip above the table (3 to 4 `k` cards) only when the specification defines list-level KPIs (Trips list in spec 04)
5. Empty state: one sentence plus the primary action. Loading: skeleton rows. Error: what happened and how to retry

### Template B: detail page (a customer, a trip, an opportunity, an operator, a booking)

1. Top bar (unchanged)
2. Breadcrumb (one line), then page header: H1 is the record name or reference, status chip next to it, owner on the muted line, primary action at the right
3. Tab strip directly under the header (underlined tabs, gold underline on the active one). **Tab sets are fixed:**
   - Trip: Overview, Itinerary, Sourcing, RFQs, Quotes, Booking, Payments, Documents, Messages, Activity
   - Customer: Overview, Contacts, Preferences, Trips, Opportunities, Activities, Documents, Audit (permission-gated)
   - Operator: Profile, Contacts, Compliance, Quote history, Performance, Notes
4. Tab content uses the grid and cards of the dashboard. Each tab links to the module that owns the data; it does not duplicate it

### Template C: form or editor (create and edit)

1. Same shell and header; H1 states the action ("New customer")
2. One card per logical group of fields, two-column grid on desktop, single column under 900px
3. Sticky footer inside the page with a gold "Save" and a secondary "Cancel". Unsaved changes are highlighted. Inline validation under each field. No wizard unless the specification calls for one (CSV import and proposal builder do)

### Template D: report or analytics page (Reports, Finance, Profitability)

1. Same shell and filters row (date range, comparison, currency, export)
2. KPI strip (3 to 4 cards), then one or two chart cards, then one table card
3. Export is audited and respects the user's scope

Pages that are admin-only (Users, Roles, Integrations, Webhooks, Audit, Settings) use Template A or C inside the Administration page as tabs: Users and roles, Integrations (Avinode connection, Paynode configuration), Webhook monitoring, Audit and settings.

---

## 12. Content and copy rules

- Sentence case. Plain verbs. Active voice. No filler.
- Buttons say exactly what they do and keep the same verb through the flow: "Save changes" then "Changes saved".
- No "successfully", "please", "simply", exclamation marks, or marketing words.
- Errors: say what happened and what to do, in one sentence, no apology, no raw exception text. Example: "That email and password don't match. Try again."
- Empty states invite an action: "No stale RFQs. You're caught up."
- Dates: "Oct 31" in lists, "Oct 1, 2026 - Oct 30, 2026" for ranges. Times show the timezone where it matters (ET for the business, airport-local for departures).
- Money: `$1,214,600` with currency code visible in the filter or axis. Never "revenue" for invoiced figures; use "Invoiced revenue".
- Route format: `KTEB → KMIA` using ICAO airport codes.
- Trip reference format: `AYR-2026-0412`. Invoice: `AYR-INV-0318`.
- Names of things are the same everywhere: "RFQ" (not "request" in one place and "RFP" in another), "Operator" (not "vendor"), "Customer" (not "client" in one place and "account" in another), "Broker" (not "agent").

---

## 13. Integration honesty and states

- Avinode and Paynode are optional external systems. The CRM owns its data. Neither is ever shown as live unless the integration state says Connected.
- The status line states it plainly: "Avinode not connected", "Paynode not connected".
- Aircraft search results are never shown inside the CRM. The only path is the "Search in Avinode" deep link returned by Avinode, opened in a new tab.
- Stale external data shows the last known value with a "Sync delayed" label. It is never presented as current.
- Provider-derived money is labelled "Unverified until Paynode is connected".
- All mock or demo content is marked "Demo data". Remove the marks only when real data replaces it.
- API tokens never reach the browser. Webhooks are processed by the backend.

---

## 14. Motion, accessibility and responsive behavior

**Motion**

- One orchestrated motion moment: the login (photo fades in, headline and panel fade in). Respect `prefers-reduced-motion` (show the final state).
- In the app: motion only answers a user action (hover shadow on a KPI card, button hover flip, sidebar collapse). No entrance animations on cards, no hover animations on every element.

**Accessibility**

- Visible keyboard focus: 2px gold outline, 2px offset.
- Text contrast at least 4.5:1. Gold text on light backgrounds is not allowed.
- All icons are decorative unless a button; icon-only buttons have `aria-label`.
- Charts have text alternatives; KPI tooltips are reachable by keyboard.
- Click targets at least 40px.
- Checkboxes use `role="checkbox"` and `aria-checked`.

**Responsive**

- Follow the breakpoint table in section 4.4. Desktop first. At phone width the sidebar is replaced by a menu button, KPI cards stack one per row, and tables scroll horizontally inside their card.

---

## 15. Rules for AI and developers (anti-clutter rules)

These rules apply to every AI tool and every developer. They exist so the platform stays organized, minimal and consistent.

### 15.1 Navigation

1. The sidebar contains only the 14 items in section 9. Do not add, rename, reorder or duplicate items.
2. Do not add a second navigation (secondary sidebar, mega menu, floating menu, footer links).
3. Do not add top-level tabs under the top bar. Tabs only exist inside a page, and only the sets defined in section 11.
4. Do not show menu items a role cannot use. Do not show disabled or locked items.
5. Do not add a "Help", "Support", "What's new", "Upgrade" or promo element anywhere in the shell.

### 15.2 Structure of every page

6. Every page is: top bar, page header, filters row (if needed), content. No other region.
7. Exactly one H1 per page, in the page header. No second page-level heading, no hero banner, no section titles outside cards.
8. Card titles are short nouns ("Top Brokers", "Upcoming Trips"). One card title per card.
9. Do not add eyebrow labels, taglines, decorative dividers, marketing copy, or "welcome" text (the Broker "today" banner is the only greeting and is defined).
10. Do not add tabs to a page that does not have a defined tab set. Do not use tabs to hide content that would fit as a card.
11. Do not add more than one gold button per view.
12. Do not create a card unless it maps to a field in the specifications (section 10). No filler cards, no "coming soon" cards, no placeholder charts.

### 15.3 Data and wording

13. Only show fields defined in the specifications. If a field is missing, ask; do not invent a metric.
14. Use only the labels and status words in this file. Do not coin synonyms.
15. Do not show locked, restricted or "no access" placeholders. Omit the element entirely.
16. Do not label invoiced amounts as "Revenue". Do not add or mix currencies.
17. Do not show Avinode or Paynode data as live when the state is not Connected.
18. Do not put airline-style or fantasy content (flight tracking maps, wheels-up timers, disruption boards, fleet status). The CRM is not an operations dispatch tool.

### 15.4 Visual rules

19. Use only the colors, fonts, radii and spacing in sections 2 to 4. Do not introduce new colors or fonts.
20. Do not use gradients (except the permitted ones), glows, neon, large drop shadows, glassmorphism, or illustrations.
21. Do not use black `#000` on the dashboard; use ink `#101319`.
22. Do not use gold as small text on light backgrounds. Do not create new gold shades.
23. Do not use emoji. Use the line icon set only.
24. Do not make every card the same: choose the visual that fits the data (section 7).
25. Keep one radius per component type (section 4.2). Do not mix rounded and square corners in the same view.
26. Do not add photos or textures to the sidebar or dashboard. Photos exist only on the login screen.

### 15.5 Behavior

27. Hide, do not disable. Enforce permissions on the server too.
28. Every list has search, filter, sort, server pagination, and loading, empty and error states.
29. Every write validates input, shows field-level errors and records an audit event.
30. Nothing on a dashboard changes a booking, payment or payout. Dashboard actions only navigate to the owning module.
31. Do not add features "to be helpful". If the specifications do not say it, do not build it.

### 15.6 Process for AI tools

When asked to build a page, an AI tool must:

1. Read this file and the matching specification in `Documentation/`.
2. State which template (A to D) the page uses and list the cards or columns it will show, each mapped to a spec field.
3. Build using only the tokens, components and wording defined here.
4. Run the checklist in section 16 and report any deviation.
5. If something is needed that is not defined, stop and ask instead of improvising.

---

## 16. Pre-merge checklist

- [ ] Uses the shell from section 5 (sidebar, top bar, page header). Top bar has only search, bell, user.
- [ ] Sidebar has only the allowed items for the role; no extras; no picture.
- [ ] One H1; no eyebrow labels; sentence case throughout.
- [ ] Only Playfair Display (titles) and Inter (everything else).
- [ ] Colors come from section 2; gold never used as small text on light; no black `#000` on the dashboard.
- [ ] Cards use radius 14, border `#EFEAE2`, the defined shadow; one gold button per view.
- [ ] KPI rows are even (4 + 4, 3 + 3, 3 + 2); each KPI has a definition tooltip and a drill-down.
- [ ] Every number and label traces to a specification field; no invented metrics.
- [ ] Nothing a role cannot access is rendered; no locked placeholders.
- [ ] Invoiced amounts are labelled "Invoiced"; single currency per figure.
- [ ] Avinode and Paynode states are honest; demo content is labelled.
- [ ] Loading, empty, error and permission-denied (route-level) states exist.
- [ ] Keyboard focus visible; contrast passes; reduced motion respected; works down to 900px and has a phone layout.

---

## 17. Open decisions (confirm with the client before they are baked in)

1. **Gold button style:** the reference mock used a darker bronze-gold with white text; the approved choice here is bright `#FFD700` with dark text. Confirm.
2. **Revenue basis:** invoiced, collected or recognized. Until approved, the label is "Invoiced revenue".
3. **Trip status mapping:** the dashboard groups the 11 spec statuses into six chart buckets. Confirm the mapping, and reconcile the trip detail tab list in spec 00 (10 tabs) with spec 04 (8 tabs). This file uses the spec 00 list.
4. **Administrator and Operations dashboards:** not designed in this version. Define whether they need a landing page.
5. **Who sees margin, commission and finance figures:** Sales Manager and Broker visibility is shown as granted in the prototype. Confirm per role.
6. **Frontend stack and fonts hosting:** React or Blazor; self-host Inter and Playfair Display for production.
7. **Timezone and currency:** the prototype uses America/New_York and USD.

---

## Appendix: file and asset reference

| File | Purpose |
|---|---|
| `Design/ayre-crm-login-and-dashboard.html` | Approved prototype of the login and the four-role dashboard |
| `Design/login-hero.jpg` | Login background photo (login screen only) |
| `Design/sidebar-bg.jpg` | Unused; the sidebar no longer has a picture |
| `Design/login-hero-image-prompt.md` | Prompt used for the login photo |
| `Documentation/*.docx` | The 18 functional specifications (00 to 17) |
