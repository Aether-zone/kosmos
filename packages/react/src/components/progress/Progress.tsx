import type { HTMLAttributes, ReactNode } from 'react';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant =
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive';

export interface ProgressProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Omit for an indeterminate bar. */
    value?: number;
    max?: number;
    size?: ProgressSize;
    variant?: ProgressVariant;
    label?: ReactNode;
    showValue?: boolean;
    formatValue?: (percent: number) => string;
}

const trackSizes: Record<ProgressSize, string> = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

const barVariants: Record<ProgressVariant, string> = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
};

export function Progress({
    value,
    max = 100,
    size = 'md',
    variant = 'primary',
    label,
    showValue = false,
    formatValue = (percent) => `${Math.round(percent)}%`,
    className,
    ...props
}: ProgressProps) {
    const indeterminate = value === undefined;

    const percent = indeterminate
        ? 0
        : Math.min(100, Math.max(0, (value / max) * 100));

    const classes = ['w-full', className].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {label || showValue ? (
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    {label ? (
                        <span className="text-sm font-medium text-foreground">
                            {label}
                        </span>
                    ) : (
                        <span />
                    )}

                    {showValue && !indeterminate ? (
                        <span className="text-sm tabular-nums text-muted-foreground">
                            {formatValue(percent)}
                        </span>
                    ) : null}
                </div>
            ) : null}

            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                // An indeterminate bar reports no value, which is how
                // assistive technology is told the duration is unknown.
                aria-valuenow={indeterminate ? undefined : value}
                // A progressbar with no name is announced as nothing at all.
                aria-label={typeof label === 'string' ? label : 'Progress'}
                className={[
                    'w-full overflow-hidden rounded-full bg-muted',
                    trackSizes[size],
                ].join(' ')}
            >
                <div
                    className={[
                        'h-full rounded-full transition-[width] duration-300',
                        barVariants[variant],
                        indeterminate ? 'w-2/5 animate-pulse' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    style={indeterminate ? undefined : { width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
