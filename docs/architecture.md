# Architecture

How Kosmos is put together, and why the seams fall where they do. The
reasoning behind each decision lives in the [ADRs](adr/README.md); this is the
map.

## Three packages, one direction of travel

```
packages/tokens  →  packages/react  →  apps/storybook
  design tokens      the library         workshop, docs, tests
  (private)          (published)         (private)
```

Nothing flows backwards. Tokens know nothing about components; components know
nothing about Storybook. `@kosmos/tokens` is a **build input** to the library,
not a runtime dependency — it is workspace-private and could never resolve for
a consumer, so its output is compiled into what the library ships.

## The token pipeline

The part worth understanding before changing anything:

1. **Primitives** hold raw scales — `color.blue.600`, `spacing.4`. No component
   ever references one.
2. **Semantic tokens** alias primitives to roles — `color.primary` →
   `{color.blue.600}`. Components reference only these, which is what makes a
   rebrand a change to one file.
3. **`build.mjs`** runs Style Dictionary **once per theme** and concatenates:
   everything under `:root`, then dark's overrides under
   `.dark, [data-theme="dark"]`. One pass cannot do it — sources deep-merge, so
   the themes would collapse into whichever sorted last ([ADR 3](adr/0003-one-style-dictionary-pass-per-theme.md)).
4. **`styles.css`** maps those variables onto Tailwind's theme namespaces with
   `@theme inline`, so `bg-primary` resolves to a Kosmos token.

Theming is then a `dark` class on an ancestor. No provider, no JavaScript
([ADR 4](adr/0004-theming-with-css-custom-properties.md)).

## What the library ships

Tailwind refuses to scan `node_modules`, so a consumer's own Tailwind build can
never see this package's class names. The library therefore compiles its own
CSS and ships the result — tokens, both themes, every utility it uses, no
preflight. Consumers need one import and no Tailwind at all.

The bundle also carries `'use client'`. Most components use state, refs or
portals, and without the directive importing any of them into a React Server
Component fails outright.

## Inside the library

```
src/
  components/<name>/   one directory per component
  hooks/               public: useMediaQuery, useTheme, useControllableState, …
  internal/            shared, not public: OverlayPanel, ModalOverlay, Slot,
                       focus trap, scroll lock, dismiss
  styles.css           token → Tailwind mapping
  tailwind.css         build input for the shipped stylesheet
```

The `internal` / `hooks` split is the API boundary: anything under `hooks` is
supported for consumers, anything under `internal` can change freely.

Overlays are the one place with real shared machinery. Everything that floats —
Dropdown, Tooltip, Popover, ContextMenu, Menubar, Autocomplete, Combobox,
DatePicker — renders through `OverlayPanel`, which portals to `document.body`
and positions by measurement, because an overlay rendered in place is clipped
by any ancestor with `overflow: hidden`. Everything modal — Dialog, Drawer,
AlertDialog — goes through `ModalOverlay`, which owns the portal, backdrop,
focus trap and scroll lock together, since `aria-modal` is a claim those make
true.

## How it is verified

| Layer | Checked by |
| --- | --- |
| Types | `tsc --noEmit` in both workspaces |
| Style | `oxlint --deny-warnings` |
| Behaviour | Every story rendered in headless Chromium, plus `play` functions guarding past regressions |
| Accessibility | axe on every story, failing the run |
| Colour | Contrast asserted against the built tokens, in both themes |
| Appearance | Chromatic, per pull request |

The contrast test exists because the story tests only ever render the light
theme; the dark palette shipped once with white on blue-500 at 3.7:1.

## Releasing

A change that should ship carries a changeset. On a push to `main` the release
workflow either opens a *Version packages* pull request or, once that merges,
publishes to GitHub Packages ([ADR 9](adr/0009-changesets-for-versioning-and-release.md)).
