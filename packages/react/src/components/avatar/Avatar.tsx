import {
    createContext,
    type ImgHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
    useContext,
    useState,
} from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: ReactNode;
    size?: AvatarSize;
}

export interface AvatarImageProps
    extends ImgHTMLAttributes<HTMLImageElement> { }

export interface AvatarFallbackProps
    extends HTMLAttributes<HTMLDivElement> { }

type ImageStatus = 'idle' | 'loaded' | 'error';

interface AvatarContextValue {
    imageStatus: ImageStatus;
    setImageStatus: (status: ImageStatus) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatar() {
    const context = useContext(AvatarContext);

    if (!context) {
        throw new Error(
            'Avatar components must be used inside an Avatar component.',
        );
    }

    return context;
}

const sizeStyles: Record<AvatarSize, string> = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-12 text-base',
    xl: 'size-16 text-lg',
};

export function Avatar({
    src,
    alt = '',
    fallback,
    size = 'md',
    className,
    children,
    ...props
}: AvatarProps) {
    const [imageStatus, setImageStatus] = useState<ImageStatus>('idle');

    const classes = [
        'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizeStyles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <AvatarContext.Provider
            value={{
                imageStatus,
                setImageStatus,
            }}
        >
            <div
                className={classes}
                {...props}
            >
                {src ? (
                    <AvatarImage
                        src={src}
                        alt={alt}
                    />
                ) : null}

                {imageStatus !== 'loaded' && fallback ? (
                    <AvatarFallback>
                        {fallback}
                    </AvatarFallback>
                ) : null}

                {children}
            </div>
        </AvatarContext.Provider>
    );
}

export function AvatarImage({
    className,
    onLoad,
    onError,
    ...props
}: AvatarImageProps) {
    const { imageStatus, setImageStatus } = useAvatar();

    // A failed image still renders as a broken-image glyph, so drop it and
    // leave the fallback in its place.
    if (imageStatus === 'error') {
        return null;
    }

    const classes = [
        'aspect-square size-full object-cover',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <img
            className={classes}
            onLoad={(event) => {
                onLoad?.(event);
                setImageStatus('loaded');
            }}
            onError={(event) => {
                onError?.(event);
                setImageStatus('error');
            }}
            {...props}
        />
    );
}

export function AvatarFallback({
    className,
    ...props
}: AvatarFallbackProps) {
    const { imageStatus } = useAvatar();

    if (imageStatus === 'loaded') {
        return null;
    }

    const classes = [
        'flex size-full items-center justify-center bg-muted font-medium text-muted-foreground',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Not aria-hidden: when there is no image this text is the avatar's only
    // accessible name.
    return (
        <div
            className={classes}
            {...props}
        />
    );
}
