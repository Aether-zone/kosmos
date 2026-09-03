import type { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { }

const baseStyles =
    'text-sm font-medium leading-none text-foreground ' +
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

export function Label({ className, ...props }: LabelProps) {
    const classes = [baseStyles, className].filter(Boolean).join(' ');

    return <label className={classes} {...props} />;
}
