import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from '@aether-zone/kosmos';

const skills = [
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'css', label: 'CSS' },
    { value: 'graphql', label: 'GraphQL' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'cobol', label: 'COBOL', disabled: true },
];

const meta = {
    title: 'Components/Combobox',
    component: Combobox,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        error: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        allowCreate: {
            control: 'boolean',
        },
    },
    args: {
        options: skills,
        label: 'Skills',
        placeholder: 'Add skills',
    },
    decorators: [
        (Story) => (
            <div className="h-72 w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
    args: {
        defaultValue: ['typescript', 'react'],
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: ['react'],
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: ['react'],
    },
};

export const AllowCreate: Story = {
    args: {
        allowCreate: true,
        defaultValue: ['react'],
    },
};

export const MaxSelected: Story = {
    args: {
        maxSelected: 2,
        defaultValue: ['typescript', 'react'],
    },
};

export const Error: Story = {
    args: {
        error: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: ['typescript', 'react'],
    },
};

export const ManySelected: Story = {
    args: {
        defaultValue: ['typescript', 'react', 'css', 'graphql', 'rust'],
    },
};

function ControlledCombobox() {
    const [value, setValue] = useState<string[]>(['react']);

    return (
        <div className="space-y-3">
            <Combobox
                options={skills}
                label="Skills"
                placeholder="Add skills"
                value={value}
                onValueChange={setValue}
            />

            <p className="text-sm text-muted-foreground">
                Selected:{' '}
                <strong className="text-foreground">
                    {value.length ? value.join(', ') : 'none'}
                </strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledCombobox />,
};
