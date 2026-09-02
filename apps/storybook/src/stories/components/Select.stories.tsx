import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Select',
    component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const options = (
    <>
        <option value="" disabled>
            Select an option
        </option>
        <option value="one">Option one</option>
        <option value="two">Option two</option>
        <option value="three">Option three</option>
    </>
);

export const Default: Story = {
    args: {
        defaultValue: '',
        children: options,
    },
};

export const Selected: Story = {
    args: {
        defaultValue: 'two',
        children: options,
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: 'one',
        children: options,
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
        defaultValue: 'one',
        children: options,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: 'one',
        children: options,
    },
};

export const Error: Story = {
    args: {
        error: true,
        'aria-invalid': true,
        defaultValue: 'one',
        children: options,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'one',
        children: options,
    },
};

export const WithLabel: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-2">
            <label
                htmlFor="country"
                className="text-sm font-medium text-foreground"
            >
                Country
            </label>

            <Select id="country" defaultValue="">
                <option value="" disabled>
                    Select a country
                </option>
                <option value="nl">Netherlands</option>
                <option value="be">Belgium</option>
                <option value="de">Germany</option>
            </Select>
        </div>
    ),
};

export const States: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <Select defaultValue="">
                <option value="" disabled>
                    Default
                </option>
                <option value="one">Option one</option>
            </Select>

            <Select error aria-invalid="true" defaultValue="one">
                <option value="one">Error</option>
                <option value="two">Option two</option>
            </Select>

            <Select disabled defaultValue="one">
                <option value="one">Disabled</option>
                <option value="two">Option two</option>
            </Select>
        </div>
    ),
};
