import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap } from './useFocusTrap';
import { useScrollLock } from './useScrollLock';

export interface ModalOverlayProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    open: boolean;
    onDismiss: () => void;
    /** `alertdialog` for a confirmation that interrupts a flow. */
    role?: 'dialog' | 'alertdialog';
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    backdropClassName?: string;
    children: ReactNode;
}

/**
 * The shared plumbing behind every modal surface: a portal, a backdrop, a
 * focus trap, a scroll lock and Escape handling.
 *
 * `aria-modal="true"` asserts the rest of the page is inert, so a modal that
 * lets focus and scrolling escape is lying to assistive technology. Keeping
 * that in one place means Dialog, Drawer and AlertDialog cannot drift apart
 * on it.
 */
export function ModalOverlay({
    open,
    onDismiss,
    role = 'dialog',
    closeOnBackdrop = true,
    closeOnEscape = true,
    backdropClassName,
    className,
    children,
    ...props
}: ModalOverlayProps) {
    const panelRef = useRef<HTMLDivElement | null>(null);

    useFocusTrap(panelRef, open);
    useScrollLock(open);

    useEffect(() => {
        if (!open || !closeOnEscape) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onDismiss();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, closeOnEscape, onDismiss]);

    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50" role="presentation">
            <div
                className={[
                    'absolute inset-0 bg-black/50',
                    backdropClassName,
                ]
                    .filter(Boolean)
                    .join(' ')}
                onClick={closeOnBackdrop ? onDismiss : undefined}
            />

            <div
                ref={panelRef}
                role={role}
                aria-modal="true"
                tabIndex={-1}
                className={className}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}
