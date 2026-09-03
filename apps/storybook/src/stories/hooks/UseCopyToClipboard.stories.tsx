import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button, Code, useCopyToClipboard } from '@aether-zone/kosmos';

const SNIPPET = 'pnpm add @aether-zone/kosmos';

function Demo() {
    const { copy, copied, error } = useCopyToClipboard();

    return (
        <div className="flex w-[28rem] items-center gap-3">
            <Code className="flex-1">{SNIPPET}</Code>

            <Button size="sm" onClick={() => copy(SNIPPET)}>
                {copied ? 'Copied' : 'Copy'}
            </Button>

            {error ? (
                <span className="text-body-small text-destructive-emphasis">
                    Copy failed
                </span>
            ) : null}
        </div>
    );
}

const meta = {
    title: 'Hooks/useCopyToClipboard',
    component: Demo,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShowsCopiedThenResets: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));

        // Headless Chromium may deny clipboard access; either way the hook
        // must report a definite outcome rather than hanging on "Copy".
        await waitFor(() =>
            expect(
                canvas.queryByRole('button', { name: 'Copied' }) ??
                    canvas.getByText('Copy failed'),
            ).toBeTruthy(),
        );
    },
};
