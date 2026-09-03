import {
    type KeyboardEvent,
    type ReactNode,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

import { useControllableState } from '../../hooks';

import { OverlayPanel, useDismiss } from '../../internal';
import { Chip } from '../chip';

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    size?: ComboboxSize;
    error?: boolean;
    disabled?: boolean;
    placeholder?: string;
    emptyMessage?: ReactNode;
    /** Cap on selections; the input is disabled once reached. */
    maxSelected?: number;
    /** Offer unmatched input as a new option. */
    allowCreate?: boolean;
    name?: string;
    label?: string;
    id?: string;
    className?: string;
}

const controlStyles =
    'flex w-full flex-wrap items-center gap-1.5 rounded-md border ' +
    'bg-background text-foreground transition-colors ' +
    'focus-within:ring-2 focus-within:ring-ring focus-within:border-ring';

const sizeStyles: Record<ComboboxSize, string> = {
    sm: 'min-h-8 px-2 py-1 text-sm',
    md: 'min-h-10 px-2 py-1.5 text-sm',
    lg: 'min-h-12 px-3 py-2 text-base',
};

const chipSizes: Record<ComboboxSize, 'sm' | 'md' | 'lg'> = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
};

/**
 * Multi-select with the selections shown as removable chips.
 *
 * The chips sit inside the control rather than below it so the field's height
 * reflects its content, and Backspace on an empty input removes the last one
 * — the interaction people expect from a tag field.
 */
export function Combobox({
    options,
    value: controlledValue,
    defaultValue = [],
    onValueChange,
    size = 'md',
    error = false,
    disabled = false,
    placeholder = 'Select…',
    emptyMessage = 'No results found.',
    maxSelected,
    allowCreate = false,
    name,
    label,
    id,
    className,
}: ComboboxProps) {
    const [value, setValue] = useControllableState<string[]>({
        value: controlledValue,
        defaultValue,
        onChange: onValueChange,
    });
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlighted, setActiveIndex] = useState(-1);
    const [created, setCreated] = useState<ComboboxOption[]>([]);

    const generatedId = useId();
    const listId = useId();
    const labelId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const inputId = id ?? generatedId;

    const allOptions = useMemo(
        () => [...options, ...created],
        [options, created],
    );

    const selectedOptions = useMemo(
        () =>
            value.map(
                (entry) =>
                    allOptions.find((option) => option.value === entry) ?? {
                        value: entry,
                        label: entry,
                    },
            ),
        [value, allOptions],
    );

    const atLimit = maxSelected !== undefined && value.length >= maxSelected;

    const matches = useMemo(() => {
        const trimmed = query.trim().toLowerCase();

        return allOptions.filter(
            (option) =>
                !value.includes(option.value) &&
                option.label.toLowerCase().includes(trimmed),
        );
    }, [allOptions, value, query]);

    const canCreate =
        allowCreate &&
        query.trim().length > 0 &&
        !allOptions.some(
            (option) =>
                option.label.toLowerCase() === query.trim().toLowerCase(),
        );

    const rows = canCreate ? matches.length + 1 : matches.length;

    // Derived rather than clamped in an effect: filtering can shrink the list
    // under a highlight, and a stale one would let Enter pick a row that is no
    // longer shown.
    const activeIndex = Math.min(highlighted, rows - 1);

    useDismiss({
        enabled: open,
        refs: [rootRef, listRef],
        onDismiss: () => setOpen(false),
        escape: false,
    });

    const add = (option: ComboboxOption) => {
        if (option.disabled || atLimit || value.includes(option.value)) {
            return;
        }

        setValue([...value, option.value]);
        setQuery('');
        setActiveIndex(-1);
    };

    const remove = (entry: string) => {
        setValue(value.filter((current) => current !== entry));
    };

    const create = () => {
        const label_ = query.trim();
        const option = { value: label_, label: label_ };

        setCreated((current) => [...current, option]);
        add(option);
    };

    const choose = (index: number) => {
        if (canCreate && index === rows - 1) {
            create();
            return;
        }

        const option = matches[index];

        if (option) {
            add(option);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
            return;
        }

        // Backspace on an empty input removes the last chip.
        if (event.key === 'Backspace' && query === '' && value.length > 0) {
            remove(value[value.length - 1]);
            return;
        }

        if (event.key === 'Enter' && open && activeIndex >= 0) {
            event.preventDefault();
            choose(activeIndex);
            return;
        }

        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return;
        }

        event.preventDefault();

        if (!open) {
            setOpen(true);
            return;
        }

        if (rows === 0) {
            return;
        }

        setActiveIndex((current) => {
            if (event.key === 'ArrowDown') {
                return current + 1 >= rows ? 0 : current + 1;
            }

            return current <= 0 ? rows - 1 : current - 1;
        });
    };

    const activeId =
        open && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

    return (
        <div ref={rootRef} className={['w-full', className].filter(Boolean).join(' ')}>
            {label ? (
                <span id={labelId} className="sr-only">
                    {label}
                </span>
            ) : null}

            {name
                ? value.map((entry) => (
                      <input
                          key={entry}
                          type="hidden"
                          name={name}
                          value={entry}
                      />
                  ))
                : null}

            <div
                className={[
                    controlStyles,
                    sizeStyles[size],
                    error
                        ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive'
                        : 'border-input',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
                ].join(' ')}
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                {selectedOptions.map((option) => (
                    <Chip
                        key={option.value}
                        size={chipSizes[size]}
                        disabled={disabled}
                        onRemove={
                            disabled ? undefined : () => remove(option.value)
                        }
                    >
                        {option.label}
                    </Chip>
                ))}

                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    role="combobox"
                    autoComplete="off"
                    aria-expanded={open}
                    aria-controls={open ? listId : undefined}
                    aria-activedescendant={activeId}
                    aria-autocomplete="list"
                    aria-labelledby={label ? labelId : undefined}
                    disabled={disabled}
                    placeholder={
                        atLimit
                            ? undefined
                            : value.length === 0
                              ? placeholder
                              : undefined
                    }
                    readOnly={atLimit}
                    value={query}
                    className="min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <OverlayPanel
                anchorRef={rootRef}
                panelRef={listRef}
                open={open && !disabled}
                side="bottom"
                align="start"
                matchAnchorWidth
                id={listId}
                role="listbox"
                aria-multiselectable="true"
                className="z-50 max-h-60 overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-lg"
            >
                {rows === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                        {atLimit
                            ? `Limit of ${maxSelected} reached.`
                            : emptyMessage}
                    </div>
                ) : (
                    <>
                        {matches.map((option, index) => (
                            <div
                                key={option.value}
                                id={`${listId}-option-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                aria-disabled={option.disabled}
                                className={[
                                    'cursor-pointer rounded-sm px-3 py-2 text-sm transition-colors',
                                    option.disabled
                                        ? 'pointer-events-none opacity-50'
                                        : 'text-foreground',
                                    index === activeIndex
                                        ? 'bg-accent text-accent-foreground'
                                        : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                // mousedown, not click: blur would otherwise
                                // tear the list down first.
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    add(option);
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {option.label}
                            </div>
                        ))}

                        {canCreate ? (
                            <div
                                id={`${listId}-option-${rows - 1}`}
                                role="option"
                                aria-selected={activeIndex === rows - 1}
                                className={[
                                    'cursor-pointer rounded-sm px-3 py-2 text-sm transition-colors',
                                    activeIndex === rows - 1
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-foreground',
                                ].join(' ')}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    create();
                                }}
                                onMouseEnter={() => setActiveIndex(rows - 1)}
                            >
                                Create “{query.trim()}”
                            </div>
                        ) : null}
                    </>
                )}
            </OverlayPanel>
        </div>
    );
}
