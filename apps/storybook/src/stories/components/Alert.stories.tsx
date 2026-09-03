import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'success', 'warning', 'destructive'],
        },
    },
    args: {
        children: (
            <>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                    This is an informational message.
                </AlertDescription>
            </>
        ),
    },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
    args: {
        variant: 'success',
        children: (
            <>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    Your changes have been saved successfully.
                </AlertDescription>
            </>
        ),
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        children: (
            <>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    Your account is approaching its usage limit.
                </AlertDescription>
            </>
        ),
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: (
            <>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Something went wrong. Please try again.
                </AlertDescription>
            </>
        ),
    },
};

export const TitleOnly: Story = {
    render: () => (
        <Alert>
            <AlertTitle>Information</AlertTitle>
        </Alert>
    ),
};

export const DescriptionOnly: Story = {
    render: () => (
        <Alert>
            <AlertDescription>
                Your session will expire in 10 minutes.
            </AlertDescription>
        </Alert>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-96 flex-col gap-4">
            <Alert>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                    This is an informational message.
                </AlertDescription>
            </Alert>

            <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    Your changes have been saved successfully.
                </AlertDescription>
            </Alert>

            <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    Your account is approaching its usage limit.
                </AlertDescription>
            </Alert>

            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Something went wrong. Please try again.
                </AlertDescription>
            </Alert>
        </div>
    ),
};

/**
 * Regression: the tinted variants used `text-*-foreground`, which is the
 * colour for a *solid* fill — white for success and destructive — leaving the
 * title invisible on a 10% tint.
 */
export const TintedVariantsKeepReadableText: Story = {
    render: () => (
        <div className="flex w-96 flex-col gap-3">
            <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
            </Alert>
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
            </Alert>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const titles = within(canvasElement).getAllByRole('alert');

        for (const alert of titles) {
            const title = alert.querySelector('h5')!;

            // --kosmos-color-foreground in the light theme, never white.
            await expect(getComputedStyle(title).color).toBe('rgb(23, 23, 23)');
        }
    },
};
