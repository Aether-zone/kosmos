import {
    createContext,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
    useContext,
    useId,
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
    ...props
}: DialogContentProps) {
    const { open, setOpen, titleId } = useDialog();

    const classes = [
        'fixed inset-0 flex items-center justify-center p-4',
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
            {...props}
        >
            <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
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
