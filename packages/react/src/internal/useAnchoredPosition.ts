import {
    useCallback,
    useLayoutEffect,
    useState,
    type CSSProperties,
    type RefObject,
} from 'react';

export type OverlaySide = 'top' | 'right' | 'bottom' | 'left';
export type OverlayAlign = 'start' | 'center' | 'end';

export interface AnchoredPositionOptions {
    side?: OverlaySide;
    align?: OverlayAlign;
    /** Gap between anchor and panel, in pixels. */
    offset?: number;
    enabled?: boolean;
}

/** Keep the panel this far from the viewport edge when clamping. */
const VIEWPORT_PADDING = 8;

const OPPOSITE: Record<OverlaySide, OverlaySide> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

function place(
    anchor: DOMRect,
    panel: { width: number; height: number },
    side: OverlaySide,
    align: OverlayAlign,
    offset: number,
) {
    const alignAcross = (start: number, size: number, extent: number) => {
        if (align === 'center') {
            return start + size / 2 - extent / 2;
        }

        return align === 'end' ? start + size - extent : start;
    };

    switch (side) {
        case 'top':
            return {
                top: anchor.top - panel.height - offset,
                left: alignAcross(anchor.left, anchor.width, panel.width),
            };
        case 'bottom':
            return {
                top: anchor.bottom + offset,
                left: alignAcross(anchor.left, anchor.width, panel.width),
            };
        case 'left':
            return {
                top: alignAcross(anchor.top, anchor.height, panel.height),
                left: anchor.left - panel.width - offset,
            };
        case 'right':
            return {
                top: alignAcross(anchor.top, anchor.height, panel.height),
                left: anchor.right + offset,
            };
    }
}

const fits = (
    position: { top: number; left: number },
    panel: { width: number; height: number },
) =>
    position.top >= VIEWPORT_PADDING &&
    position.left >= VIEWPORT_PADDING &&
    position.top + panel.height <= window.innerHeight - VIEWPORT_PADDING &&
    position.left + panel.width <= window.innerWidth - VIEWPORT_PADDING;

/**
 * Positions a portalled panel against an anchor using fixed coordinates.
 *
 * Overlays are portalled to `document.body` so they cannot be clipped by an
 * `overflow: hidden` ancestor — which in turn means they no longer inherit
 * the anchor's position, and have to be placed by measurement instead.
 */
export function useAnchoredPosition(
    anchorRef: RefObject<HTMLElement | null>,
    panelRef: RefObject<HTMLElement | null>,
    {
        side = 'bottom',
        align = 'start',
        offset = 8,
        enabled = true,
    }: AnchoredPositionOptions = {},
) {
    const [style, setStyle] = useState<CSSProperties>({
        position: 'fixed',
        top: 0,
        left: 0,
        // Hidden until measured, so the panel never paints at 0,0 first.
        visibility: 'hidden',
    });

    const update = useCallback(() => {
        const anchor = anchorRef.current;
        const panel = panelRef.current;

        if (!anchor || !panel) {
            return;
        }

        const anchorRect = anchor.getBoundingClientRect();
        const panelRect = {
            width: panel.offsetWidth,
            height: panel.offsetHeight,
        };

        let position = place(anchorRect, panelRect, side, align, offset);

        // Flip to the opposite side when the preferred one overflows, but
        // only if flipping actually helps.
        if (!fits(position, panelRect)) {
            const flipped = place(
                anchorRect,
                panelRect,
                OPPOSITE[side],
                align,
                offset,
            );

            if (fits(flipped, panelRect)) {
                position = flipped;
            }
        }

        const maxLeft =
            window.innerWidth - panelRect.width - VIEWPORT_PADDING;
        const maxTop =
            window.innerHeight - panelRect.height - VIEWPORT_PADDING;

        setStyle({
            position: 'fixed',
            top: Math.round(
                Math.max(VIEWPORT_PADDING, Math.min(position.top, maxTop)),
            ),
            left: Math.round(
                Math.max(VIEWPORT_PADDING, Math.min(position.left, maxLeft)),
            ),
        });
    }, [anchorRef, panelRef, side, align, offset]);

    useLayoutEffect(() => {
        if (!enabled) {
            return;
        }

        update();

        // `true` captures scrolling in any ancestor, not just the window.
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);

        const panel = panelRef.current;
        const observer = panel ? new ResizeObserver(update) : null;

        observer?.observe(panel!);

        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
            observer?.disconnect();
        };
    }, [enabled, update, panelRef]);

    return style;
}
