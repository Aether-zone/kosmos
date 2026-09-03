import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoCopyOutline,
    IoCutOutline,
    IoDuplicateOutline,
    IoTrashOutline,
} from 'react-icons/io5';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/ContextMenu',
    component: ContextMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const surface =
    'flex h-40 w-80 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground';

export const Default: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger className={surface}>
                Right-click here
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem>Cut</ContextMenuItem>
                <ContextMenuItem>Copy</ContextMenuItem>
                <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};

export const WithIconsAndShortcuts: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger className={surface}>
                Right-click here
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuLabel>Edit</ContextMenuLabel>

                <ContextMenuItem icon={<IoCutOutline />} shortcut="⌘X">
                    Cut
                </ContextMenuItem>
                <ContextMenuItem icon={<IoCopyOutline />} shortcut="⌘C">
                    Copy
                </ContextMenuItem>
                <ContextMenuItem icon={<IoDuplicateOutline />} shortcut="⌘D">
                    Duplicate
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem
                    destructive
                    icon={<IoTrashOutline />}
                    shortcut="⌫"
                >
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger className={surface}>
                Right-click here
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem>Cut</ContextMenuItem>
                <ContextMenuItem disabled>Paste</ContextMenuItem>
                <ContextMenuItem>Select all</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};
