import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
        error: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Checkbox>;

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
        <label className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm text-foreground">Accept terms and conditions</span>
        </label>
    ),
};

export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm text-foreground">Default</span>
            </label>

            <label className="flex items-center gap-2">
                <Checkbox defaultChecked />
                <span className="text-sm text-foreground">Checked</span>
            </label>

            <label className="flex items-center gap-2">
                <Checkbox error aria-invalid="true" />
                <span className="text-sm text-foreground">Error</span>
            </label>

            <label className="flex items-center gap-2">
                <Checkbox disabled />
                <span className="text-sm text-foreground">Disabled</span>
            </label>

            <label className="flex items-center gap-2">
                <Checkbox disabled defaultChecked />
                <span className="text-sm text-foreground">Disabled checked</span>
            </label>
        </div>
    ),
};
