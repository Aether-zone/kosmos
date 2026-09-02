import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Sidenav,
    SidenavContent,
    SidenavFooter,
    SidenavGroup,
    SidenavGroupLabel,
    SidenavHeader,
    SidenavItem,
} from '@aether-zone/kosmos';

const meta = {
    title: 'Components/Sidenav',
    component: Sidenav,
    tags: ['autodocs'],
} satisfies Meta<typeof Sidenav>;

export default meta;

type Story = StoryObj<typeof meta>;

const HomeIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <path d="M9 20v-6h6v6" />
    </svg>
);

const FolderIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
);

const SettingsIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
);

export const Default: Story = {
    render: () => (
        <div className="h-96">
            <Sidenav>
                <SidenavHeader>
                    <span className="text-lg font-semibold text-foreground">
                        Kosmos
                    </span>
                </SidenavHeader>

                <SidenavContent>
                    <SidenavGroup>
                        <SidenavGroupLabel>
                            General
                        </SidenavGroupLabel>

                        <SidenavItem
                            href="#"
                            active
                            icon={<HomeIcon />}
                        >
                            Dashboard
                        </SidenavItem>

                        <SidenavItem
                            href="#"
                            icon={<FolderIcon />}
                        >
                            Projects
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>

                <SidenavFooter>
                    <SidenavItem
                        href="#"
                        icon={<SettingsIcon />}
                    >
                        Settings
                    </SidenavItem>
                </SidenavFooter>
            </Sidenav>
        </div>
    ),
};

export const MultipleGroups: Story = {
    render: () => (
        <div className="h-[500px]">
            <Sidenav>
                <SidenavHeader>
                    <span className="font-semibold text-foreground">
                        Application
                    </span>
                </SidenavHeader>

                <SidenavContent>
                    <SidenavGroup>
                        <SidenavGroupLabel>
                            Workspace
                        </SidenavGroupLabel>

                        <SidenavItem href="#" active>
                            Overview
                        </SidenavItem>

                        <SidenavItem href="#">
                            Projects
                        </SidenavItem>

                        <SidenavItem href="#">
                            Tasks
                        </SidenavItem>
                    </SidenavGroup>

                    <SidenavGroup>
                        <SidenavGroupLabel>
                            Management
                        </SidenavGroupLabel>

                        <SidenavItem href="#">
                            Team
                        </SidenavItem>

                        <SidenavItem href="#">
                            Reports
                        </SidenavItem>

                        <SidenavItem href="#">
                            Billing
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>

                <SidenavFooter>
                    <SidenavItem href="#">
                        Settings
                    </SidenavItem>
                </SidenavFooter>
            </Sidenav>
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="h-96">
            <Sidenav>
                <SidenavHeader>
                    <span className="font-semibold text-foreground">
                        Dashboard
                    </span>
                </SidenavHeader>

                <SidenavContent>
                    <SidenavGroup>
                        <SidenavGroupLabel>
                            Navigation
                        </SidenavGroupLabel>

                        <SidenavItem href="#" active icon={<HomeIcon />}>
                            Home
                        </SidenavItem>

                        <SidenavItem href="#" icon={<FolderIcon />}>
                            Files
                        </SidenavItem>

                        <SidenavItem href="#" icon={<SettingsIcon />}>
                            Settings
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>
            </Sidenav>
        </div>
    ),
};

export const CustomWidth: Story = {
    render: () => (
        <div className="h-96">
            <Sidenav className="w-80">
                <SidenavHeader>
                    <span className="font-semibold text-foreground">
                        Wide Navigation
                    </span>
                </SidenavHeader>

                <SidenavContent>
                    <SidenavGroup>
                        <SidenavGroupLabel>
                            Navigation
                        </SidenavGroupLabel>

                        <SidenavItem href="#" active>
                            Dashboard
                        </SidenavItem>

                        <SidenavItem href="#">
                            Very long navigation item that gets truncated
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>
            </Sidenav>
        </div>
    ),
};

export const Footer: Story = {
    render: () => (
        <div className="h-96">
            <Sidenav>
                <SidenavHeader>
                    <span className="font-semibold text-foreground">
                        Application
                    </span>
                </SidenavHeader>

                <SidenavContent>
                    <SidenavGroup>
                        <SidenavGroupLabel>
                            Main
                        </SidenavGroupLabel>

                        <SidenavItem href="#" active>
                            Dashboard
                        </SidenavItem>

                        <SidenavItem href="#">
                            Projects
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>

                <SidenavFooter>
                    <SidenavItem href="#">
                        Help & Support
                    </SidenavItem>

                    <SidenavItem href="#">
                        Settings
                    </SidenavItem>
                </SidenavFooter>
            </Sidenav>
        </div>
    ),
};
