import type { HTMLAttributes, ReactNode } from 'react';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /** Primary action, usually a Button. */
    action?: ReactNode;
    size?: EmptyStateSize;
    /** Draws a dashed placeholder border around the state. */
    bordered?: boolean;
}

const sizeStyles: Record<EmptyStateSize, string> = {
    sm: 'gap-2 px-4 py-8',
    md: 'gap-3 px-6 py-12',
    lg: 'gap-4 px-8 py-16',
};

const iconSizes: Record<EmptyStateSize, string> = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
};

const titleSizes: Record<EmptyStateSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
};

export function EmptyState({
    icon,
    title,
    description,
    action,
    size = 'md',
    bordered = false,
    className,
    children,
    ...props
}: EmptyStateProps) {
    const classes = [
        'flex w-full flex-col items-center justify-center text-center',
        sizeStyles[size],
        bordered && 'rounded-lg border border-dashed border-border',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} {...props}>
            {icon ? (
                <div
                    aria-hidden="true"
                    className={[
                        'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
                        iconSizes[size],
                    ].join(' ')}
                >
                    {icon}
                </div>
            ) : null}

            <p
                className={[
                    'font-medium text-foreground',
                    titleSizes[size],
                ].join(' ')}
            >
                {title}
            </p>

            {description ? (
                <p className="max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {action ? <div className="mt-2">{action}</div> : null}

            {children}
        </div>
    );
}
