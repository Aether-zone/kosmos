import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Otp } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Otp',
    component: Otp,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        type: {
            control: 'select',
            options: ['numeric', 'alphanumeric'],
        },
        error: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Otp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
    args: {
        defaultValue: '123456',
    },
};

export const FourDigits: Story = {
    args: {
        length: 4,
        defaultValue: '12',
    },
};

export const Alphanumeric: Story = {
    args: {
        type: 'alphanumeric',
        defaultValue: 'A1B2',
        length: 4,
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: '123456',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: '123456',
    },
};

export const Error: Story = {
    args: {
        error: true,
        defaultValue: '000000',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: '123456',
    },
};

function ControlledOtp() {
    const [value, setValue] = useState('');
    const [completed, setCompleted] = useState<string | null>(null);

    return (
        <div className="space-y-3 text-center">
            <Otp
                value={value}
                onValueChange={setValue}
                onComplete={setCompleted}
            />

            <p className="text-sm text-muted-foreground">
                {completed
                    ? `Completed: ${completed}`
                    : `${value.length} of 6 entered`}
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledOtp />,
};
