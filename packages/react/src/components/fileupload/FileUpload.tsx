import {
    type DragEvent,
    type HTMLAttributes,
    type ReactNode,
    useId,
    useRef,
    useState,
} from 'react';

import { IoCloudUploadOutline, IoClose } from 'react-icons/io5';

export interface FileUploadProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onDrop'> {
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    error?: boolean;
    name?: string;
    /** Bytes; files above this are rejected and reported via `onReject`. */
    maxSize?: number;
    label?: ReactNode;
    description?: ReactNode;
    files?: File[];
    onFilesChange?: (files: File[]) => void;
    onReject?: (files: File[], reason: 'size' | 'type') => void;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const size = bytes / 1024 ** exponent;

    return `${size.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const matchesAccept = (file: File, accept?: string) => {
    if (!accept) {
        return true;
    }

    return accept.split(',').some((entry) => {
        const pattern = entry.trim().toLowerCase();

        if (!pattern) {
            return false;
        }

        if (pattern.startsWith('.')) {
            return file.name.toLowerCase().endsWith(pattern);
        }

        if (pattern.endsWith('/*')) {
            return file.type.startsWith(pattern.slice(0, -1));
        }

        return file.type.toLowerCase() === pattern;
    });
};

export function FileUpload({
    accept,
    multiple = false,
    disabled = false,
    error = false,
    name,
    maxSize,
    label = 'Drag and drop files here, or browse',
    description,
    files: controlledFiles,
    onFilesChange,
    onReject,
    className,
    ...props
}: FileUploadProps) {
    const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const descriptionId = useId();

    const files = controlledFiles ?? uncontrolledFiles;

    const setFiles = (nextFiles: File[]) => {
        if (controlledFiles === undefined) {
            setUncontrolledFiles(nextFiles);
        }

        onFilesChange?.(nextFiles);
    };

    const addFiles = (incoming: File[]) => {
        const wrongType = incoming.filter(
            (file) => !matchesAccept(file, accept),
        );
        const allowedType = incoming.filter((file) =>
            matchesAccept(file, accept),
        );

        const tooLarge = maxSize
            ? allowedType.filter((file) => file.size > maxSize)
            : [];
        const allowed = maxSize
            ? allowedType.filter((file) => file.size <= maxSize)
            : allowedType;

        if (wrongType.length) {
            onReject?.(wrongType, 'type');
        }

        if (tooLarge.length) {
            onReject?.(tooLarge, 'size');
        }

        if (!allowed.length) {
            return;
        }

        setFiles(multiple ? [...files, ...allowed] : allowed.slice(0, 1));
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);

        if (disabled) {
            return;
        }

        addFiles([...event.dataTransfer.files]);
    };

    const remove = (index: number) => {
        setFiles(files.filter((_, position) => position !== index));
    };

    const zoneClasses = [
        'flex w-full flex-col items-center justify-center gap-2 rounded-lg',
        'border border-dashed px-6 py-10 text-center transition-colors',
        'outline-none',
        disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-accent/50',
        error
            ? 'border-destructive'
            : dragging
              ? 'border-ring bg-accent/50'
              : 'border-border',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
    ]
        .filter(Boolean)
        .join(' ');

    const classes = ['w-full', className].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {/*
              * A <label> wrapping the input, rather than a role="button" div:
              * it labels the input implicitly, activates it on click without
              * any handler, and avoids putting a focusable control inside
              * something that claims to be a button itself.
              */}
            <label
                className={zoneClasses}
                onDrop={handleDrop}
                onDragOver={(event) => {
                    event.preventDefault();

                    if (!disabled) {
                        setDragging(true);
                    }
                }}
                onDragLeave={() => setDragging(false)}
            >
                <IoCloudUploadOutline
                    aria-hidden="true"
                    className="size-7 text-muted-foreground"
                />

                <span className="text-sm font-medium text-foreground">
                    {label}
                </span>

                {description ? (
                    <span
                        id={descriptionId}
                        className="text-xs text-muted-foreground"
                    >
                        {description}
                    </span>
                ) : null}

                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    aria-describedby={description ? descriptionId : undefined}
                    className="sr-only"
                    onChange={(event) => {
                        addFiles([...(event.target.files ?? [])]);
                        // Allow re-picking the same file.
                        event.target.value = '';
                    }}
                />
            </label>

            {files.length ? (
                <ul className="mt-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2"
                        >
                            <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                                {file.name}
                            </span>

                            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {formatBytes(file.size)}
                            </span>

                            <button
                                type="button"
                                aria-label={`Remove ${file.name}`}
                                disabled={disabled}
                                className="shrink-0 cursor-pointer rounded-sm px-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => remove(index)}
                            >
                                <IoClose className="size-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
