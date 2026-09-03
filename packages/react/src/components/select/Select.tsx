import type { SelectHTMLAttributes } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: SelectSize;
    error?: boolean;
}

const baseStyles =
    'flex w-full appearance-none rounded-md border bg-background text-foreground ' +
    'transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<SelectSize, string> = {
    sm: 'h-8 px-3 pr-8 text-sm',
    md: 'h-10 px-3 pr-8 text-sm',
    lg: 'h-12 px-4 pr-10 text-base',
};

export function Select({
    size = 'md',
    error = false,
    className,
    children,
    ...props
}: SelectProps) {
    const classes = [
        baseStyles,
        sizeStyles[size],
        error
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
            : 'border-input',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <select className={classes} {...props}>
            {children}
        </select>
    );
}
