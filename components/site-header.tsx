"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleHelpIcon, PlusIcon } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jackpots": "Jackpots",
  "/jackpots/new": "Create jackpot",
  "/templates": "Templates",
  "/campaigns": "Campaigns",
  "/access": "Access Control",
  "/audit": "Audit Log",
}

export function SiteHeader() {
  const pathname = usePathname()
  const templateEditMatch = pathname.match(/^\/templates\/([^/]+)\/edit$/)
  const jackpotEditMatch = pathname.match(/^\/jackpots\/([^/]+)\/edit$/)
  const campaignEditMatch = pathname.match(/^\/campaigns\/([^/]+)\/edit$/)

  const title = pathname.startsWith("/jackpots/new")
    ? "Create jackpot"
    : pathname === "/campaigns/new"
      ? "New campaign"
      : campaignEditMatch
        ? "Edit campaign"
        : jackpotEditMatch
          ? "Configure jackpot"
          : templateEditMatch
            ? "Edit template"
            : titles[pathname] ?? "Back-Office"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/40 bg-background">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 size-7 rounded-md text-muted-foreground hover:bg-accent" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Operations
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {pathname.startsWith("/jackpots/new") ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/jackpots"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Jackpots
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : templateEditMatch ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/templates"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Templates
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : campaignEditMatch || pathname === "/campaigns/new" ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/campaigns"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Campaigns
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : jackpotEditMatch ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/jackpots"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Jackpots
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="text-muted-foreground"
                />
              }
            >
              <CircleHelpIcon className="size-4" />
              <span className="sr-only">Help</span>
            </TooltipTrigger>
            <TooltipContent>Help & documentation</TooltipContent>
          </Tooltip>
          <ModeToggle />
          {(pathname === "/dashboard" || pathname === "/jackpots") && (
            <Button
              size="sm"
              className="h-8 rounded-md bg-brand text-brand-foreground shadow-none hover:bg-brand/90"
              render={<Link href="/jackpots/new" />}
            >
              <PlusIcon data-icon="inline-start" className="size-4" />
              New jackpot
            </Button>
          )}
          {pathname === "/campaigns" && (
            <Button
              size="sm"
              className="h-8 rounded-md bg-brand text-brand-foreground shadow-none hover:bg-brand/90"
              render={<Link href="/campaigns/new" />}
            >
              <PlusIcon data-icon="inline-start" className="size-4" />
              New campaign
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
