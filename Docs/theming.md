# Theming: one source of truth for color

All color values are defined in **`src/theme/themes.ts`**. Nothing else in the repository may contain a hex, `rgb()`, `hsl()` or other color literal.

## How it works

```
src/theme/themes.ts          the only place with color values (semantic tokens per theme)
        |  pnpm theme:generate (runs before dev, build and typecheck)
        v
src/styles/theme.generated.css   CSS variables per theme + the Tailwind mapping (generated, git-ignored)
        |
        v
components use utilities such as  bg-surface-card  text-status-danger-text  border-line-default
```

Components never name a color ("gold", "red"). They name a purpose ("action primary", "status danger").

## Change the look of the whole platform

Edit values in `src/theme/themes.ts` and reload. Nothing else changes.

## Add a second theme

1. In `src/theme/themes.ts`, add an object with the same shape as `ayre` (TypeScript forces every token to exist) and register it in `themes`.
2. Set `NEXT_PUBLIC_THEME=<name>` (see `.env.example`) and run `pnpm dev`.
3. The root `<html>` gets `data-theme="<name>"`, which selects that theme's variables.

## Add a new token

1. Add it to the `ayre` object (and to every other theme).
2. Run `pnpm theme:generate`. Use it through its generated utility, for example `status.danger.text` becomes `text-status-danger-text`.

## What protects the single source

| Check | Fails when |
|---|---|
| `pnpm check:colors` | a color literal appears outside `src/theme/` |
| ESLint `no-restricted-syntax` | a color string literal appears in code |
| Tailwind palette removed | `bg-red-500` or similar is used (the class does not exist) |
| `src/theme/themes.test.ts` | a theme lacks a token, a name collides, or a text and surface pair drops below WCAG AA contrast |

## Data files carry tone names, never colors

`mock-db.json` says `"tone": "success"`. The UI maps tones to token classes in `src/ui/tones.ts`. So even data changes never touch color.
