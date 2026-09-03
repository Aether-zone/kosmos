import { useMediaQuery } from './useMediaQuery';

/**
 * Whether the viewer has asked the system to reduce motion.
 *
 * CSS covers most of this through Tailwind's `motion-safe` variant. This is
 * for what a media query cannot reach: content that moves on a timer has to
 * actually stop, not merely stop transitioning.
 */
export function usePrefersReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}
