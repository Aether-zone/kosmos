import {
    Children,
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
} from 'react';

export interface SlotProps {
    children?: ReactNode;
    [prop: string]: unknown;
}

type AnyProps = Record<string, unknown>;

const isHandler = (key: string) =>
    key.startsWith('on') && key.length > 2 && key[2] === key[2].toUpperCase();

/**
 * Renders its props onto its child rather than onto a wrapper element.
 *
 * Triggers otherwise have to render their own `<button>`, which puts a button
 * inside a button as soon as a consumer passes one — invalid markup that the
 * browser silently reparents.
 *
 * The child's own props win on conflict, except that event handlers are
 * chained (ours first, then the child's) so neither is lost.
 */
export function Slot({ children, ...slotProps }: SlotProps) {
    // A slot with nothing to render onto has no element to become.
    if (Children.count(children) !== 1) {
        return null;
    }

    const child = Children.only(children);

    if (!isValidElement(child)) {
        return null;
    }

    const childProps = (child.props ?? {}) as AnyProps;
    const merged: AnyProps = { ...slotProps };

    for (const [key, childValue] of Object.entries(childProps)) {
        const slotValue = merged[key];

        if (isHandler(key) && typeof slotValue === 'function') {
            merged[key] = (...args: unknown[]) => {
                (slotValue as (...a: unknown[]) => void)(...args);

                if (typeof childValue === 'function') {
                    (childValue as (...a: unknown[]) => void)(...args);
                }
            };

            continue;
        }

        if (key === 'className') {
            merged.className = [slotProps.className, childValue]
                .filter(Boolean)
                .join(' ');

            continue;
        }

        merged[key] = childValue;
    }

    return cloneElement(child as ReactElement<AnyProps>, merged);
}
