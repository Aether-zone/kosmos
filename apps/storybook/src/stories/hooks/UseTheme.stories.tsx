import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
    Badge,
    Text,
    ToggleGroup,
    ToggleGroupItem,
    useTheme,
} from '@aether-zone/kosmos';

function Demo() {
    // Not persisted here: Storybook's own toolbar owns the theme, and a
    // remembered value would fight it.
    const { theme, resolvedTheme, setTheme } = useTheme({ storageKey: null });

    return (
        <div className="w-96 space-y-3">
            <ToggleGroup
                label="Theme"
                value={[theme]}
                onValueChange={([next]) =>
                    setTheme((next ?? 'system') as typeof theme)
                }
            >
                <ToggleGroupItem value="light">Light</ToggleGroupItem>
                <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                <ToggleGroupItem value="system">System</ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-2">
                <Text size="body-small" tone="muted">
                    chosen
                </Text>
                <Badge size="sm" variant="secondary">{theme}</Badge>

                <Text size="body-small" tone="muted">
                    resolves to
                </Text>
                <Badge size="sm">{resolvedTheme}</Badge>
            </div>

            <div className="rounded-md border border-border bg-surface p-4">
                <Text>This panel follows the resolved theme.</Text>
            </div>
        </div>
    );
}

const meta = {
    title: 'Hooks/useTheme',
    component: Demo,
    tags: ['autodocs'],
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 'system' is a distinct choice from whatever it happens to resolve to. */
export const SettingThemeTogglesTheDarkClass: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('radio', { name: 'Dark' }));
        await waitFor(() =>
            expect(document.documentElement).toHaveClass('dark'),
        );

        await userEvent.click(canvas.getByRole('radio', { name: 'Light' }));
        await waitFor(() =>
            expect(document.documentElement).not.toHaveClass('dark'),
        );
    },
};
