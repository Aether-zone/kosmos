# 3. One Style Dictionary pass per theme

- Status: Accepted
- Date: 2026-09-03

## Context

Light and dark themes declare the same semantic token paths with different
values. The obvious setup — point Style Dictionary at every source file and
let it build once — does not work, and fails silently.

Style Dictionary deep-merges all sources into a single token tree. When
`colors.json`, `light.json` and `dark.json` each declare `color.background`,
they collapse into one token, and whichever file sorts last wins. In practice
`light.json` won, `dark.json` was discarded entirely, and no `.dark` selector
was ever emitted. The generated CSS looked perfectly healthy; dark mode simply
did not exist, while a documentation page described how it worked.

A theme is not a variant of a token. It is a separate resolution of the same
token set, and one dictionary can only hold one resolution.

## Decision

`packages/tokens/build.mjs` runs Style Dictionary once per theme and
concatenates the output into a single `dist/tokens.css`:

- **Light pass** — primitives, semantic colors and typography, emitted under
  `:root`. `semantic/colors.json` is the light theme; there is no separate
  light override file.
- **Dark pass** — the same sources plus `dark.json`, filtered to only the
  paths `dark.json` actually declares, emitted under
  `.dark, [data-theme="dark"]`.

The dark pass disables Style Dictionary's collision warnings, because
redeclaring every path it themes is precisely its purpose.

Theme override files are filtered by reading the override file's own leaf
paths, rather than trusting per-token source metadata.

## Consequences

- Adding a theme is a new entry in the `THEMES` array plus an override file.
- `dark.json` only carries what differs; anything it omits inherits `:root`.
  Omissions are therefore invisible rather than loud — a missing `accent`
  looked fine until a hover state flashed near-white in dark mode. Keep theme
  files complete.
- The build is a script rather than a declarative `config.json`, which is more
  code to maintain but is the only way to express "these sources are mutually
  exclusive".
- `dist/tokens.css` is a concatenation, so the file header is written by the
  script rather than by Style Dictionary.
