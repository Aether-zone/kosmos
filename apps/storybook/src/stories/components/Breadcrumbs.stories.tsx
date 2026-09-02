import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    BreadcrumbEllipsis,
    BreadcrumbItem,
    Breadcrumbs,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Breadcrumbs>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Projects</BreadcrumbItem>
            <BreadcrumbItem current>Kosmos</BreadcrumbItem>
        </Breadcrumbs>
    ),
};

export const TwoLevels: Story = {
    render: () => (
        <Breadcrumbs>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem current>Settings</BreadcrumbItem>
        </Breadcrumbs>
    ),
};

export const CustomSeparator: Story = {
    render: () => (
        <Breadcrumbs separator="›">
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Library</BreadcrumbItem>
            <BreadcrumbItem current>Components</BreadcrumbItem>
        </Breadcrumbs>
    ),
};

export const Truncated: Story = {
    render: () => (
        <Breadcrumbs>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbEllipsis />
            <BreadcrumbItem href="#">Components</BreadcrumbItem>
            <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
    ),
};

export const LongTrail: Story = {
    render: () => (
        <Breadcrumbs>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
            <BreadcrumbItem href="#">Design system</BreadcrumbItem>
            <BreadcrumbItem href="#">Components</BreadcrumbItem>
            <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
    ),
};
