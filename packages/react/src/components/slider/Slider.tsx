import {
    type InputHTMLAttributes,
    useId,
    useState,
} from 'react';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'type' | 'size' | 'value' | 'defaultValue' | 'onChange'
    > {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    size?: SliderSize;
    error?: boolean;
    /** Renders the current value beside the track. */
    showValue?: boolean;
    formatValue?: (value: number) => string;
    label?: string;
}

const trackHeights: Record<SliderSize, string> = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
};

const thumbSizes: Record<SliderSize, string> = {
    sm: '[&::-webkit-slider-thumb]:size-3 [&::-moz-range-thumb]:size-3',
    md: '[&::-webkit-slider-thumb]:size-4 [&::-moz-range-thumb]:size-4',
    lg: '[&::-webkit-slider-thumb]:size-5 [&::-moz-range-thumb]:size-5',
};

/**
 * Built on `<input type="range">` so keyboard, touch and assistive-technology
 * behaviour come from the platform. Only the painted parts are restyled: the
 * filled portion of the track is a background gradient driven by the current
 * value, since no cross-browser pseudo-element exposes it.
 */
const baseStyles =
    'w-full cursor-pointer appearance-none rounded-full bg-transparent ' +
    'outline-none disabled:cursor-not-allowed disabled:opacity-50 ' +
    '[&::-webkit-slider-runnable-track]:rounded-full ' +
    '[&::-moz-range-track]:rounded-full ' +
    '[&::-webkit-slider-thumb]:appearance-none ' +
    '[&::-webkit-slider-thumb]:rounded-full ' +
    '[&::-webkit-slider-thumb]:bg-background ' +
    '[&::-webkit-slider-thumb]:border-2 ' +
    '[&::-moz-range-thumb]:rounded-full ' +
    '[&::-moz-range-thumb]:bg-background ' +
    '[&::-moz-range-thumb]:border-2 ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function Slider({
    value: controlledValue,
    defaultValue = 0,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    error = false,
    showValue = false,
    formatValue = String,
    label,
    className,
    disabled,
    ...props
}: SliderProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const labelId = useId();

    const value = controlledValue ?? uncontrolledValue;

    const percent =
        max === min ? 0 : ((value - min) / (max - min)) * 100;

    const setValue = (nextValue: number) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const accent = error ? 'var(--kosmos-color-destructive)' : 'var(--kosmos-color-primary)';

    const classes = [
        baseStyles,
        trackHeights[size],
        thumbSizes[size],
        error
            ? '[&::-webkit-slider-thumb]:border-destructive [&::-moz-range-thumb]:border-destructive'
            : '[&::-webkit-slider-thumb]:border-primary [&::-moz-range-thumb]:border-primary',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="flex w-full items-center gap-3">
            {label ? (
                <span id={labelId} className="sr-only">
                    {label}
                </span>
            ) : null}

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                disabled={disabled}
                aria-labelledby={label ? labelId : undefined}
                aria-invalid={error || undefined}
                className={classes}
                style={{
                    background: `linear-gradient(to right, ${accent} ${percent}%, var(--kosmos-color-input) ${percent}%)`,
                }}
                onChange={(event) => setValue(Number(event.target.value))}
                {...props}
            />

            {showValue ? (
                <output className="w-12 shrink-0 text-right text-sm tabular-nums text-foreground">
                    {formatValue(value)}
                </output>
            ) : null}
        </div>
    );
}
