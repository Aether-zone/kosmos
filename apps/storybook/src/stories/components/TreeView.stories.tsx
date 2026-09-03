import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoDocumentTextOutline,
    IoFolderOutline,
} from 'react-icons/io5';

import { TreeItem, TreeView } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/TreeView',
    component: TreeView,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-80 rounded-md border border-border bg-surface p-2">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TreeView>;

export default meta;

type Story = StoryObj<typeof meta>;

const tree = (
    <>
        <TreeItem value="src" label="src" icon={<IoFolderOutline />}>
            <TreeItem
                value="components"
                label="components"
                icon={<IoFolderOutline />}
            >
                <TreeItem
                    value="button"
                    label="Button.tsx"
                    icon={<IoDocumentTextOutline />}
                />
                <TreeItem
                    value="card"
                    label="Card.tsx"
                    icon={<IoDocumentTextOutline />}
                />
            </TreeItem>

            <TreeItem value="internal" label="internal" icon={<IoFolderOutline />}>
                <TreeItem
                    value="overlay"
                    label="OverlayPanel.tsx"
                    icon={<IoDocumentTextOutline />}
                />
            </TreeItem>

            <TreeItem
                value="index"
                label="index.ts"
                icon={<IoDocumentTextOutline />}
            />
        </TreeItem>

        <TreeItem value="docs" label="docs" icon={<IoFolderOutline />}>
            <TreeItem
                value="adr"
                label="adr"
                icon={<IoFolderOutline />}
            >
                <TreeItem
                    value="adr1"
                    label="0001-monorepo.md"
                    icon={<IoDocumentTextOutline />}
                />
            </TreeItem>
        </TreeItem>
    </>
);

export const Default: Story = {
    args: {
        defaultExpanded: ['src'],
        children: tree,
    },
};

export const AllCollapsed: Story = {
    args: {
        children: tree,
    },
};

export const DeeplyExpanded: Story = {
    args: {
        defaultExpanded: ['src', 'components', 'internal', 'docs', 'adr'],
        defaultSelected: 'button',
        children: tree,
    },
};

export const WithoutIcons: Story = {
    args: {
        defaultExpanded: ['src'],
        children: (
            <TreeItem value="src" label="src">
                <TreeItem value="a" label="Button.tsx" />
                <TreeItem value="b" label="Card.tsx" />
            </TreeItem>
        ),
    },
};

export const WithDisabledItem: Story = {
    args: {
        defaultExpanded: ['src'],
        children: (
            <TreeItem value="src" label="src" icon={<IoFolderOutline />}>
                <TreeItem value="a" label="Button.tsx" />
                <TreeItem value="b" label="Generated.d.ts" disabled />
            </TreeItem>
        ),
    },
};

function ControlledTreeView() {
    const [selected, setSelected] = useState('button');
    const [expanded, setExpanded] = useState(['src', 'components']);

    return (
        <div className="space-y-3">
            <TreeView
                expanded={expanded}
                onExpandedChange={setExpanded}
                selected={selected}
                onSelectedChange={setSelected}
            >
                {tree}
            </TreeView>

            <p className="text-sm text-muted-foreground">
                Selected: <strong className="text-foreground">{selected}</strong>
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledTreeView />,
};
