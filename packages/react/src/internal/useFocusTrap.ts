import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
    'a[href]',
    'button:not(:disabled)',
    'input:not(:disabled)',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

export const focusableWithin = (container: HTMLElement) =>
    [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null,
    );

/**
 * Keeps Tab inside a modal surface and restores focus when it closes.
 *
 * `aria-modal="true"` tells assistive technology that the rest of the page is
 * inert; without a trap that claim is false, because Tab walks straight out
 * into the content behind.
 */
export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    enabled: boolean,
) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const container = containerRef.current;

        if (!container) {
            return;
        }

        const previouslyFocused = document.activeElement as HTMLElement | null;

        const initial = focusableWithin(container);
        (initial[0] ?? container).focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') {
                return;
            }

            const focusable = focusableWithin(container);

            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && (active === first || active === container)) {
                event.preventDefault();
                last.focus();
                return;
            }

            if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [enabled, containerRef]);
}
