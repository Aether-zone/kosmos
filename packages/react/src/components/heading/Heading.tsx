import type { HTMLAttributes } from 'react';

import { toneStyles, type TextTone } from '../text';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize =
    | 'display'
    | 'heading-large'
    | 'heading'
    | 'heading-small';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    /** Document level. Drives the tag, and the size unless one is given. */
    level?: HeadingLevel;
    /** Visual size, decoupled from level so the outline stays correct. */
    size?: HeadingSize;
    tone?: TextTone;
    truncate?: boolean;
}

const sizeStyles: Record<HeadingSize, string> = {
    display: 'text-display',
    'heading-large': 'text-heading-large',
    heading: 'text-heading',
    'heading-small': 'text-heading-small',
};

/**
 * A sensible visual size per level. Overriding `size` lets a page keep a
 * correct heading outline without being forced into a matching type scale —
 * an h2 can look small, and an h3 can look large.
 */
const levelSizes: Record<HeadingLevel, HeadingSize> = {
    1: 'display',
    2: 'heading-large',
    3: 'heading',
    4: 'heading-small',
    5: 'heading-small',
    6: 'heading-small',
};

export function Heading({
    level = 2,
    size,
    tone = 'default',
    truncate = false,
    className,
    ...props
}: HeadingProps) {
    const Component = `h${level}` as 'h1';

    const classes = [
        sizeStyles[size ?? levelSizes[level]],
        'font-semibold leading-tight tracking-tight',
        toneStyles[tone],
        truncate && 'truncate',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <Component className={classes} {...props} />;
}
