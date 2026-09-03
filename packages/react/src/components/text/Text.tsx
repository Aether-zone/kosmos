import type { ElementType, HTMLAttributes } from 'react';

export type TextSize = 'body' | 'body-small' | 'label';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextTone =
    | 'default'
    | 'muted'
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive';
export type TextAlign = 'start' | 'center' | 'end';

export interface TextProps extends HTMLAttributes<HTMLElement> {
    /** Element to render. Defaults to `p`. */
    as?: Extract<ElementType, 'p' | 'span' | 'div' | 'small' | 'strong' | 'em'>;
    size?: TextSize;
    weight?: TextWeight;
    tone?: TextTone;
    align?: TextAlign;
    /** Truncate to a single line with an ellipsis. */
    truncate?: boolean;
    /** Clamp to a number of lines. Overrides `truncate`. */
    lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
    italic?: boolean;
}

/** Semantic type sizes, so components never reach for the raw scale. */
const sizeStyles: Record<TextSize, string> = {
    body: 'text-body',
    'body-small': 'text-body-small',
    label: 'text-label',
};

const weightStyles: Record<TextWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
};

export const toneStyles: Record<TextTone, string> = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
};

const alignStyles: Record<TextAlign, string> = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right',
};

/**
 * Tailwind generates only the classes it can see in source, so a clamp count
 * has to resolve to a literal class rather than being interpolated.
 */
const clampStyles: Record<NonNullable<TextProps['lineClamp']>, string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
};

export function Text({
    as: Component = 'p',
    size = 'body',
    weight = 'normal',
    tone = 'default',
    align,
    truncate = false,
    lineClamp,
    italic = false,
    className,
    ...props
}: TextProps) {
    const classes = [
        sizeStyles[size],
        weightStyles[weight],
        toneStyles[tone],
        align && alignStyles[align],
        lineClamp ? clampStyles[lineClamp] : truncate && 'truncate',
        italic && 'italic',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <Component className={classes} {...props} />;
}
