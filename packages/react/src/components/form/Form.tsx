import type {
    FormHTMLAttributes,
    HTMLAttributes,
    ReactNode,
} from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> { }

export interface FieldProps extends HTMLAttributes<HTMLDivElement> { }

export interface FieldLabelProps
    extends HTMLAttributes<HTMLLabelElement> { }

export interface FieldDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> { }

export interface FieldErrorProps
    extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode;
}

const fieldStyles = 'space-y-2';

const labelStyles =
    'text-sm font-medium leading-none text-foreground';

const descriptionStyles =
    'text-sm text-muted-foreground';

const errorStyles =
    'text-sm font-medium text-destructive';

export function Form({
    className,
    ...props
}: FormProps) {
    const classes = [className].filter(Boolean).join(' ');

    return <form className={classes} {...props} />;
}

export function Field({
    className,
    ...props
}: FieldProps) {
    const classes = [fieldStyles, className]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} {...props} />;
}

export function FieldLabel({
    className,
    ...props
}: FieldLabelProps) {
    const classes = [labelStyles, className]
        .filter(Boolean)
        .join(' ');

    return <label className={classes} {...props} />;
}

export function FieldDescription({
    className,
    ...props
}: FieldDescriptionProps) {
    const classes = [descriptionStyles, className]
        .filter(Boolean)
        .join(' ');

    return <p className={classes} {...props} />;
}

export function FieldError({
    className,
    ...props
}: FieldErrorProps) {
    const classes = [errorStyles, className]
        .filter(Boolean)
        .join(' ');

    return (
        <p
            role="alert"
            aria-live="polite"
            className={classes}
            {...props}
        />
    );
}
