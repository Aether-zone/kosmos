import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Spinner } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Spinner',
    component: Spinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
    },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4 text-foreground">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
        </div>
    ),
};

export const InheritsColor: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <span className="text-primary">
                <Spinner />
            </span>
            <span className="text-destructive">
                <Spinner />
            </span>
            <span className="text-success">
                <Spinner />
            </span>
            <span className="text-muted-foreground">
                <Spinner />
            </span>
        </div>
    ),
};

export const InButton: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Button disabled>
                <Spinner size="sm" className="mr-2" label={null} />
                Saving
            </Button>

            <Button variant="outline" disabled>
                <Spinner size="sm" className="mr-2" label={null} />
                Loading
            </Button>
        </div>
    ),
};

export const Decorative: Story = {
    args: {
        label: null,
    },
};
