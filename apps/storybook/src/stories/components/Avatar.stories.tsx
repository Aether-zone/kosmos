import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Avatar',
    component: Avatar,
    tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="John Doe"
            fallback="JD"
        />
    ),
};

export const Fallback: Story = {
    render: () => (
        <Avatar fallback="JD" />
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar
                size="sm"
                src="https://i.pravatar.cc/150?img=12"
                alt="John Doe"
                fallback="JD"
            />
            <Avatar
                size="md"
                src="https://i.pravatar.cc/150?img=12"
                alt="John Doe"
                fallback="JD"
            />
            <Avatar
                size="lg"
                src="https://i.pravatar.cc/150?img=12"
                alt="John Doe"
                fallback="JD"
            />
            <Avatar
                size="xl"
                src="https://i.pravatar.cc/150?img=12"
                alt="John Doe"
                fallback="JD"
            />
        </div>
    ),
};

export const Initials: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar fallback="JD" />
            <Avatar fallback="AS" />
            <Avatar fallback="MK" />
            <Avatar fallback="PW" />
        </div>
    ),
};

export const SingleInitial: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar fallback="J" />
            <Avatar fallback="A" />
            <Avatar fallback="M" />
            <Avatar fallback="P" />
        </div>
    ),
};

export const ImageWithFallback: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar
                src="https://i.pravatar.cc/150?img=12"
                alt="John Doe"
                fallback="JD"
            />

            <Avatar
                src="https://invalid.example.com/avatar.jpg"
                alt="Jane Doe"
                fallback="JD"
            />
        </div>
    ),
};

export const Composable: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Jane Doe"
                />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <Avatar>
                <AvatarImage
                    src="https://i.pravatar.cc/150?img=47"
                    alt="Alex Smith"
                />
                <AvatarFallback>AS</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const WithCustomFallback: Story = {
    render: () => (
        <Avatar
            fallback={
                <span className="font-semibold">
                    PW
                </span>
            }
        />
    ),
};
