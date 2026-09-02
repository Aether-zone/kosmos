import type { HTMLAttributes } from 'react';

export type AlertVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
}

export interface AlertTitleProps
    extends HTMLAttributes<HTMLHeadingElement> { }

export interface AlertDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }

const baseStyles =
    'relative w-full rounded-lg border p-4';

/**
 * The `*-foreground` tokens are the colors that sit on a *solid* fill, so
 * `success-foreground` is white. On a 10% tint the text has to stay
 * `foreground`; the variant reads through its border and background instead.
 */
const variantStyles: Record<AlertVariant, string> = {
    default:
        'border-border bg-surface text-foreground',

    success:
        'border-success/30 bg-success/10 text-foreground',

    warning:
        'border-warning/30 bg-warning/10 text-foreground',

    destructive:
        'border-destructive/30 bg-destructive/10 text-foreground',
};

const titleStyles =
    'mb-1 font-medium leading-none tracking-tight';

const descriptionStyles =
    'text-sm text-muted-foreground';

export function Alert({
    variant = 'default',
    className,
    ...props
}: AlertProps) {
    const classes = [
        baseStyles,
        variantStyles[variant],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div role="alert" className={classes} {...props} />;
}

export function AlertTitle({
    className,
    ...props
}: AlertTitleProps) {
    const classes = [titleStyles, className]
        .filter(Boolean)
        .join(' ');

    return <h5 className={classes} {...props} />;
}

export function AlertDescription({
    className,
    ...props
}: AlertDescriptionProps) {
    const classes = [descriptionStyles, className]
        .filter(Boolean)
        .join(' ');

    return <p className={classes} {...props} />;
}
