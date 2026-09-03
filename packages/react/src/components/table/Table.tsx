import type {
    HTMLAttributes,
    TableHTMLAttributes,
    ThHTMLAttributes,
    TdHTMLAttributes,
} from 'react';

export type SortDirection = 'ascending' | 'descending';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
    /** Tints alternate body rows. */
    striped?: boolean;
    /** Highlights rows on hover — use when rows are interactive. */
    hoverable?: boolean;
    caption?: string;
}

export interface TableHeaderProps
    extends HTMLAttributes<HTMLTableSectionElement> { }

export interface TableBodyProps
    extends HTMLAttributes<HTMLTableSectionElement> { }

export interface TableFooterProps
    extends HTMLAttributes<HTMLTableSectionElement> { }

export interface TableRowProps
    extends HTMLAttributes<HTMLTableRowElement> {
    selected?: boolean;
}

export interface TableHeadProps
    extends ThHTMLAttributes<HTMLTableCellElement> {
    /** Marks the column sortable and reports its current direction. */
    sort?: SortDirection | 'none';
    onSortChange?: () => void;
}

export interface TableCellProps
    extends TdHTMLAttributes<HTMLTableCellElement> {
    /** Right-aligns and tabular-aligns numeric content. */
    numeric?: boolean;
}

export interface TableEmptyProps
    extends TdHTMLAttributes<HTMLTableCellElement> {
    colSpan: number;
}

export function Table({
    striped = false,
    hoverable = false,
    caption,
    className,
    children,
    ...props
}: TableProps) {
    const classes = [
        'w-full caption-bottom border-collapse text-sm',
        striped && '[&_tbody_tr:nth-child(even)]:bg-muted/40',
        hoverable && '[&_tbody_tr:hover]:bg-accent/60',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // A table is the one piece of content that reliably outgrows its
    // container, so it carries its own horizontal scroll.
    return (
        <div className="w-full overflow-x-auto">
            <table className={classes} {...props}>
                {caption ? (
                    <caption className="mt-3 text-sm text-muted-foreground">
                        {caption}
                    </caption>
                ) : null}

                {children}
            </table>
        </div>
    );
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
    const classes = ['[&_tr]:border-b [&_tr]:border-border', className]
        .filter(Boolean)
        .join(' ');

    return <thead className={classes} {...props} />;
}

export function TableBody({ className, ...props }: TableBodyProps) {
    const classes = [
        '[&_tr]:border-b [&_tr]:border-border [&_tr:last-child]:border-0',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <tbody className={classes} {...props} />;
}

export function TableFooter({ className, ...props }: TableFooterProps) {
    const classes = [
        'border-t border-border bg-muted/40 font-medium',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <tfoot className={classes} {...props} />;
}

export function TableRow({
    selected = false,
    className,
    ...props
}: TableRowProps) {
    const classes = [
        'transition-colors',
        selected && 'bg-accent',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <tr
            aria-selected={selected || undefined}
            className={classes}
            {...props}
        />
    );
}

const sortIndicator = { ascending: '↑', descending: '↓', none: '↕' };

export function TableHead({
    sort,
    onSortChange,
    className,
    children,
    ...props
}: TableHeadProps) {
    const classes = [
        'h-10 px-3 text-left align-middle font-medium text-muted-foreground',
        'whitespace-nowrap',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <th
            scope="col"
            // aria-sort belongs on the header cell, and only on a sorted one.
            aria-sort={sort && sort !== 'none' ? sort : undefined}
            className={classes}
            {...props}
        >
            {sort === undefined ? (
                children
            ) : (
                <button
                    type="button"
                    className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={onSortChange}
                >
                    {children}

                    <span aria-hidden="true" className="text-xs">
                        {sortIndicator[sort]}
                    </span>
                </button>
            )}
        </th>
    );
}

export function TableCell({
    numeric = false,
    className,
    ...props
}: TableCellProps) {
    const classes = [
        'px-3 py-2.5 align-middle text-foreground',
        numeric && 'text-right tabular-nums',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <td className={classes} {...props} />;
}

export function TableEmpty({
    className,
    children,
    ...props
}: TableEmptyProps) {
    const classes = [
        'px-3 py-10 text-center text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <td className={classes} {...props}>
            {children}
        </td>
    );
}
