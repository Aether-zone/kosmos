import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoDocumentTextOutline,
    IoPersonOutline,
    IoSettingsOutline,
    IoTrashOutline,
} from 'react-icons/io5';

import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Command',
    component: Command,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = (
    <CommandList>
        <CommandEmpty />

        <CommandGroup heading="Navigation">
            <CommandItem icon={<IoDocumentTextOutline />} shortcut="⌘1">
                Go to documents
            </CommandItem>
            <CommandItem icon={<IoPersonOutline />} shortcut="⌘2">
                Go to profile
            </CommandItem>
            <CommandItem icon={<IoSettingsOutline />} shortcut="⌘3">
                Go to settings
            </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
            <CommandItem>Create new project</CommandItem>
            <CommandItem>Invite a teammate</CommandItem>
            <CommandItem icon={<IoTrashOutline />}>Delete project</CommandItem>
        </CommandGroup>
    </CommandList>
);

export const Inline: Story = {
    render: () => (
        <Command>
            <CommandInput />
            {items}
        </Command>
    ),
};

export const WithoutGroups: Story = {
    render: () => (
        <Command>
            <CommandInput placeholder="Search commands" />
            <CommandList>
                <CommandEmpty />
                <CommandItem>Create new project</CommandItem>
                <CommandItem>Invite a teammate</CommandItem>
                <CommandItem>Open settings</CommandItem>
            </CommandList>
        </Command>
    ),
};

export const CustomEmptyMessage: Story = {
    render: () => (
        <Command>
            <CommandInput />
            <CommandList>
                <CommandEmpty>Nothing matches that search.</CommandEmpty>
                <CommandItem>Create new project</CommandItem>
            </CommandList>
        </Command>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <Command>
            <CommandInput />
            <CommandList>
                <CommandEmpty />
                <CommandItem>Create new project</CommandItem>
                <CommandItem disabled>Publish (needs approval)</CommandItem>
            </CommandList>
        </Command>
    ),
};

function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [chosen, setChosen] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            <Button onClick={() => setOpen(true)}>Open command palette</Button>

            <p className="text-sm text-muted-foreground">
                {chosen ? `Ran: ${chosen}` : 'Nothing run yet.'}
            </p>

            <Command open={open} onOpenChange={setOpen}>
                <CommandInput />
                <CommandList>
                    <CommandEmpty />

                    <CommandGroup heading="Navigation">
                        <CommandItem
                            icon={<IoDocumentTextOutline />}
                            onSelect={() => setChosen('Go to documents')}
                        >
                            Go to documents
                        </CommandItem>
                        <CommandItem
                            icon={<IoSettingsOutline />}
                            onSelect={() => setChosen('Go to settings')}
                        >
                            Go to settings
                        </CommandItem>
                    </CommandGroup>

                    <CommandGroup heading="Actions">
                        <CommandItem
                            onSelect={() => setChosen('Create new project')}
                        >
                            Create new project
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}

export const AsModalPalette: Story = {
    render: () => <CommandPalette />,
};
