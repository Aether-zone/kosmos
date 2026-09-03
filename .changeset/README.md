# Changesets

Every change that should reach a release needs a changeset: a short note
saying which packages changed, how much (`patch`, `minor`, `major`), and why.

```bash
pnpm changeset
```

Answer the prompts and commit the generated file alongside your change.

On a push to `main`, `.github/workflows/release.yml` collects the pending
changesets into a **Version Packages** pull request that bumps versions and
writes changelogs. Merging that PR publishes to GitHub Packages.

Only `@aether-zone/kosmos` is published. `@kosmos/tokens` and the Storybook
app are private, so changesets skips them — but a token change still needs a
changeset against the library, because that is where it ships.
