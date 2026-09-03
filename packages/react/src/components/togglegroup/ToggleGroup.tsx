import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useContext,
    useState,
} from 'react';

export type ToggleGroupSize = 'sm' | 'md' | 'lg';
export type ToggleGroupVariant = 'segmented' | 'outline';

export interface ToggleGroupProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    type?: 'single' | 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    /** In `single` mode, allow deselecting the active item. */
    collapsible?: boolean;
    size?: ToggleGroupSize;
    variant?: ToggleGroupVariant;
    disabled?: boolean;
    label?: string;
}

export interface ToggleGroupItemProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    icon?: ReactNode;
}

interface ToggleGroupContextValue {
    value: string[];
    toggle: (value: string) => void;
    size: ToggleGroupSize;
    variant: ToggleGroupVariant;
    disabled: boolean;
    multiple: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup() {
    const context = useContext(ToggleGroupContext);

    if (!context) {
        throw new Error('ToggleGroupItem must be used inside a ToggleGroup.');
    }

    return context;
}

const groupVariants: Record<ToggleGroupVariant, string> = {
    segmented: 'gap-1 rounded-md bg-muted p-1',
    outline: 'gap-0 rounded-md border border-border [&>*+*]:border-l',
};

export function ToggleGroup({
    type = 'single',
    value: controlledValue,
    defaultValue = [],
    onValueChange,
    collapsible = true,
    size = 'md',
    variant = 'segmented',
    disabled = false,
    label,
    className,
    onKeyDown,
    children,
    ...props
}: ToggleGroupProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

    const value = controlledValue ?? uncontrolledValue;
    const multiple = type === 'multiple';

    const toggle = (next: string) => {
        const isOn = value.includes(next);

        let result: string[];

        if (multiple) {
            result = isOn
                ? value.filter((entry) => entry !== next)
                : [...value, next];
        } else if (isOn) {
            result = collapsible ? [] : value;
        } else {
            result = [next];
        }

        if (controlledValue === undefined) {
            setUncontrolledValue(result);
        }

        onValueChange?.(result);
    };

    /** Arrow keys move between items, as a toolbar-style group expects. */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const items = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                'button:not(:disabled)',
            ),
        ];

        const current = items.indexOf(
            document.activeElement as HTMLButtonElement,
        );

        if (current === -1) {
            return;
        }

        const next = {
            ArrowRight: (current + 1) % items.length,
            ArrowLeft: (current - 1 + items.length) % items.length,
            Home: 0,
            End: items.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        items[next].focus();
    };

    const classes = [
        'inline-flex items-center overflow-hidden',
        groupVariants[variant],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ToggleGroupContext.Provider
            value={{ value, toggle, size, variant, disabled, multiple }}
        >
            <div
                // A single-choice group is a radiogroup; a multi-choice one is
                // a set of independent toggle buttons.
                role={multiple ? 'group' : 'radiogroup'}
                aria-label={label}
                className={classes}
                onKeyDown={handleKeyDown}
                {...props}
            >
                {children}
            </div>
        </ToggleGroupContext.Provider>
    );
}

const sizeStyles: Record<ToggleGroupSize, string> = {
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
    lg: 'h-10 px-4 text-sm',
};

const itemVariants: Record<ToggleGroupVariant, { on: string; off: string }> = {
    segmented: {
        on: 'rounded-sm bg-background text-foreground shadow-sm',
        off: 'rounded-sm text-muted-foreground hover:text-foreground',
    },
    outline: {
        on: 'border-border bg-accent text-accent-foreground',
        off: 'border-border text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground',
    },
};

export function ToggleGroupItem({
    value: itemValue,
    icon,
    className,
    disabled,
    onClick,
    children,
    ...props
}: ToggleGroupItemProps) {
    const group = useToggleGroup();

    const active = group.value.includes(itemValue);
    const isDisabled = disabled ?? group.disabled;

    const classes = [
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
        'font-medium outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeStyles[group.size],
        active
            ? itemVariants[group.variant].on
            : itemVariants[group.variant].off,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            // Multi-choice items are toggle buttons; single-choice items are
            // radios, and the roles differ accordingly.
            role={group.multiple ? undefined : 'radio'}
            aria-pressed={group.multiple ? active : undefined}
            aria-checked={group.multiple ? undefined : active}
            disabled={isDisabled}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                group.toggle(itemValue);
            }}
            {...props}
        >
            {icon ? (
                <span aria-hidden="true" className="size-4 shrink-0">
                    {icon}
                </span>
            ) : null}

            {children}
        </button>
    );
}
