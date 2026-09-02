import type { HTMLAttributes } from 'react';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps
    extends HTMLAttributes<HTMLDivElement> {
    orientation?: SeparatorOrientation;
}

const orientationStyles: Record<SeparatorOrientation, string> = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px',
};

export function Separator({
    orientation = 'horizontal',
    className,
    ...props
}: SeparatorProps) {
    const classes = [
        'shrink-0 bg-border',
        orientationStyles[orientation],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="separator"
            aria-orientation={orientation}
            className={classes}
            {...props}
        />
    );
}
