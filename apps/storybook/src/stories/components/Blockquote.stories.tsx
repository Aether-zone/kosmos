import type { Meta, StoryObj } from '@storybook/react-vite';

import { Blockquote } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Blockquote',
    component: Blockquote,
    tags: ['autodocs'],
    args: {
        children:
            'A design system is not a project. It is a product serving products.',
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Blockquote>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * With an attribution the quote becomes a `<figure>`, because the
 * attribution is not part of what was said.
 */
export const WithAuthor: Story = {
    args: {
        author: 'Nathan Curtis',
    },
};

export const WithCitation: Story = {
    args: {
        author: 'Nathan Curtis',
        cite: 'https://medium.com/eightshapes-llc',
    },
};

export const Long: Story = {
    args: {
        author: 'The README',
        children:
            'Tokens flow through four stages: primitives hold raw scales, semantic tokens alias them to roles, Style Dictionary compiles them once per theme, and the component library maps them onto Tailwind. Switching theme is then one class on one element — no provider, no JavaScript.',
    },
};
