---
'@aether-zone/kosmos': patch
---

Keep a `Dialog` or `AlertDialog` taller than the viewport reachable. It was centred with
`items-center`, which pushed an overflowing panel past both edges of the screen
with no way to scroll back to its title or footer. The panel now centres with an
auto margin and the overlay scrolls.
