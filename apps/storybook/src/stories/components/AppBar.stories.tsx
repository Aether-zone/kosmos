import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
    IoNotificationsOutline,
    IoSearchOutline,
    IoSparkles,
} from 'react-icons/io5';

import {
    AppBar,
    AppBarBrand,
    AppBarSection,
    AppBarTitle,
    Avatar,
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSeparator,
    DropdownTrigger,
    Text,
    ToolbarButton,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/AppBar',
    component: AppBar,
    tags: ['autodocs'],
    argTypes: {
        position: {
            control: 'select',
            options: ['static', 'sticky', 'fixed'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        borderless: { control: 'boolean' },
        maxWidth: {
            control: 'select',
            options: ['full', 'screen-lg', 'screen-xl', 'screen-2xl'],
        },
    },
    decorators: [
        (Story) => (
            <div className="w-[52rem]">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const logo = <IoSparkles className="size-5 text-primary" />;

export const Default: Story = {
    render: (args) => (
        <AppBar {...args}>
            <AppBarSection className="flex-1">
                <AppBarBrand href="#" logo={logo}>
                    Kosmos
                </AppBarBrand>
            </AppBarSection>

            <AppBarSection>
                <Button variant="ghost" size="sm">
                    Docs
                </Button>
                <Button size="sm">Sign in</Button>
            </AppBarSection>
        </AppBar>
    ),
};

/** Brand, navigation and actions — the section holding the slack is `flex-1`. */
export const WithNavigation: Story = {
    render: (args) => (
        <AppBar {...args}>
            <AppBarSection>
                <AppBarBrand href="#" logo={logo}>
                    Kosmos
                </AppBarBrand>
            </AppBarSection>

            <AppBarSection className="flex-1 gap-1 pl-4">
                <Button variant="ghost" size="sm">Components</Button>
                <Button variant="ghost" size="sm">Tokens</Button>
                <Button variant="ghost" size="sm">Guides</Button>
            </AppBarSection>

            <AppBarSection>
                <ToolbarButton icon={<IoSearchOutline />} aria-label="Search" />
                <ToolbarButton
                    icon={<IoNotificationsOutline />}
                    aria-label="Notifications"
                />
                <Avatar size="sm" fallback="PW" />
            </AppBarSection>
        </AppBar>
    ),
};

export const WithAccountMenu: Story = {
    render: (args) => (
        <AppBar {...args}>
            <AppBarSection className="flex-1">
                <AppBarBrand href="#" logo={logo}>
                    Kosmos
                </AppBarBrand>
                <Badge size="sm" variant="secondary">
                    beta
                </Badge>
            </AppBarSection>

            <AppBarSection>
                <Dropdown>
                    <DropdownTrigger>Account</DropdownTrigger>
                    <DropdownMenu align="end">
                        <DropdownItem>Profile</DropdownItem>
                        <DropdownItem>Settings</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem destructive>Sign out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </AppBarSection>
        </AppBar>
    ),
};

/** Naming the current page rather than the product. */
export const WithPageTitle: Story = {
    render: (args) => (
        <AppBar {...args}>
            <AppBarSection className="flex-1">
                <AppBarTitle>Invoices</AppBarTitle>
            </AppBarSection>

            <AppBarSection>
                <Button size="sm">New invoice</Button>
            </AppBarSection>
        </AppBar>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {(['sm', 'md', 'lg'] as const).map((size) => (
                // Only one banner per document: a showcase is not the page's
                // header, so these opt out of the landmark.
                <AppBar key={size} size={size} role="presentation">
                    <AppBarSection className="flex-1">
                        <AppBarBrand href="#" logo={logo}>
                            Kosmos
                        </AppBarBrand>
                    </AppBarSection>
                    <AppBarSection>
                        <Text size="body-small" tone="muted">
                            {size}
                        </Text>
                    </AppBarSection>
                </AppBar>
            ))}
        </div>
    ),
};

export const Borderless: Story = {
    args: { borderless: true },
    render: Default.render,
};

/** Constrained to a centred column, as on a marketing page. */
export const ConstrainedWidth: Story = {
    args: { maxWidth: 'screen-lg' },
    render: Default.render,
};

export const Sticky: Story = {
    args: { position: 'sticky' },
    render: (args) => (
        <div className="h-64 overflow-y-auto rounded-md border border-border">
            <AppBar {...args}>
                <AppBarSection className="flex-1">
                    <AppBarBrand href="#" logo={logo}>
                        Kosmos
                    </AppBarBrand>
                </AppBarSection>
                <AppBarSection>
                    <Button size="sm">Sign in</Button>
                </AppBarSection>
            </AppBar>

            <div className="space-y-3 p-4">
                {Array.from({ length: 12 }, (_, i) => (
                    <Text key={i} tone="muted">
                        Scroll — the bar stays put. Line {i + 1}.
                    </Text>
                ))}
            </div>
        </div>
    ),
};

/**
 * The bar is a `banner` landmark, which is how a screen reader offers "skip to
 * the site header". A page should have exactly one.
 */
export const IsABannerLandmarkWithWorkingActions: Story = {
    render: WithAccountMenu.render,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const banner = canvas.getByRole('banner');
        await expect(banner.tagName).toBe('HEADER');
        await expect(
            within(banner).getByRole('link', { name: /Kosmos/ }),
        ).toBeVisible();

        // Actions inside the bar still behave like actions.
        await userEvent.click(canvas.getByRole('button', { name: /Account/ }));

        const menu = await within(document.body).findByRole('menu');
        await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3);
    },
};
