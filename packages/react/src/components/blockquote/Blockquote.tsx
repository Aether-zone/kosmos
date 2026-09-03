import type { BlockquoteHTMLAttributes, ReactNode } from 'react';

export interface BlockquoteProps
    extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
    /** Attribution, rendered in a <figcaption> beneath the quote. */
    cite?: string;
    author?: ReactNode;
}

export function Blockquote({
    cite,
    author,
    className,
    children,
    ...props
}: BlockquoteProps) {
    const quote = (
        <blockquote
            cite={cite}
            className={[
                'border-l-2 border-border pl-4 text-body italic text-foreground',
                !author && className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {children}
        </blockquote>
    );

    if (!author) {
        return quote;
    }

    // An attributed quote is a figure: the attribution is not part of what
    // was said, so it belongs outside the <blockquote>.
    return (
        <figure className={className}>
            {quote}

            <figcaption className="mt-2 pl-4 text-body-small text-muted-foreground">
                — {author}
            </figcaption>
        </figure>
    );
}
