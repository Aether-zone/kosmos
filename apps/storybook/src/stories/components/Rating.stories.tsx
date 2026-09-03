import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Rating } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Rating',
    component: Rating,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        readOnly: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        showValue: {
            control: 'boolean',
        },
    },
    args: {
        label: 'Rating',
    },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultValue: 3,
    },
};

export const Empty: Story = {};

export const WithValue: Story = {
    args: {
        defaultValue: 4,
        showValue: true,
    },
};

export const ReadOnly: Story = {
    args: {
        value: 4,
        readOnly: true,
        showValue: true,
    },
};

export const Small: Story = {
    args: {
        defaultValue: 3,
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        defaultValue: 3,
        size: 'lg',
    },
};

export const TenStars: Story = {
    args: {
        max: 10,
        defaultValue: 7,
        showValue: true,
    },
};

export const NotClearable: Story = {
    args: {
        defaultValue: 3,
        clearable: false,
    },
};

export const Disabled: Story = {
    args: {
        defaultValue: 3,
        disabled: true,
    },
};

function ControlledRating() {
    const [value, setValue] = useState(0);

    return (
        <div className="space-y-3 text-center">
            <Rating label="Rate this" value={value} onValueChange={setValue} />

            <p className="text-sm text-muted-foreground">
                {value === 0 ? 'Not rated' : `Rated ${value} of 5`}
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledRating />,
};
