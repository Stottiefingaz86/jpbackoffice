"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CoinsIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  MegaphoneIcon,
  PlusIcon,
  ShieldIcon,
} from "lucide-react"

import { BrandSwitcher } from "@/components/brand-switcher"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { navMain } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

const iconMap = {
  "layout-dashboard": LayoutDashboardIcon,
  coins: CoinsIcon,
  "layout-template": LayoutTemplateIcon,
  megaphone: MegaphoneIcon,
  shield: ShieldIcon,
  history: HistoryIcon,
} as const

const navItemClass =
  "h-9 rounded-md px-3 font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground focus-visible:ring-0 [&_svg]:size-[18px] [&_svg]:text-sidebar-foreground/40 data-[active=true]:[&_svg]:text-sidebar-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&_svg]:size-4"

const navGroups = [
  {
    label: "Overview",
    items: [navMain[0]],
  },
  {
    label: "Jackpots",
    items: [navMain[1], navMain[2], navMain[3]],
  },
  {
    label: "Administration",
    items: [navMain[4], navMain[5]],
  },
] as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="supabase-sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
        <BrandSwitcher />
      </SidebarHeader>

      <SidebarContent className="gap-4 px-3 py-4 group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
          <SidebarGroupContent className="group-data-[collapsible=icon]:w-full">
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  tooltip="New jackpot"
                  className={cn(
                    navItemClass,
                    "border border-sidebar-border/80 bg-sidebar-accent/40 text-sidebar-foreground group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent"
                  )}
                  render={<Link href="/jackpots/new" />}
                >
                  <PlusIcon />
                  <span className="group-data-[collapsible=icon]:hidden">New jackpot</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <div
            key={group.label}
            className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center"
          >
            {index > 0 ? (
              <SidebarSeparator className="mb-4 group-data-[collapsible=icon]:hidden" />
            ) : null}
            <SidebarGroup className="p-0 group-data-[collapsible=icon]:w-full">
              <SidebarGroupLabel className="h-auto px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent className="group-data-[collapsible=icon]:w-full">
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                  {group.items.map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive =
                      item.url === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.url)

                    return (
                      <SidebarMenuItem
                        key={item.title}
                        className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                      >
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className={navItemClass}
                          render={<Link href={item.url} />}
                        >
                          <Icon />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2">
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
