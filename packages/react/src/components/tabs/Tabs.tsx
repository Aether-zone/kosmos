import {
    createContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useContext,
    useId,
    useState,
} from 'react';

export interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> { }

export interface TabsTriggerProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

export interface TabsContentProps
    extends HTMLAttributes<HTMLDivElement> {
    value: string;
}

interface TabsContextValue {
    value?: string;
    setValue: (value: string) => void;
    baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error(
            'Tabs components must be used inside a Tabs component.',
        );
    }

    return context;
}

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;

const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
}: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] =
        useState(defaultValue);

    const baseId = useId();

    const value = controlledValue ?? uncontrolledValue;

    const setValue = (nextValue: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    return (
        <TabsContext.Provider value={{ value, setValue, baseId }}>
            {children}
        </TabsContext.Provider>
    );
}

export function TabsList({
    className,
    onKeyDown,
    ...props
}: TabsListProps) {
    const classes = [
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    /**
     * Triggers use a roving tabindex, so only the selected tab is in the tab
     * order — the arrow keys are the only way to reach the others.
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const tabs = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]:not(:disabled)',
            ),
        ];

        const current = tabs.indexOf(
            document.activeElement as HTMLButtonElement,
        );

        if (current === -1) {
            return;
        }

        const next = {
            ArrowRight: (current + 1) % tabs.length,
            ArrowLeft: (current - 1 + tabs.length) % tabs.length,
            Home: 0,
            End: tabs.length - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        tabs[next].focus();
        tabs[next].click();
    };

    return (
        <div
            role="tablist"
            className={classes}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
}

export function TabsTrigger({
    value: triggerValue,
    className,
    onClick,
    ...props
}: TabsTriggerProps) {
    const { value, setValue, baseId } = useTabs();

    const active = value === triggerValue;

    const classes = [
        'inline-flex h-8 items-center justify-center whitespace-nowrap rounded-sm px-3 text-sm font-medium transition-colors',
        'cursor-pointer outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        active
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-background/50 hover:text-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            role="tab"
            id={tabId(baseId, triggerValue)}
            aria-selected={active}
            aria-controls={panelId(baseId, triggerValue)}
            tabIndex={active ? 0 : -1}
            className={classes}
            onClick={(event) => {
                onClick?.(event);
                setValue(triggerValue);
            }}
            {...props}
        />
    );
}

export function TabsContent({
    value: contentValue,
    className,
    ...props
}: TabsContentProps) {
    const { value, baseId } = useTabs();

    if (value !== contentValue) {
        return null;
    }

    const classes = [
        'mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="tabpanel"
            id={panelId(baseId, contentValue)}
            aria-labelledby={tabId(baseId, contentValue)}
            tabIndex={0}
            className={classes}
            {...props}
        />
    );
}
