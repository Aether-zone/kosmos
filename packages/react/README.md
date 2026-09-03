# @aether-zone/kosmos

The Kosmos React component library. ESM-only, React 19, styled with Tailwind
CSS v4 utilities that resolve to [`@kosmos/tokens`](../tokens/README.md).

## Install

```bash
pnpm add @aether-zone/kosmos
```

`react` and `react-dom` are peer dependencies and stay external to the bundle.

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

`styles.css` maps Kosmos tokens onto Tailwind's theme namespaces. It does not
contain the token values themselves, so import `@kosmos/tokens/tokens.css`
(or your own stylesheet defining the same `--kosmos-*` variables) as well.

## Components

Form controls
: `Autocomplete`, `Checkbox`, `DatePicker`, `FileUpload`, `Form` (`Field`,
  `FieldLabel`, `FieldDescription`, `FieldError`), `Input`, `Label`, `Otp`,
  `Radio`/`RadioGroup`, `Select`, `Slider`, `Switch`, `Textarea`

Actions and navigation
: `Breadcrumbs`, `Button`, `Dropdown`, `Pagination`, `Sidenav`, `Tabs`,
  `Toolbar`

Feedback and overlay
: `Alert`, `Dialog`, `Progress`, `Skeleton`, `Spinner`, `Toast`
  (`ToastProvider`, `useToast`), `Tooltip`

Content
: `Accordion`, `Avatar`, `Badge`, `Card`, `EmptyState`, `Separator`, `Table`

Every component and its props are documented in Storybook.

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

Modal surfaces additionally use `useFocusTrap` and `useScrollLock`.
`aria-modal="true"` asserts the rest of the page is inert, and those two
hooks are what make the assertion true.

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
