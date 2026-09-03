import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Radio, RadioGroup } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Radio',
    component: RadioGroup,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['vertical', 'horizontal'],
        },
        disabled: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
    },
    args: {
        label: 'Plan',
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const plans = (
    <>
        <Radio value="free" label="Free" />
        <Radio value="pro" label="Pro" />
        <Radio value="team" label="Team" />
    </>
);

export const Default: Story = {
    args: {
        defaultValue: 'pro',
        children: plans,
    },
};

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
        defaultValue: 'free',
        children: plans,
    },
};

export const WithDescriptions: Story = {
    args: {
        defaultValue: 'pro',
        children: (
            <>
                <Radio
                    value="free"
                    label="Free"
                    description="For personal projects."
                />
                <Radio
                    value="pro"
                    label="Pro"
                    description="For professionals who need more room."
                />
                <Radio
                    value="team"
                    label="Team"
                    description="Shared billing and access control."
                />
            </>
        ),
    },
};

export const WithDisabledOption: Story = {
    args: {
        defaultValue: 'free',
        children: (
            <>
                <Radio value="free" label="Free" />
                <Radio value="pro" label="Pro" />
                <Radio value="team" label="Team" disabled />
            </>
        ),
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'pro',
        children: plans,
    },
};

export const Error: Story = {
    args: {
        error: true,
        children: plans,
    },
};

export const WithoutLabels: Story = {
    args: {
        orientation: 'horizontal',
        defaultValue: 'b',
        children: (
            <>
                <Radio value="a" aria-label="Option A" />
                <Radio value="b" aria-label="Option B" />
                <Radio value="c" aria-label="Option C" />
            </>
        ),
    },
};

function ControlledRadioGroup() {
    const [value, setValue] = useState('pro');

    return (
        <div className="space-y-3">
            <RadioGroup label="Plan" value={value} onValueChange={setValue}>
                {plans}
            </RadioGroup>

            <p className="text-sm text-muted-foreground">
                Selected: <strong className="text-foreground">{value}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledRadioGroup />,
};

/** Built on native inputs, so the arrow keys come from the platform. */
export const ArrowKeysMoveSelection: Story = {
    args: { defaultValue: 'free', children: plans },
    play: async ({ canvasElement }) => {
        const radios = within(canvasElement).getAllByRole(
            'radio',
        ) as HTMLInputElement[];

        radios[0].focus();
        await expect(radios[0]).toBeChecked();

        await userEvent.keyboard('{ArrowDown}');
        await expect(radios[1]).toBeChecked();
        await expect(radios[0]).not.toBeChecked();
    },
};
