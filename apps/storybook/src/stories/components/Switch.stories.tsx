import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Switch } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'boolean',
        },
    },
    args: {
        // Bare controls still need a name.
        'aria-label': 'Enable notifications',
    },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
    args: {
        defaultChecked: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        disabled: true,
        defaultChecked: true,
    },
};

export const Error: Story = {
    args: {
        error: true,
        'aria-invalid': true,
    },
};

export const WithLabel: Story = {
    render: () => (
        <label className="flex items-center gap-3">
            <Switch />
            <span className="text-sm text-foreground">Enable notifications</span>
        </label>
    ),
};

export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3">
                <Switch />
                <span className="text-sm text-foreground">Default</span>
            </label>

            <label className="flex items-center gap-3">
                <Switch defaultChecked />
                <span className="text-sm text-foreground">Checked</span>
            </label>

            <label className="flex items-center gap-3">
                <Switch error aria-invalid="true" />
                <span className="text-sm text-foreground">Error</span>
            </label>

            <label className="flex items-center gap-3">
                <Switch disabled />
                <span className="text-sm text-foreground">Disabled</span>
            </label>

            <label className="flex items-center gap-3">
                <Switch disabled defaultChecked />
                <span className="text-sm text-foreground">Disabled checked</span>
            </label>
        </div>
    ),
};

/**
 * Regression: the thumb was a sibling carrying `checked:`, which only applies
 * to the `:checked` element itself, so it never moved.
 */
export const ThumbMovesWhenChecked: Story = {
    args: { defaultChecked: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('switch');
        const thumb = canvasElement.querySelector('span[aria-hidden="true"]')!;

        await expect(input).toBeChecked();

        // Tailwind v4 uses the `translate` property, not `transform`.
        // translate-x-5 is 1.25rem, so 20px.
        await expect(getComputedStyle(thumb).translate).toContain('20px');
    },
};

/**
 * Regression: competing Tailwind utilities resolve by stylesheet order, not
 * class-string order, so a base `border-transparent` hid the error state.
 */
export const ErrorBorderIsVisible: Story = {
    args: { error: true },
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByRole('switch');

        // --kosmos-color-destructive, red-600.
        await expect(getComputedStyle(input).borderColor).toBe('rgb(220, 38, 38)');
    },
};
