"use client"

import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconType } from "react-icons/lib"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: IconType
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {(item.url && item.url !== "#") ? (
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={
                    pathname === item.url
                      ? "bg-stone-300 hover:bg-stone-300/90 active:bg-stone-300/90 duration-200 ease-linear"
                      : ""
                  }
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton tooltip={item.title} className="cursor-default">
                  <>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
