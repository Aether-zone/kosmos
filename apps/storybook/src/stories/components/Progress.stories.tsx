import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Progress',
    component: Progress,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: 'select',
            options: ['primary', 'success', 'warning', 'destructive'],
        },
        showValue: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 60,
    },
};

export const WithLabel: Story = {
    args: {
        value: 60,
        label: 'Uploading',
        showValue: true,
    },
};

export const Indeterminate: Story = {
    args: {
        label: 'Working',
    },
};

export const Small: Story = {
    args: {
        value: 40,
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        value: 40,
        size: 'lg',
    },
};

export const Success: Story = {
    args: {
        value: 100,
        variant: 'success',
        label: 'Complete',
        showValue: true,
    },
};

export const Warning: Story = {
    args: {
        value: 85,
        variant: 'warning',
        label: 'Storage used',
        showValue: true,
    },
};

export const Destructive: Story = {
    args: {
        value: 96,
        variant: 'destructive',
        label: 'Quota',
        showValue: true,
    },
};

export const CustomMax: Story = {
    args: {
        value: 3,
        max: 5,
        label: 'Step 3 of 5',
        showValue: true,
        formatValue: (percent: number) => `${Math.round((percent / 100) * 5)}/5`,
    },
};
