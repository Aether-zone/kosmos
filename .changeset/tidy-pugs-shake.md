---
'@aether-zone/kosmos': patch
---

Mark the package as a client boundary. Importing any component into a React
Server Component previously failed outright — `createContext is not a
function` — because nothing declared `'use client'`.
