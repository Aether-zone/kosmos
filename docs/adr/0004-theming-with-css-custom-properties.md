# 4. Theming with CSS custom properties and `@theme inline`

- Status: Accepted
- Date: 2026-09-03

## Context

Components need to change appearance with the theme without every component
knowing a theme exists. The options were a React context carrying values, or
CSS custom properties that cascade on their own.

A context means every styled component subscribes to it, re-renders on a theme
change, and cannot be used outside a provider. Custom properties cascade
natively, cost nothing at runtime, and work in plain HTML.

There is a subtlety that decides the implementation. A custom property is
substituted at the element where it is **declared**, not where it is used. So
this looks right and cannot work:

```css
:root { --color-primary: var(--kosmos-color-primary); }
```

`--color-primary` resolves once against `:root`, to the light value, and
children inherit that resolved value. Redefining `--kosmos-color-primary`
lower in the tree changes nothing.

## Decision

Theme by swapping token values under a `.dark` (or `[data-theme="dark"]`)
selector, and map tokens onto Tailwind with **`@theme inline`**.

`inline` substitutes the token directly into each generated utility —
`.bg-primary { background-color: var(--kosmos-color-primary) }` — so the
variable resolves at the element that uses it, and any `.dark` ancestor
re-resolves it.

## Consequences

- Theme switching is one class on one element. No provider, no JavaScript, no
  re-render.
- Themes nest: a `.dark` container inside a light page renders dark, which is
  what lets the documentation show both themes side by side.
- The `inline` keyword is load-bearing and easy to delete by accident.
  Removing it breaks nested theming while leaving the top-level case working,
  so the failure looks like a Storybook bug rather than a CSS one.
- Consumers must load the token stylesheet as well as the component styles;
  the component styles only carry the mapping.
