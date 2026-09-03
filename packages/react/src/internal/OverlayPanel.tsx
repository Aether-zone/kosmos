import {
    useEffect,
    useRef,
    useState,
    type HTMLAttributes,
    type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import {
    useAnchoredPosition,
    type OverlayAlign,
    type OverlaySide,
} from './useAnchoredPosition';

export interface OverlayPanelProps extends HTMLAttributes<HTMLDivElement> {
    anchorRef: RefObject<HTMLElement | null>;
    open: boolean;
    side?: OverlaySide;
    align?: OverlayAlign;
    offset?: number;
    /** Give the panel the anchor's width — for select-style menus. */
    matchAnchorWidth?: boolean;
    panelRef?: RefObject<HTMLDivElement | null>;
}

/**
 * A panel portalled to `document.body` and positioned against an anchor.
 *
 * Rendering in place is simpler, but an overlay inside a Card or a scrolling
 * container is then clipped by that ancestor's `overflow`. Portalling trades
 * that for having to position by measurement.
 */
export function OverlayPanel({
    anchorRef,
    open,
    side = 'bottom',
    align = 'start',
    offset = 8,
    matchAnchorWidth = false,
    panelRef,
    style,
    children,
    ...props
}: OverlayPanelProps) {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const ref = panelRef ?? internalRef;

    const position = useAnchoredPosition(anchorRef, ref, {
        side,
        align,
        offset,
        enabled: open,
    });

    const [anchorWidth, setAnchorWidth] = useState<number>();

    useEffect(() => {
        if (open && matchAnchorWidth) {
            setAnchorWidth(anchorRef.current?.offsetWidth);
        }
    }, [open, matchAnchorWidth, anchorRef]);

    // Portals need a DOM target, which does not exist during SSR.
    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            ref={ref}
            style={{
                ...position,
                ...(matchAnchorWidth && anchorWidth
                    ? { width: anchorWidth }
                    : null),
                ...style,
            }}
            {...props}
        >
            {children}
        </div>,
        document.body,
    );
}
