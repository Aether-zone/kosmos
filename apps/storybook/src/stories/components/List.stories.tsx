import type { Meta, StoryObj } from '@storybook/react-vite';

import { List, ListItem } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/List',
    component: List,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['bulleted', 'numbered', 'plain'],
        },
        spacing: {
            control: 'select',
            options: ['tight', 'normal', 'loose'],
        },
        marker: {
            control: 'select',
            options: ['disc', 'circle', 'square', 'decimal', 'lower-alpha'],
        },
    },
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = (
    <>
        <ListItem>Primitives hold the raw scales</ListItem>
        <ListItem>Semantic tokens alias them to roles</ListItem>
        <ListItem>Style Dictionary compiles one pass per theme</ListItem>
    </>
);

export const Default: Story = {
    args: { children: items },
};

export const Numbered: Story = {
    args: { variant: 'numbered', children: items },
};

export const Plain: Story = {
    args: { variant: 'plain', children: items },
};

export const Spacing: Story = {
    render: () => (
        <div className="space-y-6">
            <List spacing="tight">{items}</List>
            <List spacing="normal">{items}</List>
            <List spacing="loose">{items}</List>
        </div>
    ),
};

export const CustomMarker: Story = {
    args: { marker: 'square', children: items },
};

export const LowerAlpha: Story = {
    args: { variant: 'numbered', marker: 'lower-alpha', children: items },
};

export const Nested: Story = {
    render: () => (
        <List>
            <ListItem>Primitives</ListItem>
            <ListItem>
                Semantic tokens
                <List marker="circle" spacing="tight" className="mt-1.5">
                    <ListItem>colors.json — light, and the contract</ListItem>
                    <ListItem>dark.json — the dark overrides</ListItem>
                </List>
            </ListItem>
            <ListItem>Themes</ListItem>
        </List>
    ),
};
