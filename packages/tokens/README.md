# @kosmos/tokens

Design tokens for Kosmos, authored as [DTCG](https://tr.designtokens.org/)
JSON and compiled to CSS custom properties with Style Dictionary.

Private to the workspace: the component library depends on it, but it is not
published on its own.

## Layout

```
src/tokens/
  primitives/    raw scales — colors, spacing, radius, shadows, typography
  semantic/
    colors.json  semantic roles, $type-annotated; also the light theme
    dark.json    the same roles, dark values
    typography.json
```

Primitives are never referenced by components. Semantic tokens alias them
(`color.primary` → `{color.blue.600}`) so a palette change is one edit.

## Build

```bash
pnpm --filter @kosmos/tokens build   # → dist/tokens.css
```

`build.mjs` runs Style Dictionary **once per theme** and concatenates the
results:

```css
:root                          { /* primitives + semantic + typography */ }
.dark, [data-theme="dark"]     { /* only the roles dark.json overrides */ }
```

The separate passes are not incidental. Style Dictionary deep-merges every
source into one token tree, so building `colors.json` and `dark.json` together
would leave whichever file sorted last as the only survivor — which is exactly
how dark mode silently disappeared once before.

## Naming

Output variables are `--kosmos-<category>-<name>`:

| Token path | CSS variable |
| --- | --- |
| `color.primary` | `--kosmos-color-primary` |
| `color.gray.100` | `--kosmos-color-gray-100` |
| `radius.md` | `--kosmos-radius-md` |
| `shadow.lg` | `--kosmos-shadow-lg` |
| `spacing.4` | `--kosmos-spacing-4` |
| `font.size.body` | `--kosmos-font-size-body` |

Note the `color` segment: semantic colors are `--kosmos-color-primary`, not
`--kosmos-primary`.

## Adding a token

1. Add the value to the right `primitives/*.json` file.
2. If components should use it, alias it from `semantic/colors.json` with a
   role name, and give `dark.json` a matching entry.
3. Expose it to Tailwind by mapping it in `packages/react/src/styles.css`.

## Contrast

Semantic colours are chosen to clear WCAG AA (4.5:1 for text) in the role they
are used for, and the Storybook a11y tests enforce it.

`warning` is the one role that needs two tokens. Yellow is intrinsically
light: `warning` (yellow-600) carries dark text on a fill at 6.1:1, but as
text on a light surface it is only 2.9:1 — and darkening it to fix that drops
the fill to 3.6:1. `warningEmphasis` (yellow-700) is the text-safe pair. Use
`warning` for fills, `warningEmphasis` for text and meaningful graphics.

## Known wrinkle

`primitives/typography.json` (`fontFamily.sans`) and
`semantic/typography.json` (`font.family.sans`) transform to the same variable
name, so `--kosmos-font-family-*` and `--kosmos-font-weight-*` are each emitted
twice. The values are identical, so nothing breaks — but it is the one
collision the build still warns about, and resolving it means removing tokens
from the public contract.
