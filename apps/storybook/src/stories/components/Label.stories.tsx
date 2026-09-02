import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
    args: {
        children: 'Email address',
    },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-2">
            <Label htmlFor="email">Email address</Label>
            <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
        </div>
    ),
};

export const Required: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-2">
            <Label htmlFor="required-email">
                Email address <span aria-hidden="true">*</span>
            </Label>
            <input
                id="required-email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-2">
            <Label htmlFor="disabled-email">Email address</Label>
            <input
                id="disabled-email"
                type="email"
                disabled
                placeholder="you@example.com"
                className="peer h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
    ),
};