import {
    Fragment,
    type AnchorHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
    Children,
    isValidElement,
} from 'react';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
    separator?: ReactNode;
    label?: string;
}

export interface BreadcrumbItemProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Renders as plain text with `aria-current="page"`. */
    current?: boolean;
}

export interface BreadcrumbEllipsisProps
    extends HTMLAttributes<HTMLSpanElement> { }

const linkStyles =
    'rounded-sm text-sm text-muted-foreground outline-none transition-colors ' +
    'hover:text-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring';

const currentStyles = 'text-sm font-medium text-foreground';

export function Breadcrumbs({
    separator = '/',
    label = 'Breadcrumb',
    className,
    children,
    ...props
}: BreadcrumbsProps) {
    const classes = ['w-full', className].filter(Boolean).join(' ');

    const items = Children.toArray(children).filter(isValidElement);

    return (
        <nav aria-label={label} className={classes} {...props}>
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        <li className="inline-flex items-center">{item}</li>

                        {index < items.length - 1 ? (
                            <li
                                aria-hidden="true"
                                className="select-none text-sm text-muted-foreground"
                            >
                                {separator}
                            </li>
                        ) : null}
                    </Fragment>
                ))}
            </ol>
        </nav>
    );
}

export function BreadcrumbItem({
    current = false,
    className,
    children,
    ...props
}: BreadcrumbItemProps) {
    const classes = [current ? currentStyles : linkStyles, className]
        .filter(Boolean)
        .join(' ');

    // The current page is not a link — there is nowhere for it to go.
    if (current) {
        return (
            <span aria-current="page" className={classes}>
                {children}
            </span>
        );
    }

    return (
        <a className={classes} {...props}>
            {children}
        </a>
    );
}

export function BreadcrumbEllipsis({
    className,
    ...props
}: BreadcrumbEllipsisProps) {
    const classes = ['text-sm text-muted-foreground', className]
        .filter(Boolean)
        .join(' ');

    return (
        <span
            role="presentation"
            aria-label="More links"
            className={classes}
            {...props}
        >
            …
        </span>
    );
}
