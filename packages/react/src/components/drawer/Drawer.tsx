import {
    createContext,
    type HTMLAttributes,
    type ButtonHTMLAttributes,
    type ReactNode,
    useContext,
    useState,
} from 'react';
import { IoClose } from 'react-icons/io5';

import { ModalOverlay } from '../../internal';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export interface DrawerTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

export interface DrawerContentProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    side?: DrawerSide;
    size?: DrawerSize;
    /** Renders a close button in the corner. */
    showClose?: boolean;
    closeLabel?: string;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> { }
export interface DrawerTitleProps
    extends HTMLAttributes<HTMLHeadingElement> { }
export interface DrawerDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }
export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> { }
export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> { }
export interface DrawerCloseProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

interface DrawerContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawer() {
    const context = useContext(DrawerContext);

    if (!context) {
        throw new Error(
            'Drawer components must be used inside a Drawer component.',
        );
    }

    return context;
}

export function Drawer({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
}: DrawerProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

    const open = controlledOpen ?? uncontrolledOpen;

    const setOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    return (
        <DrawerContext.Provider value={{ open, setOpen }}>
            {children}
        </DrawerContext.Provider>
    );
}

export function DrawerTrigger({
    className,
    onClick,
    ...props
}: DrawerTriggerProps) {
    const { setOpen } = useDrawer();

    const classes = ['cursor-pointer', className].filter(Boolean).join(' ');

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

/** Which edge the panel is pinned to, and which axis `size` applies on. */
const sideStyles: Record<DrawerSide, string> = {
    left: 'inset-y-0 left-0 h-full border-r',
    right: 'inset-y-0 right-0 h-full border-l',
    top: 'inset-x-0 top-0 w-full border-b',
    bottom: 'inset-x-0 bottom-0 w-full border-t',
};

const horizontalSizes: Record<DrawerSize, string> = {
    sm: 'w-72',
    md: 'w-96',
    lg: 'w-[32rem]',
    full: 'w-screen',
};

const verticalSizes: Record<DrawerSize, string> = {
    sm: 'h-1/4',
    md: 'h-1/3',
    lg: 'h-1/2',
    full: 'h-screen',
};

export function DrawerContent({
    side = 'right',
    size = 'md',
    showClose = true,
    closeLabel = 'Close',
    className,
    children,
    ...props
}: DrawerContentProps) {
    const { open, setOpen } = useDrawer();

    const horizontal = side === 'left' || side === 'right';

    const classes = [
        'fixed flex flex-col border-border bg-surface shadow-lg outline-none',
        sideStyles[side],
        horizontal ? horizontalSizes[size] : verticalSizes[size],
        // A full-width drawer would otherwise overflow the viewport.
        horizontal ? 'max-w-full' : 'max-h-full',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ModalOverlay
            open={open}
            onDismiss={() => setOpen(false)}
            className={classes}
            {...props}
        >
            {showClose ? (
                <button
                    type="button"
                    aria-label={closeLabel}
                    className="absolute right-3 top-3 cursor-pointer rounded-sm p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setOpen(false)}
                >
                    <IoClose className="size-4" />
                </button>
            ) : null}

            {children}
        </ModalOverlay>
    );
}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
    const classes = [
        'flex shrink-0 flex-col gap-1 border-b border-border p-4 pr-12',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
    const classes = [
        'text-base font-semibold leading-none text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <h2 className={classes} {...props} />;
}

export function DrawerDescription({
    className,
    ...props
}: DrawerDescriptionProps) {
    const classes = ['text-sm text-muted-foreground', className]
        .filter(Boolean)
        .join(' ');

    return <p className={classes} {...props} />;
}

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
    const classes = ['min-h-0 flex-1 overflow-y-auto p-4', className]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
    const classes = [
        'flex shrink-0 items-center justify-end gap-2 border-t border-border p-4',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function DrawerClose({
    className,
    onClick,
    ...props
}: DrawerCloseProps) {
    const { setOpen } = useDrawer();

    return (
        <button
            type="button"
            className={className}
            onClick={(event) => {
                onClick?.(event);
                setOpen(false);
            }}
            {...props}
        />
    );
}
