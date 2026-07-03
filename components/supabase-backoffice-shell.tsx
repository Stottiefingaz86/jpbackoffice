"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Plus,
  ScrollText,
  Shield,
  Trophy,
} from "lucide-react"
import * as React from "react"

import { LogoSupabase } from "@/components/logo-supabase"
import { ModeToggle } from "@/components/mode-toggle"
import { PlatformManagerTrigger } from "@/components/platform-manager-trigger"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { brandName, environment, navMain } from "@/lib/backoffice-data"

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  trophy: Trophy,
  "layout-template": LayoutTemplate,
  megaphone: Megaphone,
  shield: Shield,
  "scroll-text": ScrollText,
} as const

export function SupabaseBackofficeShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="grid h-svh overflow-hidden bg-background md:grid-cols-[auto_1fr]">
      <aside
        className={cn(
          "hidden h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex items-center gap-2 border-b px-3 py-4">
          <LogoSupabase size={20} />
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Back-Office</p>
              <p className="truncate text-xs text-muted-foreground">{brandName}</p>
            </div>
          ) : null}
        </div>

        {!collapsed ? (
          <div className="px-3 py-2">
            <span className="inline-flex rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              {environment}
            </span>
          </div>
        ) : null}

        <div className="px-2 py-3">
          <p
            className={cn(
              "mb-2 px-2 text-xs font-medium text-muted-foreground",
              collapsed && "sr-only"
            )}
          >
            Operations
          </p>
          <div className="flex flex-col gap-0.5">
            <Button
              variant="default"
              size={collapsed ? "icon-sm" : "sm"}
              className={cn(
                "justify-start bg-primary text-primary-foreground hover:bg-primary/90",
                collapsed && "mx-auto"
              )}
              render={<Link href="/jackpots/new" />}
            >
              <Plus />
              {!collapsed ? <span>New jackpot</span> : null}
            </Button>
            {navMain.map((item) => {
              const Icon = iconMap[item.icon]
              const active =
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.url)

              return (
                <Button
                  key={item.title}
                  variant={active ? "secondary" : "ghost"}
                  size={collapsed ? "icon-sm" : "sm"}
                  className={cn("justify-start", collapsed && "mx-auto")}
                  render={<Link href={item.url} />}
                >
                  <Icon className="text-muted-foreground" />
                  {!collapsed ? <span>{item.title}</span> : null}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="mt-auto border-t p-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="mb-2 w-full"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {!collapsed ? (
            <div className="flex items-center gap-2 rounded-md px-2 py-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                MA
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Maria Alvarez</p>
                <p className="truncate text-xs text-muted-foreground">
                  Casino Ops Manager
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <LogoSupabase size={16} className="md:hidden" />
            <span className="truncate text-sm font-medium text-foreground">
              {brandName}
            </span>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <span className="hidden truncate text-sm text-muted-foreground sm:inline">
              {pathname.startsWith("/jackpots/new")
                ? "Create jackpot"
                : navMain.find((item) =>
                    item.url === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.url)
                  )?.title ?? "Back-Office"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <PlatformManagerTrigger />
            <ModeToggle />
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
