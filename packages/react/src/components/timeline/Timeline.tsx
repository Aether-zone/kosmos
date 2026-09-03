import type { HTMLAttributes, ReactNode } from 'react';

export type TimelineItemTone =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive';

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> { }

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
    tone?: TimelineItemTone;
    /** Replaces the default dot. */
    icon?: ReactNode;
    /** Hollow dot, for a step not yet reached. */
    pending?: boolean;
}

export interface TimelineHeaderProps
    extends HTMLAttributes<HTMLDivElement> { }

export interface TimelineTitleProps
    extends HTMLAttributes<HTMLHeadingElement> { }

export interface TimelineTimeProps extends HTMLAttributes<HTMLTimeElement> {
    dateTime?: string;
}

export interface TimelineDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }

export function Timeline({ className, ...props }: TimelineProps) {
    const classes = ['flex flex-col', className].filter(Boolean).join(' ');

    return <ol className={classes} {...props} />;
}

const toneStyles: Record<TimelineItemTone, string> = {
    default: 'border-border bg-muted',
    primary: 'border-primary bg-primary',
    success: 'border-success bg-success',
    warning: 'border-warning bg-warning',
    destructive: 'border-destructive bg-destructive',
};

export function TimelineItem({
    tone = 'default',
    icon,
    pending = false,
    className,
    children,
    ...props
}: TimelineItemProps) {
    const classes = [
        // The connector is drawn as a left border on the content column and
        // removed on the last item, so it never overruns the final marker.
        'relative flex gap-4 pb-6 last:pb-0',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <li className={classes} {...props}>
            <div className="flex flex-col items-center">
                <span
                    aria-hidden="true"
                    className={[
                        'z-10 flex size-3 shrink-0 items-center justify-center rounded-full border-2',
                        icon ? 'size-7 bg-surface' : '',
                        pending ? 'border-border bg-surface' : toneStyles[tone],
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {icon ? (
                        <span className="size-3.5 text-muted-foreground">
                            {icon}
                        </span>
                    ) : null}
                </span>

                <span
                    aria-hidden="true"
                    className="w-px flex-1 bg-border [li:last-child_&]:hidden"
                />
            </div>

            <div className="min-w-0 flex-1 pb-1">{children}</div>
        </li>
    );
}

export function TimelineHeader({
    className,
    ...props
}: TimelineHeaderProps) {
    const classes = [
        'flex flex-wrap items-baseline justify-between gap-2',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function TimelineTitle({ className, ...props }: TimelineTitleProps) {
    const classes = ['text-sm font-medium text-foreground', className]
        .filter(Boolean)
        .join(' ');

    return <h3 className={classes} {...props} />;
}

export function TimelineTime({ className, ...props }: TimelineTimeProps) {
    const classes = ['text-xs tabular-nums text-muted-foreground', className]
        .filter(Boolean)
        .join(' ');

    return <time className={classes} {...props} />;
}

export function TimelineDescription({
    className,
    ...props
}: TimelineDescriptionProps) {
    const classes = ['mt-1 text-sm text-muted-foreground', className]
        .filter(Boolean)
        .join(' ');

    return <p className={classes} {...props} />;
}
