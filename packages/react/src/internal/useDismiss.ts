import { useEffect, type RefObject } from 'react';

export interface DismissOptions {
    enabled: boolean;
    /** Clicking inside any of these is not "outside". */
    refs: RefObject<HTMLElement | null>[];
    onDismiss: () => void;
    escape?: boolean;
    outside?: boolean;
}

/**
 * Closes an overlay on Escape or on a pointer press outside it.
 *
 * Listens on `mousedown` rather than `click`: a press that starts outside
 * should dismiss even if the pointer is released elsewhere, and waiting for
 * `click` lets a blur handler tear the overlay down first.
 */
export function useDismiss({
    enabled,
    refs,
    onDismiss,
    escape = true,
    outside = true,
}: DismissOptions) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (refs.some((ref) => ref.current?.contains(target))) {
                return;
            }

            onDismiss();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onDismiss();
            }
        };

        if (outside) {
            document.addEventListener('mousedown', handlePointerDown);
        }

        if (escape) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, escape, outside, onDismiss]);
}
