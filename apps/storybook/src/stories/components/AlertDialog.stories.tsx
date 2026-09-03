import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AlertDialog, Button } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        tone: {
            control: 'select',
            options: ['default', 'destructive'],
        },
        busy: {
            control: 'boolean',
        },
    },
    args: {
        open: true,
        onOpenChange: () => {},
        onConfirm: () => {},
        title: 'Discard changes?',
        description:
            'Your edits have not been saved and will be lost.',
    },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
    args: {
        tone: 'destructive',
        title: 'Delete project?',
        description:
            'This permanently removes the project and everything in it. It cannot be undone.',
        confirmLabel: 'Delete',
    },
};

export const WithoutDescription: Story = {
    args: {
        description: undefined,
        title: 'Sign out of Kosmos?',
    },
};

export const CustomLabels: Story = {
    args: {
        title: 'Publish this release?',
        description: 'Everyone in the workspace will be notified.',
        confirmLabel: 'Publish now',
        cancelLabel: 'Not yet',
    },
};

export const Busy: Story = {
    args: {
        busy: true,
        tone: 'destructive',
        title: 'Deleting project…',
        description: 'This will take a moment.',
        confirmLabel: 'Delete',
    },
};

function InteractiveAlertDialog() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    return (
        <div className="space-y-3 text-center">
            <Button variant="destructive" onClick={() => setOpen(true)}>
                Delete project
            </Button>

            <p className="text-sm text-muted-foreground">
                {result ?? 'No decision yet.'}
            </p>

            <AlertDialog
                open={open}
                onOpenChange={setOpen}
                tone="destructive"
                title="Delete project?"
                description="This permanently removes the project and everything in it."
                confirmLabel="Delete"
                onConfirm={() => setResult('Deleted.')}
                onCancel={() => setResult('Cancelled.')}
            />
        </div>
    );
}

export const Interactive: Story = {
    render: () => <InteractiveAlertDialog />,
};
