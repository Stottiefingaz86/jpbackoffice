"use client"

import { ChevronsUpDownIcon, CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useBrand } from "@/contexts/brand-context"
import { brandName, brands, environment } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

function BrandAvatar({
  brand,
  className,
}: {
  brand: { initials: string; color: string }
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        className
      )}
      style={{ backgroundColor: brand.color }}
    >
      {brand.initials}
    </span>
  )
}

const triggerClass =
  "h-auto min-h-12 gap-3 rounded-lg px-2 py-2.5 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!min-h-8 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"

export function BrandSwitcher() {
  const { activeBrand, setActiveBrand } = useBrand()

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={activeBrand.name}
                className={triggerClass}
              />
            }
          >
            <BrandAvatar
              brand={activeBrand}
              className="group-data-[collapsible=icon]:!size-7"
            />
            <div className="grid min-w-0 flex-1 gap-0.5 text-left leading-none group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium">
                {activeBrand.name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/50">
                {brandName}
              </span>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-sidebar-border bg-transparent px-1.5 py-0 text-[10px] font-normal text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
            >
              Production
            </Badge>
            <ChevronsUpDownIcon className="size-4 shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64"
            side="bottom"
            align="start"
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
                {brandName}
                <span className="mx-1.5 text-sidebar-foreground/30">·</span>
                {environment}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Switch brand
              </DropdownMenuLabel>
              {brands.map((brand) => (
                <DropdownMenuItem
                  key={brand.id}
                  className="gap-2.5 px-2 py-2"
                  onClick={() => setActiveBrand(brand)}
                >
                  <BrandAvatar brand={brand} className="size-7 text-[10px]" />
                  <span className="flex-1 truncate">{brand.name}</span>
                  {activeBrand.id === brand.id ? (
                    <CheckIcon className="size-4 text-brand" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
