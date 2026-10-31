# AGENTS.md

The full rulebook for AI agents and developers is **`Docs/AGENTS.md`**. Read it completely before doing anything in this repository. It also points to the PRD (`Docs/Ayre_Aviation_Broker_CRM_PRD_Frontend_Meeting_Updated.md`), the design system (`Docs/DESIGN.md`) and the delivery plan (`Docs/IMPLEMENTATION_PLAN.md`).

Project facts every task must respect:

- This is a **frontend prototype on mock JSON data**. Never present mocked or deferred behavior as real.
- Four layers with enforced boundaries: UI, business logic (`src/bll`), backend (`src/backend`), database (`src/database`). Run `pnpm check:layers`.
- **All colors live in `src/theme/themes.ts` only.** Run `pnpm check:colors`.
- Before declaring work done, run `pnpm verify` and follow the self-review and cleanup protocol in `Docs/AGENTS.md` section 13.
