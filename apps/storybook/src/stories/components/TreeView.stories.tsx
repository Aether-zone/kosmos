import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

/**
 * A branch that does not know its children yet takes `loadChildren`, which is
 * called the first time it is expanded. Supplying it is what makes the item a
 * branch, so the chevron is there to click before anything has been fetched.
 */
const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const contentsOf: Record<string, string[]> = {
    src: ['components', 'hooks', 'index.ts'],
    components: ['Button.tsx', 'Card.tsx', 'TreeView.tsx'],
    hooks: ['useTheme.ts'],
    empty: [],
};

const isFolder = (name: string) => !name.includes('.');

/** Stands in for a request; folders resolve to their children, files are leaves. */
function fetchChildren(path: string) {
    return async () => {
        await delay(600);

        return (contentsOf[path] ?? []).map((name) => (
            <TreeItem
                key={name}
                value={`${path}/${name}`}
                label={name}
                icon={
                    isFolder(name) ? (
                        <IoFolderOutline />
                    ) : (
                        <IoDocumentTextOutline />
                    )
                }
                loadChildren={isFolder(name) ? fetchChildren(name) : undefined}
            />
        ));
    };
}

export const LazyLoading: Story = {
    args: {
        children: (
            <TreeItem
                value="src"
                label="src"
                icon={<IoFolderOutline />}
                loadChildren={fetchChildren('src')}
            />
        ),
    },
};

/** A branch expanded on mount fetches without anyone clicking it. */
export const LazyDefaultExpanded: Story = {
    args: {
        defaultExpanded: ['src'],
        children: (
            <TreeItem
                value="src"
                label="src"
                icon={<IoFolderOutline />}
                loadChildren={fetchChildren('src')}
            />
        ),
    },
};

/** A branch that resolves to nothing stops claiming it can be opened. */
export const LazyEmptyBranchBecomesLeaf: Story = {
    args: {
        children: (
            <TreeItem
                value="empty"
                label="empty"
                icon={<IoFolderOutline />}
                loadChildren={fetchChildren('empty')}
            />
        ),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const row = canvas.getByRole('treeitem', { name: /empty/ });

        await expect(row).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(row);

        // Once the fetch comes back with nothing, the chevron and the promise
        // that goes with it are withdrawn.
        await waitFor(() => expect(row).not.toHaveAttribute('aria-expanded'), {
            timeout: 3000,
        });
    },
};

/** The row reports `aria-busy` while its children are in flight. */
export const LazyBranchMarksItselfBusy: Story = {
    args: {
        children: (
            <TreeItem
                value="src"
                label="src"
                icon={<IoFolderOutline />}
                loadChildren={fetchChildren('src')}
            />
        ),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const row = canvas.getByRole('treeitem', { name: /src/ });

        await userEvent.click(row);

        await expect(row).toHaveAttribute('aria-busy', 'true');
        await expect(await canvas.findByText('Loading…')).toBeInTheDocument();

        await waitFor(
            () => expect(canvas.getByText('components')).toBeInTheDocument(),
            { timeout: 3000 },
        );

        // Loaded: the busy flag and its announcement both go away.
        await expect(row).not.toHaveAttribute('aria-busy');
        await expect(canvas.queryByText('Loading…')).not.toBeInTheDocument();
    },
};

/**
 * Collapsing an ancestor unmounts the branch, but the cache lives on the
 * TreeView, so reopening it does not fetch a second time.
 */
export const LazyChildrenAreFetchedOnce: Story = {
    render: function FetchedOnce() {
        const [calls, setCalls] = useState(0);

        const load = async () => {
            setCalls((count) => count + 1);
            await delay(100);

            return <TreeItem value="src/index.ts" label="index.ts" />;
        };

        return (
            <div className="space-y-3">
                <TreeView>
                    <TreeItem
                        value="src"
                        label="src"
                        icon={<IoFolderOutline />}
                        loadChildren={load}
                    />
                </TreeView>

                <p className="text-sm text-muted-foreground">
                    Fetches: <strong className="text-foreground">{calls}</strong>
                </p>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const row = canvas.getByRole('treeitem', { name: /src/ });

        await userEvent.click(row);
        await waitFor(() =>
            expect(canvas.getByText('index.ts')).toBeInTheDocument(),
        );

        await userEvent.click(row); // collapse
        await userEvent.click(row); // expand again

        await waitFor(() =>
            expect(canvas.getByText('index.ts')).toBeInTheDocument(),
        );
        await expect(canvas.getByText('1')).toBeInTheDocument();
    },
};

/** A failed load can be retried from the row that reports it. */
export const LazyLoadingRetriesAfterFailure: Story = {
    render: function Retry() {
        const attempt = useRef(0);

        const load = async () => {
            attempt.current += 1;
            await delay(50);

            if (attempt.current === 1) {
                throw new Error('Network error');
            }

            return <TreeItem value="src/index.ts" label="index.ts" />;
        };

        return (
            <TreeView>
                <TreeItem
                    value="src"
                    label="src"
                    icon={<IoFolderOutline />}
                    loadChildren={load}
                />
            </TreeView>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const row = canvas.getByRole('treeitem', { name: /src/ });

        await userEvent.click(row);

        const error = await canvas.findByRole('treeitem', {
            name: /Could not load/,
        });
        await expect(error).toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));

        await waitFor(() =>
            expect(canvas.getByText('index.ts')).toBeInTheDocument(),
        );
        await expect(
            canvas.queryByText('Could not load'),
        ).not.toBeInTheDocument();
    },
};

/** The error row is a real item, so arrow keys reach its retry. */
export const KeyboardReachesTheErrorRow: Story = {
    render: function ReachesError() {
        const load = async () => {
            await delay(50);
            throw new Error('Network error');
        };

        return (
            <TreeView defaultExpanded={['src']}>
                <TreeItem
                    value="src"
                    label="src"
                    icon={<IoFolderOutline />}
                    loadChildren={load}
                />
                <TreeItem value="readme" label="README.md" />
            </TreeView>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const src = canvas.getByRole('treeitem', { name: /^src/ });

        const error = await canvas.findByRole('treeitem', {
            name: /Could not load/,
        });

        src.focus();
        await userEvent.keyboard('{ArrowDown}');
        await expect(error).toHaveFocus();

        await userEvent.keyboard('{ArrowDown}');
        await expect(
            canvas.getByRole('treeitem', { name: /README/ }),
        ).toHaveFocus();
    },
};
