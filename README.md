# Kosmos

A React design system built on design tokens: a token package that compiles to
CSS custom properties, a component library that maps those properties onto
Tailwind utilities, and a Storybook that documents both.

## Packages

| Package | Name | Description |
| --- | --- | --- |
| `packages/tokens` | `@kosmos/tokens` | Design tokens as DTCG JSON, compiled to CSS custom properties with Style Dictionary. Private. |
| `packages/react` | `@aether-zone/kosmos` | The published React component library. ESM-only, React 19. |
| `apps/storybook` | — | Component workshop, token documentation and visual-test source. |

## Getting started

```bash
pnpm install
pnpm build                                # tokens, then the component library
pnpm --filter storybook storybook         # http://localhost:6006
```

`pnpm build` comes first: Storybook consumes `@kosmos/tokens/tokens.css` and
`@aether-zone/kosmos/styles.css` from `dist`, so an unbuilt workspace renders
unstyled stories.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm build` | Builds tokens, then the library. Order follows the workspace dependency. |
| `pnpm dev` | Rebuilds the library on change (`tsup --watch`). |
| `pnpm typecheck` | `tsc --noEmit` across the workspace. |
| `pnpm --filter storybook storybook` | Storybook dev server. |
| `pnpm --filter storybook build-storybook` | Static Storybook build. |
| `pnpm --filter storybook lint` | Lints the Storybook app with oxlint. |
| `pnpm --filter storybook exec vitest run` | Renders every story in headless Chromium. |

Run a single story file with
`pnpm --filter storybook exec vitest run src/stories/components/Button.stories.tsx`.

## How theming works

Tokens flow through four stages, and each stage is a separate file worth
knowing about:

1. **Primitives** (`packages/tokens/src/tokens/primitives`) hold raw scales —
   `color.blue.600`, spacing, radius, shadows, type.
2. **Semantic tokens** (`.../semantic/colors.json`) alias primitives to roles:
   `color.primary` → `{color.blue.600}`. This file is also the light theme.
   `dark.json` redeclares the same paths with dark values.
3. **`packages/tokens/build.mjs`** runs Style Dictionary once per theme and
   concatenates the output into `dist/tokens.css`: everything under `:root`,
   then the dark overrides under `.dark, [data-theme="dark"]`.
4. **`packages/react/src/styles.css`** maps those variables onto Tailwind's
   theme namespaces with `@theme inline`, so `bg-primary` resolves to
   `--kosmos-color-primary`.

Switching theme therefore means putting `.dark` (or `[data-theme="dark"]`) on
any ancestor — no provider, no JavaScript. Storybook exposes this as a
**Theme** toolbar control.

Variable names follow `--kosmos-<category>-<name>`, so semantic colors are
`--kosmos-color-primary`, not `--kosmos-primary`.

## Using the library

```tsx
import '@aether-zone/kosmos/styles.css';

import { Button } from '@aether-zone/kosmos';

export function Example() {
    return <Button variant="primary">Save</Button>;
}
```

Components are styled with Tailwind utility classes that resolve to Kosmos
tokens, so the consuming app needs Tailwind v4 and must import the token
stylesheet alongside the component styles.

## Documentation

- [Architecture decisions](docs/adr/README.md) — why the system is put together this way.
- [`CLAUDE.md`](CLAUDE.md) — working notes for automated contributors.
