import {
    createContext,
    type HTMLAttributes,
    type MouseEvent,
    type PointerEvent,
    type ReactNode,
    useContext,
    useId,
    useRef,
} from 'react';

import { useControllableState } from '../../hooks';

import { ModalOverlay, Slot } from '../../internal';

export interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export interface DialogTriggerProps
    extends HTMLAttributes<HTMLButtonElement> {
    /** Render the child as the trigger instead of wrapping it in a button. */
    asChild?: boolean;
}

export interface DialogContentProps
    // `role` is fixed: this surface is always a dialog.
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> { }

export interface DialogHeaderProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface DialogTitleProps
    extends HTMLAttributes<HTMLHeadingElement> { }

export interface DialogDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }

export interface DialogFooterProps
    extends HTMLAttributes<HTMLDivElement> { }

interface DialogContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    titleId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error(
            'Dialog components must be used inside a Dialog component.',
        );
    }

    return context;
}

export function Dialog({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
}: DialogProps) {
    const [open, setOpen] = useControllableState({
        value: controlledOpen,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
    const titleId = useId();

    return (
        <DialogContext.Provider value={{ open, setOpen, titleId }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({
    asChild = false,
    className,
    onClick,
    ...props
}: DialogTriggerProps) {
    const { setOpen } = useDialog();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        onClick?.(event as MouseEvent<HTMLButtonElement>);
        setOpen(true);
    };

    if (asChild) {
        return <Slot className={className} onClick={handleClick} {...props} />;
    }

    const classes = ['cursor-pointer', className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            className={classes}
            onClick={handleClick}
            {...props}
        />
    );
}

export function DialogContent({
    className,
    children,
    onPointerDown,
    onClick,
    ...props
}: DialogContentProps) {
    const { open, setOpen, titleId } = useDialog();

    /*
     * The element that centres the panel covers the whole screen, so it — not
     * ModalOverlay's backdrop beneath it — receives every click outside the
     * panel, and `closeOnBackdrop` never fired. It closes here instead, but
     * only for a press that both starts and ends on it: a drag out of a field
     * inside the panel also ends in a click on this element, and must not
     * throw away what was typed. Its own scrollbar is excluded for the same
     * reason. This cannot move into ModalOverlay — for Drawer that element is
     * the surface itself, and a click on its padding would close it.
     */
    const pressedOutside = useRef(false);

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);

        const overlay = event.currentTarget;
        const onScrollbar =
            event.clientX >=
            overlay.getBoundingClientRect().left + overlay.clientWidth;

        pressedOutside.current = event.target === overlay && !onScrollbar;
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (pressedOutside.current && event.target === event.currentTarget) {
            setOpen(false);
        }

        pressedOutside.current = false;
    };

    /*
     * Centred by `my-auto` on the panel, not `items-center` here. A flex
     * container centres an overflowing child by pushing it past *both* edges,
     * where no scrolling can reach the top — so a dialog taller than the
     * viewport lost its title and its footer. An auto margin collapses to
     * zero instead, and `overflow-y-auto` lets the overlay scroll the rest.
     */
    const classes = [
        'fixed inset-0 flex justify-center overflow-y-auto p-4',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ModalOverlay
            open={open}
            onDismiss={() => setOpen(false)}
            // `aria-modal` without a name leaves the dialog unannounced.
            aria-labelledby={titleId}
            className={classes}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            {...props}
        >
            <div className="my-auto w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
                {children}
            </div>
        </ModalOverlay>
    );
}

export function DialogHeader({
    className,
    ...props
}: DialogHeaderProps) {
    const classes = [
        'flex flex-col gap-2',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function DialogTitle({
    className,
    ...props
}: DialogTitleProps) {
    const { titleId } = useDialog();

    const classes = [
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <h2 id={titleId} className={classes} {...props} />;
}

export function DialogDescription({
    className,
    ...props
}: DialogDescriptionProps) {
    const classes = [
        'text-sm text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <p className={classes} {...props} />;
}

export function DialogFooter({
    className,
    ...props
}: DialogFooterProps) {
    const classes = [
        'mt-6 flex items-center justify-end gap-2',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}
