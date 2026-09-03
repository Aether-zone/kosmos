import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['single', 'multiple'],
        },
        collapsible: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = (
    <>
        <AccordionItem value="shipping">
            <AccordionTrigger>How long does shipping take?</AccordionTrigger>
            <AccordionContent>
                Orders are dispatched within one working day and usually arrive
                within three to five days.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns">
            <AccordionTrigger>What is the return policy?</AccordionTrigger>
            <AccordionContent>
                Anything unused can be returned within thirty days for a full
                refund.
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
            <AccordionTrigger>How do I contact support?</AccordionTrigger>
            <AccordionContent>
                Support is available by email on weekdays, and replies within
                one working day.
            </AccordionContent>
        </AccordionItem>
    </>
);

export const Default: Story = {
    args: {
        defaultValue: ['shipping'],
        children: items,
    },
};

export const AllClosed: Story = {
    args: {
        children: items,
    },
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
        defaultValue: ['shipping', 'returns'],
        children: items,
    },
};

export const NotCollapsible: Story = {
    args: {
        collapsible: false,
        defaultValue: ['shipping'],
        children: items,
    },
};

export const WithDisabledItem: Story = {
    args: {
        defaultValue: ['shipping'],
        children: (
            <>
                <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping</AccordionTrigger>
                    <AccordionContent>
                        Dispatched within one working day.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="returns" disabled>
                    <AccordionTrigger>Returns (unavailable)</AccordionTrigger>
                    <AccordionContent>
                        Thirty-day returns.
                    </AccordionContent>
                </AccordionItem>
            </>
        ),
    },
};

function ControlledAccordion() {
    const [open, setOpen] = useState<string[]>(['returns']);

    return (
        <div className="space-y-3">
            <Accordion type="multiple" value={open} onValueChange={setOpen}>
                {items}
            </Accordion>

            <p className="text-sm text-muted-foreground">
                Open:{' '}
                <strong className="text-foreground">
                    {open.length ? open.join(', ') : 'none'}
                </strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledAccordion />,
};
