import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        error: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div className="h-96 w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
    args: {
        defaultValue: '2026-09-03',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: '2026-09-03',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: '2026-09-03',
    },
};

export const Error: Story = {
    args: {
        error: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: '2026-09-03',
    },
};

export const WithRange: Story = {
    args: {
        defaultValue: '2026-09-03',
        min: '2026-09-01',
        max: '2026-09-30',
    },
};

function ControlledDatePicker() {
    const [value, setValue] = useState('2026-09-03');

    return (
        <div className="space-y-3">
            <DatePicker value={value} onValueChange={setValue} />

            <p className="text-sm text-muted-foreground">
                Selected: <strong className="text-foreground">{value}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledDatePicker />,
};
