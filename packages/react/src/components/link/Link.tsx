import type { AnchorHTMLAttributes } from 'react';
import { IoOpenOutline } from 'react-icons/io5';

export type LinkVariant = 'default' | 'subtle' | 'muted';
export type LinkUnderline = 'always' | 'hover' | 'none';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: LinkVariant;
    underline?: LinkUnderline;
    /** Opens in a new tab, with the safe `rel` and a visible indicator. */
    external?: boolean;
}

const variantStyles: Record<LinkVariant, string> = {
    default: 'text-primary hover:text-primary/80',
    subtle: 'text-foreground hover:text-primary',
    muted: 'text-muted-foreground hover:text-foreground',
};

const underlineStyles: Record<LinkUnderline, string> = {
    always: 'underline underline-offset-2',
    hover: 'no-underline hover:underline hover:underline-offset-2',
    none: 'no-underline',
};

export function Link({
    variant = 'default',
    underline = 'hover',
    external = false,
    className,
    target,
    rel,
    children,
    ...props
}: LinkProps) {
    const classes = [
        'cursor-pointer rounded-sm outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring',
        variantStyles[variant],
        underlineStyles[underline],
        external && 'inline-flex items-center gap-1',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <a
            className={classes}
            target={target ?? (external ? '_blank' : undefined)}
            // noopener closes the reverse-tabnabbing hole a bare _blank opens.
            rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
            {...props}
        >
            {children}

            {external ? (
                <>
                    <IoOpenOutline
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                </>
            ) : null}
        </a>
    );
}
