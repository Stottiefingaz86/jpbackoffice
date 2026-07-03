"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  MegaphoneIcon,
  PlusIcon,
  ScrollTextIcon,
  ShieldIcon,
  TrophyIcon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { brandName, environment, navMain } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

const iconMap = {
  "layout-dashboard": LayoutDashboardIcon,
  trophy: TrophyIcon,
  "layout-template": LayoutTemplateIcon,
  megaphone: MegaphoneIcon,
  shield: ShieldIcon,
  "scroll-text": ScrollTextIcon,
} as const

const navItemClass =
  "h-8 rounded-md px-2 font-normal text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground focus-visible:ring-0 [&_svg]:text-sidebar-foreground/40 data-[active=true]:[&_svg]:text-sidebar-foreground"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="supabase-sidebar" {...props}>
      <SidebarHeader className="gap-3 border-b border-sidebar-border px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-md outline-none group-data-[collapsible=icon]:justify-center"
        >
          <span className="hidden size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-xs font-semibold group-data-[collapsible=icon]:flex">
            BO
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium leading-none">Back-Office</p>
            <p className="truncate pt-1 text-xs text-sidebar-foreground/60">
              {brandName}
            </p>
          </div>
        </Link>
        <p className="px-0.5 text-[11px] text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">
          {environment}
        </p>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-auto px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/40">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New jackpot"
                  className={cn(
                    navItemClass,
                    "border border-sidebar-border/80 bg-sidebar-accent/30 text-sidebar-foreground/80"
                  )}
                  render={<Link href="/jackpots/new" />}
                >
                  <PlusIcon className="size-4" />
                  <span>New jackpot</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {navMain.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={navItemClass}
                      render={<Link href={item.url} />}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser
          user={{
            name: "Maria Alvarez",
            email: "Casino Ops Manager",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
