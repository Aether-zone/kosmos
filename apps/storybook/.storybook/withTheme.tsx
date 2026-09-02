import { useEffect, type ReactNode } from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * Kosmos themes by redefining its token values under `.dark`, so switching
 * themes only means putting that class on an ancestor. It goes on <html>
 * rather than a wrapper element so it cannot interfere with a story's own
 * layout — a wrapper shrink-wraps under `layout: 'centered'`.
 */
function ThemedStory({ theme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.style.background = 'var(--kosmos-color-background)';
    root.style.color = 'var(--kosmos-color-foreground)';

    return () => {
      root.classList.remove('dark');
      root.style.removeProperty('background');
      root.style.removeProperty('color');
    };
  }, [theme]);

  return <>{children}</>;
}

export const withTheme: Decorator = (Story, context) => (
  <ThemedStory theme={context.globals.theme === 'dark' ? 'dark' : 'light'}>
    <Story />
  </ThemedStory>
);
