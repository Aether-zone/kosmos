import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-full">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
                <div className="rounded-md border border-border bg-surface p-4">
                    <h3 className="font-medium text-foreground">
                        Account
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
            </TabsContent>

            <TabsContent value="password">
                <div className="rounded-md border border-border bg-surface p-4">
                    <h3 className="font-medium text-foreground">
                        Password
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Change your password and security settings.
                    </p>
                </div>
            </TabsContent>
        </Tabs>
    ),
};

export const ThreeTabs: Story = {
    render: () => (
        <Tabs defaultValue="overview">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
                <p className="text-sm text-muted-foreground">
                    Overview content.
                </p>
            </TabsContent>

            <TabsContent value="activity">
                <p className="text-sm text-muted-foreground">
                    Recent activity appears here.
                </p>
            </TabsContent>

            <TabsContent value="settings">
                <p className="text-sm text-muted-foreground">
                    Application settings appear here.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const LongLabels: Story = {
    render: () => (
        <Tabs defaultValue="personal">
            <TabsList>
                <TabsTrigger value="personal">
                    Personal information
                </TabsTrigger>
                <TabsTrigger value="notifications">
                    Notifications
                </TabsTrigger>
                <TabsTrigger value="security">
                    Security settings
                </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
                <p className="text-sm text-muted-foreground">
                    Manage your personal information.
                </p>
            </TabsContent>

            <TabsContent value="notifications">
                <p className="text-sm text-muted-foreground">
                    Configure your notification preferences.
                </p>
            </TabsContent>

            <TabsContent value="security">
                <p className="text-sm text-muted-foreground">
                    Manage authentication and security options.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Tabs defaultValue="profile" className="max-w-lg">
            <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            defaultValue="John Doe"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            defaultValue="john@example.com"
                        />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="preferences">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Configure your application preferences.
                    </p>

                    <label className="flex items-center gap-2 text-sm text-foreground">
                        <input type="checkbox" defaultChecked />
                        Enable notifications
                    </label>
                </div>
            </TabsContent>
        </Tabs>
    ),
};

function ControlledTabs() {
    const [value, setValue] = useState('account');

    return (
        <div className="space-y-4">
            <Tabs value={value} onValueChange={setValue}>
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <p className="text-sm text-muted-foreground">
                        Account settings.
                    </p>
                </TabsContent>

                <TabsContent value="security">
                    <p className="text-sm text-muted-foreground">
                        Security settings.
                    </p>
                </TabsContent>
            </Tabs>

            <p className="text-sm text-muted-foreground">
                Active tab: <strong className="text-foreground">{value}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledTabs />,
};

/**
 * Regression: only the selected tab is in the tab order, so without an arrow
 * handler the others could not be reached by keyboard at all.
 */
export const ArrowKeysReachEveryTab: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const [first, second] = canvas.getAllByRole('tab');

        first.focus();
        await expect(first).toHaveAttribute('aria-selected', 'true');
        await expect(second).toHaveAttribute('tabindex', '-1');

        await userEvent.keyboard('{ArrowRight}');
        await expect(second).toHaveAttribute('aria-selected', 'true');

        await userEvent.keyboard('{Home}');
        await expect(first).toHaveAttribute('aria-selected', 'true');

        // The panel must follow the selection.
        await expect(canvas.getByRole('tabpanel')).toHaveAttribute(
            'aria-labelledby',
            first.id,
        );
    },
};
