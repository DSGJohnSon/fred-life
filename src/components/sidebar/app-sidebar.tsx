"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LucideCamera,
  LucideChartColumn,
  LucideCog,
  LucideDatabase,
  LucideFileBarChart,
  LucideFileChartPie,
  LucideFileCog,
  LucideFileEdit,
  LucideFolder,
  LucideHelpCircle,
  LucideLayoutDashboard,
  LucideListChecks,
  LucideSearch,
  LucideUsers,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { UpdateWorkspaceNameForm } from "@/features/workspaces/components/forms/update-workspace-name-form";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LucideLayoutDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: LucideListChecks,
    },
    {
      title: "Analytics",
      url: "#",
      icon: LucideChartColumn,
    },
    {
      title: "Projects",
      url: "#",
      icon: LucideFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: LucideUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: LucideCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: LucideFileChartPie,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: LucideFileCog,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: LucideCog,
    },
    {
      title: "Get Help",
      url: "#",
      icon: LucideHelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: LucideSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: LucideDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: LucideFileBarChart,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: LucideFileEdit,
    },
  ],
};

export function AppSidebar({
  defaultWorkspaceId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { defaultWorkspaceId: string }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#" className="w-3/4 h-full">
                <Image
                  src="/assets/logo-full.svg"
                  alt="Logo"
                  width={1920}
                  height={1080}
                  className="object-cover w-3/4"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator className="my-3" />
          <SidebarMenuItem>
            <WorkspaceSwitcher defaultWorkspaceId={defaultWorkspaceId} />
          </SidebarMenuItem>
          <Separator className="my-3" />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
