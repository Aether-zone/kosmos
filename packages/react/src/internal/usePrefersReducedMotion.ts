import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the viewer has asked the system to reduce motion.
 *
 * CSS handles most of this on its own through Tailwind's `motion-safe`
 * variant. This exists for the cases a media query cannot reach — chiefly
 * content that moves on a timer, which has to actually stop rather than
 * merely stop transitioning.
 */
export function usePrefersReducedMotion() {
    // No preference during SSR, where matchMedia does not exist; the effect
    // corrects it on mount.
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(QUERY);
        const update = () => setReduced(media.matches);

        update();
        media.addEventListener('change', update);

        return () => media.removeEventListener('change', update);
    }, []);

    return reduced;
}
