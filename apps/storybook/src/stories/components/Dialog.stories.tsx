import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Dialog',
    component: Dialog,
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open dialog</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Information: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View information</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Information</DialogTitle>
                    <DialogDescription>
                        Your account is currently active and everything is
                        working normally.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button>Got it</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Form: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit profile</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="dialog-name"
                            className="text-sm font-medium text-foreground"
                        >
                            Name
                        </label>

                        <input
                            id="dialog-name"
                            defaultValue="John Doe"
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="dialog-email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email
                        </label>

                        <input
                            id="dialog-email"
                            type="email"
                            defaultValue="john@example.com"
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Dialog defaultOpen>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Welcome to Kosmos</DialogTitle>
                    <DialogDescription>
                        This dialog is open by default.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
