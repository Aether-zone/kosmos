import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd, Text } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Kbd',
    component: Kbd,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md'],
        },
    },
    args: {
        children: 'K',
    },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Combination: Story = {
    args: {
        keys: ['⌘', 'K'],
    },
};

export const LongerCombination: Story = {
    args: {
        keys: ['Ctrl', 'Shift', 'P'],
    },
};

export const CustomSeparator: Story = {
    args: {
        keys: ['G', 'then', 'H'],
        separator: '',
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Kbd size="sm" keys={['⌘', 'K']} />
            <Kbd size="md" keys={['⌘', 'K']} />
        </div>
    ),
};

export const InProse: Story = {
    render: () => (
        <div className="w-96">
            <Text>
                Press <Kbd keys={['⌘', 'K']} /> to open the command palette, or{' '}
                <Kbd>Esc</Kbd> to close it.
            </Text>
        </div>
    ),
};
