# 5. Tailwind utility classes without a class merger

- Status: Accepted
- Date: 2026-09-02

## Context

Components need variant and size styling. The common approach pairs
`class-variance-authority` with `tailwind-merge` and `clsx`, which resolves
conflicting utilities correctly and gives variants a declarative shape — at
the cost of three runtime dependencies in a library that otherwise ships only
React as a peer.

## Decision

Style components with Tailwind v4 utilities composed by hand: a `baseStyles`
string, `Record<Variant, string>` lookup maps, and
`[...].filter(Boolean).join(' ')`. `className` is appended last so consumers
can extend.

Tailwind is configured through `@theme inline` so utilities resolve to Kosmos
tokens rather than Tailwind defaults.

## Consequences

- No runtime dependencies beyond React, and a small bundle.
- The pattern is obvious to read and needs no library knowledge.
- **Conflicting utilities are not resolved.** Two utilities setting the same
  property are decided by stylesheet order, not by their order in the class
  string. A base `border-transparent` beats a conditional `border-destructive`
  appended after it, which is exactly how the Switch shipped with an invisible
  error state.

  The rule that follows: keep a contested property out of the base styles and
  give every branch an explicit value.

  ```tsx
  const classes = [
      baseStyles,                                    // `border`, no colour
      error ? 'border-destructive' : 'border-transparent',
      className,
  ].filter(Boolean).join(' ');
  ```

- Consumer overrides via `className` are subject to the same rule, so a
  consumer cannot reliably override an arbitrary utility. If that becomes a
  common complaint, revisit `tailwind-merge`.
