import { useEffect, useId, useRef, type ReactNode } from 'react';

import { ModalOverlay } from '../../internal';

export type AlertDialogTone = 'default' | 'destructive';

export interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    tone?: AlertDialogTone;
    /** Disables both actions — for an in-flight confirmation. */
    busy?: boolean;
    children?: ReactNode;
}

const confirmTones: Record<AlertDialogTone, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const actionStyles =
    'inline-flex h-10 cursor-pointer items-center justify-center rounded-md ' +
    'px-4 text-sm font-medium transition-colors outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * A confirmation that interrupts a flow.
 *
 * Unlike Dialog this is a single self-contained component rather than a set
 * of composable parts, because the shape of a confirmation is fixed: a
 * question, and two answers. It uses `role="alertdialog"` and cannot be
 * dismissed by clicking the backdrop — an accidental click should not count
 * as an answer.
 */
export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    tone = 'default',
    busy = false,
    children,
}: AlertDialogProps) {
    const titleId = useId();
    const descriptionId = useId();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    // Focus lands on the safe action, so Enter never confirms by reflex.
    useEffect(() => {
        if (open) {
            cancelRef.current?.focus();
        }
    }, [open]);

    const dismiss = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <ModalOverlay
            open={open}
            onDismiss={dismiss}
            role="alertdialog"
            closeOnBackdrop={false}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className="fixed inset-0 flex items-center justify-center p-4"
        >
            <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg">
                <h2
                    id={titleId}
                    className="text-lg font-semibold leading-none tracking-tight text-foreground"
                >
                    {title}
                </h2>

                {description ? (
                    <p
                        id={descriptionId}
                        className="mt-2 text-sm text-muted-foreground"
                    >
                        {description}
                    </p>
                ) : null}

                {children ? <div className="mt-4">{children}</div> : null}

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        ref={cancelRef}
                        type="button"
                        disabled={busy}
                        className={[
                            actionStyles,
                            'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                        ].join(' ')}
                        onClick={dismiss}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        disabled={busy}
                        className={[actionStyles, confirmTones[tone]].join(' ')}
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </ModalOverlay>
    );
}
