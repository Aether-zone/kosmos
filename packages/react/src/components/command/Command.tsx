import {
    createContext,
    type HTMLAttributes,
    type InputHTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { IoSearchOutline } from 'react-icons/io5';

import { ModalOverlay } from '../../internal';

export interface CommandProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'role'> {
    /** Render inside a modal overlay rather than in place. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    label?: string;
}

export interface CommandInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: string;
    onValueChange?: (value: string) => void;
}

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> { }

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
    heading?: ReactNode;
}

export interface CommandItemProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /** Text matched against the query; defaults to the rendered children. */
    keywords?: string;
    onSelect?: () => void;
    icon?: ReactNode;
    shortcut?: string;
    disabled?: boolean;
}

export interface CommandEmptyProps extends HTMLAttributes<HTMLDivElement> { }

interface CommandContextValue {
    query: string;
    setQuery: (query: string) => void;
    listId: string;
    close?: () => void;
    matches: (keywords: string) => boolean;
    /** Items register so arrow keys can walk them without a DOM query. */
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommand(component: string) {
    const context = useContext(CommandContext);

    if (!context) {
        throw new Error(`${component} must be used inside a Command.`);
    }

    return context;
}

const enabledItems = (list: HTMLElement) => [
    ...list.querySelectorAll<HTMLDivElement>(
        '[role="option"]:not([aria-disabled="true"])',
    ),
];

/**
 * A filterable command list, usable inline or as a modal palette.
 *
 * Filtering happens in the items themselves rather than over a data array, so
 * the list stays composable — a group renders nothing once all of its items
 * have filtered out.
 */
export function Command({
    open,
    onOpenChange,
    label = 'Command palette',
    className,
    children,
    ...props
}: CommandProps) {
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    const listId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);

    const modal = open !== undefined;

    // Reopening should not inherit the previous search.
    useEffect(() => {
        if (modal && open) {
            setQuery('');
            setActiveId(null);
        }
    }, [modal, open]);

    const matches = useMemo(() => {
        const trimmed = query.trim().toLowerCase();

        return (keywords: string) =>
            trimmed === '' || keywords.toLowerCase().includes(trimmed);
    }, [query]);

    const close = modal ? () => onOpenChange?.(false) : undefined;

    /** Arrow keys move the highlight; Enter activates it. */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const list = rootRef.current;

        if (!list) {
            return;
        }

        const items = enabledItems(list);

        if (items.length === 0) {
            return;
        }

        const current = items.findIndex((item) => item.id === activeId);

        if (event.key === 'Enter') {
            event.preventDefault();
            items[current === -1 ? 0 : current]?.click();
            return;
        }

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
        setActiveId(items[next].id);
        items[next].scrollIntoView({ block: 'nearest' });
    };

    const classes = [
        'flex w-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <div
            ref={rootRef}
            className={classes}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {children}
        </div>
    );

    const value: CommandContextValue = {
        query,
        setQuery,
        listId,
        close,
        matches,
        activeId,
        setActiveId,
    };

    if (!modal) {
        return (
            <CommandContext.Provider value={value}>
                {content}
            </CommandContext.Provider>
        );
    }

    return (
        <CommandContext.Provider value={value}>
            <ModalOverlay
                open={Boolean(open)}
                onDismiss={() => onOpenChange?.(false)}
                aria-label={label}
                className="fixed inset-x-0 top-[15vh] mx-auto flex w-full max-w-lg px-4"
            >
                {content}
            </ModalOverlay>
        </CommandContext.Provider>
    );
}

export function CommandInput({
    value: controlledValue,
    onValueChange,
    className,
    placeholder = 'Type a command or search…',
    ...props
}: CommandInputProps) {
    const { query, setQuery, listId, activeId } = useCommand('CommandInput');

    const value = controlledValue ?? query;

    const classes = [
        'w-full bg-transparent py-3 text-sm text-foreground outline-none',
        'placeholder:text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="flex items-center gap-2 border-b border-border px-4">
            <IoSearchOutline
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
            />

            <input
                type="text"
                role="combobox"
                autoComplete="off"
                autoFocus
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={activeId ?? undefined}
                placeholder={placeholder}
                value={value}
                className={classes}
                onChange={(event) => {
                    setQuery(event.target.value);
                    onValueChange?.(event.target.value);
                }}
                {...props}
            />
        </div>
    );
}

export function CommandList({ className, ...props }: CommandListProps) {
    const { listId } = useCommand('CommandList');

    const classes = ['max-h-80 overflow-y-auto p-1', className]
        .filter(Boolean)
        .join(' ');

    return <div id={listId} role="listbox" className={classes} {...props} />;
}

export function CommandGroup({
    heading,
    className,
    children,
    ...props
}: CommandGroupProps) {
    const groupRef = useRef<HTMLDivElement | null>(null);
    const [empty, setEmpty] = useState(false);
    const { query } = useCommand('CommandGroup');

    // A group with no surviving items should disappear along with them,
    // heading included.
    useEffect(() => {
        setEmpty(
            (groupRef.current?.querySelectorAll('[role="option"]').length ??
                0) === 0,
        );
    }, [query, children]);

    const classes = [className].filter(Boolean).join(' ');

    return (
        <div
            ref={groupRef}
            role="group"
            hidden={empty}
            className={classes || undefined}
            {...props}
        >
            {heading ? (
                <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {heading}
                </div>
            ) : null}

            {children}
        </div>
    );
}

export function CommandItem({
    keywords,
    onSelect,
    icon,
    shortcut,
    disabled = false,
    className,
    children,
    ...props
}: CommandItemProps) {
    const { matches, close, activeId, setActiveId } = useCommand('CommandItem');
    const id = useId();

    const searchText =
        keywords ?? (typeof children === 'string' ? children : '');

    if (!matches(searchText)) {
        return null;
    }

    const active = activeId === id;

    const classes = [
        'flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm',
        'outline-none transition-colors',
        disabled ? 'pointer-events-none opacity-50' : '',
        active ? 'bg-accent text-accent-foreground' : 'text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            id={id}
            role="option"
            aria-selected={active}
            aria-disabled={disabled || undefined}
            className={classes}
            onClick={() => {
                onSelect?.();
                close?.();
            }}
            onMouseEnter={() => setActiveId(id)}
            {...props}
        >
            {icon ? (
                <span
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                >
                    {icon}
                </span>
            ) : null}

            <span className="min-w-0 flex-1 truncate">{children}</span>

            {shortcut ? (
                <span className="shrink-0 text-xs tracking-wide text-muted-foreground">
                    {shortcut}
                </span>
            ) : null}
        </div>
    );
}

export function CommandEmpty({
    className,
    children = 'No results found.',
    ...props
}: CommandEmptyProps) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    const { query } = useCommand('CommandEmpty');

    // Shown only once every sibling item has filtered itself out.
    useEffect(() => {
        const list = rootRef.current?.closest('[role="listbox"]');

        setVisible(
            (list?.querySelectorAll('[role="option"]').length ?? 0) === 0,
        );
    }, [query]);

    const classes = [
        'px-3 py-6 text-center text-sm text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={rootRef} className={classes} hidden={!visible} {...props}>
            {children}
        </div>
    );
}
