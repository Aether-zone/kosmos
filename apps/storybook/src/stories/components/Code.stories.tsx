import type { Meta, StoryObj } from '@storybook/react-vite';

import { Code, Text } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Code',
    component: Code,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'subtle'],
        },
        block: {
            control: 'boolean',
        },
    },
    args: {
        children: 'pnpm build',
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
    args: {
        variant: 'subtle',
    },
};

export const Block: Story = {
    args: {
        block: true,
        children: `import { Button } from '@aether-zone/kosmos';

export function Example() {
    return <Button variant="primary">Save</Button>;
}`,
    },
};

export const BlockScrolls: Story = {
    args: {
        block: true,
        children:
            'pnpm --filter storybook exec vitest run src/stories/components/Button.stories.tsx --reporter verbose --no-color',
    },
};

export const InProse: Story = {
    render: () => (
        <Text>
            Run <Code>pnpm build</Code> before starting Storybook, or{' '}
            <Code>@kosmos/tokens/tokens.css</Code> will not exist yet.
        </Text>
    ),
};
