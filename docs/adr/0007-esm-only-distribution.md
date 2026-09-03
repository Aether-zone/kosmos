# 7. ESM-only distribution

- Status: Accepted
- Date: 2026-09-02

## Context

A React library can ship CommonJS, ESM, or both. Dual publishing doubles build
output and invites the "dual package hazard", where a dependency graph loads
both copies and module-level state — React contexts, in particular — exists
twice. A component library is full of contexts.

Kosmos targets React 19, which in practice means a bundler-based toolchain
that handles ESM.

## Decision

Publish ESM only, built with `tsup`:

- one entry (`src/index.ts`), `format: ['esm']`, with declaration files
- `react` and `react-dom` marked external and declared as peer dependencies
- `styles.css` copied into `dist` and exposed as the `./styles.css` export

## Consequences

- One artifact, no dual-package hazard, no chance of two React contexts.
- Consumers on a CommonJS-only toolchain cannot `require()` the package.
  Acceptable for a React 19 library; revisit if it blocks a real consumer.
- React stays external, so the consumer's copy is always the one used.
- Styles ship as a CSS file the consumer imports, rather than being injected
  at runtime, which keeps them controllable and avoids a CSS-in-JS runtime.
