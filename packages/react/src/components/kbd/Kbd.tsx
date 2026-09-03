import { Fragment, type HTMLAttributes } from 'react';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
    size?: KbdSize;
    /** Renders each key separately, joined by a separator. */
    keys?: string[];
    separator?: string;
}

const sizeStyles: Record<KbdSize, string> = {
    sm: 'h-5 min-w-5 px-1 text-[0.6875rem]',
    md: 'h-6 min-w-6 px-1.5 text-xs',
};

const keyStyles =
    'inline-flex items-center justify-center rounded border border-border ' +
    'border-b-2 bg-muted font-mono font-medium text-foreground';

export function Kbd({
    size = 'md',
    keys,
    separator = '+',
    className,
    children,
    ...props
}: KbdProps) {
    const classes = [keyStyles, sizeStyles[size], className]
        .filter(Boolean)
        .join(' ');

    if (!keys) {
        return (
            <kbd className={classes} {...props}>
                {children}
            </kbd>
        );
    }

    // Each key is its own <kbd>, wrapped in one outer <kbd> — the markup a
    // key combination is meant to have.
    return (
        <kbd
            className={['inline-flex items-center gap-1', className]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {keys.map((key, index) => (
                <Fragment key={key}>
                    {index > 0 ? (
                        <span
                            aria-hidden="true"
                            className="text-xs text-muted-foreground"
                        >
                            {separator}
                        </span>
                    ) : null}

                    <kbd className={[keyStyles, sizeStyles[size]].join(' ')}>
                        {key}
                    </kbd>
                </Fragment>
            ))}
        </kbd>
    );
}
