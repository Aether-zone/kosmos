import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import {
    Badge,
    Text,
    breakpoints,
    useBreakpoint,
    useIsMobile,
    useMediaQuery,
    usePrefersReducedMotion,
} from '@aether-zone/kosmos';

function Demo() {
    const mobile = useIsMobile();
    const wide = useBreakpoint('lg');
    const dark = useMediaQuery('(prefers-color-scheme: dark)');
    const reduced = usePrefersReducedMotion();

    const rows = [
        ['useIsMobile()', mobile],
        ["useBreakpoint('lg')", wide],
        ['useMediaQuery(prefers-color-scheme: dark)', dark],
        ['usePrefersReducedMotion()', reduced],
    ] as const;

    return (
        <div className="w-[30rem] space-y-3">
            <Text size="body-small" tone="muted">
                Resize the preview — these update live.
            </Text>

            <div className="flex flex-col gap-2">
                {rows.map(([label, value]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-3 py-2"
                    >
                        <code className="font-mono text-body-small text-foreground">
                            {label}
                        </code>
                        <Badge
                            size="sm"
                            variant={value ? 'success' : 'secondary'}
                        >
                            {String(value)}
                        </Badge>
                    </div>
                ))}
            </div>

            <Text size="body-small" tone="muted">
                Breakpoints: {Object.entries(breakpoints).map(([k, v]) => `${k} ${v}`).join(' · ')}
            </Text>
        </div>
    );
}

const meta = {
    title: 'Hooks/useMediaQuery',
    component: Demo,
    tags: ['autodocs'],
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * The value is read from the browser during render, so it is correct on the
 * first paint — no flash of the wrong layout while an effect catches up.
 */
export const CorrectOnFirstRender: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const row = canvas.getByText('useIsMobile()').closest('div')!;

        // The test viewport is wide, so this must already read false.
        await expect(within(row).getByText(/true|false/)).toHaveTextContent(
            'false',
        );
    },
};
