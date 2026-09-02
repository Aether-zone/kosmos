import {
    createContext,
    type HTMLAttributes,
    type ReactNode,
    useContext,
    useId,
    useState,
} from 'react';

export interface TooltipProps {
    children: ReactNode;
}

export interface TooltipTriggerProps
    extends HTMLAttributes<HTMLElement> { }

export interface TooltipContentProps
    extends HTMLAttributes<HTMLDivElement> { }

interface TooltipContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    contentId: string;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltip() {
    const context = useContext(TooltipContext);

    if (!context) {
        throw new Error(
            'Tooltip components must be used inside a Tooltip component.',
        );
    }

    return context;
}

export function Tooltip({ children }: TooltipProps) {
    const [open, setOpen] = useState(false);
    const contentId = useId();

    return (
        <TooltipContext.Provider value={{ open, setOpen, contentId }}>
            {/*
              * The content is positioned absolutely against this wrapper.
              * Without it the nearest positioned ancestor is whatever the
              * page happens to provide — usually <body>, which drops the
              * tooltip far away from its trigger.
              */}
            <span className="relative inline-block">
                {children}
            </span>
        </TooltipContext.Provider>
    );
}

export function TooltipTrigger({
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...props
}: TooltipTriggerProps) {
    const { open, setOpen, contentId } = useTooltip();

    const classes = ['cursor-help', className]
        .filter(Boolean)
        .join(' ');

    return (
        <span
            className={classes}
            tabIndex={0}
            aria-describedby={open ? contentId : undefined}
            onMouseEnter={(event) => {
                onMouseEnter?.(event);
                setOpen(true);
            }}
            onMouseLeave={(event) => {
                onMouseLeave?.(event);
                setOpen(false);
            }}
            onFocus={(event) => {
                onFocus?.(event);
                setOpen(true);
            }}
            onBlur={(event) => {
                onBlur?.(event);
                setOpen(false);
            }}
            {...props}
        />
    );
}

export function TooltipContent({
    className,
    ...props
}: TooltipContentProps) {
    const { open, contentId } = useTooltip();

    if (!open) {
        return null;
    }

    const classes = [
        'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2',
        'w-max max-w-xs rounded-md bg-foreground px-3 py-1.5',
        'text-xs text-background shadow-md',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            id={contentId}
            role="tooltip"
            className={classes}
            {...props}
        />
    );
}
