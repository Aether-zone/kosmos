import { useCallback, useState } from 'react';

export interface ControllableStateOptions<T> {
    /** Supplied by the consumer; its presence makes the state controlled. */
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}

/**
 * State that is controlled when the consumer passes a value, and holds its own
 * otherwise.
 *
 * Every Kosmos component that takes a `value`/`defaultValue` pair works this
 * way, and the rule is easy to get subtly wrong: a controlled component must
 * *not* update its internal copy, or it will briefly render a value the
 * consumer never asked for if they decline the change.
 */
export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
}: ControllableStateOptions<T>): [T, (next: T) => void] {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);

    const controlled = value !== undefined;
    const current = controlled ? value : uncontrolled;

    const setValue = useCallback(
        (next: T) => {
            if (!controlled) {
                setUncontrolled(next);
            }

            onChange?.(next);
        },
        [controlled, onChange],
    );

    return [current, setValue];
}
