import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Toolbar',
    component: Toolbar,
    tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

const BoldIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
    >
        <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
        <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
    </svg>
);

const ItalicIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
    >
        <path d="M10 4h8" />
        <path d="M6 20h8" />
        <path d="M14 4 10 20" />
    </svg>
);

const LinkIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
    >
        <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
        <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
    </svg>
);

export const Default: Story = {
    render: () => (
        <Toolbar>
            <ToolbarButton icon={<BoldIcon />}>
                Bold
            </ToolbarButton>

            <ToolbarButton icon={<ItalicIcon />}>
                Italic
            </ToolbarButton>

            <ToolbarButton icon={<LinkIcon />}>
                Link
            </ToolbarButton>
        </Toolbar>
    ),
};

export const Groups: Story = {
    render: () => (
        <Toolbar>
            <ToolbarGroup>
                <ToolbarButton icon={<BoldIcon />}>
                    Bold
                </ToolbarButton>

                <ToolbarButton icon={<ItalicIcon />}>
                    Italic
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
                <ToolbarButton icon={<LinkIcon />}>
                    Link
                </ToolbarButton>
            </ToolbarGroup>
        </Toolbar>
    ),
};

export const IconOnly: Story = {
    render: () => (
        <Toolbar>
            <ToolbarButton
                icon={<BoldIcon />}
                aria-label="Bold"
            />

            <ToolbarButton
                icon={<ItalicIcon />}
                aria-label="Italic"
            />

            <ToolbarButton
                icon={<LinkIcon />}
                aria-label="Insert link"
            />
        </Toolbar>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Toolbar>
            <ToolbarButton icon={<BoldIcon />}>
                Bold
            </ToolbarButton>

            <ToolbarButton
                icon={<ItalicIcon />}
                disabled
            >
                Italic
            </ToolbarButton>

            <ToolbarButton icon={<LinkIcon />}>
                Link
            </ToolbarButton>
        </Toolbar>
    ),
};

export const Vertical: Story = {
    render: () => (
        <Toolbar orientation="vertical">
            <ToolbarButton
                icon={<BoldIcon />}
                aria-label="Bold"
            />

            <ToolbarButton
                icon={<ItalicIcon />}
                aria-label="Italic"
            />

            <ToolbarButton
                icon={<LinkIcon />}
                aria-label="Insert link"
            />
        </Toolbar>
    ),
};

export const Editor: Story = {
    render: () => (
        <div className="w-full max-w-2xl space-y-4">
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarButton icon={<BoldIcon />}>
                        Bold
                    </ToolbarButton>

                    <ToolbarButton icon={<ItalicIcon />}>
                        Italic
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton icon={<LinkIcon />}>
                        Link
                    </ToolbarButton>
                </ToolbarGroup>
            </Toolbar>

            <div className="min-h-32 rounded-md border border-input bg-background p-4">
                <p className="text-sm text-muted-foreground">
                    Select some text and use the toolbar to format it.
                </p>
            </div>
        </div>
    ),
};
