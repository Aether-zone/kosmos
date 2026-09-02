import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Button,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Form,
    Input,
    Select,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Form',
    component: Form,
    tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Form className="w-full max-w-md space-y-6">
            <Field>
                <FieldLabel htmlFor="name">
                    Name
                </FieldLabel>

                <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="email">
                    Email
                </FieldLabel>

                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                />

                <FieldDescription>
                    We'll never share your email address.
                </FieldDescription>
            </Field>

            <Button type="submit">
                Submit
            </Button>
        </Form>
    ),
};

export const WithError: Story = {
    render: () => (
        <Form className="w-full max-w-md space-y-6">
            <Field>
                <FieldLabel htmlFor="email-error">
                    Email
                </FieldLabel>

                <Input
                    id="email-error"
                    name="email"
                    type="email"
                    value="invalid-email"
                    error
                    aria-invalid="true"
                    aria-describedby="email-error-message"
                    readOnly
                />

                <FieldError id="email-error-message">
                    Please enter a valid email address.
                </FieldError>
            </Field>

            <Button type="submit">
                Submit
            </Button>
        </Form>
    ),
};

export const WithSelect: Story = {
    render: () => (
        <Form className="w-full max-w-md space-y-6">
            <Field>
                <FieldLabel htmlFor="country">
                    Country
                </FieldLabel>

                <Select id="country" name="country">
                    <option value="">Select a country</option>
                    <option value="nl">Netherlands</option>
                    <option value="be">Belgium</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                </Select>

                <FieldDescription>
                    Select your country of residence.
                </FieldDescription>
            </Field>

            <Button type="submit">
                Continue
            </Button>
        </Form>
    ),
};

export const Complete: Story = {
    render: () => (
        <Form className="w-full max-w-md space-y-6">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                    Create an account
                </h2>

                <p className="text-sm text-muted-foreground">
                    Enter your details to create your account.
                </p>
            </div>

            <Field>
                <FieldLabel htmlFor="first-name">
                    First name
                </FieldLabel>

                <Input
                    id="first-name"
                    name="firstName"
                    placeholder="John"
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="last-name">
                    Last name
                </FieldLabel>

                <Input
                    id="last-name"
                    name="lastName"
                    placeholder="Doe"
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="account-email">
                    Email
                </FieldLabel>

                <Input
                    id="account-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                />

                <FieldDescription>
                    Use an email address you have access to.
                </FieldDescription>
            </Field>

            <Field>
                <FieldLabel htmlFor="account-country">
                    Country
                </FieldLabel>

                <Select id="account-country" name="country">
                    <option value="">Select a country</option>
                    <option value="nl">Netherlands</option>
                    <option value="be">Belgium</option>
                    <option value="de">Germany</option>
                </Select>
            </Field>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                    Cancel
                </Button>

                <Button type="submit">
                    Create account
                </Button>
            </div>
        </Form>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Form className="w-full max-w-md space-y-6">
            <Field>
                <FieldLabel htmlFor="disabled-name">
                    Name
                </FieldLabel>

                <Input
                    id="disabled-name"
                    name="name"
                    defaultValue="John Doe"
                    disabled
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="disabled-email">
                    Email
                </FieldLabel>

                <Input
                    id="disabled-email"
                    name="email"
                    type="email"
                    defaultValue="john@example.com"
                    disabled
                />
            </Field>

            <Button type="submit" disabled>
                Submit
            </Button>
        </Form>
    ),
};
