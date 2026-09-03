import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
    type RefObject,
    useContext,
    useId,
    useRef,
    useState,
} from 'react';

import {
    OverlayPanel,
    useDismiss,
    type OverlayAlign,
    type OverlaySide,
} from '../../internal';

export interface PopoverProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export interface PopoverTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

export interface PopoverContentProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    side?: OverlaySide;
    align?: OverlayAlign;
    offset?: number;
    /** Match the trigger's width — useful for select-style panels. */
    matchTriggerWidth?: boolean;
}

export interface PopoverCloseProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

interface PopoverContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    contentId: string;
    anchorRef: RefObject<HTMLDivElement | null>;
    panelRef: RefObject<HTMLDivElement | null>;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
    const context = useContext(PopoverContext);

    if (!context) {
        throw new Error(
            'Popover components must be used inside a Popover component.',
        );
    }

    return context;
}

/**
 * A non-modal overlay for arbitrary content.
 *
 * Non-modal is the distinction from Dialog: the page behind stays live and
 * scrollable, and focus is not trapped — so this is for supporting content,
 * not for anything that must be answered before continuing.
 */
export function Popover({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
}: PopoverProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const contentId = useId();
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const open = controlledOpen ?? uncontrolledOpen;

    const setOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    // The panel is portalled, so "inside" spans two detached subtrees.
    useDismiss({
        enabled: open,
        refs: [anchorRef, panelRef],
        onDismiss: () => {
            setOpen(false);
            triggerRef.current?.focus();
        },
    });

    return (
        <PopoverContext.Provider
            value={{ open, setOpen, contentId, anchorRef, panelRef, triggerRef }}
        >
            <div ref={anchorRef} className="inline-block">
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

const triggerStyles =
    'inline-flex h-10 cursor-pointer items-center justify-center gap-2 ' +
    'rounded-md border border-border bg-background px-4 text-sm ' +
    'font-medium text-foreground transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

export function PopoverTrigger({
    className,
    onClick,
    ...props
}: PopoverTriggerProps) {
    const { open, setOpen, contentId, triggerRef } = usePopover();

    const classes = [triggerStyles, className].filter(Boolean).join(' ');

    return (
        <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? contentId : undefined}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                setOpen(!open);
            }}
            {...props}
        />
    );
}

export function PopoverContent({
    side = 'bottom',
    align = 'start',
    offset = 8,
    matchTriggerWidth = false,
    className,
    ...props
}: PopoverContentProps) {
    const { open, contentId, anchorRef, panelRef } = usePopover();

    const classes = [
        'z-50 min-w-48 rounded-md border border-border bg-surface p-4',
        'text-sm text-foreground shadow-lg outline-none',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <OverlayPanel
            anchorRef={anchorRef}
            panelRef={panelRef}
            open={open}
            side={side}
            align={align}
            offset={offset}
            matchAnchorWidth={matchTriggerWidth}
            id={contentId}
            role="dialog"
            className={classes}
            {...props}
        />
    );
}

export function PopoverClose({
    className,
    onClick,
    ...props
}: PopoverCloseProps) {
    const { setOpen, triggerRef } = usePopover();

    return (
        <button
            type="button"
            className={className}
            onClick={(event) => {
                onClick?.(event);
                setOpen(false);
                triggerRef.current?.focus();
            }}
            {...props}
        />
    );
}
