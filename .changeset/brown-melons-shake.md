---
'@aether-zone/kosmos': patch
---

Restore the lighter accents in dark mode. `primary` and `destructive` had been
flattened to their light-theme values to keep white labels readable; they are
bright again and carry the dark label instead, which is how `success` and
`warning` already worked.
