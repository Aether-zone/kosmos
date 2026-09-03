import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
    Dropdown,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
    DropdownSeparator,
    DropdownTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dropdown>
            <DropdownTrigger>Options</DropdownTrigger>

            <DropdownMenu>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Keyboard shortcuts</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    ),
};

export const WithLabelAndSeparator: Story = {
    render: () => (
        <Dropdown>
            <DropdownTrigger>Account</DropdownTrigger>

            <DropdownMenu>
                <DropdownLabel>Signed in as Ada</DropdownLabel>

                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Billing</DropdownItem>

                <DropdownSeparator />

                <DropdownItem destructive>Sign out</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    ),
};

export const AlignedToEnd: Story = {
    render: () => (
        <Dropdown>
            <DropdownTrigger>Aligned end</DropdownTrigger>

            <DropdownMenu align="end">
                <DropdownItem>Duplicate</DropdownItem>
                <DropdownItem>Rename</DropdownItem>
                <DropdownItem>Archive</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <Dropdown>
            <DropdownTrigger>Actions</DropdownTrigger>

            <DropdownMenu>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem disabled>Publish</DropdownItem>
                <DropdownItem>Duplicate</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Dropdown defaultOpen>
            <DropdownTrigger>Options</DropdownTrigger>

            <DropdownMenu>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownSeparator />
                <DropdownItem destructive>Sign out</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    ),
};

/**
 * The menu is portalled to the document body, so it is not clipped by an
 * ancestor's `overflow`. Before that it was cut off inside any scrolling or
 * overflow-hidden container.
 */
export const InsideOverflowContainer: Story = {
    render: () => (
        <div className="h-28 w-72 overflow-hidden rounded-md border border-border bg-surface p-4">
            <p className="mb-3 text-sm text-muted-foreground">
                This box clips its content.
            </p>

            <Dropdown>
                <DropdownTrigger>Options</DropdownTrigger>

                <DropdownMenu>
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Sign out</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    ),
};

/**
 * The menu is portalled, so "inside" spans two detached trees — closing on an
 * outside press has to account for both.
 */
export const KeyboardNavigation: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const trigger = within(canvasElement).getByRole('button');

        trigger.focus();
        await userEvent.keyboard('{ArrowDown}');

        const menu = await within(document.body).findByRole('menu');
        await expect(menu.parentElement).toBe(document.body);

        const items = within(menu).getAllByRole('menuitem');

        // Focus moves a frame after the portal mounts.
        await waitFor(() => expect(items[0]).toHaveFocus());

        await userEvent.keyboard('{ArrowDown}');
        await expect(items[1]).toHaveFocus();

        await userEvent.keyboard('{End}');
        await expect(items[items.length - 1]).toHaveFocus();

        await userEvent.keyboard('{Escape}');
        await expect(document.body.querySelector('[role="menu"]')).toBeNull();
        await expect(trigger).toHaveFocus();
    },
};
