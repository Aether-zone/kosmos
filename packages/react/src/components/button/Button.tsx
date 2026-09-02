import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors ' +
    'cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-primary-foreground hover:bg-primary/90',

    secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',

    outline:
        'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',

    ghost:
        'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',

    destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    ...props
}: ButtonProps) {
    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <button className={classes} {...props} />;
}