import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

/**
 * Regression: focus never entered the menu, so its arrow keys and Escape did
 * nothing. The browser settles focus on <body> while handling the opening
 * click, after React's effects have run, so the move has to be deferred.
 */
export const OpensAtCursorAndTakesFocus: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const trigger = canvasElement.firstElementChild as HTMLElement;

        await userEvent.pointer({ target: trigger, keys: '[MouseRight]' });

        const menu = await within(document.body).findByRole('menu');
        const items = within(menu).getAllByRole('menuitem');

        await expect(menu.parentElement).toBe(document.body);

        // Focus is deferred a frame past the opening click; see the component.
        await waitFor(() => expect(items[0]).toHaveFocus());

        await userEvent.keyboard('{ArrowDown}');
        await expect(items[1]).toHaveFocus();

        await userEvent.keyboard('{Escape}');
        await expect(document.body.querySelector('[role="menu"]')).toBeNull();
    },
};
