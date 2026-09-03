import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';

import { Slider } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        error: {
            control: 'boolean',
        },
        showValue: {
            control: 'boolean',
        },
    },
    args: {
        label: 'Volume',
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultValue: 40,
    },
};

export const WithValue: Story = {
    args: {
        defaultValue: 65,
        showValue: true,
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: 30,
        showValue: true,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: 80,
        showValue: true,
    },
};

export const Stepped: Story = {
    args: {
        defaultValue: 50,
        step: 10,
        showValue: true,
    },
};

export const CustomRange: Story = {
    args: {
        min: -50,
        max: 50,
        defaultValue: 0,
        showValue: true,
    },
};

export const Formatted: Story = {
    args: {
        defaultValue: 25,
        showValue: true,
        formatValue: (value: number) => `${value}%`,
    },
};

export const Error: Story = {
    args: {
        error: true,
        defaultValue: 90,
        showValue: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 40,
        showValue: true,
    },
};

function ControlledSlider() {
    const [value, setValue] = useState(35);

    return (
        <div className="space-y-3">
            <Slider
                label="Brightness"
                value={value}
                onValueChange={setValue}
                showValue
            />

            <p className="text-sm text-muted-foreground">
                Value: <strong className="text-foreground">{value}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledSlider />,
};

/** Same contract, on a value rather than a selection. */
export const ControlledIgnoresDeclinedChange: Story = {
    args: { value: 40, label: 'Volume', showValue: true },
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByRole('slider') as HTMLInputElement;

        await expect(input.value).toBe('40');

        // fireEvent, not a raw dispatch: React's value tracker swallows a
        // direct assignment, so onChange would never fire and the test would
        // prove nothing.
        await fireEvent.change(input, { target: { value: '80' } });

        // Nothing is listening, so React restores the value it was given.
        await expect(input.value).toBe('40');
    },
};
