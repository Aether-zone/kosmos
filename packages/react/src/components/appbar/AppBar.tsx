import type {
    AnchorHTMLAttributes,
    HTMLAttributes,
    ReactNode,
} from 'react';

export type AppBarPosition = 'static' | 'sticky' | 'fixed';
export type AppBarSize = 'sm' | 'md' | 'lg';

export interface AppBarProps extends HTMLAttributes<HTMLElement> {
    position?: AppBarPosition;
    size?: AppBarSize;
    /** Drops the bottom border, for a bar over a matching surface. */
    borderless?: boolean;
    /** Constrains the contents to a centred column, as on a marketing page. */
    maxWidth?: 'full' | 'screen-lg' | 'screen-xl' | 'screen-2xl';
}

export interface AppBarBrandProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** Logo or mark, placed before the name. */
    logo?: ReactNode;
}

export interface AppBarSectionProps extends HTMLAttributes<HTMLDivElement> { }

export interface AppBarTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const positionStyles: Record<AppBarPosition, string> = {
    static: '',
    sticky: 'sticky top-0 z-40',
    fixed: 'fixed inset-x-0 top-0 z-40',
};

const sizeStyles: Record<AppBarSize, string> = {
    sm: 'h-12 px-3 gap-3',
    md: 'h-14 px-4 gap-4',
    lg: 'h-16 px-6 gap-6',
};

const maxWidthStyles = {
    full: 'max-w-full',
    'screen-lg': 'max-w-(--breakpoint-lg)',
    'screen-xl': 'max-w-(--breakpoint-xl)',
    'screen-2xl': 'max-w-(--breakpoint-2xl)',
};

/**
 * The application's top bar: brand on one side, actions on the other.
 *
 * A `<header>` with `role="banner"`, which assistive technology treats as a
 * landmark — so a page should have exactly one, and a bar scoped to part of a
 * page should pass `role="presentation"` instead of nesting a second banner.
 *
 * Layout is left to `AppBarSection`: the bar itself only sets the height,
 * padding and surface, so a two-part bar and a three-part one are the same
 * component.
 */
export function AppBar({
    position = 'static',
    size = 'md',
    borderless = false,
    maxWidth = 'full',
    className,
    children,
    ...props
}: AppBarProps) {
    const classes = [
        'w-full bg-surface text-foreground',
        !borderless && 'border-b border-border',
        positionStyles[position],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const inner = [
        'mx-auto flex w-full items-center',
        sizeStyles[size],
        maxWidthStyles[maxWidth],
    ].join(' ');

    return (
        <header role="banner" className={classes} {...props}>
            <div className={inner}>{children}</div>
        </header>
    );
}

/**
 * A run of items. The first one usually holds the brand and the last the
 * actions; give the one that should absorb the slack `className="flex-1"`.
 */
export function AppBarSection({
    className,
    ...props
}: AppBarSectionProps) {
    const classes = ['flex min-w-0 items-center gap-2', className]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

const brandStyles =
    'flex min-w-0 shrink-0 items-center gap-2 rounded-sm ' +
    'text-base font-semibold text-foreground no-underline outline-none ' +
    'transition-colors hover:text-foreground/80 ' +
    'focus-visible:ring-2 focus-visible:ring-ring';

export function AppBarBrand({
    logo,
    className,
    children,
    ...props
}: AppBarBrandProps) {
    const classes = [brandStyles, className].filter(Boolean).join(' ');

    return (
        <a className={classes} {...props}>
            {logo ? (
                <span aria-hidden="true" className="flex shrink-0 items-center">
                    {logo}
                </span>
            ) : null}

            <span className="truncate">{children}</span>
        </a>
    );
}

/** For a bar that names the current page rather than the product. */
export function AppBarTitle({ className, ...props }: AppBarTitleProps) {
    const classes = [
        'min-w-0 truncate text-base font-semibold text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <h1 className={classes} {...props} />;
}
