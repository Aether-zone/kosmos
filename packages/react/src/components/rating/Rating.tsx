import { type HTMLAttributes, useId, useState } from 'react';

import { useControllableState } from '../../hooks';
import { IoStar, IoStarOutline } from 'react-icons/io5';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    max?: number;
    size?: RatingSize;
    /** Display only: renders as an image, not a control. */
    readOnly?: boolean;
    disabled?: boolean;
    /** Allow clicking the active star again to clear the rating. */
    clearable?: boolean;
    label?: string;
    showValue?: boolean;
}

const sizeStyles: Record<RatingSize, string> = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-7',
};

export function Rating({
    value: controlledValue,
    defaultValue = 0,
    onValueChange,
    max = 5,
    size = 'md',
    readOnly = false,
    disabled = false,
    clearable = true,
    label = 'Rating',
    showValue = false,
    className,
    ...props
}: RatingProps) {
    const [value, setValue] = useControllableState({
        value: controlledValue,
        defaultValue,
        onChange: onValueChange,
    });
    const [hovered, setHovered] = useState<number | null>(null);
    const labelId = useId();

    const interactive = !readOnly && !disabled;

    // Hover previews the rating without committing it.
    const shown = hovered ?? value;

    const commit = (next: number) => {
        // Clicking the active star again clears the rating.
        setValue(clearable && next === value ? 0 : next);
    };

    const classes = ['inline-flex items-center gap-2', className]
        .filter(Boolean)
        .join(' ');

    const stars = Array.from({ length: max }, (_, index) => index + 1);

    return (
        <div className={classes} {...props}>
            <span id={labelId} className="sr-only">
                {label}
            </span>

            <div
                // Read-only ratings are content, not a control, so they are
                // announced as an image with a text alternative.
                role={interactive ? 'radiogroup' : 'img'}
                aria-labelledby={interactive ? labelId : undefined}
                aria-label={
                    interactive ? undefined : `${label}: ${value} of ${max}`
                }
                className={[
                    'flex items-center gap-0.5',
                    disabled && 'opacity-50',
                ]
                    .filter(Boolean)
                    .join(' ')}
                onMouseLeave={() => setHovered(null)}
            >
                {stars.map((star) => {
                    const filled = star <= shown;
                    const Icon = filled ? IoStar : IoStarOutline;

                    if (!interactive) {
                        return (
                            <Icon
                                key={star}
                                aria-hidden="true"
                                className={[
                                    sizeStyles[size],
                                    filled
                                        ? 'text-warning-emphasis'
                                        : 'text-muted-foreground',
                                ].join(' ')}
                            />
                        );
                    }

                    return (
                        <button
                            key={star}
                            type="button"
                            role="radio"
                            aria-checked={star === value}
                            aria-label={`${star} of ${max}`}
                            disabled={disabled}
                            className={[
                                'cursor-pointer rounded-sm outline-none transition-colors',
                                'focus-visible:ring-2 focus-visible:ring-ring',
                                filled
                                    ? 'text-warning-emphasis'
                                    : 'text-muted-foreground hover:text-warning-emphasis',
                            ].join(' ')}
                            onClick={() => commit(star)}
                            onMouseEnter={() => setHovered(star)}
                        >
                            <Icon className={sizeStyles[size]} />
                        </button>
                    );
                })}
            </div>

            {showValue ? (
                <span className="text-sm tabular-nums text-muted-foreground">
                    {value} / {max}
                </span>
            ) : null}
        </div>
    );
}
