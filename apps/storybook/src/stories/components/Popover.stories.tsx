import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Field,
    FieldLabel,
    Input,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger>Open popover</PopoverTrigger>

            <PopoverContent>
                <p className="text-sm text-muted-foreground">
                    Popovers hold supporting content. The page behind stays
                    live, so they are not for anything that must be answered.
                </p>
            </PopoverContent>
        </Popover>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger>Edit name</PopoverTrigger>

            <PopoverContent className="w-72">
                <div className="space-y-3">
                    <Field>
                        <FieldLabel htmlFor="popover-name">Name</FieldLabel>
                        <Input id="popover-name" defaultValue="Ada Lovelace" />
                    </Field>

                    <div className="flex justify-end gap-2">
                        <PopoverClose className="inline-flex h-8 cursor-pointer items-center rounded-md px-3 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                            Cancel
                        </PopoverClose>

                        <Button size="sm">Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const Sides: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                <Popover key={side}>
                    <PopoverTrigger>{side}</PopoverTrigger>
                    <PopoverContent side={side}>
                        <p className="text-sm">Placed on the {side}.</p>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    ),
};

export const Aligned: Story = {
    render: () => (
        <div className="flex gap-4">
            {(['start', 'center', 'end'] as const).map((align) => (
                <Popover key={align}>
                    <PopoverTrigger>{align}</PopoverTrigger>
                    <PopoverContent align={align}>
                        <p className="text-sm">Aligned {align}.</p>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    ),
};

export const MatchTriggerWidth: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger className="w-72">
                A wide trigger
            </PopoverTrigger>

            <PopoverContent matchTriggerWidth>
                <p className="text-sm text-muted-foreground">
                    This panel matches the trigger's width.
                </p>
            </PopoverContent>
        </Popover>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Popover defaultOpen>
            <PopoverTrigger>Open popover</PopoverTrigger>

            <PopoverContent>
                <p className="text-sm text-muted-foreground">
                    Open on mount.
                </p>
            </PopoverContent>
        </Popover>
    ),
};

/**
 * Portalled, so the panel is not clipped by an ancestor's `overflow`.
 */
export const InsideOverflowContainer: Story = {
    render: () => (
        <div className="h-28 w-72 overflow-hidden rounded-md border border-border bg-surface p-4">
            <p className="mb-3 text-sm text-muted-foreground">
                This box clips its content.
            </p>

            <Popover>
                <PopoverTrigger>Open popover</PopoverTrigger>
                <PopoverContent>
                    <p className="text-sm">Not clipped.</p>
                </PopoverContent>
            </Popover>
        </div>
    ),
};
