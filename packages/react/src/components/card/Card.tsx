import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

export interface CardDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const cardStyles =
    'rounded-lg border border-border bg-surface text-foreground shadow-sm';

const headerStyles = 'flex flex-col gap-1.5 p-6';

const titleStyles = 'text-lg font-semibold leading-none tracking-tight';

const descriptionStyles = 'text-sm text-muted-foreground';

const contentStyles = 'p-6 pt-0';

const footerStyles = 'flex items-center p-6 pt-0';

export function Card({ className, ...props }: CardProps) {
    const classes = [cardStyles, className].filter(Boolean).join(' ');

    return <div className={classes} {...props} />;
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
    const classes = [headerStyles, className].filter(Boolean).join(' ');

    return <div className={classes} {...props} />;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
    const classes = [titleStyles, className].filter(Boolean).join(' ');

    return <h3 className={classes} {...props} />;
}

export function CardDescription({
    className,
    ...props
}: CardDescriptionProps) {
    const classes = [descriptionStyles, className].filter(Boolean).join(' ');

    return <p className={classes} {...props} />;
}

export function CardContent({ className, ...props }: CardContentProps) {
    const classes = [contentStyles, className].filter(Boolean).join(' ');

    return <div className={classes} {...props} />;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
    const classes = [footerStyles, className].filter(Boolean).join(' ');

    return <div className={classes} {...props} />;
}
