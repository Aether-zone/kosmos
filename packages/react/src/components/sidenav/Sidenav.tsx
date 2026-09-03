import type {
    HTMLAttributes,
    ReactNode,
} from 'react';

export interface SidenavProps
    extends HTMLAttributes<HTMLElement> { }

export interface SidenavHeaderProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface SidenavContentProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface SidenavFooterProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface SidenavGroupProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface SidenavGroupLabelProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface SidenavItemProps
    extends HTMLAttributes<HTMLAnchorElement> {
    href?: string;
    active?: boolean;
    icon?: ReactNode;
}

const sidenavStyles =
    'flex h-full w-64 flex-col border-r border-border bg-surface';

const headerStyles =
    'flex shrink-0 items-center border-b border-border p-4';

const contentStyles =
    'flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-3';

const footerStyles =
    'flex shrink-0 flex-col gap-2 border-t border-border p-3';

const groupStyles =
    'flex flex-col gap-1';

const groupLabelStyles =
    'px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground';

const itemStyles =
    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ' +
    'text-muted-foreground transition-colors ' +
    'cursor-pointer outline-none ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring';

const activeItemStyles =
    'bg-accent text-accent-foreground';

export function Sidenav({
    className,
    ...props
}: SidenavProps) {
    const classes = [
        sidenavStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav
            className={classes}
            {...props}
        />
    );
}

export function SidenavHeader({
    className,
    ...props
}: SidenavHeaderProps) {
    const classes = [
        headerStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            {...props}
        />
    );
}

export function SidenavContent({
    className,
    ...props
}: SidenavContentProps) {
    const classes = [
        contentStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            {...props}
        />
    );
}

export function SidenavFooter({
    className,
    ...props
}: SidenavFooterProps) {
    const classes = [
        footerStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            {...props}
        />
    );
}

export function SidenavGroup({
    className,
    ...props
}: SidenavGroupProps) {
    const classes = [
        groupStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            {...props}
        />
    );
}

export function SidenavGroupLabel({
    className,
    ...props
}: SidenavGroupLabelProps) {
    const classes = [
        groupLabelStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            {...props}
        />
    );
}

export function SidenavItem({
    active = false,
    icon,
    className,
    children,
    ...props
}: SidenavItemProps) {
    const classes = [
        itemStyles,
        active && activeItemStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <a
            className={classes}
            aria-current={active ? 'page' : undefined}
            {...props}
        >
            {icon && (
                <span
                    aria-hidden="true"
                    className="size-4 shrink-0"
                >
                    {icon}
                </span>
            )}

            <span className="min-w-0 flex-1 truncate">
                {children}
            </span>
        </a>
    );
}
