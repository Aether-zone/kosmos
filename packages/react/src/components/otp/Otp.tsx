import {
    type ClipboardEvent,
    type HTMLAttributes,
    type KeyboardEvent,
    useId,
    useRef,
    useState,
} from 'react';

export type OtpSize = 'sm' | 'md' | 'lg';

export interface OtpProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    length?: number;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Fired once the last slot is filled. */
    onComplete?: (value: string) => void;
    size?: OtpSize;
    error?: boolean;
    disabled?: boolean;
    label?: string;
    name?: string;
    /** `numeric` also switches the on-screen keyboard to digits. */
    type?: 'numeric' | 'alphanumeric';
}

const slotStyles =
    'flex items-center justify-center rounded-md border bg-background ' +
    'text-center font-medium text-foreground transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<OtpSize, string> = {
    sm: 'size-9 text-sm',
    md: 'size-11 text-base',
    lg: 'size-14 text-lg',
};

const PATTERNS = {
    numeric: /[^0-9]/g,
    alphanumeric: /[^a-zA-Z0-9]/g,
};

export function Otp({
    length = 6,
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    onComplete,
    size = 'md',
    error = false,
    disabled = false,
    label = 'Verification code',
    name,
    type = 'numeric',
    className,
    ...props
}: OtpProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const groupId = useId();

    const value = (controlledValue ?? uncontrolledValue).slice(0, length);

    // `commit` is followed synchronously by a focus move, before React has
    // re-rendered, so handlers that run in between would otherwise read the
    // previous value out of the render closure.
    const valueRef = useRef(value);
    valueRef.current = value;

    const sanitize = (input: string) =>
        input.replace(PATTERNS[type], '').slice(0, length);

    const commit = (nextValue: string) => {
        valueRef.current = nextValue;

        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);

        if (nextValue.length === length) {
            onComplete?.(nextValue);
        }
    };

    const focusSlot = (index: number) => {
        const clamped = Math.max(0, Math.min(index, length - 1));

        inputsRef.current[clamped]?.focus();
        inputsRef.current[clamped]?.select();
    };

    /**
     * The code is held as one contiguous string, so slots always fill from
     * the left. Clearing a slot removes that character and pulls the rest
     * back rather than leaving a hole the string cannot represent.
     */
    const setCharAt = (index: number, char: string) => {
        const chars = value.split('');

        if (char) {
            chars[Math.min(index, chars.length)] = char;
        } else {
            chars.splice(index, 1);
        }

        return chars.join('').slice(0, length);
    };

    const handleChange = (index: number, raw: string) => {
        const chars = sanitize(raw);

        if (!chars) {
            return;
        }

        // Typing over a slot with several characters (autofill, or a fast
        // paste into one box) should spread across the remaining slots.
        if (chars.length > 1) {
            const next = (value.slice(0, index) + chars).slice(0, length);

            commit(next);
            focusSlot(next.length);

            return;
        }

        const next = setCharAt(index, chars);

        commit(next);
        focusSlot(index + 1);
    };

    const handleKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Backspace') {
            event.preventDefault();

            if (value[index]) {
                commit(setCharAt(index, ''));
                return;
            }

            commit(setCharAt(index - 1, ''));
            focusSlot(index - 1);

            return;
        }

        const move = {
            ArrowLeft: index - 1,
            ArrowRight: index + 1,
            Home: 0,
            End: length - 1,
        }[event.key];

        if (move !== undefined) {
            event.preventDefault();
            focusSlot(move);
        }
    };

    const handlePaste = (
        index: number,
        event: ClipboardEvent<HTMLInputElement>,
    ) => {
        event.preventDefault();

        const pasted = sanitize(event.clipboardData.getData('text'));

        if (!pasted) {
            return;
        }

        const next = (value.slice(0, index) + pasted).slice(0, length);

        commit(next);
        focusSlot(next.length);
    };

    const classes = ['flex items-center gap-2', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="group"
            aria-labelledby={groupId}
            className={classes}
            {...props}
        >
            <span id={groupId} className="sr-only">
                {label}
            </span>

            {name ? <input type="hidden" name={name} value={value} /> : null}

            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputsRef.current[index] = element;
                    }}
                    type="text"
                    inputMode={type === 'numeric' ? 'numeric' : 'text'}
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={`${label}, digit ${index + 1} of ${length}`}
                    disabled={disabled}
                    value={value[index] ?? ''}
                    className={[
                        slotStyles,
                        sizeStyles[size],
                        error
                            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
                            : 'border-input',
                    ].join(' ')}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={(event) => handlePaste(index, event)}
                    onFocus={(event) => {
                        // Clicking past the end would strand the caret in a
                        // slot that cannot be filled yet.
                        if (index > valueRef.current.length) {
                            focusSlot(valueRef.current.length);
                            return;
                        }

                        event.target.select();
                    }}
                />
            ))}
        </div>
    );
}
