import {
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

import { OverlayPanel, useDismiss } from '../../internal';

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps
    extends Omit<
        HTMLAttributes<HTMLDivElement>,
        'onChange' | 'defaultValue'
    > {
    /** ISO `yyyy-mm-dd`. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    min?: string;
    max?: string;
    size?: DatePickerSize;
    error?: boolean;
    disabled?: boolean;
    placeholder?: string;
    name?: string;
    locale?: string;
}

const triggerStyles =
    'flex w-full items-center justify-between gap-2 rounded-md border ' +
    'bg-background text-left text-foreground transition-colors outline-none ' +
    'cursor-pointer ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<DatePickerSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
};

const pad = (n: number) => String(n).padStart(2, '0');

/** `yyyy-mm-dd` in local time — `toISOString` would shift across timezones. */
const toISO = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromISO = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
};

const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, months: number) =>
    new Date(date.getFullYear(), date.getMonth() + months, 1);

/** Six weeks from the Monday on or before the 1st, so the grid never reflows. */
function monthGrid(month: Date) {
    const first = startOfMonth(month);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(
        first.getFullYear(),
        first.getMonth(),
        1 - offset,
    );

    return Array.from({ length: 42 }, (_, index) =>
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
    );
}

export function DatePicker({
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    min,
    max,
    size = 'md',
    error = false,
    disabled = false,
    placeholder = 'Select a date',
    name,
    locale,
    className,
    ...props
}: DatePickerProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);

    const value = controlledValue ?? uncontrolledValue;
    const selected = fromISO(value);

    const [month, setMonth] = useState(() =>
        startOfMonth(selected ?? new Date()),
    );

    const dialogId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    // Reopening after the value changed should show the selected month.
    useEffect(() => {
        if (open && selected) {
            setMonth(startOfMonth(selected));
        }
    }, [open]);

    // The calendar is portalled, so "inside" spans two detached subtrees.
    useDismiss({
        enabled: open,
        refs: [rootRef, calendarRef],
        onDismiss: () => {
            setOpen(false);
            triggerRef.current?.focus();
        },
    });

    const formatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [locale],
    );

    const monthFormatter = useMemo(
        () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
        [locale],
    );

    const weekdays = useMemo(() => {
        const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });

        // 2024-01-01 was a Monday.
        return Array.from({ length: 7 }, (_, index) =>
            format.format(new Date(2024, 0, 1 + index)),
        );
    }, [locale]);

    const days = useMemo(() => monthGrid(month), [month]);

    const setValue = (nextValue: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const outOfRange = (date: Date) => {
        const iso = toISO(date);

        return Boolean((min && iso < min) || (max && iso > max));
    };

    const classes = [
        triggerStyles,
        sizeStyles[size],
        error
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
            : 'border-input',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const todayISO = toISO(new Date());

    return (
        <div ref={rootRef} className="w-full" {...props}>
            {name ? <input type="hidden" name={name} value={value} /> : null}

            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? dialogId : undefined}
                disabled={disabled}
                className={classes}
                onClick={() => setOpen(!open)}
            >
                <span className={selected ? '' : 'text-muted-foreground'}>
                    {selected ? formatter.format(selected) : placeholder}
                </span>

                <span aria-hidden="true" className="text-muted-foreground">
                    ▦
                </span>
            </button>

            <OverlayPanel
                anchorRef={rootRef}
                panelRef={calendarRef}
                open={open && !disabled}
                side="bottom"
                align="start"
                id={dialogId}
                role="dialog"
                aria-label="Choose a date"
                className="z-50 w-72 rounded-md border border-border bg-surface p-3 shadow-lg"
            >
                <div className="mb-2 flex items-center justify-between">
                    <CalendarNavButton
                        label="Previous month"
                        onClick={() => setMonth(addMonths(month, -1))}
                    >
                        ‹
                    </CalendarNavButton>

                    <div
                        aria-live="polite"
                        className="text-sm font-medium text-foreground"
                    >
                        {monthFormatter.format(month)}
                    </div>

                    <CalendarNavButton
                        label="Next month"
                        onClick={() => setMonth(addMonths(month, 1))}
                    >
                        ›
                    </CalendarNavButton>
                </div>

                <div
                    role="grid"
                    className="grid grid-cols-7 gap-0.5 text-center"
                >
                    {weekdays.map((weekday) => (
                        <div
                            key={weekday}
                            aria-hidden="true"
                            className="py-1 text-xs font-medium text-muted-foreground"
                        >
                            {weekday}
                        </div>
                    ))}

                    {days.map((day) => {
                        const iso = toISO(day);
                        const inMonth = day.getMonth() === month.getMonth();
                        const isSelected = iso === value;
                        const isToday = iso === todayISO;
                        const isDisabled = outOfRange(day);

                        return (
                            <button
                                key={iso}
                                type="button"
                                disabled={isDisabled}
                                aria-current={isToday ? 'date' : undefined}
                                aria-pressed={isSelected}
                                aria-label={formatter.format(day)}
                                className={[
                                    'flex size-9 items-center justify-center rounded-md text-sm outline-none transition-colors',
                                    'cursor-pointer',
                                    'focus-visible:ring-2 focus-visible:ring-ring',
                                    'disabled:pointer-events-none disabled:opacity-30',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : inMonth
                                          ? 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                    !isSelected && isToday
                                        ? 'ring-1 ring-ring'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                onClick={() => {
                                    setValue(iso);
                                    setOpen(false);
                                    triggerRef.current?.focus();
                                }}
                            >
                                {day.getDate()}
                            </button>
                        );
                    })}
                </div>
            </OverlayPanel>
        </div>
    );
}

interface CalendarNavButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

function CalendarNavButton({ label, ...props }: CalendarNavButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
            {...props}
        />
    );
}
