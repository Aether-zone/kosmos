import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        error: {
            control: 'boolean',
        },
    },
    args: {
        placeholder: 'Enter your message',
    },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
    args: {
        size: 'sm',
        placeholder: 'Small textarea',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        placeholder: 'Medium textarea',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        placeholder: 'Large textarea',
    },
};

export const Error: Story = {
    args: {
        error: true,
        'aria-invalid': true,
        placeholder: 'Invalid value',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'This textarea is disabled.',
    },
};

export const WithValue: Story = {
    args: {
        value:
            'This is an example of a textarea with some existing content.',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <Textarea size="sm" placeholder="Small textarea" />
            <Textarea size="md" placeholder="Medium textarea" />
            <Textarea size="lg" placeholder="Large textarea" />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <Textarea placeholder="Default" />
            <Textarea error aria-invalid="true" placeholder="Error" />
            <Textarea disabled placeholder="Disabled" />
        </div>
    ),
};