import type { HTMLAttributes } from 'react';

export interface PaginationProps
    extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    /** Page links either side of the current page. */
    siblingCount?: number;
    label?: string;
    disabled?: boolean;
}

const ELLIPSIS = 'ellipsis';

type PageItem = number | typeof ELLIPSIS;

/**
 * First and last pages are always shown, with the current page and its
 * siblings in between and gaps collapsed, so the control keeps a stable width
 * however many pages there are.
 */
export function pageItems(
    page: number,
    pageCount: number,
    siblingCount: number,
): PageItem[] {
    const from = Math.max(2, page - siblingCount);
    const to = Math.min(pageCount - 1, page + siblingCount);

    const items: PageItem[] = [1];

    if (from > 2) {
        items.push(ELLIPSIS);
    }

    for (let current = from; current <= to; current += 1) {
        items.push(current);
    }

    if (to < pageCount - 1) {
        items.push(ELLIPSIS);
    }

    if (pageCount > 1) {
        items.push(pageCount);
    }

    return items;
}

const buttonStyles =
    'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center ' +
    'rounded-md px-2 text-sm font-medium transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:pointer-events-none disabled:opacity-50';

export function Pagination({
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    label = 'Pagination',
    disabled = false,
    className,
    ...props
}: PaginationProps) {
    const classes = ['w-full', className].filter(Boolean).join(' ');

    const items = pageItems(page, pageCount, siblingCount);

    const go = (next: number) => {
        const clamped = Math.min(Math.max(next, 1), pageCount);

        if (clamped !== page) {
            onPageChange(clamped);
        }
    };

    return (
        <nav aria-label={label} className={classes} {...props}>
            <ul className="flex items-center gap-1">
                <li>
                    <button
                        type="button"
                        aria-label="Previous page"
                        disabled={disabled || page <= 1}
                        className={[
                            buttonStyles,
                            'text-foreground hover:bg-accent hover:text-accent-foreground',
                        ].join(' ')}
                        onClick={() => go(page - 1)}
                    >
                        ‹
                    </button>
                </li>

                {items.map((item, index) =>
                    item === ELLIPSIS ? (
                        <li
                            key={`ellipsis-${index}`}
                            aria-hidden="true"
                            className="px-1 text-sm text-muted-foreground"
                        >
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <button
                                type="button"
                                aria-label={`Page ${item}`}
                                aria-current={item === page ? 'page' : undefined}
                                disabled={disabled}
                                className={[
                                    buttonStyles,
                                    item === page
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                                ].join(' ')}
                                onClick={() => go(item)}
                            >
                                {item}
                            </button>
                        </li>
                    ),
                )}

                <li>
                    <button
                        type="button"
                        aria-label="Next page"
                        disabled={disabled || page >= pageCount}
                        className={[
                            buttonStyles,
                            'text-foreground hover:bg-accent hover:text-accent-foreground',
                        ].join(' ')}
                        onClick={() => go(page + 1)}
                    >
                        ›
                    </button>
                </li>
            </ul>
        </nav>
    );
}
