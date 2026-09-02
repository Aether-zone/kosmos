# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for this project.

ADRs document significant architectural decisions, the context behind them, and their consequences.

## Decisions

| ADR | Title | Status |
| --- | ----- | ------ |
| [1](0001-monorepo-with-pnpm-workspaces.md) | Monorepo with pnpm workspaces | Accepted |
| [2](0002-design-tokens-with-style-dictionary.md) | Design tokens with Style Dictionary | Accepted |
| [3](0003-one-style-dictionary-pass-per-theme.md) | One Style Dictionary pass per theme | Accepted |
| [4](0004-theming-with-css-custom-properties.md) | Theming with CSS custom properties and `@theme inline` | Accepted |
| [5](0005-tailwind-utilities-without-a-class-merger.md) | Tailwind utility classes without a class merger | Accepted |
| [6](0006-storybook-as-workshop-and-test-runner.md) | Storybook as workshop, documentation and test runner | Accepted |
| [7](0007-esm-only-distribution.md) | ESM-only distribution | Accepted |
| [8](0008-chromatic-for-visual-regression.md) | Chromatic for visual regression testing | Accepted |

## Statuses

- Proposed — under discussion
- Accepted — decision has been made
- Rejected — decision was considered but not adopted
- Deprecated — no longer relevant
- Superseded — replaced by a newer decision

Once an ADR is accepted, its history should be preserved. If a decision changes, create a new ADR rather than rewriting the original decision.
