import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    args: {
        page: 1,
        pageCount: 10,
        onPageChange: () => {},
    },
    decorators: [
        (Story) => (
            <div className="w-[36rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MiddlePage: Story = {
    args: {
        page: 5,
    },
};

export const LastPage: Story = {
    args: {
        page: 10,
    },
};

export const FewPages: Story = {
    args: {
        page: 2,
        pageCount: 3,
    },
};

export const SinglePage: Story = {
    args: {
        page: 1,
        pageCount: 1,
    },
};

export const ManySiblings: Story = {
    args: {
        page: 8,
        pageCount: 20,
        siblingCount: 2,
    },
};

export const Disabled: Story = {
    args: {
        page: 4,
        disabled: true,
    },
};

function ControlledPagination() {
    const [page, setPage] = useState(1);

    return (
        <div className="space-y-3">
            <Pagination page={page} pageCount={12} onPageChange={setPage} />

            <p className="text-sm text-muted-foreground">
                Page <strong className="text-foreground">{page}</strong> of 12
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledPagination />,
};
