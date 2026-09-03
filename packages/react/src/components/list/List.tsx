import type { HTMLAttributes, LiHTMLAttributes } from 'react';

export type ListVariant = 'bulleted' | 'numbered' | 'plain';
export type ListSpacing = 'tight' | 'normal' | 'loose';

export interface ListProps extends HTMLAttributes<HTMLElement> {
    variant?: ListVariant;
    spacing?: ListSpacing;
    /** Nested lists inherit their parent's marker unless told otherwise. */
    marker?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha';
}

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> { }

const spacingStyles: Record<ListSpacing, string> = {
    tight: 'space-y-0.5',
    normal: 'space-y-1.5',
    loose: 'space-y-3',
};

const markerStyles = {
    disc: 'list-disc',
    circle: 'list-[circle]',
    square: 'list-[square]',
    decimal: 'list-decimal',
    'lower-alpha': 'list-[lower-alpha]',
};

const defaultMarkers: Record<ListVariant, keyof typeof markerStyles | null> = {
    bulleted: 'disc',
    numbered: 'decimal',
    plain: null,
};

export function List({
    variant = 'bulleted',
    spacing = 'normal',
    marker,
    className,
    ...props
}: ListProps) {
    const resolved = marker ?? defaultMarkers[variant];

    const classes = [
        'text-body text-foreground',
        spacingStyles[spacing],
        resolved ? `${markerStyles[resolved]} pl-5` : 'list-none',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const Component = variant === 'numbered' ? 'ol' : 'ul';

    return <Component className={classes} {...props} />;
}

export function ListItem({ className, ...props }: ListItemProps) {
    const classes = ['pl-1 marker:text-muted-foreground', className]
        .filter(Boolean)
        .join(' ');

    return <li className={classes} {...props} />;
}
