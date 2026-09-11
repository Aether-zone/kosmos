import {
    Children,
    createContext,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useControllableState } from '../../hooks';
import { Spinner } from '../spinner';
import { IoAlertCircleOutline, IoChevronForward } from 'react-icons/io5';

export interface TreeViewProps
    extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect' | 'defaultValue'> {
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (expanded: string[]) => void;
    selected?: string;
    defaultSelected?: string;
    onSelectedChange?: (value: string) => void;
    label?: string;
    /**
     * Announced on a branch while `loadChildren` is in flight. Not shown —
     * the visible signal is the spinner that replaces the chevron.
     */
    loadingLabel?: string;
    /** Shown in the row that replaces a branch whose `loadChildren` rejected. */
    errorLabel?: string;
    /** Labels the button that retries a failed `loadChildren`. */
    retryLabel?: string;
}

export interface TreeItemProps
    extends Omit<HTMLAttributes<HTMLLIElement>, 'onSelect'> {
    value: string;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
    /**
     * Fetches this branch's children the first time it is expanded. Supplying
     * it marks the item as a branch, so the chevron is there to click before
     * anything is known about what is underneath.
     *
     * Static `children` win: pass one or the other, not both.
     */
    loadChildren?: () => Promise<ReactNode>;
}

type BranchLoad =
    | { status: 'loading' }
    | { status: 'loaded'; nodes: ReactNode }
    | { status: 'error' };

interface TreeContextValue {
    expanded: string[];
    toggle: (value: string) => void;
    selected?: string;
    select: (value: string) => void;
    branches: Record<string, BranchLoad>;
    load: (value: string, loader: () => Promise<ReactNode>) => void;
    retry: (value: string, loader: () => Promise<ReactNode>) => void;
    loadingLabel: string;
    errorLabel: string;
    retryLabel: string;
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

/** Rows are indented by depth rather than by nesting padding, so the whole
 * row stays clickable across the full width. */
const indent = (depth: number) => `${(depth - 1) * 16 + 4}px`;

export function TreeView({
    expanded: controlledExpanded,
    defaultExpanded = [],
    onExpandedChange,
    selected: controlledSelected,
    defaultSelected,
    onSelectedChange,
    label = 'Tree',
    loadingLabel = 'Loading…',
    errorLabel = 'Could not load',
    retryLabel = 'Retry',
    className,
    onKeyDown,
    children,
    ...props
}: TreeViewProps) {
    const [expanded, setExpanded] = useControllableState({
        value: controlledExpanded,
        defaultValue: defaultExpanded,
        onChange: onExpandedChange,
    });

    const [selected, select] = useControllableState<string | undefined>({
        value: controlledSelected,
        defaultValue: defaultSelected,
        // `defaultSelected` is optional, so nothing may be selected yet.
        onChange: (next) => {
            if (next !== undefined) {
                onSelectedChange?.(next);
            }
        },
    });

    /**
     * Lazily loaded children are held here rather than in the branch that
     * asked for them, because a TreeItem unmounts as soon as an *ancestor*
     * collapses. Keeping the cache at the root means reopening a grandparent
     * shows what was already fetched instead of fetching it again.
     */
    const [branches, setBranches] = useState<Record<string, BranchLoad>>({});

    /**
     * Which branches have already asked. A ref, not derived from `branches`,
     * so the guard is read at call time: TreeItem's effect re-runs whenever an
     * inline `loadChildren` arrow changes identity, which is every render.
     */
    const requested = useRef(new Set<string>());

    const start = useCallback(
        (value: string, loader: () => Promise<ReactNode>) => {
            setBranches((previous) => ({
                ...previous,
                [value]: { status: 'loading' },
            }));

            loader().then(
                (nodes) =>
                    setBranches((previous) => ({
                        ...previous,
                        [value]: { status: 'loaded', nodes },
                    })),
                () =>
                    setBranches((previous) => ({
                        ...previous,
                        [value]: { status: 'error' },
                    })),
            );
        },
        [],
    );

    const load = useCallback(
        (value: string, loader: () => Promise<ReactNode>) => {
            if (requested.current.has(value)) {
                return;
            }

            requested.current.add(value);
            start(value, loader);
        },
        [start],
    );

    // Retry deliberately skips the guard. It can only be reached from the
    // error row, which the resulting `loading` state replaces, so a second
    // fetch cannot overlap the first.
    const retry = useCallback(
        (value: string, loader: () => Promise<ReactNode>) => {
            requested.current.add(value);
            start(value, loader);
        },
        [start],
    );

    const toggle = (value: string) => {
        setExpanded(
            expanded.includes(value)
                ? expanded.filter((entry) => entry !== value)
                : [...expanded, value],
        );
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
        <TreeContext.Provider
            value={{
                expanded,
                toggle,
                selected,
                select,
                branches,
                load,
                retry,
                loadingLabel,
                errorLabel,
                retryLabel,
            }}
        >
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

/**
 * A failed branch reports in the group rather than on the row that failed, so
 * the message has somewhere to sit and the retry has somewhere to be.
 *
 * It has to be a `treeitem`: `role="tree"` admits only `treeitem` and `group`
 * as children, and anything else — a `status` or `alert` live region, which is
 * the obvious reach — fails `aria-required-children`. Being a real row also
 * means the arrow keys reach it, so the retry is not stranded behind Tab.
 */
function TreeErrorRow({
    value,
    label,
    retryLabel,
    onRetry,
}: {
    value: string;
    label: string;
    retryLabel: string;
    onRetry: () => void;
}) {
    const depth = useContext(DepthContext);

    return (
        <li role="none">
            <div
                role="treeitem"
                data-tree-row={`${value}/__error`}
                aria-level={depth}
                tabIndex={0}
                // `destructive` is a fill colour; as text on a surface it is
                // the emphasis pair that clears 4.5:1.
                className={
                    'flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 ' +
                    'text-sm text-destructive-emphasis outline-none ' +
                    'focus-visible:ring-2 focus-visible:ring-ring'
                }
                style={{ paddingLeft: indent(depth) }}
            >
                <IoAlertCircleOutline
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                />
                <span className="min-w-0 truncate">{label}</span>

                <button
                    type="button"
                    className={
                        'shrink-0 cursor-pointer rounded-sm px-1 underline ' +
                        'underline-offset-2 outline-none hover:no-underline ' +
                        'focus-visible:ring-2 focus-visible:ring-ring'
                    }
                    onClick={onRetry}
                >
                    {retryLabel}
                </button>
            </div>
        </li>
    );
}

export function TreeItem({
    value,
    label,
    icon,
    disabled = false,
    onSelect,
    loadChildren,
    className,
    children,
    ...props
}: TreeItemProps) {
    const {
        expanded,
        toggle,
        selected,
        select,
        branches,
        load,
        retry,
        loadingLabel,
        errorLabel,
        retryLabel,
    } = useTree();
    const depth = useContext(DepthContext);

    const hasStaticChildren = Children.count(children) > 0;
    const loader = hasStaticChildren ? undefined : loadChildren;

    const isOpen = expanded.includes(value);
    const branch = branches[value];
    const isLoading = branch?.status === 'loading';
    const isError = branch?.status === 'error';

    const loadedNodes = branch?.status === 'loaded' ? branch.nodes : null;
    const content = hasStaticChildren ? children : loadedNodes;
    const hasContent = Children.count(content) > 0;

    /**
     * A branch that turned out to be empty becomes a leaf: it drops the
     * chevron and `aria-expanded`, which would otherwise promise something to
     * open that never opens.
     */
    const isBranch =
        hasStaticChildren ||
        (Boolean(loader) && branch?.status !== 'loaded') ||
        hasContent;

    const isSelected = selected === value;

    /**
     * Fetching from an effect rather than the click handler means a branch
     * opened through `defaultExpanded`, or by a controlled parent, loads the
     * same way one opened by hand does.
     */
    useEffect(() => {
        if (isOpen && loader) {
            load(value, loader);
        }
    }, [isOpen, load, loader, value]);

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
                aria-busy={isLoading || undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : 0}
                className={classes}
                style={{ paddingLeft: indent(depth) }}
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
                {/*
                 * Progress replaces the chevron rather than adding a row of
                 * its own: a `status` live region is not a legal child of a
                 * tree, and the twisty is where the eye already is. The
                 * spinner is decorative — `aria-busy` above is what carries
                 * the state to assistive technology.
                 */}
                {isLoading ? (
                    <Spinner
                        size="xs"
                        label={null}
                        className="text-muted-foreground"
                    />
                ) : isBranch ? (
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

                {/* `aria-busy` says *that* the row is working; this says what. */}
                {isLoading ? (
                    <span className="sr-only">{loadingLabel}</span>
                ) : null}
            </div>

            {/*
             * An empty `group` is legal but pointless, and it makes a branch
             * that is still fetching look like one that opened onto nothing.
             */}
            {isBranch && isOpen && (hasContent || isError) ? (
                <DepthContext.Provider value={depth + 1}>
                    <ul role="group">
                        {content}

                        {isError && loader ? (
                            <TreeErrorRow
                                value={value}
                                label={errorLabel}
                                retryLabel={retryLabel}
                                onRetry={() => retry(value, loader)}
                            />
                        ) : null}
                    </ul>
                </DepthContext.Provider>
            ) : null}
        </li>
    );
}
