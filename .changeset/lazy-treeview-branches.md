---
'@aether-zone/kosmos': minor
---

Add lazy loading to `TreeView`. `TreeItem` takes `loadChildren`, called the
first time the branch is expanded; supplying it is what marks the item as a
branch, so the chevron is there to click before anything has been fetched.

A branch in flight swaps its chevron for a spinner and reports `aria-busy`; a
branch that fails renders a retry row in its place. Both are shaped by what
`role="tree"` will accept as a child, which is `treeitem` and `group` and
nothing else — a `status` or `alert` live region inside the tree fails
`aria-required-children`. A branch that resolves to nothing becomes a leaf
rather than keeping a chevron that opens onto an empty group.

Results are cached on the `TreeView`, so collapsing an ancestor — which
unmounts the branch — does not throw away what was already loaded.
`loadingLabel`, `errorLabel` and `retryLabel` translate the three strings.
