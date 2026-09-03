import { useLayoutEffect } from 'react';

/**
 * Prevents the page behind a modal surface from scrolling.
 *
 * The scrollbar's width is added back as padding, otherwise removing it
 * reflows the whole page sideways as the modal opens.
 */
export function useScrollLock(enabled: boolean) {
    useLayoutEffect(() => {
        if (!enabled) {
            return;
        }

        const { body, documentElement } = document;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;

        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

        body.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            const current = Number.parseFloat(
                window.getComputedStyle(body).paddingRight,
            );

            body.style.paddingRight = `${current + scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;
        };
    }, [enabled]);
}
