import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableEmpty,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    type SortDirection,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Table',
    component: Table,
    tags: ['autodocs'],
    argTypes: {
        striped: {
            control: 'boolean',
        },
        hoverable: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[42rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const invoices = [
    { id: 'INV-001', customer: 'Ada Lovelace', status: 'Paid', amount: 250 },
    { id: 'INV-002', customer: 'Alan Turing', status: 'Pending', amount: 150 },
    { id: 'INV-003', customer: 'Grace Hopper', status: 'Paid', amount: 480 },
    { id: 'INV-004', customer: 'Katherine Johnson', status: 'Overdue', amount: 90 },
];

const statusVariant = {
    Paid: 'success',
    Pending: 'warning',
    Overdue: 'destructive',
} as const;

const rows = invoices.map((invoice) => (
    <TableRow key={invoice.id}>
        <TableCell>{invoice.id}</TableCell>
        <TableCell>{invoice.customer}</TableCell>
        <TableCell>
            <Badge
                size="sm"
                variant={statusVariant[invoice.status as keyof typeof statusVariant]}
            >
                {invoice.status}
            </Badge>
        </TableCell>
        <TableCell numeric>${invoice.amount}</TableCell>
    </TableRow>
));

const header = (
    <TableHeader>
        <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
        </TableRow>
    </TableHeader>
);

export const Default: Story = {
    render: (args) => (
        <Table {...args}>
            {header}
            <TableBody>{rows}</TableBody>
        </Table>
    ),
};

export const Striped: Story = {
    args: { striped: true },
    render: Default.render,
};

export const Hoverable: Story = {
    args: { hoverable: true },
    render: Default.render,
};

export const WithCaption: Story = {
    args: { caption: 'Invoices issued this month.' },
    render: Default.render,
};

export const WithFooter: Story = {
    render: (args) => (
        <Table {...args}>
            {header}
            <TableBody>{rows}</TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell numeric>$970</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    ),
};

export const Empty: Story = {
    render: (args) => (
        <Table {...args}>
            {header}
            <TableBody>
                <TableRow>
                    <TableEmpty colSpan={4}>No invoices yet.</TableEmpty>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

export const SelectedRow: Story = {
    render: (args) => (
        <Table {...args}>
            {header}
            <TableBody>
                <TableRow>
                    <TableCell>INV-001</TableCell>
                    <TableCell>Ada Lovelace</TableCell>
                    <TableCell>
                        <Badge size="sm" variant="success">Paid</Badge>
                    </TableCell>
                    <TableCell numeric>$250</TableCell>
                </TableRow>
                <TableRow selected>
                    <TableCell>INV-002</TableCell>
                    <TableCell>Alan Turing</TableCell>
                    <TableCell>
                        <Badge size="sm" variant="warning">Pending</Badge>
                    </TableCell>
                    <TableCell numeric>$150</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

function SortableTable() {
    const [direction, setDirection] = useState<SortDirection>('ascending');

    const sorted = [...invoices].sort((a, b) =>
        direction === 'ascending' ? a.amount - b.amount : b.amount - a.amount,
    );

    return (
        <Table hoverable>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead
                        sort={direction}
                        onSortChange={() =>
                            setDirection(
                                direction === 'ascending'
                                    ? 'descending'
                                    : 'ascending',
                            )
                        }
                    >
                        Amount
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {sorted.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell numeric>${invoice.amount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export const Sortable: Story = {
    render: () => <SortableTable />,
};
