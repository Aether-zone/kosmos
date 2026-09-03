import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Autocomplete } from '@aether-zone/kosmos';

const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
    { value: 'angular', label: 'Angular' },
    { value: 'qwik', label: 'Qwik', disabled: true },
];

const meta = {
    title: 'Components/Autocomplete',
    component: Autocomplete,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        error: {
            control: 'boolean',
        },
    },
    args: {
        options: frameworks,
        placeholder: 'Search frameworks',
    },
    decorators: [
        (Story) => (
            <div className="h-72 w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialValue: Story = {
    args: {
        defaultValue: 'React',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};

export const Error: Story = {
    args: {
        error: true,
        defaultValue: 'Ember',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'React',
    },
};

export const CustomEmptyMessage: Story = {
    args: {
        defaultValue: 'zzz',
        emptyMessage: 'Nothing matches that search.',
    },
};

function ControlledAutocomplete() {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            <Autocomplete
                options={frameworks}
                placeholder="Search frameworks"
                value={value}
                onValueChange={setValue}
                onSelect={(option) => setPicked(option.label)}
            />

            <p className="text-sm text-muted-foreground">
                Selected:{' '}
                <strong className="text-foreground">{picked ?? 'none'}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledAutocomplete />,
};
