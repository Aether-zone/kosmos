---
'@aether-zone/kosmos': patch
---

Close a `Dialog` when its backdrop is clicked. The element that centres the
panel covered the backdrop, so the click never reached it. A press that starts
inside the panel and ends outside it — selecting text in a field — still leaves
the dialog open.
