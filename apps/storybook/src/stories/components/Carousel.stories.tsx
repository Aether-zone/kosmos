import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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

/**
 * Content that moves on a timer needs a way to stop it (WCAG 2.2.2). Pausing
 * on hover is not that: it does nothing on a touch screen, or for someone who
 * is simply reading.
 */
export const AutoPlayWithPauseControl: Story = {
    args: { autoPlay: 2000 },
    render: (args) => <Carousel {...args}>{slides}</Carousel>,
};

/**
 * WCAG 2.2.2 wants a way to stop content that moves on its own. This checks
 * the control's contract rather than the clock: whether an interval has
 * actually fired yet depends on browser timer throttling, which a headless CI
 * page does aggressively — that made this test fail there and pass here.
 *
 * `aria-live` is the observable consequence of the state: `off` while the
 * carousel drives itself, `polite` once the reader is in charge and the
 * change should be announced.
 */
export const PauseControlTogglesAutoPlay: Story = {
    args: { autoPlay: 300 },
    render: (args) => <Carousel {...args}>{slides}</Carousel>,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const viewport = canvasElement.querySelector('[aria-live]')!;

        const pause = canvas.getByRole('button', {
            name: 'Pause automatic slide changes',
        });
        await expect(viewport).toHaveAttribute('aria-live', 'off');

        await userEvent.click(pause);

        const resume = canvas.getByRole('button', {
            name: 'Resume automatic slide changes',
        });
        await waitFor(() =>
            expect(viewport).toHaveAttribute('aria-live', 'polite'),
        );

        // The index must not move while it is stopped.
        const selected = () =>
            canvas
                .getAllByRole('tab')
                .findIndex((dot) => dot.getAttribute('aria-selected') === 'true');
        const stoppedAt = selected();

        await new Promise((resolve) => setTimeout(resolve, 700));
        await expect(selected()).toBe(stoppedAt);

        await userEvent.click(resume);
        await waitFor(() =>
            expect(viewport).toHaveAttribute('aria-live', 'off'),
        );
    },
};

/** Arrows move slides regardless of the timer. */
export const ArrowsChangeSlide: Story = {
    render: (args) => <Carousel {...args}>{slides}</Carousel>,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const selected = () =>
            canvas
                .getAllByRole('tab')
                .findIndex((dot) => dot.getAttribute('aria-selected') === 'true');

        await expect(selected()).toBe(0);

        await userEvent.click(
            canvas.getByRole('button', { name: 'Next slide' }),
        );
        await waitFor(() => expect(selected()).toBe(1));

        await userEvent.click(
            canvas.getByRole('button', { name: 'Previous slide' }),
        );
        await waitFor(() => expect(selected()).toBe(0));
    },
};
