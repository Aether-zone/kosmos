import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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

/**
 * `aria-modal="true"` asserts the rest of the page is inert, so focus must be
 * trapped and the background must not scroll. Both were missing.
 */
export const TrapsFocusAndLocksScroll: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole('button');

        await userEvent.click(trigger);

        const dialog = await within(document.body).findByRole('dialog');

        await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
        await expect(document.body.style.overflow).toBe('hidden');

        // Tab repeatedly: focus must never leave the dialog.
        for (let i = 0; i < 8; i += 1) {
            await userEvent.tab();
            await expect(dialog.contains(document.activeElement)).toBe(true);
        }

        await userEvent.keyboard('{Escape}');

        await waitFor(() =>
            expect(document.body.querySelector('[role="dialog"]')).toBeNull(),
        );
        // The lock and the caller's focus are both restored.
        await expect(document.body.style.overflow).toBe('');
        await expect(trigger).toHaveFocus();
    },
};

/**
 * A dialog taller than the viewport was centred by `items-center`, which pushed
 * it past the top edge as well as the bottom — its title was off screen with
 * no way to scroll back to it. The top must stay on screen and the rest must
 * scroll into reach.
 */
export const TallContentStaysReachable: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open a long dialog</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Terms of service</DialogTitle>
                    <DialogDescription>
                        Longer than any screen this renders on.
                    </DialogDescription>
                </DialogHeader>

                <div style={{ height: '3000px' }} />

                <DialogFooter>
                    <Button>Accept</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
    play: async ({ canvasElement }) => {
        await userEvent.click(within(canvasElement).getByRole('button'));

        const dialog = await within(document.body).findByRole('dialog');
        const title = within(dialog).getByRole('heading', {
            name: 'Terms of service',
        });
        const accept = within(dialog).getByRole('button', { name: 'Accept' });

        // Opening focuses Accept, the only control, which scrolls the overlay
        // to it. Let that settle before scrolling by hand, or it undoes ours.
        await waitFor(() => expect(accept).toHaveFocus());

        dialog.scrollTop = 0;

        await waitFor(() =>
            expect(title.getBoundingClientRect().top).toBeGreaterThanOrEqual(0),
        );

        dialog.scrollTop = dialog.scrollHeight;

        await waitFor(() =>
            expect(accept.getBoundingClientRect().bottom).toBeLessThanOrEqual(
                window.innerHeight,
            ),
        );
    },
};
