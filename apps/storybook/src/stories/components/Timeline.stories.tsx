import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoCheckmarkOutline,
    IoCloudUploadOutline,
    IoGitCommitOutline,
} from 'react-icons/io5';

import {
    Timeline,
    TimelineDescription,
    TimelineHeader,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Timeline',
    component: Timeline,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="w-96">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Timeline>
            <TimelineItem tone="success">
                <TimelineHeader>
                    <TimelineTitle>Deployed to production</TimelineTitle>
                    <TimelineTime dateTime="2026-09-03">09:24</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                    Release 2.4.0 went out to all regions.
                </TimelineDescription>
            </TimelineItem>

            <TimelineItem tone="primary">
                <TimelineHeader>
                    <TimelineTitle>Build passed</TimelineTitle>
                    <TimelineTime dateTime="2026-09-03">09:11</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                    294 tests across 40 components.
                </TimelineDescription>
            </TimelineItem>

            <TimelineItem>
                <TimelineHeader>
                    <TimelineTitle>Pull request opened</TimelineTitle>
                    <TimelineTime dateTime="2026-09-03">08:47</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                    Add overlay primitive and six components.
                </TimelineDescription>
            </TimelineItem>
        </Timeline>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <Timeline>
            <TimelineItem icon={<IoCheckmarkOutline />}>
                <TimelineHeader>
                    <TimelineTitle>Approved</TimelineTitle>
                    <TimelineTime>Today</TimelineTime>
                </TimelineHeader>
            </TimelineItem>

            <TimelineItem icon={<IoCloudUploadOutline />}>
                <TimelineHeader>
                    <TimelineTitle>Published</TimelineTitle>
                    <TimelineTime>Yesterday</TimelineTime>
                </TimelineHeader>
            </TimelineItem>

            <TimelineItem icon={<IoGitCommitOutline />}>
                <TimelineHeader>
                    <TimelineTitle>Committed</TimelineTitle>
                    <TimelineTime>Monday</TimelineTime>
                </TimelineHeader>
            </TimelineItem>
        </Timeline>
    ),
};

export const WithPendingSteps: Story = {
    render: () => (
        <Timeline>
            <TimelineItem tone="success">
                <TimelineTitle>Order placed</TimelineTitle>
                <TimelineDescription>Payment confirmed.</TimelineDescription>
            </TimelineItem>

            <TimelineItem tone="success">
                <TimelineTitle>Dispatched</TimelineTitle>
                <TimelineDescription>Left the warehouse.</TimelineDescription>
            </TimelineItem>

            <TimelineItem pending>
                <TimelineTitle>Out for delivery</TimelineTitle>
                <TimelineDescription>Expected tomorrow.</TimelineDescription>
            </TimelineItem>

            <TimelineItem pending>
                <TimelineTitle>Delivered</TimelineTitle>
            </TimelineItem>
        </Timeline>
    ),
};

export const Tones: Story = {
    render: () => (
        <Timeline>
            <TimelineItem tone="default">
                <TimelineTitle>Default</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="primary">
                <TimelineTitle>Primary</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="success">
                <TimelineTitle>Success</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="warning">
                <TimelineTitle>Warning</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="destructive">
                <TimelineTitle>Destructive</TimelineTitle>
            </TimelineItem>
        </Timeline>
    ),
};

export const TitlesOnly: Story = {
    render: () => (
        <Timeline>
            <TimelineItem tone="primary">
                <TimelineTitle>Signed up</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="primary">
                <TimelineTitle>Verified email</TimelineTitle>
            </TimelineItem>
            <TimelineItem tone="primary">
                <TimelineTitle>Completed profile</TimelineTitle>
            </TimelineItem>
        </Timeline>
    ),
};
