import type { InputHTMLAttributes } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: InputSize;
    error?: boolean;
}

const baseStyles =
    'flex w-full rounded-md border bg-background text-foreground ' +
    'placeholder:text-muted-foreground transition-colors ' +
    'outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<InputSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
};

const stateStyles = {
    default: 'border-input',
    error:
        'border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
};

export function Input({
    size = 'md',
    error = false,
    className,
    ...props
}: InputProps) {
    const classes = [
        baseStyles,
        sizeStyles[size],
        stateStyles[error ? 'error' : 'default'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <input className={classes} {...props} />;
}