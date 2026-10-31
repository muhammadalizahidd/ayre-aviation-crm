# ADR 0002: One source of truth for color

Status: accepted. Date: 31 Oct 2026.

## Context

The platform must be re-themed, or get several themes, by changing colors only.

## Decision

- All color values live in `src/theme/themes.ts` as semantic tokens.
- A generator writes CSS variables and the Tailwind v4 `@theme` mapping from that file. The default Tailwind palette is removed.
- Components use token utilities only. Data files carry tone names, not colors.
- Enforced by `pnpm check:colors`, an ESLint rule, and tests (completeness and contrast).

## Consequences

- A theme change is an edit to one file.
- Adding a token requires adding it to every theme (the type forces it).
- Details: `docs/theming.md`.
