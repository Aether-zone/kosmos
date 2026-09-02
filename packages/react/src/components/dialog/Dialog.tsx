import {
    createContext,
    type HTMLAttributes,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export interface DialogTriggerProps
    extends HTMLAttributes<HTMLButtonElement> { }

export interface DialogContentProps
    extends HTMLAttributes<HTMLDivElement> { }

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
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

    const open = controlledOpen ?? uncontrolledOpen;

    const setOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({
    className,
    onClick,
    ...props
}: DialogTriggerProps) {
    const { setOpen } = useDialog();

    const classes = ['cursor-pointer', className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                setOpen(true);
            }}
            {...props}
        />
    );
}

export function DialogContent({
    className,
    children,
    ...props
}: DialogContentProps) {
    const { open, setOpen } = useDialog();

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    if (!open) {
        return null;
    }

    const classes = [
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="presentation"
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setOpen(false)}
            />

            <div
                role="dialog"
                aria-modal="true"
                className={classes}
                {...props}
            >
                <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
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
    const classes = [
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <h2 className={classes} {...props} />;
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
