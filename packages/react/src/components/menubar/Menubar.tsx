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
    useState,
} from 'react';

import { OverlayPanel, useDismiss } from '../../internal';

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
    label?: string;
}

export interface MenubarMenuProps {
    /** Identifies the menu within the bar; must be unique. */
    value: string;
    children: ReactNode;
}

export interface MenubarTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

export interface MenubarContentProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> { }

export interface MenubarItemProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
    onSelect?: () => void;
    destructive?: boolean;
    shortcut?: string;
}

export interface MenubarSeparatorProps
    extends HTMLAttributes<HTMLDivElement> { }

interface MenubarContextValue {
    openValue: string | null;
    setOpenValue: (value: string | null) => void;
    barRef: RefObject<HTMLDivElement | null>;
}

interface MenuContextValue {
    value: string;
    triggerRef: RefObject<HTMLButtonElement | null>;
    menuRef: RefObject<HTMLDivElement | null>;
    menuId: string;
}

const MenubarContext = createContext<MenubarContextValue | null>(null);
const MenuContext = createContext<MenuContextValue | null>(null);

function useMenubar() {
    const context = useContext(MenubarContext);

    if (!context) {
        throw new Error('Menubar components must be used inside a Menubar.');
    }

    return context;
}

function useMenu(component: string) {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error(`${component} must be used inside a MenubarMenu.`);
    }

    return context;
}

const itemsOf = (menu: HTMLElement) => [
    ...menu.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
    ),
];

export function Menubar({
    label = 'Main',
    className,
    onKeyDown,
    children,
    ...props
}: MenubarProps) {
    const [openValue, setOpenValue] = useState<string | null>(null);
    const barRef = useRef<HTMLDivElement | null>(null);

    /** Left/Right move between top-level menus, as a menubar expects. */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const triggers = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[data-menubar-trigger]:not(:disabled)',
            ),
        ];

        const current = triggers.indexOf(
            document.activeElement as HTMLButtonElement,
        );

        if (current === -1) {
            return;
        }

        const next = {
            ArrowRight: (current + 1) % triggers.length,
            ArrowLeft: (current - 1 + triggers.length) % triggers.length,
            Home: 0,
            End: triggers.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        triggers[next].focus();

        // Moving along an open menubar opens the menu you land on, which is
        // how native menubars behave.
        if (openValue !== null) {
            triggers[next].click();
        }
    };

    const classes = [
        'inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <MenubarContext.Provider value={{ openValue, setOpenValue, barRef }}>
            <div
                ref={barRef}
                role="menubar"
                aria-label={label}
                aria-orientation="horizontal"
                className={classes}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </div>
        </MenubarContext.Provider>
    );
}

export function MenubarMenu({ value, children }: MenubarMenuProps) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const menuId = useId();

    return (
        <MenuContext.Provider value={{ value, triggerRef, menuRef, menuId }}>
            {children}
        </MenuContext.Provider>
    );
}

const triggerStyles =
    'inline-flex h-8 cursor-pointer items-center rounded-sm px-3 text-sm ' +
    'font-medium text-foreground outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

export function MenubarTrigger({
    className,
    onClick,
    onMouseEnter,
    ...props
}: MenubarTriggerProps) {
    const { openValue, setOpenValue } = useMenubar();
    const { value, triggerRef, menuId } = useMenu('MenubarTrigger');

    const open = openValue === value;

    const classes = [
        triggerStyles,
        open && 'bg-accent text-accent-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            ref={triggerRef}
            type="button"
            role="menuitem"
            data-menubar-trigger=""
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                setOpenValue(open ? null : value);
            }}
            onMouseEnter={(event) => {
                onMouseEnter?.(event);

                // Once one menu is open, hovering another switches to it.
                if (openValue !== null && openValue !== value) {
                    setOpenValue(value);
                }
            }}
            {...props}
        />
    );
}

export function MenubarContent({
    className,
    onKeyDown,
    ...props
}: MenubarContentProps) {
    const { openValue, setOpenValue } = useMenubar();
    const { value, triggerRef, menuRef, menuId } = useMenu('MenubarContent');

    const open = openValue === value;

    useDismiss({
        enabled: open,
        refs: [triggerRef, menuRef],
        onDismiss: () => setOpenValue(null),
        escape: false,
    });

    /**
     * Focus moves into the menu on open, so the arrow keys and Escape — which
     * are handled on the panel — actually reach it. The move is deferred a
     * frame because the browser settles focus from the opening click after
     * React's effects have run.
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
        'z-50 min-w-52 rounded-md border border-border bg-surface p-1',
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

        if (event.key === 'Escape') {
            event.preventDefault();
            setOpenValue(null);
            triggerRef.current?.focus();
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
            anchorRef={triggerRef}
            panelRef={menuRef}
            open={open}
            side="bottom"
            align="start"
            offset={6}
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
    'flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2 ' +
    'text-left text-sm outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:bg-accent focus-visible:text-accent-foreground ' +
    'disabled:pointer-events-none disabled:opacity-50';

export function MenubarItem({
    onSelect,
    destructive = false,
    shortcut,
    className,
    onClick,
    children,
    ...props
}: MenubarItemProps) {
    const { setOpenValue } = useMenubar();

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
                setOpenValue(null);
            }}
            {...props}
        >
            <span className="min-w-0 flex-1 truncate">{children}</span>

            {shortcut ? (
                <span className="shrink-0 text-xs tracking-wide text-muted-foreground">
                    {shortcut}
                </span>
            ) : null}
        </button>
    );
}

export function MenubarSeparator({
    className,
    ...props
}: MenubarSeparatorProps) {
    const classes = ['my-1 h-px bg-border', className]
        .filter(Boolean)
        .join(' ');

    return <div role="separator" className={classes} {...props} />;
}
