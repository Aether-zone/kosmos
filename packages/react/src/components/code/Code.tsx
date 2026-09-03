import type { HTMLAttributes } from 'react';

export type CodeVariant = 'default' | 'subtle';

export interface CodeProps extends HTMLAttributes<HTMLElement> {
    variant?: CodeVariant;
    /** Render as a standalone block rather than inline. */
    block?: boolean;
}

const variantStyles: Record<CodeVariant, string> = {
    default: 'bg-muted text-foreground',
    subtle: 'bg-transparent text-muted-foreground',
};

export function Code({
    variant = 'default',
    block = false,
    className,
    children,
    ...props
}: CodeProps) {
    const classes = [
        'font-mono text-body-small',
        variantStyles[variant],
        block
            ? 'block w-full overflow-x-auto rounded-md border border-border p-4'
            : 'rounded-sm px-1.5 py-0.5',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // A block renders inside <pre> so whitespace and line breaks survive.
    if (block) {
        return (
            <pre className={classes} {...props}>
                <code>{children}</code>
            </pre>
        );
    }

    return (
        <code className={classes} {...props}>
            {children}
        </code>
    );
}
