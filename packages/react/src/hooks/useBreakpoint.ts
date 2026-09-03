import { useMediaQuery } from './useMediaQuery';

/** Tailwind's default breakpoints, so JS and CSS agree on where they fall. */
export const breakpoints = {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
    '2xl': '96rem',
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** True at or above the named breakpoint. */
export function useBreakpoint(breakpoint: Breakpoint) {
    return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
}

/**
 * True below `md` (768px) — the width at which a layout usually has to become
 * a single column.
 *
 * Prefer a CSS breakpoint where one will do; reach for this when the
 * *behaviour* differs, not just the styling — rendering a Drawer instead of a
 * Popover, say, rather than changing a width.
 */
export function useIsMobile() {
    return !useBreakpoint('md');
}
