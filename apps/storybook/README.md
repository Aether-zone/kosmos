# Storybook

The Kosmos workshop: component stories, design-token documentation, and the
source of truth for visual regression tests.

## Running

```bash
pnpm build                          # from the repo root, first
pnpm --filter @kosmos/storybook storybook   # http://localhost:6006
```

The root build is a prerequisite, not a nicety. `src/styles.css` imports
`@kosmos/tokens/tokens.css` and `@aether-zone/kosmos/styles.css` from their
`dist` folders, so an unbuilt workspace renders unstyled stories.

## Layout

```
.storybook/
  main.ts        framework, addons, Tailwind plugin
  preview.tsx    global parameters and the theme toolbar
  withTheme.tsx  decorator that applies the theme to <html>
src/
  styles.css     Tailwind entry: tokens + library theme + @source
  stories/
    *.mdx                    design-token documentation
    components/*.stories.tsx one file per component
```

## Theming

The **Theme** toolbar control toggles `.dark` on `document.documentElement`.
It goes on the document root rather than a wrapper element because a wrapper
shrink-wraps under `layout: 'centered'` and quietly breaks story layout.

MDX pages are not wrapped by decorators, so a docs page that needs to show
both themes puts `className="dark"` on a container itself — see
`stories/DarkMode.mdx`.

## Styling notes

`src/styles.css` imports the library's `styles.css` rather than repeating the
token-to-Tailwind mapping, so the two cannot drift. It adds an
`@source "../../../packages/react/src"` directive so Tailwind scans component
source for class names instead of the built bundle.

Tailwind's automatic source detection skips dotted directories, so classes
used only inside `.storybook/` are not generated. Use inline styles with
`var(--kosmos-*)` there.

## Tests

Stories double as tests through `@storybook/addon-vitest`: every story is
rendered in headless Chromium.

```bash
pnpm --filter @kosmos/storybook exec vitest run
pnpm --filter @kosmos/storybook exec vitest run src/stories/components/Button.stories.tsx
```

The a11y addon runs in `'todo'` mode — violations surface in the test UI but
do not fail the run.

## Visual regression

`.github/workflows/chromatic.yml` publishes this Storybook to Chromatic on
every push to `main` and every pull request, using the `CHROMATIC_KEY`
repository secret.

## Writing stories

Import from `@aether-zone/kosmos`, never by a relative path into the package —
stories should exercise the same entry point consumers use.

In MDX, keep JSX text on the same line as its tag. Content on its own line is
re-parsed as a markdown paragraph, producing a nested unstyled `<p>` that
Storybook's docs CSS then colors itself.
