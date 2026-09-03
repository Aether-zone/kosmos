import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type KeyboardEvent,
    useContext,
    useId,
    useState,
} from 'react';

import { IoChevronDown } from 'react-icons/io5';

export interface AccordionProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
    /** `single` closes the open item when another opens. */
    type?: 'single' | 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    /** In `single` mode, allow closing the open item. */
    collapsible?: boolean;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}

export interface AccordionTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> { }

export interface AccordionContentProps
    extends HTMLAttributes<HTMLDivElement> { }

interface AccordionContextValue {
    open: string[];
    toggle: (value: string) => void;
    baseId: string;
}

interface ItemContextValue {
    value: string;
    disabled: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useAccordion() {
    const context = useContext(AccordionContext);

    if (!context) {
        throw new Error(
            'Accordion components must be used inside an Accordion.',
        );
    }

    return context;
}

function useItem(component: string) {
    const context = useContext(ItemContext);

    if (!context) {
        throw new Error(`${component} must be used inside an AccordionItem.`);
    }

    return context;
}

const triggerId = (baseId: string, value: string) =>
    `${baseId}-trigger-${value}`;

const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export function Accordion({
    type = 'single',
    value: controlledValue,
    defaultValue = [],
    onValueChange,
    collapsible = true,
    className,
    onKeyDown,
    children,
    ...props
}: AccordionProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const baseId = useId();

    const open = controlledValue ?? uncontrolledValue;

    const toggle = (value: string) => {
        const isOpen = open.includes(value);

        let next: string[];

        if (type === 'multiple') {
            next = isOpen
                ? open.filter((entry) => entry !== value)
                : [...open, value];
        } else if (isOpen) {
            next = collapsible ? [] : open;
        } else {
            next = [value];
        }

        if (controlledValue === undefined) {
            setUncontrolledValue(next);
        }

        onValueChange?.(next);
    };

    /** Arrow keys move between headers, as the pattern expects. */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const triggers = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[data-accordion-trigger]:not(:disabled)',
            ),
        ];

        const current = triggers.indexOf(
            document.activeElement as HTMLButtonElement,
        );

        if (current === -1) {
            return;
        }

        const next = {
            ArrowDown: (current + 1) % triggers.length,
            ArrowUp: (current - 1 + triggers.length) % triggers.length,
            Home: 0,
            End: triggers.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        triggers[next].focus();
    };

    const classes = [
        'w-full divide-y divide-border rounded-md border border-border',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <AccordionContext.Provider value={{ open, toggle, baseId }}>
            <div className={classes} onKeyDown={handleKeyDown} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({
    value,
    disabled = false,
    className,
    children,
    ...props
}: AccordionItemProps) {
    const classes = [className].filter(Boolean).join(' ');

    return (
        <ItemContext.Provider value={{ value, disabled }}>
            <div className={classes || undefined} {...props}>
                {children}
            </div>
        </ItemContext.Provider>
    );
}

export function AccordionTrigger({
    className,
    onClick,
    children,
    ...props
}: AccordionTriggerProps) {
    const { open, toggle, baseId } = useAccordion();
    const { value, disabled } = useItem('AccordionTrigger');

    const isOpen = open.includes(value);

    const classes = [
        'flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3',
        'text-left text-sm font-medium text-foreground outline-none transition-colors',
        'hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        // A heading wrapper gives the trigger a place in the document
        // outline; the level is left to the consumer via aria-level.
        <h3 className="m-0">
            <button
                type="button"
                data-accordion-trigger=""
                id={triggerId(baseId, value)}
                aria-expanded={isOpen}
                aria-controls={panelId(baseId, value)}
                disabled={disabled}
                className={classes}
                onClick={(event) => {
                    onClick?.(event);
                    toggle(value);
                }}
                {...props}
            >
                {children}

                <IoChevronDown
                    aria-hidden="true"
                    className={[
                        'size-4 shrink-0 text-muted-foreground transition-transform',
                        isOpen ? 'rotate-180' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                />
            </button>
        </h3>
    );
}

export function AccordionContent({
    className,
    children,
    ...props
}: AccordionContentProps) {
    const { open, baseId } = useAccordion();
    const { value } = useItem('AccordionContent');

    if (!open.includes(value)) {
        return null;
    }

    const classes = [
        'px-4 pb-4 pt-0 text-sm text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="region"
            id={panelId(baseId, value)}
            aria-labelledby={triggerId(baseId, value)}
            className={classes}
            {...props}
        >
            {children}
        </div>
    );
}
