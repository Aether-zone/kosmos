import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Menubar',
    component: Menubar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu value="file">
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem shortcut="⌘N">New file</MenubarItem>
                    <MenubarItem shortcut="⌘O">Open…</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem shortcut="⌘S">Save</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu value="edit">
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
                    <MenubarItem shortcut="⇧⌘Z">Redo</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem shortcut="⌘F">Find…</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu value="view">
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Zoom in</MenubarItem>
                    <MenubarItem>Zoom out</MenubarItem>
                    <MenubarItem>Reset zoom</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

export const WithDestructiveItem: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu value="project">
                <MenubarTrigger>Project</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Rename…</MenubarItem>
                    <MenubarItem>Duplicate</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem destructive>Delete project</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu value="edit">
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
                    <MenubarItem shortcut="⇧⌘Z" disabled>
                        Redo
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

function MenubarWithSelection() {
    const [action, setAction] = useState<string | null>(null);

    return (
        <div className="space-y-3 text-center">
            <Menubar>
                <MenubarMenu value="file">
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onSelect={() => setAction('New file')}>
                            New file
                        </MenubarItem>
                        <MenubarItem onSelect={() => setAction('Save')}>
                            Save
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu value="edit">
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onSelect={() => setAction('Undo')}>
                            Undo
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <p className="text-sm text-muted-foreground">
                {action ? `Chose: ${action}` : 'Nothing chosen yet.'}
            </p>
        </div>
    );
}

export const WithSelection: Story = {
    render: () => <MenubarWithSelection />,
};

/**
 * Regression: focus stayed on the trigger after opening, so the arrow keys
 * and Escape — handled on the portalled panel — never reached it.
 */
export const OpeningMovesFocusIntoTheMenu: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const file = canvas.getByRole('menuitem', { name: 'File' });

        await userEvent.click(file);

        const menu = await within(document.body).findByRole('menu');
        const items = within(menu).getAllByRole('menuitem');

        await waitFor(() => expect(items[0]).toHaveFocus());

        await userEvent.keyboard('{ArrowDown}');
        await expect(items[1]).toHaveFocus();

        await userEvent.keyboard('{Escape}');

        await waitFor(() =>
            expect(document.body.querySelector('[role="menu"]')).toBeNull(),
        );
        await expect(file).toHaveFocus();
    },
};
