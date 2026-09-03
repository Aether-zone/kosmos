import type { HTMLAttributes, ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

export type ChipVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'destructive';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: ChipVariant;
    size?: ChipSize;
    icon?: ReactNode;
    /** Renders a remove button. Omit for a static chip. */
    onRemove?: () => void;
    removeLabel?: string;
    disabled?: boolean;
}

const baseStyles =
    'inline-flex max-w-full items-center gap-1.5 rounded-full border ' +
    'font-medium transition-colors';

const variantStyles: Record<ChipVariant, string> = {
    default: 'border-border bg-secondary text-secondary-foreground',
    primary: 'border-primary/30 bg-primary/10 text-foreground',
    success: 'border-success/30 bg-success/10 text-foreground',
    warning: 'border-warning/30 bg-warning/10 text-foreground',
    destructive: 'border-destructive/30 bg-destructive/10 text-foreground',
};

const sizeStyles: Record<ChipSize, string> = {
    sm: 'h-6 pl-2 pr-1 text-xs',
    md: 'h-7 pl-2.5 pr-1 text-xs',
    lg: 'h-8 pl-3 pr-1.5 text-sm',
};

/** Padding on the trailing side comes from the button when one is present. */
const staticPadding: Record<ChipSize, string> = {
    sm: 'pr-2',
    md: 'pr-2.5',
    lg: 'pr-3',
};

const iconSizes: Record<ChipSize, string> = {
    sm: 'size-3',
    md: 'size-3.5',
    lg: 'size-4',
};

export function Chip({
    variant = 'default',
    size = 'md',
    icon,
    onRemove,
    removeLabel,
    disabled = false,
    className,
    children,
    ...props
}: ChipProps) {
    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        !onRemove && staticPadding[size],
        disabled && 'opacity-50',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes} {...props}>
            {icon ? (
                <span
                    aria-hidden="true"
                    className={['shrink-0', iconSizes[size]].join(' ')}
                >
                    {icon}
                </span>
            ) : null}

            <span className="min-w-0 truncate">{children}</span>

            {onRemove ? (
                <button
                    type="button"
                    // Falls back to naming the chip's own text, so a screen
                    // reader hears which chip is being removed.
                    aria-label={
                        removeLabel ??
                        `Remove${typeof children === 'string' ? ` ${children}` : ''}`
                    }
                    disabled={disabled}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 text-current opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
                    onClick={onRemove}
                >
                    <IoClose className={iconSizes[size]} />
                </button>
            ) : null}
        </span>
    );
}
