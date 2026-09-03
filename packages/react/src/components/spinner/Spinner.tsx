import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
    size?: SpinnerSize;
    /** Announced to assistive technology; pass null for a decorative spinner. */
    label?: string | null;
}

const sizeStyles: Record<SpinnerSize, string> = {
    xs: 'size-3 border',
    sm: 'size-4 border-2',
    md: 'size-5 border-2',
    lg: 'size-8 border-2',
    xl: 'size-12 border-4',
};

/**
 * A ring with one transparent edge, rotated. `currentColor` means the spinner
 * inherits the colour of whatever it sits in — inside a Button it picks up
 * the button's foreground without any variant plumbing.
 */
const baseStyles =
    'inline-block shrink-0 animate-spin rounded-full ' +
    'motion-reduce:[animation-duration:2.5s] ' +
    'border-current border-t-transparent';

export function Spinner({
    size = 'md',
    label = 'Loading',
    className,
    ...props
}: SpinnerProps) {
    const classes = [baseStyles, sizeStyles[size], className]
        .filter(Boolean)
        .join(' ');

    return (
        <span
            role={label ? 'status' : undefined}
            aria-label={label ?? undefined}
            aria-hidden={label ? undefined : true}
            className={classes}
            {...props}
        />
    );
}
