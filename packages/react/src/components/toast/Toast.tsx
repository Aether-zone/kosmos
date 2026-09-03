import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import { IoClose } from 'react-icons/io5';

export type ToastVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive';

export interface ToastOptions {
    title?: ReactNode;
    description?: ReactNode;
    variant?: ToastVariant;
    duration?: number;
}

export interface Toast extends ToastOptions {
    id: string;
}

export interface ToastProviderProps {
    children: ReactNode;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    toast: (options: ToastOptions) => string;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToast must be used inside a ToastProvider.',
        );
    }

    return context;
}

export function ToastProvider({
    children,
    duration = 5000,
}: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((current) =>
            current.filter((toast) => toast.id !== id),
        );
    }, []);

    const toast = useCallback(
        (options: ToastOptions) => {
            const id = crypto.randomUUID();

            const nextToast: Toast = {
                ...options,
                id,
                duration: options.duration ?? duration,
            };

            setToasts((current) => [...current, nextToast]);

            return id;
        },
        [duration],
    );

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <ToastViewport />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const { toast, dismiss } = useToastContext();

    return {
        toast,
        dismiss,
    };
}

export interface ToastViewportProps {
    className?: string;
}

export function ToastViewport({
    className,
}: ToastViewportProps) {
    const { toasts } = useToastContext();

    const classes = [
        'fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            // A generic div is prohibited from taking a name; region allows it.
            role="region"
            aria-live="polite"
            aria-label="Notifications"
            className={classes}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
    const { dismiss } = useToastContext();

    useEffect(() => {
        if (toast.duration === 0) {
            return;
        }

        const timeout = window.setTimeout(() => {
            dismiss(toast.id);
        }, toast.duration);

        return () => window.clearTimeout(timeout);
    }, [toast.id, toast.duration, dismiss]);

    const variantStyles: Record<ToastVariant, string> = {
        default:
            'border-border bg-surface text-foreground',
        success:
            'border-success/30 bg-success/10 text-foreground',
        warning:
            'border-warning/30 bg-warning/10 text-foreground',
        destructive:
            'border-destructive/30 bg-destructive/10 text-foreground',
    };

    const classes = [
        'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg',
        variantStyles[toast.variant ?? 'default'],
    ].join(' ');

    return (
        <div
            role="status"
            className={classes}
        >
            <div className="min-w-0 flex-1">
                {toast.title && (
                    <div className="font-medium">
                        {toast.title}
                    </div>
                )}

                {toast.description && (
                    <div className="mt-1 text-sm opacity-80">
                        {toast.description}
                    </div>
                )}
            </div>

            <button
                type="button"
                aria-label="Dismiss notification"
                className="shrink-0 cursor-pointer rounded-sm p-1 text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => dismiss(toast.id)}
            >
                <IoClose className="size-4" />
            </button>
        </div>
    );
}
