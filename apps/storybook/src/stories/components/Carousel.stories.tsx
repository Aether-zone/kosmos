import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel, CarouselSlide } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Carousel',
    component: Carousel,
    tags: ['autodocs'],
    argTypes: {
        loop: {
            control: 'boolean',
        },
        showArrows: {
            control: 'boolean',
        },
        showDots: {
            control: 'boolean',
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[32rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

const tones = [
    'bg-primary text-primary-foreground',
    'bg-success text-success-foreground',
    'bg-warning text-warning-foreground',
    'bg-destructive text-destructive-foreground',
];

const slides = tones.map((tone, index) => (
    <CarouselSlide key={index}>
        <div
            className={`flex h-48 items-center justify-center text-2xl font-semibold ${tone}`}
        >
            Slide {index + 1}
        </div>
    </CarouselSlide>
));

export const Default: Story = {
    render: (args) => <Carousel {...args}>{slides}</Carousel>,
};

export const WithoutLoop: Story = {
    args: { loop: false },
    render: Default.render,
};

export const WithoutDots: Story = {
    args: { showDots: false },
    render: Default.render,
};

export const WithoutArrows: Story = {
    args: { showArrows: false },
    render: Default.render,
};

export const StartsOnThirdSlide: Story = {
    args: { defaultIndex: 2 },
    render: Default.render,
};

export const SingleSlide: Story = {
    render: () => (
        <Carousel>
            <CarouselSlide>
                <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-surface text-sm text-muted-foreground">
                    The only slide — no controls are rendered.
                </div>
            </CarouselSlide>
        </Carousel>
    ),
};

export const WithContent: Story = {
    render: () => (
        <Carousel label="Features">
            {['Design tokens', 'Dark mode', 'Accessible by default'].map(
                (title, index) => (
                    <CarouselSlide key={title}>
                        <div className="flex h-48 flex-col items-center justify-center gap-2 border border-border bg-surface px-8 text-center">
                            <p className="text-lg font-semibold text-foreground">
                                {title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Slide {index + 1} of 3.
                            </p>
                        </div>
                    </CarouselSlide>
                ),
            )}
        </Carousel>
    ),
};

function ControlledCarousel() {
    const [index, setIndex] = useState(0);

    return (
        <div className="space-y-3">
            <Carousel index={index} onIndexChange={setIndex}>
                {slides}
            </Carousel>

            <p className="text-sm text-muted-foreground">
                Slide <strong className="text-foreground">{index + 1}</strong> of{' '}
                {slides.length}
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledCarousel />,
};
