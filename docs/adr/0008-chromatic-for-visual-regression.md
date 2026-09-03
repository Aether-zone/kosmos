# 8. Chromatic for visual regression testing

- Status: Accepted
- Date: 2026-09-03

## Context

The story-based Vitest run proves that components render without throwing. It
cannot see that a component renders *wrong* — that a title is white on a pale
tint, that a switch thumb never moves, or that an error border is invisible.
Every one of those shipped, and every one was found by looking at a
screenshot.

For a design system this is the failure mode that matters. A token change is
small, plausible, and can silently alter every component that uses it, and no
assertion in the repository would notice.

## Decision

Publish the Storybook to Chromatic from GitHub Actions
(`.github/workflows/chromatic.yml`) on every push to `main` and every pull
request, authenticating with the `CHROMATIC_KEY` repository secret.

The workflow installs, runs `pnpm build` so the packages exist in `dist`, and
hands `apps/storybook` to `chromaui/action`.

Checkout uses `fetch-depth: 0`: Chromatic compares against the baseline of an
earlier commit and needs the history to find it.

## Consequences

- Every story becomes a visual test for free, in both themes where a story
  covers them.
- Visual changes must be reviewed and accepted in Chromatic before a pull
  request goes green. That is the intent, but it does mean an intentional
  restyle produces a failing check until someone approves it. Set
  `exitZeroOnChanges` if that trade becomes unwelcome.
- Chromatic runs on a third-party service and consumes a snapshot quota, which
  scales with the number of stories.
- The build is not TurboSnap-enabled, so every run snapshots every story.
