import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    type RefObject,
    useContext,
    useEffect,
    useId,
    useRef,
} from 'react';

import { useControllableState } from '../../hooks';

import { IoChevronDown } from 'react-icons/io5';

import { OverlayPanel, useDismiss, type OverlayAlign } from '../../internal';

export type DropdownAlign = 'start' | 'end';

export interface DropdownProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export interface DropdownTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
    align?: DropdownAlign;
}

export interface DropdownItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
    onSelect?: () => void;
    destructive?: boolean;
}

export interface DropdownLabelProps extends HTMLAttributes<HTMLDivElement> { }

export interface DropdownSeparatorProps
    extends HTMLAttributes<HTMLDivElement> { }

interface DropdownContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    menuId: string;
    triggerRef: RefObject<HTMLButtonElement | null>;
    rootRef: RefObject<HTMLDivElement | null>;
    menuRef: RefObject<HTMLDivElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error(
            'Dropdown components must be used inside a Dropdown component.',
        );
    }

    return context;
}

/** Enabled menu items, in DOM order. */
const itemsOf = (menu: HTMLElement) => [
    ...menu.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
    ),
];

export function Dropdown({
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    children,
}: DropdownProps) {
    const [open, setOpen] = useControllableState({
        value: controlledOpen,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
    const menuId = useId();
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // The menu is portalled, so "inside" spans two detached subtrees.
    useDismiss({
        enabled: open,
        refs: [rootRef, menuRef],
        onDismiss: () => setOpen(false),
        escape: false,
    });

    return (
        <DropdownContext.Provider
            value={{ open, setOpen, menuId, triggerRef, rootRef, menuRef }}
        >
            <div ref={rootRef} className="inline-block">
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

const triggerStyles =
    'inline-flex items-center justify-center gap-2 rounded-md border ' +
    'border-border bg-background px-4 text-sm font-medium text-foreground ' +
    'h-10 cursor-pointer transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

export function DropdownTrigger({
    className,
    onClick,
    onKeyDown,
    children,
    ...props
}: DropdownTriggerProps) {
    const { open, setOpen, menuId, triggerRef } = useDropdown();

    const classes = [triggerStyles, className].filter(Boolean).join(' ');

    return (
        <button
            ref={triggerRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                setOpen(!open);
            }}
            onKeyDown={(event) => {
                onKeyDown?.(event);

                if (event.defaultPrevented) {
                    return;
                }

                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    setOpen(true);
                }
            }}
            {...props}
        >
            {children}

            <IoChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
        </button>
    );
}

const menuStyles =
    'z-50 min-w-48 rounded-md border border-border bg-surface p-1 ' +
    'shadow-lg outline-none';

export function DropdownMenu({
    align = 'start',
    className,
    onKeyDown,
    ...props
}: DropdownMenuProps) {
    const { open, setOpen, menuId, triggerRef, rootRef, menuRef } =
        useDropdown();

    /**
     * Opening from the trigger should land on the first item. Deferred a
     * frame, like ContextMenu and Menubar: the panel is portalled, and
     * reaching into it during the passive effect that follows the opening
     * render is not reliable.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        const openedFromTrigger =
            document.activeElement === triggerRef.current;

        const frame = requestAnimationFrame(() => {
            if (openedFromTrigger && menuRef.current) {
                itemsOf(menuRef.current)[0]?.focus();
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [open, menuRef, triggerRef]);

    const classes = [menuStyles, className].filter(Boolean).join(' ');

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || !menuRef.current) {
            return;
        }

        if (event.key === 'Escape' || event.key === 'Tab') {
            setOpen(false);
            triggerRef.current?.focus();

            if (event.key === 'Escape') {
                event.preventDefault();
            }

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
            anchorRef={rootRef}
            panelRef={menuRef}
            open={open}
            side="bottom"
            align={align satisfies OverlayAlign}
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
    'text-left text-sm text-foreground outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:bg-accent focus-visible:text-accent-foreground ' +
    'disabled:pointer-events-none disabled:opacity-50';

export function DropdownItem({
    onSelect,
    destructive = false,
    className,
    onClick,
    ...props
}: DropdownItemProps) {
    const { setOpen, triggerRef } = useDropdown();

    const classes = [
        itemStyles,
        destructive && 'text-destructive-emphasis',
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
                setOpen(false);
                triggerRef.current?.focus();
            }}
            {...props}
        />
    );
}

export function DropdownLabel({
    className,
    ...props
}: DropdownLabelProps) {
    const classes = [
        'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function DropdownSeparator({
    className,
    ...props
}: DropdownSeparatorProps) {
    const classes = ['my-1 h-px bg-border', className]
        .filter(Boolean)
        .join(' ');

    return <div role="separator" className={classes} {...props} />;
}
