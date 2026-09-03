import { useCallback, useEffect, useRef, useState } from 'react';

export interface CopyToClipboard {
    copy: (text: string) => Promise<boolean>;
    /** True for `resetAfter` milliseconds following a successful copy. */
    copied: boolean;
    error: Error | null;
}

/**
 * Copies text and reports whether it worked, with the "Copied!" window that
 * every copy button needs, so a component does not have to run its own timer.
 */
export function useCopyToClipboard(resetAfter = 2000): CopyToClipboard {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const timer = useRef<number>(undefined);

    // A copy that lands just before unmount would otherwise set state on a
    // component that is gone.
    useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);

                setError(null);
                setCopied(true);

                window.clearTimeout(timer.current);
                timer.current = window.setTimeout(
                    () => setCopied(false),
                    resetAfter,
                );

                return true;
            } catch (cause) {
                // Denied permission, or an insecure context.
                setError(cause as Error);
                setCopied(false);

                return false;
            }
        },
        [resetAfter],
    );

    return { copy, copied, error };
}
