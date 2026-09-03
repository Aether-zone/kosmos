import {
    type InputHTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

import { OverlayPanel, useDismiss } from '../../internal';

export type AutocompleteSize = 'sm' | 'md' | 'lg';

export interface AutocompleteOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface AutocompleteProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'size' | 'value' | 'defaultValue' | 'onChange' | 'onSelect'
    > {
    options: AutocompleteOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onSelect?: (option: AutocompleteOption) => void;
    size?: AutocompleteSize;
    error?: boolean;
    emptyMessage?: ReactNode;
    /** Override the default case-insensitive "contains" match. */
    filter?: (option: AutocompleteOption, query: string) => boolean;
}

const baseStyles =
    'flex w-full rounded-md border bg-background text-foreground ' +
    'placeholder:text-muted-foreground transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<AutocompleteSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
};

const defaultFilter = (option: AutocompleteOption, query: string) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase());

export function Autocomplete({
    options,
    value: controlledValue,
    defaultValue = '',
    onValueChange,
    onSelect,
    size = 'md',
    error = false,
    emptyMessage = 'No results found.',
    filter = defaultFilter,
    className,
    onKeyDown,
    onBlur,
    onFocus,
    disabled,
    ...props
}: AutocompleteProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const listId = useId();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const value = controlledValue ?? uncontrolledValue;

    const matches = useMemo(
        () => options.filter((option) => filter(option, value)),
        [options, value, filter],
    );

    // A stale highlight would let Enter pick a row that is no longer shown.
    useEffect(() => {
        setActiveIndex((current) =>
            current >= matches.length ? matches.length - 1 : current,
        );
    }, [matches.length]);

    // The list is portalled, so "inside" spans two detached subtrees.
    useDismiss({
        enabled: open,
        refs: [rootRef, listRef],
        onDismiss: () => setOpen(false),
        escape: false,
    });

    const setValue = (nextValue: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const select = (option: AutocompleteOption) => {
        if (option.disabled) {
            return;
        }

        setValue(option.label);
        onSelect?.(option);
        setOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (event.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
            return;
        }

        if (event.key === 'Enter') {
            const option = matches[activeIndex];

            if (open && option) {
                event.preventDefault();
                select(option);
            }

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

        if (matches.length === 0) {
            return;
        }

        setActiveIndex((current) => {
            if (event.key === 'ArrowDown') {
                return current + 1 >= matches.length ? 0 : current + 1;
            }

            return current <= 0 ? matches.length - 1 : current - 1;
        });
    };

    const classes = [
        baseStyles,
        sizeStyles[size],
        error
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
            : 'border-input',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const activeId =
        open && activeIndex >= 0 && matches[activeIndex]
            ? `${listId}-option-${activeIndex}`
            : undefined;

    return (
        <div ref={rootRef} className="w-full">
            <input
                type="text"
                role="combobox"
                autoComplete="off"
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                disabled={disabled}
                className={classes}
                value={value}
                onChange={(event) => {
                    setValue(event.target.value);
                    setOpen(true);
                    setActiveIndex(-1);
                }}
                onFocus={(event) => {
                    onFocus?.(event);
                    setOpen(true);
                }}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                {...props}
            />

            <OverlayPanel
                anchorRef={rootRef}
                panelRef={listRef}
                open={open && !disabled}
                side="bottom"
                align="start"
                matchAnchorWidth
                id={listId}
                role="listbox"
                className="z-50 max-h-60 overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-lg"
            >
                {matches.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                ) : (
                    matches.map((option, index) => (
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
                            // mousedown, not click: the input's blur would
                            // otherwise tear the list down first.
                            onMouseDown={(event) => {
                                event.preventDefault();
                                select(option);
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {option.label}
                        </div>
                    ))
                )}
            </OverlayPanel>
        </div>
    );
}
