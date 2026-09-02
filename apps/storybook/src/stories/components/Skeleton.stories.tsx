import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Skeleton className="h-4 w-48" />
    ),
};

export const Text: Story = {
    render: () => (
        <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
        </div>
    ),
};

export const Avatar: Story = {
    render: () => (
        <Skeleton className="size-12 rounded-full" />
    ),
};

export const Card: Story = {
    render: () => (
        <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />

                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            <Skeleton className="h-10 w-24" />
        </div>
    ),
};

export const Table: Story = {
    render: () => (
        <div className="w-full max-w-2xl space-y-3">
            <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
            </div>

            <Skeleton className="h-px w-full" />

            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4"
                >
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    ),
};

export const Profile: Story = {
    render: () => (
        <div className="flex w-full max-w-md items-center gap-4">
            <Skeleton className="size-16 rounded-full" />

            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
        </div>
    ),
};
