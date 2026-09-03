import { useCallback, useSyncExternalStore } from 'react';

/**
 * Tracks a CSS media query.
 *
 * Built on `useSyncExternalStore` rather than state and an effect: the
 * browser already holds this value, so reading it directly avoids the render
 * pass where a component claims the query does not match before the effect
 * corrects it — a flash of the wrong layout on every mount.
 */
export function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const media = window.matchMedia(query);

            media.addEventListener('change', onChange);

            return () => media.removeEventListener('change', onChange);
        },
        [query],
    );

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        // On the server nothing matches: there is no viewport to measure, and
        // guessing would only produce markup the client has to correct.
        () => false,
    );
}
