import type { TextareaHTMLAttributes } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    size?: TextareaSize;
    error?: boolean;
}

const baseStyles =
    'flex w-full resize-y rounded-md border bg-background text-foreground ' +
    'placeholder:text-muted-foreground transition-colors ' +
    'outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<TextareaSize, string> = {
    sm: 'min-h-20 px-3 py-2 text-sm',
    md: 'min-h-24 px-3 py-2 text-sm',
    lg: 'min-h-32 px-4 py-3 text-base',
};

const stateStyles = {
    default: 'border-input',
    error:
        'border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
};

export function Textarea({
    size = 'md',
    error = false,
    className,
    ...props
}: TextareaProps) {
    const classes = [
        baseStyles,
        sizeStyles[size],
        stateStyles[error ? 'error' : 'default'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <textarea className={classes} {...props} />;
}
