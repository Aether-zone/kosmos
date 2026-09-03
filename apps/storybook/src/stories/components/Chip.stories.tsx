import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IoPersonOutline, IoPricetagOutline } from 'react-icons/io5';

import { Chip } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Chip',
    component: Chip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'destructive'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
    args: {
        children: 'Design',
    },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dismissible: Story = {
    args: {
        onRemove: () => {},
    },
};

export const WithIcon: Story = {
    args: {
        icon: <IoPricetagOutline />,
        onRemove: () => {},
    },
};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <Chip>Default</Chip>
            <Chip variant="primary">Primary</Chip>
            <Chip variant="success">Success</Chip>
            <Chip variant="warning">Warning</Chip>
            <Chip variant="destructive">Destructive</Chip>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-2">
            <Chip size="sm" onRemove={() => {}}>Small</Chip>
            <Chip size="md" onRemove={() => {}}>Medium</Chip>
            <Chip size="lg" onRemove={() => {}}>Large</Chip>
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        disabled: true,
        onRemove: () => {},
    },
};

export const Truncated: Story = {
    render: () => (
        <div className="w-40">
            <Chip onRemove={() => {}}>
                A very long chip label that has to truncate
            </Chip>
        </div>
    ),
};

function RemovableChips() {
    const [tags, setTags] = useState([
        'Design',
        'Engineering',
        'Research',
        'Marketing',
    ]);

    return (
        <div className="w-96 space-y-3">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Chip
                        key={tag}
                        icon={<IoPersonOutline />}
                        onRemove={() =>
                            setTags(tags.filter((entry) => entry !== tag))
                        }
                    >
                        {tag}
                    </Chip>
                ))}
            </div>

            {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    All chips removed.
                </p>
            ) : null}
        </div>
    );
}

export const Removable: Story = {
    render: () => <RemovableChips />,
};
