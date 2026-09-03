import { useCallback, useEffect, useState } from 'react';

import { useMediaQuery } from './useMediaQuery';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface UseThemeOptions {
    /** Where the choice is remembered. Pass null to not persist it. */
    storageKey?: string | null;
    /** The element the `dark` class goes on. Defaults to <html>. */
    element?: HTMLElement | null;
    defaultTheme?: Theme;
}

export interface ThemeControls {
    /** What was chosen, which may be 'system'. */
    theme: Theme;
    /** What that actually resolves to right now. */
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
    toggle: () => void;
}

const read = (key: string | null): Theme | null => {
    if (!key || typeof window === 'undefined') {
        return null;
    }

    try {
        const stored = window.localStorage.getItem(key);

        return stored === 'light' || stored === 'dark' || stored === 'system'
            ? stored
            : null;
    } catch {
        // Storage can throw outright in a private window or with cookies
        // blocked; a remembered theme is not worth failing a render over.
        return null;
    }
};

/**
 * Reads and sets the theme, applying it the way Kosmos expects: a `dark` class
 * on an ancestor. Nothing else is needed, because the tokens swap in CSS.
 *
 * 'system' is a distinct choice from the theme it currently resolves to — it
 * keeps following the OS when that changes, and `resolvedTheme` is what to
 * render against.
 */
export function useTheme({
    storageKey = 'kosmos-theme',
    element,
    defaultTheme = 'system',
}: UseThemeOptions = {}): ThemeControls {
    const [theme, setThemeState] = useState<Theme>(
        () => read(storageKey) ?? defaultTheme,
    );

    const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

    const resolvedTheme: ResolvedTheme =
        theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

    useEffect(() => {
        const target = element ?? document.documentElement;

        target.classList.toggle('dark', resolvedTheme === 'dark');
    }, [resolvedTheme, element]);

    const setTheme = useCallback(
        (next: Theme) => {
            setThemeState(next);

            if (!storageKey) {
                return;
            }

            try {
                window.localStorage.setItem(storageKey, next);
            } catch {
                // See `read`: not worth failing over.
            }
        },
        [storageKey],
    );

    const toggle = useCallback(
        () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
        [resolvedTheme, setTheme],
    );

    return { theme, resolvedTheme, setTheme, toggle };
}
