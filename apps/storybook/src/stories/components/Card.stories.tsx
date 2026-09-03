import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Manage your account settings.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-foreground">
                    Update your account information and preferences.
                </p>
            </CardContent>

            <CardFooter>
                <Button>Save changes</Button>
            </CardFooter>
        </Card>
    ),
};

export const ContentOnly: Story = {
    render: () => (
        <Card className="w-96">
            <CardContent className="pt-6">
                <p className="text-sm text-foreground">
                    A simple card containing only content.
                </p>
            </CardContent>
        </Card>
    ),
};

export const WithHeader: Story = {
    render: () => (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Configure how you receive notifications.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-foreground">
                    Notification settings go here.
                </p>
            </CardContent>
        </Card>
    ),
};

export const WithFooter: Story = {
    render: () => (
        <Card className="w-96">
            <CardContent className="pt-6">
                <p className="text-sm text-foreground">
                    Are you sure you want to continue?
                </p>
            </CardContent>

            <CardFooter className="justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Continue</Button>
            </CardFooter>
        </Card>
    ),
};

export const Composition: Story = {
    render: () => (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Project status</CardTitle>
                <CardDescription>
                    Current status of your project.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>

                    <span className="text-sm font-medium text-foreground">
                        Active
                    </span>
                </div>
            </CardContent>

            <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">
                    Updated just now
                </span>

                <Button size="sm">View</Button>
            </CardFooter>
        </Card>
    ),
};
