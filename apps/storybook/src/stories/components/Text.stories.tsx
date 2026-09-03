import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Text',
    component: Text,
    tags: ['autodocs'],
    argTypes: {
        as: {
            control: 'select',
            options: ['p', 'span', 'div', 'small', 'strong', 'em'],
        },
        size: {
            control: 'select',
            options: ['body', 'body-small', 'label'],
        },
        weight: {
            control: 'select',
            options: ['normal', 'medium', 'semibold', 'bold'],
        },
        tone: {
            control: 'select',
            options: [
                'default',
                'muted',
                'primary',
                'success',
                'warning',
                'destructive',
            ],
        },
        align: {
            control: 'select',
            options: ['start', 'center', 'end'],
        },
    },
    args: {
        children: 'The quick brown fox jumps over the lazy dog.',
    },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => (
        <div className="space-y-2">
            <Text size="body">Body — the default reading size.</Text>
            <Text size="body-small">Body small — secondary copy.</Text>
            <Text size="label">Label — form and UI labels.</Text>
        </div>
    ),
};

export const Weights: Story = {
    render: () => (
        <div className="space-y-2">
            <Text weight="normal">Normal weight</Text>
            <Text weight="medium">Medium weight</Text>
            <Text weight="semibold">Semibold weight</Text>
            <Text weight="bold">Bold weight</Text>
        </div>
    ),
};

export const Tones: Story = {
    render: () => (
        <div className="space-y-2">
            <Text tone="default">Default tone</Text>
            <Text tone="muted">Muted tone</Text>
            <Text tone="primary">Primary tone</Text>
            <Text tone="success">Success tone</Text>
            <Text tone="warning">Warning tone</Text>
            <Text tone="destructive">Destructive tone</Text>
        </div>
    ),
};

export const Alignment: Story = {
    render: () => (
        <div className="space-y-2 rounded-md border border-border p-3">
            <Text align="start">Start aligned</Text>
            <Text align="center">Centre aligned</Text>
            <Text align="end">End aligned</Text>
        </div>
    ),
};

export const Truncated: Story = {
    args: {
        truncate: true,
        children:
            'A single line of text that is far too long for its container and therefore gets truncated with an ellipsis.',
    },
};

export const LineClamped: Story = {
    args: {
        lineClamp: 2,
        children:
            'Kosmos keeps its typography in semantic tokens rather than a raw scale, so a component asks for body text or a label rather than a pixel size. That indirection is what lets the whole system be retuned from one place, and this paragraph exists purely to be long enough to clamp.',
    },
};

export const Italic: Story = {
    args: {
        italic: true,
    },
};

export const AsSpan: Story = {
    args: {
        as: 'span',
        children: 'Rendered as a span, so it flows inline.',
    },
};
