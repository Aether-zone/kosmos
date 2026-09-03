import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    ReactNode,
} from 'react';

export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarProps
    extends HTMLAttributes<HTMLDivElement> {
    orientation?: ToolbarOrientation;
}

export interface ToolbarGroupProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface ToolbarButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
}

const toolbarStyles =
    'flex items-center gap-1 rounded-md border border-border bg-surface p-1';

const orientationStyles: Record<ToolbarOrientation, string> = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
};

const groupStyles =
    'flex items-center gap-1';

const buttonStyles =
    'inline-flex items-center justify-center gap-2 rounded-sm px-2.5 py-1.5 ' +
    'text-sm font-medium text-muted-foreground transition-colors ' +
    'cursor-pointer outline-none ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:pointer-events-none disabled:opacity-50';

export function Toolbar({
    orientation = 'horizontal',
    className,
    ...props
}: ToolbarProps) {
    const classes = [
        toolbarStyles,
        orientationStyles[orientation],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="toolbar"
            aria-orientation={orientation}
            className={classes}
            {...props}
        />
    );
}

export function ToolbarGroup({
    className,
    ...props
}: ToolbarGroupProps) {
    const classes = [
        groupStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="group"
            className={classes}
            {...props}
        />
    );
}

export function ToolbarButton({
    icon,
    className,
    children,
    ...props
}: ToolbarButtonProps) {
    const classes = [
        buttonStyles,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            className={classes}
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

            {children}
        </button>
    );
}
