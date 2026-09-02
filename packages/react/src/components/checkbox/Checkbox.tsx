import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    error?: boolean;
}

const baseStyles =
    'peer size-4 shrink-0 appearance-none rounded-sm border bg-background ' +
    'transition-colors outline-none ' +
    'checked:bg-primary checked:border-primary ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    'checked:after:block ' +
    'after:hidden ' +
    'after:size-2.5 ' +
    'after:mx-auto after:mt-0.5 ' +
    'after:border-b-2 after:border-r-2 ' +
    'after:rotate-45 ' +
    'after:border-primary-foreground';

export function Checkbox({
    error = false,
    className,
    ...props
}: CheckboxProps) {
    const classes = [
        baseStyles,
        error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-input',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <input type="checkbox" className={classes} {...props} />;
}
