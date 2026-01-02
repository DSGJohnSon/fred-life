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
  LuCog,
  LuLayoutDashboard,
  LuDollarSign,
  LuClock,
} from "react-icons/lu";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const workspaceId = useWorkspaceId();
  
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/workspaces/${workspaceId}/dashboard`,
        icon: LuLayoutDashboard,
      },
      {
        title: "Finances Perso.",
        url: `/workspaces/${workspaceId}/finance`,
        icon: LuDollarSign,
      }
    ],
    navSecondary: [
      {
        title: "Paramètres",
        url: `/workspaces/${workspaceId}/settings`,
        icon: LuCog,
      },
      {
        title: "Historique du Workspace",
        url: `/workspaces/${workspaceId}/history`,
        icon: LuClock,
      }
    ]
  };

  const { data: user, isLoading: isLoadingUser } = useCurrent();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={`/workspaces/${workspaceId}/dashboard`} className="w-3/4 h-full">
                <Image
                  src="/assets/logo-full.svg"
                  alt="Logo"
                  width={1920}
                  height={1080}
                  className="object-cover w-3/4"
                  loading="eager"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator className="my-3" />
          <SidebarMenuItem>
            <WorkspaceSwitcher />
          </SidebarMenuItem>
          <Separator className="my-3" />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user == undefined || user == null ? null : (
          <NavUser
            user={{
              ...user,
              image: user.image ?? null, // Convert undefined to null
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
