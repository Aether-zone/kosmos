import type { Meta, StoryObj } from '@storybook/react-vite';
import { IoLinkOutline, IoListOutline, IoTextOutline } from 'react-icons/io5';

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

export const Default: Story = {
    render: () => (
        <Toolbar>
            <ToolbarButton icon={<IoTextOutline />}>
                Text
            </ToolbarButton>

            <ToolbarButton icon={<IoListOutline />}>
                List
            </ToolbarButton>

            <ToolbarButton icon={<IoLinkOutline />}>
                Link
            </ToolbarButton>
        </Toolbar>
    ),
};

export const Groups: Story = {
    render: () => (
        <Toolbar>
            <ToolbarGroup>
                <ToolbarButton icon={<IoTextOutline />}>
                    Text
                </ToolbarButton>

                <ToolbarButton icon={<IoListOutline />}>
                    List
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
                <ToolbarButton icon={<IoLinkOutline />}>
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
                icon={<IoTextOutline />}
                aria-label="Text"
            />

            <ToolbarButton
                icon={<IoListOutline />}
                aria-label="List"
            />

            <ToolbarButton
                icon={<IoLinkOutline />}
                aria-label="Insert link"
            />
        </Toolbar>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Toolbar>
            <ToolbarButton icon={<IoTextOutline />}>
                Text
            </ToolbarButton>

            <ToolbarButton
                icon={<IoListOutline />}
                disabled
            >
                List
            </ToolbarButton>

            <ToolbarButton icon={<IoLinkOutline />}>
                Link
            </ToolbarButton>
        </Toolbar>
    ),
};

export const Vertical: Story = {
    render: () => (
        <Toolbar orientation="vertical">
            <ToolbarButton
                icon={<IoTextOutline />}
                aria-label="Text"
            />

            <ToolbarButton
                icon={<IoListOutline />}
                aria-label="List"
            />

            <ToolbarButton
                icon={<IoLinkOutline />}
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
                    <ToolbarButton icon={<IoTextOutline />}>
                        Bold
                    </ToolbarButton>

                    <ToolbarButton icon={<IoListOutline />}>
                        Italic
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton icon={<IoLinkOutline />}>
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
