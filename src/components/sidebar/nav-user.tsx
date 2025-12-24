"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/features/auth/api/use-logout";
import { User } from "@prisma/client";
import {
  LucideBell,
  LucideCreditCard,
  LucideLoader,
  LucideLogOut,
  LucideMoreVertical,
  LucideUserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const router = useRouter(); 

  const { mutate: logout, isPending: isPendingLogout } = useLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="rounded-lg">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 3)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <LucideMoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <LucideUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <LucideBell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                logout()
                router.push("/login")
              }}
              disabled={isPendingLogout}
            >
              {
                isPendingLogout ? (
                  <>
                  <LucideLoader className="animate-spin" />
                  <span>Redirection...</span>
                  </>
                ) : (
                  <>
                    <LucideLogOut />
                    Se déconnecter
                  </>
                )
              }
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
