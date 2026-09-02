import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className="flex min-h-32 items-center justify-center">
            <Tooltip>
                <TooltipTrigger>
                    <Button variant="outline">Hover me</Button>
                </TooltipTrigger>

                <TooltipContent>
                    This is a tooltip.
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const WithText: Story = {
    render: () => (
        <div className="flex min-h-32 items-center justify-center">
            <Tooltip>
                <TooltipTrigger>
                    <span className="text-sm font-medium text-foreground underline decoration-dotted">
                        What is this?
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    Additional information about this feature.
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <div className="flex min-h-32 items-center justify-center">
            <Tooltip>
                <TooltipTrigger aria-label="More information">
                    <span className="flex size-8 items-center justify-center rounded-full border border-border text-sm text-foreground">
                        ?
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    More information
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const LongContent: Story = {
    render: () => (
        <div className="flex min-h-32 items-center justify-center">
            <Tooltip>
                <TooltipTrigger>
                    <Button variant="ghost">Hover for details</Button>
                </TooltipTrigger>

                <TooltipContent>
                    This tooltip contains a longer explanation that demonstrates
                    how the content wraps when it reaches the maximum width.
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const KeyboardFocus: Story = {
    render: () => (
        <div className="flex min-h-32 items-center justify-center">
            <Tooltip>
                <TooltipTrigger>
                    <Button variant="secondary">
                        Focus me with Tab
                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    The tooltip also appears when the trigger receives focus.
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};
