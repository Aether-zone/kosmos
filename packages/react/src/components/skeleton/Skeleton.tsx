import type { HTMLAttributes } from 'react';

export interface SkeletonProps
    extends HTMLAttributes<HTMLDivElement> { }

const baseStyles =
    'animate-pulse rounded-md bg-muted';

export function Skeleton({
    className,
    ...props
}: SkeletonProps) {
    const classes = [baseStyles, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            aria-hidden="true"
            className={classes}
            {...props}
        />
    );
}
