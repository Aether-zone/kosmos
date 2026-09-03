import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
