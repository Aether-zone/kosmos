---
'@aether-zone/kosmos': patch
---

Give form controls a discernible boundary. `input` was the same value as
`border` and sat at 1.3:1 against its surface in both themes, below the 3:1
WCAG asks for a control boundary. `border` stays subtle for dividers and card
edges; `input` is now distinct. The dark focus ring also moves off `primary`,
which could not clear 3:1 on a muted panel.
