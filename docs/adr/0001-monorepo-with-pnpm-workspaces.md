# 1. Monorepo with pnpm workspaces

- Status: Accepted
- Date: 2026-09-02

## Context

Kosmos is three moving parts that change together: design tokens, a React
component library, and the Storybook that documents both. A token rename has
to reach the components and the docs in the same commit, or the docs describe
a system that no longer exists.

Splitting them across repositories would mean publishing a token release
before a component could consume it, and reviewing a single visual change as
three pull requests.

## Decision

Keep all three in one repository as pnpm workspaces: `packages/*` for
publishable and internal libraries, `apps/*` for things that are run rather
than consumed.

Cross-package dependencies use the `workspace:*` protocol, so a component
change and the token change it depends on are always the same commit.

Root scripts fan out with `pnpm -r`, which runs each workspace in dependency
order — `@kosmos/tokens` builds before `@aether-zone/kosmos` because the
latter depends on it.

## Consequences

- One review, one CI run, one atomic change across tokens, components and docs.
- `pnpm build` is a prerequisite for running Storybook, because the app
  consumes its siblings' `dist` output rather than their source.
- Root scripts only reach workspaces that define the matching script, so a
  package without a `test` script is silently skipped rather than failing.
- Publishing is per-package: `@kosmos/tokens` stays private, and only
  `@aether-zone/kosmos` is released.
