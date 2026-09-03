import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link, Text } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Link',
    component: Link,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'subtle', 'muted'],
        },
        underline: {
            control: 'select',
            options: ['always', 'hover', 'none'],
        },
        external: {
            control: 'boolean',
        },
    },
    args: {
        href: '#',
        children: 'Read the documentation',
    },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Link href="#" variant="default">Default</Link>
            <Link href="#" variant="subtle">Subtle</Link>
            <Link href="#" variant="muted">Muted</Link>
        </div>
    ),
};

export const Underlines: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Link href="#" underline="always">Always underlined</Link>
            <Link href="#" underline="hover">Underlined on hover</Link>
            <Link href="#" underline="none">Never underlined</Link>
        </div>
    ),
};

/**
 * Sets `target="_blank"` with `rel="noopener noreferrer"`, shows an icon, and
 * appends screen-reader-only text saying the link opens in a new tab.
 */
export const External: Story = {
    args: {
        external: true,
        href: 'https://react-icons.github.io/react-icons/icons/io5/',
        children: 'Ionicons 5 gallery',
    },
};

export const InProse: Story = {
    render: () => (
        <div className="w-96">
            <Text>
                Tokens are authored as DTCG JSON and compiled with{' '}
                <Link href="#">Style Dictionary</Link>, then mapped onto
                Tailwind's theme namespaces. See the{' '}
                <Link href="#" external>
                    Ionicons gallery
                </Link>{' '}
                for the icon set.
            </Text>
        </div>
    ),
};
