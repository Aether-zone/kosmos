import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    ToastProvider,
    useToast,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Toast',
    component: ToastProvider,
    tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastDemo() {
    const { toast } = useToast();

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                onClick={() =>
                    toast({
                        title: 'Changes saved',
                        description: 'Your changes have been saved successfully.',
                        variant: 'success',
                    })
                }
            >
                Success
            </Button>

            <Button
                variant="secondary"
                onClick={() =>
                    toast({
                        title: 'Heads up',
                        description: 'You have unsaved changes.',
                        variant: 'warning',
                    })
                }
            >
                Warning
            </Button>

            <Button
                variant="destructive"
                onClick={() =>
                    toast({
                        title: 'Something went wrong',
                        description: 'We could not save your changes.',
                        variant: 'destructive',
                    })
                }
            >
                Destructive
            </Button>

            <Button
                variant="outline"
                onClick={() =>
                    toast({
                        title: 'Notification',
                        description: 'This is a default notification.',
                    })
                }
            >
                Default
            </Button>
        </div>
    );
}

export const Default: Story = {
    render: () => (
        <ToastProvider>
            <ToastDemo />
        </ToastProvider>
    ),
};

export const Success: Story = {
    render: () => (
        <ToastProvider>
            <Button
                onClick={() => {
                    // ToastDemo handles the interaction in the combined example.
                }}
            >
                Show success toast
            </Button>

            <ToastDemo />
        </ToastProvider>
    ),
};

export const Variants: Story = {
    render: () => (
        <ToastProvider>
            <ToastDemo />
        </ToastProvider>
    ),
};

export const LongContent: Story = {
    render: () => {
        function Demo() {
            const { toast } = useToast();

            return (
                <Button
                    onClick={() =>
                        toast({
                            title: 'Long notification',
                            description:
                                'This is a longer notification message that demonstrates how toast content behaves when there is more text than usual.',
                        })
                    }
                >
                    Show notification
                </Button>
            );
        }

        return (
            <ToastProvider>
                <Demo />
            </ToastProvider>
        );
    },
};

export const Persistent: Story = {
    render: () => {
        function Demo() {
            const { toast } = useToast();

            return (
                <Button
                    onClick={() =>
                        toast({
                            title: 'Persistent notification',
                            description:
                                'This toast will remain visible until you dismiss it.',
                            duration: 0,
                        })
                    }
                >
                    Show persistent toast
                </Button>
            );
        }

        return (
            <ToastProvider>
                <Demo />
            </ToastProvider>
        );
    },
};

export const Multiple: Story = {
    render: () => {
        function Demo() {
            const { toast } = useToast();

            return (
                <Button
                    onClick={() => {
                        toast({
                            title: 'First notification',
                            description: 'This is the first toast.',
                        });

                        toast({
                            title: 'Second notification',
                            description: 'This is the second toast.',
                            variant: 'success',
                        });

                        toast({
                            title: 'Third notification',
                            description: 'This is the third toast.',
                            variant: 'warning',
                        });
                    }}
                >
                    Show multiple
                </Button>
            );
        }

        return (
            <ToastProvider>
                <Demo />
            </ToastProvider>
        );
    },
};
