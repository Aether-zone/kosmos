# 9. Changesets for versioning and release

- Status: Accepted
- Date: 2026-09-03

## Context

`.github/workflows/publish.yml` published whatever version happened to be in
`package.json` when someone cut a GitHub Release. Nothing bumped that version,
so the first release would have gone out as `0.1.0` and the second would have
been rejected by the registry as a duplicate — with no signal until the
publish failed.

Deciding the bump by hand is also the wrong place for the decision. Whether a
change is a patch or a breaking one is known when the change is written, by
the person writing it, not weeks later by whoever cuts the release.

## Decision

Adopt [Changesets](https://github.com/changesets/changesets).

A change that should reach a release carries a changeset: a small file
recording the affected package, the bump, and a line of prose. It is written
and reviewed alongside the change.

`.github/workflows/release.yml` runs on every push to `main` and does one of
two things:

- **Changesets pending** — opens or updates a *Version packages* pull request
  that applies the bumps and writes changelogs.
- **None pending**, because that pull request has just merged — publishes to
  GitHub Packages.

This replaces the Release-triggered workflow. Releases become a merge rather
than a manual act.

## Consequences

- The bump is decided by the author, in review, with the change in front of
  everyone — and the changelog writes itself from prose someone actually
  thought about.
- A change with no changeset silently never ships. That is the intended
  trade-off for skipping ceremony on chores, but it does mean "why is my fix
  not released" has a new answer.
- Only `@aether-zone/kosmos` is published; `@kosmos/tokens` and
  `@kosmos/storybook` are private and skipped. A token change still needs a
  changeset against the library, because that is where it reaches consumers.
- The Storybook app was renamed from `storybook` to `@kosmos/storybook`: its
  old name collided with the `storybook` package it depends on, which
  Changesets reads as a package depending on itself at the wrong version.
- ADR 6 said Storybook's checks had to be invoked with `--filter`. That is no
  longer true: it now defines `test` and `typecheck`, so the root scripts
  reach it and CI runs them.
