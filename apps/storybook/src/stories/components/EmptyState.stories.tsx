import type { Meta, StoryObj } from '@storybook/react-vite';

import { IoFolderOpenOutline, IoSearchOutline } from 'react-icons/io5';

import { Button, EmptyState } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        bordered: {
            control: 'boolean',
        },
    },
    args: {
        title: 'No projects yet',
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
    args: {
        description:
            'Projects you create will appear here. Start by adding your first one.',
    },
};

export const WithAction: Story = {
    args: {
        description:
            'Projects you create will appear here. Start by adding your first one.',
        action: <Button>Create project</Button>,
    },
};

export const WithIcon: Story = {
    args: {
        icon: <IoFolderOpenOutline className="size-5" />,
        description:
            'Projects you create will appear here. Start by adding your first one.',
        action: <Button>Create project</Button>,
    },
};

export const Bordered: Story = {
    args: {
        icon: <IoFolderOpenOutline className="size-5" />,
        description: 'Nothing here yet.',
        action: <Button variant="outline">Create project</Button>,
        bordered: true,
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        icon: <IoFolderOpenOutline className="size-4" />,
        description: 'Nothing here yet.',
        bordered: true,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        icon: <IoFolderOpenOutline className="size-6" />,
        description: 'Nothing here yet.',
        action: <Button>Create project</Button>,
        bordered: true,
    },
};

export const SearchResults: Story = {
    args: {
        icon: <IoSearchOutline className="size-5" />,
        title: 'No results found',
        description: 'Try a different search term or clear your filters.',
        action: <Button variant="ghost">Clear filters</Button>,
        bordered: true,
    },
};
