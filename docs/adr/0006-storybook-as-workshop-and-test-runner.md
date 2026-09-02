# 6. Storybook as workshop, documentation and test runner

- Status: Accepted
- Date: 2026-09-02

## Context

A component library needs somewhere to develop components in isolation,
somewhere to document them, and some way to know a change did not break them.
Three separate tools would mean three descriptions of the same component
drifting apart.

## Decision

Use Storybook for all three.

- **Workshop** — every component has a story file; stories are the development
  environment.
- **Documentation** — `autodocs` generates prop tables from the TypeScript
  types, and MDX pages document the design tokens.
- **Tests** — `@storybook/addon-vitest` renders every story in headless
  Chromium, so a story that throws is a failing test. The a11y addon runs
  alongside in `'todo'` mode.

Stories import from `@aether-zone/kosmos`, the package entry point, rather
than by relative path into `src`.

## Consequences

- Writing a story is writing a test and a doc page. Coverage follows from a
  convention rather than discipline.
- The tests assert that stories render, not that they behave. Interaction
  assertions need `play` functions, which stories do not currently have.
- Importing through the package entry means Storybook exercises the same
  surface consumers get — and requires `pnpm build` before it will run.
- Storybook is not wired into the root `build`/`test` scripts, so its checks
  must be invoked with `--filter storybook`.
