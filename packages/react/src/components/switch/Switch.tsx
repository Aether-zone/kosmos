import type { InputHTMLAttributes } from 'react';

export interface SwitchProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    error?: boolean;
}

/**
 * The checkbox itself is the track: `appearance-none` strips the native
 * widget so the track styles are visible, and `peer` lets the thumb — a
 * later sibling — react to `:checked` and `:disabled`.
 */
const trackStyles =
    'peer relative h-6 w-11 shrink-0 cursor-pointer appearance-none ' +
    'rounded-full border-2 bg-input transition-colors ' +
    'outline-none ' +
    'checked:bg-primary ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const thumbStyles =
    'pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full ' +
    'bg-background shadow-sm ring-0 transition-transform ' +
    'peer-checked:translate-x-5';

export function Switch({
    error = false,
    className,
    ...props
}: SwitchProps) {
    const classes = [
        trackStyles,
        // The border colour lives here rather than in the base styles:
        // competing `border-*` utilities resolve by stylesheet order, not by
        // their order in this string, so a base colour would win.
        error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-transparent',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className="relative inline-flex">
            <input
                type="checkbox"
                role="switch"
                className={classes}
                {...props}
            />
            <span
                aria-hidden="true"
                className={thumbStyles}
            />
        </span>
    );
}
