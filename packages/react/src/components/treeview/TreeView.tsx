import {
    createContext,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useContext,
    useState,
} from 'react';
import { IoChevronForward } from 'react-icons/io5';

export interface TreeViewProps
    extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect' | 'defaultValue'> {
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (expanded: string[]) => void;
    selected?: string;
    defaultSelected?: string;
    onSelectedChange?: (value: string) => void;
    label?: string;
}

export interface TreeItemProps
    extends Omit<HTMLAttributes<HTMLLIElement>, 'onSelect'> {
    value: string;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
}

interface TreeContextValue {
    expanded: string[];
    toggle: (value: string) => void;
    selected?: string;
    select: (value: string) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);
const DepthContext = createContext(1);

function useTree() {
    const context = useContext(TreeContext);

    if (!context) {
        throw new Error('TreeItem must be used inside a TreeView.');
    }

    return context;
}

/** Visible items in document order — collapsed branches are not in the DOM. */
const visibleItems = (tree: HTMLElement) => [
    ...tree.querySelectorAll<HTMLDivElement>(
        '[data-tree-row]:not([aria-disabled="true"])',
    ),
];

export function TreeView({
    expanded: controlledExpanded,
    defaultExpanded = [],
    onExpandedChange,
    selected: controlledSelected,
    defaultSelected,
    onSelectedChange,
    label = 'Tree',
    className,
    onKeyDown,
    children,
    ...props
}: TreeViewProps) {
    const [uncontrolledExpanded, setUncontrolledExpanded] =
        useState(defaultExpanded);
    const [uncontrolledSelected, setUncontrolledSelected] =
        useState(defaultSelected);

    const expanded = controlledExpanded ?? uncontrolledExpanded;
    const selected = controlledSelected ?? uncontrolledSelected;

    const toggle = (value: string) => {
        const next = expanded.includes(value)
            ? expanded.filter((entry) => entry !== value)
            : [...expanded, value];

        if (controlledExpanded === undefined) {
            setUncontrolledExpanded(next);
        }

        onExpandedChange?.(next);
    };

    const select = (value: string) => {
        if (controlledSelected === undefined) {
            setUncontrolledSelected(value);
        }

        onSelectedChange?.(value);
    };

    /**
     * Up and Down walk the visible rows regardless of nesting; Right expands
     * a branch then steps into it, Left collapses then steps out.
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const rows = visibleItems(event.currentTarget);
        const current = rows.indexOf(document.activeElement as HTMLDivElement);

        if (current === -1) {
            return;
        }

        const row = rows[current];
        const value = row.dataset.treeRow!;
        const isBranch = row.getAttribute('aria-expanded') !== null;
        const isOpen = row.getAttribute('aria-expanded') === 'true';

        if (event.key === 'ArrowRight' && isBranch) {
            event.preventDefault();

            if (isOpen) {
                rows[current + 1]?.focus();
            } else {
                toggle(value);
            }

            return;
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();

            if (isBranch && isOpen) {
                toggle(value);
                return;
            }

            // Step out to the nearest shallower row.
            const depth = Number(row.getAttribute('aria-level'));

            for (let i = current - 1; i >= 0; i -= 1) {
                if (Number(rows[i].getAttribute('aria-level')) < depth) {
                    rows[i].focus();
                    break;
                }
            }

            return;
        }

        const next = {
            ArrowDown: current + 1,
            ArrowUp: current - 1,
            Home: 0,
            End: rows.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        rows[Math.min(Math.max(next, 0), rows.length - 1)]?.focus();
    };

    const classes = ['w-full', className].filter(Boolean).join(' ');

    return (
        <TreeContext.Provider value={{ expanded, toggle, selected, select }}>
            <ul
                role="tree"
                aria-label={label}
                className={classes}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </ul>
        </TreeContext.Provider>
    );
}

const rowStyles =
    'flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 ' +
    'text-sm outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring';

export function TreeItem({
    value,
    label,
    icon,
    disabled = false,
    onSelect,
    className,
    children,
    ...props
}: TreeItemProps) {
    const { expanded, toggle, selected, select } = useTree();
    const depth = useContext(DepthContext);

    const isBranch = Boolean(children);
    const isOpen = expanded.includes(value);
    const isSelected = selected === value;

    const classes = [
        rowStyles,
        isSelected
            ? 'bg-accent text-accent-foreground'
            : 'text-foreground',
        disabled && 'pointer-events-none opacity-50',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <li role="none" {...props}>
            <div
                role="treeitem"
                data-tree-row={value}
                aria-level={depth}
                aria-selected={isSelected}
                aria-expanded={isBranch ? isOpen : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : 0}
                className={classes}
                // Indent by depth rather than nesting padding, so the whole
                // row stays clickable across the full width.
                style={{ paddingLeft: `${(depth - 1) * 16 + 4}px` }}
                onClick={() => {
                    if (disabled) {
                        return;
                    }

                    select(value);
                    onSelect?.();

                    if (isBranch) {
                        toggle(value);
                    }
                }}
            >
                {isBranch ? (
                    <IoChevronForward
                        aria-hidden="true"
                        className={[
                            'size-3.5 shrink-0 text-muted-foreground motion-safe:transition-transform',
                            isOpen ? 'rotate-90' : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    />
                ) : (
                    <span aria-hidden="true" className="size-3.5 shrink-0" />
                )}

                {icon ? (
                    <span
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground"
                    >
                        {icon}
                    </span>
                ) : null}

                <span className="min-w-0 truncate">{label}</span>
            </div>

            {isBranch && isOpen ? (
                <DepthContext.Provider value={depth + 1}>
                    <ul role="group">{children}</ul>
                </DepthContext.Provider>
            ) : null}
        </li>
    );
}
