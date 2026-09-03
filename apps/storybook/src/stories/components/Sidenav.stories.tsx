import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    IoFolderOutline,
    IoHomeOutline,
    IoSettingsOutline,
} from 'react-icons/io5';

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
                            icon={<IoHomeOutline />}
                        >
                            Dashboard
                        </SidenavItem>

                        <SidenavItem
                            href="#"
                            icon={<IoFolderOutline />}
                        >
                            Projects
                        </SidenavItem>
                    </SidenavGroup>
                </SidenavContent>

                <SidenavFooter>
                    <SidenavItem
                        href="#"
                        icon={<IoSettingsOutline />}
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

                        <SidenavItem href="#" active icon={<IoHomeOutline />}>
                            Home
                        </SidenavItem>

                        <SidenavItem href="#" icon={<IoFolderOutline />}>
                            Files
                        </SidenavItem>

                        <SidenavItem href="#" icon={<IoSettingsOutline />}>
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
