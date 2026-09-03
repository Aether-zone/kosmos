# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Kosmos is a design system monorepo (pnpm workspaces, `packages/*` + `apps/*`). Two source packages plus a Storybook app:

- `packages/tokens` — `@kosmos/tokens` (private). Design tokens as DTCG-style JSON, compiled to CSS custom properties by Style Dictionary.
- `packages/react` — `@aether-zone/kosmos` (the published package). React 19 component library, ESM-only, built with tsup.
- `apps/storybook` — Storybook 10 + Vite 8, consumes both via `workspace:*`. Hosts the component stories and the Design Tokens docs pages.
- `apps/docs` — empty placeholder (no `package.json`, not part of the workspace yet).

## Commands

Root scripts fan out with `pnpm -r`, so they only hit workspaces that define the script.

```bash
pnpm build       # tokens (style-dictionary) then react (tsup); topological via workspace dep
pnpm dev         # react only: tsup --watch
pnpm typecheck   # react only: tsc --noEmit — this is the reliable gate today
pnpm lint        # BROKEN: react declares `eslint .` but eslint is not a dependency and no config exists
pnpm test        # BROKEN: react declares `vitest run` but has no test files (vitest exits 1)

pnpm --filter storybook storybook        # dev server on :6006
pnpm --filter storybook build-storybook
pnpm --filter storybook lint             # oxlint (the only lint that actually runs)
```

Storybook is *not* wired into the root scripts — it has no `build`/`dev`/`test`/`typecheck` script of its own. Component tests run through the Storybook Vitest addon (`apps/storybook/vite.config.ts`, headless Chromium via Playwright); run them with `pnpm --filter storybook exec vitest run`, and a single story file with `... vitest run src/stories/components/Button.stories.tsx`.

Run `pnpm build` before starting Storybook: `apps/storybook/src/styles.css` imports both `@kosmos/tokens/tokens.css` and `@aether-zone/kosmos/styles.css` from `dist`, so a stale or missing build means unstyled stories.

## The token → CSS → component pipeline

This is the part that requires reading several files to understand.

1. `packages/tokens/src/tokens/primitives/*.json` hold raw scales (`color.gray.100`, spacing, radius, shadows, typography).
2. `packages/tokens/src/tokens/semantic/*.json` alias those primitives to roles. `colors.json` is the complete, `$type`-annotated semantic set and doubles as the light theme; `dark.json` redeclares the same paths with dark values.
3. `packages/tokens/build.mjs` runs Style Dictionary **once per theme** and concatenates the results into `packages/tokens/dist/tokens.css`: `colors.json` + primitives + typography under `:root`, then only the paths `dark.json` overrides under `.dark, [data-theme="dark"]`. All names are prefixed `kosmos` and follow `--kosmos-<category>-<name>` — so semantic colors are `--kosmos-color-primary`, *not* `--kosmos-primary`.
4. `packages/react/src/styles.css` maps those variables onto Tailwind's theme namespaces (`--color-*`, `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`), so `bg-primary` resolves to a Kosmos token rather than a Tailwind default. It ships as `@aether-zone/kosmos/styles.css` and `apps/storybook/src/styles.css` imports it, so the mapping exists in exactly one place.
5. Components use plain Tailwind class strings (see `packages/react/src/components/button/Button.tsx`: a `baseStyles` string plus `Record<Variant, string>` / `Record<Size, string>` lookup maps, joined by hand — no `cva`/`clsx` dependency).

Two things in here are load-bearing and easy to undo by accident:

- **The theme block must stay `@theme inline`.** Without `inline`, Tailwind emits `--color-primary: var(--kosmos-color-primary)` into `:root`; a custom property is substituted at the element it is *declared* on, so it would resolve once against `:root` and inherit as a fixed value, and a nested `.dark` container could never re-resolve it. `inline` substitutes the token straight into each utility instead.
- **Each theme needs its own Style Dictionary pass.** All sources deep-merge into one token tree, so building `colors.json` and `dark.json` together leaves only whichever sorts last. That is what `build.mjs` exists to avoid — the dark pass also disables collision warnings, because redeclaring every path it themes *is* the point.

Dark mode is applied by putting `.dark` (or `[data-theme="dark"]`) on any ancestor. Storybook does this on `<html>` via the **Theme** toolbar control (`apps/storybook/.storybook/withTheme.tsx`) — on the document root rather than a wrapper element, so it cannot disturb a story's own layout.

## Conventions

- Icons come from `react-icons/io5` (Ionicons 5), always imported from that subpath so it tree-shakes, sized with Tailwind (`size-4`) and left to inherit `currentColor`. `react-icons` is a dependency of the library and stays external to the bundle. Note io5 has no bold/italic glyphs.
- Overlays (`Dropdown`, `Tooltip`, `Autocomplete`, `DatePicker`) go through `src/internal/OverlayPanel`, which portals to `document.body` and positions by measurement — rendering in place gets clipped by any `overflow: hidden` ancestor. Build new overlays on it rather than on `absolute`. Because the panel leaves its subtree, "click outside" spans two detached trees, which is why `useDismiss` takes a list of refs. Modal surfaces (`Dialog`, `Drawer`, `AlertDialog`) go through `ModalOverlay`, which bundles portal, backdrop, focus trap, scroll lock and Escape — `aria-modal` is a claim those make true, so don't hand-roll a second copy.
- Adding a component: create `packages/react/src/components/<name>/<Name>.tsx` with an `index.ts` beside it, re-export from `components/index.ts` (`src/index.ts` just re-exports `./components`). Add a story under `apps/storybook/src/stories/components/`, importing from `@aether-zone/kosmos` — never by relative path into the package.
- Token docs live as MDX in `apps/storybook/src/stories/*.mdx` and read `var(--kosmos-color-*)` / `var(--kosmos-radius-*)` directly rather than going through Tailwind classes. Keep JSX text on the same line as its tag: content on its own line is re-parsed as a markdown paragraph, producing a nested unstyled `<p>` that Storybook's docs CSS then colors itself.
- **Competing Tailwind utilities resolve by stylesheet order, not class-string order.** A base `border-transparent` beats a conditional `border-destructive` appended after it — that shipped as an invisible error state on Switch. Keep a contested property out of the base styles and give every branch an explicit value.
- **`*-foreground` tokens are for their matching solid fill only.** `success-foreground` is white, so `text-success-foreground` on `bg-success/10` is invisible; tinted surfaces take `text-foreground`. This shipped in both Alert and Toast.
- `react`/`react-dom` are peer deps of the library and marked external in `tsup.config.ts`; keep them out of the bundle.
- Storybook a11y addon is set to `test: 'todo'` in `.storybook/preview.tsx` — violations show in the test UI but do not fail CI.
- `packages/tokens/dist/tokens.css` emits `--kosmos-font-family-*` and `--kosmos-font-weight-*` twice, because `primitives/typography.json` (`fontFamily.sans`) and `semantic/typography.json` (`font.family.sans`) transform to the same variable name. The values are identical so nothing breaks, but it is the one collision the build still warns about.
- CI is `.github/workflows/chromatic.yml`: it builds the packages and publishes Storybook to Chromatic for visual regression on pushes to `main` and on pull requests, using the `CHROMATIC_KEY` secret. Nothing else runs in CI yet — typecheck, lint and the story tests are local-only.
- Architectural decisions belong in `docs/adr/` as ADRs, indexed in `docs/adr/README.md`. Accepted ADRs are never rewritten — supersede them with a new one. ADRs 1-8 cover the monorepo, tokens, per-theme builds, `@theme inline`, the class-merger trade-off, Storybook, ESM-only publishing and Chromatic; read the relevant one before reversing any of those.
- Each workspace has its own README (`packages/tokens`, `packages/react`, `apps/storybook`) covering that project's conventions in more depth than this file.
