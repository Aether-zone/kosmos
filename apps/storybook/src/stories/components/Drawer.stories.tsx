import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Field,
    FieldLabel,
    Input,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

const body = (
    <>
        <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
                Narrow the results shown in the table.
            </DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
            <div className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="drawer-search">Search</FieldLabel>
                    <Input id="drawer-search" placeholder="Search invoices" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="drawer-customer">Customer</FieldLabel>
                    <Input id="drawer-customer" placeholder="Any customer" />
                </Field>
            </div>
        </DrawerBody>

        <DrawerFooter>
            <DrawerClose className="inline-flex h-10 cursor-pointer items-center rounded-md px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                Cancel
            </DrawerClose>

            <Button>Apply</Button>
        </DrawerFooter>
    </>
);

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent>{body}</DrawerContent>
        </Drawer>
    ),
};

export const FromLeft: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent side="left">{body}</DrawerContent>
        </Drawer>
    ),
};

export const FromTop: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent side="top">{body}</DrawerContent>
        </Drawer>
    ),
};

export const FromBottom: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent side="bottom">{body}</DrawerContent>
        </Drawer>
    ),
};

export const Small: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent size="sm">{body}</DrawerContent>
        </Drawer>
    ),
};

export const Large: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent size="lg">{body}</DrawerContent>
        </Drawer>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Drawer defaultOpen>
            <DrawerTrigger asChild>
                <Button>Open drawer</Button>
            </DrawerTrigger>

            <DrawerContent>{body}</DrawerContent>
        </Drawer>
    ),
};

function ControlledDrawer() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-3">
            <Button onClick={() => setOpen(true)}>Open drawer</Button>

            <p className="text-sm text-muted-foreground">
                State: <strong className="text-foreground">{String(open)}</strong>
            </p>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>{body}</DrawerContent>
            </Drawer>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledDrawer />,
};
