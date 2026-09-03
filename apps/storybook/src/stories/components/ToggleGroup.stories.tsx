import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoGridOutline,
    IoListOutline,
    IoMapOutline,
} from 'react-icons/io5';

import { ToggleGroup, ToggleGroupItem } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/ToggleGroup',
    component: ToggleGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['single', 'multiple'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: 'select',
            options: ['segmented', 'outline'],
        },
    },
    args: {
        label: 'View',
    },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const views = (
    <>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="map">Map</ToggleGroupItem>
    </>
);

export const Default: Story = {
    args: {
        defaultValue: ['list'],
        children: views,
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        defaultValue: ['grid'],
        children: views,
    },
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
        defaultValue: ['list', 'map'],
        children: views,
    },
};

export const WithIcons: Story = {
    args: {
        defaultValue: ['grid'],
        children: (
            <>
                <ToggleGroupItem value="list" icon={<IoListOutline />}>
                    List
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" icon={<IoGridOutline />}>
                    Grid
                </ToggleGroupItem>
                <ToggleGroupItem value="map" icon={<IoMapOutline />}>
                    Map
                </ToggleGroupItem>
            </>
        ),
    },
};

export const IconOnly: Story = {
    args: {
        defaultValue: ['grid'],
        children: (
            <>
                <ToggleGroupItem value="list" aria-label="List view">
                    <IoListOutline className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                    <IoGridOutline className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="map" aria-label="Map view">
                    <IoMapOutline className="size-4" />
                </ToggleGroupItem>
            </>
        ),
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        defaultValue: ['list'],
        children: views,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        defaultValue: ['list'],
        children: views,
    },
};

export const NotCollapsible: Story = {
    args: {
        collapsible: false,
        defaultValue: ['list'],
        children: views,
    },
};

export const WithDisabledItem: Story = {
    args: {
        defaultValue: ['list'],
        children: (
            <>
                <ToggleGroupItem value="list">List</ToggleGroupItem>
                <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                <ToggleGroupItem value="map" disabled>
                    Map
                </ToggleGroupItem>
            </>
        ),
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: ['list'],
        children: views,
    },
};

function ControlledToggleGroup() {
    const [value, setValue] = useState<string[]>(['grid']);

    return (
        <div className="space-y-3 text-center">
            <ToggleGroup label="View" value={value} onValueChange={setValue}>
                {views}
            </ToggleGroup>

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
    render: () => <ControlledToggleGroup />,
};
