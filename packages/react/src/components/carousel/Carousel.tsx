import {
    Children,
    cloneElement,
    createContext,
    isValidElement,
    type HTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import {
    IoChevronBack,
    IoChevronForward,
    IoPause,
    IoPlay,
} from 'react-icons/io5';

import { usePrefersReducedMotion } from '../../internal';

export interface CarouselProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    index?: number;
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    /** Wrap from the last slide back to the first. */
    loop?: boolean;
    /** Milliseconds between automatic advances; omit to disable. */
    autoPlay?: number;
    label?: string;
    showArrows?: boolean;
    showDots?: boolean;
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> { }

interface CarouselContextValue {
    index: number;
    count: number;
    baseId: string;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselSlide() {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error('CarouselSlide must be used inside a Carousel.');
    }

    return context;
}

const controlStyles =
    'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer ' +
    'items-center justify-center rounded-full border border-border ' +
    'bg-surface/90 text-foreground shadow-sm outline-none transition-colors ' +
    'hover:bg-accent hover:text-accent-foreground ' +
    'focus-visible:ring-2 focus-visible:ring-ring ' +
    'disabled:cursor-not-allowed disabled:opacity-40';

export function Carousel({
    index: controlledIndex,
    defaultIndex = 0,
    onIndexChange,
    loop = true,
    autoPlay,
    label = 'Carousel',
    showArrows = true,
    showDots = true,
    className,
    children,
    ...props
}: CarouselProps) {
    const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
    const [hovered, setHovered] = useState(false);
    const [stopped, setStopped] = useState(false);
    const reducedMotion = usePrefersReducedMotion();
    const baseId = useId();
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const slides = Children.toArray(children);
    const count = slides.length;

    const index = Math.min(controlledIndex ?? uncontrolledIndex, count - 1);

    const go = (next: number) => {
        const resolved = loop
            ? (next + count) % count
            : Math.min(Math.max(next, 0), count - 1);

        if (controlledIndex === undefined) {
            setUncontrolledIndex(resolved);
        }

        onIndexChange?.(resolved);
    };

    /**
     * Auto-advance stops on hover and focus so it never pulls a slide out from
     * under someone reading, and stops outright for anyone who has asked for
     * reduced motion — a timer is motion a media query cannot switch off.
     * WCAG 2.2.2 also wants a control, since hovering is no use on a touch
     * screen or to someone simply reading; `stopped` is that control.
     */
    const running = Boolean(autoPlay) && !stopped && !reducedMotion;

    useEffect(() => {
        if (!running || hovered || count <= 1) {
            return;
        }

        const timer = window.setInterval(() => {
            const next = loop
                ? (index + 1) % count
                : Math.min(index + 1, count - 1);

            if (controlledIndex === undefined) {
                setUncontrolledIndex(next);
            }

            onIndexChange?.(next);
        }, autoPlay);

        return () => window.clearInterval(timer);
    }, [
        running,
        autoPlay,
        hovered,
        index,
        count,
        loop,
        controlledIndex,
        onIndexChange,
    ]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const next = {
            ArrowRight: index + 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: count - 1,
        }[event.key];

        if (next === undefined) {
            return;
        }

        event.preventDefault();
        go(next);
    };

    const classes = ['relative w-full', className].filter(Boolean).join(' ');

    return (
        <CarouselContext.Provider value={{ index, count, baseId }}>
            <section
                aria-roledescription="carousel"
                aria-label={label}
                className={classes}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocusCapture={() => setHovered(true)}
                onBlurCapture={() => setHovered(false)}
                {...props}
            >
                <div
                    ref={viewportRef}
                    // Focusable so the arrow keys have somewhere to land.
                    tabIndex={0}
                    aria-live={running ? 'off' : 'polite'}
                    className="w-full overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onKeyDown={handleKeyDown}
                >
                    <div
                        className="flex motion-safe:transition-transform motion-safe:duration-300 ease-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {slides.map((slide, position) => (
                            <CarouselSlideId
                                key={position}
                                id={`${baseId}-slide-${position}`}
                            >
                                {slide}
                            </CarouselSlideId>
                        ))}
                    </div>
                </div>

                {showArrows && count > 1 ? (
                    <>
                        <button
                            type="button"
                            aria-label="Previous slide"
                            disabled={!loop && index === 0}
                            className={[controlStyles, 'left-2'].join(' ')}
                            onClick={() => go(index - 1)}
                        >
                            <IoChevronBack className="size-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Next slide"
                            disabled={!loop && index === count - 1}
                            className={[controlStyles, 'right-2'].join(' ')}
                            onClick={() => go(index + 1)}
                        >
                            <IoChevronForward className="size-4" />
                        </button>
                    </>
                ) : null}

                {autoPlay && count > 1 ? (
                    <button
                        type="button"
                        aria-label={
                            running
                                ? 'Pause automatic slide changes'
                                : 'Resume automatic slide changes'
                        }
                        disabled={reducedMotion}
                        className="absolute right-2 top-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface/90 text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => setStopped(!stopped)}
                    >
                        {running ? (
                            <IoPause className="size-4" />
                        ) : (
                            <IoPlay className="size-4" />
                        )}
                    </button>
                ) : null}

                {showDots && count > 1 ? (
                    <div
                        role="tablist"
                        aria-label="Slides"
                        className="mt-3 flex items-center justify-center gap-2"
                    >
                        {slides.map((_, slide) => (
                            <button
                                key={slide}
                                type="button"
                                role="tab"
                                aria-selected={slide === index}
                                aria-label={`Slide ${slide + 1} of ${count}`}
                                aria-controls={`${baseId}-slide-${slide}`}
                                tabIndex={slide === index ? 0 : -1}
                                className={[
                                    'size-2 cursor-pointer rounded-full outline-none transition-colors',
                                    'focus-visible:ring-2 focus-visible:ring-ring',
                                    slide === index
                                        ? 'bg-primary'
                                        : 'bg-muted hover:bg-muted-foreground/50',
                                ].join(' ')}
                                onClick={() => go(slide)}
                            />
                        ))}
                    </div>
                ) : null}
            </section>
        </CarouselContext.Provider>
    );
}

/** Gives each slide the id its dot's `aria-controls` points at. */
function CarouselSlideId({ id, children }: { id: string; children: ReactNode }) {
    return isValidElement<{ id?: string }>(children)
        ? cloneElement(children, { id })
        : children;
}

export function CarouselSlide({
    className,
    children,
    ...props
}: CarouselSlideProps) {
    const classes = ['w-full shrink-0 grow-0 basis-full', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            role="group"
            aria-roledescription="slide"
            className={classes}
            {...props}
        >
            {children}
        </div>
    );
}
