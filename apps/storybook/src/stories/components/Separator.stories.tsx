import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Separator',
    component: Separator,
    tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className="w-full max-w-md space-y-4">
            <div>
                <h3 className="font-medium text-foreground">
                    Section one
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Content above the separator.
                </p>
            </div>

            <Separator />

            <div>
                <h3 className="font-medium text-foreground">
                    Section two
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Content below the separator.
                </p>
            </div>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div className="flex h-8 items-center gap-4">
            <span className="text-sm text-foreground">
                Home
            </span>

            <Separator orientation="vertical" />

            <span className="text-sm text-foreground">
                Settings
            </span>

            <Separator orientation="vertical" />

            <span className="text-sm text-foreground">
                Profile
            </span>
        </div>
    ),
};

export const WithContent: Story = {
    render: () => (
        <div className="flex w-full max-w-md items-center gap-4">
            <Separator className="flex-1" />

            <span className="text-sm text-muted-foreground">
                or
            </span>

            <Separator className="flex-1" />
        </div>
    ),
};

export const Navigation: Story = {
    render: () => (
        <nav className="flex items-center gap-3">
            <a
                href="#"
                className="text-sm text-foreground hover:underline"
            >
                Overview
            </a>

            <Separator orientation="vertical" className="h-4" />

            <a
                href="#"
                className="text-sm text-foreground hover:underline"
            >
                Activity
            </a>

            <Separator orientation="vertical" className="h-4" />

            <a
                href="#"
                className="text-sm text-foreground hover:underline"
            >
                Settings
            </a>
        </nav>
    ),
};

export const InCard: Story = {
    render: () => (
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
            <div>
                <h3 className="font-medium text-foreground">
                    Account
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account settings.
                </p>
            </div>

            <Separator className="my-4" />

            <div>
                <h3 className="font-medium text-foreground">
                    Security
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your security preferences.
                </p>
            </div>
        </div>
    ),
};
