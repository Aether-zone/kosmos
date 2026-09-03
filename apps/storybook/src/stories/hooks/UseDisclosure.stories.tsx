import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    Text,
    useDisclosure,
} from '@aether-zone/kosmos';

function Demo() {
    const filters = useDisclosure();

    return (
        <div className="space-y-3">
            <Button onClick={filters.onOpen}>Open drawer</Button>

            <Text size="body-small" tone="muted">
                open: <strong className="text-foreground">{String(filters.open)}</strong>
            </Text>

            <Drawer open={filters.open} onOpenChange={filters.setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <Button variant="outline" onClick={filters.onClose}>
                            Close from inside
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

const meta = {
    title: 'Hooks/useDisclosure',
    component: Demo,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpensAndCloses: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));

        const drawer = await within(document.body).findByRole('dialog');

        await userEvent.click(
            within(drawer).getByRole('button', { name: 'Close from inside' }),
        );

        await expect(document.body.querySelector('[role="dialog"]')).toBeNull();
        await expect(canvasElement.textContent).toContain('open: false');
    },
};
