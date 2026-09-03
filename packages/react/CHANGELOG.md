# @aether-zone/kosmos

## 0.3.0

### Minor Changes

- 6198074: Add `AppBar` — the application's top bar, with `AppBarBrand`, `AppBarSection`
  and `AppBarTitle`. Static, sticky or fixed; optionally constrained to a centred
  column.

### Patch Changes

- b10196c: Restore the lighter accents in dark mode. `primary` and `destructive` had been
  flattened to their light-theme values to keep white labels readable; they are
  bright again and carry the dark label instead, which is how `success` and
  `warning` already worked.
- fd04808: Move every component onto `useControllableState`, so the controlled and
  uncontrolled behaviour is defined in one place rather than reimplemented
  fifteen times.
- 28036d6: A link's hover colour no longer fades. Opacity blends toward the background,
  which took the hover state to 3.6:1 on light and 2.8:1 on dark — below AA in
  a state that owes it just as much as the resting one.

## 0.2.0

### Minor Changes

- 3e22831: First release of the Kosmos component library: 54 components built on design
  tokens, shipping a precompiled stylesheet that needs no Tailwind of its own,
  with light and dark themes that meet WCAG AA.
- 888aba8: Export the hooks the components are built on: `useMediaQuery`, `useBreakpoint`
  and `useIsMobile`, `usePrefersReducedMotion`, `useTheme`, `useDisclosure`,
  `useControllableState` and `useCopyToClipboard`.
- 16aa533: Respect `prefers-reduced-motion`, and give an auto-playing Carousel a pause
  control. Decorative motion — the Skeleton and indeterminate Progress pulse,
  slide and thumb transitions — stops for anyone who has asked for less of it;
  the Spinner keeps turning, far slower, because a frozen spinner says nothing.

### Patch Changes

- 4a10808: Give form controls a discernible boundary. `input` was the same value as
  `border` and sat at 1.3:1 against its surface in both themes, below the 3:1
  WCAG asks for a control boundary. `border` stays subtle for dividers and card
  edges; `input` is now distinct. The dark focus ring also moves off `primary`,
  which could not clear 3:1 on a muted panel.
- e18b69f: Mark the package as a client boundary. Importing any component into a React
  Server Component previously failed outright — `createContext is not a
  function` — because nothing declared `'use client'`.
