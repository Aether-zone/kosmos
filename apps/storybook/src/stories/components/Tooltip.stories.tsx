import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

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

/**
 * Regression: the content was `absolute` with no positioned ancestor, so it
 * landed hundreds of pixels from its trigger. It is portalled now, and
 * positioned by measurement.
 */
export const PositionedAgainstTrigger: Story = {
    render: Default.render,
    play: async ({ canvasElement }) => {
        const trigger = canvasElement.querySelector('[tabindex="0"]')!;

        await userEvent.hover(trigger);

        const tooltip = await within(document.body).findByRole('tooltip');

        await expect(tooltip.parentElement).toBe(document.body);
        await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);

        const trigRect = trigger.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();

        // Directly below the trigger, and horizontally centred on it.
        await expect(tipRect.top).toBeGreaterThan(trigRect.bottom - 1);
        await expect(tipRect.top - trigRect.bottom).toBeLessThan(24);
        await expect(
            Math.abs(
                tipRect.left + tipRect.width / 2 -
                    (trigRect.left + trigRect.width / 2),
            ),
        ).toBeLessThan(2);
    },
};
