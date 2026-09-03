import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUpload } from '@aether-zone/kosmos';

const meta = {
    title: 'Components/FileUpload',
    component: FileUpload,
    tags: ['autodocs'],
    argTypes: {
        multiple: {
            control: 'boolean',
        },
        error: {
            control: 'boolean',
        },
        disabled: {
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
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
    args: {
        description: 'PNG, JPG or PDF up to 5 MB',
    },
};

export const Multiple: Story = {
    args: {
        multiple: true,
        description: 'Attach as many files as you need',
    },
};

export const RestrictedTypes: Story = {
    args: {
        accept: 'image/*',
        description: 'Images only',
    },
};

export const WithMaxSize: Story = {
    args: {
        maxSize: 1024 * 1024,
        description: 'Up to 1 MB per file',
    },
};

export const CustomLabel: Story = {
    args: {
        label: 'Drop your résumé here',
        description: 'PDF only',
        accept: '.pdf',
    },
};

export const Error: Story = {
    args: {
        error: true,
        description: 'This field is required',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        description: 'Uploading is unavailable right now',
    },
};

function ControlledFileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [rejected, setRejected] = useState<string | null>(null);

    return (
        <div className="space-y-3">
            <FileUpload
                multiple
                maxSize={1024 * 1024}
                description="Up to 1 MB per file"
                files={files}
                onFilesChange={(next) => {
                    setFiles(next);
                    setRejected(null);
                }}
                onReject={(rejectedFiles, reason) =>
                    setRejected(
                        `${rejectedFiles.length} file(s) rejected (${reason})`,
                    )
                }
            />

            <p className="text-sm text-muted-foreground">
                {rejected ?? `${files.length} file(s) selected`}
            </p>
        </div>
    );
}

export const Controlled: Story = {
    render: () => <ControlledFileUpload />,
};
