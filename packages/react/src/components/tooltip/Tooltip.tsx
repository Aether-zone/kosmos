import {
    createContext,
    type HTMLAttributes,
    type ReactNode,
    type RefObject,
    useContext,
    useId,
    useRef,
    useState,
} from 'react';

import { OverlayPanel } from '../../internal';

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
    anchorRef: RefObject<HTMLSpanElement | null>;
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
    const anchorRef = useRef<HTMLSpanElement | null>(null);

    return (
        <TooltipContext.Provider
            value={{ open, setOpen, contentId, anchorRef }}
        >
            <span ref={anchorRef} className="inline-block">
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
    const { open, contentId, anchorRef } = useTooltip();

    const classes = [
        'z-50 w-max max-w-xs rounded-md bg-foreground px-3 py-1.5',
        'text-xs text-background shadow-md',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <OverlayPanel
            anchorRef={anchorRef}
            open={open}
            side="bottom"
            align="center"
            offset={8}
            id={contentId}
            role="tooltip"
            className={classes}
            {...props}
        />
    );
}
