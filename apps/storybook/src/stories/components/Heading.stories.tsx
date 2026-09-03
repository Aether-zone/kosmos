import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading, Text } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Heading',
    component: Heading,
    tags: ['autodocs'],
    argTypes: {
        level: {
            control: 'select',
            options: [1, 2, 3, 4, 5, 6],
        },
        size: {
            control: 'select',
            options: ['display', 'heading-large', 'heading', 'heading-small'],
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
    },
    args: {
        children: 'Design tokens all the way down',
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
    render: () => (
        <div className="space-y-3">
            <Heading level={1}>Level 1 — display</Heading>
            <Heading level={2}>Level 2 — heading large</Heading>
            <Heading level={3}>Level 3 — heading</Heading>
            <Heading level={4}>Level 4 — heading small</Heading>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="space-y-3">
            <Heading size="display">Display</Heading>
            <Heading size="heading-large">Heading large</Heading>
            <Heading size="heading">Heading</Heading>
            <Heading size="heading-small">Heading small</Heading>
        </div>
    ),
};

/**
 * Level and size are independent, so a page can keep a correct heading
 * outline without being forced into a matching type scale.
 */
export const LevelWithSmallerSize: Story = {
    args: {
        level: 2,
        size: 'heading-small',
        children: 'An h2 that looks small',
    },
};

export const Tones: Story = {
    render: () => (
        <div className="space-y-2">
            <Heading level={3} tone="default">Default</Heading>
            <Heading level={3} tone="muted">Muted</Heading>
            <Heading level={3} tone="primary">Primary</Heading>
            <Heading level={3} tone="destructive">Destructive</Heading>
        </div>
    ),
};

export const Truncated: Story = {
    args: {
        level: 3,
        truncate: true,
        children:
            'A heading long enough that it has to be truncated inside its container',
    },
};

export const WithBodyCopy: Story = {
    render: () => (
        <div className="space-y-3">
            <Heading level={1}>Kosmos</Heading>
            <Text tone="muted">
                A React design system built on design tokens: a token package
                that compiles to CSS custom properties, a component library
                that maps those onto Tailwind utilities, and a Storybook that
                documents both.
            </Text>
        </div>
    ),
};
