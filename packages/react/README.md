# @aether-zone/kosmos

The Kosmos React component library. ESM-only, React 19, styled with Tailwind
CSS v4 utilities that resolve to [`@kosmos/tokens`](../tokens/README.md).

## Install

The package is published to **GitHub Packages**, so npm needs to be told where
the `@aether-zone` scope lives. In an `.npmrc` beside your `package.json`:

```
@aether-zone:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` is a personal access token with the `read:packages` scope —
GitHub Packages requires authentication even for public packages.

```bash
pnpm add @aether-zone/kosmos
```

`react` and `react-dom` are peer dependencies and stay external to the bundle.
[`react-icons`](https://react-icons.github.io/react-icons/icons/io5/) is a
regular dependency, installed for you.

## Usage

```tsx
import '@aether-zone/kosmos/styles.css';

import { Button, Card, CardContent } from '@aether-zone/kosmos';

export function Example() {
    return (
        <Card>
            <CardContent>
                <Button variant="primary" size="md">
                    Save
                </Button>
            </CardContent>
        </Card>
    );
}
```

That single stylesheet is all you need. **You do not need Tailwind** — it is
precompiled and self-contained: token values, the light and dark themes, and
every utility the components use. It carries no preflight, so it will not
reset your document.

This matters because Tailwind v4 refuses to scan `node_modules`. A library
that shipped only a theme mapping would leave a consumer's own Tailwind build
unable to see any of its class names, and every component would render
unstyled — no `@source` incantation on either side changes that.

### Stylesheets

| Import | Contents | Use when |
| --- | --- | --- |
| `@aether-zone/kosmos/styles.css` | Tokens, themes and all compiled utilities | Almost always |
| `@aether-zone/kosmos/tokens.css` | Only the `--kosmos-*` variables | You want the tokens without any component CSS |
| `@aether-zone/kosmos/theme.css` | Only the token → Tailwind `@theme inline` mapping | You compile your own Tailwind and want Kosmos tokens behind its utilities |

`styles.css` already contains `tokens.css`, so importing both is redundant.

### Dark mode

Put `.dark` (or `[data-theme="dark"]`) on any ancestor — usually `<html>`:

```html
<html class="dark">
```

No provider and no JavaScript: the tokens swap in CSS, and every component
follows.

## Components

Typography
: `Blockquote`, `Code`, `Heading`, `Kbd`, `Link`, `List`/`ListItem`, `Text`

Form controls
: `Autocomplete`, `Checkbox`, `Combobox` (multi-select with chips),
  `DatePicker`, `FileUpload`, `Form` (`Field`, `FieldLabel`,
  `FieldDescription`, `FieldError`), `Input`, `Label`, `Otp`,
  `Radio`/`RadioGroup`, `Rating`, `Select`, `Slider`, `Switch`, `Textarea`,
  `ToggleGroup`

Actions and navigation
: `Breadcrumbs`, `Button`, `Command` (inline or modal palette),
  `ContextMenu`, `Dropdown`, `Menubar`, `Pagination`, `Sidenav`, `Tabs`,
  `Toolbar`, `TreeView`

Feedback and overlay
: `Alert`, `AlertDialog`, `Dialog`, `Drawer`, `Popover`, `Progress`,
  `Skeleton`, `Spinner`, `Toast` (`ToastProvider`, `useToast`), `Tooltip`

Content
: `Accordion`, `Avatar`, `Badge`, `Card`, `Carousel`, `Chip`, `EmptyState`,
  `Separator`, `Table`, `Timeline`

Every component and its props are documented in Storybook.

## Hooks

The library exports the hooks its own components are built on.

| Hook | For |
| --- | --- |
| `useMediaQuery(query)` | Any media query, read during render |
| `useBreakpoint(name)` / `useIsMobile()` | Tailwind's breakpoints, in JavaScript |
| `usePrefersReducedMotion()` | Motion a media query cannot switch off |
| `useTheme(options)` | Reading and setting light/dark/system |
| `useDisclosure(defaultOpen)` | Open/close state for an overlay |
| `useControllableState(options)` | Building your own controlled/uncontrolled component |
| `useCopyToClipboard(resetAfter)` | A copy button, with its "Copied" window |

Two are worth a note.

`useMediaQuery` is built on `useSyncExternalStore`, so it reports the right
answer on the very first render. The usual state-plus-effect version claims
the query does not match, then corrects itself — which is a flash of the wrong
layout on every mount.

`useTheme` treats `'system'` as a real choice, distinct from whatever it
resolves to: it keeps following the OS when that changes. Render against
`resolvedTheme`, and show `theme` in a theme picker.

```tsx
const { theme, resolvedTheme, setTheme } = useTheme();
```

It applies the theme the way Kosmos expects — a `dark` class on `<html>` —
and remembers the choice in `localStorage` unless you pass
`storageKey: null`. Storage failures are swallowed: a remembered theme is not
worth failing a render over.

## Conventions

Components are plain functions that join Tailwind class strings by hand —
a `baseStyles` string plus `Record<Variant, string>` lookup maps. There is no
`cva` or `clsx` dependency.

One consequence is worth internalising: **competing Tailwind utilities resolve
by stylesheet order, not by their order in the class string.** A base
`border-transparent` will beat a conditional `border-destructive` appended
after it. Keep the conflicting property out of the base styles and put every
branch in the conditional:

```tsx
const classes = [
    baseStyles,                          // `border`, no colour
    error ? 'border-destructive' : 'border-input',
    className,
].filter(Boolean).join(' ');
```

`className` always comes last so consumers can override.

## Overlays

`Dropdown`, `Tooltip`, `Autocomplete` and `DatePicker` render their panels
through `src/internal/OverlayPanel`, which portals to `document.body` and
positions against the anchor by measurement. Rendering in place is simpler,
but the panel is then clipped by any ancestor with `overflow: hidden` — a
Card, a scrolling sidebar, a table cell. Build new overlays on the same
primitive rather than reaching for `absolute`.

The trade-off portalling brings is that the panel leaves its DOM subtree, so
"click outside" has to consider two detached trees; `useDismiss` takes a list
of refs for exactly that reason.

Modal surfaces go through `ModalOverlay`, which bundles the portal, backdrop,
focus trap, scroll lock and Escape handling. `Dialog`, `Drawer` and
`AlertDialog` all share it: `aria-modal="true"` asserts the rest of the page
is inert, and a modal that lets focus or scrolling escape is lying about that,
so it is worth having exactly one implementation of.

Which overlay to reach for:

| | Portalled | Focus trapped | Page behind |
| --- | --- | --- | --- |
| `Tooltip`, `Dropdown`, `Popover` | yes | no | live |
| `Dialog`, `Drawer` | yes | yes | inert |
| `AlertDialog` | yes | yes | inert, and the backdrop does not dismiss |

`AlertDialog` refuses backdrop dismissal and puts initial focus on the cancel
action, so neither a stray click nor a reflexive Enter can confirm something
destructive.

`OverlayPanel` anchors to anything that can report a rectangle, not just a DOM
node — `ContextMenu` passes a zero-size rect at the cursor.

**Moving focus into an overlay opened by a click must be deferred a frame.**
The browser settles focus onto `<body>` as part of handling that click, and it
does so *after* React has run its effects, so an immediate `.focus()` is
silently undone. `ContextMenu` and `Menubar` both wrap the move in
`requestAnimationFrame` for this reason; without it their arrow keys and
Escape appear to do nothing, because the panel that handles those keys was
never focused.

## Typography

The text components consume the **semantic** type tokens — `text-body`,
`text-label`, `text-heading`, `text-display` — rather than the raw `xs…5xl`
scale, so a component asks for body text or a label rather than a size. Until
these components existed the semantic layer was defined but unused.

`Heading` keeps `level` and `size` independent: the level sets the tag and so
the document outline, while the size sets the appearance. An `h2` can look
small without breaking the outline to get there.

One Tailwind constraint shows up here. Utilities are generated only from
classes it can see in source, so a variable count cannot be interpolated into
a class name — `Text`'s `lineClamp` maps through a lookup of literal
`line-clamp-N` classes for that reason.

## Motion

Animation is wrapped in Tailwind's `motion-safe:` variant, so it stops for
anyone whose system asks for reduced motion. No animation runtime is involved
— this is a media query, and the rules ship inside `styles.css`.

Two things a media query cannot do, which components handle themselves:

- **Content that moves on a timer** has to actually stop. `Carousel` reads the
  preference through `usePrefersReducedMotion` and does not auto-advance.
- **A spinner that freezes conveys nothing**, so it keeps turning at 2.5s
  rather than 1s instead of stopping.

An auto-playing `Carousel` also renders a pause control, which WCAG 2.2.2
requires of anything that moves for more than five seconds. Pausing on hover
is not enough: it does nothing on a touch screen, or for someone reading.

## Icons

Icons come from the Ionicons 5 set via `react-icons/io5`, always imported from
that subpath so bundlers can tree-shake — never from the `react-icons` root.
They are sized with Tailwind (`size-4`) and inherit `currentColor`, so an icon
picks up the colour of whatever it sits in without any variant plumbing.
`react-icons` stays external to the bundle.

Ionicons 5 has no text-formatting glyphs (no bold or italic), which is worth
knowing before designing a rich-text toolbar against it.

Use `*-foreground` tokens only on their matching **solid** fill —
`text-success-foreground` is white, so it disappears on a `bg-success/10`
tint. Tinted surfaces take `text-foreground`.

## Adding a component

```
src/components/<name>/
  <Name>.tsx     component and its exported prop types
  index.ts       export * from './<Name>'
```

Re-export the directory from `src/components/index.ts`, then add a story in
`apps/storybook/src/stories/components/<Name>.stories.tsx` importing from
`@aether-zone/kosmos` — never by a relative path into the package.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm build` | `tsup` bundle plus a copy of `styles.css` into `dist`. |
| `pnpm dev` | `tsup --watch`. |
| `pnpm typecheck` | `tsc --noEmit`. |
