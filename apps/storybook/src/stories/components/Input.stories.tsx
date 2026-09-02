import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Input',
    component: Input,
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
        placeholder: 'Enter your value',
    },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
    args: {
        size: 'sm',
        placeholder: 'Small input',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        placeholder: 'Medium input',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        placeholder: 'Large input',
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
        value: 'Disabled input',
    },
};

export const WithValue: Story = {
    args: {
        value: 'Hello, Kosmos',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input" />
            <Input size="lg" placeholder="Large input" />
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <Input placeholder="Default" />
            <Input error aria-invalid="true" placeholder="Error" />
            <Input disabled placeholder="Disabled" />
        </div>
    ),
};