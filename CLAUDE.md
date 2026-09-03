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

pnpm --filter @kosmos/storybook storybook        # dev server on :6006
pnpm --filter @kosmos/storybook build-storybook
pnpm --filter @kosmos/storybook lint             # oxlint (the only lint that actually runs)
```

Storybook now defines `test` and `typecheck`, so the root scripts reach it. Note it is still not part of root `build`/`dev`; and Storybook is *not* wired into the root scripts — it has no `build`/`dev`/`test`/`typecheck` script of its own. Component tests run through the Storybook Vitest addon (`apps/storybook/vite.config.ts`, headless Chromium via Playwright); run them with `pnpm --filter @kosmos/storybook exec vitest run`, and a single story file with `... vitest run src/stories/components/Button.stories.tsx`.

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

**What the package ships is precompiled.** Tailwind v4 refuses to scan `node_modules`, so a consumer's Tailwind build can never see this library's class names — no `@source` form on either side changes that. `packages/react/src/tailwind.css` therefore runs the Tailwind CLI over the component source at build time and `dist/styles.css` is the finished stylesheet: tokens, both themes, every utility used, and no preflight. `dist/theme.css` (the raw `@theme inline` mapping) and `dist/tokens.css` are also exported. Storybook imports `theme.css` because it compiles from source; consumers import `styles.css`. `@kosmos/tokens` is a **devDependency** of the library — it is workspace-private and could never resolve for a consumer.

Dark mode is applied by putting `.dark` (or `[data-theme="dark"]`) on any ancestor. Storybook does this on `<html>` via the **Theme** toolbar control (`apps/storybook/.storybook/withTheme.tsx`) — on the document root rather than a wrapper element, so it cannot disturb a story's own layout.

## Conventions

- Text components (`Text`, `Heading`, `Link`, `Code`, `Kbd`, `Blockquote`, `List`) use the semantic type tokens — `text-body`, `text-label`, `text-heading`, `text-display` — not the raw `xs…5xl` scale. `Heading` keeps `level` (tag, outline) independent of `size` (appearance).
- Tailwind only generates classes it can see in source, so a class name can never be interpolated from a variable. Map through a lookup of literal classes instead — see `Text`'s `lineClamp`.
- Animation is gated on `motion-safe:` so it stops for `prefers-reduced-motion`. Two exceptions, both deliberate: the Spinner keeps turning (slowed via `motion-reduce:`), because a frozen spinner conveys nothing; and anything moving on a *timer* has to stop in JavaScript, not CSS — `usePrefersReducedMotion` exists for that, and Carousel uses it. Auto-moving content also owes a visible pause control under WCAG 2.2.2; pausing on hover does nothing on a touch screen.
- The bundle carries a `'use client'` banner (`tsup.config.ts`). Without it, importing anything into a React Server Component fails with `createContext is not a function`. Verified against a real Next.js build in both directions. Removing it, or splitting the bundle, needs that check repeated.
- Icons come from `react-icons/io5` (Ionicons 5), always imported from that subpath so it tree-shakes, sized with Tailwind (`size-4`) and left to inherit `currentColor`. `react-icons` is a dependency of the library and stays external to the bundle. Note io5 has no bold/italic glyphs.
- Overlays (`Dropdown`, `Tooltip`, `Autocomplete`, `DatePicker`) go through `src/internal/OverlayPanel`, which portals to `document.body` and positions by measurement — rendering in place gets clipped by any `overflow: hidden` ancestor. Build new overlays on it rather than on `absolute`. Because the panel leaves its subtree, "click outside" spans two detached trees, which is why `useDismiss` takes a list of refs. Modal surfaces (`Dialog`, `Drawer`, `AlertDialog`) go through `ModalOverlay`, which bundles portal, backdrop, focus trap, scroll lock and Escape — `aria-modal` is a claim those make true, so don't hand-roll a second copy.
- Moving focus into a portalled overlay must be deferred a frame (`requestAnimationFrame`). Two things defeat an immediate `.focus()`: the browser settles focus onto `<body>` while handling the click that opened the panel, after React's effects have run; and reaching into a freshly portalled subtree from the passive effect of the opening render is not reliable. The symptom is arrow keys and Escape doing nothing, because the panel handling them was never focused. `Dropdown`, `ContextMenu` and `Menubar` all do this.
- Triggers take `asChild` to render onto their child instead of wrapping it (`src/internal/Slot.tsx`). Without it, passing a `Button` to a trigger nests a `<button>` inside a `<button>`.
- Hooks live in `packages/react/src/hooks` and are public API (`src/index.ts` re-exports them). `src/internal` is for things components share but consumers should not depend on — overlays, focus trapping, `Slot`. Media-query hooks use `useSyncExternalStore` so they are correct on first render rather than after an effect.
- `useControllableState` is the controlled/uncontrolled pattern 15 components hand-rolled. New components should use it; `Accordion` and `ToggleGroup` are the worked examples.
- Adding a component: create `packages/react/src/components/<name>/<Name>.tsx` with an `index.ts` beside it, re-export from `components/index.ts` (`src/index.ts` just re-exports `./components`). Add a story under `apps/storybook/src/stories/components/`, importing from `@aether-zone/kosmos` — never by relative path into the package.
- Token docs live as MDX in `apps/storybook/src/stories/*.mdx` and read `var(--kosmos-color-*)` / `var(--kosmos-radius-*)` directly rather than going through Tailwind classes. Keep JSX text on the same line as its tag: content on its own line is re-parsed as a markdown paragraph, producing a nested unstyled `<p>` that Storybook's docs CSS then colors itself.
- **Competing Tailwind utilities resolve by stylesheet order, not class-string order.** A base `border-transparent` beats a conditional `border-destructive` appended after it — that shipped as an invisible error state on Switch. Keep a contested property out of the base styles and give every branch an explicit value.
- **`*-foreground` tokens are for their matching solid fill only.** `success-foreground` is white, so `text-success-foreground` on `bg-success/10` is invisible; tinted surfaces take `text-foreground`. This shipped in both Alert and Toast.
- `react`/`react-dom` are peer deps of the library and marked external in `tsup.config.ts`; keep them out of the bundle.
- The a11y addon runs at `test: 'error'`, so axe violations fail the run. A story that genuinely cannot satisfy a rule opts out on itself via `parameters.a11y.config.rules` with a reason — the two that do are disabled controls, which WCAG 1.4.3 exempts but axe measures anyway.
- `warning` and `destructive` each have a text-safe pair. A fill colour is chosen so its own label is readable *on* it; the same colour used as text on a page surface is a different constraint, and for yellow and red the two pull apart. Use `warning`/`destructive` for fills and `warning-emphasis`/`destructive-emphasis` for text and meaningful graphics. `success` needs no split — green-700 clears both.
- `border` and `input` are not interchangeable: `border` is decoration (exempt from contrast rules), `input` is a control boundary and owes 3:1 under WCAG 1.4.11. Same for `ring`, which is why dark's ring is not dark's `primary`.
- `packages/react/src/__tests__/contrast.test.ts` parses the built tokens and asserts every fill carries its foreground and every text colour is readable on every surface, in **both** themes. The a11y story tests only render light, which is how dark shipped with white on blue-500 at 3.7:1.
- Releases go through Changesets: a change that should ship carries a changeset, and `release.yml` opens a *Version packages* PR whose merge publishes. A change with no changeset never ships — see ADR 9.
- `packages/tokens/dist/tokens.css` emits `--kosmos-font-family-*` and `--kosmos-font-weight-*` twice, because `primitives/typography.json` (`fontFamily.sans`) and `semantic/typography.json` (`font.family.sans`) transform to the same variable name. The values are identical so nothing breaks, but it is the one collision the build still warns about.
- CI is two workflows. `ci.yml` builds, then runs `pnpm typecheck`, `pnpm lint` and `pnpm test` (every story rendered in headless Chromium). `chromatic.yml` publishes Storybook for visual regression using the `CHROMATIC_KEY` secret. `publish.yml` releases to GitHub Packages on a published Release.
- Lint runs `oxlint --deny-warnings` in both workspaces, so the tree is warning-free and must stay that way. `packages/react` has no unit tests of its own — its behaviour is covered by the stories — so its `test` script passes with none.
- Regressions are guarded by `play` functions on stories named after the behaviour (`ThumbMovesWhenChecked`, `ArrowKeysReachEveryTab`, `TrapsFocusAndLocksScroll`, …). Each one exists because that exact bug shipped. When fixing a behavioural bug, add one.
- Architectural decisions belong in `docs/adr/` as ADRs, indexed in `docs/adr/README.md`. Accepted ADRs are never rewritten — supersede them with a new one. ADRs 1-8 cover the monorepo, tokens, per-theme builds, `@theme inline`, the class-merger trade-off, Storybook, ESM-only publishing and Chromatic; read the relevant one before reversing any of those.
- Each workspace has its own README (`packages/tokens`, `packages/react`, `apps/storybook`) covering that project's conventions in more depth than this file.
