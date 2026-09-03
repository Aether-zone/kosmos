import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    type RefObject,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';

import { OverlayPanel, useDismiss, type VirtualAnchor } from '../../internal';

export interface ContextMenuProps {
    children: ReactNode;
}

export interface ContextMenuTriggerProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface ContextMenuContentProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> { }

export interface ContextMenuItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
    onSelect?: () => void;
    destructive?: boolean;
    icon?: ReactNode;
    /** Right-aligned hint, usually a keyboard shortcut. */
    shortcut?: string;
}

export interface ContextMenuLabelProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface ContextMenuSeparatorProps
    extends HTMLAttributes<HTMLDivElement> { }

interface ContextMenuContextValue {
    open: boolean;
    close: () => void;
    openAt: (x: number, y: number) => void;
    menuId: string;
    anchorRef: RefObject<VirtualAnchor | null>;
    menuRef: RefObject<HTMLDivElement | null>;
    triggerRef: RefObject<HTMLDivElement | null>;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
    const context = useContext(ContextMenuContext);

    if (!context) {
        throw new Error(
            'ContextMenu components must be used inside a ContextMenu.',
        );
    }

    return context;
}

const itemsOf = (menu: HTMLElement) => [
    ...menu.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
    ),
];

/** A zero-size rect at the cursor, so the menu can anchor to a point. */
const pointRect = (x: number, y: number) =>
    ({
        x,
        y,
        top: y,
        left: x,
        right: x,
        bottom: y,
        width: 0,
        height: 0,
        toJSON: () => ({}),
    }) as DOMRect;

export function ContextMenu({ children }: ContextMenuProps) {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const anchorRef = useRef<VirtualAnchor | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    const openAt = (x: number, y: number) => {
        anchorRef.current = { getBoundingClientRect: () => pointRect(x, y) };
        setOpen(true);
    };

    const close = () => setOpen(false);

    useDismiss({
        enabled: open,
        refs: [menuRef],
        onDismiss: close,
    });

    return (
        <ContextMenuContext.Provider
            value={{ open, close, openAt, menuId, anchorRef, menuRef, triggerRef }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
}

export function ContextMenuTrigger({
    className,
    onContextMenu,
    ...props
}: ContextMenuTriggerProps) {
    const { openAt, triggerRef } = useContextMenu();

    return (
        <div
            ref={triggerRef}
            className={className}
            onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
                onContextMenu?.(event);

                if (event.defaultPrevented) {
                    return;
                }

                event.preventDefault();
                openAt(event.clientX, event.clientY);
            }}
            {...props}
        />
    );
}

export function ContextMenuContent({
    className,
    onKeyDown,
    ...props
}: ContextMenuContentProps) {
    const { open, close, menuId, anchorRef, menuRef } = useContextMenu();

    /**
     * A context menu is opened by pointer but driven by keyboard afterwards,
     * so focus moves into it. The move is deferred a frame: the browser's own
     * handling of the click that opened the menu lands focus on <body> after
     * React's effects have already run, and would undo an immediate focus.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        const frame = requestAnimationFrame(() => {
            if (menuRef.current) {
                itemsOf(menuRef.current)[0]?.focus();
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [open, menuRef]);

    const classes = [
        'z-50 min-w-48 rounded-md border border-border bg-surface p-1',
        'shadow-lg outline-none',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || !menuRef.current) {
            return;
        }

        if (event.key === 'Escape' || event.key === 'Tab') {
            event.preventDefault();
            close();
            return;
        }

        const items = itemsOf(menuRef.current);
        const current = items.indexOf(
            document.activeElement as HTMLButtonElement,
        );

        const next = {
            ArrowDown: current + 1 >= items.length ? 0 : current + 1,
            ArrowUp: current <= 0 ? items.length - 1 : current - 1,
            Home: 0,
            End: items.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        items[next]?.focus();
    };

    return (
        <OverlayPanel
            anchorRef={anchorRef}
            panelRef={menuRef}
            open={open}
            side="bottom"
            align="start"
            offset={2}
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className={classes}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
}

const itemStyles =
    'flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 ' +
    'text-left text-sm outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:bg-accent focus-visible:text-accent-foreground ' +
    'disabled:pointer-events-none disabled:opacity-50';

export function ContextMenuItem({
    onSelect,
    destructive = false,
    icon,
    shortcut,
    className,
    onClick,
    children,
    ...props
}: ContextMenuItemProps) {
    const { close } = useContextMenu();

    const classes = [
        itemStyles,
        destructive ? 'text-destructive' : 'text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                onSelect?.();
                close();
            }}
            {...props}
        >
            {icon ? (
                <span aria-hidden="true" className="size-4 shrink-0">
                    {icon}
                </span>
            ) : null}

            <span className="min-w-0 flex-1 truncate">{children}</span>

            {shortcut ? (
                <span className="shrink-0 text-xs tracking-wide text-muted-foreground">
                    {shortcut}
                </span>
            ) : null}
        </button>
    );
}

export function ContextMenuLabel({
    className,
    ...props
}: ContextMenuLabelProps) {
    const classes = [
        'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function ContextMenuSeparator({
    className,
    ...props
}: ContextMenuSeparatorProps) {
    const classes = ['my-1 h-px bg-border', className]
        .filter(Boolean)
        .join(' ');

    return <div role="separator" className={classes} {...props} />;
}
