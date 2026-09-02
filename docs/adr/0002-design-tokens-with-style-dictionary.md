# 2. Design tokens with Style Dictionary

- Status: Accepted
- Date: 2026-09-02

## Context

Component styling needs a single source of truth for color, spacing, radius,
shadow and type. Hard-coding values into components makes a palette change a
find-and-replace across every file, and makes it impossible to answer "what is
our primary blue?" from one place.

The values also need to reach more than one target eventually — CSS today,
plausibly native or documentation tooling later — so the authoring format
should not be CSS itself.

## Decision

Author tokens as [DTCG](https://tr.designtokens.org/) JSON and compile them
with Style Dictionary into CSS custom properties.

Tokens are layered:

- **Primitives** — raw scales (`color.blue.600`, `spacing.4`). No component
  ever references these.
- **Semantic** — roles that alias primitives (`color.primary` →
  `{color.blue.600}`). Components reference only these.

The two layers are what make a rebrand tractable: changing which primitive
`color.primary` points at reskins every component that uses it, with no
component edits.

## Consequences

- Adding a color means editing JSON, not CSS, and rebuilding the tokens package.
- Tokens can gain other outputs (JSON, native, docs) by adding a Style
  Dictionary platform, without touching the sources.
- There is a build step between authoring a token and seeing it, so
  `pnpm build` must run before Storybook.
- Style Dictionary flattens nested paths into names, which means two different
  token paths can collide on one CSS variable name. See ADR 3.
