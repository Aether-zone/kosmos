import type { HTMLAttributes } from 'react';

export type BadgeVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'outline'
    | 'ghost';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
}

const baseStyles =
    'inline-flex items-center justify-center rounded-full font-medium ' +
    'whitespace-nowrap transition-colors';

const variantStyles: Record<BadgeVariant, string> = {
    primary:
        'bg-primary text-primary-foreground',

    secondary:
        'bg-secondary text-secondary-foreground',

    success:
        'bg-success text-success-foreground',

    warning:
        'bg-warning text-warning-foreground',

    destructive:
        'bg-destructive text-destructive-foreground',

    outline:
        'border border-border bg-background text-foreground',

    ghost:
        'bg-transparent text-foreground',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-2.5 text-xs',
    lg: 'h-7 px-3 text-sm',
};

export function Badge({
    variant = 'primary',
    size = 'md',
    className,
    ...props
}: BadgeProps) {
    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <span className={classes} {...props} />;
}
