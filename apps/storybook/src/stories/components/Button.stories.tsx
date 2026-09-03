import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'primary',
                'secondary',
                'outline',
                'ghost',
                'destructive',
            ],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Button',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Button',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Button',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Delete',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        children: 'Medium',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};