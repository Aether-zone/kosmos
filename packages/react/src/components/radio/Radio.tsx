import {
    createContext,
    type HTMLAttributes,
    type InputHTMLAttributes,
    type ReactNode,
    useContext,
    useId,
    useState,
} from 'react';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    name?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: RadioGroupOrientation;
    disabled?: boolean;
    error?: boolean;
    label?: ReactNode;
}

export interface RadioProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
    value: string;
    /** Text beside the control; omit to render the input on its own. */
    label?: ReactNode;
    description?: ReactNode;
}

interface RadioGroupContextValue {
    name: string;
    value?: string;
    setValue: (value: string) => void;
    disabled: boolean;
    error: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
    const context = useContext(RadioGroupContext);

    if (!context) {
        throw new Error('Radio must be used inside a RadioGroup.');
    }

    return context;
}

const orientationStyles: Record<RadioGroupOrientation, string> = {
    vertical: 'flex-col gap-3',
    horizontal: 'flex-row flex-wrap gap-4',
};

export function RadioGroup({
    name,
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = 'vertical',
    disabled = false,
    error = false,
    label,
    className,
    children,
    ...props
}: RadioGroupProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const generatedName = useId();
    const labelId = useId();

    const value = controlledValue ?? uncontrolledValue;

    const setValue = (nextValue: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const classes = [
        'flex',
        orientationStyles[orientation],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <RadioGroupContext.Provider
            value={{
                name: name ?? generatedName,
                value,
                setValue,
                disabled,
                error,
            }}
        >
            {label ? (
                <span id={labelId} className="sr-only">
                    {label}
                </span>
            ) : null}

            <div
                role="radiogroup"
                aria-labelledby={label ? labelId : undefined}
                aria-orientation={orientation}
                className={classes}
                {...props}
            >
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
}

/**
 * The dot is an `::after` pseudo-element rather than a nested span, so the
 * whole control stays a single native input and keeps its built-in
 * roving-focus and arrow-key behaviour within the group.
 */
const inputStyles =
    'peer size-4 shrink-0 appearance-none rounded-full border bg-background ' +
    'transition-colors outline-none ' +
    'checked:border-primary ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    'after:hidden checked:after:block ' +
    'after:size-2 after:rounded-full after:bg-primary ' +
    'after:mx-auto after:my-auto after:mt-[3px]';

export function Radio({
    value,
    label,
    description,
    className,
    disabled,
    onChange,
    ...props
}: RadioProps) {
    const group = useRadioGroup();
    const inputId = useId();
    const descriptionId = useId();

    const isDisabled = disabled ?? group.disabled;

    const classes = [
        inputStyles,
        group.error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-input',
        !label && className,
    ]
        .filter(Boolean)
        .join(' ');

    const input = (
        <input
            id={inputId}
            type="radio"
            name={group.name}
            value={value}
            checked={group.value === value}
            disabled={isDisabled}
            aria-describedby={description ? descriptionId : undefined}
            className={classes}
            onChange={(event) => {
                onChange?.(event);
                group.setValue(value);
            }}
            {...props}
        />
    );

    if (!label) {
        return input;
    }

    return (
        <div
            className={['flex items-start gap-2', className]
                .filter(Boolean)
                .join(' ')}
        >
            {input}

            <div className="grid gap-1">
                <label
                    htmlFor={inputId}
                    className={[
                        'text-sm font-medium leading-none text-foreground',
                        isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer',
                    ].join(' ')}
                >
                    {label}
                </label>

                {description ? (
                    <p
                        id={descriptionId}
                        className="text-sm text-muted-foreground"
                    >
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
